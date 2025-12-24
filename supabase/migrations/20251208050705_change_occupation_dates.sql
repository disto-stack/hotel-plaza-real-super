-- Migration: change_occupation_dates_to_timestamp
-- Description: Changes occupation check-in/check-out from separate DATE + TIME columns to TIMESTAMP columns

-- ============================================================================
-- Step 1: Add new TIMESTAMP columns
-- ============================================================================
ALTER TABLE public.occupations
    ADD COLUMN check_in_datetime TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    ADD COLUMN check_out_datetime TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW();

-- ============================================================================
-- Step 2: Migrate existing data (combine DATE + TIME into TIMESTAMP)
-- ============================================================================
UPDATE public.occupations
SET 
    check_in_datetime = (check_in_date + check_in_time)::TIMESTAMP WITH TIME ZONE,
    check_out_datetime = (check_out_date + check_out_time)::TIMESTAMP WITH TIME ZONE;

-- ============================================================================
-- Step 3: Drop the old constraint that uses DATE + TIME
-- ============================================================================
ALTER TABLE public.occupations
    DROP CONSTRAINT IF EXISTS chk_checkout_after_checkin;

-- ============================================================================
-- Step 4: Drop old columns
-- ============================================================================
ALTER TABLE public.occupations
    DROP COLUMN check_in_date,
    DROP COLUMN check_in_time,
    DROP COLUMN check_out_date,
    DROP COLUMN check_out_time;

-- ============================================================================
-- Step 5: Add new constraint using TIMESTAMP
-- ============================================================================
ALTER TABLE public.occupations
    ADD CONSTRAINT chk_checkout_after_checkin 
        CHECK (check_out_datetime > check_in_datetime);

-- ============================================================================
-- Step 6: Drop and recreate indexes that used the old columns
-- ============================================================================
DROP INDEX IF EXISTS public.idx_occupations_dates;
DROP INDEX IF EXISTS public.idx_occupations_active;

CREATE INDEX idx_occupations_dates ON public.occupations(check_in_datetime, check_out_datetime);
CREATE INDEX idx_occupations_active ON public.occupations(room_id, status, check_in_datetime, check_out_datetime) 
    WHERE deleted_at IS NULL;

-- ============================================================================
-- Step 7: Update function: update_room_status_from_occupations
-- ============================================================================
CREATE OR REPLACE FUNCTION update_room_status_from_occupations()
RETURNS TRIGGER AS $$
DECLARE
    affected_room_id UUID;
    has_active_occupation BOOLEAN;
    has_future_reservation BOOLEAN;
BEGIN
    affected_room_id := COALESCE(NEW.room_id, OLD.room_id);
    
    SELECT EXISTS(
        SELECT 1 
        FROM public.occupations o
        WHERE o.room_id = affected_room_id
        AND o.status IN ('checked_in', 'reserved')
        AND o.deleted_at IS NULL
        AND (
            o.check_in_datetime <= CURRENT_TIMESTAMP
            AND
            o.check_out_datetime > CURRENT_TIMESTAMP
        )
    ) INTO has_active_occupation;
    
    SELECT EXISTS(
        SELECT 1 
        FROM public.occupations o
        WHERE o.room_id = affected_room_id
        AND o.status = 'reserved'
        AND o.deleted_at IS NULL
        AND (
            o.check_in_datetime > CURRENT_TIMESTAMP
        )
    ) INTO has_future_reservation;
    
    IF has_active_occupation THEN
        UPDATE public.rooms 
        SET status = 'occupied'
        WHERE id = affected_room_id
        AND status != 'out_of_order';
    ELSE
        IF has_future_reservation THEN
            UPDATE public.rooms 
            SET status = 'available'
            WHERE id = affected_room_id
            AND status = 'occupied'
            AND status != 'out_of_order';
        ELSE
            UPDATE public.rooms 
            SET status = 'available'
            WHERE id = affected_room_id
            AND status != 'out_of_order';
        END IF;
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- Step 8: Update function: validate_no_occupation_overlap
-- ============================================================================
CREATE OR REPLACE FUNCTION validate_no_occupation_overlap()
RETURNS TRIGGER AS $$
DECLARE
    overlap_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO overlap_count
    FROM public.occupations o
    WHERE o.room_id = NEW.room_id
    AND o.id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::UUID)
    AND o.status IN ('reserved', 'checked_in')
    AND o.deleted_at IS NULL
    AND (
        NEW.check_in_datetime < o.check_out_datetime
        AND
        NEW.check_out_datetime > o.check_in_datetime
    );
    
    IF overlap_count > 0 THEN
        RAISE EXCEPTION 'Room is already occupied or reserved for this time period. Overlap detected with % existing occupation(s)', overlap_count;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- Step 9: Update function: calculate_suggested_price
-- ============================================================================
CREATE OR REPLACE FUNCTION calculate_suggested_price(
    p_room_id UUID,
    p_stay_type stay_type,
    p_check_in_datetime TIMESTAMP WITH TIME ZONE,
    p_check_out_datetime TIMESTAMP WITH TIME ZONE,
    p_number_of_guests INTEGER
)
RETURNS DECIMAL(10, 2) AS $$
DECLARE
    room_record RECORD;
    hours_diff INTEGER;
    nights_diff INTEGER;
    suggested_price DECIMAL(10, 2);
BEGIN
    SELECT 
        price_per_night, 
        price_per_hour, 
        capacity, 
        extra_person_charge_per_night
    INTO room_record
    FROM public.rooms
    WHERE id = p_room_id 
    AND deleted_at IS NULL;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Room not found';
    END IF;
    
    IF p_stay_type = 'hourly' THEN
        hours_diff := EXTRACT(EPOCH FROM (p_check_out_datetime - p_check_in_datetime)) / 3600;
        hours_diff := CEIL(hours_diff);
        suggested_price := room_record.price_per_hour * hours_diff;
    ELSE 
        nights_diff := (p_check_out_datetime::DATE - p_check_in_datetime::DATE);
        
        IF nights_diff < 1 THEN
            nights_diff := 1;
        END IF;
        
        suggested_price := room_record.price_per_night * nights_diff;
        
        IF p_number_of_guests > room_record.capacity THEN
            suggested_price := suggested_price + 
                (room_record.extra_person_charge_per_night * 
                 (p_number_of_guests - room_record.capacity) * 
                 nights_diff);
        END IF;
    END IF;
    
    RETURN suggested_price;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- Step 10: Update function: auto_update_expired_occupations
-- ============================================================================
CREATE OR REPLACE FUNCTION auto_update_expired_occupations()
RETURNS INTEGER AS $$
DECLARE
    updated_count INTEGER;
BEGIN
    UPDATE public.occupations
    SET 
        status = 'checked_out',
        updated_at = NOW(),
        updated_by = NULL
    WHERE status IN ('checked_in', 'reserved')
    AND check_out_datetime <= CURRENT_TIMESTAMP
    AND deleted_at IS NULL;
    
    GET DIAGNOSTICS updated_count = ROW_COUNT;
    
    RETURN updated_count;
END;
$$ LANGUAGE plpgsql;
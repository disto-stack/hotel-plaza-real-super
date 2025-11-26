-- Migration: create_occupation_functions
-- Description: Creates all functions for the occupation system

-- ============================================================================
-- Function 1: Update room status based on active occupations
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
            (o.check_in_date < CURRENT_DATE OR 
             (o.check_in_date = CURRENT_DATE AND o.check_in_time <= CURRENT_TIME))
            AND
            (o.check_out_date > CURRENT_DATE OR 
             (o.check_out_date = CURRENT_DATE AND o.check_out_time > CURRENT_TIME))
        )
    ) INTO has_active_occupation;
    
    SELECT EXISTS(
        SELECT 1 
        FROM public.occupations o
        WHERE o.room_id = affected_room_id
        AND o.status = 'reserved'
        AND o.deleted_at IS NULL
        AND (
            o.check_in_date > CURRENT_DATE OR 
            (o.check_in_date = CURRENT_DATE AND o.check_in_time > CURRENT_TIME)
        )
    ) INTO has_future_reservation;
    
    IF has_active_occupation THEN
        UPDATE public.rooms 
        SET status = 'occupied'
        WHERE id = affected_room_id
        AND status != 'out_of_order';
    ELSIF NOT has_future_reservation THEN
        UPDATE public.rooms 
        SET status = 'available'
        WHERE id = affected_room_id
        AND status != 'out_of_order';
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- Function 2: Log status changes to history table
-- Note: SECURITY DEFINER is required so the trigger can insert records into
-- occupation_status_history table which has RLS enabled but no INSERT policy
-- (history should only be created by the system, not by users directly)
-- ============================================================================
CREATE OR REPLACE FUNCTION log_occupation_status_change()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        INSERT INTO public.occupation_status_history (
            occupation_id,
            previous_status,
            new_status,
            changed_by,
            reason
        ) VALUES (
            NEW.id,
            OLD.status,
            NEW.status,
            NEW.updated_by,
            NULL -- Can be set manually if needed
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- Function 3: Validate no overlapping occupations
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
        (NEW.check_in_date, NEW.check_in_time) < (o.check_out_date, o.check_out_time)
        AND
        (NEW.check_out_date, NEW.check_out_time) > (o.check_in_date, o.check_in_time)
    );
    
    IF overlap_count > 0 THEN
        RAISE EXCEPTION 'Room is already occupied or reserved for this time period. Overlap detected with % existing occupation(s)', overlap_count;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- Function 4: Validate that occupation has at least one primary guest
-- ============================================================================
CREATE OR REPLACE FUNCTION validate_occupation_has_primary_guest()
RETURNS TRIGGER AS $$
DECLARE
    primary_guest_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO primary_guest_count
    FROM public.occupation_guests
    WHERE occupation_id = COALESCE(NEW.occupation_id, OLD.occupation_id)
    AND is_primary = TRUE;
    
    IF primary_guest_count = 0 THEN
        RAISE EXCEPTION 'Occupation must have at least one primary guest';
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- Function 5: Calculate suggested price (optional helper)
-- ============================================================================
CREATE OR REPLACE FUNCTION calculate_suggested_price(
    p_room_id UUID,
    p_stay_type stay_type,
    p_check_in_date DATE,
    p_check_in_time TIME,
    p_check_out_date DATE,
    p_check_out_time TIME,
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
        hours_diff := EXTRACT(EPOCH FROM (
            (p_check_out_date + p_check_out_time)::TIMESTAMP - 
            (p_check_in_date + p_check_in_time)::TIMESTAMP
        )) / 3600;
        
        hours_diff := CEIL(hours_diff);
        
        suggested_price := room_record.price_per_hour * hours_diff;
    ELSE 
        nights_diff := p_check_out_date - p_check_in_date;
        
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
-- Function 6: Auto-update expired occupations (optional maintenance)
-- ============================================================================
CREATE OR REPLACE FUNCTION auto_update_expired_occupations()
RETURNS INTEGER AS $$
DECLARE
    updated_count INTEGER;
BEGIN
    UPDATE public.occupations
    SET 
        status = 'checked_out',
        updated_at = NOW()
    WHERE status IN ('checked_in', 'reserved')
    AND (
        check_out_date < CURRENT_DATE
        OR 
        (check_out_date = CURRENT_DATE AND check_out_time <= CURRENT_TIME)
    )
    AND deleted_at IS NULL;
    
    GET DIAGNOSTICS updated_count = ROW_COUNT;
    
    RETURN updated_count;
END;
$$ LANGUAGE plpgsql;
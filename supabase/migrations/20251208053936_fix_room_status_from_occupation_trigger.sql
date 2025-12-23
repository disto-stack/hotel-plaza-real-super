-- Migration: fix_room_status_from_occupation_trigger
-- Description: Fixes the update_room_status_from_occupations function to correctly update room status when reservations are created

CREATE OR REPLACE FUNCTION update_room_status_from_occupations()
RETURNS TRIGGER AS $$
DECLARE
    affected_room_id UUID;
    has_active_occupation BOOLEAN;
    has_future_reservation BOOLEAN;
    current_ts TIMESTAMP WITH TIME ZONE;
    new_occupation_is_active BOOLEAN := FALSE;
BEGIN
    affected_room_id := COALESCE(NEW.room_id, OLD.room_id);
    current_ts := CURRENT_TIMESTAMP;
    
    IF TG_OP != 'DELETE' AND NEW IS NOT NULL THEN
        IF NEW.deleted_at IS NULL 
           AND NEW.check_out_datetime > current_ts
           AND (
               NEW.status = 'checked_in'
               OR (NEW.status = 'reserved' AND NEW.check_in_datetime <= current_ts)
           ) THEN
            new_occupation_is_active := TRUE;
        END IF;
    END IF;
    
    SELECT EXISTS(
        SELECT 1 
        FROM public.occupations o
        WHERE o.room_id = affected_room_id
        AND o.deleted_at IS NULL
        AND o.check_out_datetime > current_ts
        AND (
            o.status = 'checked_in'
            OR
            (o.status = 'reserved' AND o.check_in_datetime <= current_ts)
        )
    ) INTO has_active_occupation;
    
    IF new_occupation_is_active THEN
        has_active_occupation := TRUE;
    END IF;
    
    SELECT EXISTS(
        SELECT 1 
        FROM public.occupations o
        WHERE o.room_id = affected_room_id
        AND o.status = 'reserved'
        AND o.deleted_at IS NULL
        AND o.check_in_datetime > current_ts
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
-- Migration: create_occupation_triggers
-- Description: Creates all triggers for the occupation system

-- ============================================================================
-- Trigger 1: Update room status when occupations change
-- ============================================================================
CREATE TRIGGER trigger_update_room_status_on_occupation
    AFTER INSERT OR UPDATE OR DELETE ON public.occupations
    FOR EACH ROW
    EXECUTE FUNCTION update_room_status_from_occupations();

-- ============================================================================
-- Trigger 2: Log status changes to history
-- ============================================================================
CREATE TRIGGER trigger_log_occupation_status_change
    AFTER UPDATE ON public.occupations
    FOR EACH ROW
    WHEN (OLD.status IS DISTINCT FROM NEW.status)
    EXECUTE FUNCTION log_occupation_status_change();

-- ============================================================================
-- Trigger 3: Validate no overlapping occupations
-- ============================================================================
CREATE TRIGGER trigger_validate_no_overlap
    BEFORE INSERT OR UPDATE ON public.occupations
    FOR EACH ROW
    WHEN (
        -- Only validate for active statuses
        NEW.status IN ('reserved', 'checked_in')
        AND NEW.deleted_at IS NULL
    )
    EXECUTE FUNCTION validate_no_occupation_overlap();

-- ============================================================================
-- Trigger 4: Validate primary guest exists (after occupation_guests changes)
-- ============================================================================
CREATE TRIGGER trigger_validate_primary_guest_after_insert
    AFTER INSERT ON public.occupation_guests
    FOR EACH ROW
    EXECUTE FUNCTION validate_occupation_has_primary_guest();

CREATE TRIGGER trigger_validate_primary_guest_after_update
    AFTER UPDATE ON public.occupation_guests
    FOR EACH ROW
    WHEN (OLD.is_primary IS DISTINCT FROM NEW.is_primary)
    EXECUTE FUNCTION validate_occupation_has_primary_guest();

CREATE TRIGGER trigger_validate_primary_guest_after_delete
    AFTER DELETE ON public.occupation_guests
    FOR EACH ROW
    EXECUTE FUNCTION validate_occupation_has_primary_guest();
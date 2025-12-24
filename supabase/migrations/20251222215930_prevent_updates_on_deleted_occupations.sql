-- Migration: prevent_updates_on_deleted_occupations
-- Description: Prevents updates on deleted occupations at database level using triggers

-- ============================================================================
-- Function: Prevent updates on deleted occupations
-- ============================================================================
CREATE OR REPLACE FUNCTION prevent_updates_on_deleted_occupations()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.deleted_at IS NOT NULL THEN
        IF NEW.deleted_at IS NULL THEN
            RETURN NEW;
        ELSE
            RAISE EXCEPTION 'Cannot update a deleted occupation. Occupation with id % was deleted at %', 
                OLD.id, OLD.deleted_at;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- Trigger: Prevent updates on deleted occupations
-- ============================================================================
CREATE TRIGGER trigger_prevent_updates_on_deleted_occupations
    BEFORE UPDATE ON public.occupations
    FOR EACH ROW
    WHEN (OLD.deleted_at IS NOT NULL)
    EXECUTE FUNCTION prevent_updates_on_deleted_occupations();
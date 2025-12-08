-- Migration: log_initial_occupation_status
-- Description: Updates the log_occupation_status_change function to also log the initial status when an occupation is created (INSERT)

CREATE OR REPLACE FUNCTION log_occupation_status_change()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO public.occupation_status_history (
            occupation_id,
            previous_status,
            new_status,
            changed_by,
            reason
        ) VALUES (
            NEW.id,
            NULL,
            NEW.status,
            NEW.created_by,
            NULL
        );
    ELSIF TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status THEN
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
            NULL
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER trigger_log_occupation_status_change_on_insert
    AFTER INSERT ON public.occupations
    FOR EACH ROW
    EXECUTE FUNCTION log_occupation_status_change();

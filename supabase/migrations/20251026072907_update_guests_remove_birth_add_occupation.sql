ALTER TABLE guests DROP CONSTRAINT IF EXISTS chk_guests_date_of_birth;

ALTER TABLE guests DROP COLUMN IF EXISTS date_of_birth;

ALTER TABLE guests ADD COLUMN occupation VARCHAR(100);

CREATE INDEX IF NOT EXISTS idx_guests_occupation ON guests(occupation);

DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'guests' AND column_name = 'date_of_birth'
    ) THEN
        RAISE EXCEPTION 'date_of_birth column still exists';
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'guests' AND column_name = 'occupation'
    ) THEN
        RAISE EXCEPTION 'occupation column was not added';
    END IF;
    
    RAISE NOTICE 'Migration completed successfully - date_of_birth removed, occupation added';
END $$;
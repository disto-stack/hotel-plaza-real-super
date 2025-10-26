CREATE TABLE guests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20),
    document_type VARCHAR(20) DEFAULT 'National ID',
    document_number VARCHAR(50) NOT NULL,
    date_of_birth DATE NOT NULL,
    nationality VARCHAR(100) DEFAULT 'Colombiana',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_guests_email ON guests(email);
CREATE INDEX idx_guests_phone ON guests(phone);
CREATE INDEX idx_guests_document ON guests(document_type, document_number);
CREATE INDEX idx_guests_name ON guests(first_name, last_name);
CREATE INDEX idx_guests_nationality ON guests(nationality);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_guests_updated_at 
    BEFORE UPDATE ON guests
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE guests ADD CONSTRAINT chk_guests_email_format 
    CHECK (email IS NULL OR email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');


ALTER TABLE guests ADD CONSTRAINT chk_guests_document_type 
    CHECK (document_type IN ('Passport', 'National ID', 'Identity Card', 'Citizenship Card'));

ALTER TABLE guests ADD CONSTRAINT chk_guests_date_of_birth 
    CHECK (date_of_birth IS NULL OR date_of_birth <= CURRENT_DATE);
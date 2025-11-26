-- Migration: create_occupations_table
-- Description: Creates the main occupations table (pure intermediate table between rooms and guests)

CREATE TABLE public.occupations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    room_id UUID NOT NULL REFERENCES public.rooms(id) ON DELETE RESTRICT,
    
    check_in_date DATE NOT NULL,
    check_in_time TIME NOT NULL,
    check_out_date DATE NOT NULL,
    check_out_time TIME NOT NULL,
    
    stay_type stay_type NOT NULL DEFAULT 'nightly',
    
    number_of_guests INTEGER NOT NULL CHECK (number_of_guests > 0),
    
    total_price DECIMAL(10, 2) NOT NULL CHECK (total_price >= 0),
    base_price DECIMAL(10, 2),
    discount_amount DECIMAL(10, 2) DEFAULT 0 CHECK (discount_amount >= 0),
    
    status occupation_status NOT NULL DEFAULT 'reserved',
    
    notes TEXT,
    
    created_by UUID REFERENCES public.users(id),
    updated_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    
    CONSTRAINT chk_checkout_after_checkin 
        CHECK (
            check_out_date > check_in_date 
            OR 
            (check_out_date = check_in_date AND check_out_time > check_in_time)
        )
);

CREATE INDEX idx_occupations_room_id ON public.occupations(room_id);
CREATE INDEX idx_occupations_status ON public.occupations(status);
CREATE INDEX idx_occupations_dates ON public.occupations(check_in_date, check_out_date);
CREATE INDEX idx_occupations_active ON public.occupations(room_id, status, check_in_date, check_out_date) 
    WHERE deleted_at IS NULL;
CREATE INDEX idx_occupations_deleted_at ON public.occupations(deleted_at);
CREATE INDEX idx_occupations_created_by ON public.occupations(created_by);
CREATE INDEX idx_occupations_updated_by ON public.occupations(updated_by);

CREATE TRIGGER update_occupations_updated_at
    BEFORE UPDATE ON public.occupations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
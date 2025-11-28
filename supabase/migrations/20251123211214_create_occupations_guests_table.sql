-- Migration: create_occupation_guests_table
-- Description: Creates the many-to-many relationship table between occupations and guests

CREATE TABLE public.occupation_guests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    occupation_id UUID NOT NULL REFERENCES public.occupations(id) ON DELETE CASCADE,
    guest_id UUID NOT NULL REFERENCES public.guests(id) ON DELETE RESTRICT,
    
    is_primary BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT uq_occupation_guest UNIQUE (occupation_id, guest_id)
);

CREATE INDEX idx_occupation_guests_occupation_id ON public.occupation_guests(occupation_id);
CREATE INDEX idx_occupation_guests_guest_id ON public.occupation_guests(guest_id);
CREATE INDEX idx_occupation_guests_primary ON public.occupation_guests(occupation_id, is_primary) 
    WHERE is_primary = TRUE;

CREATE UNIQUE INDEX idx_one_primary_guest_per_occupation 
    ON public.occupation_guests(occupation_id) 
    WHERE is_primary = TRUE;
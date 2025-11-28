-- Migration: create_occupation_status_history_table
-- Description: Creates the audit table to track all status changes in occupations

CREATE TABLE public.occupation_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    occupation_id UUID NOT NULL REFERENCES public.occupations(id) ON DELETE CASCADE,
    
    previous_status occupation_status,
    new_status occupation_status NOT NULL,
    
    changed_by UUID REFERENCES public.users(id),
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    reason TEXT,
    
    CONSTRAINT chk_status_changed 
        CHECK (previous_status IS DISTINCT FROM new_status)
);

CREATE INDEX idx_occupation_history_occupation_id ON public.occupation_status_history(occupation_id);
CREATE INDEX idx_occupation_history_changed_at ON public.occupation_status_history(changed_at);
CREATE INDEX idx_occupation_history_new_status ON public.occupation_status_history(new_status);
CREATE INDEX idx_occupation_history_changed_by ON public.occupation_status_history(changed_by);

CREATE INDEX idx_occupation_history_occupation_date ON public.occupation_status_history(occupation_id, changed_at DESC);
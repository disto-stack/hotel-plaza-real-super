-- Migration: enable_rls_policies_for_occupations
-- Description: Enables Row Level Security and creates policies for occupation tables

ALTER TABLE public.occupations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff can view all occupations" 
ON public.occupations FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.users 
        WHERE id = (SELECT auth.uid()) 
        AND role IN ('admin'::user_role, 'receptionist'::user_role)
    )
    AND deleted_at IS NULL
);

CREATE POLICY "Staff can insert occupations" 
ON public.occupations FOR INSERT 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.users 
        WHERE id = (SELECT auth.uid()) 
        AND role IN ('admin'::user_role, 'receptionist'::user_role)
    )
);

CREATE POLICY "Staff can update occupations" 
ON public.occupations FOR UPDATE 
USING (
    EXISTS (
        SELECT 1 FROM public.users 
        WHERE id = (SELECT auth.uid()) 
        AND role IN ('admin'::user_role, 'receptionist'::user_role)
    )
    AND deleted_at IS NULL
);

CREATE POLICY "Only admins can delete occupations" 
ON public.occupations FOR DELETE 
USING (
    EXISTS (
        SELECT 1 FROM public.users 
        WHERE id = (SELECT auth.uid()) 
        AND role = 'admin'::user_role
    )
    AND deleted_at IS NULL
);

ALTER TABLE public.occupation_guests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff can view all occupation guests" 
ON public.occupation_guests FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.users 
        WHERE id = (SELECT auth.uid()) 
        AND role IN ('admin'::user_role, 'receptionist'::user_role)
    )
    AND EXISTS (
        SELECT 1 FROM public.occupations
        WHERE id = occupation_guests.occupation_id
        AND deleted_at IS NULL
    )
);

CREATE POLICY "Staff can insert occupation guests" 
ON public.occupation_guests FOR INSERT 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.users 
        WHERE id = (SELECT auth.uid()) 
        AND role IN ('admin'::user_role, 'receptionist'::user_role)
    )
    AND EXISTS (
        SELECT 1 FROM public.occupations
        WHERE id = occupation_guests.occupation_id
        AND deleted_at IS NULL
    )
);

CREATE POLICY "Staff can update occupation guests" 
ON public.occupation_guests FOR UPDATE 
USING (
    EXISTS (
        SELECT 1 FROM public.users 
        WHERE id = (SELECT auth.uid()) 
        AND role IN ('admin'::user_role, 'receptionist'::user_role)
    )
    AND EXISTS (
        SELECT 1 FROM public.occupations
        WHERE id = occupation_guests.occupation_id
        AND deleted_at IS NULL
    )
);

CREATE POLICY "Staff can delete occupation guests" 
ON public.occupation_guests FOR DELETE 
USING (
    EXISTS (
        SELECT 1 FROM public.users 
        WHERE id = (SELECT auth.uid()) 
        AND role IN ('admin'::user_role, 'receptionist'::user_role)
    )
    AND EXISTS (
        SELECT 1 FROM public.occupations
        WHERE id = occupation_guests.occupation_id
        AND deleted_at IS NULL
    )
);

ALTER TABLE public.occupation_status_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff can view all occupation status history" 
ON public.occupation_status_history FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.users 
        WHERE id = (SELECT auth.uid()) 
        AND role IN ('admin'::user_role, 'receptionist'::user_role)
    )
    AND EXISTS (
        SELECT 1 FROM public.occupations
        WHERE id = occupation_status_history.occupation_id
        AND deleted_at IS NULL
    )
);


CREATE POLICY "System can insert occupation status history" 
ON public.occupation_status_history FOR INSERT 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.users 
        WHERE id = (SELECT auth.uid()) 
        AND role IN ('admin'::user_role, 'receptionist'::user_role)
    )
);

CREATE POLICY "Only admins can update occupation status history" 
ON public.occupation_status_history FOR UPDATE 
USING (
    EXISTS (
        SELECT 1 FROM public.users 
        WHERE id = (SELECT auth.uid()) 
        AND role = 'admin'::user_role
    )
);

CREATE POLICY "Only admins can delete occupation status history" 
ON public.occupation_status_history FOR DELETE 
USING (
    EXISTS (
        SELECT 1 FROM public.users 
        WHERE id = (SELECT auth.uid()) 
        AND role = 'admin'::user_role
    )
);
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff can view all guests" 
ON public.guests FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.users 
        WHERE id = (SELECT auth.uid()) 
        AND role IN ('admin'::user_role, 'receptionist'::user_role)
    )
);

CREATE POLICY "Staff can insert guests" 
ON public.guests FOR INSERT 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.users 
        WHERE id = (SELECT auth.uid()) 
        AND role IN ('admin'::user_role, 'receptionist'::user_role)
    )
);

CREATE POLICY "Staff can update guests" 
ON public.guests FOR UPDATE 
USING (
    EXISTS (
        SELECT 1 FROM public.users 
        WHERE id = (SELECT auth.uid()) 
        AND role IN ('admin'::user_role, 'receptionist'::user_role)
    )
);

CREATE POLICY "Only admins can delete guests" 
ON public.guests FOR DELETE 
USING (
    EXISTS (
        SELECT 1 FROM public.users 
        WHERE id = (SELECT auth.uid()) 
        AND role = 'admin'::user_role
    )
);

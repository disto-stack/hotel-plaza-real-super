
CREATE TYPE user_role AS ENUM (
  'admin',
  'receptionist'
);

DROP POLICY IF EXISTS "Users can view own profile or all if admin" ON public.users;

ALTER TABLE public.users 
ADD COLUMN role_enum user_role DEFAULT 'receptionist';

UPDATE public.users 
SET role_enum = role::user_role 
WHERE role IN ('admin', 'receptionist');

ALTER TABLE public.users 
DROP COLUMN role;

ALTER TABLE public.users 
RENAME COLUMN role_enum TO role;

DROP POLICY IF EXISTS "Users can view own profile or all if admin" ON public.users;

CREATE POLICY "Users can view own profile or all if admin" 
ON public.users FOR SELECT 
USING (
  id = (SELECT auth.uid())
  OR
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = (SELECT auth.uid())
    AND role = 'admin'::user_role
  )
);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, first_name, last_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'receptionist')::user_role
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';
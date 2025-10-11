DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;

CREATE POLICY "Users can view own profile or all if admin" 
ON public.users FOR SELECT 
USING (
  id = (SELECT auth.uid())
  OR
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = (SELECT auth.uid())
    AND role = 'admin'
  )
);
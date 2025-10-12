DROP POLICY IF EXISTS "Users can view own profile or all if admin" ON public.users;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid()
    AND role = 'admin'::user_role
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

CREATE POLICY "Users can view own profile or all if admin"
ON public.users FOR SELECT
USING (
  id = auth.uid()
  OR
  public.is_admin()
);


CREATE POLICY "Admins can insert users"
ON public.users FOR INSERT
WITH CHECK (public.is_admin());

CREATE POLICY "Users can update own profile or all if admin"
ON public.users FOR UPDATE
USING (
  id = auth.uid()
  OR
  public.is_admin()
)
WITH CHECK (
  id = auth.uid()
  OR
  public.is_admin()
);

CREATE POLICY "Admins can delete users"
ON public.users FOR DELETE
USING (public.is_admin());

-- Drop hardcoded user UUID policies
DROP POLICY IF EXISTS "Allow zeedy028@gmail.com delete" ON public.gallery;
DROP POLICY IF EXISTS "Allow zeedy028@gmail.com insert" ON public.gallery;

-- Replace with role-based policies
CREATE POLICY "Admins can insert gallery"
  ON public.gallery FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'support_admin'));

CREATE POLICY "Admins can delete gallery"
  ON public.gallery FOR DELETE
  USING (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'support_admin'));

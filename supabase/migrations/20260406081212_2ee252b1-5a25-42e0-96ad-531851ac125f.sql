
-- Fix 1: Restrict quotes table - only admins can write
DROP POLICY IF EXISTS "Allow authenticated users full access to quotes" ON public.quotes;

CREATE POLICY "Anyone can read quotes"
ON public.quotes FOR SELECT
TO authenticated, anon
USING (true);

CREATE POLICY "Only admins can manage quotes"
ON public.quotes FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'super_admin'))
WITH CHECK (public.has_role(auth.uid(), 'super_admin'));

-- Fix 2: Fix product_images admin check to use has_role instead of app_metadata
DROP POLICY IF EXISTS "Administrators can delete product images" ON public.product_images;
DROP POLICY IF EXISTS "Administrators can insert product images" ON public.product_images;
DROP POLICY IF EXISTS "Administrators can update product images" ON public.product_images;

CREATE POLICY "Admins can delete product images"
ON public.product_images FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'support_admin'));

CREATE POLICY "Admins can insert product images"
ON public.product_images FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'support_admin'));

CREATE POLICY "Admins can update product images"
ON public.product_images FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'support_admin'))
WITH CHECK (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'support_admin'));

-- Fix 3: Set search_path on has_role function
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Fix 'permission denied for function has_role' error by granting EXECUTE permissions
-- and ensuring SECURITY DEFINER on has_role functions.

-- 1. Overloaded text version of has_role
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role text)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 2. Overloaded app_role version of has_role if app_role type exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
    EXECUTE '
      CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
      RETURNS boolean AS $f$
      BEGIN
        RETURN EXISTS (
          SELECT 1 FROM public.user_roles
          WHERE user_id = _user_id AND role::text = _role::text
        );
      END;
      $f$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
    ';
  END IF;
END $$;

-- 3. Grant EXECUTE permissions to authenticated and anon
GRANT EXECUTE ON FUNCTION public.has_role(uuid, text) TO authenticated, anon, service_role;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
    EXECUTE 'GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, anon, service_role;';
  END IF;
END $$;

-- 4. Ensure RLS policies on user_roles allow super_admins and designated admin emails to update roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage user_roles" ON public.user_roles;
DROP POLICY IF EXISTS "Super admins manage user_roles" ON public.user_roles;
DROP POLICY IF EXISTS "Allow user_roles access" ON public.user_roles;

CREATE POLICY "Admins can manage user_roles"
  ON public.user_roles
  FOR ALL
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'super_admin')
    OR (auth.jwt() ->> 'email') IN ('zeedy028@gmail.com', 'zeddie39@gmail.com')
  )
  WITH CHECK (
    public.has_role(auth.uid(), 'super_admin')
    OR (auth.jwt() ->> 'email') IN ('zeedy028@gmail.com', 'zeddie39@gmail.com')
  );

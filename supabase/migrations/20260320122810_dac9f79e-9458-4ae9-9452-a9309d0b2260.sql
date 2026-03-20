
-- Fix repair_requests: drop overly permissive public SELECT and INSERT policies
DROP POLICY IF EXISTS "Admins can read repair requests" ON public.repair_requests;
DROP POLICY IF EXISTS "Users can insert repair requests" ON public.repair_requests;

-- Admin-only read
CREATE POLICY "Admins can read repair requests"
  ON public.repair_requests FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'super_admin'::app_role) OR has_role(auth.uid(), 'support_admin'::app_role));

-- Users read own repair requests
CREATE POLICY "Users can read own repair requests"
  ON public.repair_requests FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Authenticated users can only insert as themselves
CREATE POLICY "Authenticated users can submit own repair requests"
  ON public.repair_requests FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

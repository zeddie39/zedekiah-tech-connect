
-- 3. FIX: contact_messages public SELECT - restrict to admins only
DROP POLICY IF EXISTS "Admins can read contact messages" ON public.contact_messages;
CREATE POLICY "Admins can read contact messages"
  ON public.contact_messages FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'super_admin'::app_role) OR has_role(auth.uid(), 'support_admin'::app_role));

-- 4. FIX: repair_requests overly permissive UPDATE
DROP POLICY IF EXISTS "Allow all updates" ON public.repair_requests;
DROP POLICY IF EXISTS "Authenticated can update" ON public.repair_requests;

-- 5. FIX: product_reviews missing RLS
ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read reviews"
  ON public.product_reviews FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own reviews"
  ON public.product_reviews FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews"
  ON public.product_reviews FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reviews"
  ON public.product_reviews FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

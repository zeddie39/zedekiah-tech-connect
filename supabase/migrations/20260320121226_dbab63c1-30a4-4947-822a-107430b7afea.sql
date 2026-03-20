
-- 1. FIX: Messages public exposure
-- Drop the overly permissive SELECT policy
DROP POLICY IF EXISTS "Admins can read messages" ON public.messages;

-- Create proper admin-only SELECT policy
CREATE POLICY "Admins can read all messages"
  ON public.messages FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'super_admin'::app_role) OR has_role(auth.uid(), 'support_admin'::app_role));

-- Fix the public INSERT policy to require authentication
DROP POLICY IF EXISTS "Public can send messages" ON public.messages;
CREATE POLICY "Authenticated users can send own messages"
  ON public.messages FOR INSERT TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

-- 2. FIX: Wishlist missing RLS
ALTER TABLE public.user_wishlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own wishlist"
  ON public.user_wishlist FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can read all wishlists"
  ON public.user_wishlist FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'super_admin'::app_role) OR has_role(auth.uid(), 'data_analyst'::app_role));

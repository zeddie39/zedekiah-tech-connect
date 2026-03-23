-- Drop overly permissive message_replies policies (public read/insert with no role check)
DROP POLICY IF EXISTS "Admins can insert message replies" ON public.message_replies;
DROP POLICY IF EXISTS "Admins can read message replies" ON public.message_replies;
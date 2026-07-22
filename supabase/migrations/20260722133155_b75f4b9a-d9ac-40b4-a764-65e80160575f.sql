
-- Revoke public/anon/authenticated EXECUTE on SECURITY DEFINER helpers.
-- has_role is called from RLS policies via SECURITY DEFINER context; handle_new_user is a trigger.
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

-- Drop overly broad SELECT policies on storage.objects for public buckets.
-- Public buckets remain reachable via their public URL (CDN), but clients can no longer list files.
DROP POLICY IF EXISTS "Public read on public buckets" ON storage.objects;
DROP POLICY IF EXISTS "Public can read images" ON storage.objects;
DROP POLICY IF EXISTS "allow all uploads to avatars 1oj01fe_1" ON storage.objects;

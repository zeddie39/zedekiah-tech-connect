-- Remove any permissive public upload policies on storage.objects
DROP POLICY IF EXISTS "Public upload" ON storage.objects;
DROP POLICY IF EXISTS "Allow public uploads" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload" ON storage.objects;

-- Ensure only authenticated users can upload to avatars bucket (owner only)
CREATE POLICY "Authenticated users upload own avatars"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Ensure only authenticated users can upload to product-images bucket
CREATE POLICY "Authenticated users upload product images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'product-images'
);

-- Ensure only authenticated users can upload to gallery bucket (admins only)
CREATE POLICY "Admins upload to gallery"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'gallery'
  AND public.has_role(auth.uid(), 'super_admin')
);

-- Allow public read on all public buckets
CREATE POLICY "Public read on public buckets"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id IN ('avatars', 'product-images', 'gallery'));

-- Allow users to update/delete their own avatars
CREATE POLICY "Users manage own avatars"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow admins to delete any storage object
CREATE POLICY "Admins delete any object"
ON storage.objects FOR DELETE
TO authenticated
USING (
  public.has_role(auth.uid(), 'super_admin')
);
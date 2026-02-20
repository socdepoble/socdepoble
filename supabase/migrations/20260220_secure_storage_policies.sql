-- =======================================================
-- SÓC DE POBLE: STORAGE SECURITY POLICIES (2026-02-20)
-- Implementing strict Row Level Security for Storage Buckets
-- =======================================================

-- 1. Ensure buckets exist
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('profiles', 'profiles', true),
  ('chat_attachments', 'chat_attachments', true),
  ('posts', 'posts', true),
  ('market', 'market', true)
ON CONFLICT (id) DO UPDATE SET public = EXCLUDED.public;

-- 2. Clear existing policies to avoid conflicts
-- Note: 'Public Access' policy might exist from previous healing
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can select" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own files" ON storage.objects;

-- 3. SELECT POLICY (Global Read for public buckets)
CREATE POLICY "Public Read Access"
ON storage.objects FOR SELECT
USING (
  bucket_id IN ('profiles', 'chat_attachments', 'posts', 'market')
);

-- 4. INSERT POLICY (Authenticated users can upload to their own folders)
-- We adopt the 'folder = user_id' pattern for profiles, and generalized ownership for others.
CREATE POLICY "Authenticated User Upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  (bucket_id = 'profiles' AND (storage.foldername(name))[1] = auth.uid()::text) OR
  (bucket_id = 'chat_attachments' AND (storage.foldername(name))[1] = auth.uid()::text) OR
  (bucket_id = 'posts' AND (storage.foldername(name))[1] = auth.uid()::text) OR
  (bucket_id = 'market' AND (storage.foldername(name))[1] = auth.uid()::text)
);

-- 5. UPDATE POLICY (Users can update only their own files)
CREATE POLICY "Authenticated User Update"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  (storage.foldername(name))[1] = auth.uid()::text
);

-- 6. DELETE POLICY (Users can delete only their own files)
CREATE POLICY "Authenticated User Delete"
ON storage.objects FOR DELETE
TO authenticated
USING (
  (storage.foldername(name))[1] = auth.uid()::text
);

-- 7. Audit Log / Comments
COMMENT ON POLICY "Public Read Access" ON storage.objects IS 'Allow global read access for identified public assets.';
COMMENT ON POLICY "Authenticated User Upload" ON storage.objects IS 'Enforce file ownership via top-level folder name (must match UID).';

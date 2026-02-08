-- ==========================================
-- SÓC DE POBLE: STORAGE HEALING (2026-02-06)
-- Resolving 404 Bucket Not Found
-- ==========================================

-- 1. Ensure 'profiles' bucket exists and is public
INSERT INTO storage.buckets (id, name, public)
VALUES ('profiles', 'profiles', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Ensure 'chat_attachments' bucket exists and is public
INSERT INTO storage.buckets (id, name, public)
VALUES ('chat_attachments', 'chat_attachments', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 3. (Optional) Legacy support: Create 'avatars' as an alias of 'profiles' if needed
-- Note: Supabase doesn't support aliases directly, but we can ensure the bucket exists
-- to avoid 404s even if it's empty.
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 4. Policies for public access (READ)
-- Everyone can view files in these buckets
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (true);

-- 5. Audit Log
COMMENT ON COLUMN storage.buckets.public IS 'Updated to true for profiles and attachments on 2026-02-06 05:22';

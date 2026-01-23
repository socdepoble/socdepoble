-- FEATURE: MULTIMEDIA MESSAGING (2026-01-23)
-- Adds support for images, videos, and documents in chats

-- 1. Update Messages Table
ALTER TABLE IF EXISTS messages ADD COLUMN IF NOT EXISTS attachment_url TEXT;
ALTER TABLE IF EXISTS messages ADD COLUMN IF NOT EXISTS attachment_type TEXT; -- 'image', 'video', 'document'
ALTER TABLE IF EXISTS messages ADD COLUMN IF NOT EXISTS attachment_name TEXT;

-- Permit content to be NULL so we can send only attachments
ALTER TABLE IF EXISTS messages ALTER COLUMN content DROP NOT NULL;

-- 2. Storage Setup (Supabase Storage)
-- Note: Buckets are usually created via UI or API, but we ensure policies here
-- Assume bucket 'chat_attachments' exists or will be created

-- 3. Storage Policies for 'chat_attachments'
-- Clean up existing policies to ensure idempotency
DROP POLICY IF EXISTS "Users can upload chat attachments" ON storage.objects;
DROP POLICY IF EXISTS "Users can view chat attachments" ON storage.objects;

-- Allow authenticated users to upload to chat_attachments
CREATE POLICY "Users can upload chat attachments" ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'chat_attachments' AND auth.role() = 'authenticated');

-- Allow participants to view attachments
CREATE POLICY "Users can view chat attachments" ON storage.objects FOR SELECT 
USING (bucket_id = 'chat_attachments' AND auth.role() = 'authenticated');

-- 4. Final verification
-- Check columns: SELECT attachment_url FROM messages LIMIT 1;

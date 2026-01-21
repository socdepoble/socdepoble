-- ==========================================
-- PHASE 3: STORAGE SETUP & RLS
-- ==========================================

-- 1. Create Buckets
-- Public for reading, but restricted for writing
INSERT INTO storage.buckets (id, name, public) 
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- 2. RLS Policies for Storage.objects
-- RLS is enabled by default in Supabase Storage.

-- Policy: Authenticated users can upload to 'images' bucket
-- We allow users to upload to folders named after their userId or entityId
DROP POLICY IF EXISTS "Users can upload images" ON storage.objects;
CREATE POLICY "Users can upload images" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'images' 
        AND auth.role() = 'authenticated'
    );

-- Policy: Users can update/delete their own uploads
-- Note: Subpath check can be added if we enforce folder structure
DROP POLICY IF EXISTS "Users can manage own images" ON storage.objects;
CREATE POLICY "Users can manage own images" ON storage.objects
    FOR ALL USING (
        bucket_id = 'images' 
        AND auth.uid() = owner
    );

-- Policy: Public read access
DROP POLICY IF EXISTS "Public read access" ON storage.objects;
CREATE POLICY "Public read access" ON storage.objects
    FOR SELECT USING (bucket_id = 'images');

-- Note: In a more advanced setup, we would check entity membership for entity-owned images.
-- For now, owning the file is sufficient for basic protection.

-- Migration: Media Assets - Absolute Null-Safety
-- Date: 2026-05-15
-- Description: The 'Trellat' philosophy requires NO NULLs. We purge NULLs from media_assets, 
-- except for deleted_at which is intentionally NULL-allowed for CRDT Tombstone Strategy.

-- 1. Drop FK constraint and set defaults
ALTER TABLE public.media_assets DROP CONSTRAINT IF EXISTS media_assets_user_id_fkey;

ALTER TABLE public.media_assets ALTER COLUMN user_id SET DEFAULT '00000000-0000-0000-0000-000000000000'::uuid;
ALTER TABLE public.media_assets ALTER COLUMN mime_type SET DEFAULT 'application/octet-stream';
ALTER TABLE public.media_assets ALTER COLUMN file_size_bytes SET DEFAULT 0;
ALTER TABLE public.media_assets ALTER COLUMN alt_text SET DEFAULT 'Sense descripció';
ALTER TABLE public.media_assets ALTER COLUMN caption SET DEFAULT '';

-- 2. Update existing NULLs
UPDATE public.media_assets SET 
    user_id = COALESCE(user_id, '00000000-0000-0000-0000-000000000000'::uuid),
    mime_type = COALESCE(mime_type, 'application/octet-stream'),
    file_size_bytes = COALESCE(file_size_bytes, 0),
    alt_text = COALESCE(alt_text, 'Sense descripció'),
    caption = COALESCE(caption, '')
WHERE user_id IS NULL OR mime_type IS NULL OR file_size_bytes IS NULL OR alt_text IS NULL OR caption IS NULL;

-- 3. Add back the foreign key constraint and set NOT NULLs
ALTER TABLE public.media_assets ADD CONSTRAINT media_assets_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE SET DEFAULT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE public.media_assets ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE public.media_assets ALTER COLUMN mime_type SET NOT NULL;
ALTER TABLE public.media_assets ALTER COLUMN file_size_bytes SET NOT NULL;
ALTER TABLE public.media_assets ALTER COLUMN alt_text SET NOT NULL;
ALTER TABLE public.media_assets ALTER COLUMN caption SET NOT NULL;

DO $$
BEGIN
    RAISE NOTICE 'Media Assets table: Absolute Null-Safety enforced (except CRDT deleted_at).';
END
$$;

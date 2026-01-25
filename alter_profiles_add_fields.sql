-- Add missing columns to profiles if they don't exist
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS ofici TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS secondary_towns JSONB DEFAULT '[]'::jsonb;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS social_image_preference TEXT DEFAULT 'none';

-- Ensure town_uuid exists as well (it should, but just in case)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS town_uuid UUID;

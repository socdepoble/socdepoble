-- Migration: Friendly URLs and Bio for Profiles
-- Description: Adds bio field and username_lower index for @username URLs

-- 1. Add bio column
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bio TEXT;

-- 2. Add generated column for case-insensitive username lookup
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS username_lower TEXT GENERATED ALWAYS AS (LOWER(username)) STORED;

-- 3. Create index for fast username lookups
CREATE INDEX IF NOT EXISTS idx_profiles_username_lower ON profiles(username_lower);

-- 4. Add comments
COMMENT ON COLUMN profiles.bio IS 'User bio/description shown in profile and Open Graph tags (max 160 chars)';
COMMENT ON COLUMN profiles.username_lower IS 'Lowercase username for case-insensitive lookups';

-- 5. No RLS changes needed - bio inherits from profiles table policies

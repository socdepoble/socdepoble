-- Migration: Add cover_url to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS cover_url TEXT;

-- Ensure RLS allows updating this column by the owner
-- Profiles table usually already has a policy for "Users can update their own profile"
-- but we make sure here just in case or if it's restricted by columns.
-- If the policy is `(auth.uid() = id)`, it should already cover this.

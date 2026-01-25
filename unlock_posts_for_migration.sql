-- 🔓 UNLOCK POSTS FOR MIGRATION
-- Execute this in Supabase SQL Editor to allow the migration script to write posts.
-- WARNING: Disable or delete this policy after migration is complete!

CREATE POLICY "Allow Migration Inserts"
ON posts
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Ensure RLS is enabled (it should be, but just in case)
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- If the above Policy doesn't match your setup (e.g. if you have restrictive roles),
-- you might need to drop existing policies or verify.
-- But usually, a permissive INSERT policy is enough to let the script run.

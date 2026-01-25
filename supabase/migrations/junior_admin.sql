-- 1. Add is_admin column to profiles
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS is_admin boolean DEFAULT false;

-- 2. Update RLS Policy for viewing profiles
-- Allow Admins (Junior and Super) to view all profiles for management
CREATE POLICY "Admins can view all profiles" 
ON profiles FOR SELECT 
USING (
  (SELECT is_admin FROM profiles WHERE id = auth.uid()) = true 
  OR 
  (SELECT is_super_admin FROM profiles WHERE id = auth.uid()) = true
);

-- 3. Safety: Allow Admins to update basic fields (optional, if they need to edit others)
-- For now, let's just allow read access to the Admin Panel lists.

-- 4. Grant Damià Admin Access (Template)
-- Run this replacing 'damia@email.com' with his real email once registered
-- UPDATE profiles SET is_admin = true WHERE id = (SELECT id FROM auth.users WHERE email = 'damia@email.com');

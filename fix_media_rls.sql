-- Fix: Add missing INSERT policy for media_assets
-- This allows users to register new unique assets once they are uploaded to storage.

CREATE POLICY "Authenticated users can insert media assets" ON media_assets
    FOR INSERT 
    WITH CHECK (auth.role() = 'authenticated');

-- Also, let's ensure players can update their own usage if needed
CREATE POLICY "Users can update own media usage" ON media_usage
    FOR UPDATE 
    USING (auth.uid() = user_id);

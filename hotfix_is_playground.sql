-- Hotfix: Remove is_playground column references
-- The column doesn't exist and is breaking image uploads

-- This is a QUICK FIX to unblock image uploads
-- The is_playground logic should be removed from the code instead

-- Option 1: Add the column (if it's needed)
-- ALTER TABLE media_assets ADD COLUMN IF NOT EXISTS is_playground BOOLEAN DEFAULT false;

-- Option 2: Better approach - remove the code that references it
-- Check supabaseService.js and remove any is_playground references

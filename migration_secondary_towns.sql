-- Migration: Secondary Towns and Damià Profile Fix
BEGIN;

-- 1. Ensure columns exist in profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS ofici TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS secondary_towns UUID[] DEFAULT '{}';

-- 2. Create Damià profile (if missing) as requested by Javi's setup script
-- We use a fixed UUID for consistency with Javi's local tests if needed, 
-- or just ensure he exists.
INSERT INTO profiles (id, full_name, username, role, bio, primary_town)
VALUES (
    'd8325f44-7277-4d20-b020-166c010995ac', 
    'Damià', 
    'damia_musica', 
    'vei', 
    'Músic de la Banda de La Torre. Amant de la cultura i les tradicions.', 
    'La Torre de les Maçanes'
)
ON CONFLICT (id) DO NOTHING;

-- Update Damià username if already exists but different
UPDATE profiles SET full_name = 'Damià' WHERE id = 'd8325f44-7277-4d20-b020-166c010995ac';

COMMIT;

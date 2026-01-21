-- ==========================================
-- FIX: CREATE PROFILE FOR AUTHENTICATED USER
-- ==========================================

INSERT INTO profiles (id, full_name, username, role, bio, is_super_admin)
VALUES ('d6325f44-7277-4d20-b020-166c010995ab', 'Javi Llinares', 'javillinares', 'vei', 'Creador de Sóc de Poble.', true)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    is_super_admin = true;

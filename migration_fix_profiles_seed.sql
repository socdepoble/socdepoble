-- ==========================================
-- FIX: DECOUPLE PROFILES FROM AUTH FOR DEMO (FIXED UUIDs)
-- ==========================================

BEGIN;

-- 1. Remove the foreign key constraint that blocks demo personas
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- 2. Re-run local seeding
-- First, clear potential conflicts with old usernames
DELETE FROM profiles WHERE username IN ('vferris', 'rosasol', 'cmira_oficial', 'mariab_torre', 'pau_foc', 'elena_tall', 'jmarti', 'xavidom', 'ncano', 'sjover', 'evalor', 'tsegui', 'pmolina', 'lvalor');

-- Profiles (Using 'f' instead of 'p' for valid HEX)
INSERT INTO profiles (id, full_name, username, avatar_url, role, bio) VALUES
('f0010000-0000-0000-0000-000000000001', 'Vicent Ferris', 'vferris', '👴', 'vei', 'Amant del pa de forn de llenya de Cocentaina.'),
('f0020000-0000-0000-0000-000000000002', 'Rosa Soler', 'rosasol', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rosa', 'empresa', 'Propietària de L''Aroma. M''encanten les flors.'),
('f0030000-0000-0000-0000-000000000003', 'Carles Mira', 'cmira_oficial', '🤵', 'oficial', 'Tècnic de cultura a l''Ajuntament.'),
('f0040000-0000-0000-0000-000000000004', 'Maria Blanes', 'mariab_torre', '👵', 'vei', 'Experta en herbes de Mariola.'),
('f0050000-0000-0000-0000-000000000005', 'Pau Garcia', 'pau_foc', '🔥', 'grup', 'Cap de la Colla de Dimonis.'),
('f0060000-0000-0000-0000-000000000006', 'Elena Montava', 'elena_tall', '👩‍🍳', 'empresa', 'Cafetería Al Tall. Café del bon matí.'),
('f0010000-0000-0000-0000-000000000015', 'Jordi Martí', 'jmarti', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jordi', 'vei', 'Sóc de Cocentaina de tota la vida.'),
('f0010000-0000-0000-0000-000000000013', 'Xavi Domènech', 'xavidom', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Xavi', 'vei', 'M''agrada molt Sóc de Poble.'),
('f0010000-0000-0000-0000-000000000018', 'Núria Cano', 'ncano', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nuria', 'vei', 'Sóc de Muro d''Alcoi.'),
('f0010000-0000-0000-0000-000000000014', 'Sara Jover', 'sjover', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sara', 'vei', 'Arquitecta.'),
('f0010000-0000-0000-0000-000000000021', 'Enric Valor', 'evalor', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Enric', 'vei', 'Escriptor.'),
('f0010000-0000-0000-0000-000000000009', 'Toni Seguí', 'tsegui', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Toni', 'vei', 'Jubilat.'),
('f0010000-0000-0000-0000-000000000010', 'Pepa Molina', 'pmolina', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Pepa', 'vei', 'Mestra.'),
('f0010000-0000-0000-0000-000000000017', 'Lluís Valor', 'lvalor', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lluis', 'vei', 'Muralista.')
ON CONFLICT (id) DO UPDATE SET 
    full_name = EXCLUDED.full_name,
    username = EXCLUDED.username,
    avatar_url = EXCLUDED.avatar_url;

COMMIT;

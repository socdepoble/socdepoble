-- ==========================================
-- PHASE 6: COMMUNITY SEEDING & ADMIN POWER
-- ==========================================

BEGIN;

-- 1. Decouple profiles from auth for demo (Allow identities without real login)
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_super_admin BOOLEAN DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bio TEXT;

-- Grant Super Admin status to the owner
-- FIX: Identify by subquery as 'email' is in auth.users
UPDATE public.profiles 
SET is_super_admin = true 
WHERE id IN (SELECT id FROM auth.users WHERE email = 'socdepoblecom@gmail.com');

-- 2. Entitats (Grups, Empreses, Entitats)
-- Categorización: entitat, grup, empresa
-- Usamos prefijo 00000000 para entidades
INSERT INTO entities (id, name, type, avatar_url, description) VALUES
('00000000-0000-0000-0000-000000000011', 'Ajuntament de Cocentaina', 'entitat', '🏛️', 'Consistori de la Vila Comtal.'),
('00000000-0000-0000-0000-000000000022', 'Colla de Dimonis de Muro', 'grup', '🔥', 'Grup de correfocs i tradició.'),
('00000000-0000-0000-0000-000000000033', 'Associació de Dones de la Torre', 'grup', '💜', 'Cultura i sororitat a la muntanya.'),
('00000000-0000-0000-0000-000000000044', 'Floristería L''Aroma', 'empresa', '🌸', 'Flors fresques de la comarca.'),
('00000000-0000-0000-0000-000000000055', 'Mancomunitat de l''Alcoià', 'entitat', '🤝', 'Serveis compartits entre pobles.'),
('00000000-0000-0000-0000-000000000066', 'Banda de Música de Banyeres', 'grup', '🎺', 'Societat Musical de gran tradició.'),
('00000000-0000-0000-0000-000000000077', 'Cooperativa Agrícola de Muro', 'empresa', '🚜', 'Oli i vi de collita pròpia.'),
('00000000-0000-0000-0000-000000000088', 'Club de Futbol de la Torre', 'grup', '⚽', 'L''equip del poble.'),
('00000000-0000-0000-0000-000000000099', 'Protecció Civil Marina Alta', 'entitat', '🚒', 'Seguretat i ayuda ciutadana.'),
('00000000-0000-0000-0000-000000000101', 'Artesania El Torn', 'empresa', '🏺', 'Ceràmica feta a mà.')
ON CONFLICT (id) DO UPDATE SET type = EXCLUDED.type, avatar_url = EXCLUDED.avatar_url;

-- 3. Personas (Profiles) - 30 Realistic Profiles with Comic Avatars
-- Usamos prefijo 11111111 para personas
INSERT INTO profiles (id, full_name, username, avatar_url, role, bio) VALUES
('11111111-0000-0000-0000-000000000001', 'Vicent Ferris', 'vferris', '/images/demo/avatar_man_old.png', 'vei', 'Amant del pa de forn de llenya de Cocentaina.'),
('11111111-0000-0000-0000-000000000002', 'Rosa Soler', 'rosasol', '/images/demo/avatar_woman_1.png', 'empresa', 'Propietària de L''Aroma. M''encanten les flors.'),
('11111111-0000-0000-0000-000000000003', 'Carles Mira', 'cmira_oficial', '/images/demo/avatar_man_1.png', 'entitat', 'Tècnic de cultura a l''Ajuntament.'),
('11111111-0000-0000-0000-000000000004', 'Maria Blanes', 'mariab_torre', '/images/demo/avatar_woman_old.png', 'vei', 'Experta en herbes de Mariola.'),
('11111111-0000-0000-0000-000000000005', 'Pau Garcia', 'pau_foc', '/images/demo/avatar_man_1.png', 'grup', 'Cap de la Colla de Dimonis.'),
('11111111-0000-0000-0000-000000000006', 'Elena Montava', 'elena_tall', '/images/demo/avatar_woman_1.png', 'empresa', 'Cafetería Al Tall. Café del bon matí.'),
('11111111-0000-0000-0000-000000000007', 'Jordi Mollà', 'jordimar', '/images/demo/avatar_man_1.png', 'vei', 'Defensor de les platges de Dénia.'),
('11111111-0000-0000-0000-000000000008', 'Anna Pastor', 'annap_manco', '/images/demo/avatar_woman_1.png', 'entitat', 'Gestió ambiental a la Mancomunitat.'),
('11111111-0000-0000-0000-000000000009', 'Joan Ripoll', 'joantennis', '/images/demo/avatar_man_1.png', 'grup', 'Entrenador de tennis a Xàbia.'),
('11111111-0000-0000-0000-000000000010', 'Silvia Vicedo', 'silviaceramica', '/images/demo/avatar_woman_1.png', 'empresa', 'Ceràmica artesana a Alcoi.'),
('11111111-0000-0000-0000-000000000011', 'Lluís Valor', 'lluis_poeta', '/images/demo/avatar_man_old.png', 'vei', 'Escriptor de relats sobre la serra.'),
('11111111-0000-0000-0000-000000000012', 'Marta Sempere', 'marta_agroro', '/images/demo/avatar_woman_1.png', 'grup', 'Investigadora agrícola.'),
('11111111-0000-0000-0000-000000000013', 'Xavi Domènech', 'xavi_guia', '/images/demo/avatar_man_1.png', 'vei', 'Guia de muntanya al Benicadell.'),
('11111111-0000-0000-0000-000000000014', 'Clara Enguix', 'clara_formatges', '/images/demo/avatar_woman_1.png', 'empresa', 'Formatges de cabra de la muntanya.'),
('11111111-0000-0000-0000-000000000015', 'Andreu Belda', 'andreu_oficial', '/images/demo/avatar_man_1.png', 'entitat', 'Agent de Protecció Civil.'),
('11111111-0000-0000-0000-000000000016', 'Sara Jover', 'saraj_musica', '/images/demo/avatar_woman_1.png', 'grup', 'Violinista a la Banda.'),
('11111111-0000-0000-0000-000000000017', 'Marc Seguí', 'marc_esport', '/images/demo/avatar_man_1.png', 'vei', 'Organitzador del trail local.'),
('11111111-0000-0000-0000-000000000018', 'Núria Cano', 'nuri_pastes', '/images/demo/avatar_woman_1.png', 'empresa', 'Forn de pa tradicional.'),
('11111111-0000-0000-0000-000000000019', 'Rafa Penadés', 'rafap_mecanic', '/images/demo/avatar_man_old.png', 'vei', 'Mecànic de toda la vida.'),
('11111111-0000-0000-0000-000000000020', 'Bea Molina', 'beamolina_eco', '/images/demo/avatar_woman_1.png', 'grup', 'Activista mediambiental.'),
('11111111-0000-0000-0000-000000000021', 'Dani Aracil', 'dani_pintor', '/images/demo/avatar_man_1.png', 'vei', 'Pintor de paisatges de l''interior.'),
('11111111-0000-0000-0000-000000000022', 'Laura Ribera', 'laurari_mestre', '/images/demo/avatar_woman_1.png', 'vei', 'Mestra d''idiomes.'),
('11111111-0000-0000-0000-000000000023', 'Toni Castelló', 'toni_oficial', '/images/demo/avatar_man_old.png', 'entitat', 'Treballador de la Cooperativa.'),
('11111111-0000-0000-0000-000000000024', 'Irene Giner', 'ireneg_foto', '/images/demo/avatar_woman_1.png', 'empresa', 'Fotògrafa d''esdeveniments.'),
('11111111-0000-0000-0000-000000000025', 'Hugo Pla', 'hugop_jove', '/images/demo/avatar_man_1.png', 'vei', 'Estudiant i skateboarder.'),
('11111111-0000-0000-0000-000000000026', 'Carme Vidal', 'carme_dones', '/images/demo/avatar_woman_old.png', 'grup', 'Portaveu de l''Assoc. de Dones.'),
('11111111-0000-0000-0000-000000000027', 'Berto Ortiz', 'berto_fisiot', '/images/demo/avatar_man_1.png', 'empresa', 'Fisioterapeuta del poble.'),
('11111111-0000-0000-0000-000000000028', 'Maite Lledó', 'maite_oficial', '/images/demo/avatar_woman_old.png', 'entitat', 'Administració pública.'),
('11111111-0000-0000-0000-000000000029', 'Enric Sancho', 'enrics_cuiner', '/images/demo/avatar_man_old.png', 'vei', 'Chef de cuina valenciana.'),
('11111111-0000-0000-0000-000000000030', 'Julia Torres', 'julia_turisme', '/images/demo/avatar_woman_1.png', 'empresa', 'Agència de viatges locals.')
ON CONFLICT (id) DO UPDATE SET avatar_url = EXCLUDED.avatar_url, full_name = EXCLUDED.full_name, role = EXCLUDED.role, bio = EXCLUDED.bio;

-- 4. Entity Memberships (Connections)
INSERT INTO entity_members (entity_id, user_id, role) VALUES
('00000000-0000-0000-0000-000000000011', '11111111-0000-0000-0000-000000000003', 'editor'), -- Carles en Ajuntament
('00000000-0000-0000-0000-000000000022', '11111111-0000-0000-0000-000000000005', 'admin'),  -- Pau en Dimonis
('00000000-0000-0000-0000-000000000033', '11111111-0000-0000-0000-000000000004', 'admin'),  -- Maria en Dones
('00000000-0000-0000-0000-000000000033', '11111111-0000-0000-0000-000000000026', 'editor'), -- Carme en Dones
('00000000-0000-0000-0000-000000000044', '11111111-0000-0000-0000-000000000002', 'admin'),  -- Rosa en Floristería
('00000000-0000-0000-0000-000000000055', '11111111-0000-0000-0000-000000000008', 'editor'), -- Anna en Mancomunitat
('00000000-0000-0000-0000-000000000066', '11111111-0000-0000-0000-000000000001', 'admin'),  -- Vicent en Banda
('00000000-0000-0000-0000-000000000066', '11111111-0000-0000-0000-000000000016', 'editor'), -- Sara en Banda
('00000000-0000-0000-0000-000000000077', '11111111-0000-0000-0000-000000000023', 'admin'),  -- Toni en Cooperativa
('00000000-0000-0000-0000-000000000101', '11111111-0000-0000-0000-000000000010', 'admin')  -- Silvia en Artesania
ON CONFLICT DO NOTHING;

COMMIT;

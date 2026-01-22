-- ==========================================
-- CONSOLIDACIÓ FINAL D'IDENTITATS (Nano Banana Edition)
-- Script per a dotar d'ànima i imatges reals a Sóc de Poble
-- ==========================================

BEGIN;

-- 0. NETEJA I SCHEMA PRE-REQUISITS
ALTER TABLE posts ADD COLUMN IF NOT EXISTS author_avatar TEXT;
ALTER TABLE market_items ADD COLUMN IF NOT EXISTS avatar_url TEXT;

DELETE FROM profiles WHERE id IS NULL;

-- 1. ACTUALITZAR PERFILS AMB IMATGES DE NANO BANANA
INSERT INTO profiles (id, full_name, username, avatar_url, role, bio) VALUES
('11111111-0000-0000-0000-000000000001', 'Vicent Ferris', 'vferris', '/images/demo/avatar_man_old.png', 'vei', 'Llaurador jubilat de Cocentaina. Conec cada pam de terra de la comarca i m’agrada compartir la història del nostre poble.'),
('11111111-0000-0000-0000-000000000002', 'Rosa Soler', 'rosasol', '/images/demo/avatar_woman_1.png', 'empresa', 'Propietària de la Floristeria L’Aroma. M’encanta omplir de color els balcons i les festes de la Torre de les Maçanes.'),
('11111111-0000-0000-0000-000000000003', 'Carles Mira', 'cmira_oficial', '/images/demo/avatar_man_1.png', 'entitat', 'Tècnic de cultura a l’Ajuntament. Treballe per a que les nostres festes i tradicions continuen vives.'),
('11111111-0000-0000-0000-000000000004', 'Maria Blanes', 'mariab_torre', '/images/demo/avatar_woman_old.png', 'vei', 'Mestra jubilada. Crec en la força de la dona rural i en la importància de donar suport als nostres veïns.'),
('11111111-0000-0000-0000-000000000005', 'Pau Garcia', 'pau_foc', '/images/demo/avatar_man_1.png', 'grup', 'Membre actiu de la Colla de Dimonis. El foc i el tabalet són el ritme que mou la meua vida al poble.'),
('11111111-0000-0000-0000-000000000006', 'Elena Montava', 'elena_tall', '/images/demo/avatar_woman_1.png', 'empresa', 'Fustera artesana i dissenyadora. Transforme la fusta de la Mariola en mobles amb història i ànima.'),
('11111111-0000-0000-0000-000000000014', 'Clara Enguix', 'clara_formatges', '/images/demo/avatar_woman_1.png', 'empresa', 'Formatgera artesana. Les nostres cabres pasturen a la Solana i d’elles traiem el millor producte local.'),
('11111111-0000-0000-0000-000000000023', 'Toni Castelló', 'toni_oficial', '/images/demo/avatar_man_old.png', 'entitat', 'Responsable de la Cooperativa. Defensar el preu just per a l’oli i la llenya és la meua missió diaria.')
ON CONFLICT (id) DO UPDATE SET 
    full_name = EXCLUDED.full_name,
    username = EXCLUDED.username,
    avatar_url = EXCLUDED.avatar_url,
    role = EXCLUDED.role,
    bio = EXCLUDED.bio;

-- 2. ACTUALITZAR ENTITATS AMB IMATGES REALS
INSERT INTO entities (id, name, type, description, avatar_url) VALUES
('00000000-0000-0000-0000-000000000011', 'Ajuntament de Cocentaina', 'oficial', 'Consistori de la Vila Comtal i serveis municipals.', '/images/assets/aviso_oficial.png'),
('00000000-0000-0000-0000-000000000022', 'Colla de Dimonis de Muro', 'grup', 'Foc, tradició i festa a la comarca del Comtat.', '/images/assets/dansa_festa.png'),
('00000000-0000-0000-0000-000000000033', 'Associació de Dones de la Torre', 'grup', 'Espai de sororitat i apoderament femení a la muntanya.', '/images/assets/lexicon.png'),
('00000000-0000-0000-0000-000000000044', 'Floristería L''Aroma', 'empresa', 'Flors fresques de temporada i rams personalitzats.', '/images/assets/flowers_bouquet.png'),
('00000000-0000-0000-0000-000000000077', 'Cooperativa Agrícola de Muro', 'empresa', 'Oli d’oliva verge extra i productes del camp.', '/images/assets/oli_premium.png')
ON CONFLICT (id) DO UPDATE SET 
    name = EXCLUDED.name,
    type = EXCLUDED.type,
    description = EXCLUDED.description,
    avatar_url = EXCLUDED.avatar_url;

-- 3. RE-VINCULAR CONVERSES DE DEMO (Assegurant que apunten als ID canònics)
DELETE FROM conversations WHERE is_demo = true;

INSERT INTO conversations (id, participant_1_id, participant_1_type, participant_2_id, participant_2_type, last_message_content, last_message_at, is_demo) VALUES
('c1111000-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', 'user', '11111111-0000-0000-0000-000000000002', 'user', 'Ens veiem a la plaça?', NOW(), true),
('c1111000-0000-0000-0000-000000000002', '11111111-0000-0000-0000-000000000001', 'user', '11111111-0000-0000-0000-000000000023', 'user', 'Et dec un cafè Vicent.', NOW() - INTERVAL '10 minutes', true),
('c1111000-0000-0000-0000-000000000003', '11111111-0000-0000-0000-000000000002', 'user', '11111111-0000-0000-0000-000000000004', 'user', 'Vols farigola fresca?', NOW() - INTERVAL '20 minutes', true),
('c1111000-0000-0000-0000-000000000004', '11111111-0000-0000-0000-000000000006', 'user', '11111111-0000-0000-0000-000000000014', 'user', 'Bon cafè Elena!', NOW() - INTERVAL '35 minutes', true),
('c1111000-0000-0000-0000-000000000005', '11111111-0000-0000-0000-000000000004', 'user', '11111111-0000-0000-0000-000000000005', 'user', 'Guarda''m dos pans, gràcies!', NOW() - INTERVAL '50 minutes', true),
('c1111000-0000-0000-0000-000000000006', '11111111-0000-0000-0000-000000000001', 'user', '11111111-0000-0000-0000-000000000005', 'user', 'Anem a caminar demà?', NOW() - INTERVAL '1 hour', true),
('c1111000-0000-0000-0000-000000000007', '11111111-0000-0000-0000-000000000004', 'user', '00000000-0000-0000-0000-000000000044', 'entity', 'Preciós el ram de flors!', NOW() - INTERVAL '1 hour 50 minutes', true);

-- 4. ACTUALITZAR POSTS I MERCAT PER A COHERÈNCIA VISUAL
UPDATE posts SET 
  author_avatar = CASE 
    WHEN author_user_id = '11111111-0000-0000-0000-000000000001' THEN '/images/demo/avatar_man_old.png'
    WHEN author_user_id = '11111111-0000-0000-0000-000000000002' THEN '/images/demo/avatar_woman_1.png'
    WHEN author_user_id = '11111111-0000-0000-0000-000000000004' THEN '/images/demo/avatar_woman_old.png'
    WHEN author_user_id = '11111111-0000-0000-0000-000000000005' THEN '/images/demo/avatar_man_1.png'
    WHEN author_entity_id = '00000000-0000-0000-0000-000000000044' THEN '/images/assets/flowers_bouquet.png'
    WHEN author_entity_id = '00000000-0000-0000-0000-000000000077' THEN '/images/assets/oli_premium.png'
    ELSE author_avatar
  END;

UPDATE market_items SET 
  avatar_url = CASE 
    WHEN author_user_id = '11111111-0000-0000-0000-000000000002' THEN '/images/demo/avatar_woman_1.png'
    WHEN author_user_id = '11111111-0000-0000-0000-000000000014' THEN '/images/demo/avatar_woman_1.png'
    WHEN author_entity_id = '00000000-0000-0000-0000-000000000077' THEN '/images/assets/oli_premium.png'
    ELSE avatar_url
  END;

COMMIT;

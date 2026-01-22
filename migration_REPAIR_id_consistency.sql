-- ==========================================
-- REPARACIÓN INTEGRAL: CONSISTENCIA DE IDs
-- Ejecutar en Supabase SQL Editor
-- ==========================================

BEGIN;

-- PASO 0: ASEGURAR COMPATIBILIDAD DE ESQUEMA (Legacy IDs & Foreign Keys)
-- 0.1 Quitar restricción NOT NULL de IDs antiguos y añadir columnas faltantes
DO $$ 
BEGIN
    -- Solo quitamos NOT NULL si la columna NO es la PK actual (lo cual fallaría)
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'posts' AND column_name = 'id' AND is_nullable = 'NO') 
       AND NOT EXISTS (SELECT 1 FROM information_schema.table_constraints tc JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name WHERE tc.table_name = 'posts' AND kcu.column_name = 'id' AND tc.constraint_type = 'PRIMARY KEY') THEN
        ALTER TABLE posts ALTER COLUMN id DROP NOT NULL;
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'market_items' AND column_name = 'id' AND is_nullable = 'NO') 
       AND NOT EXISTS (SELECT 1 FROM information_schema.table_constraints tc JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name WHERE tc.table_name = 'market_items' AND kcu.column_name = 'id' AND tc.constraint_type = 'PRIMARY KEY') THEN
        ALTER TABLE market_items ALTER COLUMN id DROP NOT NULL;
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'post_connections' AND column_name = 'id' AND is_nullable = 'NO') 
       AND NOT EXISTS (SELECT 1 FROM information_schema.table_constraints tc JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name WHERE tc.table_name = 'post_connections' AND kcu.column_name = 'id' AND tc.constraint_type = 'PRIMARY KEY') THEN
        ALTER TABLE post_connections ALTER COLUMN id DROP NOT NULL;
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'post_connections' AND column_name = 'post_id' AND is_nullable = 'NO') 
       AND NOT EXISTS (SELECT 1 FROM information_schema.table_constraints tc JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name WHERE tc.table_name = 'post_connections' AND kcu.column_name = 'post_id' AND tc.constraint_type = 'PRIMARY KEY') THEN
        ALTER TABLE post_connections ALTER COLUMN post_id DROP NOT NULL;
    END IF;
END $$;

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS town_uuid UUID;
ALTER TABLE market_items ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE market_items ADD COLUMN IF NOT EXISTS town_uuid UUID;
ALTER TABLE market_items ADD COLUMN IF NOT EXISTS author_entity_id UUID; -- Alias o duplicado para seller_entity_id por coherencia en el script seeder
ALTER TABLE market_items ADD COLUMN IF NOT EXISTS author_role TEXT DEFAULT 'gent';
ALTER TABLE post_connections ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
ALTER TABLE post_connections ADD COLUMN IF NOT EXISTS post_uuid UUID;

-- 0.2 Relajar Foreign Keys de auth.users (para permitir identidades Demo 11111111...)
-- En lugar de apuntar a auth.users (que requiere registro real), apuntaremos a public.profiles
DO $$ 
BEGIN
    -- Posts
    ALTER TABLE posts DROP CONSTRAINT IF EXISTS fk_posts_author_profile;
    ALTER TABLE posts DROP CONSTRAINT IF EXISTS posts_author_user_id_fkey;
    ALTER TABLE posts ADD CONSTRAINT fk_posts_author_profile 
        FOREIGN KEY (author_user_id) REFERENCES public.profiles(id) ON DELETE SET NULL;

    -- Market Items
    ALTER TABLE market_items DROP CONSTRAINT IF EXISTS fk_market_author_profile;
    ALTER TABLE market_items DROP CONSTRAINT IF EXISTS market_items_author_user_id_fkey;
    ALTER TABLE market_items ADD CONSTRAINT fk_market_author_profile 
        FOREIGN KEY (author_user_id) REFERENCES public.profiles(id) ON DELETE SET NULL;

    -- Connections
    ALTER TABLE post_connections DROP CONSTRAINT IF EXISTS fk_post_connections_profile;
    ALTER TABLE post_connections DROP CONSTRAINT IF EXISTS fk_post_connections_user;
    ALTER TABLE post_connections ADD CONSTRAINT fk_post_connections_profile 
        FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
END $$;

-- PASO 0.3: ASEGURAR QUE LOS PERFILES EXISTEN
-- 0.3.1 Neteja de perfils vells o en conflicte (f00...)
DELETE FROM profiles WHERE id::text LIKE 'f00%';
DELETE FROM profiles WHERE username IN ('vferris', 'rosasol', 'cmira_oficial', 'mariab_torre', 'pau_foc', 'elena_tall', 'clara_formatges', 'toni_oficial')
AND id NOT IN (
    '11111111-0000-0000-0000-000000000001', 
    '11111111-0000-0000-0000-000000000002',
    '11111111-0000-0000-0000-000000000003',
    '11111111-0000-0000-0000-000000000004',
    '11111111-0000-0000-0000-000000000005',
    '11111111-0000-0000-0000-000000000006',
    '11111111-0000-0000-0000-000000000014',
    '11111111-0000-0000-0000-000000000023'
);

-- 0.3.2 Inserir o actualizar perfils canònics (11111111...)
INSERT INTO profiles (id, full_name, username, avatar_url, role) VALUES
('11111111-0000-0000-0000-000000000001', 'Vicent Ferris', 'vferris', '/images/demo/avatar_man_old.png', 'vei'),
('11111111-0000-0000-0000-000000000002', 'Rosa Soler', 'rosasol', '/images/demo/avatar_woman_1.png', 'empresa'),
('11111111-0000-0000-0000-000000000003', 'Carles Mira', 'cmira_oficial', '/images/demo/avatar_man_1.png', 'entitat'),
('11111111-0000-0000-0000-000000000004', 'Maria Blanes', 'mariab_torre', '/images/demo/avatar_woman_old.png', 'vei'),
('11111111-0000-0000-0000-000000000005', 'Pau Garcia', 'pau_foc', '/images/demo/avatar_man_1.png', 'grup'),
('11111111-0000-0000-0000-000000000006', 'Elena Montava', 'elena_tall', '/images/demo/avatar_woman_1.png', 'empresa'),
('11111111-0000-0000-0000-000000000014', 'Clara Enguix', 'clara_formatges', '/images/demo/avatar_woman_1.png', 'empresa'),
('11111111-0000-0000-0000-000000000023', 'Toni Castelló', 'toni_oficial', '/images/demo/avatar_man_old.png', 'entitat')
ON CONFLICT (id) DO UPDATE SET 
    full_name = EXCLUDED.full_name,
    username = EXCLUDED.username,
    avatar_url = EXCLUDED.avatar_url,
    role = EXCLUDED.role;

-- PASO 0.4: ASEGURAR QUE LAS ENTIDADES EXISTEN
INSERT INTO entities (id, name, type, description) VALUES
('00000000-0000-0000-0000-000000000011', 'Ajuntament de Cocentaina', 'entitat', 'Consistori de la Vila Comtal.'),
('00000000-0000-0000-0000-000000000022', 'Colla de Dimonis de Muro', 'grup', 'Grup de correfocs i tradició.'),
('00000000-0000-0000-0000-000000000033', 'Associació de Dones de la Torre', 'grup', 'Cultura i sororitat a la muntanya.'),
('00000000-0000-0000-0000-000000000044', 'Floristería L''Aroma', 'empresa', 'Flors fresques de la comarca.'),
('00000000-0000-0000-0000-000000000077', 'Cooperativa Agrícola de Muro', 'empresa', 'Oli i vi de collita pròpia.')
ON CONFLICT (id) DO NOTHING;

-- =========================================
-- PASO 1: LIMPIAR DATOS DE DEMO EXISTENTES
-- =========================================
-- Limpiar por prefijo antiguo f00...
DELETE FROM posts WHERE author_user_id::text LIKE 'f00%';
DELETE FROM market_items WHERE author_user_id::text LIKE 'f00%';

-- Limpiar por IDs canónicos para evitar duplicados y asegurar que se apliquen las nuevas imágenes
DELETE FROM posts WHERE author_user_id::text LIKE '11111111-0000-0000-0000-%';
DELETE FROM market_items WHERE author_user_id::text LIKE '11111111-0000-0000-0000-%';
DELETE FROM post_connections WHERE user_id::text LIKE '11111111-0000-0000-0000-%';

-- =========================================
-- PASO 2: VERIFICAR TOWNS (obtener IDs reales)
-- =========================================
-- Mostrar towns disponibles para referencia
-- SELECT uuid, name FROM towns;

-- =========================================
-- PASO 3: POSTS DE DEMOSTRACIÓN (IDs correctos 11111111...)
-- =========================================

-- Vicent Ferris (vei de Cocentaina)
INSERT INTO posts (content, author, author_role, author_user_id, town_uuid, created_at, image_url)
SELECT 
    'Bon dia des de Cocentaina! Acaben de traure el pa del forn de llenya. Quina olor més bona!',
    'Vicent Ferris', 
    'vei', 
    '11111111-0000-0000-0000-000000000001', 
    t.uuid,
    NOW() - INTERVAL '2 hours',
    '/images/assets/coques_premium.png'
FROM towns t WHERE t.name ILIKE '%Cocentaina%' LIMIT 1;

INSERT INTO posts (content, author, author_role, author_user_id, town_uuid, created_at, image_url)
SELECT 
    'Qui ve a la Fira de Tots Sants? Jo no me la perdo mai, és la millor de la comarca!', 
    'Vicent Ferris', 
    'vei', 
    '11111111-0000-0000-0000-000000000001', 
    t.uuid,
    NOW() - INTERVAL '1 day',
    '/images/assets/town_square.png'
FROM towns t WHERE t.name ILIKE '%Cocentaina%' LIMIT 1;

-- Rosa Soler (propietaria de Floristería L'Aroma)
INSERT INTO posts (content, author, author_role, author_user_id, author_entity_id, town_uuid, created_at, image_url)
SELECT 
    'Ja tenim els rams d''hivern preparats! Orquídies, tulipes i molt més. Passeu a veure''ls 🌸',
    'Floristería L''Aroma | Rosa Soler', 
    'empresa', 
    '11111111-0000-0000-0000-000000000002', 
    '00000000-0000-0000-0000-000000000044',
    t.uuid,
    NOW() - INTERVAL '3 hours',
    '/images/assets/flowers_bouquet.png'
FROM towns t WHERE t.name ILIKE '%Torre%Maçanes%' LIMIT 1;

-- Pau Garcia (Cap de la Colla de Dimonis de Muro)
INSERT INTO posts (content, author, author_role, author_user_id, author_entity_id, town_uuid, created_at, image_url)
SELECT 
    'Hui provem receptes noves al bar. Si veniu, teniu cafè gratis per acompanyar la degustació!',
    'Pau Garcia', 
    'grup', 
    '11111111-0000-0000-0000-000000000005', 
    '00000000-0000-0000-0000-000000000022',
    t.uuid,
    NOW() - INTERVAL '5 hours',
    '/images/assets/olleta_premium.png'
FROM towns t WHERE t.name ILIKE '%Muro%' LIMIT 1;

-- Elena Montava (Emprenedora d'Alcoi)
INSERT INTO posts (content, author, author_role, author_user_id, town_uuid, created_at, image_url)
SELECT 
    'Estic dissenyant un nou moble per a un client de la Torre. M''encanta barrejar fusta de pi amb ferro.',
    'Elena Montava', 
    'empresa', 
    '11111111-0000-0000-0000-000000000006', 
    t.uuid,
    NOW() - INTERVAL '10 hours',
    '/images/assets/generic_street.png'
FROM towns t WHERE t.name ILIKE '%Alcoi%' LIMIT 1;

-- Maria Blanes (Veïna activa)
INSERT INTO posts (content, author, author_role, author_user_id, town_uuid, created_at, image_url)
SELECT 
    'He trobat una clau a la porta de l''església. Si algú la busca, la deixaré a l''Ajuntament.',
    'Maria Blanes', 
    'vei', 
    '11111111-0000-0000-0000-000000000004', 
    t.uuid,
    NOW() - INTERVAL '1 day',
    '/images/assets/lexicon.png'
FROM towns t WHERE t.name ILIKE '%Torre%Maçanes%' LIMIT 1;

-- Toni Castelló (Cooperativa)
INSERT INTO posts (content, author, author_role, author_user_id, author_entity_id, town_uuid, created_at, image_url)
SELECT 
    'Ja hem obert la campanya de l''oli d''enguany. Qualitat excepcional!',
    'Toni Castelló', 
    'entitat', 
    '11111111-0000-0000-0000-000000000023', 
    '00000000-0000-0000-0000-000000000077',
    t.uuid,
    NOW() - INTERVAL '1 day',
    '/images/assets/oli_premium.png'
FROM towns t WHERE t.name ILIKE '%Muro%' LIMIT 1;

-- Clara Enguix (Formatgera)
INSERT INTO posts (content, author, author_role, author_user_id, town_uuid, created_at, image_url)
SELECT 
    'Acaben d''eixir els formatges curats de primavera. Tenen un regust d''herba de la Mariola!',
    'Clara Enguix', 
    'empresa', 
    '11111111-0000-0000-0000-000000000014', 
    t.uuid,
    NOW() - INTERVAL '2 days',
    '/images/assets/formatge.png'
FROM towns t WHERE t.name ILIKE '%Alcoi%' LIMIT 1;

-- =========================================
-- PASO 4: ITEMS DEL MERCAT
-- =========================================

-- Rosa - Floristería
INSERT INTO market_items (title, description, price, tag, image_url, seller, author_role, author_user_id, author_entity_id, town_uuid, created_at)
SELECT 
    'Rams de Temporada',
    'Flors fresques de la Mariola, collides amb cura i composades amb amor.',
    '18€',
    'productes',
    '/images/assets/flowers_bouquet.png',
    'Floristería L''Aroma | Rosa Soler',
    'empresa', 
    '11111111-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000044',
    t.uuid,
    NOW() - INTERVAL '1 day'
FROM towns t WHERE t.name ILIKE '%Torre%Maçanes%' LIMIT 1;

-- Clara - Formatges
INSERT INTO market_items (title, description, price, tag, image_url, seller, author_role, author_user_id, town_uuid, created_at)
SELECT 
    'Formatge de Cabra Curat',
    'Formatge artesanal de cabra de la muntanya, curat 3 mesos.',
    '12€/kg',
    'productes',
    '/images/assets/formatge.png',
    'Clara Enguix',
    'empresa', 
    '11111111-0000-0000-0000-000000000014',
    t.uuid,
    NOW() - INTERVAL '2 days'
FROM towns t WHERE t.name ILIKE '%Alcoi%' LIMIT 1;

-- Cooperativa de Muro
INSERT INTO market_items (title, description, price, tag, image_url, seller, author_role, author_user_id, author_entity_id, town_uuid, created_at)
SELECT 
    'Oli d''Oliva Verge Extra',
    'Oli de collita pròpia, premsat en fred. Primera pressió.',
    '8€/litre',
    'productes',
    '/images/assets/oli_premium.png',
    'Cooperativa Agrícola de Muro | Toni Castelló',
    'empresa', 
    '11111111-0000-0000-0000-000000000023',
    '00000000-0000-0000-0000-000000000077',
    t.uuid,
    NOW() - INTERVAL '3 days'
FROM towns t WHERE t.name ILIKE '%Muro%' LIMIT 1;

-- =========================================
-- PASO 5: INTERACCIONES (post_connections)
-- =========================================

-- Rosa conecta con el post de Vicent
INSERT INTO post_connections (post_uuid, user_id, tags, created_at)
SELECT p.uuid, '11111111-0000-0000-0000-000000000002', ARRAY['zap'], NOW() - INTERVAL '1 hour'
FROM posts p WHERE p.author_user_id = '11111111-0000-0000-0000-000000000001' LIMIT 1
ON CONFLICT DO NOTHING;

-- Vicent conecta con el post de Rosa
INSERT INTO post_connections (post_uuid, user_id, tags, created_at)
SELECT p.uuid, '11111111-0000-0000-0000-000000000001', ARRAY['zap'], NOW() - INTERVAL '30 minutes'
FROM posts p WHERE p.author_user_id = '11111111-0000-0000-0000-000000000002' LIMIT 1
ON CONFLICT DO NOTHING;

-- Maria conecta con el post de Pau
INSERT INTO post_connections (post_uuid, user_id, tags, created_at)
SELECT p.uuid, '11111111-0000-0000-0000-000000000004', ARRAY['zap'], NOW() - INTERVAL '2 hours'
FROM posts p WHERE p.author_user_id = '11111111-0000-0000-0000-000000000005' LIMIT 1
ON CONFLICT DO NOTHING;

-- =========================================
-- PASO 6: VINCULAR PERFILES A PUEBLOS
-- =========================================

UPDATE profiles SET town_uuid = (SELECT uuid FROM towns WHERE name ILIKE '%Cocentaina%' LIMIT 1)
WHERE id = '11111111-0000-0000-0000-000000000001'; -- Vicent

UPDATE profiles SET town_uuid = (SELECT uuid FROM towns WHERE name ILIKE '%Torre%Maçanes%' LIMIT 1)
WHERE id = '11111111-0000-0000-0000-000000000002'; -- Rosa

UPDATE profiles SET town_uuid = (SELECT uuid FROM towns WHERE name ILIKE '%Cocentaina%' LIMIT 1)
WHERE id = '11111111-0000-0000-0000-000000000003'; -- Carles

UPDATE profiles SET town_uuid = (SELECT uuid FROM towns WHERE name ILIKE '%Torre%Maçanes%' LIMIT 1)
WHERE id = '11111111-0000-0000-0000-000000000004'; -- Maria

UPDATE profiles SET town_uuid = (SELECT uuid FROM towns WHERE name ILIKE '%Muro%' LIMIT 1)
WHERE id = '11111111-0000-0000-0000-000000000005'; -- Pau

COMMIT;

-- =========================================
-- VERIFICACIÓN (ejecutar después del COMMIT)
-- =========================================
-- SELECT COUNT(*) AS total_posts FROM posts;
-- SELECT COUNT(*) AS total_market_items FROM market_items;
-- SELECT author, content, town_uuid FROM posts ORDER BY created_at DESC LIMIT 10;

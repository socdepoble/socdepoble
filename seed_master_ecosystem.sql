-- =========================================================
-- SÓC DE POBLE: SEED MASTER ECOSYSTEM (v1.5.6-BATEGA)
-- =========================================================
-- Script integral per poblar la base de dades amb dades reals i Lore.
-- Basat en els UIDs detectats al dashboard de Supabase de l'usuari.

BEGIN;

-- 0. PREPARACIÓ D'ESQUEMA (CREACIÓ, NORMALITZACIÓ I AMPLIACIÓ DE ROLES)
-- ---------------------------------------------------------
DO $$ 
BEGIN
    -- 0.1. Assegurar que les columnes existeixen (per si no s'han executat migracions prèvies)
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'vei';
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false;
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS primary_town TEXT;
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS ofici TEXT;
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bio TEXT;

    ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS author_id UUID;
    ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS author_role TEXT DEFAULT 'vei';
    ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false;

    ALTER TABLE public.market_items ADD COLUMN IF NOT EXISTS author_id UUID;
    ALTER TABLE public.market_items ADD COLUMN IF NOT EXISTS seller_role TEXT DEFAULT 'vei';
    ALTER TABLE public.market_items ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false;
    ALTER TABLE public.market_items ADD COLUMN IF NOT EXISTS title TEXT;
    ALTER TABLE public.market_items ADD COLUMN IF NOT EXISTS category_slug TEXT DEFAULT 'tot';
    ALTER TABLE public.market_items ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

    -- 0.2. Normalitzar dades existents que podrien violar la futura constraint
    UPDATE public.profiles 
    SET role = 'admin' 
    WHERE role IN ('administrador', 'superadmin');

    UPDATE public.profiles 
    SET role = 'vei' 
    WHERE role NOT IN ('gent', 'grup', 'empresa', 'admin', 'vei', 'oficial', 'official', 'neighbor', 'ambassador', 'user');

    -- Normalitzar posts i market_items igualment
    UPDATE public.posts SET author_role = 'vei' WHERE author_role NOT IN ('gent', 'grup', 'empresa', 'admin', 'vei', 'oficial', 'official', 'neighbor', 'ambassador', 'user') OR author_role IS NULL;
    UPDATE public.market_items SET seller_role = 'vei' WHERE seller_role NOT IN ('gent', 'grup', 'empresa', 'admin', 'vei', 'oficial', 'official', 'neighbor', 'ambassador', 'user') OR seller_role IS NULL;

    -- 0.3. Aplicar la nova constraint de rols a PROFILES
    ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
    ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check 
        CHECK (role IN ('gent', 'grup', 'empresa', 'admin', 'vei', 'oficial', 'official', 'neighbor', 'ambassador', 'user'));
    
    -- 0.4. Aplicar la nova constraint a POSTS
    ALTER TABLE public.posts DROP CONSTRAINT IF EXISTS posts_author_role_check;
    ALTER TABLE public.posts ADD CONSTRAINT posts_author_role_check 
        CHECK (author_role IN ('gent', 'grup', 'empresa', 'admin', 'vei', 'oficial', 'official', 'neighbor', 'ambassador', 'user'));

    -- 0.5. Aplicar la nova constraint a MARKET_ITEMS
    ALTER TABLE public.market_items DROP CONSTRAINT IF EXISTS market_items_seller_role_check;
    ALTER TABLE public.market_items ADD CONSTRAINT market_items_seller_role_check 
        CHECK (seller_role IN ('gent', 'grup', 'empresa', 'admin', 'vei', 'oficial', 'official', 'neighbor', 'ambassador', 'user'));

    -- 0.6. Netejar conflictes de 'username' (Veritat Única)
    -- Si hi ha perfils antics/demo amb els usernames que usarem, els eliminem si el seu ID no és el correcte.
    DELETE FROM public.profiles 
    WHERE username IN ('javillinares', 'lidiaespi', 'annacliment', 'damiamus', 'nandollinares')
      AND id NOT IN (
          'd6325f44-7277-4d20-b020-166c010995ab', -- Javi
          '333bd9f1-21ab-41fe-b856-2340ce6dc96c', -- Lidia
          'fa82eb62-4a83-4ff7-b2d6-8849673fc3b0', -- Damià
          '031adc10-ce8c-4ec9-8672-330473033a91', -- Nando
          'a11ac111-eec1-4111-b111-000000000013'  -- Anna Climent (Persona Real)
      );
END $$;

-- 1. POBLAT DE CATEGORIES DEL MERCAT (Veritat Única - Multilingüe)
-- ---------------------------------------------------------
INSERT INTO public.market_categories (slug, name_va, name_es, icon) VALUES
('tot', 'Tot', 'Todo', 'LayoutGrid'),
('alimentacio', 'Alimentació', 'Alimentación', 'Apple'),
('artesania', 'Artesania', 'Artesanía', 'Palette'),
('eines', 'Eines i Maquinària', 'Herramientas y Maquinaria', 'Wrench'),
('serveis', 'Serveis', 'Servicios', 'Briefcase'),
('intercanvi', 'Intercanvi', 'Intercambio', 'Repeat'),
('altres', 'Altres', 'Otros', 'MoreHorizontal')
ON CONFLICT (slug) DO UPDATE SET 
    name_va = EXCLUDED.name_va,
    name_es = EXCLUDED.name_es,
    icon = EXCLUDED.icon;

-- 1.1 POBLAT DE MUNICIPIS (TOWNS)
-- ---------------------------------------------------------
-- Netegem dades de prova anteriors si cal (id 1 a 4 solen ser de prova)
DELETE FROM public.towns WHERE id IN (1, 2, 3, 4);

INSERT INTO public.towns (name, description, population, logo_url) VALUES
('La Torre de les Maçanes', 'Un poble de muntanya envoltat de naturalesa i pau. Llar de "El Rentonar".', 680, 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Escut_de_la_Torre_de_les_Ma%C3%A7anes.svg/1200px-Escut_de_la_Torre_de_les_Ma%C3%A7anes.svg.png'),
('Cocentaina', 'Capital de la comarca del Comtat i terra de la Fira de Tots Sants.', 11500, 'https://upload.wikimedia.org/wikipedia/commons/2/23/Escut_de_Cocentaina.svg'),
('Alcoi', 'Ciutat dels ponts i bressol de festes mundials de Moros i Cristians.', 59000, 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Escut_d%27Alcoi.svg/1200px-Escut_d%27Alcoi.svg.png'),
('Xixona', 'Lloc d''origen del torró més famós del món.', 7000, 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Escut_de_Xixona.svg/1200px-Escut_de_Xixona.svg.png'),
('Penàguila', 'Poble amb encant als peus de la serra d''Aitana i el Jardí de Santos.', 300, 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Escut_de_Pen%C3%A0guila.svg/1200px-Escut_de_Pen%C3%A0guila.svg.png'),
('Benifallim', 'Petita joia rural entre muntanyes i castells.', 100, 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Escut_de_Benifallim.svg/1200px-Escut_de_Benifallim.svg.png'),
('Beialfaquí', 'Petita i acollidora pedania bategant al cor del Comtat.', 30, null)
ON CONFLICT (name) DO UPDATE SET 
    description = EXCLUDED.description,
    population = EXCLUDED.population;

-- 2. VINCULACIÓ D'USUARIS REALS AMB PERFILS DE LORE
-- ---------------------------------------------------------
DO $$ 
DECLARE 
    v_torre_id INTEGER;
    v_cocentaina_id INTEGER;
BEGIN
    SELECT id INTO v_torre_id FROM towns WHERE name = 'La Torre de les Maçanes' LIMIT 1;
    SELECT id INTO v_cocentaina_id FROM towns WHERE name = 'Cocentaina' LIMIT 1;

    -- Javi Llinares (Admin/Fundador)
    INSERT INTO public.profiles (id, username, full_name, role, primary_town, ofici, bio, avatar_url)
    VALUES ('d6325f44-7277-4d20-b020-166c010995ab', 'javillinares', 'Javi Llinares (Sóc de Poble)', 'admin', 'La Torre de les Maçanes', 'Fundador Sóc de Poble', 'Construint l''ecosistema digital de la nostra terra. Bategant per cada comunitat.', 'https://adjlvwtxhpclgmnsvwpm.supabase.co/storage/v1/object/public/avatars/javi_avatar.png')
    ON CONFLICT (id) DO UPDATE SET 
        role = EXCLUDED.role,
        ofici = EXCLUDED.ofici,
        bio = EXCLUDED.bio,
        full_name = EXCLUDED.full_name;

    -- Lidia Espí (Persona Real - Equip de Treball)
    INSERT INTO public.profiles (id, username, full_name, role, primary_town, ofici, bio, avatar_url)
    VALUES ('333bd9f1-21ab-41fe-b856-2340ce6dc96c', 'lidiaespi', 'Lidia Espí', 'vei', 'La Torre de les Maçanes', 'Equip de Treball Batega', 'Treballant per la recuperació rural i la dinamització de la genta del nostre territori.', 'https://adjlvwtxhpclgmnsvwpm.supabase.co/storage/v1/object/public/avatars/lidia_avatar.png')
    ON CONFLICT (id) DO UPDATE SET 
        full_name = EXCLUDED.full_name,
        ofici = EXCLUDED.ofici,
        bio = EXCLUDED.bio;

    -- Anna Climent (Persona Real - Batega / Educació)
    INSERT INTO public.profiles (id, username, full_name, role, primary_town, ofici, bio, avatar_url)
    VALUES ('a11ac111-eec1-4111-b111-000000000013', 'annacliment', 'Anna Climent', 'vei', 'Beialfaquí', 'Profe Biologia i Arquitecta Tècnica', 'Professora de Biologia a Ibi i Arquitecta Tècnica. Bategant per Beialfaquí i la rehabilitació del territori.', 'https://adjlvwtxhpclgmnsvwpm.supabase.co/storage/v1/object/public/avatars/anna_climent.png')
    ON CONFLICT (id) DO UPDATE SET 
        full_name = EXCLUDED.full_name,
        ofici = EXCLUDED.ofici,
        bio = EXCLUDED.bio;

    -- Damià Llorens (Perit/Enginyer)
    INSERT INTO public.profiles (id, username, full_name, role, primary_town, ofici, bio)
    VALUES ('fa82eb62-4a83-4ff7-b2d6-8849673fc3b0', 'damiamus', 'Damià Llorens Jordà', 'vei', 'La Torre de les Maçanes', 'Enginyer Agrònom', 'Gestió de finques i assessorament agrícola. Compromès amb el camp valencià.')
    ON CONFLICT (id) DO UPDATE SET 
        ofici = EXCLUDED.ofici,
        bio = EXCLUDED.bio;

    -- Nando Llinares
    INSERT INTO public.profiles (id, username, full_name, role, primary_town, ofici, bio)
    VALUES ('031adc10-ce8c-4ec9-8672-330473033a91', 'nandollinares', 'Nando Llinares', 'vei', 'Cocentaina', 'Gestor Cultural', 'Promovent la identitat valenciana i les nostres tradicions des del Comtat.')
    ON CONFLICT (id) DO UPDATE SET 
        primary_town = EXCLUDED.primary_town,
        ofici = EXCLUDED.ofici,
        bio = EXCLUDED.bio;
END $$;

-- 3. ENTITATS (CORPORATIU I ACTIVITAT)
-- ---------------------------------------------------------
INSERT INTO public.entities (id, name, type, description, avatar_url, owner_id) VALUES
('b192eb99-9c0b-4ef8-bb6d-6bb9bd380a01', 'El Rentonar', 'empresa', 'Projecte de rehabilitació agrícola i rural a la Torre. Terra de pau i oli.', 'https://adjlvwtxhpclgmnsvwpm.supabase.co/storage/v1/object/public/avatars/rentonar.png', 'd6325f44-7277-4d20-b020-166c010995ab'),
('b192eb99-9c0b-4ef8-bb6d-6bb9bd380a02', 'Batega', 'grup', 'Moviment per la dinamització i la veu dels pobles de l''Alcoià i el Comtat.', 'https://adjlvwtxhpclgmnsvwpm.supabase.co/storage/v1/object/public/avatars/batega.png', '333bd9f1-21ab-41fe-b856-2340ce6dc96c'),
('b192eb99-9c0b-4ef8-bb6d-6bb9bd380a03', 'Cooperativa la Torre', 'empresa', 'Oligueros de la zona amb un producte d''excel·lència de muntanya.', 'https://adjlvwtxhpclgmnsvwpm.supabase.co/storage/v1/object/public/avatars/cooperativa.png', 'fa82eb62-4a83-4ff7-b2d6-8849673fc3b0'),
('b192eb99-9c0b-4ef8-bb6d-6bb9bd380a08', 'Ajuntament de la Torre', 'oficial', 'Canal oficial de comunicació de la Torre de les Maçanes.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Escut_de_la_Torre_de_les_Ma%C3%A7anes.svg/300px-Escut_de_la_Torre_de_les_Ma%C3%A7anes.svg.png', 'd6325f44-7277-4d20-b020-166c010995ab')
ON CONFLICT (id) DO UPDATE SET 
    description = EXCLUDED.description;

-- 4. MIEMBROS DE ENTIDADES
-- ---------------------------------------------------------
INSERT INTO public.entity_members (entity_id, user_id, role) VALUES
('b192eb99-9c0b-4ef8-bb6d-6bb9bd380a01', 'd6325f44-7277-4d20-b020-166c010995ab', 'admin'),
('b192eb99-9c0b-4ef8-bb6d-6bb9bd380a02', '333bd9f1-21ab-41fe-b856-2340ce6dc96c', 'admin'), -- Lidia gestiona Batega
('b192eb99-9c0b-4ef8-bb6d-6bb9bd380a02', 'd6325f44-7277-4d20-b020-166c010995ab', 'editor')
ON CONFLICT (entity_id, user_id) DO NOTHING;

-- 5. POSTS INICIALS PER AL MUR
-- ---------------------------------------------------------
-- Netegem posts demo si cal
DELETE FROM public.posts WHERE is_demo = true;

INSERT INTO public.posts (content, author_id, author_role, town_id)
SELECT 
    'Aquest matí he estat revisant les restes del vell corral de la Torre. Tenim un patrimoni que fa bategar el cor.',
    'a11ac111-eec1-4111-b111-000000000013', -- Anna Climent (Persona Real)
    'vei',
    id
FROM towns WHERE name = 'La Torre de les Maçanes' LIMIT 1;

INSERT INTO public.posts (content, author_id, author_role, author_type, author_entity_id, town_id)
SELECT 
    'Hem obert les inscripcions per al nou projecte de compostatge comunitari de Batega a la Torre. Suma-t''hi!',
    '333bd9f1-21ab-41fe-b856-2340ce6dc96c', -- Lidia Espí
    'grup',
    'entity',
    'b192eb99-9c0b-4ef8-bb6d-6bb9bd380a02', -- Entitat Batega
    id
FROM towns WHERE name = 'La Torre de les Maçanes' LIMIT 1;

INSERT INTO public.posts (content, author_id, author_role, author_type, author_entity_id, town_id)
SELECT 
    'Recordatori: Dilluns és dia festiu local. Les oficines romandran tancades.',
    'd6325f44-7277-4d20-b020-166c010995ab',
    'oficial',
    'entity',
    'b192eb99-9c0b-4ef8-bb6d-6bb9bd380a08',
    id
FROM towns WHERE name = 'La Torre de les Maçanes' LIMIT 1;

-- 6. PRODUCTES DEL MERCAT
-- ---------------------------------------------------------
INSERT INTO public.market_items (title, description, price, category_slug, is_active, town_id, author_id, image_url)
SELECT 
    'Mel de Muntanya (La Torre)',
    'Mel 100% natural recolectada a les serres de la Torre de les Maçanes.',
    8.50,
    'alimentacio',
    true,
    id,
    'fa82eb62-4a83-4ff7-b2d6-8849673fc3b0', -- Damià
    '/images/assets/mel_premium.png'
FROM towns WHERE name = 'La Torre de les Maçanes' LIMIT 1;

INSERT INTO public.market_items (title, description, price, category_slug, is_active, town_id, author_id, seller_type, seller_entity_id, image_url)
SELECT 
    'Oli d''Oliva Verge Extra (5L)',
    'Primera premsada en fred de les olives de secà de la Torre.',
    45.00,
    'alimentacio',
    true,
    id,
    'fa82eb62-4a83-4ff7-b2d6-8849673fc3b0',
    'entity',
    'b192eb99-9c0b-4ef8-bb6d-6bb9bd380a03',
    '/images/assets/oli_premium.png'
FROM towns WHERE name = 'La Torre de les Maçanes' LIMIT 1;

COMMIT;

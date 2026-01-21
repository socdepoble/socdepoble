-- =========================================================
-- SÓC DE POBLE: MIGRACIÓ DE SEGURETAT I ARQUITECTURA (SETMANA 1) - V7
-- =========================================================
-- Resoleix l'error de NULL: Esborra les dades invàlides ABANS de canviar el tipus
-- de dades de la columna, evitant conflictes amb la restricció NOT NULL.

BEGIN;

-- 0. NETEJA EXHAUSTIVA DE POLÍTIQUES
-- ---------------------------------------------------------
DROP POLICY IF EXISTS "Users manage own connections" ON post_connections;

DROP POLICY IF EXISTS "Private Tags Access" ON connection_tags;
DROP POLICY IF EXISTS "Users can manage their own connection tags" ON connection_tags;

DROP POLICY IF EXISTS "Users manage own tags" ON user_tags;
DROP POLICY IF EXISTS "Users can view their own tags" ON user_tags;
DROP POLICY IF EXISTS "Users can insert their own tags" ON user_tags;
DROP POLICY IF EXISTS "Users can delete their own tags" ON user_tags;

DROP POLICY IF EXISTS "Public profiles" ON profiles;
DROP POLICY IF EXISTS "Own profile update" ON profiles;
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;

DROP POLICY IF EXISTS "Public posts viewable" ON posts;
DROP POLICY IF EXISTS "Users insert posts" ON posts;
DROP POLICY IF EXISTS "Users update posts" ON posts;
DROP POLICY IF EXISTS "Users delete posts" ON posts;
DROP POLICY IF EXISTS "Public posts are viewable by everyone" ON posts;
DROP POLICY IF EXISTS "Authenticated users can create posts" ON posts;
DROP POLICY IF EXISTS "Users can update own posts" ON posts;
DROP POLICY IF EXISTS "Users can delete own posts" ON posts;
DROP POLICY IF EXISTS "Users can insert own posts" ON posts;

DROP POLICY IF EXISTS "Public items seeable" ON market_items;
DROP POLICY IF EXISTS "Users insert items" ON market_items;
DROP POLICY IF EXISTS "Users update items" ON market_items;
DROP POLICY IF EXISTS "Users delete items" ON market_items;
DROP POLICY IF EXISTS "Public market_items are viewable by everyone" ON market_items;
DROP POLICY IF EXISTS "Authenticated users can create items" ON market_items;
DROP POLICY IF EXISTS "Users can update own items" ON market_items;
DROP POLICY IF EXISTS "Users can delete own items" ON market_items;
DROP POLICY IF EXISTS "Public items seeable" ON market_items;
DROP POLICY IF EXISTS "Users insert items" ON market_items;
DROP POLICY IF EXISTS "Users update items" ON market_items;
DROP POLICY IF EXISTS "Users delete items" ON market_items;


-- 1. NETEJA DE DADES INVÀLIDES / DEMO (ABANS DE CANVIAR TIPUS)
-- ---------------------------------------------------------
-- Eliminem qualsevol fila on l'usuari no siga un UUID vàlid O no estiga a auth.users.
-- Això és necessari perquè les columnes user_id solen ser NOT NULL.

DELETE FROM connection_tags 
WHERE user_id::text !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
   OR user_id::UUID NOT IN (SELECT id FROM auth.users);

DELETE FROM post_connections 
WHERE user_id::text !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
   OR user_id::UUID NOT IN (SELECT id FROM auth.users);

-- També netegem posts i mercat de dades demo per a la Foreign Key posterior
UPDATE posts SET author_id = NULL WHERE author_id::text !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';


-- 2. CONVERSIÓ DE TIPUS (ARA JA SENSE DADES INVÀLIDES)
-- ---------------------------------------------------------

-- post_connections
ALTER TABLE IF EXISTS post_connections 
    ALTER COLUMN user_id TYPE UUID USING user_id::UUID;

-- connection_tags
ALTER TABLE IF EXISTS connection_tags 
    ALTER COLUMN user_id TYPE UUID USING user_id::UUID;

-- user_tags (si és necessari)
DO $$ 
BEGIN
    IF (SELECT data_type FROM information_schema.columns WHERE table_name = 'user_tags' AND column_name = 'user_id') = 'text' THEN
        DELETE FROM user_tags WHERE user_id::text !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';
        ALTER TABLE user_tags ALTER COLUMN user_id TYPE UUID USING user_id::UUID;
    END IF;
END $$;


-- 3. INTEGRITAT REFERENCIAL (FOREIGN KEYS)
-- ---------------------------------------------------------

-- post_connections
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_post_connections_user') THEN
        ALTER TABLE post_connections 
            ADD CONSTRAINT fk_post_connections_user 
            FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
END $$;

-- connection_tags
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_connection_tags_user') THEN
        ALTER TABLE connection_tags 
            ADD CONSTRAINT fk_connection_tags_user 
            FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
END $$;


-- 4. AUTORIA I IDENTITAT UNIFICADA
-- ---------------------------------------------------------
ALTER TABLE IF EXISTS posts ADD COLUMN IF NOT EXISTS author_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
UPDATE posts SET author_user_id = author_id::UUID WHERE author_id IS NOT NULL;

ALTER TABLE IF EXISTS market_items ADD COLUMN IF NOT EXISTS author_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

ALTER TABLE IF EXISTS posts DROP COLUMN IF EXISTS avatar_type;
ALTER TABLE IF EXISTS posts ADD COLUMN IF NOT EXISTS author_entity_id UUID;

DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'market_items' AND column_name = 'seller_role') THEN
        ALTER TABLE market_items RENAME COLUMN seller_role TO author_role;
    END IF;
END $$;


-- 5. RECREACIÓ DE POLÍTIQUES RLS (NETES I PROTEGIDES)
-- ---------------------------------------------------------

-- POSTS
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public posts viewable" ON posts FOR SELECT USING (true);
CREATE POLICY "Users insert posts" ON posts 
    FOR INSERT WITH CHECK (
        auth.uid() = author_user_id 
        AND (
            -- Si no se especifica entidad, permitir (post personal)
            author_entity_id IS NULL 
            -- Si se especifica entidad, verificar que el usuario es miembro
            OR EXISTS (
                SELECT 1 FROM entity_members 
                WHERE entity_id = author_entity_id 
                AND user_id = auth.uid()
            )
        )
    );
CREATE POLICY "Users update posts" ON posts FOR UPDATE USING (auth.uid() = author_user_id);
CREATE POLICY "Users delete posts" ON posts FOR DELETE USING (auth.uid() = author_user_id);

-- MARKET_ITEMS
ALTER TABLE market_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public items seeable" ON market_items FOR SELECT USING (true);
CREATE POLICY "Users insert items" ON market_items 
    FOR INSERT WITH CHECK (
        auth.uid() = author_user_id 
        AND (
            -- Si no se especifica entidad, permitir (venta personal)
            seller_entity_id IS NULL 
            -- Si se especifica entidad, verificar que el usuario es miembro
            OR EXISTS (
                SELECT 1 FROM entity_members 
                WHERE entity_id = seller_entity_id 
                AND user_id = auth.uid()
            )
        )
    );
CREATE POLICY "Users update items" ON market_items FOR UPDATE USING (auth.uid() = author_user_id);
CREATE POLICY "Users delete items" ON market_items FOR DELETE USING (auth.uid() = author_user_id);

-- POST_CONNECTIONS
ALTER TABLE post_connections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own connections" ON post_connections FOR ALL USING (auth.uid() = user_id);

-- USER_TAGS
ALTER TABLE user_tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own tags" ON user_tags FOR ALL USING (auth.uid() = user_id);

-- PROFILES
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Own profile update" ON profiles FOR UPDATE USING (auth.uid() = id);


-- 6. ÍNDEXS DE RENDIMENT
-- ---------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_posts_town_role ON posts(town_id, author_role);
CREATE INDEX IF NOT EXISTS idx_posts_created ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_market_town ON market_items(town_id);

-- 7. INTEGRITAT REFERENCIAL ADICIONAL
-- ---------------------------------------------------------

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_posts_town') THEN
        ALTER TABLE posts 
            ADD CONSTRAINT fk_posts_town 
            FOREIGN KEY (town_id) REFERENCES towns(id) ON DELETE SET NULL;
    END IF;
END $$;
    
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_market_town') THEN
        ALTER TABLE market_items 
            ADD CONSTRAINT fk_market_town 
            FOREIGN KEY (town_id) REFERENCES towns(id) ON DELETE SET NULL;
    END IF;
END $$;

COMMIT;

-- =========================================================
-- SÓC DE POBLE: SCRIPT MAESTRO (VERSION IDEMPOTENTE)
-- =========================================================

-- 1. SEGURIDAD (RLS) PARA TABLAS EXISTENTES
ALTER TABLE IF EXISTS chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS market_items ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    -- Chats
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'chats' AND policyname = 'Public chats are viewable by everyone') THEN
        CREATE POLICY "Public chats are viewable by everyone" ON chats FOR SELECT USING (true);
    END IF;
    -- Messages
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'messages' AND policyname = 'Public messages are viewable by everyone') THEN
        CREATE POLICY "Public messages are viewable by everyone" ON messages FOR SELECT USING (true);
    END IF;
    -- Posts
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'posts' AND policyname = 'Public posts are viewable by everyone') THEN
        CREATE POLICY "Public posts are viewable by everyone" ON posts FOR SELECT USING (true);
    END IF;
    -- Market
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'market_items' AND policyname = 'Public market_items are viewable by everyone') THEN
        CREATE POLICY "Public market_items are viewable by everyone" ON market_items FOR SELECT USING (true);
    END IF;
END $$;

-- 2. PUEBLOS
CREATE TABLE IF NOT EXISTS towns (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    logo_url TEXT,
    image_url TEXT,
    population INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO towns (name, description, logo_url, population) 
VALUES 
-- L''Alacantí (Torre de les Maçanes primero por petición)
('La Torre de les Maçanes', 'Un poble pintoresc entre muntanyes, famós pel seu pa, mels i la seua pau absoluta.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Escut_de_la_Torre_de_les_Ma%C3%A7anes.svg/1200px-Escut_de_la_Torre_de_les_Ma%C3%A7anes.svg.png', 700),

-- Comtat
('Cocentaina', 'Capital del Comtat. Vila comtal amb una fira mil·lenària i un patrimoni medieval heroic.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Escut_de_Cocentaina.svg/1200px-Escut_de_Cocentaina.svg.png', 11500),
('Muro d''Alcoi', 'Porta de la Vall d''Albaida. Conegut pel seu esperit emprenedor i les seues festes de Moros i Cristians.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Escut_de_Muro.svg/1200px-Escut_de_Muro.svg.png', 9300),
('Beniarrés', 'Als peus del Benicadell i vora l''embassament. Un paratge natural incomparable al cor de la serra.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Escut_de_Beniarr%C3%A9s.svg/1200px-Escut_de_Beniarr%C3%A9s.svg.png', 1100),

-- L''Alcoià
('Alcoi', 'La ciutat dels ponts. Bressol de la Revolució Industrial i de la festa de Moros i Cristians més antiga.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Escut_d%27Alcoi.svg/1200px-Escut_d%27Alcoi.svg.png', 59000),
('Banyeres de Mariola', 'El poble més alt de l''Alcoià, enclavat en el Parc Natural de la Serra Mariola.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Escut_de_Banyeres_de_Mariola.svg/1200px-Escut_de_Banyeres_de_Mariola.svg.png', 7100),

-- Marina
('Dénia', 'Capital de la Marina Alta. Ciutat Creativa de la Gastronomia per la UNESCO.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Escut_de_D%C3%A9nia.svg/1200px-Escut_de_D%C3%A9nia.svg.png', 43000),
('Xàbia', 'On surt el sol. Amb el Cap de Sant Antoni i les millors cales del Mediterrani.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Escut_de_X%C3%A0bia.svg/1200px-Escut_de_X%C3%A0bia.svg.png', 28000),

-- Catalunya
('Barcelona', 'Metròpolis modernista, cultural i vibrant oberta al món.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Escut_de_Barcelona.svg/1200px-Escut_de_Barcelona.svg.png', 1600000),
('Girona', 'Ciutat dels quatre rius, amb un barri vell espectacular i una història mil·lenària.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Escut_de_Girona.svg/1200px-Escut_de_Girona.svg.png', 100000)
ON CONFLICT (id) DO NOTHING;

ALTER TABLE towns ENABLE ROW LEVEL SECURITY;
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'towns' AND policyname = 'Public towns are viewable by everyone') THEN
        CREATE POLICY "Public towns are viewable by everyone" ON towns FOR SELECT USING (true);
    END IF;
END $$;

-- 3. LIKES Y FAVORITOS
CREATE TABLE IF NOT EXISTS post_likes (
    id SERIAL PRIMARY KEY,
    post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL, 
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(post_id, user_id)
);

ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'post_likes' AND policyname = 'Public post_likes viewable by everyone') THEN
        CREATE POLICY "Public post_likes viewable by everyone" ON post_likes FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'post_likes' AND policyname = 'Anyone can insert likes') THEN
        CREATE POLICY "Anyone can insert likes" ON post_likes FOR INSERT WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'post_likes' AND policyname = 'Anyone can delete likes') THEN
        CREATE POLICY "Anyone can delete likes" ON post_likes FOR DELETE USING (true);
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS market_favorites (
    id SERIAL PRIMARY KEY,
    item_id INTEGER REFERENCES market_items(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(item_id, user_id)
);

ALTER TABLE market_favorites ENABLE ROW LEVEL SECURITY;
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'market_favorites' AND policyname = 'Public market_favorites viewable by everyone') THEN
        CREATE POLICY "Public market_favorites viewable by everyone" ON market_favorites FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'market_favorites' AND policyname = 'Anyone can insert favorites') THEN
        CREATE POLICY "Anyone can insert favorites" ON market_favorites FOR INSERT WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'market_favorites' AND policyname = 'Anyone can delete favorites') THEN
        CREATE POLICY "Anyone can delete favorites" ON market_favorites FOR DELETE USING (true);
    END IF;
END $$;

-- 4. PERFILES
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    username TEXT UNIQUE,
    avatar_url TEXT,
    role TEXT DEFAULT 'vei',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Profiles are viewable by everyone') THEN
        CREATE POLICY "Profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can update their own profile') THEN
        CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
    END IF;
END $$;

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
('Altea', 'La cúpula del Mediterrani. Un poble amb encant, cases blanques i carrers empedrats.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Escut_d%27Altea.svg/1200px-Escut_d%27Altea.svg.png', 23000),
('Dénia', 'Capital de la Marina Alta. Famosa pel seu castell, el port i la seua gastronomia (la gamba roja).', 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Escudo_de_Denia.svg', 43000),
('Xàbia', 'On surt el sol a la Comunitat Valenciana. Amb cales impressionants i el Montgó dominant el paisatge.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Escut_de_X%C3%A0bia.svg/1200px-Escut_de_X%C3%A0bia.svg.png', 28000),
('Bocairent', 'Un poble tallat a la roca. Declarat conjunt historicoartístic nacional.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Escut_de_Bocairent.svg/1200px-Escut_de_Bocairent.svg.png', 4200)
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

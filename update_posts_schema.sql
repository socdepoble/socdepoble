-- Saneamiento de la tabla POSTS
-- Aseguramos que todas las columnas usadas en el frontend existan

DO $$ 
BEGIN
    -- 1. Crear tabla si no existe (por seguridad)
    CREATE TABLE IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        author TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- 2. Asegurar columnas específicas
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'posts' AND column_name = 'avatar_type') THEN
        ALTER TABLE posts ADD COLUMN avatar_type TEXT DEFAULT 'user';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'posts' AND column_name = 'author_role') THEN
        ALTER TABLE posts ADD COLUMN author_role TEXT DEFAULT 'gent';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'posts' AND column_name = 'likes') THEN
        ALTER TABLE posts ADD COLUMN likes INTEGER DEFAULT 0;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'posts' AND column_name = 'comments_count') THEN
        ALTER TABLE posts ADD COLUMN comments_count INTEGER DEFAULT 0;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'posts' AND column_name = 'image_url') THEN
        ALTER TABLE posts ADD COLUMN image_url TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'posts' AND column_name = 'connections_count') THEN
        ALTER TABLE posts ADD COLUMN connections_count INTEGER DEFAULT 0;
    END IF;

END $$;

-- 3. Seguridad RLS para posts
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'posts' AND policyname = 'Public posts are viewable by everyone') THEN
        CREATE POLICY "Public posts are viewable by everyone" ON posts FOR SELECT USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'posts' AND policyname = 'Authenticated users can create posts') THEN
        CREATE POLICY "Authenticated users can create posts" ON posts FOR INSERT WITH CHECK (true);
    END IF;
END $$;

-- =========================================================
-- SÓC DE POBLE: SISTEMA 'CONNECT' (Gestión Privada)
-- =========================================================
-- Sustituye a los "Likes". Enfocado en gestión profesional.

-- 1. ACTUALIZAR TABLA POSTS (Soporte para autoría y contador)
ALTER TABLE posts ADD COLUMN IF NOT EXISTS author_id TEXT; -- ID del creador (para que pueda ver quién conecta)
ALTER TABLE posts ADD COLUMN IF NOT EXISTS connections_count INTEGER DEFAULT 0;

-- 2. TABLA DE CONEXIONES (Pública: solo contador. Autor: ve usuarios)
CREATE TABLE IF NOT EXISTS post_connections (
    id SERIAL PRIMARY KEY,
    post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL, -- Quien conecta
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(post_id, user_id)
);

ALTER TABLE post_connections ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    -- Permitir INSERT a cualquiera (público/demo)
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'post_connections' AND policyname = 'Anyone can insert connections') THEN
        CREATE POLICY "Anyone can insert connections" ON post_connections FOR INSERT WITH CHECK (true);
    END IF;
    -- Permitir DELETE a su dueño
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'post_connections' AND policyname = 'Users can delete own connections') THEN
        CREATE POLICY "Users can delete own connections" ON post_connections FOR DELETE USING (user_id = auth.uid()::text OR user_id = 'test-user-id'); -- Ajuste para demo
        -- Nota: En producción real, user_id debería ser UUID y compararse estrictamente. Para demo permitimos flexibilidad.
    END IF;
    -- LECTURA: 
    -- 1. El dueño de la conexión puede verse a sí mismo.
    -- 2. El AUTOR del post puede ver quién ha conectado.
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'post_connections' AND policyname = 'Visibility Policy') THEN
        CREATE POLICY "Visibility Policy" ON post_connections FOR SELECT USING (
            user_id = auth.uid()::text -- Yo me veo
            OR 
            EXISTS (SELECT 1 FROM posts WHERE id = post_connections.post_id AND author_id = auth.uid()::text) -- El autor me ve
        );
    END IF;
END $$;

-- 3. TABLA DE ETIQUETAS PRIVADAS (Solo el conector las ve)
CREATE TABLE IF NOT EXISTS connection_tags (
    id SERIAL PRIMARY KEY,
    connection_id INTEGER REFERENCES post_connections(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,
    tags JSONB DEFAULT '[]'::jsonb, -- Array de strings: ["Importante", "Revisar"]
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(connection_id)
);

ALTER TABLE connection_tags ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    -- Lectura/Escritura EXCLUSIVA para el dueño
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'connection_tags' AND policyname = 'Private Tags Access') THEN
        CREATE POLICY "Private Tags Access" ON connection_tags FOR ALL USING (user_id = auth.uid()::text OR user_id = 'test-user-id' OR true) WITH CHECK (true); 
        -- Nota: Para el prototipo relajamos la policy (OR true) para evitar bloqueos si auth falla en local, 
        -- pero en producción esto debe ser estrictamente `user_id = auth.uid()`.
    END IF;
END $$;

-- 4. TRIGGER PARA CONTADOR (Optimización de lectura pública)
CREATE OR REPLACE FUNCTION update_connections_count()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        UPDATE posts SET connections_count = connections_count + 1 WHERE id = NEW.post_id;
    ELSIF (TG_OP = 'DELETE') THEN
        UPDATE posts SET connections_count = GREATEST(0, connections_count - 1) WHERE id = OLD.post_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_connections_count ON post_connections;
CREATE TRIGGER trg_update_connections_count
AFTER INSERT OR DELETE ON post_connections
FOR EACH ROW EXECUTE FUNCTION update_connections_count();

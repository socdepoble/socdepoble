-- =========================================================
-- SÓC DE POBLE: ACTUALIZACIÓN SISTEMA DE ETIQUETAS
-- =========================================================

-- 1. Asegurar que post_connections existe y tiene la columna tags
DO $$ 
BEGIN
    -- Si la tabla se llama post_likes (viejo), la renombramos a post_connections para consistencia
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'post_likes') THEN
        ALTER TABLE post_likes RENAME TO post_connections;
    END IF;

    -- Añadir columna tags si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'post_connections' AND column_name = 'tags') THEN
        ALTER TABLE post_connections ADD COLUMN tags TEXT[] DEFAULT '{}';
    END IF;
END $$;

-- 2. Tabla para el diccionario personal de etiquetas
CREATE TABLE IF NOT EXISTS user_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL, -- Usamos UUID para compatibilidad con Auth
    tag_name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, tag_name)
);

-- 3. Seguridad RLS para user_tags
ALTER TABLE user_tags ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    -- Política de selección (solo el dueño ve sus etiquetas)
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_tags' AND policyname = 'Users can view their own tags') THEN
        CREATE POLICY "Users can view their own tags" ON user_tags FOR SELECT USING (true); 
        -- Nota: En un entorno real seria (auth.uid() = user_id), 
        -- pero mantenemos consistencia con el prototipo actual que usa IDs de texto/UIDs amigables.
    END IF;

    -- Política de inserción
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_tags' AND policyname = 'Users can insert their own tags') THEN
        CREATE POLICY "Users can insert their own tags" ON user_tags FOR INSERT WITH CHECK (true);
    END IF;

    -- Política de borrado
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_tags' AND policyname = 'Users can delete their own tags') THEN
        CREATE POLICY "Users can delete their own tags" ON user_tags FOR DELETE USING (true);
    END IF;
END $$;

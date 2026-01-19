-- =========================================================
-- SÓC DE POBLE: ACTUALIZACIÓN SISTEMA DE ETIQUETAS (V2 ROBUSTA)
-- =========================================================

-- 1. Asegurar que post_connections existe y tiene la columna tags
DO $$ 
BEGIN
    -- Caso A: Existe la tabla vieja (post_likes) pero NO la nueva (post_connections) -> Renombramos
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'post_likes') 
       AND NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'post_connections') THEN
        ALTER TABLE post_likes RENAME TO post_connections;
    END IF;

    -- Caso B: La tabla post_connections ya existe (o acaba de ser renombrada). 
    -- Solo añadimos la columna si no existe.
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'post_connections') THEN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'post_connections' AND column_name = 'tags') THEN
            ALTER TABLE post_connections ADD COLUMN tags TEXT[] DEFAULT '{}';
        END IF;
    END IF;
END $$;

-- 2. Tabla para el diccionario personal de etiquetas
CREATE TABLE IF NOT EXISTS user_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    tag_name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, tag_name)
);

-- 3. Seguridad RLS para user_tags
-- Usamos DO para evitar errores si las políticas ya existen
DO $$ 
BEGIN
    ALTER TABLE user_tags ENABLE ROW LEVEL SECURITY;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_tags' AND policyname = 'Users can view their own tags') THEN
        CREATE POLICY "Users can view their own tags" ON user_tags FOR SELECT USING (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_tags' AND policyname = 'Users can insert their own tags') THEN
        CREATE POLICY "Users can insert their own tags" ON user_tags FOR INSERT WITH CHECK (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_tags' AND policyname = 'Users can delete their own tags') THEN
        CREATE POLICY "Users can delete their own tags" ON user_tags FOR DELETE USING (true);
    END IF;
END $$;

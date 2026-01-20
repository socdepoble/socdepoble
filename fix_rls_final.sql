-- =========================================================
-- SÓC DE POBLE: CORRECCIÓN FINAL DE SEGURIDAD (RLS) - V2
-- =========================================================

-- 1. Habilitar RLS en tablas críticas
ALTER TABLE IF EXISTS post_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS user_tags ENABLE ROW LEVEL SECURITY;

-- 2. Limpiar políticas antiguas
DROP POLICY IF EXISTS "Public post_connections are viewable by everyone" ON post_connections;
DROP POLICY IF EXISTS "Users can manage their own connections" ON post_connections;
DROP POLICY IF EXISTS "Public select post_connections" ON post_connections;
DROP POLICY IF EXISTS "Users can insert their own connections" ON post_connections;
DROP POLICY IF EXISTS "Users can update their own connections" ON post_connections;
DROP POLICY IF EXISTS "Users can delete their own connections" ON post_connections;
DROP POLICY IF EXISTS "Users can view their own tags" ON user_tags;
DROP POLICY IF EXISTS "Users can insert their own tags" ON user_tags;
DROP POLICY IF EXISTS "Users can delete their own tags" ON user_tags;

-- 3. Políticas para post_connections
-- Usamos casting ::text para evitar el error "operator does not exist: uuid = text"
CREATE POLICY "Public select post_connections" ON post_connections
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own connections" ON post_connections
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own connections" ON post_connections
    FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete their own connections" ON post_connections
    FOR DELETE USING (auth.uid()::text = user_id::text);


-- 4. Políticas para user_tags (Diccionario personal)
CREATE POLICY "Users can view their own tags" ON user_tags
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert their own tags" ON user_tags
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete their own tags" ON user_tags
    FOR DELETE USING (auth.uid()::text = user_id::text);

-- 5. Asegurar columna tags en post_connections
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'post_connections' AND column_name = 'tags') THEN
        ALTER TABLE post_connections ADD COLUMN tags TEXT[] DEFAULT '{}';
    END IF;
END $$;

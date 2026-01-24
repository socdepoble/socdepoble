-- =========================================================
-- BLINDAJE SISTEMA MAESTRO (Auditoría Técnica - Fase 2)
-- VERSIÓN DEFINITIVA: Esquema, Tipos y Hardening
-- =========================================================

BEGIN;

-- 0. ASEGURAR ESQUEMA COMPLETO DE ENTIDADES
-- Añadimos las columnas necesarias si no existen
ALTER TABLE entities ADD COLUMN IF NOT EXISTS town_uuid UUID;
ALTER TABLE entities ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false;

-- Actualizamos los tipos permitidos para aceptar catalán e inglés (compatibilidad total)
ALTER TABLE entities DROP CONSTRAINT IF EXISTS entities_type_check;
ALTER TABLE entities ADD CONSTRAINT entities_type_check CHECK (type IN ('grup', 'empresa', 'oficial', 'business', 'official'));

-- 1. FUNCIÓN RPC PARA LIMPIEZA DE ASSETS HUÉRFANOS
CREATE OR REPLACE FUNCTION get_orphaned_assets()
RETURNS SETOF media_assets AS $$
BEGIN
    RETURN QUERY
    SELECT * FROM media_assets
    WHERE id NOT IN (SELECT asset_id FROM media_usage);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. SEED DE ENTIDADES PLAYGROUND (ENTORNO DEMO)
-- Registramos las identidades oficiales y de negocio para evitar errores 404
INSERT INTO entities (id, name, type, town_uuid, is_demo)
VALUES 
    ('00000000-0000-0000-0000-000000000011', 'Ajuntament de la Torre', 'oficial', (SELECT uuid FROM towns WHERE name = 'La Torre de les Maçanes' LIMIT 1), true),
    ('00000000-0000-0000-0000-000000000013', 'Forn de la Plaça', 'empresa', (SELECT uuid FROM towns WHERE name = 'La Torre de les Maçanes' LIMIT 1), true),
    ('00000000-0000-0000-0000-000000000022', 'Turisme Cocentaina', 'oficial', (SELECT uuid FROM towns WHERE name = 'Cocentaina' LIMIT 1), true),
    ('00000000-0000-0000-0000-000000000018', 'Centre Excursionista Penàguila', 'grup', (SELECT uuid FROM towns WHERE name = 'Penàguila' LIMIT 1), true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    type = EXCLUDED.type,
    town_uuid = EXCLUDED.town_uuid,
    is_demo = true;

-- 3. REFUERZO DE POLÍTICAS RLS (HARDENING)
DROP POLICY IF EXISTS "Users can delete own profile" ON profiles;
CREATE POLICY "Users can delete own profile" ON profiles FOR DELETE USING (auth.uid()::uuid = id::uuid);

DROP POLICY IF EXISTS "Users can only insert their own posts" ON posts;
CREATE POLICY "Users can only insert their own posts" ON posts 
FOR INSERT WITH CHECK (auth.uid()::uuid = author_id::uuid);

-- 4. THROTTLING A NIVEL DE BASE DE DATOS (PROTECCIÓN ANTI-SPAM)
CREATE OR REPLACE FUNCTION check_post_rate_limit()
RETURNS TRIGGER AS $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM posts 
        WHERE author_id = NEW.author_id 
        AND created_at > NOW() - INTERVAL '1 second'
    ) THEN
        RAISE EXCEPTION 'Rate limit exceeded. Acció massa ràpida bloquejada per seguretat.';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_post_rate_limit ON posts;
CREATE TRIGGER trg_post_rate_limit
BEFORE INSERT ON posts
FOR EACH ROW EXECUTE FUNCTION check_post_rate_limit();

-- 5. ÍNDICES DE RENDIMIENTO
CREATE INDEX IF NOT EXISTS idx_media_assets_hash ON media_assets(hash);
CREATE INDEX IF NOT EXISTS idx_media_usage_asset_id ON media_usage(asset_id);

COMMIT;

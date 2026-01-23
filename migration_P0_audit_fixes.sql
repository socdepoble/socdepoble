-- =========================================================
-- SÓC DE POBLE: MIGRACIÓ P0 - AUDITORIA (UUID & STORAGE)
-- =========================================================

BEGIN;

-- 1. PREPARACIÓ DE TAULES (POSTS)
-- ---------------------------------------------------------
-- Afegim uuid si no existeix (per si de cas, tot i que l'auditoria suggereix que no és el PK encara)
ALTER TABLE IF EXISTS posts ADD COLUMN IF NOT EXISTS uuid UUID DEFAULT gen_random_uuid();
UPDATE posts SET uuid = gen_random_uuid() WHERE uuid IS NULL;
ALTER TABLE posts ALTER COLUMN uuid SET NOT NULL;
ALTER TABLE posts ADD CONSTRAINT posts_uuid_unique UNIQUE (uuid);

-- 1.1 Migració de referències a post_connections (si usaven id serial)
-- Primer ens assegurem que la taula té la columna post_uuid
ALTER TABLE IF EXISTS post_connections ADD COLUMN IF NOT EXISTS post_uuid UUID REFERENCES posts(uuid);

-- Sincronitzem (si hi ha post_id serial, l'usem per trobar el uuid)
UPDATE post_connections pc
SET post_uuid = p.uuid
FROM posts p
WHERE pc.post_id = p.id AND pc.post_uuid IS NULL;

-- 1.2 Migració de post_likes
ALTER TABLE IF EXISTS post_likes ADD COLUMN IF NOT EXISTS post_uuid UUID REFERENCES posts(uuid);
UPDATE post_likes pl
SET post_uuid = p.uuid
FROM posts p
WHERE pl.post_id = p.id AND pl.post_uuid IS NULL;


-- 2. PREPARACIÓ DE TAULES (MARKET_ITEMS)
-- ---------------------------------------------------------
ALTER TABLE IF EXISTS market_items ADD COLUMN IF NOT EXISTS uuid UUID DEFAULT gen_random_uuid();
UPDATE market_items SET uuid = gen_random_uuid() WHERE uuid IS NULL;
ALTER TABLE market_items ALTER COLUMN uuid SET NOT NULL;
ALTER TABLE market_items ADD CONSTRAINT market_items_uuid_unique UNIQUE (uuid);

-- 2.1 Migració de market_favorites
ALTER TABLE IF EXISTS market_favorites ADD COLUMN IF NOT EXISTS item_uuid UUID REFERENCES market_items(uuid);
UPDATE market_favorites mf
SET item_uuid = mi.uuid
FROM market_items mi
WHERE mf.item_id = mi.id AND mf.item_uuid IS NULL;


-- 3. INTERCANVI DE CLAMS (SWAP PRIMARY KEYS) - OPCIONAL PERÒ RECOMANAT
-- Per evitar trencar tot el codi de cop, de moment mantindrem l'ID serial com a PK interna,
-- però forçarem que el frontend i les foreign keys principals usin el UUID.

-- 4. SEGURETAT EN STORAGE
-- ---------------------------------------------------------
-- Crear buckets si no existeixen (configuració manual normalment, però provem el RLS)
-- Nota: Supabase storage requereix configuració a la taula storage.buckets i storage.objects

INSERT INTO storage.buckets (id, name, public) 
VALUES ('posts', 'posts', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('profiles', 'profiles', true)
ON CONFLICT (id) DO NOTHING;

-- Habilitar RLS en storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 4.1 Polítiques de Lectura Pública (Tothom pot veure fotos de posts i perfils)
DROP POLICY IF EXISTS "Public Select Storage" ON storage.objects;
CREATE POLICY "Public Select Storage" ON storage.objects
    FOR SELECT USING (bucket_id IN ('posts', 'profiles'));

-- 4.2 Polítiques d'Inserció (Usuaris autenticats poden pujar al seu propi folder o segons rol)
DROP POLICY IF EXISTS "Authenticated User Upload" ON storage.objects;
CREATE POLICY "Authenticated User Upload" ON storage.objects
    FOR INSERT WITH CHECK (
        auth.role() = 'authenticated'
        AND (bucket_id = 'posts' OR bucket_id = 'profiles')
    );

-- 4.3 Polítiques d'Eliminació/Update (Només el propietari - basat en metadades de nom de fitxer o similar)
-- Normalment es guarda el owner_id en el camí del fitxer (ej: 'profiles/uuid/avatar.png')
DROP POLICY IF EXISTS "Owner Management" ON storage.objects;
CREATE POLICY "Owner Management" ON storage.objects
    FOR ALL USING (
        auth.uid() = owner
    );


-- 5. NETEJA DE CONSTANTS SQL (DASHBOARD)
-- ---------------------------------------------------------
-- Actualitzarem la vista enriquida de converses per coherència si cal (Auditoria V3)
-- De moment ens centrem en les taules base.

COMMIT;

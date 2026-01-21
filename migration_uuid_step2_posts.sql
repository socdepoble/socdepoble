-- =========================================================
-- MIGRACIÓN UUID: PASO 2 - POSTS
-- =========================================================

BEGIN;

-- 1. Preparar campos UUID en posts y tablas dependientes
-- Nota: towns.uuid ya es PK desde el Paso 1.
ALTER TABLE posts ADD COLUMN IF NOT EXISTS uuid UUID DEFAULT gen_random_uuid();
ALTER TABLE post_likes ADD COLUMN IF NOT EXISTS post_uuid UUID;
ALTER TABLE post_connections ADD COLUMN IF NOT EXISTS post_uuid UUID;

-- 2. Migrar datos de vinculación
UPDATE post_likes pl
SET post_uuid = p.uuid
FROM posts p
WHERE pl.post_id = p.id;

UPDATE post_connections pc
SET post_uuid = p.uuid
FROM posts p
WHERE pc.post_id = p.id;

-- 3. Hacer UUID la nueva clave primaria en posts
-- Quitar FKs que apuntan a posts(id)
ALTER TABLE post_likes DROP CONSTRAINT IF EXISTS post_likes_post_id_fkey;
ALTER TABLE post_connections DROP CONSTRAINT IF EXISTS post_connections_post_id_fkey;

-- Cambiar PK
ALTER TABLE posts DROP CONSTRAINT IF EXISTS posts_pkey CASCADE;
ALTER TABLE posts ADD PRIMARY KEY (uuid);

-- 4. Re-crear FKs basadas en UUID
ALTER TABLE post_likes
    ADD CONSTRAINT fk_post_likes_post_uuid
    FOREIGN KEY (post_uuid) REFERENCES posts(uuid) ON DELETE CASCADE;

ALTER TABLE post_connections
    ADD CONSTRAINT fk_post_connections_post_uuid
    FOREIGN KEY (post_uuid) REFERENCES posts(uuid) ON DELETE CASCADE;

COMMIT;

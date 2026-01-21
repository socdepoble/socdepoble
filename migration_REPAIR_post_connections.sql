-- =========================================================
-- MIGRACIÓN: REPARAR CONEXIONES (UUID SYNC)
-- =========================================================

BEGIN;

-- 1. Asegurar que los registros antiguos tengan post_uuid sincronizado
-- Si algún post_id (integre) no tiene post_uuid, lo buscamos en la tabla posts
UPDATE post_connections pc
SET post_uuid = p.uuid
FROM posts p
WHERE pc.post_id = p.id AND pc.post_uuid IS NULL;

-- 2. Asegurar que los registros nuevos tengan post_id (si la columna es obligatoria)
-- Esto ayuda con la compatibilidad legacy si todavía hay disparadores antiguos
UPDATE post_connections pc
SET post_id = p.id
FROM posts p
WHERE pc.post_uuid = p.uuid AND pc.post_id IS NULL;

-- 3. Crear índice para post_uuid si no existe (vital para rendimiento del feed)
CREATE INDEX IF NOT EXISTS idx_post_connections_post_uuid ON post_connections(post_uuid);

COMMIT;

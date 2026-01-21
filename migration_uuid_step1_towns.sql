-- =========================================================
-- MIGRACIÓN UUID: PASO 1 - TOWNS
-- =========================================================

BEGIN;

-- 1. Preparar campos UUID en todas las tablas relacionadas
ALTER TABLE towns ADD COLUMN IF NOT EXISTS uuid UUID DEFAULT gen_random_uuid();
ALTER TABLE posts ADD COLUMN IF NOT EXISTS town_uuid UUID;
ALTER TABLE market_items ADD COLUMN IF NOT EXISTS town_uuid UUID;
ALTER TABLE lexicon ADD COLUMN IF NOT EXISTS town_uuid UUID;

-- 2. Migrar datos de vinculación
-- Vincular posts
UPDATE posts p
SET town_uuid = t.uuid
FROM towns t
WHERE p.town_id = t.id
AND p.town_uuid IS NULL;

-- Vincular market_items
UPDATE market_items m
SET town_uuid = t.uuid
FROM towns t
WHERE m.town_id = t.id
AND m.town_uuid IS NULL;

-- Vincular lexicon
UPDATE lexicon l
SET town_uuid = t.uuid
FROM towns t
WHERE l.town_id = t.id
AND l.town_uuid IS NULL;

-- 3. Hacer UUID la nueva clave primaria en towns
-- Primero quitamos la PK anterior (necesita quitar FKs primero)
ALTER TABLE posts DROP CONSTRAINT IF EXISTS fk_posts_town;
ALTER TABLE market_items DROP CONSTRAINT IF EXISTS fk_market_town;
ALTER TABLE lexicon DROP CONSTRAINT IF EXISTS lexicon_town_id_fkey;

ALTER TABLE towns DROP CONSTRAINT IF EXISTS towns_pkey CASCADE;
ALTER TABLE towns ADD PRIMARY KEY (uuid);

-- 4. Crear nuevas claves foráneas basadas en UUID
ALTER TABLE posts 
    ADD CONSTRAINT fk_posts_town_uuid 
    FOREIGN KEY (town_uuid) REFERENCES towns(uuid) ON DELETE SET NULL;

ALTER TABLE market_items 
    ADD CONSTRAINT fk_market_town_uuid 
    FOREIGN KEY (town_uuid) REFERENCES towns(uuid) ON DELETE SET NULL;

ALTER TABLE lexicon 
    ADD CONSTRAINT fk_lexicon_town_uuid 
    FOREIGN KEY (town_uuid) REFERENCES towns(uuid) ON DELETE SET NULL;

-- 5. Limpieza (Opcional por ahora para seguridad, pero marcamos como "legacy")
-- No borramos town_id todavía por si hay código legacy, pero ya no es la PK.

COMMIT;

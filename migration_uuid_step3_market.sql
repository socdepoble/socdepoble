-- =========================================================
-- MIGRACIÓN UUID: PASO 3 - MARKET ITEMS
-- =========================================================

BEGIN;

-- 1. Preparar campos UUID
ALTER TABLE market_items ADD COLUMN IF NOT EXISTS uuid UUID DEFAULT gen_random_uuid();
ALTER TABLE market_favorites ADD COLUMN IF NOT EXISTS item_uuid UUID;

-- 2. Migrar datos de vinculación
UPDATE market_favorites mf
SET item_uuid = m.uuid
FROM market_items m
WHERE mf.item_id = m.id;

-- 3. Hacer UUID la nueva clave primaria
ALTER TABLE market_favorites DROP CONSTRAINT IF EXISTS market_favorites_item_id_fkey;

ALTER TABLE market_items DROP CONSTRAINT IF EXISTS market_items_pkey CASCADE;
ALTER TABLE market_items ADD PRIMARY KEY (uuid);

-- 4. Re-crear FKs basadas en UUID
ALTER TABLE market_favorites
    ADD CONSTRAINT fk_market_favorites_item_uuid
    FOREIGN KEY (item_uuid) REFERENCES market_items(uuid) ON DELETE CASCADE;

COMMIT;

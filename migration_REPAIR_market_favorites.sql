-- =========================================================
-- MIGRACIÓN: REPARAR FAVORITOS MERCADO (UUID SYNC)
-- =========================================================

BEGIN;

-- 1. Asegurar que la columna item_uuid existe (por si acaso no se creó en pasos previos)
ALTER TABLE market_favorites ADD COLUMN IF NOT EXISTS item_uuid UUID;

-- 2. Sincronizar registros antiguos: buscar el UUID del item basado en su ID entero
UPDATE market_favorites mf
SET item_uuid = mi.uuid
FROM market_items mi
WHERE mf.item_id = mi.id AND mf.item_uuid IS NULL;

-- 3. Crear índice para item_uuid para optimizar las consultas del mercado
CREATE INDEX IF NOT EXISTS idx_market_favorites_item_uuid ON market_favorites(item_uuid);

COMMIT;

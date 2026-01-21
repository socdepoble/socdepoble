-- =========================================================
-- MIGRACIÓN UUID: PASO 1b - PROFILES
-- =========================================================

BEGIN;

-- 1. Agregar town_uuid a profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS town_uuid UUID;

-- 2. Migrar datos de vinculación
UPDATE profiles p
SET town_uuid = t.uuid
FROM towns t
WHERE p.town_id = t.id
AND p.town_uuid IS NULL;

-- 3. Crear clave foránea
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_town_id_fkey;
ALTER TABLE profiles 
    ADD CONSTRAINT fk_profiles_town_uuid 
    FOREIGN KEY (town_uuid) REFERENCES towns(uuid) ON DELETE SET NULL;

COMMIT;

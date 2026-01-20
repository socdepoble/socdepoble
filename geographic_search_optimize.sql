-- =========================================================
-- SÓC DE POBLE: OPTIMITZACIÓ DE CERCA GEOGRÀFICA
-- =========================================================

-- 0. Assegurar que les columnes existeixen
ALTER TABLE towns ADD COLUMN IF NOT EXISTS province TEXT;
ALTER TABLE towns ADD COLUMN IF NOT EXISTS comarca TEXT;
ALTER TABLE towns ADD COLUMN IF NOT EXISTS search_names TEXT;

-- 1. Assegurar que les ciutats principals estan presents
INSERT INTO towns (name, province, comarca, population) VALUES
('Alacant', 'Alacant', 'L''Alacantí', 337000),
('València', 'València', 'València', 800000),
('Castelló de la Plana', 'Castelló', 'Plana Alta', 170000),
('Barcelona', 'Barcelona', 'Barcelonès', 1620000),
('Girona', 'Girona', 'Gironès', 103000),
('Lleida', 'Lleida', 'Segrià', 140000),
('Tarragona', 'Tarragona', 'Tarragonès', 135000)
ON CONFLICT (name) DO UPDATE SET 
    province = EXCLUDED.province,
    comarca = EXCLUDED.comarca,
    population = EXCLUDED.population;

-- 2. Crear índexs GIN per a cerca ràpida (trigramas)
-- Nota: Requereix l'extensió pg_trgm
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX IF NOT EXISTS idx_towns_name_trgm ON towns USING gin (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_towns_comarca_trgm ON towns USING gin (comarca gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_towns_province_trgm ON towns USING gin (province gin_trgm_ops);

-- 3. Actualitzar dades existents per a coherència (exemples)
UPDATE towns SET comarca = 'L''Alacantí' WHERE name = 'Alicante' OR name = 'Alacant';
UPDATE towns SET province = 'Alacant' WHERE comarca = 'L''Alacantí';

-- 4. Opcional: Columna de cerca unificada per a FTS
ALTER TABLE towns ADD COLUMN IF NOT EXISTS search_names TEXT;
UPDATE towns SET search_names = name || ' ' || COALESCE(comarca, '') || ' ' || province;

CREATE INDEX IF NOT EXISTS idx_towns_search_names_trgm ON towns USING gin (search_names gin_trgm_ops);

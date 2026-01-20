-- =========================================================
-- SÓC DE POBLE: JERARQUIA DE POBLES (Província > Comarca)
-- =========================================================

-- 1. Ampliar taula de pobles
ALTER TABLE towns ADD COLUMN IF NOT EXISTS province TEXT;
ALTER TABLE towns ADD COLUMN IF NOT EXISTS comarca TEXT;

-- 2. Actualitzar dades existents amb la seua jerarquia
UPDATE towns SET province = 'Alacant', comarca = 'l''Alacantí' WHERE id = 101; -- La Torre de les Maçanes
UPDATE towns SET province = 'Alacant', comarca = 'La Marina Alta' WHERE name IN ('Altea', 'Dénia', 'Xàbia');
UPDATE towns SET province = 'Alacant', comarca = 'La Marina Baixa' WHERE name = 'Relleu';
UPDATE towns SET province = 'Alacant', comarca = 'El Comtat' WHERE name = 'Penàguila';
UPDATE towns SET province = 'Alacant', comarca = 'L''Alcoià' WHERE name = 'Alcoi';
UPDATE towns SET province = 'Alacant', comarca = 'Baix Segura' WHERE name = 'Benijòfar'; -- Example
UPDATE towns SET province = 'Castelló', comarca = 'Baix Maestrat' WHERE name = 'Benicarló';

-- 3. Inserir mostres de Catalunya i València per a provar l'escalat
INSERT INTO towns (name, province, comarca, population) VALUES
-- València
('Xàtiva', 'València', 'La Costera', 29000),
('Gandia', 'València', 'La Safor', 75000),
('Ontinyent', 'València', 'La Vall d''Albaida', 35000),
-- Catalunya
('Girona', 'Girona', 'Gironès', 103000),
('Vic', 'Barcelona', 'Osona', 47000),
('Reus', 'Tarragona', 'Baix Camp', 106000),
('Balaguer', 'Lleida', 'Noguera', 17000)
ON CONFLICT DO NOTHING;

-- 4. Crear índexs de cerca
CREATE INDEX IF NOT EXISTS idx_towns_province ON towns(province);
CREATE INDEX IF NOT EXISTS idx_towns_comarca ON towns(comarca);

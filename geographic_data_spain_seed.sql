-- =========================================================
-- SÓC DE POBLE: BASE DE DADES GEOGRÀFICA COMPLETA ESPANYA
-- =========================================================

-- 1. Assegurar columnes i índexs
ALTER TABLE towns ADD COLUMN IF NOT EXISTS population INTEGER;

-- 2. Inserció de Províncies i Capitals (Baseline)
INSERT INTO towns (name, province, comarca, population) VALUES
('Madrid', 'Madrid', 'Comunidad de Madrid', 3300000),
('Barcelona', 'Barcelona', 'Barcelonès', 1620000),
('València', 'València', 'València', 800000),
('Sevilla', 'Sevilla', 'Metropolitana de Sevilla', 680000),
('Zaragoza', 'Zaragoza', 'Zaragoza', 670000),
('Málaga', 'Málaga', 'Málaga - Costa del Sol', 570000),
('Murcia', 'Murcia', 'Huerta de Murcia', 460000),
('Palma de Mallorca', 'Illes Balears', 'Palma', 420000),
('Las Palmas de Gran Canaria', 'Las Palmas', 'Gran Canaria', 380000),
('Bilbao', 'Bizkaia', 'Gran Bilbao', 345000),
('Alacant', 'Alacant', 'L''Alacantí', 337000),
('Valladolid', 'Valladolid', 'Campaña del Pisuerga', 300000),
('Vigo', 'Pontevedra', 'Vigo', 295000),
('Gijón', 'Asturias', 'Gijón', 270000),
('L''Hospitalet de Llobregat', 'Barcelona', 'Barcelonès', 265000),
('Vitoria-Gasteiz', 'Àlaba', 'Cuadrilla de Vitoria', 250000),
('A Coruña', 'A Coruña', 'A Coruña', 245000),
('Granada', 'Granada', 'Vega de Granada', 235000),
('Elx', 'Alacant', 'Baix Vinalopó', 230000),
('Oviedo', 'Asturias', 'Oviedo', 220000),
('Santa Cruz de Tenerife', 'Santa Cruz de Tenerife', 'Tenerife', 205000),
('Badalona', 'Barcelona', 'Barcelonès', 220000),
('Cartagena', 'Murcia', 'Campo de Cartagena', 215000),
('Terrassa', 'Barcelona', 'Vallès Occidental', 220000),
('Jerez de la Frontera', 'Cadis', 'Campiña de Jerez', 213000),
('Sabadell', 'Barcelona', 'Vallès Occidental', 215000),
('Móstoles', 'Madrid', 'Metropolitana de Madrid', 210000),
('Alcalá de Henares', 'Madrid', 'Cuenca del Henares', 195000),
('Pamplona', 'Navarra', 'Cuenca de Pamplona', 200000),
('Fuenlabrada', 'Madrid', 'Metropolitana de Madrid', 190000),
('Almeria', 'Almeria', 'Almeria', 200000),
('Leganés', 'Madrid', 'Metropolitana de Madrid', 190000),
('Donostia-San Sebastián', 'Gipuzkoa', 'Donostialdea', 188000),
('Santander', 'Cantàbria', 'Santander', 172000),
('Castelló de la Plana', 'Castelló', 'Plana Alta', 170000),
('Getafe', 'Madrid', 'Metropolitana de Madrid', 185000),
('Alcorcón', 'Madrid', 'Metropolitana de Madrid', 170000),
('Burgos', 'Burgos', 'Alfoz de Burgos', 175000),
('Albacete', 'Albacete', 'Llanos de Albacete', 173000),
('Logroño', 'La Rioja', 'Logroño', 150000),
('Badajoz', 'Badajoz', 'Badajoz', 150000),
('Huelva', 'Huelva', 'Metropolitana de Huelva', 143000),
('Salamanca', 'Salamanca', 'Salamanca', 144000),
('Lleida', 'Lleida', 'Segrià', 140000),
('Marbella', 'Málaga', 'Sierra de las Nieves', 147000),
('Tarragona', 'Tarragona', 'Tarragonès', 135000),
('Dos Hermanas', 'Sevilla', 'Metropolitana de Sevilla', 135000),
('Parla', 'Madrid', 'Metropolitana de Madrid', 130000),
('Torrejón de Ardoz', 'Madrid', 'Cuenca del Henares', 130000),
('Mataró', 'Barcelona', 'Maresme', 128000),
('León', 'León', 'León', 124000),
('Algesires', 'Cadis', 'Campo de Gibraltar', 122000),
('Santa Coloma de Gramenet', 'Barcelona', 'Barcelonès', 119000),
('Alcobendas', 'Madrid', 'Metropolitana de Madrid', 117000),
('Cadis', 'Cadis', 'Bahía de Cádiz', 115000),
('Jaén', 'Jaén', 'Metropolitana de Jaén', 112000),
('Ourense', 'Ourense', 'Ourense', 105000),
('Reus', 'Tarragona', 'Baix Camp', 106000),
('Telde', 'Las Palmas', 'Gran Canaria', 102000),
('Barakaldo', 'Bizkaia', 'Gran Bilbao', 100000),
('Lugo', 'Lugo', 'Lugo', 98000),
('Girona', 'Girona', 'Gironès', 103000),
('Càceres', 'Càceres', 'Càceres', 96000),
('Santiago de Compostela', 'A Coruña', 'Santiago', 97000),
('Guadalajara', 'Guadalajara', 'Campiña', 87000),
('Toledo', 'Toledo', 'Toledo', 85000),
('Pontevedra', 'Pontevedra', 'Pontevedra', 83000),
('Palència', 'Palència', 'Palència', 78000),
('Ciudad Real', 'Ciudad Real', 'Ciudad Real', 75000),
('Zamora', 'Zamora', 'Zamora', 60000),
('Àvila', 'Àvila', 'Àvila', 58000),
('Cuenca', 'Cuenca', 'Cuenca', 54000),
('Osca', 'Osca', 'Hoya de Huesca', 53000),
('Segòvia', 'Segòvia', 'Segòvia', 52000),
('Sòria', 'Sòria', 'Sòria', 39000),
('Terol', 'Terol', 'Terol', 35000),
-- Ceuta i Melilla
('Ceuta', 'Ceuta', 'Ceuta', 85000),
('Melilla', 'Melilla', 'Melilla', 86000)
ON CONFLICT (name) DO UPDATE SET 
    province = EXCLUDED.province,
    comarca = EXCLUDED.comarca,
    population = EXCLUDED.population;

-- 3. Inserció d'exemple per a "L'Alacantí" per a garantir que apareix "La Torre de les Maçanes"
INSERT INTO towns (name, province, comarca, population) VALUES
('La Torre de les Maçanes', 'Alacant', 'L''Alacantí', 700),
('Sant Joan d''Alacant', 'Alacant', 'L''Alacantí', 24000),
('Mutxamel', 'Alacant', 'L''Alacantí', 25000),
('El Campello', 'Alacant', 'L''Alacantí', 28000),
('Agost', 'Alacant', 'L''Alacantí', 4800),
('Aigües', 'Alacant', 'L''Alacantí', 1000),
('Busot', 'Alacant', 'L''Alacantí', 3000),
('Xixona', 'Alacant', 'L''Alacantí', 7000),
('San Vicent del Raspeig', 'Alacant', 'L''Alacantí', 58000)
ON CONFLICT (name) DO UPDATE SET 
    province = EXCLUDED.province,
    comarca = EXCLUDED.comarca,
    population = EXCLUDED.population;

-- 4. Inserció de Pobles de la Comunitat Valenciana (Acréixer la base)
INSERT INTO towns (name, province, comarca, population) VALUES
('Altea', 'Alacant', 'La Marina Baixa', 22000),
('Dénia', 'Alacant', 'La Marina Alta', 42000),
('Xàbia', 'Alacant', 'La Marina Alta', 28000),
('Alcoi', 'Alacant', 'L''Alcoià', 59000),
('Ontinyent', 'València', 'La Vall d''Albaida', 35000),
('Xàtiva', 'València', 'La Costera', 29000),
('Gandia', 'València', 'La Safor', 75000),
('Alzira', 'València', 'Ribera Alta', 44000),
('Sagunt', 'València', 'Camp de Morvedre', 66000),
('Benicàssim', 'Castelló', 'Plana Alta', 18000),
('Vila-real', 'Castelló', 'Plana Baixa', 51000),
('Vinaròs', 'Castelló', 'Baix Maestrat', 28000)
ON CONFLICT (name) DO UPDATE SET 
    province = EXCLUDED.province,
    comarca = EXCLUDED.comarca,
    population = EXCLUDED.population;

-- 5. Crear índexs de província per a velocitat si no existien
CREATE INDEX IF NOT EXISTS idx_towns_province_lookup ON towns(province);
CREATE INDEX IF NOT EXISTS idx_towns_comarca_lookup ON towns(comarca);

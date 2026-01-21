-- =========================================================
-- MIGRACIÓN: REPARACIÓN ESTRUCTURA Y LIMPIEZA LOCAL
-- =========================================================

-- 1. Añadir columnas faltantes a 'towns'
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'towns' AND column_name = 'province') THEN
        ALTER TABLE towns ADD COLUMN province TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'towns' AND column_name = 'comarca') THEN
        ALTER TABLE towns ADD COLUMN comarca TEXT;
    END IF;
END $$;

-- 2. Añadir town_id a posts y market_items
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'posts' AND column_name = 'town_id') THEN
        ALTER TABLE posts ADD COLUMN town_id INTEGER;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'market_items' AND column_name = 'town_id') THEN
        ALTER TABLE market_items ADD COLUMN town_id INTEGER;
    END IF;
END $$;

-- 3. Limpieza y Re-sembrado de Pueblos (Catalanoparlantes)
TRUNCATE TABLE towns RESTART IDENTITY CASCADE;

INSERT INTO towns (name, province, comarca, description, logo_url, population) 
VALUES 
('La Torre de les Maçanes', 'Alacant', 'L''Alacantí', 'Un poble pintoresc entre muntanyes, famós pel seu pa, mels i la seua pau absoluta.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Escut_de_la_Torre_de_les_Ma%C3%A7anes.svg/1200px-Escut_de_la_Torre_de_les_Ma%C3%A7anes.svg.png', 700),
('Cocentaina', 'Alacant', 'El Comtat', 'Capital del Comtat. Vila comtal amb una fira mil·lenària i un patrimoni medieval heroic.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Escut_de_Cocentaina.svg/1200px-Escut_de_Cocentaina.svg.png', 11500),
('Muro d''Alcoi', 'Alacant', 'El Comtat', 'Porta de la Vall d''Albaida. Conegut pel seu esperit emprenedor i les seues festes de Moros i Cristians.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Escut_de_Muro.svg/1200px-Escut_de_Muro.svg.png', 9300),
('Alcoi', 'Alacant', 'L''Alcoià', 'La ciutat dels ponts. Bressol de la Revolució Industrial.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Escut_d%27Alcoi.svg/1200px-Escut_d%27Alcoi.svg.png', 59000),
('Banyeres de Mariola', 'Alacant', 'L''Alcoià', 'El poble més alt de l''Alcoià, enclavat en el Parc Natural.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Escut_de_Banyeres_de_Mariola.svg/1200px-Escut_de_Banyeres_de_Mariola.svg.png', 7100),
('Dénia', 'Alacant', 'Marina Alta', 'Capital de la Marina Alta. Ciutat Creativa de la Gastronomia.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Escut_de_D%C3%A9nia.svg/1200px-Escut_de_D%C3%A9nia.svg.png', 43000),
('Xàbia', 'Alacant', 'Marina Alta', 'On surt el sol. Amb el Cap de Sant Antoni.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Escut_de_X%C3%A0bia.svg/1200px-Escut_de_X%C3%A0bia.svg.png', 28000),
('Barcelona', 'Barcelona', 'Barcelonès', 'Metròpolis modernista, cultural i vibrant oberta al món.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Escut_de_Barcelona.svg/1200px-Escut_de_Barcelona.svg.png', 1600000),
('Girona', 'Girona', 'Gironès', 'Ciutat dels quatre rius, amb un barri vell espectacular.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Escut_de_Girona.svg/1200px-Escut_de_Girona.svg.png', 100000);

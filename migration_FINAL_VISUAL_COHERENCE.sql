-- =========================================================
-- SÓC DE POBLE: MASTER VISUAL COHERENCE (v11) - NANO BANANA ASSETS
-- =========================================================

BEGIN;

-- 0. UNIFICACIÓN DE NOMBRE: LA TORRE DE LES MAÇANES
-- Cambiamos cualquier referencia a Torremanzanas por el nombre preferido
UPDATE towns SET name = 'La Torre de les Maçanes' WHERE id = 101 OR name LIKE '%Torremanzanas%';
UPDATE posts SET author = REPLACE(author, 'Torremanzanas', 'de la Torre') WHERE author LIKE '%Torremanzanas%';
UPDATE market_items SET seller = REPLACE(seller, 'Torremanzanas', 'de la Torre') WHERE seller LIKE '%Torremanzanas%';

-- 1. LIMPIEZA Y ASIGNACIÓN EN FEED (MURO)
-- Ajustamos cada publicación a su contexto real usando los nuevos assets premium

-- La Torre de les Maçanes (Poma Local - NUEVA)
UPDATE posts SET 
    image_url = '/images/assets/apples_premium.png',
    author = 'Ajuntament de la Torre',
    content = '🍎 Recordeu que aquest cap de setmana tenim la collita de la poma local. Passeu per la plaça a tastar-les!'
WHERE content LIKE '%poma local%';

-- Cocentaina (Fira de Tots Sants - Palau)
UPDATE posts SET 
    image_url = '/images/assets/palau_cocentaina.png',
    content = '🏰 Ja estem preparant la Fira de Tots Sants! Enguany tindrem novetat a la zona del Palau Comtal. Estigueu atents a la programació!'
WHERE author LIKE '%Cocentaina%' OR content LIKE '%Palau%';

-- La Torre (Médico / Noticia)
UPDATE posts SET 
    image_url = '/images/assets/aviso_oficial.png',
    author = 'Ajuntament de la Torre'
WHERE author LIKE '%Ajuntament%Torre%' OR content LIKE '%médico%';

-- Banda de Música (La Lira)
UPDATE posts SET 
    image_url = '/images/assets/banda_musica.png'
WHERE author LIKE '%Banda%' OR content LIKE '%assaig%';

-- Bar El Chato (Olleta)
UPDATE posts SET 
    image_url = '/images/assets/olleta_premium.png'
WHERE content LIKE '%OLLETA%';

-- Forn de Pa (Coques)
UPDATE posts SET 
    image_url = '/images/assets/coques_premium.png'
WHERE author LIKE '%Forn%' OR content LIKE '%coques%';

-- Senderismo (Rentonar - PAISAJE AITANA)
UPDATE posts SET 
    image_url = '/images/assets/senderisme_aitana.png'
WHERE author LIKE '%Senderisme%' OR content LIKE '%Rentonar%';

-- Festes (Dansà)
UPDATE posts SET 
    image_url = '/images/assets/dansa_festa.png'
WHERE author LIKE '%Festes%' OR content LIKE '%Dansà%';

-- Maria / Veïna (Autobús)
UPDATE posts SET 
    image_url = '/images/assets/bus_stop.png'
WHERE author LIKE '%Maria%Veïna%' OR content LIKE '%autobús%';


-- 2. LIMPIEZA Y ASIGNACIÓN EN MERCAT (Eliminando Unsplash)
UPDATE market_items SET image_url = '/images/assets/oli_premium.png' WHERE title LIKE '%Oli%';
UPDATE market_items SET image_url = '/images/assets/llenya_premium.png' WHERE title LIKE '%Llenya%';
UPDATE market_items SET image_url = '/images/assets/tomates_premium.png' WHERE title LIKE '%Tomates%' OR title LIKE '%Pericana%';
UPDATE market_items SET 
    image_url = '/images/assets/mel_premium.png',
    tag = 'Alimentació'
WHERE title LIKE '%Mel%';
UPDATE market_items SET image_url = '/images/assets/cantir_premium.png' WHERE title LIKE '%Càntir%';
UPDATE market_items SET image_url = '/images/assets/generic_market.png' WHERE title LIKE '%Herbero%';

-- 3. FALLBACK GENERAL PARA COHERENCIA (No más URLs externas)
UPDATE posts SET image_url = '/images/assets/generic_street.png' WHERE image_url IS NULL OR image_url LIKE 'http%';
UPDATE market_items SET image_url = '/images/assets/generic_market.png' WHERE image_url IS NULL OR image_url LIKE 'http%';
UPDATE towns SET image_url = '/images/assets/town_square.png' WHERE image_url IS NULL OR image_url LIKE 'http%';

COMMIT;

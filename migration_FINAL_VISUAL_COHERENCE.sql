-- =========================================================
-- SÓC DE POBLE: MASTER VISUAL COHERENCE (v10) - NANO BANANA ASSETS
-- =========================================================

BEGIN;

-- 1. LIMPIEZA Y ASIGNACIÓN EN FEED (MURO)
-- Ajustamos cada publicación a su contexto real usando los nuevos assets premium

-- Cocentaina (Fira de Tots Sants - Palau)
UPDATE posts SET 
    image_url = '/images/assets/palau_cocentaina.png',
    content = '🏰 Ja estem preparant la Fira de Tots Sants! Enguany tindrem novetat a la zona del Palau Comtal. Estigueu atents a la programació!'
WHERE author LIKE '%Cocentaina%' OR content LIKE '%Palau%';

-- La Torre de les Maçanes (Médico / Noticia)
UPDATE posts SET 
    image_url = '/images/assets/aviso_oficial.png'
WHERE author LIKE '%Ajuntament Torremanzanas%' OR content LIKE '%médico%';

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

-- Senderismo (Rentonar - NO MÁS TOMATES)
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


-- 2. LIMPIEZA Y ASIGNACIÓN EN MERCAT
UPDATE market_items SET image_url = '/images/assets/oli_premium.png' WHERE title LIKE '%Oli%';
UPDATE market_items SET image_url = '/images/assets/llenya_premium.png' WHERE title LIKE '%Llenya%';
UPDATE market_items SET image_url = '/images/assets/tomates_premium.png' WHERE title LIKE '%Tomates%';
UPDATE market_items SET image_url = 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=800' WHERE title LIKE '%Mel%';
UPDATE market_items SET image_url = 'https://images.unsplash.com/photo-1505238680356-667803448bb6?auto=format&fit=crop&q=80&w=800' WHERE title LIKE '%Càntir%';

-- 3. FALLBACK GENERAL PARA COHERENCIA
UPDATE posts SET image_url = '/images/assets/senderisme_aitana.png' WHERE image_url IS NULL;

COMMIT;

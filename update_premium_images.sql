-- =========================================================
-- SÓC DE POBLE: MEJORA VISUAL - IMÁGENES PREMIUM
-- =========================================================

-- 1. Actualizar imágenes del Muro (Feed)
UPDATE posts SET image_url = '/images/assets/aitana.png' WHERE author LIKE '%Excursionista%';
UPDATE posts SET image_url = '/images/assets/olleta.png' WHERE content LIKE '%OLLETA%';
UPDATE posts SET image_url = '/images/assets/oli.png' WHERE content LIKE '%oli nou%';
UPDATE posts SET image_url = '/images/assets/notice.png' WHERE author_role = 'oficial' AND image_url IS NULL;
UPDATE posts SET image_url = '/images/assets/xixona.png' WHERE author LIKE '%Cooperativa%' OR content LIKE '%oli%';
UPDATE posts SET image_url = '/images/assets/generic_street.png' WHERE image_url IS NULL;

-- 2. Actualizar imágenes del Mercat
UPDATE market_items SET image_url = '/images/assets/tomates.png' WHERE title LIKE '%Tomates%';
UPDATE market_items SET image_url = '/images/assets/cantir.png' WHERE title LIKE '%Càntir%';
UPDATE market_items SET image_url = '/images/assets/mel.png' WHERE title LIKE '%Mel%';
UPDATE market_items SET image_url = '/images/assets/formatge.png' WHERE title LIKE '%Formatge%';
UPDATE market_items SET image_url = '/images/assets/generic_market.png' WHERE image_url IS NULL OR image_url LIKE '%unsplash%';

-- 3. Otros elementos visuales
UPDATE lexicon SET term_image = '/images/assets/lexicon.png' WHERE id IS NOT NULL; -- Imagen base para léxico
UPDATE towns SET image_url = '/images/assets/town_square.png' WHERE name = 'Xixona';
UPDATE towns SET image_url = '/images/assets/generic_street.png' WHERE image_url IS NULL;

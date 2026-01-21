-- =========================================================
-- SÓC DE POBLE: MEJORA VISUAL FINAL - UNIFIED PREMIUM IMAGES
-- =========================================================

-- 1. Actualizar imágenes del Muro (Feed)
UPDATE posts SET image_url = 'https://images.unsplash.com/photo-1541890289-b86df5b6fea1?auto=format&fit=crop&q=80&w=800' WHERE author LIKE '%Excursionista%' OR content LIKE '%Ruta%';
UPDATE posts SET image_url = 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=800' WHERE content LIKE '%OLLETA%';
UPDATE posts SET image_url = 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=800' WHERE content LIKE '%oli%';
UPDATE posts SET image_url = 'https://images.unsplash.com/photo-1560806887-1e4cd0b6bccb?auto=format&fit=crop&q=80&w=800' WHERE content LIKE '%poma%';
UPDATE posts SET image_url = 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800' WHERE author_role = 'oficial' AND image_url IS NULL;
UPDATE posts SET image_url = 'https://images.unsplash.com/photo-1543783232-f7258ae96fd1?auto=format&fit=crop&q=80&w=800' WHERE image_url IS NULL;

-- 2. Actualizar imágenes del Mercat
UPDATE market_items SET image_url = 'https://images.unsplash.com/photo-1518977676601-b53f02bad673?auto=format&fit=crop&q=80&w=800' WHERE title LIKE '%Tomates%';
UPDATE market_items SET image_url = 'https://images.unsplash.com/photo-1505238680356-667803448bb6?auto=format&fit=crop&q=80&w=800' WHERE title LIKE '%Càntir%';
UPDATE market_items SET image_url = 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=800' WHERE title LIKE '%Mel%';
UPDATE market_items SET image_url = 'https://images.unsplash.com/photo-1485962391945-420063529633?auto=format&fit=crop&q=80&w=800' WHERE title LIKE '%Formatge%';
UPDATE market_items SET image_url = 'https://images.unsplash.com/photo-1520110120185-13b30ad50e18?auto=format&fit=crop&q=80&w=800' WHERE title LIKE '%Llenya%';
UPDATE market_items SET image_url = 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&q=80&w=800' WHERE image_url IS NULL OR image_url LIKE '%/images/%';

-- 3. Elementos de sistema
UPDATE towns SET image_url = 'https://images.unsplash.com/photo-1533154683836-84ea7a0bc310?auto=format&fit=crop&q=80&w=800' WHERE name = 'La Torre de les Maçanes';
UPDATE towns SET image_url = 'https://images.unsplash.com/photo-1543783232-f7258ae96fd1?auto=format&fit=crop&q=80&w=800' WHERE image_url IS NULL OR image_url LIKE '%/images/%';

COMMIT;

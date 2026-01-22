-- =========================================================
-- MIGRACIÓN: FORMATO DE AUTORÍA MULTI-IDENTIDAD (V5)
-- Actualiza el campo 'author' y 'seller' para incluir el nombre de la persona responsable.
-- =========================================================

BEGIN;

-- 1. Actualizar Posts: Formato "Entidad | Persona"
-- Usamos los metadatos de las semillas para inferir el nombre si es posible, 
-- o mapeamos según los author_user_id conocidos.

-- Vicent (f001...) publica para el Muro de la Torre (Ayuntamiento)
UPDATE posts 
SET author = 'Ayto. La Torre | Vicent'
WHERE author_entity_id = '00000000-0000-0000-0000-000000000011' 
  AND author_user_id = 'f0010000-0000-0000-0000-000000000001';

-- Rosa (f002...) publica para Aroma de Mariola
UPDATE posts 
SET author = 'Aroma de Mariola | Rosa'
WHERE author_entity_id = '00000000-0000-0000-0000-000000000044'
  AND author_user_id = 'f0020000-0000-0000-0000-000000000002';

-- Carles (f003...) publica para La Banda de Música
UPDATE posts 
SET author = 'Banda de Música | Carles'
WHERE author_entity_id = '00000000-0000-0000-0000-000000000066'
  AND author_user_id = 'f0030000-0000-0000-0000-000000000003';

-- Maria (f004...) publica para La Cooperativa
UPDATE posts 
SET author = 'La Cooperativa | Maria'
WHERE author_entity_id = '00000000-0000-0000-0000-000000000077'
  AND author_user_id = 'f0040000-0000-0000-0000-000000000004';

-- 2. Actualizar Market Items (Vendedores)
UPDATE market_items
SET seller = 'Aroma de Mariola | Rosa'
WHERE seller_entity_id = '00000000-0000-0000-0000-000000000044';

UPDATE market_items
SET seller = 'La Cooperativa | Maria'
WHERE seller_entity_id = '00000000-0000-0000-0000-000000000077';

-- 3. Caso general para cualquier otro post de entidad que no hayamos mapeado específicamente
-- (Fallback preventivo)
UPDATE posts p
SET author = e.name || ' | ' || COALESCE((SELECT full_name FROM profiles WHERE id = p.author_user_id), 'Editor')
FROM entities e
WHERE p.author_entity_id = e.id
  AND p.author NOT LIKE '% | %';

COMMIT;

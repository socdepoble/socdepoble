-- ==============================================================================
-- OMEGA-20 (NAVAJA DE OCKHAM V2): La Purga Absoluta 
-- ==============================================================================
-- La base de datos es aún más cabezota de lo que pensábamos: resulta que el clon 
-- no solo escribía posts, sino que también había montado un chiringuito vendiendo
-- cosas en el mercado ('market_items_seller_entity_id_fkey').
-- Aislamos por completo todas sus apariciones y detonamos en cascada.

BEGIN;

-- 1. Matar los artículos del mercado vendidos por el clon fantasma
DELETE FROM market_items
WHERE seller_entity_id IN (
    SELECT id FROM entities WHERE name ILIKE 'Ajuntament de la Torre'
);

-- 2. Matar a los seguidores que estuvieran suscritos a la farsa
DELETE FROM entity_members
WHERE entity_id IN (
    SELECT id FROM entities WHERE name ILIKE 'Ajuntament de la Torre'
);

-- 3. Matar los posts (el muro) del fantasma principal
DELETE FROM posts 
WHERE author_entity_id IN (
    SELECT id FROM entities WHERE name ILIKE 'Ajuntament de la Torre'
);

-- 4. MATAR AL CLON DE ENTITIES (Ya no tiene ataduras foráneas)
DELETE FROM entities 
WHERE name ILIKE 'Ajuntament de la Torre';

-- 5. REPETIR EL PROCESO CON CUALQUIER OTRA BASURA RESIDUAL (aviso_oficial)
DELETE FROM market_items
WHERE seller_entity_id IN (
    SELECT id FROM entities WHERE avatar_url ILIKE '%aviso_oficial%'
);

DELETE FROM entity_members
WHERE entity_id IN (
    SELECT id FROM entities WHERE avatar_url ILIKE '%aviso_oficial%'
);

DELETE FROM posts 
WHERE author_entity_id IN (
    SELECT id FROM entities WHERE avatar_url ILIKE '%aviso_oficial%'
);

DELETE FROM entities 
WHERE avatar_url ILIKE '%aviso_oficial%';

COMMIT;

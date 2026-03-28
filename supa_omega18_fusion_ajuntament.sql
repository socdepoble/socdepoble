-- ==============================================================================
-- OMEGA-18 (LA FUSIÓN CONCEPTUAL): Unificación de Ayuntamientos y Purga del Clon
-- ==============================================================================

BEGIN;

-- 1. TRASPASO DE SEGUIDORES (entity_member_map o entity_members)
UPDATE entity_members
SET entity_id = (SELECT id FROM entities WHERE name = 'Simulació Ajuntament La Torre' LIMIT 1)
WHERE entity_id = '00000000-0000-0000-0000-000000000000';

-- 2. TRASPASO DE PUBLICACIONES (posts)
UPDATE posts
SET author = 'Simulació Ajuntament La Torre',
    author_avatar = '/assets/master/logo_socdepoble_green_square.png'
WHERE author = 'Ajuntament de la Torre';

-- 3. ELIMINAR EL FANTASMA CONCEPTUAL DE ENTITIES
DELETE FROM entities
WHERE name = 'Ajuntament de la Torre' 
  AND id = '00000000-0000-0000-0000-000000000000';

-- 4. ASEGURAR EL LOGO Y LA LEGALIDAD EN EL SUPERVIVIENTE
-- No tocamos la columna 'type' para no saltarnos el estricto candado de PostgreSQL.
-- El cambio de nombre a Simulació ya nos blinda legalmente.
UPDATE entities
SET avatar_url = '/assets/master/logo_socdepoble_green_square.png'
WHERE name = 'Simulació Ajuntament La Torre';

COMMIT;

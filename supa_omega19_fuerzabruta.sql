-- ==============================================================================
-- OMEGA-19 (FUERZA BRUTA CONCEPTUAL): Exterminio absoluto del clon visual 
-- ==============================================================================
-- Objetivo: Borrar el fantasma 'Ajuntament de la Torre' a ciegas, 
-- porque su ID en la foto resultó terminar en un 8 diminuto camuflado ('...0008') 
-- y no en ceros puros. 

BEGIN;

-- 1. TRASPASO DE SEGUIDORES A LA SIMULACIÓN
UPDATE entity_members
SET entity_id = (SELECT id FROM entities WHERE name = 'Simulació Ajuntament La Torre' LIMIT 1)
WHERE entity_id IN (SELECT id FROM entities WHERE name ILIKE 'Ajuntament de la Torre');

-- 2. TRASPASO DE PUBLICACIONES (posts) AL LOGO VERDE
UPDATE posts
SET author = 'Simulació Ajuntament La Torre',
    author_avatar = '/assets/master/logo_socdepoble_green_square.png'
WHERE author ILIKE 'Ajuntament de la Torre' OR author_avatar ILIKE '%aviso_oficial%';

-- 3. ELIMINAR EL FANTASMA CONCEPTUAL DE ENTITIES SIN DEPENDER DEL ID
DELETE FROM entities
WHERE name ILIKE 'Ajuntament de la Torre';

-- 4. ELIMINAR CUALQUIER EXTRA RESIDUAL CON AVISO OFICIAL
DELETE FROM entities 
WHERE avatar_url ILIKE '%aviso_oficial%';

COMMIT;

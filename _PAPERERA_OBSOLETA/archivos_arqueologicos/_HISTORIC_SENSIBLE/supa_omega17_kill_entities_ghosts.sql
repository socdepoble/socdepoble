-- OMEGA-17 (EL FIN DEL OLOR A MIERDA): Destrucción Directa del Polvo Fantasma Físico

BEGIN;

-- 1. Arreglar definitivamente el Avatar nulo de Sóc de Poble en la tabla olvidada
UPDATE entities
SET avatar_url = '/assets/master/logo_socdepoble_green_square.png'
WHERE name = 'Sóc de Poble';

-- 2. Fusilar cualquier rastro del topónimo antiguo en ESA MISMA TABLA FÍSICA
UPDATE entities
SET 
    name = 'Simulació Ajuntament La Torre',
    description = 'Entitat simulada.'
WHERE name ILIKE '%Torremanzanas%' OR description ILIKE '%oficial%';

-- 3. Por si existe Ajuntament Torremanzanas literal escrito.
DELETE FROM entities
WHERE name = 'Ajuntament Torremanzanas';

COMMIT;

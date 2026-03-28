-- OMEGA-14 (Parche Legal y Lingüístico): Erradicación de castellanismo y oficialidad simulada

BEGIN;

-- 1. PURGA Y CORRECCIÓN EN SYSTEM_AGENTS (A prueba de balas)
UPDATE system_agents
SET name = 'Simulació Ajuntament La Torre'
WHERE name ILIKE '%Torremanzanas%';

-- 2. PURGA Y CORRECCIÓN EN PROFILES
UPDATE profiles
SET 
    username = 'Simulació Ajuntament La Torre',
    full_name = 'Simulació Ajuntament La Torre',
    bio = 'Entitat simulada de l''Ajuntament.'
WHERE username ILIKE '%Torremanzanas%' OR full_name ILIKE '%Torremanzanas%' OR bio ILIKE '%oficial%';

-- 3. PURGA Y CORRECCIÓN EN MARKET_ITEMS 
UPDATE market_items
SET 
    title = 'Simulació Ajuntament La Torre',
    description = 'Entitat simulada.'
WHERE title ILIKE '%Torremanzanas%' OR description ILIKE '%oficial%';

-- 4. REPASO GENERAL EN POSTS (Por si el nombre antiguo quedó grabado como author estático)
UPDATE posts
SET author = 'Simulació Ajuntament La Torre'
WHERE author ILIKE '%Torremanzanas%' OR author = 'Ajuntament Torremanzanas';

-- 5. REPASO EN TOWNS (Solo en la columna description)
UPDATE towns
SET description = REPLACE(description, 'Torremanzanas', 'La Torre de les Maçanes')
WHERE description ILIKE '%Torremanzanas%';

COMMIT;

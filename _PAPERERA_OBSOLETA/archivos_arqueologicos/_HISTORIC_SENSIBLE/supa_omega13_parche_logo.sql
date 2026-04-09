-- OMEGA-13 (Parche Visual Local): Aplicar el logo corporativo de 'Sóc de Poble'

BEGIN;

-- Si viene de market_items (como empresa)
UPDATE market_items
SET image_url = '/assets/master/logo_socdepoble_green_square.png' 
WHERE name = 'Sóc de Poble' OR title = 'Sóc de Poble';

-- O Si viene de system_agents (tipo empresa)
UPDATE system_agents
SET avatar_url = '/assets/master/logo_socdepoble_green_square.png'
WHERE name = 'Sóc de Poble' OR full_name = 'Sóc de Poble';

-- O Si es un profile con rol negocio
UPDATE profiles
SET avatar_url = '/assets/master/logo_socdepoble_green_square.png'
WHERE username ILIKE '%Sóc de Poble%';

COMMIT;

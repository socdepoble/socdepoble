-- OMEGA-15 (Exorcismo de Identidad Fantasma V2): Force-Patch Corrector de Tipos

BEGIN;

-- 1. Si el fantasma reside en profiles (El DNI es UUID correcto)
UPDATE profiles
SET avatar_url = '/assets/master/logo_socdepoble_green_square.png'
WHERE id = 'd921ddee-215b-4239-8aca-22bd001fd2f8';

-- 2. Si el fantasma reside en system_agents (El ID es UUID)
UPDATE system_agents
SET avatar_url = '/assets/master/logo_socdepoble_green_square.png'
WHERE id = 'd921ddee-215b-4239-8aca-22bd001fd2f8';

-- 3. Si el fantasma reside en market_items
-- CUIDADO: Aquí el 'id' primario es un número correlativo (BIGINT). 
-- El UUID de compatibilidad está en la columna secreta 'uuid'.
UPDATE market_items
SET 
  image_url = '/assets/master/logo_socdepoble_green_square.png',
  avatar_url = '/assets/master/logo_socdepoble_green_square.png'
WHERE uuid = 'd921ddee-215b-4239-8aca-22bd001fd2f8';

COMMIT;

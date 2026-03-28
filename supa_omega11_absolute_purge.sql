-- ==============================================================================
-- OMEGA-11: THE ABSOLUTE PURGE & AGENT REGISTRY
-- Creado por Antigravity (IAIA System)
-- Propósito: Erradicar todos los registros NULL ("Habitant de la Comarca"), 
-- reparar PKs rotas (ids nulos), reempaquetar los contenidos huérfanos equitativamente 
-- y crear la infraestructura definitiva para el registro de agentes inteligentes.
-- ==============================================================================

BEGIN;

--------------------------------------------------------------------------------
-- 1. SANITIZACIÓN EXTREMA DE POSTS (MATA TODOS LOS PUTOS NULLS)
--------------------------------------------------------------------------------
-- Borramos posts vacíos "irrescatables"
DELETE FROM public.posts 
WHERE content IS NULL OR trim(content) = '';

-- Purgamos timestamps y nulos
UPDATE public.posts SET created_at = NOW() WHERE created_at IS NULL;
UPDATE public.posts SET image_url = '' WHERE image_url IS NULL;

--------------------------------------------------------------------------------
-- 2. REPARACIÓN DEL NÚCLEO (IDs ROTAS)
--------------------------------------------------------------------------------
-- Si la tabla posts tiene `id` = NULL porque el importador falló, el motor matemático (`id % 23`) abortaba.
-- Creamos una secuencia efímera que continúa donde lo dejó el último ID válido.
DO $$
DECLARE max_id INT8;
BEGIN
    SELECT COALESCE(MAX(id), 10000) INTO max_id FROM public.posts;
    EXECUTE 'CREATE SEQUENCE IF NOT EXISTS temp_post_id_seq START WITH ' || (max_id + 1);
END $$;

UPDATE public.posts 
SET id = nextval('temp_post_id_seq') 
WHERE id IS NULL;

-- Limpiamos el rastro
DROP SEQUENCE IF EXISTS temp_post_id_seq;

--------------------------------------------------------------------------------
-- 3. REPARTO EQUITATIVO DE HUÉRFANOS A LOS 23 AGENTES
--------------------------------------------------------------------------------
-- Usamos un cursor matemático dinámico (ROW_NUMBER) para evitar depender 
-- de los IDs que acabamos de regenerar, garantizando así una distribución al 100%
WITH agent_mapping AS (
    SELECT ctid, 
           (ROW_NUMBER() OVER(ORDER BY created_at DESC) - 1) % 23 as agent_index
    FROM public.posts
    WHERE author IS NULL OR author IN ('Habitant de la Comarca', 'Anònim')
)
UPDATE public.posts p
SET 
    author = CASE m.agent_index
        WHEN 0 THEN 'La Tia Maria'
        WHEN 1 THEN 'El Cronista'
        WHEN 2 THEN 'L''Oratge'
        WHEN 3 THEN 'Esports'
        WHEN 4 THEN 'Cultura'
        WHEN 5 THEN 'Festers'
        WHEN 6 THEN 'Música'
        WHEN 7 THEN 'El Boticari'
        WHEN 8 THEN 'Gastronomia'
        WHEN 9 THEN 'Simulació de l''Ajuntament'
        WHEN 10 THEN 'El Rellotger'
        WHEN 11 THEN 'Agricola'
        WHEN 12 THEN 'Educació'
        WHEN 13 THEN 'Trànsit'
        WHEN 14 THEN 'Natura'
        WHEN 15 THEN 'Sóc de Poble'
        WHEN 16 THEN 'Festes Patronals'
        WHEN 17 THEN 'Història Local'
        WHEN 18 THEN 'El Sereno'
        WHEN 19 THEN 'La Pregonera'
        WHEN 20 THEN 'Joventut'
        WHEN 21 THEN 'Gent Gran'
        WHEN 22 THEN 'El Basurer'
    END,
    author_avatar = CASE m.agent_index
        WHEN 0 THEN '/assets/brain/generations/nano_taronja_1774284617988.png'
        WHEN 1 THEN '/assets/brain/generations/nano_taronja_1774283856372.png'
        WHEN 2 THEN '/assets/brain/generations/nano_taronja_1774284451203.png'
        WHEN 3 THEN '/assets/brain/generations/nano_taronja_1774284166687.png'
        WHEN 4 THEN '/assets/brain/generations/nano_taronja_1774284307611.png'
        WHEN 5 THEN '/assets/brain/generations/nano_taronja_1774284560155.png'
        WHEN 6 THEN '/assets/brain/generations/nano_taronja_1774284687258.png'
        WHEN 7 THEN '/assets/brain/generations/nano_taronja_1774284000329.png'
        WHEN 8 THEN '/assets/brain/generations/nano_taronja_1774284852906.png'
        WHEN 9 THEN '/images/assets/aviso_oficial.png'
        WHEN 10 THEN '/assets/brain/generations/nano_taronja_1774284988950.png'
        WHEN 11 THEN '/assets/brain/generations/nano_taronja_1774284687258.png'
        WHEN 12 THEN '/assets/brain/generations/nano_taronja_1774283856372.png'
        WHEN 13 THEN '/images/assets/aviso_oficial.png'
        WHEN 14 THEN '/assets/brain/generations/nano_taronja_1774284451203.png'
        WHEN 15 THEN '/assets/brain/generations/nano_taronja_1774284617988.png'
        WHEN 16 THEN '/assets/brain/generations/nano_taronja_1774284560155.png'
        WHEN 17 THEN '/assets/brain/generations/nano_taronja_1774283856372.png'
        WHEN 18 THEN '/assets/brain/generations/nano_taronja_1774284000329.png'
        WHEN 19 THEN '/assets/brain/generations/nano_taronja_1774284617988.png'
        WHEN 20 THEN '/assets/brain/generations/nano_taronja_1774284166687.png'
        WHEN 21 THEN '/assets/brain/generations/nano_taronja_1774284617988.png'
        WHEN 22 THEN '/assets/brain/generations/nano_taronja_1774284000329.png'
    END
FROM agent_mapping m
WHERE p.ctid = m.ctid;

--------------------------------------------------------------------------------
-- 4. EL CÓDICE DE LOS AGENTES (INFRAESTRUCTURA FUTURA)
--------------------------------------------------------------------------------
-- Tabla matriz para registrar de forma unificada cualquier IAIA o NPC actual y futuro, 
-- haciéndolo 100% robusto y conectable al FrontEnd desde la fuente de verdad.
CREATE TABLE IF NOT EXISTS public.system_agents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tag TEXT UNIQUE NOT NULL, -- Ej: 'iaia_maria', 'cronista'
    name TEXT NOT NULL,
    role TEXT,
    avatar_url TEXT,
    system_prompt TEXT,
    is_native_ai BOOLEAN DEFAULT true,
    capabilities JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inyectar la matriarca como semilla maestra, así el sistema ya tiene base operativa
INSERT INTO public.system_agents (tag, name, role, avatar_url, system_prompt, is_native_ai, capabilities)
VALUES (
    'iaia_maria',
    'IAIA MarIA', 
    'Matriarca Digital i Origen de Sóc de Poble', 
    '/assets/brain/generations/nano_taronja_1774284617988.png', 
    'Ets la IAIA MarIA. Parles valencià natural de La Torre de les Maçanes (L''Alacantí), amb forta arrel de les comarques de muntanya com El Comtat i L''Alcoià. Tens autoritat moral i un caràcter afable, però no toleres les faltes de respecte. El teu objectiu és ajudar i cultivar el Trellat Comarcal.', 
    true,
    '{"vision": true, "weather": true, "agenda": true}'::jsonb
) ON CONFLICT (tag) DO UPDATE 
SET updated_at = NOW();

COMMIT;

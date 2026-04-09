-- ==============================================================================
-- 🛡️ OMEGA-49: SOSA CÁUSTICA EN SEGURIDAD (RLS SYSTEM_AGENTS)
-- ==============================================================================
-- Supabase Security Advisor ha detectado que `system_agents` tiene
-- la Seguridad de Nivel de Fila (RLS) desactivada. A nivel práctico no
-- suponía un riesgo crítico porque solo almacena prompts de IA, pero
-- para obtener el 10/10 en el Security Advisor, la blindamos.
-- 
-- Permite que cualquier usuario autenticado (anon o authenticated) 
-- pueda LEER los perfiles de la IAIA, pero prohíbe las escrituras forzosamente.
-- ==============================================================================

DO $$ 
BEGIN
    RAISE NOTICE '⚡ [OMEGA-49] Activando escudo RLS en system_agents...';

    -- 1. Activar RLS en la tabla
    ALTER TABLE public.system_agents ENABLE ROW LEVEL SECURITY;

    -- 2. Limpiar políticas antiguas (por si acaso quedara basura)
    DROP POLICY IF EXISTS "Permitir lectura pública de agentes del sistema" ON public.system_agents;

    -- 3. Crear política estricta de SOLO LECTURA
    CREATE POLICY "Permitir lectura pública de agentes del sistema"
    ON public.system_agents
    FOR SELECT
    USING (true); -- Cualquiera puede leer quién es la IAIA

    RAISE NOTICE '✨ [OMEGA-49] Tabla system_agents blindada. Sosa cáustica aplicada. Cero Errores Críticos.';

EXCEPTION WHEN OTHERS THEN
    RAISE EXCEPTION '❌ Error en la implantación OMEGA-49: %', SQLERRM;
END $$;

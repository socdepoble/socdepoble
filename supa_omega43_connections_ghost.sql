-- ==============================================================================
-- OMEGA-43: EXTERMINIO DE FANTASMAS EN CONEXIONES (post_id)
-- ==============================================================================
-- 1. La tabla "post_connections" todavía alberga la columna legacy "post_id" (int8)
--    de la V1 del proyecto, conviviendo con la correcta "post_uuid" (uuid).
-- 2. El Frontend ya está 100% migrado a "post_uuid" en todas las consultas.
-- 3. Este script fulmina el fantasma para ahorrar almacenamiento y evitar 
--    confusión o errores de consistencia en el futuro.
-- ==============================================================================

DO $$ 
BEGIN
    RAISE NOTICE '⚡ [OMEGA-43] Iniciando purga del fantasma post_id en post_connections...';

    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema='public' AND table_name='post_connections' AND column_name='post_id'
    ) THEN
        ALTER TABLE public.post_connections DROP COLUMN post_id CASCADE;
        RAISE NOTICE '   ✅ Columna post_id (legacy int8) destruida permanentemente.';
    ELSE
        RAISE NOTICE '   ⏩ Columna post_id no encontrada. Ya fue purgada o nunca existió.';
    END IF;

    RAISE NOTICE '✨ [OMEGA-43] post_connections saneada por completo.';

EXCEPTION WHEN OTHERS THEN
    RAISE EXCEPTION '❌ Error en la implantación OMEGA-43: %', SQLERRM;
END $$;

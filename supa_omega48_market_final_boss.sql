-- ==============================================================================
-- 🛍️ OMEGA-48: PURIFICACIÓN FINAL DEL MERCADO (EL JEFE FINAL)
-- ==============================================================================
-- El usuario ha detectado vestigios de la arquitectura V1 dentro de market_items.
-- Como la tabla 'entities' ha sido literalmente arrojada al volcán (OMEGA-46),
-- 'author_entity_id' apunta a la nada absoluta. Un espectro.
-- Además, 'author_role' vivía duplicado inútilmente, pues todo Perfil 
-- tiene su propio rol polimórfico en su tabla matriz.  
-- ==============================================================================

DO $$ 
BEGIN
    RAISE NOTICE '⚡ [OMEGA-48] Enfrentando al último jefe Final en market_items...';

    -- 1. Arrancar author_entity_id (El apuntador a la nada)
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema='public' AND table_name='market_items' AND column_name='author_entity_id'
    ) THEN
        ALTER TABLE public.market_items DROP COLUMN author_entity_id CASCADE;
        RAISE NOTICE '   ✅ author_entity_id DESTRUIDA.';
    END IF;

    -- 2. Arrancar author_role (La redundancia innecesaria)
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema='public' AND table_name='market_items' AND column_name='author_role'
    ) THEN
        ALTER TABLE public.market_items DROP COLUMN author_role CASCADE;
        RAISE NOTICE '   ✅ author_role ERRADICADA.';
    END IF;

    RAISE NOTICE '✨ [OMEGA-48] El Mercado brilla con luz de Neón. Todo fluye a través de Profiles.';

EXCEPTION WHEN OTHERS THEN
    RAISE EXCEPTION '❌ Error en la cirugía OMEGA-48: %', SQLERRM;
END $$;

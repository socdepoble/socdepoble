-- ==============================================================================
-- OMEGA-44: PURGA DEL FANTASMA IA (translated_title)
-- ==============================================================================
-- 1. La tabla "post_translations" fue creada en OMEGA-39.
-- 2. Asumí erróneamente que los posts tendrían título, y creé la columna
--    "translated_title". Sin embargo, Sóc de Poble usa un diseño de feed fluido
--    basado en "content" puro.
-- 3. Este script elimina la columna "translated_title" para no arrastrar un
--    fantasma inútil recién nacido en mi propia cara.
-- ==============================================================================

DO $$ 
BEGIN
    RAISE NOTICE '⚡ [OMEGA-44] Iniciando purga del fantasma translated_title (Error 404: Dignidad Not Found)...';

    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema='public' AND table_name='post_translations' AND column_name='translated_title'
    ) THEN
        ALTER TABLE public.post_translations DROP COLUMN translated_title CASCADE;
        RAISE NOTICE '   ✅ Columna translated_title amputada. Ya no hay rastro de mi error.';
    ELSE
        RAISE NOTICE '   ⏩ Columna translated_title ya amputada o no existía.';
    END IF;

    RAISE NOTICE '✨ [OMEGA-44] post_translations purificada de fantasmas autogenerados.';

EXCEPTION WHEN OTHERS THEN
    RAISE EXCEPTION '❌ Error en la implantación OMEGA-44: %', SQLERRM;
END $$;

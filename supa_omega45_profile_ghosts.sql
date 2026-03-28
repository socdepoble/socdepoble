-- ==============================================================================
-- OMEGA-45: EXORCISMO FINAL EN PROFILES (town_id & social_image)
-- ==============================================================================
-- 1. "town_id" (int8) quedó obsoleta en OMEGA-30 cuando transicionamos
--    todo el motor a "primary_town" (text) y "town_uuid" (uuid).
-- 2. "social_image_preferences" fue una feature planeada para personalizar
--    las previsualizaciones OpenGraph en Twitter/WhatsApp, pero nunca se
--    implementó en producción (quedó en 'none').
-- 3. Se fulminan ambos fantasmas para reducir la carga cognitiva de la DB.
-- ==============================================================================

DO $$ 
BEGIN
    RAISE NOTICE '⚡ [OMEGA-45] Iniciando purga en tabla profiles...';

    -- Extracción del primer fantasma (town_id)
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema='public' AND table_name='profiles' AND column_name='town_id'
    ) THEN
        ALTER TABLE public.profiles DROP COLUMN town_id;
        RAISE NOTICE '   ✅ Fantasma 1: town_id (int8 legacy) destruido.';
    END IF;

    -- Extracción del segundo fantasma (social_image_preferences)
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema='public' AND table_name='profiles' AND column_name='social_image_preferences'
    ) THEN
        ALTER TABLE public.profiles DROP COLUMN social_image_preferences;
        RAISE NOTICE '   ✅ Fantasma 2: social_image_preferences destruida.';
    END IF;

    RAISE NOTICE '✨ [OMEGA-45] Tabla profiles saneada por completo.';

EXCEPTION WHEN OTHERS THEN
    RAISE EXCEPTION '❌ Error en la implantación OMEGA-45: %', SQLERRM;
END $$;

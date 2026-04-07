-- ==============================================================================
-- OMEGA-38: LA GUILLOTINA FINAL (CAZAFANTASMAS AUDIO-RESPONSE)
-- ==============================================================================
-- Extirpa permanentemente columnas fantasma identificadas por el Comandante Javi.
-- - town_id: Sistema prehistórico obsoleto
-- - author_avatar_url: Sistema prehistórico obsoleto. El Frontend ahora 
--   utiliza JOINs apuntando al avatar intocable de entities/profiles.
-- ==============================================================================

DO $$ 
BEGIN
    RAISE NOTICE '⚡ [OMEGA-38] Iniciando Extirpación Máxima y Saneamiento Anti-Nulos...';

    -- 1. Cirugía Estructural: Extirpación de Fantasmas Reales
    ALTER TABLE public.posts
        DROP COLUMN IF EXISTS author_avatar_url CASCADE,
        DROP COLUMN IF EXISTS town_id CASCADE;

    -- 2. Cirugía Cosmética: Erradicación del NULL visual en image_alt
    UPDATE public.posts 
    SET image_alt = '' 
    WHERE image_alt IS NULL;

    ALTER TABLE public.posts
        ALTER COLUMN image_alt SET DEFAULT '';

    RAISE NOTICE '✨ [OMEGA-38] Fantasmas eliminados. Recuerda, Comandante: author_entity_id y author_user_id NO son fantasmas, son Exclusividad Relacional (Check Constraints). Un post es de persona o entidad de forma excluyente.';
    
EXCEPTION WHEN OTHERS THEN
    RAISE EXCEPTION '❌ Error en la purga OMEGA-38: %', SQLERRM;
END $$;

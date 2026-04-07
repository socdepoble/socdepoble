-- ==============================================================================
-- OMEGA-42: EXPANSIÓN GEOLOCALIZADA Y PURGA DE FANTASMAS DE MENSAJERÍA
-- ==============================================================================
-- 1. Añade soporte para memoria EXIF (metadatos, ubicación, dispositivo) 
--    en las fotos para futuras implementaciones del mapa interactivo.
-- 2. Fulmina la columna fantasma "sender_entity_id" de los mensajes, 
--    ya que la identidad de Sóc de Poble ahora es única y polimórfica (perfiles).
-- ==============================================================================

DO $$ 
BEGIN
    RAISE NOTICE '⚡ [OMEGA-42] Iniciando Protocolo de Visión Geográfica y Purga Ghost...';

    -- 1. Inyectar memoria EXIF (Ubicación, Autor, Cámara) en media_assets
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema='public' AND table_name='media_assets' AND column_name='exif_metadata'
    ) THEN
        ALTER TABLE public.media_assets ADD COLUMN exif_metadata JSONB DEFAULT '{}'::jsonb;
        RAISE NOTICE '   ✅ Memoria EXIF instalada. Sóc de Poble ahora puede geolocalizar imágenes nativamente.';
    ELSE
        RAISE NOTICE '   ⏩ Columna exif_metadata ya existe.';
    END IF;

    -- 2. Purgar el fantasma "sender_entity_id" en messages
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema='public' AND table_name='messages' AND column_name='sender_entity_id'
    ) THEN
        ALTER TABLE public.messages DROP COLUMN sender_entity_id CASCADE;
        RAISE NOTICE '   ✅ Fantasma sender_entity_id decapitado permanentemente del motor de chat.';
    ELSE
        RAISE NOTICE '   ⏩ Columna sender_entity_id no existe o ya fue purgada.';
    END IF;

    RAISE NOTICE '✨ [OMEGA-42] Auditoría de base de datos cerrada con éxito militar.';

EXCEPTION WHEN OTHERS THEN
    RAISE EXCEPTION '❌ Error en la implantación OMEGA-42: %', SQLERRM;
END $$;

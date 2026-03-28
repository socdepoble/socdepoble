/*
  ========================================================================
  🏠 SÓC DE POBLE - PROTOCOLO OMEGA-29: PURGA DE IMÁGENES GENÉRICAS
  ========================================================================
  🎯 Objetivo: 
  La tabla `towns` ha sido contaminada con datos legacy o de seeding masivo 
  que insertan URLs falsas/inexistentes como 'Assets/default_logo.png' 
  o 'img/assets/generic_street.png'.
  
  Esto confunde al frontend, impidiendo que los fallbacks inteligentes 
  (Wikipedia API, logos canónicos y fotos "batec" de la comunidad) actúen.

  Este script extermina toda falsedad visual, restableciendo la pureza del NULL.
*/

DO $$ 
DECLARE
  v_updated_logos int;
  v_updated_images int;
BEGIN
  -- 1. Purgar Logos Falsos
  WITH updated AS (
    UPDATE public.towns
    SET logo_url = NULL
    WHERE logo_url ILIKE '%default_logo.png%' OR logo_url ILIKE '%default%' OR logo_url = ''
    RETURNING id
  )
  SELECT count(*) INTO v_updated_logos FROM updated;

  -- 2. Purgar Calles Genéricas Falsas
  WITH updated AS (
    UPDATE public.towns
    SET image_url = NULL
    WHERE image_url ILIKE '%generic_street.png%' OR image_url ILIKE '%poble_default.png%' OR image_url ILIKE '%default%' OR image_url = ''
    RETURNING id
  )
  SELECT count(*) INTO v_updated_images FROM updated;

  -- 3. Mensaje de victoria
  RAISE NOTICE '✅ PROTOCOLO OMEGA-29 COMPLETADO:';
  RAISE NOTICE '   🔥 Logos falsos exterminados: %', v_updated_logos;
  RAISE NOTICE '   🔥 Fotos genéricas de calle purgadas: %', v_updated_images;
  RAISE NOTICE '   Los pueblos ahora delegarán a las APIs de Wikipedia y fotos comunitarias (Batec) limpiamente.';
END $$;

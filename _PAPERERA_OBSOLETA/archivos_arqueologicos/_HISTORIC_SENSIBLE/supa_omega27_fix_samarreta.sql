/*
  ========================================================================
  🛒 SÓC DE POBLE - PROTOCOLO OMEGA-27: REVALORIZACIÓN TÉXTIL
  ========================================================================
  🎯 Objetivo: 
  Eliminar la camiseta ficticia de "Samarreta Oficial Festes 2026" y
  sustituirla por la prenda fundacional y canónica: "Samarreta Sóc de Poble".
  Asegurar que el vendedor/creador es la entidad propia "Sóc de Poble".
*/

DO $$ 
DECLARE
  v_admin_id uuid;
  v_admin_avatar text;
  v_entity_sdp uuid;
BEGIN
  -- 1. Obtener ID del Admin y su Avatar
  SELECT id INTO v_admin_id FROM auth.users ORDER BY created_at ASC LIMIT 1;
  SELECT avatar_url INTO v_admin_avatar 
  FROM public.profiles 
  WHERE id = v_admin_id LIMIT 1;
  IF v_admin_avatar IS NULL THEN v_admin_avatar := '/assets/master/logo_socdepoble_green_square.png'; END IF;

  -- 2. Buscar al Titán: Entidad Sóc de Poble
  SELECT id INTO v_entity_sdp FROM public.entities WHERE name ILIKE '%Sóc de Poble%' LIMIT 1;
  
  -- Si misteriosamente no existiera la entidad de Sóc de Poble como Entidad,
  -- dejaremos que dependa temporalmente del admin directamente (fallback de seguridad)

  -- 3. Exorcizar la Camiseta Falsa y Ascender la Genuina
  UPDATE public.market_items
  SET 
    title = 'Samarreta Sóc de Poble',
    author_user_id = v_admin_id,
    author_entity_id = v_entity_sdp,
    avatar_url = v_admin_avatar,
    description = '<h1>Equipament Oficial</h1><h2>L''Autèntica, L''Original</h2><p>La samarreta oficial i canònica de la plataforma Sóc de Poble. Disseny exclusiu, producció ètica i de màxima qualitat per no suar com un titot. Amb el logotip icònic al pit per a que tot el món sàpiga d''on vens. Disposa de talles molt variades, garantint l''ajust ideal des de XS fins a complets XXL. Fes comarca!</p>'
  WHERE image_url ILIKE '%samarreta_festes.png%' OR title ILIKE '%Samarreta Oficial Festes%';

  RAISE NOTICE '✅ PROTOCOLO OMEGA-27: Samarreta oficial re-fundada y asignada a Entidad (%). ¡Larga vida a Sóc de Poble!', v_entity_sdp;
END $$;

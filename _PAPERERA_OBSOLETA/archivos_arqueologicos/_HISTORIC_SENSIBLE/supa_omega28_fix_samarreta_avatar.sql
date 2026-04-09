/*
  ========================================================================
  🛒 SÓC DE POBLE - PROTOCOLO OMEGA-28: IDENTIDAD DE MARCA (AVATAR)
  ========================================================================
  🎯 Objetivo: 
  Asegurar que los productos vendidos por la entidad oficial "Sóc de Poble"
  tengan explícitamente el logotipo verde canónico corporativo, sin heredar
  el avatar personal del administrador (que podría ser la IAIA u otro).
*/

DO $$ 
DECLARE
  v_sdp_logo text := '/assets/master/logo_socdepoble_green_square.png';
  v_entity_sdp uuid;
BEGIN
  -- 1. Buscar al Titán: Entidad Sóc de Poble
  SELECT id INTO v_entity_sdp FROM public.entities WHERE name ILIKE '%Sóc de Poble%' LIMIT 1;
  
  -- 2. Asegurar Avatar Exclusivo de Marca (Logotipo Verde)
  UPDATE public.market_items
  SET 
    avatar_url = v_sdp_logo
  WHERE title ILIKE '%Samarreta Sóc de Poble%' OR author_entity_id = v_entity_sdp;

  RAISE NOTICE '✅ PROTOCOLO OMEGA-28: Avatar de la marca oficial restaurado al logotipo verde canónico.';
END $$;

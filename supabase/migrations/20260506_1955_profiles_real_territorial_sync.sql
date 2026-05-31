-- Migration: 20260506_1955_profiles_real_territorial_sync.sql
-- Description: Correctly assign comarca and province (as JSONB arrays) to existing profiles based on primary_town.

DO $$
BEGIN
    -------------------------------------------------------------------
    -- 1. ELIMINAR 'Global' DE PRIMARY TOWN
    -------------------------------------------------------------------
    -- Reemplacem 'Global' i 'Sóc de Poble (Global)' pel cor de la xarxa: La Torre de les Maçanes.
    UPDATE public.profiles 
    SET primary_town = 'La Torre de les Maçanes' 
    WHERE primary_town IN ('Global', 'Sóc de Poble (Global)');

    -------------------------------------------------------------------
    -- 2. HARDCODED SYNC PELS POBLES CONEGUTS (Per als que no estan a towns encara)
    -------------------------------------------------------------------
    UPDATE public.profiles SET provinces = '["Alacant"]'::jsonb, comarcas = '["L''Alacantí"]'::jsonb 
    WHERE primary_town IN ('La Torre de les Maçanes', 'Illa de Tabarca', 'Illa de Tabarca (Global)', 'Agost', 'Xixona');

    UPDATE public.profiles SET provinces = '["Alacant"]'::jsonb, comarcas = '["El Comtat"]'::jsonb 
    WHERE primary_town IN ('Cocentaina', 'Agres', 'Muro');

    UPDATE public.profiles SET provinces = '["Alacant"]'::jsonb, comarcas = '["Marina Alta"]'::jsonb 
    WHERE primary_town IN ('Senija', 'Xàbia', 'Dénia');
    
    UPDATE public.profiles SET provinces = '["Alacant"]'::jsonb, comarcas = '["Marina Baixa"]'::jsonb 
    WHERE primary_town IN ('Relleu', 'Sella');

    UPDATE public.profiles SET provinces = '["Alacant"]'::jsonb, comarcas = '["L''Alcoià"]'::jsonb 
    WHERE primary_town IN ('Ibi', 'Banyeres');

    UPDATE public.profiles SET provinces = '["València"]'::jsonb, comarcas = '["Camp de Túria"]'::jsonb 
    WHERE primary_town IN ('Llíria');

    UPDATE public.profiles SET provinces = '["Castelló"]'::jsonb, comarcas = '["Plana Baixa"]'::jsonb 
    WHERE primary_town IN ('La Vall');

    -------------------------------------------------------------------
    -- 3. DYNAMIC SYNC FROM TOWNS TABLE (to JSONB arrays) - OVERRIDE
    -------------------------------------------------------------------
    -- Sincronitzem província i comarca directament des de la taula towns
    UPDATE public.profiles p
    SET 
        provinces = jsonb_build_array(t.province),
        comarcas = jsonb_build_array(t.comarca)
    FROM public.towns t
    WHERE p.primary_town = t.name
      AND (p.provinces IS NULL OR p.provinces = '[]'::jsonb);

END $$;

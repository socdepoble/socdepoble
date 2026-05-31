-- Migration: 20260506_1945_profiles_territorial_sync.sql
-- Description: Assign proper comarca and provincia to existing profiles based on primary_town_text.

DO $$
BEGIN
    -------------------------------------------------------------------
    -- 1. HARDCODED SYNC FOR KNOWN PIONEERS (From snapshot)
    -------------------------------------------------------------------
    UPDATE public.profiles SET provincia_text = 'Alacant', comarca_text = 'L''Alacantí' WHERE primary_town_text IN ('La Torre de les Maçanes', 'Illa de Tabarca', 'Illa de Tabarca (Global)');
    UPDATE public.profiles SET provincia_text = 'Alacant', comarca_text = 'El Comtat' WHERE primary_town_text IN ('Cocentaina', 'Agres');
    UPDATE public.profiles SET provincia_text = 'Alacant', comarca_text = 'Marina Alta' WHERE primary_town_text IN ('Senija', 'Xàbia', 'Dénia');
    UPDATE public.profiles SET provincia_text = 'Alacant', comarca_text = 'L''Alcoià' WHERE primary_town_text = 'Ibi';
    UPDATE public.profiles SET provincia_text = 'València', comarca_text = 'Camp de Túria' WHERE primary_town_text = 'Llíria';
    UPDATE public.profiles SET provincia_text = 'Castelló', comarca_text = 'Plana Baixa' WHERE primary_town_text = 'La Vall';

    -------------------------------------------------------------------
    -- 2. DYNAMIC SYNC FROM TOWNS TABLE
    -------------------------------------------------------------------
    -- In case there are profiles matching public.towns that we missed
    UPDATE public.profiles p
    SET 
        provincia_text = t.province,
        comarca_text = t.comarca
    FROM public.towns t
    WHERE p.primary_town_text = t.name
      AND (p.provincia_text IS NULL OR p.provincia_text = '0' OR p.provincia_text = 'EMPTY');

    -------------------------------------------------------------------
    -- 3. ELIMINAR 'Global' DE PRIMARY TOWN
    -------------------------------------------------------------------
    -- El sistema requereix que siga un poble físic. 'Global' se substitueix pel cor de la xarxa: La Torre de les Maçanes.
    UPDATE public.profiles 
    SET primary_town_text = 'La Torre de les Maçanes',
        provincia_text = 'Alacant',
        comarca_text = 'L''Alacantí'
    WHERE primary_town_text = 'Global' OR primary_town_text IS NULL OR primary_town_text = 'EMPTY';

    -------------------------------------------------------------------
    -- 4. ABSOLUTE NULL-SAFETY FOR TERRITORIAL FIELDS
    -------------------------------------------------------------------
    -- Substitueix '0' per valors descriptius per defecte (La Torre de les Maçanes com a base)
    UPDATE public.profiles SET primary_town_text = 'La Torre de les Maçanes' WHERE primary_town_text = '0' OR primary_town_text IS NULL;
    UPDATE public.profiles SET provincia_text = 'Alacant' WHERE provincia_text = '0' OR provincia_text IS NULL OR provincia_text = 'Desconeguda';
    UPDATE public.profiles SET comarca_text = 'L''Alacantí' WHERE comarca_text = '0' OR comarca_text IS NULL OR comarca_text = 'Desconeguda';
    
    -- Neteja d'altres columnes de profile text
    UPDATE public.profiles SET secondary_town_text = 'EMPTY' WHERE secondary_town_text = '0' OR secondary_town_text IS NULL;
    UPDATE public.profiles SET ofici_text = 'Desconegut' WHERE ofici_text = '0' OR ofici_text IS NULL;
    UPDATE public.profiles SET cover_url_text = 'EMPTY' WHERE cover_url_text = '0' OR cover_url_text IS NULL;

EXCEPTION WHEN undefined_column THEN NULL; WHEN undefined_table THEN NULL; END;
$$ LANGUAGE plpgsql;

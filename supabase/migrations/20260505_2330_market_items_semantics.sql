-- ==============================================================================
-- SÓC DE POBLE: Market Items Semantic Refinement
-- Timestamp: 2026-05-05 23:30
-- Category: SEO / Architecture
-- Description: Adds a subtitle column to market_items to prevent the 
-- injection of HTML heading tags (H1/H2) inside the description body,
-- ensuring pristine SEO and DOM hierarchy.
-- ==============================================================================

BEGIN;

-- 1. AFEGIR CAMP SUBTITLE
-- Això elimina la necessitat d'escriure un H2 dins del camp 'description'.
ALTER TABLE public.market_items ADD COLUMN IF NOT EXISTS subtitle TEXT;

-- (OPCIONAL) NETEJA DE L'HTML A LA DESCRIPCIÓ
-- He deixat aquesta línia comentada. 
-- Com que només tens 9 productes, el millor és que vages tu a la taula 
-- i esborres a mà els "<h1>Mel de romer pura</h1>" del camp description,
-- i copies eixe text al nou camp 'subtitle' o 'title'. Així evitem trencar 
-- res de forma automatitzada amb regex, aplicant el Trellat manual.

-- UPDATE public.market_items SET description = REGEXP_REPLACE(description, '<h[1-6]>.*?</h[1-6]>', '', 'gi');

COMMIT;

DO $$
BEGIN
    RAISE NOTICE 'Market Items Semantics refined successfully. Subtitle column added.';
END
$$;

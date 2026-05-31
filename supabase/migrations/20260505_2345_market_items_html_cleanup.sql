-- ==============================================================================
-- SÓC DE POBLE: Market Items HTML Semantic Cleanup
-- Timestamp: 2026-05-05 23:45
-- Category: Content Migration / SEO Hardening
-- Description: Extracts the <h2> tag from descriptions into the new 'subtitle'
-- column and purges all <h1> and <h2> tags from the 'description' to protect
-- the DOM's semantic hierarchy.
-- ==============================================================================

BEGIN;

-- Utilitzem expressions regulars per extraure l'H2 i esborrar els H1/H2
UPDATE public.market_items
SET 
    -- 1. Extraure el contingut de dins de les etiquetes <h2> i assignar-lo a subtitle
    -- Coalesce assegura que no falle si no troba cap H2 (es queda com està o null)
    subtitle = COALESCE(
        substring(description from '<h2>(.*?)</h2>'), 
        subtitle
    ),
    
    -- 2. Eliminar qualsevol etiqueta <h1>, <h2> i el seu contingut
    -- Això ens deixa només amb els <p> o altres etiquetes vàlides per al body
    description = regexp_replace(description, '<h[1-2]>.*?</h[1-2]>', '', 'gi')
WHERE 
    description LIKE '%<h1%>%' OR description LIKE '%<h2%>%';

COMMIT;

DO $$
BEGIN
    RAISE NOTICE 'Market Items Semantic Cleanup complete. H1/H2 eradicated from descriptions, subtitles populated.';
END
$$;

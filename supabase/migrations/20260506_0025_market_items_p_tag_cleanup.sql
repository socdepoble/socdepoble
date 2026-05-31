-- ==============================================================================
-- SÓC DE POBLE: Market Items Description HTML Tag Cleanup (<p>)
-- Timestamp: 2026-05-06 00:25
-- Category: Content Migration / Semantic Purity
-- Description: Elimina les etiquetes <p> residuals de les descripcions.
-- La base de dades passa a emmagatzemar Text Pur, deixant el format HTML exclusivament per al Front-end.
-- ==============================================================================

BEGIN;

-- Esborrem de forma directa qualsevol etiqueta <p> i </p> de la descripció.
-- Això garantix que la DB té dades pures (Zero Text philosophy).
UPDATE public.market_items
SET description = replace(replace(description, '<p>', ''), '</p>', '')
WHERE description LIKE '%<p>%' OR description LIKE '%</p>%';

COMMIT;

DO $$
BEGIN
    RAISE NOTICE 'Market Items Paragraph Cleanup complete. <p> tags eradicated from descriptions.';
END
$$;

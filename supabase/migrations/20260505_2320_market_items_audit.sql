-- ==============================================================================
-- SÓC DE POBLE: Market Items Audit & Architecture Hardening
-- Timestamp: 2026-05-05 23:20
-- Category: Architecture / Schema Hardening
-- Description: Standardizes market_items with thermodynamic fields, 
-- implements array-based multi-category support for offline efficiency,
-- and adds folksonomy tags.
-- ==============================================================================

BEGIN;

-- 1. AFEGIR CAMPS DE METADADES I CMS (Tags)
ALTER TABLE public.market_items ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';

-- 2. AFEGIR TERMODINÀMICA (updated_at)
ALTER TABLE public.market_items ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS handle_market_items_updated_at ON public.market_items;
CREATE TRIGGER handle_market_items_updated_at
    BEFORE UPDATE ON public.market_items
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 3. RESOLUCIÓ DE MÚLTIPLES CATEGORIES I PREPARACIÓ P2P
-- Aquest camp permetrà emmagatzemar més d'una categoria per ítem (ex: "Artesania" i "Roba")
-- i, al ser UUIDs, prepara el terreny per a quan migrem market_categories a UUID.
ALTER TABLE public.market_items ADD COLUMN IF NOT EXISTS category_uuids UUID[] DEFAULT '{}';

-- 4. AFEGIR RESTRICCIÓ D'ESTAT (Si no existia, per garantir Trellat)
-- Assegurem que l'estat d'un ítem de mercat està sempre controlat.
ALTER TABLE public.market_items ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';
ALTER TABLE public.market_items DROP CONSTRAINT IF EXISTS market_items_status_check;
ALTER TABLE public.market_items ADD CONSTRAINT market_items_status_check CHECK (status IN ('draft', 'active', 'archived', 'flagged'));

COMMIT;

DO $$
BEGIN
    RAISE NOTICE 'Market Items refinement applied successfully. Added tags, updated_at, and array-based multi-categories support.';
END
$$;

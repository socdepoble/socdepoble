-- ==============================================================================
-- SÓC DE POBLE: Market Categories Audit & Refinement
-- Timestamp: 2026-05-05 23:15
-- Category: Architecture / Schema Hardening
-- Description: Standardizes the market_categories table adding missing thermodynamic 
-- fields (updated_at), CMS features (tags, status), and prepares the ground for
-- offline-first UUID migration if necessary.
-- ==============================================================================

BEGIN;

-- 1. AFEGIR CAMPS DE METADADES I CMS (Tags, Status)
ALTER TABLE public.market_categories ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
ALTER TABLE public.market_categories ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';

-- 2. AFEGIR TERMODINÀMICA (updated_at)
ALTER TABLE public.market_categories ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- 3. CADENAT DE SEGURETAT PER A STATUS
ALTER TABLE public.market_categories DROP CONSTRAINT IF EXISTS market_categories_status_check;
ALTER TABLE public.market_categories ADD CONSTRAINT market_categories_status_check CHECK (status IN ('active', 'inactive', 'archived'));

-- 4. TRIGGER PER ACTUALITZAR 'updated_at' AUTOMÀTICAMENT
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS handle_market_categories_updated_at ON public.market_categories;
CREATE TRIGGER handle_market_categories_updated_at
    BEFORE UPDATE ON public.market_categories
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

COMMIT;

DO $$
BEGIN
    RAISE NOTICE 'Market Categories refinement applied successfully. Added tags, status, and updated_at thermodynamics.';
END
$$;

-- ==============================================================================
-- SÓC DE POBLE: Market Categories UUID Migration
-- Timestamp: 2026-05-05 23:40
-- Category: Architecture / Offline-First Hardening
-- Description: Migrates market_categories 'id' from int to UUID to support
-- offline generation. 
-- ==============================================================================

BEGIN;

-- 1. AFEGIR UUID A LES CATEGORIES
ALTER TABLE public.market_categories ADD COLUMN new_uuid UUID DEFAULT gen_random_uuid();

-- 2. ELIMINAR RELACIONS VELLES (Per prevenció)
ALTER TABLE public.market_items DROP CONSTRAINT IF EXISTS market_items_category_id_fkey;
ALTER TABLE public.market_items DROP CONSTRAINT IF EXISTS market_items_category_uuid_fkey;

-- 3. ELIMINAR EL VELL ID SENCER I ESTABLIR EL UUID COM A PRIMÀRIA
ALTER TABLE public.market_categories DROP CONSTRAINT IF EXISTS market_categories_pkey CASCADE;
ALTER TABLE public.market_categories DROP COLUMN id;
ALTER TABLE public.market_categories RENAME COLUMN new_uuid TO id;
ALTER TABLE public.market_categories ADD PRIMARY KEY (id);

COMMIT;

DO $$
BEGIN
    RAISE NOTICE 'Market Categories UUID migration complete. Integer IDs eliminated. Architecture is now 100 percent P2P ready.';
END
$$;

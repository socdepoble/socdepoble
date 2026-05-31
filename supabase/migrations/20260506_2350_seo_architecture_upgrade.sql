-- Migration: 20260506_2350_seo_architecture_upgrade.sql
-- Propòsit: Incorporar metadades SEO avançades (Títol, Descripció, Paraules Clau i Slugs natius) a totes les entitats públiques per permetre un indexat òptim i generació dinàmica d'Open Graph.

BEGIN;

-- ======================================================================
-- 1. TAULA: TOWNS (Pobles)
-- ======================================================================
ALTER TABLE public.towns ADD COLUMN IF NOT EXISTS seo_title TEXT;
ALTER TABLE public.towns ADD COLUMN IF NOT EXISTS seo_description TEXT;
ALTER TABLE public.towns ADD COLUMN IF NOT EXISTS seo_keywords TEXT;
ALTER TABLE public.towns ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;

-- Auto-generar slugs per als pobles que no en tinguen (basat en el nom)
UPDATE public.towns 
SET slug = lower(regexp_replace(regexp_replace(name, '[^a-zA-Z0-9\s-]', '', 'g'), '\s+', '-', 'g'))
WHERE slug IS NULL;


-- ======================================================================
-- 2. TAULA: POSTS (Publicacions P2P)
-- ======================================================================
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS seo_title TEXT;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS seo_description TEXT;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS seo_keywords TEXT;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;


-- ======================================================================
-- 3. TAULA: MARKET_ITEMS (Comerç Local)
-- ======================================================================
ALTER TABLE public.market_items ADD COLUMN IF NOT EXISTS seo_title TEXT;
ALTER TABLE public.market_items ADD COLUMN IF NOT EXISTS seo_description TEXT;
ALTER TABLE public.market_items ADD COLUMN IF NOT EXISTS seo_keywords TEXT;
ALTER TABLE public.market_items ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;


-- ======================================================================
-- 4. TAULA: ENTITIES (Ajuntaments, Filles, etc.)
-- ======================================================================
ALTER TABLE public.entities ADD COLUMN IF NOT EXISTS seo_title TEXT;
ALTER TABLE public.entities ADD COLUMN IF NOT EXISTS seo_description TEXT;
ALTER TABLE public.entities ADD COLUMN IF NOT EXISTS seo_keywords TEXT;
ALTER TABLE public.entities ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;

-- Auto-generar slugs base si falta
UPDATE public.entities 
SET slug = lower(regexp_replace(regexp_replace(name, '[^a-zA-Z0-9\s-]', '', 'g'), '\s+', '-', 'g')) || '-' || substring(id::text from 1 for 6)
WHERE slug IS NULL AND name IS NOT NULL;


-- ======================================================================
-- 5. ÍNDEXS PER A RENDIMENT I CERCABILITAT (SEO)
-- ======================================================================
CREATE INDEX IF NOT EXISTS idx_towns_slug ON public.towns (slug);
CREATE INDEX IF NOT EXISTS idx_posts_slug ON public.posts (slug);
CREATE INDEX IF NOT EXISTS idx_market_items_slug ON public.market_items (slug);
CREATE INDEX IF NOT EXISTS idx_entities_slug ON public.entities (slug);

COMMIT;

DO $$
BEGIN
    RAISE NOTICE 'SEO Architecture Upgrade Complete! Sóc de Poble is now fully indexable.';
END $$;

-- ==============================================================================
-- MIGRATION: 20260506_0120_core_social_hardening.sql
-- DESCRIPTION: Hardening of the 'posts' and 'market_items' tables to enforce
--              Null-Safety, structural integrity, and indexing for offline-first
--              iPad A10 performance.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- FASE 1: HARDENING 'posts'
-- ------------------------------------------------------------------------------

-- 1.1 Textual Null-Safety Updates
UPDATE public.posts SET author_type = 'HUMAN' WHERE author_type IS NULL;
UPDATE public.posts SET author_role = 'Habitant' WHERE author_role IS NULL;
UPDATE public.posts SET image_alt = 'EMPTY' WHERE image_alt IS NULL;
UPDATE public.posts SET language = 'ca-ES' WHERE language IS NULL;

-- 1.2 Constraint Alterations (Making text columns NOT NULL via Defaults if possible)
ALTER TABLE public.posts ALTER COLUMN author_type SET DEFAULT 'HUMAN';
ALTER TABLE public.posts ALTER COLUMN author_role SET DEFAULT 'Habitant';
ALTER TABLE public.posts ALTER COLUMN image_alt SET DEFAULT 'EMPTY';
ALTER TABLE public.posts ALTER COLUMN language SET DEFAULT 'ca-ES';

-- 1.3 Arrays/JSON Null-Safety
UPDATE public.posts SET categories = '{}'::text[] WHERE categories IS NULL;
UPDATE public.posts SET tags = '{}'::text[] WHERE tags IS NULL;

ALTER TABLE public.posts ALTER COLUMN categories SET DEFAULT '{}'::text[];
ALTER TABLE public.posts ALTER COLUMN tags SET DEFAULT '{}'::text[];

-- 1.4 Performance Indexes for Feeds and Profiles
-- Drop if exists to avoid conflicts
DROP INDEX IF EXISTS idx_posts_feed;
DROP INDEX IF EXISTS idx_posts_author;

-- Feed Index: town_uuid and created_at DESC for primary feed load
CREATE INDEX idx_posts_feed ON public.posts (town_uuid, created_at DESC);

-- Author Index: author_user_id and created_at DESC for user profiles
CREATE INDEX idx_posts_author ON public.posts (author_user_id, created_at DESC);


-- ------------------------------------------------------------------------------
-- FASE 2: HARDENING 'market_items'
-- ------------------------------------------------------------------------------

-- 2.1 Textual Null-Safety Updates
UPDATE public.market_items SET subtitle = 'EMPTY' WHERE subtitle IS NULL;
UPDATE public.market_items SET description = 'EMPTY' WHERE description IS NULL;
UPDATE public.market_items SET category_slug = 'tot' WHERE category_slug IS NULL;
UPDATE public.market_items SET status = 'active' WHERE status IS NULL;

-- 2.2 Constraint Alterations (Defaults)
ALTER TABLE public.market_items ALTER COLUMN subtitle SET DEFAULT 'EMPTY';
ALTER TABLE public.market_items ALTER COLUMN description SET DEFAULT 'EMPTY';
ALTER TABLE public.market_items ALTER COLUMN category_slug SET DEFAULT 'tot';
ALTER TABLE public.market_items ALTER COLUMN status SET DEFAULT 'active';

-- 2.3 Performance Indexes for Market Feeds
DROP INDEX IF EXISTS idx_market_feed;
DROP INDEX IF EXISTS idx_market_pinned;

-- Market Feed Index: town_uuid, status, created_at DESC
CREATE INDEX idx_market_feed ON public.market_items (town_uuid, status, created_at DESC);

-- Pinned Index: is_pinned filtering
CREATE INDEX idx_market_pinned ON public.market_items (is_pinned) WHERE is_pinned = true;

-- ==============================================================================
-- END OF MIGRATION
-- ==============================================================================

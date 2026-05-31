-- Migration: 20260506_2345_global_uuid_absolute_purge.sql
-- Propòsit: Purga d'IDs sencers (Legacy INT4) a les taules que van ser migrades a UUID prèviament (posts, post_translations, market_categories) per erradicar completament el deute tècnic.

BEGIN;

-- ======================================================================
-- 1. PURGA ABSOLUTA: POSTS I POST_TRANSLATIONS
-- ======================================================================

-- 1.1 Llevar les Foreign Keys antigues de post_translations que apunten a posts(id) numèric
ALTER TABLE public.post_translations DROP CONSTRAINT IF EXISTS post_translations_post_id_fkey;

-- 1.2 Llevar claus primàries actuals
ALTER TABLE public.post_translations DROP CONSTRAINT IF EXISTS post_translations_pkey CASCADE;
ALTER TABLE public.posts DROP CONSTRAINT IF EXISTS posts_pkey CASCADE;

-- 1.3 Eliminar columnes numèriques (Deute Tècnic)
ALTER TABLE public.post_translations DROP COLUMN IF EXISTS id CASCADE;
ALTER TABLE public.post_translations DROP COLUMN IF EXISTS post_id CASCADE;
ALTER TABLE public.posts DROP COLUMN IF EXISTS id CASCADE;

-- 1.4 Promocionar UUID a ID i establir Primary Keys
ALTER TABLE public.post_translations RENAME COLUMN uuid TO id;
ALTER TABLE public.post_translations ADD PRIMARY KEY (id);

ALTER TABLE public.posts RENAME COLUMN uuid TO id;
ALTER TABLE public.posts ADD PRIMARY KEY (id);

-- 1.5 Regenerar la Foreign Key utilitzant la nova clau primària UUID (id)
-- Note: 'post_uuid' points to the new 'id' of posts
ALTER TABLE public.post_translations ADD CONSTRAINT post_translations_post_uuid_fkey FOREIGN KEY (post_uuid) REFERENCES public.posts(id) ON DELETE CASCADE;


-- ======================================================================
-- 2. VERIFICACIÓ DE NETEJA
-- ======================================================================

COMMIT;

DO $$
BEGIN
    RAISE NOTICE 'Global UUID Absolute Purge Complete! All legacy integer IDs destroyed in posts.';
END $$;

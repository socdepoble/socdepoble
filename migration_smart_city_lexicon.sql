-- [MASTER] Smart City Knowledge Base - Lexicon Table
-- This table stores curated resources, links, and knowledge for the community.

CREATE TABLE IF NOT EXISTS public.lexicon (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    url TEXT UNIQUE,
    category TEXT,
    tags TEXT[] DEFAULT '{}',
    content TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    is_official BOOLEAN DEFAULT false,
    town_uuid UUID,
    source TEXT DEFAULT 'manual',
    author_id UUID DEFAULT auth.uid(), -- Afegit: Autor de la llavor
    ai_metadata JSONB DEFAULT '{}'
);

-- REPARACIÓ ROBUSTA: Assegurar totes les columnes per a la Smart City
DO $$ 
BEGIN 
    -- Columna: title (obligatòria)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='lexicon' AND column_name='title') THEN
        ALTER TABLE public.lexicon ADD COLUMN title TEXT NOT NULL DEFAULT 'Sense títol';
    END IF;

    -- Columna: content (la que ha fallat ara)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='lexicon' AND column_name='content') THEN
        ALTER TABLE public.lexicon ADD COLUMN content TEXT;
    END IF;

    -- Columna: url
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='lexicon' AND column_name='url') THEN
        ALTER TABLE public.lexicon ADD COLUMN url TEXT UNIQUE;
    END IF;
    
    -- Columna: category
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='lexicon' AND column_name='category') THEN
        ALTER TABLE public.lexicon ADD COLUMN category TEXT;
    END IF;

    -- Columna: tags
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='lexicon' AND column_name='tags') THEN
        ALTER TABLE public.lexicon ADD COLUMN tags TEXT[] DEFAULT '{}';
    END IF;

    -- Columna: is_official
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='lexicon' AND column_name='is_official') THEN
        ALTER TABLE public.lexicon ADD COLUMN is_official BOOLEAN DEFAULT false;
    END IF;

    -- Columna: town_uuid
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='lexicon' AND column_name='town_uuid') THEN
        ALTER TABLE public.lexicon ADD COLUMN town_uuid UUID;
    END IF;

    -- Columna: author_id
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='lexicon' AND column_name='author_id') THEN
        ALTER TABLE public.lexicon ADD COLUMN author_id UUID DEFAULT auth.uid();
    END IF;

    -- Columna: source
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='lexicon' AND column_name='source') THEN
        ALTER TABLE public.lexicon ADD COLUMN source TEXT DEFAULT 'manual';
    END IF;

    -- Columna: ai_metadata
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='lexicon' AND column_name='ai_metadata') THEN
        ALTER TABLE public.lexicon ADD COLUMN ai_metadata JSONB DEFAULT '{}';
    END IF;
END $$;

-- RLS Policies [OPTIMITZAES SEGONS LINTER]
ALTER TABLE public.lexicon ENABLE ROW LEVEL SECURITY;

-- Everyone can read (Optimitzat: SELECT true és estàtic)
DROP POLICY IF EXISTS "Public Read Lexicon" ON public.lexicon;
DROP POLICY IF EXISTS "Public lexicon viewable by everyone" ON public.lexicon; -- Redundant
CREATE POLICY "Public Read Lexicon" ON public.lexicon 
    FOR SELECT USING (true);

-- Authenticated can insert (Solucionant Warning 0024 i rendiment InitPlan)
DROP POLICY IF EXISTS "Authenticated Insert Lexicon" ON public.lexicon;
DROP POLICY IF EXISTS "Authenticated users can insert lexicon" ON public.lexicon; -- Redundant
CREATE POLICY "Authenticated Insert Lexicon" ON public.lexicon 
    FOR INSERT TO authenticated WITH CHECK ((SELECT auth.uid()) IS NOT NULL);

-- Admin manage (Solucionant performance i redundant policies)
DROP POLICY IF EXISTS "Admin Manage Lexicon" ON public.lexicon;
CREATE POLICY "Admin Manage Lexicon" ON public.lexicon 
    FOR ALL TO authenticated USING (
        (SELECT auth.uid()) IS NOT NULL 
        AND (auth.jwt() ->> 'role' = 'admin' OR (SELECT auth.uid()) = author_id)
    );

-- Indexes
CREATE INDEX IF NOT EXISTS idx_lexicon_url ON public.lexicon(url);
CREATE INDEX IF NOT EXISTS idx_lexicon_category ON public.lexicon(category);
CREATE INDEX IF NOT EXISTS idx_lexicon_tags ON public.lexicon USING GIN (tags);

-- Sóc de Poble: Lexicon Architecture Upgrade
-- This migration hardens the lexicon table for offline-first CRDT synchronization and scalability.

-- 1. ADD NEW COLUMNS
ALTER TABLE public.lexicon ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());
ALTER TABLE public.lexicon ADD COLUMN IF NOT EXISTS audio_url TEXT;
ALTER TABLE public.lexicon ADD COLUMN IF NOT EXISTS synonyms TEXT[];
ALTER TABLE public.lexicon ADD COLUMN IF NOT EXISTS tags TEXT[];
ALTER TABLE public.lexicon ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'approved';

-- 2. CREATE updated_at TRIGGER FUNCTION IF NOT EXISTS
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'update_lexicon_updated_at_column') THEN
        CREATE FUNCTION public.update_lexicon_updated_at_column()
        RETURNS TRIGGER AS $func$
        BEGIN
           NEW.updated_at = timezone('utc'::text, now());
           RETURN NEW;
        END;
        $func$ LANGUAGE plpgsql;
    END IF;
END
$$;

-- 3. CREATE TRIGGER FOR LEXICON
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_lexicon_updated_at') THEN
        CREATE TRIGGER set_lexicon_updated_at
        BEFORE UPDATE ON public.lexicon
        FOR EACH ROW
        EXECUTE FUNCTION public.update_lexicon_updated_at_column();
    END IF;
END
$$;

-- 4. VERIFICATION NOTICE
DO $$
BEGIN
    RAISE NOTICE 'Lexicon architecture upgrade applied successfully. Added updated_at, audio_url, synonyms, tags, and status.';
END
$$;

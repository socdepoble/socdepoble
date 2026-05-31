-- Sóc de Poble: Lexicon Refinement
-- Purges legacy fields and adds missing constraints and linguistic fields based on forensic audit.

BEGIN;

-- 1. DROP LEGACY TOWN ID
-- Eliminem la columna obsoleta per evitar conflictes amb town_uuid.
ALTER TABLE public.lexicon DROP COLUMN IF EXISTS town_id;

-- 2. ADD PHONETICS FIELD
-- Camp clau per a la preservació dialectal exacta.
ALTER TABLE public.lexicon ADD COLUMN IF NOT EXISTS phonetics TEXT;

-- 3. ADD STRICT STATUS CONSTRAINT
-- Afegim un cadenat de seguretat per evitar estats invàlids que trencarien la lògica de la IAIA.
ALTER TABLE public.lexicon DROP CONSTRAINT IF EXISTS lexicon_status_check;
ALTER TABLE public.lexicon ADD CONSTRAINT lexicon_status_check CHECK (status IN ('pending', 'approved', 'rejected'));

COMMIT;

DO $$
BEGIN
    RAISE NOTICE 'Lexicon refinement applied successfully. Purged town_id, added phonetics, locked status constraint.';
END
$$;

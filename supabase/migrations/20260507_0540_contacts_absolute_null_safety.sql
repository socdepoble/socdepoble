-- Migration: Contacts - Enforce Absolute Null-Safety (Remove NULLs, enforce '')
-- Date: 2026-05-07
-- Description: The 'Trellat' philosophy requires NO NULLs in the contacts table.
-- All optional vCard string fields must be NOT NULL with DEFAULT ''.
-- This also cleans up 'No ho sé' placeholders back to '' (empty string).

BEGIN;

-- 1. CLEANUP EXISTING DATA: Replace 'No ho sé' and any accidental NULLs with ''
UPDATE public.contacts 
SET 
    n_prefix = CASE WHEN n_prefix = 'No ho sé' OR n_prefix IS NULL THEN '' ELSE n_prefix END,
    n_first = CASE WHEN n_first = 'No ho sé' OR n_first IS NULL THEN '' ELSE n_first END,
    n_middle = CASE WHEN n_middle = 'No ho sé' OR n_middle IS NULL THEN '' ELSE n_middle END,
    n_last = CASE WHEN n_last = 'No ho sé' OR n_last IS NULL THEN '' ELSE n_last END,
    n_suffix = CASE WHEN n_suffix = 'No ho sé' OR n_suffix IS NULL THEN '' ELSE n_suffix END,
    phonetic_first = CASE WHEN phonetic_first = 'No ho sé' OR phonetic_first IS NULL THEN '' ELSE phonetic_first END,
    phonetic_middle = CASE WHEN phonetic_middle = 'No ho sé' OR phonetic_middle IS NULL THEN '' ELSE phonetic_middle END,
    phonetic_last = CASE WHEN phonetic_last = 'No ho sé' OR phonetic_last IS NULL THEN '' ELSE phonetic_last END,
    org_company = CASE WHEN org_company = 'No ho sé' OR org_company IS NULL THEN '' ELSE org_company END,
    org_department = CASE WHEN org_department = 'No ho sé' OR org_department IS NULL THEN '' ELSE org_department END,
    org_title = CASE WHEN org_title = 'No ho sé' OR org_title IS NULL THEN '' ELSE org_title END,
    bday = CASE WHEN bday = 'No ho sé' OR bday IS NULL THEN '' ELSE bday END,
    note = CASE WHEN note = 'No ho sé' OR note IS NULL THEN '' ELSE note END;

-- 2. ENFORCE NOT NULL CONSTRAINTS AND SET DEFAULT ''
ALTER TABLE public.contacts ALTER COLUMN n_prefix SET DEFAULT '', ALTER COLUMN n_prefix SET NOT NULL;
ALTER TABLE public.contacts ALTER COLUMN n_first SET DEFAULT '', ALTER COLUMN n_first SET NOT NULL;
ALTER TABLE public.contacts ALTER COLUMN n_middle SET DEFAULT '', ALTER COLUMN n_middle SET NOT NULL;
ALTER TABLE public.contacts ALTER COLUMN n_last SET DEFAULT '', ALTER COLUMN n_last SET NOT NULL;
ALTER TABLE public.contacts ALTER COLUMN n_suffix SET DEFAULT '', ALTER COLUMN n_suffix SET NOT NULL;

ALTER TABLE public.contacts ALTER COLUMN phonetic_first SET DEFAULT '', ALTER COLUMN phonetic_first SET NOT NULL;
ALTER TABLE public.contacts ALTER COLUMN phonetic_middle SET DEFAULT '', ALTER COLUMN phonetic_middle SET NOT NULL;
ALTER TABLE public.contacts ALTER COLUMN phonetic_last SET DEFAULT '', ALTER COLUMN phonetic_last SET NOT NULL;

ALTER TABLE public.contacts ALTER COLUMN org_company SET DEFAULT '', ALTER COLUMN org_company SET NOT NULL;
ALTER TABLE public.contacts ALTER COLUMN org_department SET DEFAULT '', ALTER COLUMN org_department SET NOT NULL;
ALTER TABLE public.contacts ALTER COLUMN org_title SET DEFAULT '', ALTER COLUMN org_title SET NOT NULL;

ALTER TABLE public.contacts ALTER COLUMN bday SET DEFAULT '', ALTER COLUMN bday SET NOT NULL;
ALTER TABLE public.contacts ALTER COLUMN note SET DEFAULT '', ALTER COLUMN note SET NOT NULL;

COMMIT;

DO $$
BEGIN
    RAISE NOTICE 'Contacts table architecture restored: Absolute Null-Safety enforced (NOT NULL DEFAULT ''''). ''No ho sé'' values purged.';
END
$$;

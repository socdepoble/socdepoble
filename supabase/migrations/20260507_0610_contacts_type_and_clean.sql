-- Migration: Contacts Architecture Finalization and Purge
-- Date: 2026-05-07
-- Description: Adds contact_type, removes invalid NOT NULL DEFAULT '' constraints, and purges empty strings and 'No ho sé'.

BEGIN;

-- 1. Add contact_type column
ALTER TABLE public.contacts ADD COLUMN contact_type TEXT;
ALTER TABLE public.contacts ADD CONSTRAINT contacts_type_check CHECK (contact_type IN ('human', 'ai', 'business', 'institution', 'group', 'system'));

-- 2. Remove NOT NULL and DEFAULT '' constraints that were added wrongly
ALTER TABLE public.contacts
    ALTER COLUMN n_prefix DROP DEFAULT,
    ALTER COLUMN n_prefix DROP NOT NULL,
    ALTER COLUMN n_first DROP DEFAULT,
    ALTER COLUMN n_first DROP NOT NULL,
    ALTER COLUMN n_middle DROP DEFAULT,
    ALTER COLUMN n_middle DROP NOT NULL,
    ALTER COLUMN n_last DROP DEFAULT,
    ALTER COLUMN n_last DROP NOT NULL,
    ALTER COLUMN n_suffix DROP DEFAULT,
    ALTER COLUMN n_suffix DROP NOT NULL,
    ALTER COLUMN nickname DROP DEFAULT,
    ALTER COLUMN nickname DROP NOT NULL,
    ALTER COLUMN phonetic_first DROP DEFAULT,
    ALTER COLUMN phonetic_first DROP NOT NULL,
    ALTER COLUMN phonetic_middle DROP DEFAULT,
    ALTER COLUMN phonetic_middle DROP NOT NULL,
    ALTER COLUMN phonetic_last DROP DEFAULT,
    ALTER COLUMN phonetic_last DROP NOT NULL,
    ALTER COLUMN org_company DROP DEFAULT,
    ALTER COLUMN org_company DROP NOT NULL,
    ALTER COLUMN org_department DROP DEFAULT,
    ALTER COLUMN org_department DROP NOT NULL,
    ALTER COLUMN org_title DROP DEFAULT,
    ALTER COLUMN org_title DROP NOT NULL,
    ALTER COLUMN bday DROP DEFAULT,
    ALTER COLUMN bday DROP NOT NULL,
    ALTER COLUMN note DROP DEFAULT,
    ALTER COLUMN note DROP NOT NULL,
    ALTER COLUMN photo_url DROP DEFAULT,
    ALTER COLUMN photo_url DROP NOT NULL;

-- 3. Purge Dirty Data ('No ho sé' and '')
UPDATE public.contacts SET
    n_prefix = NULLIF(NULLIF(n_prefix, ''), 'No ho sé'),
    n_first = NULLIF(NULLIF(n_first, ''), 'No ho sé'),
    n_middle = NULLIF(NULLIF(n_middle, ''), 'No ho sé'),
    n_last = NULLIF(NULLIF(n_last, ''), 'No ho sé'),
    n_suffix = NULLIF(NULLIF(n_suffix, ''), 'No ho sé'),
    nickname = NULLIF(NULLIF(nickname, ''), 'No ho sé'),
    phonetic_first = NULLIF(NULLIF(phonetic_first, ''), 'No ho sé'),
    phonetic_middle = NULLIF(NULLIF(phonetic_middle, ''), 'No ho sé'),
    phonetic_last = NULLIF(NULLIF(phonetic_last, ''), 'No ho sé'),
    org_company = NULLIF(NULLIF(org_company, ''), 'No ho sé'),
    org_department = NULLIF(NULLIF(org_department, ''), 'No ho sé'),
    org_title = NULLIF(NULLIF(org_title, ''), 'No ho sé'),
    bday = NULLIF(NULLIF(bday, ''), 'No ho sé'),
    note = NULLIF(NULLIF(note, ''), 'No ho sé'),
    photo_url = NULLIF(NULLIF(photo_url, ''), 'No ho sé');

-- 4. Set contact_type logically based on current fields
UPDATE public.contacts
SET contact_type = 
    CASE
        -- Identify AI Agents and System Bots
        WHEN labels @> '"AI Agent"'::jsonb OR labels @> '"Bot"'::jsonb THEN 'ai'
        -- Identify specifically system non-AI processes like admin user
        WHEN labels @> '"System"'::jsonb AND NOT (labels @> '"Test User"'::jsonb) AND NOT (labels @> '"AI Agent"'::jsonb) THEN 'system'
        -- Identify Test Entities as institutions or businesses
        WHEN labels @> '"Entity"'::jsonb AND labels @> '"Government"'::jsonb THEN 'institution'
        WHEN labels @> '"Entity"'::jsonb AND labels @> '"Agriculture"'::jsonb THEN 'business'
        -- Human profiles (or test users which are humans)
        WHEN profile_id IS NOT NULL THEN 'human'
        -- Other Entities (fallback based on entity_id)
        WHEN entity_id IS NOT NULL THEN 'business'
        -- Final fallback
        ELSE 'human'
    END;

-- Ensure contact_type is set and then make it NOT NULL
ALTER TABLE public.contacts ALTER COLUMN contact_type SET NOT NULL;

COMMIT;

DO $$
BEGIN
    RAISE NOTICE 'Contacts table architecture finalized. Trash data purged. contact_type populated successfully.';
END
$$;

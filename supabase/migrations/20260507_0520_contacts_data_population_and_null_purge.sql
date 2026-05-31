-- Migration: Contacts Data Population and Null Purge
-- Date: 2026-05-07
-- Description: Inserts missing profiles into contacts, populates all missing fields with 'No ho sé' for real entities/humans, and fake realistic data for AIs. Alters columns to NOT NULL DEFAULT ''.

BEGIN;

-- 1. Alter bday to TEXT to allow placeholders like 'No ho sé'
ALTER TABLE public.contacts ALTER COLUMN bday TYPE TEXT USING bday::text;

-- 2. Insert missing profiles into contacts
INSERT INTO public.contacts (profile_id, fn, n_first, n_last, nickname)
SELECT 
    id, 
    username, 
    split_part(username, ' ', 1), 
    CASE WHEN username LIKE '% %' THEN split_part(username, ' ', 2) ELSE 'No ho sé' END,
    username
FROM public.profiles
WHERE id NOT IN (SELECT profile_id FROM public.contacts WHERE profile_id IS NOT NULL);

-- 3. Populate Data with strict rules
DO $$
DECLARE
    v_contact RECORD;
    v_is_real BOOLEAN;
    v_type TEXT;
BEGIN
    FOR v_contact IN SELECT * FROM public.contacts LOOP
        
        -- Determine if Real or AI
        IF v_contact.profile_id IS NOT NULL THEN
            v_is_real := true;
            v_type := 'profile';
        ELSIF v_contact.entity_id IS NOT NULL THEN
            SELECT is_real INTO v_is_real FROM public.entities WHERE id = v_contact.entity_id;
            v_type := 'entity';
        ELSE
            v_is_real := true;
        END IF;

        IF v_is_real THEN
            -- Real Entity or Human
            UPDATE public.contacts SET
                n_prefix = COALESCE(NULLIF(n_prefix, ''), 'No ho sé'),
                n_first = COALESCE(NULLIF(n_first, ''), CASE WHEN v_type = 'entity' THEN '' ELSE 'No ho sé' END),
                n_middle = COALESCE(NULLIF(n_middle, ''), 'No ho sé'),
                n_last = COALESCE(NULLIF(n_last, ''), CASE WHEN v_type = 'entity' THEN '' ELSE 'No ho sé' END),
                n_suffix = COALESCE(NULLIF(n_suffix, ''), 'No ho sé'),
                nickname = COALESCE(NULLIF(nickname, ''), 'No ho sé'),
                phonetic_first = COALESCE(NULLIF(phonetic_first, ''), 'No ho sé'),
                phonetic_middle = COALESCE(NULLIF(phonetic_middle, ''), 'No ho sé'),
                phonetic_last = COALESCE(NULLIF(phonetic_last, ''), 'No ho sé'),
                org_company = COALESCE(NULLIF(org_company, ''), fn),
                org_department = COALESCE(NULLIF(org_department, ''), 'No ho sé'),
                org_title = COALESCE(NULLIF(org_title, ''), 'No ho sé'),
                bday = COALESCE(NULLIF(bday, ''), 'No ho sé'),
                note = COALESCE(NULLIF(note, ''), 'No ho sé'),
                photo_url = COALESCE(NULLIF(photo_url, ''), 'No ho sé')
            WHERE id = v_contact.id;
            
        ELSE
            -- AI Entity (Fake realistic data)
            UPDATE public.contacts SET
                n_prefix = COALESCE(NULLIF(n_prefix, ''), 'Agent IA'),
                n_first = COALESCE(NULLIF(n_first, ''), fn),
                n_middle = COALESCE(NULLIF(n_middle, ''), ''),
                n_last = COALESCE(NULLIF(n_last, ''), 'Sintètic'),
                n_suffix = COALESCE(NULLIF(n_suffix, ''), 'v1.0'),
                nickname = COALESCE(NULLIF(nickname, ''), 'Bot'),
                phonetic_first = COALESCE(NULLIF(phonetic_first, ''), 'IA'),
                phonetic_middle = COALESCE(NULLIF(phonetic_middle, ''), ''),
                phonetic_last = COALESCE(NULLIF(phonetic_last, ''), ''),
                org_company = COALESCE(NULLIF(org_company, ''), 'Sóc de Poble'),
                org_department = COALESCE(NULLIF(org_department, ''), 'Atenció Virtual i IA'),
                org_title = COALESCE(NULLIF(org_title, ''), 'Assistent Cognitiu'),
                bday = COALESCE(NULLIF(bday, ''), '2026-01-01'),
                note = COALESCE(NULLIF(note, ''), 'Agent conversacional autònom de la plataforma.'),
                photo_url = COALESCE(NULLIF(photo_url, ''), '/assets/brand/iaia_maria.png'),
                phones = CASE 
                    WHEN jsonb_array_length(phones) = 0 THEN '[{"label": "Mobile", "country_code": "+34", "number": "555123456"}]'::jsonb 
                    ELSE phones 
                END,
                emails = CASE 
                    WHEN jsonb_array_length(emails) = 0 THEN '[{"label": "Work", "value": "ia.system@socdepoble.org"}]'::jsonb 
                    ELSE emails 
                END
            WHERE id = v_contact.id;
        END IF;

    END LOOP;
END $$;

-- 4. Apply absolute Trellat (NOT NULL DEFAULT '') to prevent future nulls
ALTER TABLE public.contacts ALTER COLUMN n_prefix SET DEFAULT '';
ALTER TABLE public.contacts ALTER COLUMN n_prefix SET NOT NULL;

ALTER TABLE public.contacts ALTER COLUMN n_first SET DEFAULT '';
ALTER TABLE public.contacts ALTER COLUMN n_first SET NOT NULL;

ALTER TABLE public.contacts ALTER COLUMN n_middle SET DEFAULT '';
ALTER TABLE public.contacts ALTER COLUMN n_middle SET NOT NULL;

ALTER TABLE public.contacts ALTER COLUMN n_last SET DEFAULT '';
ALTER TABLE public.contacts ALTER COLUMN n_last SET NOT NULL;

ALTER TABLE public.contacts ALTER COLUMN n_suffix SET DEFAULT '';
ALTER TABLE public.contacts ALTER COLUMN n_suffix SET NOT NULL;

ALTER TABLE public.contacts ALTER COLUMN nickname SET DEFAULT '';
ALTER TABLE public.contacts ALTER COLUMN nickname SET NOT NULL;

ALTER TABLE public.contacts ALTER COLUMN phonetic_first SET DEFAULT '';
ALTER TABLE public.contacts ALTER COLUMN phonetic_first SET NOT NULL;

ALTER TABLE public.contacts ALTER COLUMN phonetic_middle SET DEFAULT '';
ALTER TABLE public.contacts ALTER COLUMN phonetic_middle SET NOT NULL;

ALTER TABLE public.contacts ALTER COLUMN phonetic_last SET DEFAULT '';
ALTER TABLE public.contacts ALTER COLUMN phonetic_last SET NOT NULL;

ALTER TABLE public.contacts ALTER COLUMN org_company SET DEFAULT '';
ALTER TABLE public.contacts ALTER COLUMN org_company SET NOT NULL;

ALTER TABLE public.contacts ALTER COLUMN org_department SET DEFAULT '';
ALTER TABLE public.contacts ALTER COLUMN org_department SET NOT NULL;

ALTER TABLE public.contacts ALTER COLUMN org_title SET DEFAULT '';
ALTER TABLE public.contacts ALTER COLUMN org_title SET NOT NULL;

ALTER TABLE public.contacts ALTER COLUMN bday SET DEFAULT '';
ALTER TABLE public.contacts ALTER COLUMN bday SET NOT NULL;

ALTER TABLE public.contacts ALTER COLUMN note SET DEFAULT '';
ALTER TABLE public.contacts ALTER COLUMN note SET NOT NULL;

ALTER TABLE public.contacts ALTER COLUMN photo_url SET DEFAULT '';
ALTER TABLE public.contacts ALTER COLUMN photo_url SET NOT NULL;

COMMIT;

DO $$
BEGIN
    RAISE NOTICE 'Contacts populated successfully. All NULLs purged. Ready for manual review.';
END
$$;

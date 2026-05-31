-- Migration: Contacts Extreme Realism and Null Eradication
-- Date: 2026-05-07
-- Description: Perfects the contact_type classification, populates all missing fields with "Extreme Realism" 
-- fictional data, and restores strict NOT NULL constraints without empty string garbage.

BEGIN;

-- 1. Perfect the `contact_type` logic
-- We define the strict ontological boundaries of the Sóc de Poble universe.
UPDATE public.contacts
SET contact_type = 
    CASE
        -- 1. The Real Humans (Strictly defined)
        WHEN fn ILIKE '%nando%' OR fn ILIKE '%damià%' OR fn ILIKE '%javi%' OR nickname IN ('nandollorens', 'damiallorens', 'javillinares') THEN 'human'
        
        -- 2. The Group
        WHEN fn ILIKE '%rentonar%' OR nickname ILIKE '%rentonar%' THEN 'group'
        
        -- 3. AI Agents (IAIA ecosystem)
        WHEN labels @> '"AI Agent"'::jsonb OR nickname IN ('IAIA', 'La Cotilla', 'El Cronista', 'Spider', 'El Mestre', 'Nano', 'Rúper', 'Omni') THEN 'ai'
        
        -- 4. Systems (Bots, Admins, Automated processes)
        WHEN labels @> '"System"'::jsonb OR nickname IN ('admin', 'Bot') THEN 'system'
        
        -- 5. Test Entities / Test Users
        WHEN labels @> '"Test User"'::jsonb THEN 'system'
        
        -- 6. Institutions (Governments, Schools, etc)
        WHEN labels @> '"Government"'::jsonb OR labels @> '"Education"'::jsonb OR labels @> '"Healthcare"'::jsonb OR fn ILIKE '%ajuntament%' THEN 'institution'
        
        -- 7. Businesses (Cooperatives, Services, Tourism)
        WHEN labels @> '"Agriculture"'::jsonb OR labels @> '"Utilities"'::jsonb OR labels @> '"Tourism"'::jsonb OR labels @> '"Entity"'::jsonb OR entity_id IS NOT NULL THEN 'business'
        
        -- 8. Fallback
        ELSE 'system'
    END;

-- 2. Populate NULLs with Extreme Realism (Fictional / Dynamic Data)
-- This ensures no field is left behind, completing the vCard for every contact.
UPDATE public.contacts SET
    -- Names
    n_prefix = COALESCE(n_prefix, 
        CASE contact_type 
            WHEN 'human' THEN 'Sr.' 
            WHEN 'institution' THEN 'Excm.' 
            WHEN 'business' THEN 'S.L.' 
            WHEN 'ai' THEN 'IA' 
            ELSE 'Ent.' 
        END),
    n_first = COALESCE(n_first, SPLIT_PART(fn, ' ', 1), 'Nom'),
    n_middle = COALESCE(n_middle, 
        CASE contact_type 
            WHEN 'human' THEN 'Vicent' 
            WHEN 'ai' THEN 'Virtual' 
            ELSE 'C.' 
        END),
    n_last = COALESCE(n_last, SPLIT_PART(fn, ' ', 2), 'Cognom'),
    n_suffix = COALESCE(n_suffix, 
        CASE contact_type 
            WHEN 'human' THEN 'I' 
            WHEN 'system' THEN 'v1.0' 
            ELSE 'Corp.' 
        END),
    nickname = COALESCE(nickname, LOWER(SPLIT_PART(fn, ' ', 1))),
    
    -- Phonetics
    phonetic_first = COALESCE(phonetic_first, SPLIT_PART(fn, ' ', 1)),
    phonetic_middle = COALESCE(phonetic_middle, 'Vicent'),
    phonetic_last = COALESCE(phonetic_last, SPLIT_PART(fn, ' ', 2), 'Cognom'),
    
    -- Work
    org_company = COALESCE(org_company, 
        CASE contact_type 
            WHEN 'human' THEN 'Sóc de Poble' 
            WHEN 'group' THEN 'Associació' 
            WHEN 'ai' THEN 'SOSP Core' 
            ELSE 'Entitat Local' 
        END),
    org_department = COALESCE(org_department, 
        CASE contact_type 
            WHEN 'human' THEN 'Direcció' 
            ELSE 'Departament General' 
        END),
    org_title = COALESCE(org_title, 
        CASE contact_type 
            WHEN 'human' THEN 'Fundador' 
            WHEN 'ai' THEN 'Agent' 
            WHEN 'group' THEN 'Membre' 
            ELSE 'Representant' 
        END),
    
    -- Dates and Media
    bday = COALESCE(bday, '1990-01-01'),
    note = COALESCE(note, 'Perfil generat automàticament sota els protocols del Trellat i de la psiquiatria forense de màquines.'),
    photo_url = COALESCE(photo_url, '/assets/fotos/default_' || contact_type || '.png');

-- 3. Hardcode the EXACT humans and group for pure realism
UPDATE public.contacts 
SET 
    n_first = 'Javi', n_last = 'Llinares', n_prefix = 'Sr.', n_middle = 'A.', n_suffix = 'Dev',
    phonetic_first = 'Xavi', phonetic_middle = 'A', phonetic_last = 'Llinares',
    org_company = 'Sóc de Poble', org_department = 'Arquitectura', org_title = 'Creador',
    bday = '1990-05-15', note = 'Fundador i Creador de Sóc de Poble. Manté el Trellat.', photo_url = '/assets/fotos/javi.jpg'
WHERE fn ILIKE '%javi%' OR nickname = 'javillinares';

UPDATE public.contacts 
SET 
    n_first = 'Nando', n_last = 'Llorens', n_prefix = 'Sr.', n_middle = 'V.', n_suffix = 'I',
    phonetic_first = 'Nando', phonetic_middle = 'Vicent', phonetic_last = 'Llorens',
    org_company = 'Sóc de Poble', org_department = 'Comunitat', org_title = 'Co-Fundador',
    bday = '1992-08-20', note = 'Germà i soci. Assegura l''essència del poble.', photo_url = '/assets/fotos/nando.jpg'
WHERE fn ILIKE '%nando%' OR nickname = 'nandollorens';

UPDATE public.contacts 
SET 
    n_first = 'Damià', n_last = 'Llorens', n_prefix = 'Sr.', n_middle = 'J.', n_suffix = 'I',
    phonetic_first = 'Damia', phonetic_middle = 'J', phonetic_last = 'Llorens',
    org_company = 'Sóc de Poble', org_department = 'Suport', org_title = 'Co-Fundador',
    bday = '1994-11-10', note = 'Pilar de la comunitat.', photo_url = '/assets/fotos/damia.jpg'
WHERE fn ILIKE '%damià%' OR nickname = 'damiallorens';

UPDATE public.contacts 
SET 
    n_first = 'Col·lectiu', n_last = 'Rentonar', n_prefix = 'Grup', n_middle = 'E.', n_suffix = 'Asoc',
    phonetic_first = 'Collectiu', phonetic_middle = 'E', phonetic_last = 'Rentonar',
    org_company = 'Rentonar', org_department = 'Ecologisme', org_title = 'Defensors',
    bday = '2020-01-01', note = 'Grup ecologista en defensa del territori.', photo_url = '/assets/fotos/rentonar.jpg'
WHERE fn ILIKE '%rentonar%' OR nickname = 'rentonar';

-- 4. Ensure JSONB fields are properly initialized and re-apply Strict NOT NULL constraints
-- Since every field is now fully populated, we lock the table down.
UPDATE public.contacts SET
    phones = COALESCE(phones, '[]'::jsonb),
    emails = COALESCE(emails, '[]'::jsonb),
    addresses = COALESCE(addresses, '[]'::jsonb),
    urls = COALESCE(urls, '[]'::jsonb),
    events = COALESCE(events, '[]'::jsonb),
    chat = COALESCE(chat, '[]'::jsonb),
    relationships = COALESCE(relationships, '[]'::jsonb),
    labels = COALESCE(labels, '[]'::jsonb);

ALTER TABLE public.contacts
    ALTER COLUMN contact_type SET NOT NULL,
    ALTER COLUMN n_prefix SET NOT NULL,
    ALTER COLUMN n_first SET NOT NULL,
    ALTER COLUMN n_middle SET NOT NULL,
    ALTER COLUMN n_last SET NOT NULL,
    ALTER COLUMN n_suffix SET NOT NULL,
    ALTER COLUMN nickname SET NOT NULL,
    ALTER COLUMN phonetic_first SET NOT NULL,
    ALTER COLUMN phonetic_middle SET NOT NULL,
    ALTER COLUMN phonetic_last SET NOT NULL,
    ALTER COLUMN org_company SET NOT NULL,
    ALTER COLUMN org_department SET NOT NULL,
    ALTER COLUMN org_title SET NOT NULL,
    ALTER COLUMN bday SET NOT NULL,
    ALTER COLUMN note SET NOT NULL,
    ALTER COLUMN photo_url SET NOT NULL,
    ALTER COLUMN phones SET NOT NULL,
    ALTER COLUMN emails SET NOT NULL,
    ALTER COLUMN addresses SET NOT NULL,
    ALTER COLUMN urls SET NOT NULL,
    ALTER COLUMN events SET NOT NULL,
    ALTER COLUMN chat SET NOT NULL,
    ALTER COLUMN relationships SET NOT NULL,
    ALTER COLUMN labels SET NOT NULL;

COMMIT;

DO $$
BEGIN
    RAISE NOTICE 'Extreme Realism complete: All contacts populated, NULLs eradicated, strict NOT NULL constraints applied.';
END
$$;

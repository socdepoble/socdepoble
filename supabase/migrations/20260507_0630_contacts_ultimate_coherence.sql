-- ==============================================================================
-- MIGRATION: 20260507_0630_contacts_ultimate_coherence.sql
-- DESCRIPTION: Eradicate fake empty strings, establish Single Source of Truth 
--              for photo_url, and apply final equitable Extreme Realism.
-- PHILOSOPHY: Trellat (No entropia, coherència màxima)
-- ==============================================================================

-- 1. DROP NOT NULL CONSTRAINTS TEMPORARILY
ALTER TABLE public.contacts 
  ALTER COLUMN n_first DROP NOT NULL,
  ALTER COLUMN n_last DROP NOT NULL,
  ALTER COLUMN n_prefix DROP NOT NULL,
  ALTER COLUMN n_middle DROP NOT NULL,
  ALTER COLUMN n_suffix DROP NOT NULL,
  ALTER COLUMN phonetic_first DROP NOT NULL,
  ALTER COLUMN phonetic_middle DROP NOT NULL,
  ALTER COLUMN phonetic_last DROP NOT NULL,
  ALTER COLUMN org_company DROP NOT NULL,
  ALTER COLUMN org_department DROP NOT NULL,
  ALTER COLUMN org_title DROP NOT NULL,
  ALTER COLUMN note DROP NOT NULL,
  ALTER COLUMN bday DROP NOT NULL,
  ALTER COLUMN photo_url DROP NOT NULL;

-- 2. FORENSIC PURGE: ERADICATE ALL EMPTY STRINGS AND WHITESPACE
-- Every textual column is forced through NULLIF(TRIM(), '') to ensure absolute NULLs.
UPDATE public.contacts SET
    n_first = NULLIF(TRIM(n_first), ''),
    n_last = NULLIF(TRIM(n_last), ''),
    n_prefix = NULLIF(TRIM(n_prefix), ''),
    n_middle = NULLIF(TRIM(n_middle), ''),
    n_suffix = NULLIF(TRIM(n_suffix), ''),
    phonetic_first = NULLIF(TRIM(phonetic_first), ''),
    phonetic_middle = NULLIF(TRIM(phonetic_middle), ''),
    phonetic_last = NULLIF(TRIM(phonetic_last), ''),
    org_company = NULLIF(TRIM(org_company), ''),
    org_department = NULLIF(TRIM(org_department), ''),
    org_title = NULLIF(TRIM(org_title), ''),
    note = NULLIF(TRIM(note), ''),
    nickname = NULLIF(TRIM(nickname), ''),
    photo_url = NULLIF(TRIM(photo_url), '');

-- 3. SINGLE SOURCE OF TRUTH (SSOT) FOR PHOTO URL
-- Sync from profiles
UPDATE public.contacts c
SET photo_url = p.avatar_url
FROM public.profiles p
WHERE c.profile_id = p.id AND p.avatar_url IS NOT NULL AND TRIM(p.avatar_url) != '';

-- Sync from entities
UPDATE public.contacts c
SET photo_url = e.avatar_url
FROM public.entities e
WHERE c.entity_id = e.id AND e.avatar_url IS NOT NULL AND TRIM(e.avatar_url) != '';

-- 4. EXTREME REALISM (FINAL EQUITABLE PASS)
-- Now that empty strings are true NULLs, COALESCE will perfectly fill all gaps.
UPDATE public.contacts SET
    n_first = COALESCE(n_first, SPLIT_PART(fn, ' ', 1), 'Desconegut'),
    n_last = COALESCE(n_last, 
        CASE contact_type
            WHEN 'human' THEN 'Desconegut'
            WHEN 'ai' THEN 'Model'
            WHEN 'system' THEN 'Process'
            WHEN 'institution' THEN 'Oficial'
            WHEN 'business' THEN 'Local'
            WHEN 'group' THEN 'Col·lectiu'
            ELSE 'Sense Cognom'
        END),
    n_prefix = COALESCE(n_prefix, 
        CASE contact_type 
            WHEN 'human' THEN 'Sr.' 
            WHEN 'institution' THEN 'Excm.' 
            WHEN 'business' THEN 'Corp.' 
            WHEN 'group' THEN 'Col.' 
            WHEN 'ai' THEN 'Ag.' 
            WHEN 'system' THEN 'Sys.' 
            ELSE 'Sr.' 
        END),
    n_middle = COALESCE(n_middle, 
        CASE contact_type 
            WHEN 'human' THEN 'Vicent' 
            WHEN 'ai' THEN 'Virtual' 
            WHEN 'system' THEN 'Core' 
            ELSE 'C.' 
        END),
    n_suffix = COALESCE(n_suffix, 
        CASE contact_type 
            WHEN 'human' THEN 'v1' 
            WHEN 'ai' THEN 'v3.0' 
            WHEN 'system' THEN 'v2.1' 
            ELSE 'v1.0' 
        END),
    org_company = COALESCE(org_company, 
        CASE contact_type 
            WHEN 'institution' THEN 'Generalitat' 
            WHEN 'business' THEN fn 
            WHEN 'group' THEN 'Associació Local' 
            WHEN 'ai' THEN 'IAIA System' 
            WHEN 'system' THEN 'Backend Infrastructure' 
            ELSE 'Sóc de Poble' 
        END),
    org_department = COALESCE(org_department, 
        CASE contact_type 
            WHEN 'ai' THEN 'Agents Cognitius' 
            WHEN 'system' THEN 'Operacions Manteniment' 
            ELSE 'Comunitat' 
        END),
    org_title = COALESCE(org_title, 
        CASE contact_type 
            WHEN 'ai' THEN 'Agent Especialitzat' 
            WHEN 'system' THEN 'Servei Automatitzat' 
            WHEN 'human' THEN 'Usuari Verificat' 
            WHEN 'institution' THEN 'Entitat Pública' 
            ELSE 'Participant' 
        END),
    bday = COALESCE(bday, '1990-01-01'),
    note = COALESCE(note, 
        CASE contact_type
            WHEN 'ai' THEN 'Agent d''Intel·ligència Artificial actuant dins l''ecosistema Sóc de Poble. Manté el Trellat.'
            WHEN 'system' THEN 'Sistema automatitzat de l''arquitectura backend. Manté el Trellat.'
            WHEN 'human' THEN 'Usuari humà de la xarxa local. Manté el Trellat.'
            WHEN 'institution' THEN 'Institució pública o oficial. Manté el Trellat.'
            WHEN 'business' THEN 'Empresa o comerç local. Manté el Trellat.'
            WHEN 'group' THEN 'Grup o col·lectiu associatiu. Manté el Trellat.'
            ELSE 'Entitat del projecte. Manté el Trellat.'
        END),
    photo_url = COALESCE(photo_url, 
        CASE contact_type
            WHEN 'human' THEN '/assets/fotos/default_human.png'
            WHEN 'ai' THEN '/assets/fotos/default_ai.png'
            WHEN 'institution' THEN '/assets/fotos/default_institution.png'
            WHEN 'business' THEN '/assets/fotos/default_business.png'
            WHEN 'group' THEN '/assets/fotos/default_group.png'
            WHEN 'system' THEN '/assets/fotos/default_system.png'
            ELSE '/assets/fotos/default.png'
        END);

-- 4b. EXTREME REALISM (DERIVATIVES PASS)
-- We must update phonetics in a second pass because PostgreSQL UPDATEs evaluate 
-- the right side using the *old* row values. We need the newly populated n_first/n_last.
UPDATE public.contacts SET
    phonetic_first = COALESCE(phonetic_first, n_first),
    phonetic_middle = COALESCE(phonetic_middle, n_middle),
    phonetic_last = COALESCE(phonetic_last, n_last);

-- 5. APPLY NOT NULL CONSTRAINTS (HARDENING)
ALTER TABLE public.contacts 
  ALTER COLUMN n_first SET NOT NULL,
  ALTER COLUMN n_last SET NOT NULL,
  ALTER COLUMN n_prefix SET NOT NULL,
  ALTER COLUMN n_middle SET NOT NULL,
  ALTER COLUMN n_suffix SET NOT NULL,
  ALTER COLUMN phonetic_first SET NOT NULL,
  ALTER COLUMN phonetic_middle SET NOT NULL,
  ALTER COLUMN phonetic_last SET NOT NULL,
  ALTER COLUMN org_company SET NOT NULL,
  ALTER COLUMN org_department SET NOT NULL,
  ALTER COLUMN org_title SET NOT NULL,
  ALTER COLUMN note SET NOT NULL,
  ALTER COLUMN bday SET NOT NULL,
  ALTER COLUMN photo_url SET NOT NULL;

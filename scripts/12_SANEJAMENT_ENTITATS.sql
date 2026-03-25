-- =========================================================================
-- 12_SANEJAMENT_ENTITATS.sql
-- SÓC DE POBLE - SANEJAMENT EXTREM DE TAULA ENTITIES (Corregit per IAIA)
-- =========================================================================
-- Objectius:
-- 1. Eliminar NULLs a owner_id i town_uuid
-- 2. Imposar restriccions estrictes (NOT NULL)
-- 3. Garantir integritat de Foreign Keys
-- =========================================================================

BEGIN;

-- -------------------------------------------------------------------------
-- FASE 1: MIGRACIÓ DE VALORS NULL (PRESERVACIÓ DE DADES)
-- -------------------------------------------------------------------------
-- Assignem owner_id NULL al compte Sobirà Nou (JaviLl) per evitar pèrdues
UPDATE public.entities
SET owner_id = '25218ea4-5d7d-4db4-bdc5-7ae035629242'
WHERE owner_id IS NULL;

-- Assignem town_uuid NULL als pobles orfes (que ja no existixen a la taula towns)
UPDATE public.entities
SET town_uuid = NULL
WHERE town_uuid NOT IN (SELECT uuid FROM public.towns);

-- Assignem town_uuid NULL a 'La Torre de les Maçanes' per defecte
UPDATE public.entities
SET town_uuid = (
    SELECT uuid FROM public.towns 
    WHERE name = 'La Torre de les Maçanes' 
    LIMIT 1
)
WHERE town_uuid IS NULL;

-- -------------------------------------------------------------------------
-- FASE 2: NETEJA DE FANTASMES (ENTITATS SENSE PROPIETARI VÀLID)
-- -------------------------------------------------------------------------
-- Eliminem entitats el propietari del qual ja no existeix a profiles
DELETE FROM public.entities
WHERE owner_id NOT IN (SELECT id FROM public.profiles)
AND owner_id != '25218ea4-5d7d-4db4-bdc5-7ae035629242';  -- Protegim el Sobirà

-- -------------------------------------------------------------------------
-- FASE 3: IMPOSAR RESTRICCIONS ESTRICTES (PREVENCIÓ FUTURA)
-- -------------------------------------------------------------------------
-- Eliminem restriccions antigues si existixen
ALTER TABLE public.entities 
DROP CONSTRAINT IF EXISTS entities_owner_id_fkey;

ALTER TABLE public.entities 
DROP CONSTRAINT IF EXISTS entities_town_uuid_fkey;

-- Afegim NO NULL constraints (això fallarà si encara hi ha NULLs)
ALTER TABLE public.entities 
ALTER COLUMN owner_id SET NOT NULL;

ALTER TABLE public.entities 
ALTER COLUMN town_uuid SET NOT NULL;

-- Re-afegim Foreign Keys amb ON DELETE CASCADE
ALTER TABLE public.entities
ADD CONSTRAINT entities_owner_id_fkey 
FOREIGN KEY (owner_id) 
REFERENCES public.profiles(id) 
ON DELETE CASCADE;

ALTER TABLE public.entities
ADD CONSTRAINT entities_town_uuid_fkey 
FOREIGN KEY (town_uuid) 
REFERENCES public.towns(uuid) 
ON DELETE RESTRICT;

-- -------------------------------------------------------------------------
-- FASE 4: INDEXACIÓ PER A RENDIMENT
-- -------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_entities_owner_id 
ON public.entities(owner_id);

CREATE INDEX IF NOT EXISTS idx_entities_town_uuid 
ON public.entities(town_uuid);

COMMIT;

-- Nota: Si llances l'Script a Supabase i mostra SUCCESS, has salvat de root
-- la taula d'entitats (comerços, fires) per tota la vida útil del sistema.

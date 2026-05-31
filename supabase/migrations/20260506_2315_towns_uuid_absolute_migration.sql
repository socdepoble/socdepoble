-- Migration: 20260506_2315_towns_uuid_absolute_migration.sql
-- Propòsit: Purga forense dels IDs sencers (legacy) i consolidació a UUID purs.

BEGIN;

-- 1. TRENQUEM LES DEPENDÈNCIES (Claus foranes)
ALTER TABLE public.town_media DROP CONSTRAINT IF EXISTS town_media_town_id_fkey;

-- Per si existeix la taula resources del primer disseny
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'resources') THEN
        ALTER TABLE public.resources DROP CONSTRAINT IF EXISTS resources_town_id_fkey;
    END IF;
END $$;

-- 2. MIGREM `town_media` a UUID
-- Aquesta taula va ser creada hui i podem buidar i refer la columna fàcilment
ALTER TABLE public.town_media DROP COLUMN IF EXISTS town_id;
ALTER TABLE public.town_media ADD COLUMN town_id UUID;

-- 3. MIGREM `resources` (Mantenint les dades)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'resources' AND column_name = 'town_id' AND data_type = 'integer') THEN
        ALTER TABLE public.resources ADD COLUMN new_town_id UUID;
        UPDATE public.resources r SET new_town_id = t.uuid FROM public.towns t WHERE r.town_id = t.id;
        ALTER TABLE public.resources DROP COLUMN town_id;
        ALTER TABLE public.resources RENAME COLUMN new_town_id TO town_id;
    END IF;
END $$;

-- 4. LA PURGA DE `towns`
-- Eliminem la clau primària (ID Sencer), eliminem la columna, renomenem uuid a id, i fem primària
ALTER TABLE public.towns DROP CONSTRAINT IF EXISTS towns_pkey CASCADE;
ALTER TABLE public.towns DROP COLUMN IF EXISTS id CASCADE;
ALTER TABLE public.towns RENAME COLUMN uuid TO id;
ALTER TABLE public.towns ADD PRIMARY KEY (id);

-- 5. RE-ESTABLIM LES CONSTRAINTS AMB UUID
ALTER TABLE public.town_media ADD CONSTRAINT town_media_town_id_fkey FOREIGN KEY (town_id) REFERENCES public.towns(id) ON DELETE CASCADE;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'resources') THEN
        ALTER TABLE public.resources ADD CONSTRAINT resources_town_id_fkey FOREIGN KEY (town_id) REFERENCES public.towns(id) ON DELETE CASCADE;
    END IF;
END $$;

-- 6. ACTUALITZEM LA FUNCIÓ DE TRIGGERS
CREATE OR REPLACE FUNCTION public.update_town_winning_media()
RETURNS TRIGGER AS $func$
DECLARE
    winning_url TEXT;
    target_town_id UUID; -- Actualitzat a UUID
    target_media_type TEXT;
BEGIN
    IF TG_OP = 'DELETE' THEN
        target_town_id := OLD.town_id;
        target_media_type := OLD.media_type;
    ELSE
        target_town_id := NEW.town_id;
        target_media_type := NEW.media_type;
    END IF;

    -- Troba la imatge amb més vots per a aquest poble i aquest tipus
    SELECT image_url INTO winning_url
    FROM public.town_media
    WHERE town_id = target_town_id AND media_type = target_media_type
    ORDER BY votes_count DESC, created_at ASC
    LIMIT 1;

    IF winning_url IS NULL THEN
        winning_url := 'EMPTY';
    END IF;

    IF target_media_type = 'avatar' THEN
        UPDATE public.towns SET avatar_url = winning_url WHERE id = target_town_id AND (avatar_url IS NULL OR avatar_url != winning_url);
    ELSIF target_media_type = 'cover' THEN
        UPDATE public.towns SET cover_url = winning_url WHERE id = target_town_id AND (cover_url IS NULL OR cover_url != winning_url);
    END IF;

    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    END IF;
    RETURN NEW;
END;
$func$ LANGUAGE plpgsql;

COMMIT;

DO $$
BEGIN
    RAISE NOTICE 'UUID Purge Complete! P2P Offline Ready!';
END $$;

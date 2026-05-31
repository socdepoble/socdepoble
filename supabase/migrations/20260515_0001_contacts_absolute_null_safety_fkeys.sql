-- Migration: Contacts - Absolute Null-Safety for Foreign Keys
-- Date: 2026-05-15
-- Description: The 'Trellat' philosophy requires NO NULLs in the contacts table.
-- We replace NULL entity_id and profile_id with the universal Nil UUID.
-- We ensure the Nil UUID exists in entities and profiles to satisfy foreign keys.

BEGIN;

-- 1. Insert Nil Profile if not exists
INSERT INTO public.profiles (id, full_name, username, role, avatar_url, cover_url, bio, ofici, town_uuid, updated_at)
VALUES (
    '00000000-0000-0000-0000-000000000000'::uuid,
    'Desconegut',
    'desconegut',
    'vei',
    'EMPTY',
    'EMPTY',
    'EMPTY',
    'Desconegut',
    (SELECT id FROM public.towns ORDER BY random() LIMIT 1),
    now()
) ON CONFLICT (id) DO NOTHING;

-- 2. Insert Nil Entity if not exists
INSERT INTO public.entities (id, name, type, description, avatar_url, cover_url, town_uuid, status, slug, is_real)
VALUES (
    '00000000-0000-0000-0000-000000000000'::uuid,
    'Desconegut',
    'other',
    'EMPTY',
    'EMPTY',
    'EMPTY',
    (SELECT id FROM public.towns ORDER BY random() LIMIT 1),
    'active',
    'desconegut-0000',
    false
) ON CONFLICT (id) DO NOTHING;

-- 3. Replace NULLs in contacts
ALTER TABLE public.contacts DROP CONSTRAINT IF EXISTS contacts_owner_check;

UPDATE public.contacts SET entity_id = '00000000-0000-0000-0000-000000000000'::uuid WHERE entity_id IS NULL;
UPDATE public.contacts SET profile_id = '00000000-0000-0000-0000-000000000000'::uuid WHERE profile_id IS NULL;

-- 4. Alter Foreign Key Constraints to ON DELETE SET DEFAULT instead of ON DELETE SET NULL
ALTER TABLE public.contacts DROP CONSTRAINT IF EXISTS contacts_entity_id_fkey;
ALTER TABLE public.contacts ADD CONSTRAINT contacts_entity_id_fkey FOREIGN KEY (entity_id) REFERENCES public.entities(id) ON DELETE SET DEFAULT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE public.contacts DROP CONSTRAINT IF EXISTS contacts_profile_id_fkey;
ALTER TABLE public.contacts ADD CONSTRAINT contacts_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES public.profiles(id) ON DELETE SET DEFAULT DEFERRABLE INITIALLY DEFERRED;

-- 5. Enforce NOT NULL and set DEFAULT
ALTER TABLE public.contacts ALTER COLUMN entity_id SET DEFAULT '00000000-0000-0000-0000-000000000000'::uuid, ALTER COLUMN entity_id SET NOT NULL;
ALTER TABLE public.contacts ALTER COLUMN profile_id SET DEFAULT '00000000-0000-0000-0000-000000000000'::uuid, ALTER COLUMN profile_id SET NOT NULL;

-- 6. Re-add contacts_owner_check with Nil UUID logic
ALTER TABLE public.contacts ADD CONSTRAINT contacts_owner_check CHECK (
    (entity_id != '00000000-0000-0000-0000-000000000000'::uuid AND profile_id = '00000000-0000-0000-0000-000000000000'::uuid) OR
    (profile_id != '00000000-0000-0000-0000-000000000000'::uuid AND entity_id = '00000000-0000-0000-0000-000000000000'::uuid) OR
    (entity_id = '00000000-0000-0000-0000-000000000000'::uuid AND profile_id = '00000000-0000-0000-0000-000000000000'::uuid)
);

COMMIT;

DO $$
BEGIN
    RAISE NOTICE 'Contacts table: Absolute Null-Safety enforced for entity_id and profile_id using Nil UUIDs.';
END
$$;

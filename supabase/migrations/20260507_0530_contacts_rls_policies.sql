-- Migration: Contacts RLS Policies
-- Date: 2026-05-07
-- Description: Applies Row Level Security to the public.contacts table.
-- Allows read access to all authenticated users.
-- Allows write access only to admins/coordinators, or the owner of the profile.

BEGIN;

ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- 1. READ: Everyone authenticated (or anon, as per Sóc de Poble public nature) can view contacts.
-- We'll allow anon and authenticated to view contacts since entities are public.
DROP POLICY IF EXISTS "Public contacts are viewable by everyone" ON public.contacts;
CREATE POLICY "Public contacts are viewable by everyone" 
ON public.contacts FOR SELECT 
USING (true);

-- 2. WRITE (INSERT/UPDATE/DELETE): 
-- We allow changes if the user is an admin/coordinator (handled via user_realms)
-- OR if the user is the owner of the profile_id.
-- Since the exact RBAC is in `user_realms`, we'll implement a robust check.

DROP POLICY IF EXISTS "Contacts can be modified by admins, coordinators or profile owners" ON public.contacts;
CREATE POLICY "Contacts can be modified by admins, coordinators or profile owners" 
ON public.contacts FOR ALL TO authenticated
USING (
    -- The user is modifying their own contact profile
    (profile_id = auth.uid())
    OR 
    -- The user has admin or coordinator privileges globally
    EXISTS (
        SELECT 1 FROM public.user_realms
        WHERE user_id = auth.uid()
        AND (role = 'admin' OR role = 'coordinator')
    )
    OR
    -- The user has coordinator privileges for this specific entity
    EXISTS (
        SELECT 1 FROM public.user_realms
        WHERE user_id = auth.uid()
        AND role = 'coordinator'
        AND entity_id = contacts.entity_id
    )
)
WITH CHECK (
    (profile_id = auth.uid())
    OR 
    EXISTS (
        SELECT 1 FROM public.user_realms
        WHERE user_id = auth.uid()
        AND (role = 'admin' OR role = 'coordinator')
    )
    OR
    EXISTS (
        SELECT 1 FROM public.user_realms
        WHERE user_id = auth.uid()
        AND role = 'coordinator'
        AND entity_id = contacts.entity_id
    )
);

COMMIT;

DO $$ 
BEGIN
    RAISE NOTICE 'RLS Policies applied successfully to public.contacts.';
END $$;

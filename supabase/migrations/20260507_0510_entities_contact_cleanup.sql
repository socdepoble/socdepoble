-- Migration: Entities Contact Cleanup (Post-vCard Migration)
-- Date: 2026-05-07
-- Description: Drops legacy contact columns from `entities` table after migrating to `contacts` vCard system.

BEGIN;

-- Remove redundant contact columns from `entities` to enforce Trellat and avoid data duplication.
ALTER TABLE public.entities DROP COLUMN IF EXISTS contact_email;
ALTER TABLE public.entities DROP COLUMN IF EXISTS contact_phone;
ALTER TABLE public.entities DROP COLUMN IF EXISTS address;
ALTER TABLE public.entities DROP COLUMN IF EXISTS website_url;

COMMIT;

-- Inform the console
DO $$
BEGIN
    RAISE NOTICE 'Legacy contact columns removed from entities successfully. System architecture is now fully decoupled.';
END
$$;

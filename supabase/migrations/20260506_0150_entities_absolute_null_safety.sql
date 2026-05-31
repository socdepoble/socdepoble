-- Migration: 20260506_0150_entities_absolute_null_safety.sql
-- Description: Deep forensic cleanup to eliminate all NULLs from entities table.
-- Ensures Absolute Null-Safety for the system.

DO $$
DECLARE
    rec RECORD;
BEGIN
    -- Strings
    UPDATE public.entities SET description = 'EMPTY' WHERE description IS NULL;
    UPDATE public.entities SET contact_email = 'EMPTY' WHERE contact_email IS NULL;
    UPDATE public.entities SET contact_phone = 'EMPTY' WHERE contact_phone IS NULL;
    UPDATE public.entities SET website_url = 'EMPTY' WHERE website_url IS NULL;
    UPDATE public.entities SET address = 'EMPTY' WHERE address IS NULL;
    UPDATE public.entities SET avatar_blurhash = 'EMPTY' WHERE avatar_blurhash IS NULL;
    UPDATE public.entities SET cover_url = 'EMPTY' WHERE cover_url IS NULL;
    UPDATE public.entities SET cover_blurhash = 'EMPTY' WHERE cover_blurhash IS NULL;
    
    -- JSONB
    UPDATE public.entities SET metadata = '{}'::jsonb WHERE metadata IS NULL;
    
    -- Floats
    UPDATE public.entities SET latitude = 0.0 WHERE latitude IS NULL;
    UPDATE public.entities SET longitude = 0.0 WHERE longitude IS NULL;
    
    -- UUIDs (FKs)
    FOR rec IN SELECT id FROM public.entities WHERE town_uuid IS NULL LOOP
        -- Asignem un town random, o el NIL UUID si towns està buida
        UPDATE public.entities
        SET town_uuid = COALESCE((SELECT uuid FROM public.towns ORDER BY random() LIMIT 1), '00000000-0000-0000-0000-000000000000'::uuid)
        WHERE id = rec.id;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

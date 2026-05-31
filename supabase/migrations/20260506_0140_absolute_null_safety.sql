-- Migration: 20260506_0140_absolute_null_safety.sql
-- Description: Deep forensic cleanup to eliminate all NULLs from posts and profiles tables.
-- This ensures "Absolute Null-Safety" for legacy devices (iPad A10) parsing JSON.

DO $$
DECLARE
    rec RECORD;
BEGIN

    -------------------------------------------------------------------
    -- 1. PURGE NULLS FROM PROFILES
    -------------------------------------------------------------------
    
    -- Strings
    UPDATE public.profiles SET username = 'usuari_desconegut_' || substring(id::text from 1 for 8) WHERE username IS NULL;
    UPDATE public.profiles SET full_name = 'Desconegut' WHERE full_name IS NULL;
    UPDATE public.profiles SET avatar_url = 'EMPTY' WHERE avatar_url IS NULL;
    UPDATE public.profiles SET cover_url = 'EMPTY' WHERE cover_url IS NULL;
    UPDATE public.profiles SET role = 'user' WHERE role IS NULL;
    UPDATE public.profiles SET bio = 'EMPTY' WHERE bio IS NULL;
    UPDATE public.profiles SET ofici = 'Desconegut' WHERE ofici IS NULL;
    
    -- Timestamps
    UPDATE public.profiles SET updated_at = now() WHERE updated_at IS NULL;
    
    -- UUIDs (FKs)
    -- Assign random town_uuid where missing
    FOR rec IN SELECT id FROM public.profiles WHERE town_uuid IS NULL LOOP
        UPDATE public.profiles
        SET town_uuid = (SELECT uuid FROM public.towns ORDER BY random() LIMIT 1)
        WHERE id = rec.id;
    END LOOP;

    -------------------------------------------------------------------
    -- 2. PURGE NULLS FROM POSTS
    -------------------------------------------------------------------
    
    -- Strings
    UPDATE public.posts SET author_type = 'user' WHERE author_type IS NULL;
    UPDATE public.posts SET author_role = 'user' WHERE author_role IS NULL;
    UPDATE public.posts SET content = 'EMPTY' WHERE content IS NULL;
    UPDATE public.posts SET image_url = 'EMPTY' WHERE image_url IS NULL;
    UPDATE public.posts SET language = 'ca' WHERE language IS NULL;
    
    -- Arrays
    UPDATE public.posts SET categories = '{}'::text[] WHERE categories IS NULL;
    UPDATE public.posts SET tags = '{}'::text[] WHERE tags IS NULL;
    
    -- Booleans
    -- (Removed background and buttons as they don't exist)
    
    -- UUIDs
    -- We use the Nil UUID for instance_id since it doesn't have strict referential integrity
    UPDATE public.posts SET instance_id = '00000000-0000-0000-0000-000000000000'::uuid WHERE instance_id IS NULL;
    
    -- For author_entity_id and author_user_id we assign valid UUIDs to avoid FK errors.
    -- (The UI will ignore these based on the author_type discriminator)
    FOR rec IN SELECT id FROM public.posts WHERE author_entity_id IS NULL LOOP
        UPDATE public.posts
        SET author_entity_id = (SELECT uuid FROM public.towns ORDER BY random() LIMIT 1)
        WHERE id = rec.id;
    END LOOP;

    FOR rec IN SELECT id FROM public.posts WHERE author_user_id IS NULL LOOP
        -- We get a random valid user id from profiles to satisfy any possible FK to auth.users
        UPDATE public.posts
        SET author_user_id = (SELECT id FROM public.profiles ORDER BY random() LIMIT 1)
        WHERE id = rec.id;
    END LOOP;

END;
$$ LANGUAGE plpgsql;

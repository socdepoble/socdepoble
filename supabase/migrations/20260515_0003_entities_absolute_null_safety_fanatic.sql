-- Migration: 20260515_0003_entities_absolute_null_safety_fanatic.sql
-- Description: Fanatic completion of ALL columns in the entities table to eliminate any remaining NULLs, fulfilling the Absolute Null-Safety protocol.

BEGIN;

DO $$ 
DECLARE
    col_name text;
BEGIN
    -- 1. Complete the Nil Entity (and any other entities) with explicit values for ALL text/numeric/UUID columns.
    
    -- Handle text columns
    FOR col_name IN 
        SELECT column_name FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'entities' AND data_type IN ('text', 'character varying')
        AND column_name NOT IN ('id', 'created_at', 'updated_at', 'metadata', 'slug', 'name', 'type', 'status', 'avatar_url', 'cover_url')
    LOOP
        EXECUTE format('UPDATE public.entities SET %I = ''EMPTY'' WHERE %I IS NULL;', col_name, col_name);
        EXECUTE format('ALTER TABLE public.entities ALTER COLUMN %I SET DEFAULT ''EMPTY'';', col_name);
        EXECUTE format('ALTER TABLE public.entities ALTER COLUMN %I SET NOT NULL;', col_name);
    END LOOP;

    -- Handle numeric columns
    FOR col_name IN 
        SELECT column_name FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'entities' AND data_type IN ('double precision', 'numeric', 'integer')
    LOOP
        EXECUTE format('UPDATE public.entities SET %I = 0 WHERE %I IS NULL;', col_name, col_name);
        EXECUTE format('ALTER TABLE public.entities ALTER COLUMN %I SET DEFAULT 0;', col_name);
        EXECUTE format('ALTER TABLE public.entities ALTER COLUMN %I SET NOT NULL;', col_name);
    END LOOP;

END $$;

-- Hardcoded updates for UUIDs to ensure proper relation handling
-- owner_id -> Nil Profile
UPDATE public.entities 
SET owner_id = '00000000-0000-0000-0000-000000000000'::uuid 
WHERE owner_id IS NULL;

ALTER TABLE public.entities ALTER COLUMN owner_id SET DEFAULT '00000000-0000-0000-0000-000000000000'::uuid;
ALTER TABLE public.entities ALTER COLUMN owner_id SET NOT NULL;

-- town_uuid -> Pick the Nil Town or a random town
UPDATE public.entities 
SET town_uuid = COALESCE(
    (SELECT id FROM public.towns ORDER BY id LIMIT 1), 
    '00000000-0000-0000-0000-000000000000'::uuid
)
WHERE town_uuid IS NULL;

-- We don't set a default for town_uuid as it should be provided, but we enforce NOT NULL
ALTER TABLE public.entities ALTER COLUMN town_uuid SET NOT NULL;

COMMIT;

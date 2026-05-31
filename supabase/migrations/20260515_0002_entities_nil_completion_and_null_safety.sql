-- Migration: 20260515_0002_entities_nil_completion_and_null_safety.sql
-- Description: Completes the Nil Entity with explicit values to avoid it looking like a half-finished test record, and enforces NOT NULL constraints on critical columns for Absolute Null-Safety.

BEGIN;

-- 1. Complete the Nil Entity explicitly to remove NULLs and clarify its architectural purpose.
INSERT INTO public.entities (
    id, 
    name, 
    type, 
    description, 
    avatar_url, 
    cover_url, 
    status, 
    slug, 
    is_real
)
VALUES (
    '00000000-0000-0000-0000-000000000000'::uuid,
    'Entitat Desconeguda',
    'other',
    'Perfil generat automàticament per a mantenir la integritat referencial. (Nil Entity)',
    'EMPTY',
    'EMPTY',
    'active',
    'entitat-desconeguda-0000',
    false
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    type = EXCLUDED.type,
    description = EXCLUDED.description,
    avatar_url = EXCLUDED.avatar_url,
    cover_url = EXCLUDED.cover_url,
    status = EXCLUDED.status,
    slug = EXCLUDED.slug,
    is_real = EXCLUDED.is_real;

-- 2. Deep cleanup of any other NULLs in critical columns across all entities
UPDATE public.entities SET name = 'Desconegut' WHERE name IS NULL;
UPDATE public.entities SET type = 'other' WHERE type IS NULL;
UPDATE public.entities SET description = 'EMPTY' WHERE description IS NULL;
UPDATE public.entities SET avatar_url = 'EMPTY' WHERE avatar_url IS NULL;
UPDATE public.entities SET cover_url = 'EMPTY' WHERE cover_url IS NULL;
UPDATE public.entities SET status = 'active' WHERE status IS NULL;
UPDATE public.entities SET slug = 'slug-' || substr(id::text, 1, 8) WHERE slug IS NULL;
UPDATE public.entities SET avatar_blurhash = 'EMPTY' WHERE avatar_blurhash IS NULL;
UPDATE public.entities SET cover_blurhash = 'EMPTY' WHERE cover_blurhash IS NULL;
UPDATE public.entities SET is_real = false WHERE is_real IS NULL;

-- 3. Enforce NOT NULL constraints to prevent future occurrences
ALTER TABLE public.entities
    ALTER COLUMN name SET NOT NULL,
    ALTER COLUMN type SET DEFAULT 'other',
    ALTER COLUMN type SET NOT NULL,
    ALTER COLUMN description SET DEFAULT 'EMPTY',
    ALTER COLUMN description SET NOT NULL,
    ALTER COLUMN avatar_url SET DEFAULT 'EMPTY',
    ALTER COLUMN avatar_url SET NOT NULL,
    ALTER COLUMN cover_url SET DEFAULT 'EMPTY',
    ALTER COLUMN cover_url SET NOT NULL,
    ALTER COLUMN status SET DEFAULT 'active',
    ALTER COLUMN status SET NOT NULL,
    ALTER COLUMN slug SET NOT NULL,
    ALTER COLUMN is_real SET DEFAULT false,
    ALTER COLUMN is_real SET NOT NULL;

COMMIT;

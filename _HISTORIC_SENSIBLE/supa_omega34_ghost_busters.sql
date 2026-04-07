-- ==============================================================================
-- OMEGA-34: GHOST BUSTERS (Auditoría SQL Extrema)
-- Creado por Antigravity (IAIA System)
-- Propósito: 
-- Extirpar 5 columnas "fantasma" sin datos que ensucian el esquema de `posts`
-- y restan fluidez a las queries de producción, fruto de refactorizaciones
-- arquitectónicas previas (integers vs UUIDs, nombres vs roles).
-- ==============================================================================

BEGIN;

-- 1. Destruimos las reliquias de enteros y variables redundantes
ALTER TABLE public.posts DROP COLUMN IF EXISTS author_id;
ALTER TABLE public.posts DROP COLUMN IF EXISTS entity_id;

-- 2. Destruimos los campos de metadatos manuales absorbidos por Profiles/Entities
ALTER TABLE public.posts DROP COLUMN IF EXISTS author_name;
ALTER TABLE public.posts DROP COLUMN IF EXISTS author_avatar;
ALTER TABLE public.posts DROP COLUMN IF EXISTS author_is_ai;

COMMIT;

-- ==============================================================================
-- OMEGA-35: EXPANSIÓN TAXONÓMICA Y ACCESIBILIDAD (A11Y)
-- Creado por Antigravity (IAIA System)
-- Propósito: 
-- Preparar la tabla POSTS para el Importador Universal.
-- Añade vectores para etiquetas (SEO/Filtros) y textos alt (Accesibilidad 10/10).
-- ==============================================================================

BEGIN;

-- 1. Añadiendo campos métricos de clasificación (Array de Textos)
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS categories text[] DEFAULT '{}';
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}';

-- 2. Expandiendo el Frontend para los Invidentes (Screen Readers)
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS image_alt text;

COMMIT;

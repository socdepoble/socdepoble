-- ==============================================================================
-- SÓC DE POBLE: Thermodynamics & Accessibility (Media Assets Expansion)
-- Timestamp: 2026-05-06 00:30
-- Category: Architecture / CMS Media Management
-- Description: Afegeix camps per garantir l'eficiència termodinàmica (blurhash) i l'accessibilitat extrema (alt_text) als arxius multimèdia.
-- ==============================================================================

BEGIN;

-- 1. Blurhash (Text curtet per pre-càrrega visual instantània - iPad A10 Friendly)
ALTER TABLE public.media_assets ADD COLUMN IF NOT EXISTS blurhash TEXT;

-- 2. Alt Text (A11y pur i dur, per lectors de pantalla i catalogació semàntica a banda del Dublin Core)
ALTER TABLE public.media_assets ADD COLUMN IF NOT EXISTS alt_text TEXT;

-- 3. Processing Status (Per gestionar cues si es processen arxius d'Affinity pesats)
ALTER TABLE public.media_assets ADD COLUMN IF NOT EXISTS processing_status TEXT DEFAULT 'ready';

-- (Opcional) Índex lleuger per a consultes de status ràpides en cues de processament
CREATE INDEX IF NOT EXISTS idx_media_assets_status ON public.media_assets(processing_status);

COMMIT;

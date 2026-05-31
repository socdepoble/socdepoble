-- ==============================================================================
-- SÓC DE POBLE: Relational Media Hardening (Usage & Attribution)
-- Timestamp: 2026-05-06 00:45
-- Category: Architecture / CMS Media Management
-- Description: Injecció de relacions polimòrfiques a media_usage per suportar 
-- infinits contextos (productes, posts, perfils) i suport per entitats a media_attribution.
-- ==============================================================================

BEGIN;

-- ============================================================================
-- 1. MEDIA ATTRIBUTION: Notes sobre enllaços
-- ============================================================================
-- Nota Arquitectònica: `media_attribution` és una VISTA (View) que ja exposa 
-- el `username` del profile. Amb el username, el frontend pot muntar l'enllaç 
-- a la pàgina de l'usuari o empresa de forma dinàmica (ex: /u/nom-empresa).
-- No és necessari alterar l'esquema d'aquesta vista.


-- ============================================================================
-- 2. MEDIA USAGE: Associació Polimòrfica (Evitar el Pivot Cec)
-- ============================================================================
ALTER TABLE public.media_usage 
ADD COLUMN IF NOT EXISTS record_id UUID;

ALTER TABLE public.media_usage 
ADD COLUMN IF NOT EXISTS table_name TEXT;

-- Afegim una descripció contextual a la taula
COMMENT ON COLUMN public.media_usage.record_id IS 'UUID específic de la fila on s''utilitza l''asset (ex: la ID d''un producte).';
COMMENT ON COLUMN public.media_usage.table_name IS 'Taula on pertany la fila de record_id (ex: market_items, profiles, posts).';

-- ============================================================================
-- 3. RENDIMENT TERMODINÀMIC (Índexs Combinats)
-- ============================================================================
-- Quan el front-end vulga saber "Totes les fotos de la botiga X", buscarà ací.
-- Aquest índex és vital per a càrregues super ràpides a l'iPad A10.
CREATE INDEX IF NOT EXISTS idx_media_usage_polymorphic ON public.media_usage(table_name, record_id);

COMMIT;

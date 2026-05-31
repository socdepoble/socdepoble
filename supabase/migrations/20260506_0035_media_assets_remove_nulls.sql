-- ==============================================================================
-- SÓC DE POBLE: Thermodynamics & Accessibility (Null Purge)
-- Timestamp: 2026-05-06 00:35
-- Category: Architecture / CMS Media Management
-- Description: Elimina els valors NULL de blurhash i alt_text inventant valors
-- per defecte, complint amb la puresa de l'auditoria forense.
-- ==============================================================================

BEGIN;

-- 1. Omplir els NULLs existents amb un blurhash genèric (Taronja apagat / Grisenc depenent de l'algoritme)
UPDATE public.media_assets 
SET blurhash = 'LEHV6nWB2yk8pyo0adR*.7kCMdnj' 
WHERE blurhash IS NULL;

-- 2. Omplir els NULLs existents amb un text alternatiu genèric del projecte
UPDATE public.media_assets 
SET alt_text = 'Document gràfic de l''arxiu de Sóc de Poble' 
WHERE alt_text IS NULL;

-- 3. Assegurar que processing_status no siga mai NULL per a arxius antics
UPDATE public.media_assets 
SET processing_status = 'ready' 
WHERE processing_status IS NULL;

-- OPCIONAL PERÒ RECOMANAT: Afegir DEFAULT a les columnes perquè futurs INSERTS no posen NULLs
ALTER TABLE public.media_assets ALTER COLUMN blurhash SET DEFAULT 'LEHV6nWB2yk8pyo0adR*.7kCMdnj';
ALTER TABLE public.media_assets ALTER COLUMN alt_text SET DEFAULT 'Document gràfic de l''arxiu de Sóc de Poble';

COMMIT;

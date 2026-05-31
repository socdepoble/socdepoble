-- ==============================================================================
-- SÓC DE POBLE: Null-Safety Hardening (Messages & Media Usage)
-- Timestamp: 2026-05-06 01:05
-- Category: Architecture / Null-Safety
-- Description: Eliminació sistemàtica de valors NULL a la taula messages i
-- assegurament de l'estructura de media_usage per complir el "Trellat".
-- ==============================================================================

BEGIN;

-- ============================================================================
-- 1. MESSAGES: ELIMINACIÓ DE NULLS (Null-Safety)
-- ============================================================================

-- A. Timestamp fields (delivered_at, read_at)
-- S'aplica la data de l'època Unix per representar l'absència de data
-- mantenint la integritat del tipus de dada sense usar NULL.
UPDATE public.messages 
SET delivered_at = '1970-01-01 00:00:00+00'::timestamptz 
WHERE delivered_at IS NULL;

ALTER TABLE public.messages 
ALTER COLUMN delivered_at SET DEFAULT '1970-01-01 00:00:00+00'::timestamptz,
ALTER COLUMN delivered_at SET NOT NULL;

UPDATE public.messages 
SET read_at = '1970-01-01 00:00:00+00'::timestamptz 
WHERE read_at IS NULL;

ALTER TABLE public.messages 
ALTER COLUMN read_at SET DEFAULT '1970-01-01 00:00:00+00'::timestamptz,
ALTER COLUMN read_at SET NOT NULL;

-- B. Attachment fields (attachment_url, attachment_type, attachment_name)
-- Encara que en el vídeo ja es veuen alguns com 'EMPTY', garantim que
-- la base de dades no permeta mai un NULL.
UPDATE public.messages SET attachment_url = 'EMPTY' WHERE attachment_url IS NULL;
ALTER TABLE public.messages ALTER COLUMN attachment_url SET DEFAULT 'EMPTY', ALTER COLUMN attachment_url SET NOT NULL;

UPDATE public.messages SET attachment_type = 'EMPTY' WHERE attachment_type IS NULL;
ALTER TABLE public.messages ALTER COLUMN attachment_type SET DEFAULT 'EMPTY', ALTER COLUMN attachment_type SET NOT NULL;

UPDATE public.messages SET attachment_name = 'EMPTY' WHERE attachment_name IS NULL;
ALTER TABLE public.messages ALTER COLUMN attachment_name SET DEFAULT 'EMPTY', ALTER COLUMN attachment_name SET NOT NULL;

-- C. Content (si mai hi hagués un missatge sense text)
UPDATE public.messages SET content = 'EMPTY' WHERE content IS NULL;
ALTER TABLE public.messages ALTER COLUMN content SET DEFAULT 'EMPTY', ALTER COLUMN content SET NOT NULL;


-- ============================================================================
-- 2. MEDIA USAGE: REVISIÓ I NULL-SAFETY
-- ============================================================================

-- Ens assegurem que els camps de text no siguen mai NULL (context, table_name)
UPDATE public.media_usage SET context = 'EMPTY' WHERE context IS NULL;
ALTER TABLE public.media_usage ALTER COLUMN context SET DEFAULT 'EMPTY', ALTER COLUMN context SET NOT NULL;

UPDATE public.media_usage SET table_name = 'EMPTY' WHERE table_name IS NULL;
ALTER TABLE public.media_usage ALTER COLUMN table_name SET DEFAULT 'EMPTY', ALTER COLUMN table_name SET NOT NULL;

-- Assegurar que els UUIDs relacionals (user_id, asset_id, record_id) puguen suportar l'arquitectura.
-- Aci no canviem l'estructura, però la fixem per a evitar registres "fantasma".

-- Índex de rendiment per a consultes de missatges (Thermodynamic efficiency)
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON public.messages(sender_id);

COMMIT;

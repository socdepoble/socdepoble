-- ==============================================================================
-- SÓC DE POBLE: Notifications Architecture & Null-Safety
-- Timestamp: 2026-05-06 01:10
-- Category: Architecture / Notifications
-- Description: Enduriment de la taula de notificacions per suportar deep-linking
-- polimòrfic, títols estructurats i seguretat "Null-Safety".
-- ==============================================================================

BEGIN;

-- ============================================================================
-- 1. NOTIFICATIONS: EXPANSÍÓ ESTRUCTURAL I NULL-SAFETY
-- ============================================================================

-- A. Afegim columnes essencials per a un sistema modern de notificacions (PWA / iOS / Android)
ALTER TABLE public.notifications 
ADD COLUMN IF NOT EXISTS title TEXT,
ADD COLUMN IF NOT EXISTS actor_id UUID,
ADD COLUMN IF NOT EXISTS reference_id UUID,
ADD COLUMN IF NOT EXISTS reference_type TEXT,
ADD COLUMN IF NOT EXISTS action_url TEXT;

-- B. Null-Safety Pass (Erradicació de NULLs)
-- Title
UPDATE public.notifications SET title = 'EMPTY' WHERE title IS NULL;
ALTER TABLE public.notifications ALTER COLUMN title SET DEFAULT 'EMPTY', ALTER COLUMN title SET NOT NULL;

-- Type
UPDATE public.notifications SET type = 'EMPTY' WHERE type IS NULL;
ALTER TABLE public.notifications ALTER COLUMN type SET DEFAULT 'EMPTY', ALTER COLUMN type SET NOT NULL;

-- Content
UPDATE public.notifications SET content = 'EMPTY' WHERE content IS NULL;
ALTER TABLE public.notifications ALTER COLUMN content SET DEFAULT 'EMPTY', ALTER COLUMN content SET NOT NULL;

-- Reference Type
UPDATE public.notifications SET reference_type = 'EMPTY' WHERE reference_type IS NULL;
ALTER TABLE public.notifications ALTER COLUMN reference_type SET DEFAULT 'EMPTY', ALTER COLUMN reference_type SET NOT NULL;

-- Action URL
UPDATE public.notifications SET action_url = 'EMPTY' WHERE action_url IS NULL;
ALTER TABLE public.notifications ALTER COLUMN action_url SET DEFAULT 'EMPTY', ALTER COLUMN action_url SET NOT NULL;

-- Meta JSONB
UPDATE public.notifications SET meta = '{}'::jsonb WHERE meta IS NULL;
ALTER TABLE public.notifications ALTER COLUMN meta SET DEFAULT '{}'::jsonb, ALTER COLUMN meta SET NOT NULL;


-- ============================================================================
-- 2. RENDIMENT TERMODINÀMIC (ÍNDEXS)
-- ============================================================================
-- Optimització per a la càrrega inicial a l'iPad A10 quan s'obri el panell de notificacions.
-- Consultem habitualment: "Les meues notificacions no llegides"
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON public.notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_reference ON public.notifications(reference_type, reference_id);

COMMIT;

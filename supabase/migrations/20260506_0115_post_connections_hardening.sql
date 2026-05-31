-- ==============================================================================
-- SÓC DE POBLE: Null-Safety & Structural Hardening (Post Connections)
-- Timestamp: 2026-05-06 01:15
-- Category: Architecture / Null-Safety & Constraints
-- Description: Fortificació de la taula de connexions de posts (likes, guardats)
-- assegurant restriccions d'unicitat, Null-Safety i eficiència termodinàmica.
-- ==============================================================================

BEGIN;

-- ============================================================================
-- 1. NULL-SAFETY
-- ============================================================================
-- Garantim que la llista de tags mai siga NULL.
UPDATE public.post_connections SET tags = '{}' WHERE tags IS NULL;
ALTER TABLE public.post_connections ALTER COLUMN tags SET DEFAULT '{}', ALTER COLUMN tags SET NOT NULL;

-- ============================================================================
-- 2. INTEGRITAT ESTRUCTURAL (Evitar Duplicitats)
-- ============================================================================
-- Un usuari només pot tindre una fila de connexió per post (que conté tots els tags).
-- Açò prevé anomalies de recompte i atacs de saturació.
ALTER TABLE public.post_connections 
DROP CONSTRAINT IF EXISTS unique_user_post_connection;

ALTER TABLE public.post_connections 
ADD CONSTRAINT unique_user_post_connection UNIQUE (user_id, post_uuid);

-- ============================================================================
-- 3. RENDIMENT TERMODINÀMIC (ÍNDEXS)
-- ============================================================================
-- Indexem els patrons d'accés més freqüents a l'App:
-- A) "Quantes connexions (likes) té aquest post?"
CREATE INDEX IF NOT EXISTS idx_post_connections_post_uuid ON public.post_connections(post_uuid);

-- B) "Quins posts he guardat/agradat jo?" (Càrrega de perfil d'usuari)
CREATE INDEX IF NOT EXISTS idx_post_connections_user_id ON public.post_connections(user_id);

COMMIT;

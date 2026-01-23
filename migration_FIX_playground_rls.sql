-- =========================================================
-- FIX: PERMETRE CREACIÓ DE CONVERSES EN PLAYGROUND (DEMO)
-- =========================================================

BEGIN;

-- 1. Afegir columna is_playground a converses (si no existeix)
-- Això ens permet marcar converses com a efímeres/de prova
ALTER TABLE IF EXISTS public.conversations 
ADD COLUMN IF NOT EXISTS is_playground BOOLEAN DEFAULT FALSE;

-- 2. Actualitzar RLS per a INSERT en converses
-- Actualment només permet insert si l'usuari està autenticat.
-- Afegim una excepció per a quan un participant és un ID de demo.
DROP POLICY IF EXISTS "Anyone can start a playground conversation" ON public.conversations;

CREATE POLICY "Anyone can start a playground conversation" ON public.conversations
    FOR INSERT WITH CHECK (
        -- Permetre si la conversa es marca com a playground
        is_playground = true
        OR
        -- O si un dels participants és un personatge de demo (ID 11111111-...)
        (participant_1_id::text LIKE '11111111-%' OR participant_2_id::text LIKE '11111111-%')
    );

-- 3. Actualitzar RLS per a SELECT en converses
-- Assegurem que l'usuari anònim o de demo pugui veure les seues pròpies converses de playground
DROP POLICY IF EXISTS "Conversations access policy" ON public.conversations;

CREATE POLICY "Conversations access policy" ON public.conversations
    FOR SELECT USING (
        -- 1. Si és Super Admin (via auth.uid)
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND is_super_admin = true
        )
        OR
        -- 2. Si és una conversa de DEMO (prefixe c1111000 o marcada com playground)
        (id::text LIKE 'c1111000-%')
        OR
        (is_playground = true)
        OR
        -- 3. Participant directe (usuari loguejat)
        (participant_1_type = 'user' AND participant_1_id = auth.uid())
        OR 
        (participant_2_type = 'entity' AND EXISTS (
            SELECT 1 FROM entity_member_map 
            WHERE entity_id = participant_2_id AND user_id = auth.uid()
        ))
    );

-- 4. Actualitzar la VISTA enriquida per a incloure is_playground
CREATE OR REPLACE VIEW view_conversations_enriched AS
SELECT 
    c.id,
    c.participant_1_id,
    c.participant_2_id,
    c.participant_1_type,
    c.participant_2_type,
    c.last_message_content,
    c.last_message_at,
    c.is_playground, -- Camp afegit
    CASE 
        WHEN c.participant_1_type = 'user' THEN p1.full_name 
        ELSE e1.name 
    END as p1_name,
    CASE 
        WHEN c.participant_1_type = 'user' THEN p1.avatar_url 
        ELSE e1.avatar_url 
    END as p1_avatar_url,
    CASE 
        WHEN c.participant_2_type = 'user' THEN p2.full_name 
        ELSE e2.name 
    END as p2_name,
    CASE 
        WHEN c.participant_2_type = 'user' THEN p2.avatar_url 
        ELSE e2.avatar_url 
    END as p2_avatar_url,
    p1.role as p1_role,
    p2.role as p2_role,
    CASE 
        WHEN c.participant_1_type = 'user' THEN COALESCE(p1.is_ai, false)
        ELSE COALESCE(e1.is_ai, false)
    END as p1_is_ai,
    CASE 
        WHEN c.participant_2_type = 'user' THEN COALESCE(p2.is_ai, false)
        ELSE COALESCE(e2.is_ai, false)
    END as p2_is_ai
FROM conversations c
LEFT JOIN profiles p1 ON c.participant_1_id = p1.id AND c.participant_1_type = 'user'
LEFT JOIN entities e1 ON c.participant_1_id = e1.id AND c.participant_1_type = 'entity'
LEFT JOIN profiles p2 ON c.participant_2_id = p2.id AND c.participant_2_type = 'user'
LEFT JOIN entities e2 ON c.participant_2_id = e2.id AND c.participant_2_type = 'entity';

COMMIT;

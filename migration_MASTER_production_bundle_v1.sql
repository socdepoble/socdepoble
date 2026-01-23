-- Migration: Add cover_url to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS cover_url TEXT;

-- Ensure RLS allows updating this column by the owner
-- Profiles table usually already has a policy for "Users can update their own profile"
-- but we make sure here just in case or if it's restricted by columns.
-- If the policy is `(auth.uid() = id)`, it should already cover this.
-- =========================================================
-- FIX: PERMETRE CREACIÓ DE CONVERSES EN PLAYGROUND (DEMO)
-- =========================================================

-- 1. Afegir columna is_playground a converses i missatges
ALTER TABLE IF EXISTS public.conversations 
ADD COLUMN IF NOT EXISTS is_playground BOOLEAN DEFAULT FALSE;

ALTER TABLE IF EXISTS public.messages 
ADD COLUMN IF NOT EXISTS is_playground BOOLEAN DEFAULT FALSE;

-- 2. Actualitzar RLS per a INSERT en converses
DROP POLICY IF EXISTS "Anyone can start a playground conversation" ON public.conversations;
CREATE POLICY "Anyone can start a playground conversation" ON public.conversations
    FOR INSERT WITH CHECK (
        is_playground = true
        OR
        (participant_1_id::text LIKE '11111111-%' OR participant_2_id::text LIKE '11111111-%')
    );

-- 3. Actualitzar RLS per a SELECT en converses
DROP POLICY IF EXISTS "Conversations access policy" ON public.conversations;
CREATE POLICY "Conversations access policy" ON public.conversations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND is_super_admin = true
        )
        OR
        (id::text LIKE 'c1111000-%')
        OR
        (is_playground = true)
        OR
        (participant_1_type = 'user' AND participant_1_id = auth.uid())
        OR 
        (participant_2_id = auth.uid()) -- Simplificat per a ambdós participants si són usuaris
    );

-- 4. Actualitzar RLS per a MISSATGES
DROP POLICY IF EXISTS "Anyone can send a playground message" ON public.messages;
CREATE POLICY "Anyone can send a playground message" ON public.messages
    FOR INSERT WITH CHECK (
        is_playground = true
        OR
        sender_id::text LIKE '11111111-%'
    );

DROP POLICY IF EXISTS "Messages access policy" ON public.messages;
CREATE POLICY "Messages access policy" ON public.messages
    FOR SELECT USING (
        is_playground = true
        OR
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND is_super_admin = true
        )
        OR
        sender_id = auth.uid()
        OR
        EXISTS (
            SELECT 1 FROM conversations c
            WHERE c.id = conversation_id AND (
                (c.participant_1_id = auth.uid()) OR
                (c.participant_2_id = auth.uid())
            )
        )
    );

-- 5. Actualitzar la VISTA enriquida per a incloure is_playground
DROP VIEW IF EXISTS view_conversations_enriched CASCADE;
CREATE OR REPLACE VIEW view_conversations_enriched AS
SELECT 
    c.id,
    c.participant_1_id,
    c.participant_2_id,
    c.participant_1_type,
    c.participant_2_type,
    c.last_message_content,
    c.last_message_at,
    c.is_playground,
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


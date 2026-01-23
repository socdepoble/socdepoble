-- FIX: PERMETRE ENVIAMENT DE MISSATGES EN PLAYGROUND (DEMO)

BEGIN;

-- 1. Afegir columna is_playground a missatges (si no existeix)
ALTER TABLE IF EXISTS public.messages 
ADD COLUMN IF NOT EXISTS is_playground BOOLEAN DEFAULT FALSE;

-- 2. Actualitzar RLS per a INSERT en missatges
-- Permetre insert si el missatge és de playground o si el remitent és demo
DROP POLICY IF EXISTS "Anyone can send a playground message" ON public.messages;
CREATE POLICY "Anyone can send a playground message" ON public.messages
    FOR INSERT WITH CHECK (
        is_playground = true
        OR
        sender_id::text LIKE '11111111-%'
    );

-- 3. Actualitzar RLS per a SELECT en missatges
-- Permetre lectura si el missatge és de playground
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
                (c.participant_1_type = 'user' AND c.participant_1_id = auth.uid()) OR
                (c.participant_2_type = 'user' AND c.participant_2_id = auth.uid())
            )
        )
    );

COMMIT;

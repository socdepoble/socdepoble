-- =========================================================
-- FIX: RLS BYPASS PARA SUPER ADMIN Y GUEST (DEMO)
-- =========================================================

BEGIN;

-- 1. Actualizar RLS en CONVERSATIONS
DROP POLICY IF EXISTS "Participants can view their conversations" ON public.conversations;

CREATE POLICY "Conversations access policy" ON public.conversations
    FOR SELECT USING (
        -- 1. Si es Super Admin, puede ver TODO
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND is_super_admin = true
        )
        OR
        -- 2. Si es una conversación de DEMO (prefijo c1111000), es PÚBLICA (LECTURA)
        (id::text LIKE 'c1111000-%')
        OR
        -- 3. Participante directo (usuario)
        (participant_1_type = 'user' AND participant_1_id = auth.uid())
        OR 
        (participant_2_type = 'user' AND participant_2_id = auth.uid())
        OR
        -- 4. Miembro de entidad participante
        (participant_1_type = 'entity' AND EXISTS (
            SELECT 1 FROM entity_member_map 
            WHERE entity_id = participant_1_id AND user_id = auth.uid()
        ))
        OR
        (participant_2_type = 'entity' AND EXISTS (
            SELECT 1 FROM entity_member_map 
            WHERE entity_id = participant_2_id AND user_id = auth.uid()
        ))
    );

-- 2. Actualizar RLS en MESSAGES
DROP POLICY IF EXISTS "Participants can view conversation messages" ON public.messages;

CREATE POLICY "Messages visibility policy" ON public.messages
    FOR SELECT USING (
        -- Si la conversación es visible según la política anterior
        EXISTS (
            SELECT 1 FROM public.conversations c
            where c.id = conversation_id
        )
    );

COMMIT;

-- ==========================================
-- PHASE 4: SECURE MESSAGING (DMs)
-- ==========================================

BEGIN;

-- 0. Handle Legacy Table Conflicts
-- We rename existing tables to 'legacy_*' to ensure a clean slate for the secure system
-- without losing potential data from the prototype phase.
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'messages') AND NOT EXISTS (SELECT 1 FROM pg_attribute WHERE attrelid = 'messages'::regclass AND attname = 'conversation_id') THEN
        ALTER TABLE messages RENAME TO legacy_messages;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'chats') THEN
        ALTER TABLE chats RENAME TO legacy_chats;
    END IF;
END $$;

-- 1. Conversations Table
CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    participant_1_id UUID NOT NULL, -- user_id (profiles.id) or entity_id (entities.id)
    participant_1_type TEXT NOT NULL CHECK (participant_1_type IN ('user', 'entity')),
    participant_2_id UUID NOT NULL,
    participant_2_type TEXT NOT NULL CHECK (participant_2_type IN ('user', 'entity')),
    last_message_content TEXT,
    last_message_at TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for finding chats quickly
CREATE INDEX IF NOT EXISTS idx_conversations_participants ON conversations(participant_1_id, participant_2_id);

-- 2. Messages Table
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL, -- auth.uid() if user, or current user's ID
    sender_entity_id UUID, -- NULL if personal, or entity_id if acting as entity
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for chat history
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id, created_at DESC);

-- 3. RLS - Conversations
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Participants can view their conversations" ON conversations
    FOR SELECT USING (
        -- User is direct participant 1
        (participant_1_type = 'user' AND participant_1_id = auth.uid())
        OR 
        -- User is direct participant 2
        (participant_2_type = 'user' AND participant_2_id = auth.uid())
        OR
        -- User is member of participant 1 (entity)
        (participant_1_type = 'entity' AND EXISTS (
            SELECT 1 FROM entity_member_map 
            WHERE entity_id = participant_1_id AND user_id = auth.uid()
        ))
        OR
        -- User is member of participant 2 (entity)
        (participant_2_type = 'entity' AND EXISTS (
            SELECT 1 FROM entity_member_map 
            WHERE entity_id = participant_2_id AND user_id = auth.uid()
        ))
    );

-- 4. RLS - Messages
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Participants can view conversation messages" ON messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM conversations c
            WHERE c.id = conversation_id
            AND (
                (c.participant_1_type = 'user' AND c.participant_1_id = auth.uid())
                OR (c.participant_2_type = 'user' AND c.participant_2_id = auth.uid())
                OR (c.participant_1_type = 'entity' AND EXISTS (
                    SELECT 1 FROM entity_member_map WHERE entity_id = c.participant_1_id AND user_id = auth.uid()
                ))
                OR (c.participant_2_type = 'entity' AND EXISTS (
                    SELECT 1 FROM entity_member_map WHERE entity_id = c.participant_2_id AND user_id = auth.uid()
                ))
            )
        )
    );

CREATE POLICY "Participants can send messages" ON messages
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM conversations c
            WHERE c.id = conversation_id
            AND (
                -- Sending as personal user
                (sender_entity_id IS NULL AND (
                    (c.participant_1_type = 'user' AND c.participant_1_id = auth.uid()) OR
                    (c.participant_2_type = 'user' AND c.participant_2_id = auth.uid())
                ))
                OR
                -- Sending as entity member
                (sender_entity_id IS NOT NULL AND EXISTS (
                    SELECT 1 FROM entity_member_map 
                    WHERE entity_id = sender_entity_id AND user_id = auth.uid()
                ) AND (
                    (c.participant_1_id = sender_entity_id) OR (c.participant_2_id = sender_entity_id)
                ))
            )
        )
        AND auth.uid() = sender_id
    );

COMMIT;

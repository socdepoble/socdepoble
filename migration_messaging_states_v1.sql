-- ==========================================
-- PHASE 5: MESSAGING ZENITH (HORIZON 1)
-- Message States & Rich Sync
-- ==========================================

BEGIN;

-- 1. Update Messages Table for States
ALTER TABLE messages 
    ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS read_at TIMESTAMPTZ;

-- 2. Indices for efficiently fetching unread messages
CREATE INDEX IF NOT EXISTS idx_messages_unread 
ON messages(conversation_id, sender_id) 
WHERE read_at IS NULL;

-- 3. Function to mark messages as read
CREATE OR REPLACE FUNCTION mark_messages_as_read(conv_id UUID, user_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE messages
    SET read_at = now()
    WHERE conversation_id = conv_id
    AND sender_id != user_id
    AND read_at IS NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMIT;

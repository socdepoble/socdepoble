-- Migration: Voice Messages Support
-- Execute this on Supabase SQL Editor to enable voice messaging

-- ============================================
-- PART 1: Voice Messages Table
-- ============================================

CREATE TABLE IF NOT EXISTS voice_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id UUID REFERENCES messages(id) ON DELETE CASCADE,
    media_asset_id UUID REFERENCES media_assets(id),
    duration_seconds INTEGER NOT NULL CHECK (duration_seconds > 0 AND duration_seconds <= 120),
    waveform_data JSONB, -- Array of amplitudes for visualization (50 data points)
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT unique_message_voice UNIQUE(message_id)
);

CREATE INDEX idx_voice_messages_message_id ON voice_messages(message_id);
CREATE INDEX idx_voice_messages_created_at ON voice_messages(created_at DESC);

COMMENT ON TABLE voice_messages IS 'Voice message metadata linked to chat messages';
COMMENT ON COLUMN voice_messages.duration_seconds IS 'Voice message duration in seconds (max 2 minutes)';
COMMENT ON COLUMN voice_messages.waveform_data IS 'Array of ~50 amplitude values for visual waveform';

-- ============================================
-- PART 2: Storage Bucket Configuration
-- ============================================

-- Create bucket for voice messages (execute only once)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'voice-messages',
    'voice-messages',
    false, -- Not public, requires auth
    5242880, -- 5MB max per file
    ARRAY['audio/webm', 'audio/ogg', 'audio/mpeg', 'audio/mp4', 'audio/wav']
)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- PART 3: Row Level Security (RLS) Policies
-- ============================================

-- Enable RLS on voice_messages table
ALTER TABLE voice_messages ENABLE ROW LEVEL SECURITY;

-- Policy: Users can insert their own voice messages
CREATE POLICY "Users can insert their own voice messages"
ON voice_messages FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM messages m
        WHERE m.id = message_id
        AND m.sender_id = auth.uid()
    )
);

-- Policy: Users can view voice messages from their conversations
CREATE POLICY "Users can view voice messages from their conversations"
ON voice_messages FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM messages m
        JOIN conversations c ON c.id = m.conversation_id
        WHERE m.id = message_id
        AND (c.user1_id = auth.uid() OR c.user2_id = auth.uid())
    )
);

-- Policy: Users can delete their own voice messages
CREATE POLICY "Users can delete their own voice messages"
ON voice_messages FOR DELETE
USING (
    EXISTS (
        SELECT 1 FROM messages m
        WHERE m.id = message_id
        AND m.sender_id = auth.uid()
    )
);

-- ============================================
-- PART 4: Storage Policies (RLS for files)
-- ============================================

-- Policy: Users can upload voice messages to their own folder
CREATE POLICY "Users can upload their own voice messages"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'voice-messages' AND 
    (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Users can read voice messages from their conversations
CREATE POLICY "Users can read voice messages from conversations"
ON storage.objects FOR SELECT
USING (
    bucket_id = 'voice-messages' AND
    (
        -- Own files
        (storage.foldername(name))[1] = auth.uid()::text
        OR
        -- Files from conversations they're part of
        EXISTS (
            SELECT 1 FROM conversations c
            WHERE c.id = (storage.foldername(name))[2]::uuid
            AND (c.user1_id = auth.uid() OR c.user2_id = auth.uid())
        )
    )
);

-- Policy: Users can delete their own voice messages
CREATE POLICY "Users can delete their own voice messages"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'voice-messages' AND
    (storage.foldername(name))[1] = auth.uid()::text
);

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check table created
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_name = 'voice_messages';

-- Check indexes
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename = 'voice_messages';

-- Check RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'voice_messages';

-- Check storage bucket
SELECT id, name, public, file_size_limit, allowed_mime_types
FROM storage.buckets
WHERE id = 'voice-messages';

-- Check storage policies
SELECT policyname, definition
FROM pg_policies
WHERE schemaname = 'storage'
AND tablename = 'objects'
AND policyname LIKE '%voice%';

-- ============================================
-- NOTES
-- ============================================
-- 
-- Voice Message Flow:
-- 1. User records audio in browser (max 2 minutes)
-- 2. Audio is compressed to WebM/Opus format
-- 3. Waveform is generated (50 amplitude points)
-- 4. File uploaded to storage: voice-messages/{user_id}/{conversation_id}/{timestamp}.webm
-- 5. media_asset created with URL
-- 6. message created with content = "[Voice Message]"
-- 7. voice_message created linking message + media_asset + metadata
--
-- Storage Structure:
-- voice-messages/
--   ├── {user_id}/
--   │   ├── {conversation_id}/
--   │   │   ├── 1737849600000.webm
--   │   │   ├── 1737849700000.webm
--   │   │   └── ...
--
-- Max file size: 5MB (enough for ~5 min of Opus audio at 128kbps)
-- Max duration: 120 seconds (2 minutes, WhatsApp standard)

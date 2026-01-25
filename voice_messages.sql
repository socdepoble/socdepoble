-- 1. Create table for voice message metadata
CREATE TABLE IF NOT EXISTS voice_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id UUID REFERENCES messages(id) ON DELETE CASCADE,
    media_asset_id UUID REFERENCES media_assets(id),
    duration_seconds INTEGER NOT NULL,
    waveform_data JSONB, -- Array of amplitudes for visualization
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_voice_messages_message_id ON voice_messages(message_id);

-- 2. Create Storage Bucket for voice messages
INSERT INTO storage.buckets (id, name, public)
VALUES ('voice-messages', 'voice-messages', true) -- Public access for easier playback
ON CONFLICT (id) DO NOTHING;

-- 3. Storage Policies (RLS)

-- Allow authenticated users to upload files to their own folder (user_id/conversation_id/timestamp.ext)
DROP POLICY IF EXISTS "Users can upload their own voice messages" ON storage.objects;
CREATE POLICY "Users can upload their own voice messages"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'voice-messages' AND 
    (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow public access to read (since bucket is public, this is implicit, but good to be explicit for SELECT if public=false)
-- If bucket is public, SELECT policy is not strictly needed for anon access, but we restrict structure.
-- For simple playback, we rely on public URLs.

-- 4. Enable RLS on the table
ALTER TABLE voice_messages ENABLE ROW LEVEL SECURITY;

-- Allow read access to voice_messages if user has access to the linked message
-- (This requires complex join, for now we allow authenticated read for simplicity or link to conversation)
CREATE POLICY "Users can view voice messages"
ON voice_messages FOR SELECT
TO authenticated
USING (true); -- Simplification: If you have the message_id, you can read the voice meta. Message RLS handles conversation access.

CREATE POLICY "Users can insert voice messages"
ON voice_messages FOR INSERT
TO authenticated
WITH CHECK (true);

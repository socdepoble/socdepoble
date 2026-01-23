-- Migration: Media Deduplication & Intelligent Sharing
-- This system tracks identical files via hash to save space and show community sharing.

-- 1. Table for unique physical assets
CREATE TABLE IF NOT EXISTS media_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hash TEXT UNIQUE NOT NULL, -- SHA-256 or similar
    url TEXT NOT NULL,
    mime_type TEXT,
    size_bytes BIGINT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Table for usage/shares of those assets
CREATE TABLE IF NOT EXISTS media_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_id UUID REFERENCES media_assets(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    context TEXT NOT NULL, -- 'avatar', 'cover', 'post', 'chat'
    is_public BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Indexes for fast lookup
CREATE INDEX IF NOT EXISTS idx_media_assets_hash ON media_assets(hash);
CREATE INDEX IF NOT EXISTS idx_media_usage_user ON media_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_media_usage_asset ON media_usage(asset_id);

-- 4. RLS Policies
ALTER TABLE media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_usage ENABLE ROW LEVEL SECURITY;

-- Anyone can see assets (they are public by nature if shared)
CREATE POLICY "Public Read Media Assets" ON media_assets
    FOR SELECT USING (true);

-- Authenticated users can insert new unique assets
CREATE POLICY "Insert Media Assets" ON media_assets
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Users can see usage if it's public or theirs
CREATE POLICY "View Public Media Usage" ON media_usage
    FOR SELECT USING (is_public = true OR auth.uid() = user_id);

-- Users can register their own usage
CREATE POLICY "Insert Own Media Usage" ON media_usage
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own usage (e.g. changing privacy)
CREATE POLICY "Update Own Media Usage" ON media_usage
    FOR UPDATE USING (auth.uid() = user_id);

-- 5. Helper View for Attribution
-- Shows who else shares a specific asset publicly
CREATE OR REPLACE VIEW media_attribution AS
SELECT 
    mu.asset_id,
    p.full_name,
    p.username,
    mu.user_id,
    mu.created_at,
    mu.context
FROM media_usage mu
JOIN profiles p ON mu.user_id = p.id
WHERE mu.is_public = true;

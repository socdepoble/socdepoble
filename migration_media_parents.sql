-- Migration: Add parent_asset_id to media_assets
-- This allows linking cropped variations back to their high-quality originals.

ALTER TABLE media_assets ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES media_assets(id) ON DELETE SET NULL;

-- Index for performance when finding variations
CREATE INDEX IF NOT EXISTS idx_media_assets_parent ON media_assets(parent_id);

-- Update RLS if necessary (usually 'true' for select is enough)

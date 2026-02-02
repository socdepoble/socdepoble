-- [SUPER-SEARCH: RÚPER RATÓN FOUNDATION]
-- Phase 1: Semantic Metadata & External Federation

-- Add semantic tags to posts for context-aware search
ALTER TABLE posts ADD COLUMN IF NOT EXISTS semantic_tags text[] DEFAULT '{}';
ALTER TABLE posts ADD COLUMN IF NOT EXISTS external_links jsonb DEFAULT '[]';

-- Add to market items
ALTER TABLE market_items ADD COLUMN IF NOT EXISTS semantic_tags text[] DEFAULT '{}';
ALTER TABLE market_items ADD COLUMN IF NOT EXISTS external_links jsonb DEFAULT '[]';

-- Create or update resources table for Federated Knowledge
CREATE TABLE IF NOT EXISTS resources (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    title text NOT NULL,
    description text,
    category text,
    url text,
    semantic_tags text[] DEFAULT '{}',
    external_links jsonb DEFAULT '[]',
    town_id integer REFERENCES towns(id),
    created_at timestamptz DEFAULT now()
);

-- Indexing for SQLite FTS5 parity (handled in Postgres via GIN)
CREATE INDEX IF NOT EXISTS posts_semantic_idx ON posts USING GIN (semantic_tags);
CREATE INDEX IF NOT EXISTS market_semantic_idx ON market_items USING GIN (semantic_tags);

-- [PROTOCOL FLASH: STABILITY]
-- Ensure every profile has a primary town to avoid search black holes
UPDATE profiles SET primary_town = 'La Torre de les Maçanes' WHERE primary_town IS NULL;

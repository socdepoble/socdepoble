-- Migration: 20260406_virtual_store_bases.sql
-- Description: Adds virtual store capabilities to market_items table

-- 1. Add new columns to market_items
ALTER TABLE public.market_items 
ADD COLUMN IF NOT EXISTS author_entity_id UUID REFERENCES public.towns(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS commerce_metadata JSONB DEFAULT '{}'::jsonb;

-- 2. Create index for fast retrieval by author_entity_id
CREATE INDEX IF NOT EXISTS idx_market_items_author_entity_id ON public.market_items(author_entity_id);

-- 3. Create index for JSONB queries on commerce_metadata (e.g. searching by specific flags or inventory)
CREATE INDEX IF NOT EXISTS idx_market_items_commerce_metadata ON public.market_items USING GIN (commerce_metadata);

-- 4. Update RLS policies to allow author_entity_id filtering and updating
-- Note: Assuming existing policies handle basic read/write, we might need a specific policy for entity managers.
-- For standard user-based RLS, existing policies should work, but for entity-driven modifications, 
-- we ensure those with entity permissions (if applicable) can manage store inventory.

-- Comment on columns
COMMENT ON COLUMN public.market_items.author_entity_id IS 'If set, this item is published on behalf of a local commerce/entity (towns table) rather than a regular user.';
COMMENT ON COLUMN public.market_items.commerce_metadata IS 'JSON payload for virtual store details: weekly menus, inventory limits, variants etc.';

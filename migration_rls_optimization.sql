-- ==========================================
-- PHASE 3: RLS OPTIMIZATION (CORRECTED)
-- Optimization of membership checks via Materialized View
-- ==========================================

-- 1. Create the Materialized View
-- This view flattens membership for fast lookup in RLS policies
CREATE MATERIALIZED VIEW IF NOT EXISTS entity_member_map AS
SELECT DISTINCT entity_id, user_id
FROM entity_members;

-- 2. Create a unique index for fast lookups and concurrent refreshes
CREATE UNIQUE INDEX IF NOT EXISTS idx_entity_member_map_composite 
ON entity_member_map(entity_id, user_id);

-- 3. Create refreshment function (Security Definer to bypass RLS during refresh)
CREATE OR REPLACE FUNCTION refresh_entity_member_map()
RETURNS TRIGGER AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY entity_member_map;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Create triggers to keep the map updated
DROP TRIGGER IF EXISTS tr_refresh_entity_member_map ON entity_members;
CREATE TRIGGER tr_refresh_entity_member_map
AFTER INSERT OR UPDATE OR DELETE ON entity_members
FOR EACH STATEMENT
EXECUTE FUNCTION refresh_entity_member_map();

-- 5. Update RLS policies for POSTS to use the optimized map
DROP POLICY IF EXISTS "Users insert posts" ON posts;
CREATE POLICY "Users insert posts" ON posts 
    FOR INSERT WITH CHECK (
        auth.uid() = author_user_id 
        AND (
            author_entity_id IS NULL 
            OR (
                EXISTS (
                    SELECT 1 FROM entity_member_map 
                    WHERE entity_id = author_entity_id 
                    AND user_id = auth.uid()
                )
                AND EXISTS (
                    SELECT 1 FROM entities
                    WHERE id = author_entity_id
                    AND (
                        (author_role = 'oficial' AND type = 'oficial')
                        OR (author_role <> 'oficial' AND type <> 'oficial')
                        OR (author_role <> 'oficial')
                    )
                )
            )
        )
    );

-- 6. Update RLS policies for MARKET_ITEMS to use the optimized map
-- FIX: Changed seller_role to author_role to match actual schema
DROP POLICY IF EXISTS "Users insert items" ON market_items;
CREATE POLICY "Users insert items" ON market_items 
    FOR INSERT WITH CHECK (
        auth.uid() = author_user_id 
        AND (
            seller_entity_id IS NULL 
            OR (
                EXISTS (
                    SELECT 1 FROM entity_member_map 
                    WHERE entity_id = seller_entity_id 
                    AND user_id = auth.uid()
                )
                AND EXISTS (
                    SELECT 1 FROM entities
                    WHERE id = seller_entity_id
                    AND (
                        (author_role = 'oficial' AND type = 'oficial')
                        OR (author_role <> 'oficial')
                    )
                )
            )
        )
    );

-- 7. Grant access to the view
GRANT SELECT ON entity_member_map TO authenticated;
GRANT SELECT ON entity_member_map TO anon;
GRANT SELECT ON entity_member_map TO service_role;

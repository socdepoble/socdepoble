-- ==========================================
-- PHASE 4: CONSOLIDATION (SCALABILITY & CONSISTENCY)
-- ==========================================

-- 1. Performance Indices for Scalability
-- These indices ensure that filtering by town_uuid is fast even with millions of rows.
CREATE INDEX IF NOT EXISTS idx_posts_town_uuid ON posts(town_uuid);
CREATE INDEX IF NOT EXISTS idx_market_items_town_uuid ON market_items(town_uuid);

-- 2. RLS Fallback for Extreme Consistency
-- Updates insertion policies to handle the edge case where the materialized view 
-- cache is slightly stale after a membership change.

-- Update Posts Policy
DROP POLICY IF EXISTS "Users insert posts" ON posts;
CREATE POLICY "Users insert posts" ON posts 
    FOR INSERT WITH CHECK (
        auth.uid() = author_user_id 
        AND (
            author_entity_id IS NULL -- Personal post
            OR (
                -- Hit cache (High performance)
                EXISTS (
                    SELECT 1 FROM entity_member_map 
                    WHERE entity_id = author_entity_id AND user_id = auth.uid()
                )
                -- Fallback check (Extreme consistency for race conditions)
                OR EXISTS (
                    SELECT 1 FROM entity_members 
                    WHERE entity_id = author_entity_id AND user_id = auth.uid()
                )
            )
            AND (
                (author_role = 'oficial' AND EXISTS (SELECT 1 FROM entities WHERE id = author_entity_id AND type = 'oficial'))
                OR (author_role <> 'oficial')
            )
        )
    );

-- Update Market Items Policy
DROP POLICY IF EXISTS "Users insert items" ON market_items;
CREATE POLICY "Users insert items" ON market_items 
    FOR INSERT WITH CHECK (
        auth.uid() = author_user_id 
        AND (
             seller_entity_id IS NULL -- Personal post
             OR (
                -- Hit cache
                EXISTS (
                    SELECT 1 FROM entity_member_map 
                    WHERE entity_id = seller_entity_id AND user_id = auth.uid()
                )
                -- Fallback check
                OR EXISTS (
                    SELECT 1 FROM entity_members 
                    WHERE entity_id = seller_entity_id AND user_id = auth.uid()
                )
            )
            AND (
                (author_role = 'oficial' AND EXISTS (SELECT 1 FROM entities WHERE id = seller_entity_id AND type = 'oficial'))
                OR (author_role <> 'oficial')
            )
        )
    );

-- Note: The OR check in RLS policies is highly efficient in PostgreSQL. 
-- The engine will short-circuit if the first condition (cache) is met.

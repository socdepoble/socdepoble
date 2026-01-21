-- ==========================================
-- PHASE 3: RATE LIMITING & ANTI-SPAM
-- Protection against automated mass posting
-- ==========================================

-- 1. Create a table to track activity if not using a more complex system
-- But for a simple trigger-based approach, we can check the tables directly.

-- 2. Anti-Spam Function for Posts
-- Rejects insertion if the user has posted more than X times in the last Y minutes
CREATE OR REPLACE FUNCTION check_post_rate_limit()
RETURNS TRIGGER AS $$
DECLARE
    post_count INT;
    limit_count INT := 5; -- Max 5 posts
    window_min INT := 10; -- per 10 minutes
BEGIN
    SELECT count(*) INTO post_count
    FROM posts
    WHERE author_user_id = auth.uid()
    AND created_at > (now() - (window_min || ' minutes')::interval);

    IF post_count >= limit_count THEN
        RAISE EXCEPTION 'Rate limit reached. Please wait a few minutes before posting again.'
        USING ERRCODE = 'P0001'; -- Personal defined error code
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Trigger for Posts
DROP TRIGGER IF EXISTS tr_post_rate_limit ON posts;
CREATE TRIGGER tr_post_rate_limit
BEFORE INSERT ON posts
FOR EACH ROW
EXECUTE FUNCTION check_post_rate_limit();

-- 4. Anti-Spam Function for Market Items
CREATE OR REPLACE FUNCTION check_market_rate_limit()
RETURNS TRIGGER AS $$
DECLARE
    item_count INT;
    limit_count INT := 3; -- Max 3 items
    window_min INT := 15; -- per 15 minutes
BEGIN
    SELECT count(*) INTO item_count
    FROM market_items
    WHERE author_user_id = auth.uid()
    AND created_at > (now() - (window_min || ' minutes')::interval);

    IF item_count >= limit_count THEN
        RAISE EXCEPTION 'Rate limit reached for market. Please wait a few minutes before adding more items.'
        USING ERRCODE = 'P0001';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Trigger for Market Items
DROP TRIGGER IF EXISTS tr_market_rate_limit ON market_items;
CREATE TRIGGER tr_market_rate_limit
BEFORE INSERT ON market_items
FOR EACH ROW
EXECUTE FUNCTION check_market_rate_limit();

-- Note: These limits are sensible for a community app. 
-- Can be adjusted based on real-world usage.

-- =========================================================
-- SÓC DE POBLE: MIGRACIÓ P2 - RENDIMENT (ÍNDEXS)
-- =========================================================

BEGIN;

-- 1. ÍNDEXS PER A POSTS
-- ---------------------------------------------------------
-- Millora el filtratge per poble (molt usat al Feed)
CREATE INDEX IF NOT EXISTS idx_posts_town_uuid ON posts(town_uuid);

-- Millora el filtratge per rols (pestanyes de CategoryTabs)
CREATE INDEX IF NOT EXISTS idx_posts_author_role ON posts(author_role);

-- Millora l'ordenació per data (Feed)
CREATE INDEX IF NOT EXISTS idx_posts_created_at_desc ON posts(created_at DESC);


-- 2. ÍNDEXS PER A MARKET_ITEMS
-- ---------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_market_items_town_uuid ON market_items(town_uuid);
CREATE INDEX IF NOT EXISTS idx_market_items_category_slug ON market_items(category_slug);
CREATE INDEX IF NOT EXISTS idx_market_items_created_at_desc ON market_items(created_at DESC);


-- 3. ÍNDEXS PER A POST_CONNECTIONS
-- ---------------------------------------------------------
-- Millora la cerca de connexions d'un usuari
CREATE INDEX IF NOT EXISTS idx_post_connections_user_id ON post_connections(user_id);
-- Millora la cerca de connexions per a una llista de posts (Feed)
CREATE INDEX IF NOT EXISTS idx_post_connections_post_uuid ON post_connections(post_uuid);


-- 4. ÍNDEXS PER A ENTITIES
-- ---------------------------------------------------------
-- Millora l'accés a les entitats d'un poble
CREATE INDEX IF NOT EXISTS idx_entities_town_uuid ON entities(town_uuid);

COMMIT;

-- =========================================================
-- ÍNDEXS DE RENDIMENT CRÍTIC (Sóc de Poble v10.33.16)
-- By: Qwen & Antigravity
-- =========================================================

-- 1. POSTS: Optimització per a Feed i Perfils
CREATE INDEX IF NOT EXISTS idx_posts_author_created 
ON posts(author_user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_posts_town_created 
ON posts(town_uuid, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_posts_type_created 
ON posts(type, created_at DESC);

-- 2. MESSAGES: Optimització per a Xats (Converses)
CREATE INDEX IF NOT EXISTS idx_messages_conv_created 
ON messages(conversation_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_messages_sender_created 
ON messages(sender_id, created_at DESC);

-- 3. CONVERSATIONS: Busqueda ràpida per participants
CREATE INDEX IF NOT EXISTS idx_conversations_participants 
ON conversations(participant_1_id, participant_2_id);

-- 4. MARKET ITEMS: Optimització per a Mercat
CREATE INDEX IF NOT EXISTS idx_market_items_seller_created 
ON market_items(seller_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_market_items_status 
ON market_items(status, created_at DESC);

-- 5. PROFILES: Busqueda per nom i població
CREATE INDEX IF NOT EXISTS idx_profiles_full_name 
ON profiles(full_name);

CREATE INDEX IF NOT EXISTS idx_profiles_town 
ON profiles(town_uuid);

-- 6. OPAQUE RELAYS: Protocol Rhizome
CREATE INDEX IF NOT EXISTS idx_opaque_relays_path 
ON opaque_relays(path);

-- 7. NETEJA DE TAULES (VACUUM ANALYZE)
-- Actualitza les estadístiques per al query planner
VACUUM ANALYZE posts;
VACUUM ANALYZE messages;
VACUUM ANALYZE conversations;
VACUUM ANALYZE market_items;
VACUUM ANALYZE profiles;

-- [MASTER] Supabase Performance & Security Audit Fixes [V2]
-- Focus: Resolve "Auth RLS Initialization Plan" (auth.uid() optimization)
-- and "Multiple Permissive Policies" (Redundancy cleanup)

BEGIN;

-- =========================================================
-- 1. OPTIMITZACIÓ DE RENDIMENT (Initialization Plan)
-- Descripció: Canviar auth.uid() per (select auth.uid()) per evitar
-- re-avalulació per fila.
-- =========================================================

-- Taula: public.post_likes
ALTER TABLE public.post_likes DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users manage own likes" ON public.post_likes;
DROP POLICY IF EXISTS "Public likes viewable" ON public.post_likes;

CREATE POLICY "Users manage own likes" 
ON public.post_likes FOR ALL 
TO authenticated 
USING ((select auth.uid()) = user_id)
WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Public likes viewable" 
ON public.post_likes FOR SELECT 
TO authenticated, anon 
USING (true);
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;


-- Taula: public.market_favorites
ALTER TABLE public.market_favorites DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users manage own market favorites" ON public.market_favorites;
DROP POLICY IF EXISTS "Public market_favorites viewable" ON public.market_favorites;

CREATE POLICY "Users manage own market favorites" 
ON public.market_favorites FOR ALL 
TO authenticated 
USING ((select auth.uid()) = user_id)
WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Public market_favorites viewable" 
ON public.market_favorites FOR SELECT 
TO authenticated, anon 
USING (true);
ALTER TABLE public.market_favorites ENABLE ROW LEVEL SECURITY;


-- Taula: public.entities
DROP POLICY IF EXISTS "Users can create entities" ON public.entities;
CREATE POLICY "Users can create entities" 
ON public.entities FOR INSERT 
TO authenticated 
WITH CHECK ((select auth.uid()) = owner_id);


-- Taula: public.posts
ALTER TABLE public.posts DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users manage own posts" ON public.posts;
DROP POLICY IF EXISTS "Public posts viewable" ON public.posts;

CREATE POLICY "Users manage own posts" 
ON public.posts FOR ALL 
TO authenticated 
USING ((select auth.uid()) = author_id)
WITH CHECK ((select auth.uid()) = author_id);

CREATE POLICY "Public posts viewable" 
ON public.posts FOR SELECT 
TO authenticated, anon 
USING (NOT is_playground OR (select auth.uid()) = author_id);
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;


-- Taula: public.market_items
ALTER TABLE public.market_items DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users manage own market items" ON public.market_items;
DROP POLICY IF EXISTS "Public active items viewable" ON public.market_items;

CREATE POLICY "Users manage own market items" 
ON public.market_items FOR ALL 
TO authenticated 
USING ((select auth.uid()) = author_id)
WITH CHECK ((select auth.uid()) = author_id);

CREATE POLICY "Public active items viewable" 
ON public.market_items FOR SELECT 
TO authenticated, anon 
USING (is_active = true OR (select auth.uid()) = author_id);
ALTER TABLE public.market_items ENABLE ROW LEVEL SECURITY;


-- Taula: public.profiles
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users manage own profile" ON public.profiles;
DROP POLICY IF EXISTS "Profiles are public" ON public.profiles;

CREATE POLICY "Users manage own profile" 
ON public.profiles FOR ALL 
TO authenticated 
USING ((select auth.uid()) = id)
WITH CHECK ((select auth.uid()) = id);

CREATE POLICY "Profiles are public" 
ON public.profiles FOR SELECT 
TO authenticated, anon 
USING (true);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;


-- Taula: public.messages
ALTER TABLE public.messages DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Messages visibility policy" ON public.messages;
DROP POLICY IF EXISTS "Messages insert policy" ON public.messages;

CREATE POLICY "Messages visibility policy" 
ON public.messages FOR SELECT 
TO authenticated 
USING ((select auth.uid()) = sender_id OR EXISTS (
    SELECT 1 FROM public.conversations c 
    WHERE c.id = conversation_id 
    AND ((select auth.uid()) = participant_1_id OR (select auth.uid()) = participant_2_id)
));

CREATE POLICY "Messages insert policy" 
ON public.messages FOR INSERT 
TO authenticated 
WITH CHECK ((select auth.uid()) = sender_id);
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;


-- Taula: public.conversations
ALTER TABLE public.conversations DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Conversations access policy" ON public.conversations;

CREATE POLICY "Conversations access policy" 
ON public.conversations FOR ALL 
TO authenticated 
USING ((select auth.uid()) = participant_1_id OR (select auth.uid()) = participant_2_id)
WITH CHECK ((select auth.uid()) = participant_1_id OR (select auth.uid()) = participant_2_id);
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;


-- Taula: public.notifications
DROP POLICY IF EXISTS "Users manage own notifications" ON public.notifications;

CREATE POLICY "Users manage own notifications" 
ON public.notifications FOR ALL 
TO authenticated 
USING ((select auth.uid()) = user_id)
WITH CHECK ((select auth.uid()) = user_id);


-- Taula: public.push_subscriptions
ALTER TABLE public.push_subscriptions DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users manage own subscriptions" ON public.push_subscriptions;

CREATE POLICY "Users manage own subscriptions" 
ON public.push_subscriptions FOR ALL 
TO authenticated 
USING ((select auth.uid()) = user_id)
WITH CHECK ((select auth.uid()) = user_id);
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;


-- =========================================================
-- 2. RESOLUCIÓ DE POLÍTIQUES PERMISSIVES MÚLTIPLES
-- =========================================================

-- Taula: public.connections
ALTER TABLE public.connections DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Connections viewable and manageable" ON public.connections;
DROP POLICY IF EXISTS "Public connections are viewable" ON public.connections;
DROP POLICY IF EXISTS "Users manage own connections" ON public.connections;

CREATE POLICY "Public connections are viewable" 
ON public.connections FOR SELECT 
TO authenticated, anon 
USING (true);

CREATE POLICY "Users manage own connections" 
ON public.connections FOR ALL 
TO authenticated 
USING ((select auth.uid()) = follower_id)
WITH CHECK ((select auth.uid()) = follower_id);

ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;

-- =========================================================
-- 3. ALTRES TAULES (Init Plan fix)
-- =========================================================

DROP POLICY IF EXISTS "Users manage own tags" ON public.user_tags;
CREATE POLICY "Users manage own tags" ON public.user_tags FOR ALL TO authenticated USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users manage own post connections" ON public.post_connections;
CREATE POLICY "Users manage own post connections" ON public.post_connections FOR ALL TO authenticated USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Push logs viewable" ON public.push_notifications_log;
CREATE POLICY "Push logs viewable" ON public.push_notifications_log FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Media assets insert policy" ON public.media_assets;
CREATE POLICY "Media assets insert policy" ON public.media_assets FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Media usage management" ON public.media_usage;
CREATE POLICY "Media usage management" ON public.media_usage FOR ALL TO authenticated USING ((select auth.uid()) = user_id);

-- =========================================================
-- 4. ÍNDEXS PER A FOREIGN KEYS (Rendiment de Joins)
-- =========================================================

-- Taula: public.connection_tags
CREATE INDEX IF NOT EXISTS idx_connection_tags_user_id ON public.connection_tags (user_id);

-- Taula: public.connections
CREATE INDEX IF NOT EXISTS idx_connections_target_id ON public.connections (target_id);

-- Taula: public.entities
CREATE INDEX IF NOT EXISTS idx_entities_owner_id ON public.entities (owner_id);

-- Taula: public.entity_members
CREATE INDEX IF NOT EXISTS idx_entity_members_user_id ON public.entity_members (user_id);

-- Taula: public.legacy_messages
CREATE INDEX IF NOT EXISTS idx_legacy_messages_chat_id ON public.legacy_messages (chat_id);

-- Taula: public.lexicon
CREATE INDEX IF NOT EXISTS idx_lexicon_town_uuid ON public.lexicon (town_uuid);
CREATE INDEX IF NOT EXISTS idx_lexicon_user_id ON public.lexicon (user_id);

-- Taula: public.market_favorites
CREATE INDEX IF NOT EXISTS idx_market_favorites_user_id ON public.market_favorites (user_id);

-- Taula: public.market_items
CREATE INDEX IF NOT EXISTS idx_market_items_author_id ON public.market_items (author_id);
CREATE INDEX IF NOT EXISTS idx_market_items_seller_entity_id ON public.market_items (seller_entity_id);

-- Taula: public.notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications (user_id);

-- Taula: public.post_connections
CREATE INDEX IF NOT EXISTS idx_post_connections_post_uuid ON public.post_connections (post_uuid);
CREATE INDEX IF NOT EXISTS idx_post_connections_user_id ON public.post_connections (user_id);

-- Taula: public.post_likes
CREATE INDEX IF NOT EXISTS idx_post_likes_post_uuid ON public.post_likes (post_uuid);
CREATE INDEX IF NOT EXISTS idx_post_likes_user_id ON public.post_likes (user_id);

-- Taula: public.posts
CREATE INDEX IF NOT EXISTS idx_posts_author_id ON public.posts (author_id);
CREATE INDEX IF NOT EXISTS idx_posts_author_entity_id ON public.posts (author_entity_id);
CREATE INDEX IF NOT EXISTS idx_posts_town_uuid ON public.posts (town_uuid);

-- Taula: public.profiles
CREATE INDEX IF NOT EXISTS idx_profiles_town_uuid ON public.profiles (town_uuid);

-- Taula: public.push_subscriptions
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_user_id ON public.push_subscriptions (user_id);

-- =========================================================
-- 5. NETEJA D'ÍNDEXS INÚTILS (Segons Supabase Linter)
-- =========================================================

DROP INDEX IF EXISTS public.idx_towns_name_trgm;
DROP INDEX IF EXISTS public.idx_towns_search_names_trgm;
DROP INDEX IF EXISTS public.idx_towns_comarca_trgm;
DROP INDEX IF EXISTS public.idx_towns_province_trgm;
DROP INDEX IF EXISTS public.idx_market_town;
DROP INDEX IF EXISTS public.idx_media_usage_asset_id;
DROP INDEX IF EXISTS public.idx_media_usage_asset;
DROP INDEX IF EXISTS public.idx_push_subscriptions_user_id;
DROP INDEX IF EXISTS public.idx_push_subscriptions_active;
DROP INDEX IF EXISTS public.idx_media_assets_parent;
DROP INDEX IF EXISTS public.idx_push_log_sent_at;
DROP INDEX IF EXISTS public.idx_profiles_username;

COMMIT;

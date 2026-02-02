-- =========================================================
-- [MASTER] MIGRACIÓ P4: OPTIMITZACIÓ RLS (INIT PLAN) I CONSOLIDACIÓ
-- Resolució d'avisos de rendiment (0003_auth_rls_initplan) i redundància (0006_multiple_permissive_policies)
-- =========================================================

BEGIN;

-- 1. PROFILES
DROP POLICY IF EXISTS "Own profile update" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can delete own profile" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;

CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can manage own profile" ON public.profiles
    FOR ALL TO authenticated
    USING ((SELECT auth.uid()) = id)
    WITH CHECK ((SELECT auth.uid()) = id);


-- 2. POSTS
DROP POLICY IF EXISTS "Users insert posts" ON public.posts;
DROP POLICY IF EXISTS "Users update posts" ON public.posts;
DROP POLICY IF EXISTS "Users delete posts" ON public.posts;
DROP POLICY IF EXISTS "Users can manage their own posts" ON public.posts;
DROP POLICY IF EXISTS "Users can only insert their own posts" ON public.posts;
DROP POLICY IF EXISTS "Public posts are viewable by everyone" ON public.posts;

CREATE POLICY "Public posts are viewable by everyone" ON public.posts
    FOR SELECT USING (true);

CREATE POLICY "Users can manage their own posts" ON public.posts
    FOR ALL TO authenticated
    USING ((SELECT auth.uid()) = user_id)
    WITH CHECK ((SELECT auth.uid()) = user_id);


-- 3. POST_LIKES
DROP POLICY IF EXISTS "Users can insert their own likes" ON public.post_likes;
DROP POLICY IF EXISTS "Authenticated users can insert likes" ON public.post_likes;
DROP POLICY IF EXISTS "Users can manage own likes" ON public.post_likes;
DROP POLICY IF EXISTS "Users can only delete their own likes" ON public.post_likes;
DROP POLICY IF EXISTS "Post likes are public" ON public.post_likes;

CREATE POLICY "Post likes are public" ON public.post_likes
    FOR SELECT USING (true);

CREATE POLICY "Users can manage own likes" ON public.post_likes
    FOR ALL TO authenticated
    USING ((SELECT auth.uid()) = user_id)
    WITH CHECK ((SELECT auth.uid()) = user_id);


-- 4. MARKET_ITEMS
DROP POLICY IF EXISTS "Users insert items" ON public.market_items;
DROP POLICY IF EXISTS "Users update items" ON public.market_items;
DROP POLICY IF EXISTS "Users delete items" ON public.market_items;
DROP POLICY IF EXISTS "Users can manage their own market items" ON public.market_items;
DROP POLICY IF EXISTS "Users manage own market items" ON public.market_items;
DROP POLICY IF EXISTS "Public items seeable" ON public.market_items;
DROP POLICY IF EXISTS "Public active items viewable" ON public.market_items;
DROP POLICY IF EXISTS "Anyone can view active market market items" ON public.market_items;

CREATE POLICY "Public items seeable" ON public.market_items
    FOR SELECT USING (true);

CREATE POLICY "Users can manage their own market items" ON public.market_items
    FOR ALL TO authenticated
    USING ((SELECT auth.uid()) = user_id)
    WITH CHECK ((SELECT auth.uid()) = user_id);


-- 5. MARKET_FAVORITES
DROP POLICY IF EXISTS "Users can insert their own favorites" ON public.market_favorites;
DROP POLICY IF EXISTS "Authenticated users can insert favorites" ON public.market_favorites;
DROP POLICY IF EXISTS "Users can delete their own favorites" ON public.market_favorites;
DROP POLICY IF EXISTS "Users manage own favorites" ON public.market_favorites;
DROP POLICY IF EXISTS "Users manage own market favorites" ON public.market_favorites;
DROP POLICY IF EXISTS "Users can only delete their own favorites" ON public.market_favorites;
DROP POLICY IF EXISTS "Public favorites seeable" ON public.market_favorites;
DROP POLICY IF EXISTS "Public market_favorites viewable" ON public.market_favorites;
DROP POLICY IF EXISTS "Public market_favorites viewable by everyone" ON public.market_favorites;
DROP POLICY IF EXISTS "Users can manage own favorites" ON public.market_favorites;

CREATE POLICY "Users can manage own favorites" ON public.market_favorites
    FOR ALL TO authenticated
    USING ((SELECT auth.uid()) = user_id)
    WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Public market_favorites viewable" ON public.market_favorites
    FOR SELECT USING (true);


-- 6. MESSAGES
DROP POLICY IF EXISTS "Participants can send messages" ON public.messages;
DROP POLICY IF EXISTS "Users can view their own messages" ON public.messages;
DROP POLICY IF EXISTS "Users can insert messages in their conversations" ON public.messages;
DROP POLICY IF EXISTS "Messages access policy" ON public.messages;
DROP POLICY IF EXISTS "Messages insert policy" ON public.messages;
DROP POLICY IF EXISTS "Messages visibility policy" ON public.messages;
DROP POLICY IF EXISTS "Anyone can send a playground message" ON public.messages;

-- Política unificada per a missatges (només els participants poden veure/inserir)
CREATE POLICY "Messages access policy" ON public.messages
    FOR ALL TO authenticated
    USING (
        (SELECT auth.uid()) = sender_id OR 
        EXISTS (
            SELECT 1 FROM conversation_participants 
            WHERE conversation_id = messages.conversation_id 
            AND user_id = (SELECT auth.uid())
        )
    )
    WITH CHECK (
        (SELECT auth.uid()) = sender_id
    );


-- 7. CONVERSATIONS
DROP POLICY IF EXISTS "Users can manage their own conversations" ON public.conversations;
DROP POLICY IF EXISTS "Conversations access policy" ON public.conversations;
DROP POLICY IF EXISTS "Anyone can start a playground conversation" ON public.conversations;

CREATE POLICY "Conversations access policy" ON public.conversations
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM conversation_participants 
            WHERE conversation_id = id 
            AND user_id = (SELECT auth.uid())
        )
    );


-- 8. CONNECTIONS
DROP POLICY IF EXISTS "Connections are public" ON public.connections;
DROP POLICY IF EXISTS "Public connections are viewable" ON public.connections;
DROP POLICY IF EXISTS "Users can manage their own connections" ON public.connections;
DROP POLICY IF EXISTS "Users manage own connections" ON public.connections;

CREATE POLICY "Public connections are viewable" ON public.connections
    FOR SELECT USING (true);

CREATE POLICY "Users can manage their own connections" ON public.connections
    FOR ALL TO authenticated
    USING ((SELECT auth.uid()) = user_id)
    WITH CHECK ((SELECT auth.uid()) = user_id);


-- 9. POST_CONNECTIONS
DROP POLICY IF EXISTS "Authenticated users can insert connections" ON public.post_connections;
DROP POLICY IF EXISTS "Users manage own connections" ON public.post_connections;
DROP POLICY IF EXISTS "Users can manage their own post connections" ON public.post_connections;
DROP POLICY IF EXISTS "Public select post_connections" ON public.post_connections;

CREATE POLICY "Public select post_connections" ON public.post_connections
    FOR SELECT USING (true);

CREATE POLICY "Users can manage their own post connections" ON public.post_connections
    FOR ALL TO authenticated
    USING ((SELECT auth.uid()) = user_id)
    WITH CHECK ((SELECT auth.uid()) = user_id);


-- 10. LEXICON
DROP POLICY IF EXISTS "Public Read Lexicon" ON public.lexicon;
DROP POLICY IF EXISTS "Public lexicon viewable by everyone" ON public.lexicon;
DROP POLICY IF EXISTS "Authenticated Insert Lexicon" ON public.lexicon;
DROP POLICY IF EXISTS "Authenticated users can insert lexicon" ON public.lexicon;
DROP POLICY IF EXISTS "Admin Manage Lexicon" ON public.lexicon;

CREATE POLICY "Public lexicon viewable" ON public.lexicon
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert lexicon" ON public.lexicon
    FOR INSERT TO authenticated
    WITH CHECK (true);

CREATE POLICY "Admin manage lexicon" ON public.lexicon
    FOR ALL TO authenticated
    USING ((SELECT auth.role()) = 'admin');


-- 11. NOTIFICATIONS
DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users manage own notifications" ON public.notifications;

CREATE POLICY "Users manage own notifications" ON public.notifications
    FOR ALL TO authenticated
    USING ((SELECT auth.uid()) = user_id)
    WITH CHECK ((SELECT auth.uid()) = user_id);


-- 12. PUSH_SUBSCRIPTIONS
DROP POLICY IF EXISTS "Users can manage own subscriptions" ON public.push_subscriptions;
DROP POLICY IF EXISTS "Users can insert their own subscriptions" ON public.push_subscriptions;
DROP POLICY IF EXISTS "Users can update their own subscriptions" ON public.push_subscriptions;
DROP POLICY IF EXISTS "Users can delete their own subscriptions" ON public.push_subscriptions;
DROP POLICY IF EXISTS "Users can view their own subscriptions" ON public.push_subscriptions;

CREATE POLICY "Users manage own push subscriptions" ON public.push_subscriptions
    FOR ALL TO authenticated
    USING ((SELECT auth.uid()) = user_id)
    WITH CHECK ((SELECT auth.uid()) = user_id);


-- 13. MEDIA_USAGE & MEDIA_ASSETS
DROP POLICY IF EXISTS "View Public Media Usage" ON public.media_usage;
DROP POLICY IF EXISTS "Insert Own Media Usage" ON public.media_usage;
DROP POLICY IF EXISTS "Users can update own media usage" ON public.media_usage;
DROP POLICY IF EXISTS "Media usage management" ON public.media_usage;

CREATE POLICY "Media usage management" ON public.media_usage
    FOR ALL TO authenticated
    USING ((SELECT auth.uid()) = user_id)
    WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Authenticated users can insert media assets" ON public.media_assets;
DROP POLICY IF EXISTS "Media assets insert policy" ON public.media_assets;

CREATE POLICY "Media assets manage policy" ON public.media_assets
    FOR ALL TO authenticated
    USING ((SELECT auth.uid()) = user_id)
    WITH CHECK ((SELECT auth.uid()) = user_id);


-- 14. OTHER TABLES (TAGS, LOGS)
DROP POLICY IF EXISTS "Users can manage their own connection tags" ON public.connection_tags;
CREATE POLICY "Users can manage their own connection tags" ON public.connection_tags
    FOR ALL TO authenticated
    USING ((SELECT auth.uid()) = user_id)
    WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert their own tags" ON public.user_tags;
DROP POLICY IF EXISTS "Users can delete their own tags" ON public.user_tags;
CREATE POLICY "Users can manage their own user tags" ON public.user_tags
    FOR ALL TO authenticated
    USING ((SELECT auth.uid()) = user_id)
    WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Logs viewable by authenticated users" ON public.push_notifications_log;
CREATE POLICY "Logs viewable by authenticated users" ON public.push_notifications_log
    FOR SELECT TO authenticated USING (true);


-- 15. INDEXACIÓ DE FOREIGN KEYS (INFO 0001)
-- Millora el rendiment de joins i integritat referencial
CREATE INDEX IF NOT EXISTS idx_market_items_author_id ON public.market_items(user_id); -- Assumint col 12 és user_id/author_id
CREATE INDEX IF NOT EXISTS idx_media_assets_parent_id ON public.media_assets(parent_id);
CREATE INDEX IF NOT EXISTS idx_media_usage_asset_id ON public.media_usage(asset_id);
CREATE INDEX IF NOT EXISTS idx_posts_author_id ON public.posts(user_id);


-- 16. ELIMINACIÓ D'ÍNDEXS NO UTILITZATS (INFO 0005)
-- Estalvi d'espai i millora en escriptura
DROP INDEX IF EXISTS public.idx_profiles_town_uuid;
DROP INDEX IF EXISTS public.idx_lexicon_url;
DROP INDEX IF EXISTS public.idx_lexicon_category;
DROP INDEX IF EXISTS public.idx_lexicon_tags;
DROP INDEX IF EXISTS public.idx_connection_tags_user_id;
DROP INDEX IF EXISTS public.idx_connections_target_id;
DROP INDEX IF EXISTS public.idx_entities_owner_id;
DROP INDEX IF EXISTS public.idx_entity_members_user_id;
DROP INDEX IF EXISTS public.idx_legacy_messages_chat_id;
DROP INDEX IF EXISTS public.idx_lexicon_town_uuid;
DROP INDEX IF EXISTS public.idx_lexicon_user_id;
DROP INDEX IF EXISTS public.idx_market_favorites_user_id;
DROP INDEX IF EXISTS public.idx_market_items_seller_entity_id;
DROP INDEX IF EXISTS public.idx_notifications_user_id;
DROP INDEX IF EXISTS public.idx_post_connections_user_id;
DROP INDEX IF EXISTS public.idx_post_likes_post_uuid;
DROP INDEX IF EXISTS public.idx_post_likes_user_id;

COMMIT;

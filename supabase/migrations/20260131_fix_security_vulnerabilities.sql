-- ==========================================
-- SÓC DE POBLE: SECURITY HARDENING (2026-01-31) - REPAIR V3
-- Addressing Supabase Security Vulnerabilities & Missing Tables
-- ==========================================

-- 1. MARKET CATEGORIES
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'market_categories') THEN
        ALTER TABLE public.market_categories ENABLE ROW LEVEL SECURITY;
        DROP POLICY IF EXISTS "Public market_categories are viewable by everyone" ON public.market_categories;
        CREATE POLICY "Public market_categories are viewable by everyone" 
        ON public.market_categories FOR SELECT USING (true);
    END IF;
END $$;

-- 2. LEXICON
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'lexicon') THEN
        -- Ensure lexicon has user_id
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'lexicon' AND column_name = 'user_id') THEN
            ALTER TABLE public.lexicon ADD COLUMN user_id UUID REFERENCES auth.users(id);
        END IF;

        ALTER TABLE public.lexicon ENABLE ROW LEVEL SECURITY;
        
        -- Secure SELECT
        DROP POLICY IF EXISTS "Public lexicon viewable by everyone" ON public.lexicon;
        DROP POLICY IF EXISTS "Public lexicon is viewable by everyone" ON public.lexicon;
        CREATE POLICY "Public lexicon viewable by everyone" 
        ON public.lexicon FOR SELECT USING (true);

        -- Secure INSERT
        DROP POLICY IF EXISTS "Anyone can insert lexicon" ON public.lexicon;
        DROP POLICY IF EXISTS "Authenticated users can insert lexicon" ON public.lexicon;
        CREATE POLICY "Authenticated users can insert lexicon" 
        ON public.lexicon FOR INSERT 
        TO authenticated 
        WITH CHECK (auth.uid() = user_id);
    END IF;
END $$;

-- 3. MARKET FAVORITES
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'market_favorites') THEN
        -- Ensure item_uuid consistency
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'market_favorites' AND column_name = 'item_uuid') THEN
            ALTER TABLE public.market_favorites ADD COLUMN item_uuid UUID; -- Generic placeholder if items table differs
        END IF;

        ALTER TABLE public.market_favorites ENABLE ROW LEVEL SECURITY;

        DROP POLICY IF EXISTS "Public market_favorites viewable by everyone" ON public.market_favorites;
        CREATE POLICY "Public market_favorites viewable by everyone" 
        ON public.market_favorites FOR SELECT USING (true);

        DROP POLICY IF EXISTS "Anyone can insert favorites" ON public.market_favorites;
        DROP POLICY IF EXISTS "Users can manage own favorites" ON public.market_favorites;
        CREATE POLICY "Users can manage own favorites" 
        ON public.market_favorites FOR ALL 
        TO authenticated 
        USING (auth.uid() = user_id)
        WITH CHECK (auth.uid() = user_id);
    END IF;
END $$;

-- 4. POST LIKES
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'post_likes') THEN
        ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;

        DROP POLICY IF EXISTS "Public post_likes viewable by everyone" ON public.post_likes;
        CREATE POLICY "Public post_likes viewable by everyone" 
        ON public.post_likes FOR SELECT USING (true);

        DROP POLICY IF EXISTS "Anyone can insert likes" ON public.post_likes;
        DROP POLICY IF EXISTS "Anyone can delete likes" ON public.post_likes;
        DROP POLICY IF EXISTS "Users can manage own likes" ON public.post_likes;
        CREATE POLICY "Users can manage own likes" 
        ON public.post_likes FOR ALL 
        TO authenticated 
        USING (auth.uid()::text = user_id::text)
        WITH CHECK (auth.uid()::text = user_id::text);
    END IF;
END $$;

-- 5. POST CONNECTIONS
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'post_connections') THEN
        ALTER TABLE public.post_connections ENABLE ROW LEVEL SECURITY;

        DROP POLICY IF EXISTS "Public select post_connections" ON public.post_connections;
        CREATE POLICY "Public select post_connections" 
        ON public.post_connections FOR SELECT USING (true);

        DROP POLICY IF EXISTS "Users can manage own connections" ON public.post_connections;
        CREATE POLICY "Users can manage own connections" 
        ON public.post_connections FOR ALL 
        TO authenticated 
        USING (auth.uid() = user_id)
        WITH CHECK (auth.uid() = user_id);
    END IF;
END $$;

-- 6. VOICE MESSAGES
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'voice_messages') THEN
        ALTER TABLE public.voice_messages ENABLE ROW LEVEL SECURITY;

        DROP POLICY IF EXISTS "Users can view voice messages" ON public.voice_messages;
        CREATE POLICY "Users can view voice messages" 
        ON public.voice_messages FOR SELECT 
        TO authenticated 
        USING (EXISTS (
            SELECT 1 FROM public.messages m
            JOIN public.conversations c ON m.conversation_id = c.id
            WHERE m.id = voice_messages.message_id
            AND (auth.uid()::uuid = c.participant_1_id OR auth.uid()::uuid = c.participant_2_id)
        ));
    END IF;
END $$;

-- 7. TOWNS
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'towns') THEN
        ALTER TABLE public.towns ENABLE ROW LEVEL SECURITY;
        DROP POLICY IF EXISTS "Public towns are viewable by everyone" ON public.towns;
        CREATE POLICY "Public towns are viewable by everyone" 
        ON public.towns FOR SELECT USING (true);
    END IF;
END $$;

-- 8. NOTIFICATIONS & PUSH SUBSCRIPTIONS
DO $$ 
BEGIN
    -- Notifications
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'notifications') THEN
        ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
        
        DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;
        CREATE POLICY "Users can view own notifications" 
        ON public.notifications FOR SELECT 
        TO authenticated 
        USING (auth.uid() = user_id);

        DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;
        CREATE POLICY "Users can update own notifications" 
        ON public.notifications FOR UPDATE 
        TO authenticated 
        USING (auth.uid() = user_id)
        WITH CHECK (auth.uid() = user_id);
    END IF;

    -- Push Subscriptions
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'push_subscriptions') THEN
        ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;
        
        DROP POLICY IF EXISTS "Users can manage own subscriptions" ON public.push_subscriptions;
        CREATE POLICY "Users can manage own subscriptions" 
        ON public.push_subscriptions FOR ALL 
        TO authenticated 
        USING (auth.uid() = user_id)
        WITH CHECK (auth.uid() = user_id);
    END IF;
END $$;

-- 9. POST COMMENTS
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'post_comments') THEN
        -- Ensure user_id exists
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'post_comments' AND column_name = 'user_id') THEN
            ALTER TABLE public.post_comments ADD COLUMN user_id UUID REFERENCES auth.users(id);
        END IF;

        ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;

        DROP POLICY IF EXISTS "Public post_comments are viewable by everyone" ON public.post_comments;
        CREATE POLICY "Public post_comments are viewable by everyone" 
        ON public.post_comments FOR SELECT USING (true);

        DROP POLICY IF EXISTS "Users can manage own comments" ON public.post_comments;
        CREATE POLICY "Users can manage own comments" 
        ON public.post_comments FOR ALL 
        TO authenticated 
        USING (auth.uid() = user_id)
        WITH CHECK (auth.uid() = user_id);
    END IF;
END $$;

COMMENT ON DATABASE postgres IS 'Security vulnerabilities fixed on 2026-01-31. RLS enforced on critical tables with robust existence checks (V3).';

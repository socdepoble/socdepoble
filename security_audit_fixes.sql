-- SECURITY AUDIT FIXES (2026-01-23)

-- 0. Cleanup existing policies to allow schema changes
-- (PostgreSQL doesn't let you change column types if they are used in a policy)
DROP POLICY IF EXISTS "Anyone can view posts" ON posts;
DROP POLICY IF EXISTS "Users can manage their own posts" ON posts;
DROP POLICY IF EXISTS "Anyone can view active market market items" ON market_items;
DROP POLICY IF EXISTS "Users can manage their own market items" ON market_items;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can manage their own conversations" ON conversations;
DROP POLICY IF EXISTS "Users can view their own conversations" ON conversations;
DROP POLICY IF EXISTS "Users can view their own messages" ON messages;
DROP POLICY IF EXISTS "Users can insert messages in their conversations" ON messages;

-- 1. Standardize and Fix Schema (Ensuring UUID types)
-- Posts
ALTER TABLE IF EXISTS posts ADD COLUMN IF NOT EXISTS author_id UUID;
ALTER TABLE IF EXISTS posts ALTER COLUMN author_id SET DATA TYPE UUID USING author_id::uuid;
ALTER TABLE IF EXISTS posts ADD COLUMN IF NOT EXISTS author_name TEXT;
ALTER TABLE IF EXISTS posts ADD COLUMN IF NOT EXISTS author_avatar_url TEXT;
ALTER TABLE IF EXISTS posts ADD COLUMN IF NOT EXISTS author_role TEXT;
ALTER TABLE IF EXISTS posts ADD COLUMN IF NOT EXISTS author_is_ai BOOLEAN DEFAULT false;
ALTER TABLE IF EXISTS posts ADD COLUMN IF NOT EXISTS town_uuid UUID;
ALTER TABLE IF EXISTS posts ADD COLUMN IF NOT EXISTS entity_id UUID;
ALTER TABLE IF EXISTS posts ALTER COLUMN entity_id SET DATA TYPE UUID USING entity_id::uuid;
ALTER TABLE IF EXISTS posts ADD COLUMN IF NOT EXISTS is_playground BOOLEAN DEFAULT false;

-- Data recovery for posts (con CAST y validación)
UPDATE posts 
SET author_id = author_user_id::uuid 
WHERE author_id IS NULL 
  AND author_user_id IS NOT NULL 
  AND author_user_id::text ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';

UPDATE posts 
SET entity_id = author_entity_id::uuid 
WHERE entity_id IS NULL 
  AND author_entity_id IS NOT NULL 
  AND author_entity_id::text ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';

-- Market Items
ALTER TABLE IF EXISTS market_items ADD COLUMN IF NOT EXISTS author_id UUID;
ALTER TABLE IF EXISTS market_items ALTER COLUMN author_id SET DATA TYPE UUID USING author_id::uuid;
ALTER TABLE IF EXISTS market_items ADD COLUMN IF NOT EXISTS author_name TEXT;
ALTER TABLE IF EXISTS market_items ADD COLUMN IF NOT EXISTS author_avatar_url TEXT;
ALTER TABLE IF EXISTS market_items ADD COLUMN IF NOT EXISTS author_role TEXT;
ALTER TABLE IF EXISTS market_items ADD COLUMN IF NOT EXISTS author_is_ai BOOLEAN DEFAULT false;
ALTER TABLE IF EXISTS market_items ADD COLUMN IF NOT EXISTS town_uuid UUID;
ALTER TABLE IF EXISTS market_items ADD COLUMN IF NOT EXISTS entity_id UUID;
ALTER TABLE IF EXISTS market_items ALTER COLUMN entity_id SET DATA TYPE UUID USING entity_id::uuid;
ALTER TABLE IF EXISTS market_items ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE IF EXISTS market_items ADD COLUMN IF NOT EXISTS is_playground BOOLEAN DEFAULT false;

-- Data recovery for market
UPDATE market_items 
SET author_id = author_user_id::uuid 
WHERE author_id IS NULL 
  AND author_user_id IS NOT NULL 
  AND author_user_id::text ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';

UPDATE market_items SET author_name = seller WHERE author_name IS NULL AND seller IS NOT NULL;

-- 2. Enable RLS for Core Tables
ALTER TABLE IF EXISTS posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS market_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS market_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS profiles ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false;
ALTER TABLE IF EXISTS profiles ADD COLUMN IF NOT EXISTS primary_town TEXT;
ALTER TABLE IF EXISTS profiles ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE IF EXISTS profiles ADD COLUMN IF NOT EXISTS provinces JSONB DEFAULT '[]'::jsonb;
ALTER TABLE IF EXISTS profiles ADD COLUMN IF NOT EXISTS comarcas JSONB DEFAULT '[]'::jsonb;
ALTER TABLE IF EXISTS profiles ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE IF EXISTS profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
-- Update Role Constraint (Permissive during migration)
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check CHECK (role IS NULL OR role IN ('user', 'admin', 'ambassador', 'editor', 'vei', 'owner'));

ALTER TABLE IF EXISTS profiles ADD COLUMN IF NOT EXISTS is_ai BOOLEAN DEFAULT false;
ALTER TABLE IF EXISTS profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS entities ADD COLUMN IF NOT EXISTS is_ai BOOLEAN DEFAULT false;
ALTER TABLE IF EXISTS entities ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS messages ADD COLUMN IF NOT EXISTS is_ai BOOLEAN DEFAULT false;
ALTER TABLE IF EXISTS conversations ENABLE ROW LEVEL SECURITY;

-- 3. Recreate Policies with explicit casts
-- Posts
CREATE POLICY "Anyone can view posts" ON posts FOR SELECT USING (true);
CREATE POLICY "Users can manage their own posts" ON posts FOR ALL USING (auth.uid()::uuid = author_id::uuid);

-- Market Items
CREATE POLICY "Anyone can view active market market items" ON market_items FOR SELECT USING (is_active = true);
CREATE POLICY "Users can manage their own market items" ON market_items FOR ALL USING (auth.uid()::uuid = author_id::uuid);

-- Profiles
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid()::uuid = id::uuid);

-- Messages & Conversations
CREATE POLICY "Users can manage their own conversations" ON conversations FOR ALL 
USING (auth.uid()::uuid = participant_1_id::uuid OR auth.uid()::uuid = participant_2_id::uuid);

CREATE POLICY "Users can view their own messages" ON messages FOR SELECT 
USING (EXISTS (
    SELECT 1 FROM conversations 
    WHERE conversations.id = messages.conversation_id 
    AND (auth.uid()::uuid = conversations.participant_1_id::uuid OR auth.uid()::uuid = conversations.participant_2_id::uuid)
));

CREATE POLICY "Users can insert messages in their conversations" ON messages FOR INSERT 
WITH CHECK (EXISTS (
    SELECT 1 FROM conversations 
    WHERE conversations.id = messages.conversation_id 
    AND (auth.uid()::uuid = conversations.participant_1_id::uuid OR auth.uid()::uuid = conversations.participant_2_id::uuid)
));

-- 4. Enriched Views for Chat (Optimización Auditoría V3)
DROP VIEW IF EXISTS view_conversations_enriched CASCADE;
CREATE OR REPLACE VIEW view_conversations_enriched AS
SELECT 
    c.id,
    c.participant_1_id,
    c.participant_2_id,
    c.participant_1_type,
    c.participant_2_type,
    c.last_message_content,
    c.last_message_at,
    CASE 
        WHEN c.participant_1_type = 'user' THEN p1.full_name 
        ELSE e1.name 
    END as p1_name,
    CASE 
        WHEN c.participant_1_type = 'user' THEN p1.avatar_url 
        ELSE e1.avatar_url 
    END as p1_avatar_url,
    CASE 
        WHEN c.participant_2_type = 'user' THEN p2.full_name 
        ELSE e2.name 
    END as p2_name,
    CASE 
        WHEN c.participant_2_type = 'user' THEN p2.avatar_url 
        ELSE e2.avatar_url 
    END as p2_avatar_url,
    p1.role as p1_role,
    p2.role as p2_role,
    CASE 
        WHEN c.participant_1_type = 'user' THEN COALESCE(p1.is_ai, false)
        ELSE COALESCE(e1.is_ai, false)
    END as p1_is_ai,
    CASE 
        WHEN c.participant_2_type = 'user' THEN COALESCE(p2.is_ai, false)
        ELSE COALESCE(e2.is_ai, false)
    END as p2_is_ai
FROM conversations c
LEFT JOIN profiles p1 ON c.participant_1_id = p1.id AND c.participant_1_type = 'user'
LEFT JOIN entities e1 ON c.participant_1_id = e1.id AND c.participant_1_type = 'entity'
LEFT JOIN profiles p2 ON c.participant_2_id = p2.id AND c.participant_2_type = 'user'
LEFT JOIN entities e2 ON c.participant_2_id = e2.id AND c.participant_2_type = 'entity';

-- 5. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_posts_author_id ON posts(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_town_uuid ON posts(town_uuid);
CREATE INDEX IF NOT EXISTS idx_market_items_author_id ON market_items(author_id);
CREATE INDEX IF NOT EXISTS idx_market_items_town_uuid ON market_items(town_uuid);
CREATE INDEX IF NOT EXISTS idx_market_items_category ON market_items(category_slug);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_conversations_participants ON conversations(participant_1_id, participant_2_id);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);
-- 6. AI COMMUNITY AMBASSADORS (Lore NPCs)
-- Seeding essential characters to handle AI interactions in production
-- First, clear any existing profiles with these usernames to avoid O(1) conflicts
DELETE FROM profiles WHERE username IN (
    'vferris', 'lubelda', 'elenap', 'mariamel', 'marcs', 
    'samirm', 'andreus', 'beatrizo', 'joanets', 'carmenf', 
    'carlas', 'joanb'
) AND id::text NOT LIKE '11111111-1111-4111-a111-%';

INSERT INTO profiles (id, username, full_name, role, avatar_url, is_demo, is_ai, primary_town)
VALUES 
    ('11111111-1111-4111-a111-000000000001', 'vferris', 'Vicent Ferris', 'ambassador', '/images/demo/avatar_man_old.png', true, true, 'La Torre de les Maçanes'),
    ('11111111-1111-4111-a111-000000000002', 'lubelda', 'Lucía Belda', 'ambassador', '/images/demo/avatar_lucia.png', true, true, 'La Torre de les Maçanes'),
    ('11111111-1111-4111-a111-000000000003', 'elenap', 'Elena Popova', 'ambassador', '/images/demo/avatar_elena.png', true, true, 'La Torre de les Maçanes'),
    ('11111111-1111-4111-a111-000000000004', 'mariamel', 'Maria "Mèl"', 'ambassador', '/images/demo/avatar_mariamel.png', true, true, 'La Torre de les Maçanes'),
    ('11111111-1111-4111-a111-000000000005', 'marcs', 'Marc Sendra', 'ambassador', '/images/demo/avatar_marc.png', true, true, 'La Torre de les Maçanes'),
    ('11111111-1111-4111-a111-000000000006', 'samirm', 'Samir Mensah', 'ambassador', '/images/demo/avatar_samir.png', true, true, 'Muro d''Alcoi'),
    ('11111111-1111-4111-a111-000000000007', 'andreus', 'Andreu Soler', 'ambassador', '/images/demo/avatar_man_1.png', true, true, 'Muro d''Alcoi'),
    ('11111111-1111-4111-a111-000000000008', 'beatrizo', 'Beatriz Ortega', 'ambassador', '/images/demo/avatar_woman_1.png', true, true, 'Cocentaina'),
    ('11111111-1111-4111-a111-000000000009', 'joanets', 'Joanet Serra', 'ambassador', '/images/demo/avatar_joanet.png', true, true, 'Muro d''Alcoi'),
    ('11111111-1111-4111-a111-000000000010', 'carmenf', 'Carmen la del Forn', 'ambassador', '/images/demo/avatar_carmen.png', true, true, 'Relleu'),
    ('11111111-1111-4111-a111-000000000011', 'carlas', 'Carla Soriano', 'ambassador', '/images/demo/avatar_carla.png', true, true, 'Penàguila'),
    ('11111111-1111-4111-a111-000000000012', 'joanb', 'Joan Batiste', 'ambassador', '/images/demo/avatar_man_old.png', true, true, 'Benifallim')
ON CONFLICT (id) DO UPDATE 
SET 
    role = 'ambassador', 
    is_demo = true,
    is_ai = true,
    full_name = EXCLUDED.full_name,
    avatar_url = EXCLUDED.avatar_url,
    primary_town = EXCLUDED.primary_town;

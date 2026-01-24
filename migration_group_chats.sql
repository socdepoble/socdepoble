-- Migration: Group Chats System
-- Description: Creates tables and functions for group messaging (WhatsApp-style)

-- ============================================
-- 1. CREATE TABLES
-- ============================================

-- Group chats table
CREATE TABLE IF NOT EXISTS group_chats (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL CHECK (char_length(name) >= 1 AND char_length(name) <= 100),
    description TEXT,
    avatar_url TEXT,
    created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true,
    max_members INTEGER DEFAULT 256 CHECK (max_members > 0 AND max_members <= 1000),
    settings JSONB DEFAULT '{}'::jsonb
);

-- Group members table
CREATE TABLE IF NOT EXISTS group_members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    group_id UUID NOT NULL REFERENCES group_chats(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member')),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_read_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    notifications_enabled BOOLEAN DEFAULT true,
    UNIQUE(group_id, user_id)
);

-- ============================================
-- 2. MODIFY EXISTING TABLES
-- ============================================

-- Add group_id to messages table (nullable)
ALTER TABLE messages ADD COLUMN IF NOT EXISTS group_id UUID REFERENCES group_chats(id) ON DELETE CASCADE;

-- Add constraint: message must have either conversation_id OR group_id, not both
ALTER TABLE messages ADD CONSTRAINT IF NOT EXISTS messages_type_check 
    CHECK (
        (conversation_id IS NOT NULL AND group_id IS NULL) OR 
        (conversation_id IS NULL AND group_id IS NOT NULL)
    );

-- ============================================
-- 3. CREATE INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_group_chats_created_by ON group_chats(created_by);
CREATE INDEX IF NOT EXISTS idx_group_chats_is_active ON group_chats(is_active) WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_group_members_group ON group_members(group_id);
CREATE INDEX IF NOT EXISTS idx_group_members_user ON group_members(user_id);
CREATE INDEX IF NOT EXISTS idx_group_members_role ON group_members(role);

CREATE INDEX IF NOT EXISTS idx_messages_group_id ON messages(group_id) WHERE group_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_messages_group_created ON messages(group_id, created_at DESC);

-- ============================================
-- 4. ROW LEVEL SECURITY POLICIES
-- ============================================

-- Enable RLS
ALTER TABLE group_chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;

-- group_chats policies
CREATE POLICY "Users can view groups they are members of"
    ON group_chats FOR SELECT
    USING (
        id IN (
            SELECT group_id FROM group_members 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Any authenticated user can create a group"
    ON group_chats FOR INSERT
    WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Only group admins can update group"
    ON group_chats FOR UPDATE
    USING (
        id IN (
            SELECT group_id FROM group_members 
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Only group creator can delete group"
    ON group_chats FOR DELETE
    USING (created_by = auth.uid());

-- group_members policies
CREATE POLICY "Users can view members of their groups"
    ON group_members FOR SELECT
    USING (
        group_id IN (
            SELECT group_id FROM group_members 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Only admins can add members"
    ON group_members FOR INSERT
    WITH CHECK (
        group_id IN (
            SELECT group_id FROM group_members 
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Only admins can update member roles"
    ON group_members FOR UPDATE
    USING (
        group_id IN (
            SELECT group_id FROM group_members 
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admins can remove members OR users can leave"
    ON group_members FOR DELETE
    USING (
        user_id = auth.uid() OR -- User leaving
        group_id IN ( -- Admin removing
            SELECT group_id FROM group_members 
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- Update messages RLS for group messages
DROP POLICY IF EXISTS "Users can view messages in their conversations" ON messages;
CREATE POLICY "Users can view their messages"
    ON messages FOR SELECT
    USING (
        -- 1:1 conversation messages
        (conversation_id IN (
            SELECT id FROM conversations 
            WHERE participant_1_id = auth.uid() 
               OR participant_2_id = auth.uid()
        ))
        OR
        -- Group messages
        (group_id IN (
            SELECT group_id FROM group_members 
            WHERE user_id = auth.uid()
        ))
    );

DROP POLICY IF EXISTS "Users can send messages in their conversations" ON messages;
CREATE POLICY "Users can send messages"
    ON messages FOR INSERT
    WITH CHECK (
        sender_id = auth.uid() AND (
            -- 1:1 conversation
            (conversation_id IS NOT NULL AND conversation_id IN (
                SELECT id FROM conversations 
                WHERE participant_1_id = auth.uid() 
                   OR participant_2_id = auth.uid()
            ))
            OR
            -- Group message
            (group_id IS NOT NULL AND group_id IN (
                SELECT group_id FROM group_members 
                WHERE user_id = auth.uid()
            ))
        )
    );

-- ============================================
-- 5. FUNCTIONS
-- ============================================

-- Function to auto-add creator as admin when creating group
CREATE OR REPLACE FUNCTION add_creator_as_admin()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO group_members (group_id, user_id, role)
    VALUES (NEW.id, NEW.created_by, 'admin');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_group_created
    AFTER INSERT ON group_chats
    FOR EACH ROW
    EXECUTE FUNCTION add_creator_as_admin();

-- Function to update group's updated_at
CREATE OR REPLACE FUNCTION update_group_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE group_chats 
    SET updated_at = NOW() 
    WHERE id = NEW.group_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_group_message
    AFTER INSERT ON messages
    FOR EACH ROW
    WHEN (NEW.group_id IS NOT NULL)
    EXECUTE FUNCTION update_group_timestamp();

-- Function to get group info with member count
CREATE OR REPLACE FUNCTION get_group_with_stats(p_group_id UUID)
RETURNS TABLE (
    id UUID,
    name TEXT,
    description TEXT,
    avatar_url TEXT,
    created_by UUID,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN,
    member_count BIGINT,
    unread_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        g.id,
        g.name,
        g.description,
        g.avatar_url,
        g.created_by,
        g.created_at,
        g.updated_at,
        g.is_active,
        COUNT(DISTINCT gm.user_id) as member_count,
        COUNT(m.*) FILTER (
            WHERE m.created_at > COALESCE(
                (SELECT last_read_at FROM group_members 
                 WHERE group_id = g.id AND user_id = auth.uid()),
                '1970-01-01'::timestamp
            )
            AND m.sender_id != auth.uid()
        ) as unread_count
    FROM group_chats g
    LEFT JOIN group_members gm ON g.id = gm.group_id
    LEFT JOIN messages m ON g.id = m.group_id
    WHERE g.id = p_group_id
    GROUP BY g.id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 6. GRANT PERMISSIONS
-- ============================================

GRANT SELECT, INSERT, UPDATE, DELETE ON group_chats TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON group_members TO authenticated;

-- ============================================
-- 7. COMMENTS
-- ============================================

COMMENT ON TABLE group_chats IS 'Stores group chat metadata';
COMMENT ON TABLE group_members IS 'Stores group membership and roles';
COMMENT ON COLUMN messages.group_id IS 'References group chat if this is a group message';
COMMENT ON FUNCTION get_group_with_stats IS 'Returns group info with member and unread counts';

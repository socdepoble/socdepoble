-- Create entities table if it does not exist (needed for contextual UI / federation)
CREATE TABLE IF NOT EXISTS public.entities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    type TEXT,
    avatar_url TEXT,
    owner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    town_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ensure RLS is enabled
ALTER TABLE public.entities ENABLE ROW LEVEL SECURITY;

-- Create policies for entities
DO $$ BEGIN
    CREATE POLICY "Entities are viewable by everyone." 
      ON public.entities FOR SELECT USING (true);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Users can create their own entities." 
      ON public.entities FOR INSERT WITH CHECK (auth.uid() = owner_id);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Users can update their own entities." 
      ON public.entities FOR UPDATE USING (auth.uid() = owner_id);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create entity_members table if it does not exist
CREATE TABLE IF NOT EXISTS public.entity_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_id UUID REFERENCES public.entities(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'member',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ensure RLS is enabled
ALTER TABLE public.entity_members ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    CREATE POLICY "Entity members are viewable by everyone." 
      ON public.entity_members FOR SELECT USING (true);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Entity owners can manage members." 
      ON public.entity_members FOR ALL USING (
        EXISTS (
          SELECT 1 FROM public.entities 
          WHERE id = entity_id AND owner_id = auth.uid()
        )
      );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE OR REPLACE VIEW view_conversations_enriched AS
SELECT
  c.id,
  c.participant_1_id,
  c.participant_2_id,
  c.participant_1_type,
  c.participant_2_type,
  c.last_message_content,
  c.last_message_at,
  c.is_playground,
  
  -- Participant 1
  COALESCE(p1.full_name, e1.name) AS p1_name,
  COALESCE(p1.avatar_url, e1.avatar_url) AS p1_avatar_url,
  COALESCE(p1.role, e1.type) AS p1_role,
  COALESCE(p1.is_ai, false) AS p1_is_ai,
  
  -- Participant 2
  COALESCE(p2.full_name, e2.name) AS p2_name,
  COALESCE(p2.avatar_url, e2.avatar_url) AS p2_avatar_url,
  COALESCE(p2.role, e2.type) AS p2_role,
  COALESCE(p2.is_ai, false) AS p2_is_ai

FROM
  conversations c
LEFT JOIN profiles p1 ON c.participant_1_id = p1.id AND (c.participant_1_type = 'user' OR c.participant_1_type IS NULL)
LEFT JOIN entities e1 ON c.participant_1_id = e1.id AND c.participant_1_type = 'entity'

LEFT JOIN profiles p2 ON c.participant_2_id = p2.id AND (c.participant_2_type = 'user' OR c.participant_2_type IS NULL)
LEFT JOIN entities e2 ON c.participant_2_id = e2.id AND c.participant_2_type = 'entity';

-- Note: Ensure Supabase permissions allow reading from this view.
-- GRANT SELECT ON view_conversations_enriched TO authenticated;
-- GRANT SELECT ON view_conversations_enriched TO anon;

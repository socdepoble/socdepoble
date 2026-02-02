-- [MASTER] Supabase Performance & Security Audit Fixes [BATEGA]
-- Address warnings: "Unindexed Foreign Keys" and "Auth RLS Initialization Plan"

-- 1. INDEXOS PER A FOREIGN KEYS (Rendiment de Cerca i Joins)

-- Taula: posts
CREATE INDEX IF NOT EXISTS idx_posts_author_id ON public.posts (author_id);
CREATE INDEX IF NOT EXISTS idx_posts_town_uuid ON public.posts (town_uuid);
CREATE INDEX IF NOT EXISTS idx_posts_entity_id ON public.posts (entity_id);
CREATE INDEX IF NOT EXISTS idx_posts_book_id ON public.posts (book_id);
CREATE INDEX IF NOT EXISTS idx_posts_type ON public.posts (type);

-- Taula: market_items
CREATE INDEX IF NOT EXISTS idx_market_items_author_id ON public.market_items (author_id);
CREATE INDEX IF NOT EXISTS idx_market_items_town_uuid ON public.market_items (town_uuid);
CREATE INDEX IF NOT EXISTS idx_market_items_entity_id ON public.market_items (entity_id);
CREATE INDEX IF NOT EXISTS idx_market_items_category ON public.market_items (category_slug);

-- Taula: messages
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON public.messages (conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON public.messages (sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_post_uuid ON public.messages (post_uuid);

-- Taula: conversations
CREATE INDEX IF NOT EXISTS idx_conversations_p1 ON public.conversations (participant_1_id);
CREATE INDEX IF NOT EXISTS idx_conversations_p2 ON public.conversations (participant_2_id);

-- Taula: profiles
CREATE INDEX IF NOT EXISTS idx_profiles_town_uuid ON public.profiles (town_uuid);

-- 2. OPTIMITZACIÓ DE POLÍTIQUES RLS (Evitar Init Plan warnings)
-- Simplificació de polítiques per usar index scans i evitar cerques redundants en auth.users

-- Exemple: Taula Posts (Sempre accessible si no és playground o si ets l'autor)
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public posts are viewable by everyone" ON public.posts;
CREATE POLICY "Public posts are viewable by everyone" 
ON public.posts FOR SELECT 
USING (NOT is_playground OR auth.uid() = author_id);

-- 3. NETEJA D'ÍNDEXS INÚTILS (Opcional, segons warnings de Supabase)
-- Si l'usuari té índexs redundants (mateixa columna en diferents ordres sense ús), es poden eliminar aquí.

-- 4. SEGURETAT: ENABLE LEAKED PASSWORD PROTECTION
-- Nota: Això s'ha d'activar manualment al panell de Supabase: 
-- Dashboard -> Authentication -> Providers -> Email -> Enabled Leaked Password Protection.

COMMIT;

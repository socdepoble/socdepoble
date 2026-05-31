-- Migration: Database Scalability Indexes
-- Date: 2026-05-15
-- Description: Afegir índexs (B-Tree) als camps crítics per escalar a 100.000 usuaris sense penalitzar llegits i filtres.

-- 1. Indexació de market_items (Lectura intensiva per botiga)
CREATE INDEX IF NOT EXISTS idx_market_items_uuid ON public.market_items(uuid);
CREATE INDEX IF NOT EXISTS idx_market_items_author_user_id ON public.market_items(author_user_id);
CREATE INDEX IF NOT EXISTS idx_market_items_town_uuid ON public.market_items(town_uuid);
CREATE INDEX IF NOT EXISTS idx_market_items_status ON public.market_items(status);

-- 2. Indexació de posts (Feed social)
CREATE INDEX IF NOT EXISTS idx_posts_uuid ON public.posts(uuid);
CREATE INDEX IF NOT EXISTS idx_posts_author_user_id ON public.posts(author_user_id);
CREATE INDEX IF NOT EXISTS idx_posts_town_uuid ON public.posts(town_uuid);
CREATE INDEX IF NOT EXISTS idx_posts_status ON public.posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON public.posts(created_at DESC);

-- 3. Indexació de messages i conversations (Xat)
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_conversations_participant_1_id ON public.conversations(participant_1_id);
CREATE INDEX IF NOT EXISTS idx_conversations_participant_2_id ON public.conversations(participant_2_id);
CREATE INDEX IF NOT EXISTS idx_conversations_last_updated ON public.conversations(last_message_at DESC);

DO $$
BEGIN
    RAISE NOTICE 'Auditoria Escalabilitat: Índexs B-Tree creats correctament (Null-Safety and Perf Compliant).';
END
$$;

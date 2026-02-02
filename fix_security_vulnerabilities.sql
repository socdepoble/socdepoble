-- =========================================================
-- CORRECCIÓ DE VULNERABILITATS DE SEGURETAT (LINTER)
-- =========================================================

-- 1. Canviar SECURITY DEFINER a INVOKER en vistes
-- Això assegura que les vistes respectin les RLS de qui les consulta.

-- Vista: view_conversations_enriched
ALTER VIEW public.view_conversations_enriched SET (security_invoker = on);

-- Vista: media_attribution
ALTER VIEW public.media_attribution SET (security_invoker = on);

-- 2. Habilitar RLS en taula de logs de notificacions
ALTER TABLE public.push_notifications_log ENABLE ROW LEVEL SECURITY;

-- Crear política perquè només els admins o el sistema puguin veure els logs (o ningú des de l'API)
DO $$ BEGIN
    CREATE POLICY "Logs viewable by authenticated users" ON public.push_notifications_log
    FOR SELECT USING (auth.role() = 'authenticated');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. Crear taula connections (si encara no existeix pel 404 anterior)
CREATE TABLE IF NOT EXISTS public.connections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    follower_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    target_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'connected',
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(follower_id, target_id)
);

ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    CREATE POLICY "Connections are public" ON public.connections FOR SELECT USING (true);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Users can manage their own connections" ON public.connections
    FOR ALL USING (auth.uid() = follower_id);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

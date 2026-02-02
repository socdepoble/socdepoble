-- ==========================================
-- CREACIÓ DE LA TAULA DE CONNEXIONS (FOLLOWERS)
-- ==========================================

BEGIN;

CREATE TABLE IF NOT EXISTS connections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    follower_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    target_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'connected',
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(follower_id, target_id)
);

-- Index per a cerques ràpides de seguidors i seguits
CREATE INDEX IF NOT EXISTS idx_connections_follower ON connections(follower_id);
CREATE INDEX IF NOT EXISTS idx_connections_target ON connections(target_id);

-- Activar RLS
ALTER TABLE connections ENABLE ROW LEVEL SECURITY;

-- Polítiques
DROP POLICY IF EXISTS "Connexions visibles per a tothom" ON connections;
CREATE POLICY "Connexions visibles per a tothom" ON connections 
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Usuaris poden crear les seues pròpies connexions" ON connections;
CREATE POLICY "Usuaris poden crear les seues pròpies connexions" ON connections 
    FOR INSERT WITH CHECK (auth.uid() = follower_id);

DROP POLICY IF EXISTS "Usuaris poden esborrar les seues pròpies connexions" ON connections;
CREATE POLICY "Usuaris poden esborrar les seues pròpies connexions" ON connections 
    FOR DELETE USING (auth.uid() = follower_id);

COMMIT;

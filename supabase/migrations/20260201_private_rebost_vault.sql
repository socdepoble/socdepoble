-- [PRIVATE REBOST: SOBIRANIA TOTAL]
-- Extensió de la taula resources per a ús personal i privacitat local-first.

-- 1. Afegir columnes de propietat i privacitat
ALTER TABLE resources ADD COLUMN IF NOT EXISTS owner_id uuid REFERENCES profiles(id) ON DELETE CASCADE;
ALTER TABLE resources ADD COLUMN IF NOT EXISTS is_public boolean DEFAULT false;
ALTER TABLE resources ADD COLUMN IF NOT EXISTS scope text DEFAULT 'private'; -- 'private', 'group', 'public'
ALTER TABLE resources ADD COLUMN IF NOT EXISTS thumbnail_url text;
ALTER TABLE resources ADD COLUMN IF NOT EXISTS metadata jsonb DEFAULT '{}'; -- Per a guardar snapshots i dades extres de Raindrop

-- 2. Índexs per a velocitat de consulta personal
CREATE INDEX IF NOT EXISTS resources_owner_idx ON resources(owner_id);
CREATE INDEX IF NOT EXISTS resources_privacy_idx ON resources(is_public, scope);

-- 3. RLS: El més important del Local-First
-- Només el propietari pot veure els seus recursos privats.
-- Tothom pot veure recursos públics.
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Usuaris poden veure els seus propis recursos" ON resources;
CREATE POLICY "Usuaris poden veure els seus propis recursos" ON resources
    FOR SELECT USING (auth.uid() = owner_id OR is_public = true);

DROP POLICY IF EXISTS "Usuaris poden gestionar els seus propis recursos" ON resources;
CREATE POLICY "Usuaris poden gestionar els seus propis recursos" ON resources
    FOR ALL USING (auth.uid() = owner_id);

-- 4. Protocol Atum: Marcar dades per a la federació futura
COMMENT ON TABLE resources IS 'Magatzem sobirà de recursos i coneixement. Suporta importació de Raindrop.';

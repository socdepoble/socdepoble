-- =========================================================
-- SÓC DE POBLE: TAXONOMIA MASTER (WORDPRESS STYLE)
-- =========================================================

-- 1. Taula de Termes de Taxonomia
CREATE TABLE IF NOT EXISTS taxonomy_terms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('category', 'tag')),
    description TEXT,
    parent_id UUID REFERENCES taxonomy_terms(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(name, type),
    UNIQUE(slug, type)
);

-- 2. Taula de Relació (Post <-> Taxonomia)
CREATE TABLE IF NOT EXISTS post_taxonomy (
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    term_id UUID REFERENCES taxonomy_terms(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (post_id, term_id)
);

-- 3. Índexs per a rendiment
CREATE INDEX IF NOT EXISTS idx_taxonomy_terms_type_slug ON taxonomy_terms(type, slug);
CREATE INDEX IF NOT EXISTS idx_post_taxonomy_post_id ON post_taxonomy(post_id);
CREATE INDEX IF NOT EXISTS idx_post_taxonomy_term_id ON post_taxonomy(term_id);

-- 4. Seguretat RLS
ALTER TABLE taxonomy_terms ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_taxonomy ENABLE ROW LEVEL SECURITY;

-- Polítiques Lectura (Tothom)
CREATE POLICY "Public can view taxonomy terms" ON taxonomy_terms FOR SELECT USING (true);
CREATE POLICY "Public can view post taxonomy" ON post_taxonomy FOR SELECT USING (true);

-- Polítiques Escriptura (Només autenticats / Admins)
CREATE POLICY "Admins can manage taxonomy terms" ON taxonomy_terms 
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage post taxonomy" ON post_taxonomy 
    FOR ALL USING (auth.role() = 'authenticated');

-- 5. Llavors de Categories Bàsiques (Cànon Sóc de Poble)
INSERT INTO taxonomy_terms (name, slug, type, description) VALUES
('Oficial', 'oficial', 'category', 'Comunicats i anuncis de l''Ajuntament.'),
('Esdeveniments', 'esdeveniments', 'category', 'Festes, tallers i vida social.'),
('Mercat', 'mercat', 'category', 'Productes de proximitat i anuncis comercials.'),
('Cultura', 'cultura', 'category', 'Patrimoni, llengua i tradicions.'),
('Esports', 'esports', 'category', 'Activitat física i clubs locals.'),
('El Rentonar', 'el-rentonar', 'category', 'Cròniques i bategats de la terra.')
ON CONFLICT (slug, type) DO NOTHING;

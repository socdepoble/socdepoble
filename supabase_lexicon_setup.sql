-- =========================================================
-- SÓC DE POBLE: FASE 6 - PATRIMONIO CULTURAL (LÈXIC)
-- =========================================================

-- 1. Crear tabla 'lexicon'
CREATE TABLE IF NOT EXISTS lexicon (
    id SERIAL PRIMARY KEY,
    term TEXT NOT NULL,          -- La palabra o refrán
    definition TEXT NOT NULL,    -- Significado
    example TEXT,                -- Ejemplo de uso
    category TEXT NOT NULL CHECK (category IN ('paraula', 'dita')), -- Categoría
    town_id INTEGER REFERENCES towns(id) ON DELETE SET NULL, -- Referencia opcional a un pueblo
    user_id TEXT,                -- Autor (opcional, soporta modo demo con TEXT)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Habilitar seguridad RLS
ALTER TABLE lexicon ENABLE ROW LEVEL SECURITY;

-- 3. Políticas de acceso (Idempotente)
DO $$ 
BEGIN
    -- Lectura pública
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'lexicon' AND policyname = 'Public lexicon viewable by everyone') THEN
        CREATE POLICY "Public lexicon viewable by everyone" ON lexicon FOR SELECT USING (true);
    END IF;
    
    -- Escritura abierta (para demo y participación comunitaria)
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'lexicon' AND policyname = 'Anyone can insert lexicon') THEN
        CREATE POLICY "Anyone can insert lexicon" ON lexicon FOR INSERT WITH CHECK (true);
    END IF;
END $$;

-- 4. Datos iniciales (Seeding)
INSERT INTO lexicon (term, definition, example, category, town_id) 
VALUES 
('Mone', 'Vamos, expresión para animar a irse o empezar algo.', 'Xe xiquets, mone a casa que es fa tard.', 'paraula', NULL),
('Desficaci', 'Absurdo, disparate o hecho sin sentido.', 'Això que dius és un desficaci total.', 'paraula', NULL),
('A la taula i al llit al primer crit', 'Hay que ser puntual para comer y para dormir.', NULL, 'dita', NULL),
('Qui no guarda quan en té, no menja quan vol', 'Refrán sobre el ahorro y la previsión.', NULL, 'dita', NULL)
ON CONFLICT (id) DO NOTHING;

-- =========================================================
-- SÓC DE POBLE: INFRAESTRUCTURA CULTURAL (TOWNS & LEXICON) - LIMPIEZA Y FINAL
-- =========================================================

-- 1. Asegurar tabla Towns
CREATE TABLE IF NOT EXISTS towns (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

DO $$ 
BEGIN
    -- A. Limpiar duplicados antes de añadir UNIQUE
    -- Borramos las filas duplicadas manteniendo la que tenga el ID más bajo
    DELETE FROM towns a USING towns b
    WHERE a.id > b.id AND a.name = b.name;

    -- B. Asegurar columnas básicas
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'towns' AND column_name = 'region') THEN
        ALTER TABLE towns ADD COLUMN region TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'towns' AND column_name = 'image_url') THEN
        ALTER TABLE towns ADD COLUMN image_url TEXT;
    END IF;

    -- C. Asegurar restricción UNIQUE
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'towns_name_key' 
    ) THEN
        ALTER TABLE towns ADD CONSTRAINT towns_name_key UNIQUE (name);
    END IF;
END $$;

-- 2. Asegurar tabla Lexicon
CREATE TABLE IF NOT EXISTS lexicon (
    id SERIAL PRIMARY KEY,
    term TEXT NOT NULL,
    definition TEXT NOT NULL,
    example TEXT,
    town_id INTEGER REFERENCES towns(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    term_image TEXT
);

-- 3. Habilitar RLS y Políticas
-- Intentamos habilitar RLS (si falla porque ya está, no pasa nada)
ALTER TABLE towns ENABLE ROW LEVEL SECURITY;
ALTER TABLE lexicon ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'towns' AND policyname = 'Public towns are viewable by everyone') THEN
        CREATE POLICY "Public towns are viewable by everyone" ON towns FOR SELECT USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'lexicon' AND policyname = 'Public lexicon is viewable by everyone') THEN
        CREATE POLICY "Public lexicon is viewable by everyone" ON lexicon FOR SELECT USING (true);
    END IF;
END $$;

-- 4. Semilla inicial segura
INSERT INTO towns (name, region) 
VALUES ('Xixona', 'L''Alacantí'), ('Benicarló', 'Baix Maestrat')
ON CONFLICT (name) DO UPDATE SET region = EXCLUDED.region;

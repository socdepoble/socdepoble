-- Tabla para los Pueblos
CREATE TABLE IF NOT EXISTS towns (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    logo_url TEXT,
    image_url TEXT,
    population INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insertar datos iniciales de prueba
INSERT INTO towns (name, description, logo_url, population) 
VALUES 
('Altea', 'La cúpula del Mediterrani. Un poble amb encant, cases blanques i carrers empedrats.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Escut_d%27Altea.svg/1200px-Escut_d%27Altea.svg.png', 23000),
('Dénia', 'Capital de la Marina Alta. Famosa pel seu castell, el port i la seua gastronomia (la gamba roja).', 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Escudo_de_Denia.svg', 43000),
('Xàbia', 'On surt el sol a la Comunitat Valenciana. Amb cales impressionants i el Montgó dominant el paisatge.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Escut_de_X%C3%A0bia.svg/1200px-Escut_de_X%C3%A0bia.svg.png', 28000),
('Bocairent', 'Un poble tallat a la roca. Declarat conjunt historicoartístic nacional.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Escut_de_Bocairent.svg/1200px-Escut_de_Bocairent.svg.png', 4200)
ON CONFLICT (id) DO NOTHING;

-- Habilitar RLS
ALTER TABLE towns ENABLE ROW LEVEL SECURITY;

-- Política de lectura pública
CREATE POLICY "Public towns are viewable by everyone" ON towns
  FOR SELECT USING (true);

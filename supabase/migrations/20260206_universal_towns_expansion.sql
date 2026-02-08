-- [PHASE 10] EXPANSIÓ TERRITORIAL UNIVERSAL
-- Restauració de L'Alacantí i Sobirania de La Torre

-- 1. Assegurem que L'Alacantí existeix i té els seus pobles core
-- Actualitzem els pobles existents que sabem que són de l'Alacantí
UPDATE public.towns 
SET comarca = 'L''Alacantí', province = 'Alacant'
WHERE name ILIKE '%Torre de les Maçanes%' 
   OR name ILIKE '%Xixona%'
   OR name ILIKE '%Busot%'
   OR name ILIKE '%Aigües%';

-- 2. Afegim els municipis de L'Alacantí que falten per a que la comarca no estiga buida
INSERT INTO public.towns (name, comarca, province, activity)
VALUES 
('Alacant', 'L''Alacantí', 'Alacant', 0.8),
('Sant Vicent del Raspeig', 'L''Alacantí', 'Alacant', 0.6),
('El Campello', 'L''Alacantí', 'Alacant', 0.5),
('Sant Joan d''Alacant', 'L''Alacantí', 'Alacant', 0.5),
('Mutxamel', 'L''Alacantí', 'Alacant', 0.5),
('Agost', 'L''Alacantí', 'Alacant', 0.4)
ON CONFLICT (name) DO UPDATE SET comarca = 'L''Alacantí', province = 'Alacant';

-- 3. EXPANSIÓ NACIONAL (MOSTRA REPRESENTATIVA I INFRAESTRUCTURA)
-- Inserim capitals i pobles significatius per a la cerca universal
INSERT INTO public.towns (name, comarca, province, activity)
VALUES 
('Madrid', 'Área Metropolitana', 'Madrid', 1.0),
('Barcelona', 'Barcelonès', 'Barcelona', 1.0),
('València', 'L''Horta', 'València', 1.0),
('Sevilla', 'Área Metropolitana', 'Sevilla', 0.9),
('Zaragoza', 'Zaragoza', 'Zaragoza', 0.8),
('Málaga', 'Málaga', 'Málaga', 0.8),
('Murcia', 'Murcia', 'Murcia', 0.7),
('Palma', 'Mallorca', 'Illes Balears', 0.7),
('Las Palmas de Gran Canaria', 'Gran Canaria', 'Las Palmas', 0.7),
('Bilbao', 'Gran Bilbao', 'Bizkaia', 0.7)
ON CONFLICT (name) DO NOTHING;

-- 4. FIX LA TORRE (Canonical ID & Name)
-- Assegurem que existeix amb el nom correcte per evitar el loop del Ghost 51
INSERT INTO public.towns (id, name, comarca, province, activity, description)
VALUES (1, 'La Torre de les Maçanes', 'L''Alacantí', 'Alacant', 0.95, 'El cor bategant de Sóc de Poble.')
ON CONFLICT (id) DO UPDATE SET 
  name = 'La Torre de les Maçanes',
  comarca = 'L''Alacantí',
  province = 'Alacant',
  activity = 0.95;

-- 5. RLS PROTECCIÓ
ALTER TABLE public.towns ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public towns are viewable by everyone" ON public.towns;
CREATE POLICY "Public towns are viewable by everyone" ON public.towns FOR SELECT USING (true);

COMMENT ON TABLE towns IS 'Base de dades territorial bategant de Sóc de Poble.';

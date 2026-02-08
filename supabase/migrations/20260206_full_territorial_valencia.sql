-- Phase 19: Full Territorial Injection (Universal Coverage) [TEMP_TABLE_UPSERT]
-- [MASTER_INJECTION] CV Provinces, Comarcas & Sample Towns

-- 1. CREATE TEMPORARY STORAGE
CREATE TEMP TABLE temp_towns (
    name TEXT,
    province TEXT,
    comarca TEXT,
    description TEXT
);

-- 2. POPULATE TEMP DATA
INSERT INTO temp_towns (name, province, comarca, description) VALUES
('Alacant', 'Alacant', 'L''Alacantí', 'Capital de la província i cor de la xarxa.'),
('Elx', 'Alacant', 'Baix Vinalopó', 'Ciutat de les palmeres i bategat industrial.'),
('Dénia', 'Alacant', 'Marina Alta', 'Port de la Mediterrània i essència marinera.'),
('Benidorm', 'Alacant', 'Marina Baixa', 'Icona del turisme i motor econòmic.'),
('Alcoi', 'Alacant', 'L''Alcoià', 'Ciutat dels ponts i cor de la muntanya.'),
('Villena', 'Alacant', 'Alt Vinalopó', 'Castell i frontera de terres altes.'),
('Elda', 'Alacant', 'Vinalopó Mitjà', 'Tradició sabatera i empenta valenciana.'),
('Cocentaina', 'Alacant', 'El Comtat', 'Vila comtal i fira mil·lenària.'),
('Oriola', 'Alacant', 'Baix Segura', 'Horta i patrimoni al sud del mapa.'),
('Castelló de la Plana', 'Castelló', 'Plana Alta', 'Capital de la Plana i bressol de tradicions.'),
('Vila-real', 'Castelló', 'Plana Baixa', 'Ciutat de la ceràmica i l''esport.'),
('Vinaròs', 'Castelló', 'Baix Maestrat', 'Port del nord i llagostí de qualitat.'),
('Morella', 'Castelló', 'Els Ports', 'Muralles de memòria i fred de muntanya.'),
('Sogorb', 'Castelló', 'Alt Palància', 'Entrada de l''interior i tradició taronja.'),
('Llucena', 'Castelló', 'L''Alcalatén', 'Perla de la muntanya castellonenca.'),
('Albocàsser', 'Castelló', 'Alt Maestrat', 'Pedra i història al cor del Maestrat.'),
('Cirat', 'Castelló', 'Alt Millars', 'Racó d''aigua i pau de l''interior.'),
('València', 'València', 'València', 'Capital del Túria i mare de Sóc de Poble.'),
('Torrent', 'València', 'Horta Sud', 'Gran ciutat de l''Horta bategant.'),
('Paterna', 'València', 'Horta Nord', 'Cova, foc i modernitat industrial.'),
('Gandia', 'València', 'Safor', 'Ciutat ducal i platges blaves.'),
('Alzira', 'València', 'Ribera Alta', 'Illa del Xúquer i bressol taronja.'),
('Cullera', 'València', 'Ribera Baixa', 'Far de la Ribera i mar d''arròs.'),
('Sagunt', 'València', 'Camp de Morvedre', 'Port romà i acer de la història.'),
('Ontinyent', 'València', 'Vall d''Albaida', 'Tèxtil i pedra de la serra.'),
('Xàtiva', 'València', 'Costera', 'Castell del Papa i memòria cremada.'),
('Llíria', 'València', 'Camp de Túria', 'Ciutat de la música i terra d''ibers.'),
('Requena', 'València', 'Requena-Utiel', 'Vi, fred i frontera de l''altiplà.'),
('Xelva', 'València', 'Serrans', 'Aigua i tres cultures de muntanya.'),
('Ademús', 'València', 'Racó d''Ademús', 'Illa valenciana entre terres altes.'),
('Aiora', 'València', 'Vall de Cofrents-Aiora', 'Mel de muntanya i castells de frontera.'),
('Bunyol', 'València', 'Foia de Bunyol', 'Tomaca i música entre rojos.'),
('Enguera', 'València', 'Canal de Navarrés', 'Oliva i serra de la província.'),
('Iàtova', 'València', 'Foia de Bunyol', 'Natura viva al bategat d''interior.');

-- 3. UPDATE EXISTING RECORDS (Preserves IDs and relations)
UPDATE public.towns
SET 
    province = temp_towns.province,
    comarca = temp_towns.comarca,
    description = temp_towns.description
FROM temp_towns
WHERE public.towns.name = temp_towns.name;

-- 4. INSERT MISSING RECORDS
INSERT INTO public.towns (name, province, comarca, description)
SELECT name, province, comarca, description
FROM temp_towns
WHERE NOT EXISTS (
    SELECT 1 FROM public.towns WHERE public.towns.name = temp_towns.name
);

-- 5. CANONICAL FIX FOR LA TORRE (Ensure ID 1 consistency)
UPDATE public.towns 
SET name = 'La Torre de les Maçanes', comarca = 'L''Alacantí', province = 'Alacant', description = 'El cor bategant de Sóc de Poble.'
WHERE id = 1;

-- 6. CLEANUP
DROP TABLE temp_towns;

-- 7. INDEXES FOR SUPER-SEARCH
CREATE INDEX IF NOT EXISTS idx_towns_province ON towns(province);
CREATE INDEX IF NOT EXISTS idx_towns_comarca ON towns(comarca);

COMMENT ON TABLE towns IS 'Base de dades territorial bategant de Sóc de Poble amb cobertura total de la CV.';

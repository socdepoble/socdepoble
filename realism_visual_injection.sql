-- [PROTOCOL FLASH] INJECCIÓ DE REALISME VISUAL v1.0
-- Aquesta migració substitueix els placeholders per imatges reals de Wikipedia/Commons.

-- 1. La Torre de les Maçanes (El Mastre / Arrel)
UPDATE towns SET 
    logo_url = 'https://upload.wikimedia.org/wikipedia/commons/6/6f/Escut_de_la_Torre_de_les_Ma%C3%A7anes.svg',
    image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/La_Torre_de_les_Ma%C3%A7anes.jpg/1024px-La_Torre_de_les_Ma%C3%A7anes.jpg',
    description = 'Bressol de la Història. Terra del Pa Beneït i les Oliveres monumentals.'
WHERE name = 'La Torre de les Maçanes';

-- 2. Penàguila
UPDATE towns SET 
    logo_url = 'https://upload.wikimedia.org/wikipedia/commons/2/28/Escut_de_Pen%C3%A0guila.svg',
    image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Jard%C3%AD_de_Santos_%28Pen%C3%A0guila%29.JPG/1200px-Jard%C3%AD_de_Santos_%28Pen%C3%A0guila%29.JPG',
    description = 'El jardí amagat de la muntanya. Aigua i pedra.'
WHERE name = 'Penàguila';

-- 3. Xixona
UPDATE towns SET 
    logo_url = 'https://upload.wikimedia.org/wikipedia/commons/f/f6/Escut_de_Xixona.svg',
    image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Xixona_panoramica.jpg/1200px-Xixona_panoramica.jpg',
    description = 'El lloc més dolç del món. Bressol del torró.'
WHERE name = 'Xixona';

-- 4. Busot
UPDATE towns SET 
    logo_url = 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Escut_de_Busot.svg',
    image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Busot_i_el_Cabe%C3%A7%C3%B3_d%27Or.JPG/1200px-Busot_i_el_Cabe%C3%A7%C3%B3_d%27Or.JPG',
    description = 'A les faldes del Cabeçó d''Or. Coves i música.'
WHERE name = 'Busot';

-- 5. Relleu
UPDATE towns SET 
    logo_url = 'https://upload.wikimedia.org/wikipedia/commons/e/eb/Escut_de_Relleu.svg',
    image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Panta_de_Relleu.jpg/1200px-Panta_de_Relleu.jpg',
    description = 'Història gravada en pedra i aigua.'
WHERE name = 'Relleu';

-- 6. Alcoi
UPDATE towns SET 
    logo_url = 'https://upload.wikimedia.org/wikipedia/commons/c/cf/Coat_of_Arms_of_Alcoy.svg',
    image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Alcoi_panor%C3%A0mica.jpg/1200px-Alcoi_panor%C3%A0mica.jpg',
    description = 'Ciutat industrial i universitària, bressol del Serpis.'
WHERE name = 'Alcoi' OR name = 'Alcoy' OR name = 'Alcoi / Alcoy';

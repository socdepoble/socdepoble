-- OMEGA-31: CIRUGÍA FORENSE PARA CULLERA, TORRENT Y BENIALFAQUÍ
-- Corrige las desambiguaciones de Wikidata y el error tipográfico de "Beialfaquí"

DO $$ 
BEGIN

  -- 1. BENIALFAQUÍ (Corregimos el nombre roto 'Beialfaquí' y asignamos imagen como logo ante falta de escudo)
  UPDATE public.towns 
  SET 
    name = 'Benialfaquí',
    logo_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Planes_(la_Marina_Alta)%20-%20Benialfaqu%C3%AD.jpg',
    image_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Planes_(la_Marina_Alta)%20-%20Benialfaqu%C3%AD.jpg?width=800'
  WHERE name = 'Beialfaquí' OR name = 'Benialfaquí';

  -- 2. CULLERA (Escudo oficial y foto general, población real en 2023)
  UPDATE public.towns 
  SET 
    population = 23753,
    logo_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Escut_de_Cullera.svg',
    image_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Cullera_desde_el_castillo.jpg?width=800'
  WHERE name = 'Cullera';

  -- 3. TORRENT (Escudo oficial y foto de la Torre, población real en 2023)
  UPDATE public.towns 
  SET 
    population = 87158,
    logo_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Escut_de_Torrent.svg',
    image_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Torre_del_castell_de_Torrent.JPG?width=800'
  WHERE name = 'Torrent';

END $$;

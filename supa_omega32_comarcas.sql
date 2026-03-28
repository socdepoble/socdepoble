-- OMEGA-32: SANEAMIENTO FINAL DE COMARCAS FALTANTES
-- Asigna la correspondencia territorial oficial a los 5 pueblos que quedaron sin especificar ("Sense especificar").

DO $$
BEGIN

  -- 1. Benialfaquí -> Comtat (Pedanía de Planes)
  UPDATE public.towns 
  SET comarca = 'Comtat' 
  WHERE uuid = '0ceaad35-1b20-4ff4-8aad-43d506fa1acc';

  -- 2. Benifallim -> L'Alcoià
  UPDATE public.towns 
  SET comarca = 'L''Alcoià' 
  WHERE uuid = '0ad6c046-c2be-4bc4-ade6-97868a9d999e';

  -- 3. La Torre de les Maçanes -> L'Alacantí
  UPDATE public.towns 
  SET comarca = 'L''Alacantí' 
  WHERE uuid = 'edd2f840-f4af-414a-821c-ebb8b8b2a80a';

  -- 4. Penàguila -> L'Alcoià
  UPDATE public.towns 
  SET comarca = 'L''Alcoià' 
  WHERE uuid = 'e7f77180-b47a-41e4-ae81-ed45292f4154';

  -- 5. Xixona -> L'Alacantí
  UPDATE public.towns 
  SET comarca = 'L''Alacantí' 
  WHERE uuid = '2ce9ee32-4204-4742-8483-db9708751081';

END $$;

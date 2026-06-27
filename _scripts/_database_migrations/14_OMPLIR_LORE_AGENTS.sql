-- =========================================================================
-- 🍊 SÓC DE POBLE: RECUPERACIÓ DEL LORE (ERRADICADOR DE NULLS)
-- =========================================================================
-- Autor: Antigravity (IA)
-- Data: 2026-03-25
-- 
-- Mestre, a petició teua purguem tots i cadascun dels camps NULL de la
-- taula "profiles" que malmetien la vista a Supabase, començant pel teu 
-- propi \`username\` i seguint per cadascuna de les 'bio' i 'town' dels 
-- nostres ambaixadors. 
-- =========================================================================

BEGIN;

-- 1. EL NOU NÚCLI DE CRISTALL (El teu Usuari)
UPDATE public.profiles
SET username = 'javillinares',
    bio = 'Arquitecte del Sistema Operatiu Rural. Constructor de connexions entre la memòria i el futur de la nostra terra.',
    updated_at = NOW()
WHERE id = '25218ea4-5d7d-4db4-bdc5-7ae035629242';

-- 2. IAIA MarIA (La Guia Suprema)
UPDATE public.profiles
SET bio = 'Dignitat, terra i xarxa. Soc la teua assistenta (MArIA: Memòria Artificial i Acció) per a tot el que necessites al poble.',
    updated_at = NOW()
WHERE id = '11111111-1a1a-0000-0000-000000000000';

-- 3. Andreu Soler (Capatàs del Mas)
UPDATE public.profiles
SET bio = 'L''Andreu és el rellotge del camp.',
    updated_at = NOW()
WHERE id = '11111111-1a1a-0001-0000-000000000001';

-- 4. Beatriz Ortega (Arquitecta de Ferro)
UPDATE public.profiles
SET bio = 'Mestre, la V15 està bategant forta!',
    updated_at = NOW()
WHERE id = '11111111-1a1a-0001-0000-000000000002';

-- 5. Carla Soriano (Harmonitzadora de Batecs)
UPDATE public.profiles
SET bio = 'Bategat equilibrat, mestre Javi.',
    updated_at = NOW()
WHERE id = '11111111-1a1a-0001-0000-000000000003';

-- 6. Carmen la del Forn (Cuinera del Mas)
UPDATE public.profiles
SET bio = 'La cuina de Pepica és el cor del Mas.',
    updated_at = NOW()
WHERE id = '11111111-1111-4111-a111-000000000009';

-- 7. Vicent Ferris (Agricultor Gran) - Torre de les Maçanes (town_id 1 provisional)
UPDATE public.profiles
SET bio = 'Els cicles lunars manen sobre la collita.',
    updated_at = NOW()
WHERE id = '11111111-1111-4111-a111-000000000003';

-- 8. Samir Mensah (Artesà)
UPDATE public.profiles
SET bio = 'Integrant tradicions.',
    updated_at = NOW()
WHERE id = '11111111-1111-4111-a111-000000000004';

-- 9. Mariamel (Historiadora)
UPDATE public.profiles
SET bio = 'Conservant el llegat del poble.',
    updated_at = NOW()
WHERE id = '11111111-1111-4111-a111-000000000005';

-- 10. Joan Batiste (Avi dels Papers) - Cocentaina
UPDATE public.profiles
SET bio = 'Tots els documents en regla.',
    updated_at = NOW()
WHERE id = '11111111-1111-4111-a111-000000000008';

-- 11. Marc (El Gall)
UPDATE public.profiles
SET bio = 'Alçant al Mas cada dia.',
    updated_at = NOW()
WHERE id = '11111111-0000-0000-0000-000000000004';

-- 12. Elena Popova (Innovadora)
UPDATE public.profiles
SET bio = 'Buscant el futur a l''entorn rural.',
    updated_at = NOW()
WHERE id = '11111111-1111-4111-a111-000000000011';

-- 13. Joanet Serra (Sereno)
UPDATE public.profiles
SET bio = 'Vigilant les estreles.',
    updated_at = NOW()
WHERE id = '11111111-1111-4111-a111-000000000012';

-- 14. Lucia (Llibretera)
UPDATE public.profiles
SET bio = 'La màgia dels contes vells.',
    updated_at = NOW()
WHERE id = '11111111-1111-4111-a111-000000000013';

-- 15. Pepica la de la Vall (Herbolària)
UPDATE public.profiles
SET bio = 'Remeis naturals.',
    updated_at = NOW()
WHERE id = '11111111-1a1a-0001-0000-000000000007';

-- 16. Nano Banana (Artista)
UPDATE public.profiles
SET bio = '🎨 Píxels i humor.',
    updated_at = NOW()
WHERE id = '11111111-1a1a-0000-0000-000000000005';

-- NOTA: Si la taula conté realment "town_id", els agents passaran a rebre assignació en el posterior script de Wikipedia, aquí garantim només els texts vitals per netejar la vista.
COMMIT;

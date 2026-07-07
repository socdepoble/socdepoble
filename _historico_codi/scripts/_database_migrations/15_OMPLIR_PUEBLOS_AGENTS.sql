-- =========================================================================
-- 🏰 SÓC DE POBLE: DECRET D'ARRELAMENT (OFICIS I POBLES)
-- =========================================================================
-- Autor: Antigravity (IA)
-- Data: 2026-03-25
-- 
-- 1. CORONACIÓ DEL MESTRE: Se l'enlaira de 'vei' a 'official' i rep el 
-- poder absolut d''is_super_admin' (la meua errada va ser buscar is_admin).
--
-- 2. L'ARRELAMENT: Purga final de NULLs assignant el 'primary_town' i
-- l''ofici' als 15 membres de la cúpula de Sóc de Poble segons el Lore.
-- =========================================================================

BEGIN;

-- =========================================================================
-- 1. ASCENSIÓ A SUPER ADMINISTRADOR DEL CREADOR
-- =========================================================================
UPDATE public.profiles
SET is_super_admin = true,
    role = 'official',
    bio = 'Arquitecte de Sistema Operatiu Rural. Constructor de connexions entre la memòria i el futur de la nostra terra.',
    updated_at = NOW()
WHERE id = '25218ea4-5d7d-4db4-bdc5-7ae035629242';


-- =========================================================================
-- 2. REPARTIMENT GEOPOLÍTIC DELS AGENTS DEL LORE
-- =========================================================================

-- IAIA MarIA (La Guia Suprema)
UPDATE public.profiles
SET primary_town = 'Sóc de Poble (Global)',
    ofici = 'Matriarca Digital',
    is_ai = true,
    updated_at = NOW()
WHERE id = '11111111-1a1a-0000-0000-000000000000';

-- Andreu Soler
UPDATE public.profiles
SET primary_town = 'La Torre de les Maçanes',
    ofici = 'Capatàs del Mas',
    is_ai = true,
    updated_at = NOW()
WHERE id = '11111111-1a1a-0001-0000-000000000001';

-- Beatriz Ortega
UPDATE public.profiles
SET primary_town = 'Global',
    ofici = 'Arquitecta de Ferro',
    is_ai = true,
    updated_at = NOW()
WHERE id = '11111111-1a1a-0001-0000-000000000002';

-- Carla Soriano
UPDATE public.profiles
SET primary_town = 'Ibi',
    ofici = 'Harmonitzadora de Batecs',
    is_ai = true,
    updated_at = NOW()
WHERE id = '11111111-1a1a-0001-0000-000000000003';

-- Carmen la del Forn
UPDATE public.profiles
SET primary_town = 'La Torre de les Maçanes',
    ofici = 'Cuinera del Mas',
    is_ai = true,
    updated_at = NOW()
WHERE id = '11111111-1111-4111-a111-000000000009';

-- Vicent Ferris
UPDATE public.profiles
SET primary_town = 'La Torre de les Maçanes',
    ofici = 'Agricultor Gran',
    is_ai = true,
    updated_at = NOW()
WHERE id = '11111111-1111-4111-a111-000000000003';

-- Samir Mensah
UPDATE public.profiles
SET primary_town = 'Ibi',
    ofici = 'Artesà',
    is_ai = true,
    updated_at = NOW()
WHERE id = '11111111-1111-4111-a111-000000000004';

-- Mariamel
UPDATE public.profiles
SET primary_town = 'Muro',
    ofici = 'Historiadora',
    is_ai = true,
    updated_at = NOW()
WHERE id = '11111111-1111-4111-a111-000000000005';

-- Joan Batiste
UPDATE public.profiles
SET primary_town = 'Cocentaina',
    ofici = 'Arxiver',
    is_ai = true,
    updated_at = NOW()
WHERE id = '11111111-1111-4111-a111-000000000008';

-- Marc (El Gall)
UPDATE public.profiles
SET primary_town = 'Global',
    ofici = 'Alertes Globals',
    is_ai = true,
    updated_at = NOW()
WHERE id = '11111111-0000-0000-0000-000000000004';

-- Elena Popova
UPDATE public.profiles
SET primary_town = 'Agost',
    ofici = 'Innovadora',
    is_ai = true,
    updated_at = NOW()
WHERE id = '11111111-1111-4111-a111-000000000011';

-- Joanet Serra
UPDATE public.profiles
SET primary_town = 'Relleu',
    ofici = 'Sereno',
    is_ai = true,
    updated_at = NOW()
WHERE id = '11111111-1111-4111-a111-000000000012';

-- Lucia
UPDATE public.profiles
SET primary_town = 'Banyeres',
    ofici = 'Llibretera',
    is_ai = true,
    updated_at = NOW()
WHERE id = '11111111-1111-4111-a111-000000000013';

-- Pepica la de la Vall
UPDATE public.profiles
SET primary_town = 'La Vall',
    ofici = 'Herbolària',
    is_ai = true,
    updated_at = NOW()
WHERE id = '11111111-1a1a-0001-0000-000000000007';

-- Nano Banana
UPDATE public.profiles
SET primary_town = 'Global',
    ofici = 'Artista T.I.A.',
    is_ai = true,
    updated_at = NOW()
WHERE id = '11111111-1a1a-0000-0000-000000000005';

COMMIT;

-- Propòsit: Actualitzar els avatars dels usuaris fundadors per usar els assets locals en lloc de les URLs de Google.

UPDATE public.profiles
SET avatar_url = '/assets/mock-data/avatars/javi_llinares.jpg'
WHERE username = 'javillinares';

UPDATE public.profiles
SET avatar_url = '/assets/mock-data/avatars/nando_llinares.png'
WHERE username = 'nandollinares';

UPDATE public.profiles
SET avatar_url = '/assets/mock-data/avatars/damia_llorens.jpg'
WHERE username = 'damiallorens';

-- Netejar l'avatar_override de user_realms per a aquests usuaris si en tenen, perquè use l'avatar_url del profile.
UPDATE public.user_realms
SET avatar_override = ''
WHERE user_id IN (
    SELECT id FROM public.profiles WHERE username IN ('javillinares', 'nandollinares', 'damiallorens')
);

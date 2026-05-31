-- Migration: Update Roles, Covers, and Social Preferences
-- Date: 2026-05-07

-- 0. FIX Avatar per a Damià (el script anterior feia servir 'damiallorens' però és 'damianllorens')
UPDATE public.profiles
SET avatar_url = '/assets/mock-data/avatars/damia_llorens.jpg'
WHERE username = 'damianllorens';

-- 1. Roles: Set 'superadmin' for founders (Damià and Javi)
-- Note: 'foraster' is an unauthenticated state, not a DB role.
-- 'veí' (or 'user') is standard, but founders must be superadmin.
UPDATE public.profiles
SET role = 'superadmin'
WHERE username IN ('javillinares', 'damianllorens');

-- 2. Covers: Contextual covers based on primary_town_text or username
-- Relleu
UPDATE public.profiles
SET cover_url = '/assets/places/nano_relleu.png'
WHERE primary_town_text = 'Relleu';

-- La Torre de les Maçanes
UPDATE public.profiles
SET cover_url = '/assets/brand/img_la_torre_de_les_ma_anes_main.jpg'
WHERE primary_town_text = 'La Torre de les Maçanes';

-- Benimassot
UPDATE public.profiles
SET cover_url = '/assets/brand/img_benimassot_main.jpg'
WHERE primary_town_text = 'Benimassot';

-- Penàguila
UPDATE public.profiles
SET cover_url = '/assets/brand/img_pen_guila_main.jpg'
WHERE primary_town_text = 'Penàguila';

-- Javi (Avatar as Cover)
UPDATE public.profiles
SET cover_url = '/assets/mock-data/avatars/javi_llinares.jpg'
WHERE username = 'javillinares';

-- 3. Social Image Preference: Complete the data (no 'none')
-- Give 'cover' preference to those with custom covers, and 'avatar' to the rest.
UPDATE public.profiles
SET social_image_preference = 
    CASE 
        WHEN cover_url LIKE '/assets/brand/%' OR cover_url LIKE '/assets/places/%' THEN 'cover'
        ELSE 'avatar'
    END;

-- Migration: RBAC Architecture Redesign (Trellat Hardening)
-- Date: 2026-05-07

-- 1. Destrucció de la Constraint antiga per permetre els nous rols
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;

-- 2. Migració massiva de rols antics als nous rols de la jerarquia
-- a. Oficials passen a ser 'admin' o si és IAIA, 'admin'
UPDATE public.profiles 
SET role = 'admin' 
WHERE role = 'official';

-- b. Ambaixadors passen a ser 'town_coordinator' (Així ho tenen els IA_Agents regionals)
UPDATE public.profiles 
SET role = 'town_coordinator' 
WHERE role = 'ambassador';

-- c. Qualsevol 'superadmin' passa al correcte format 'super_admin'
UPDATE public.profiles 
SET role = 'super_admin' 
WHERE role = 'superadmin';

-- d. Unificar 'user', 'guest', o nuls cap al nou estàndard 'vei'
UPDATE public.profiles 
SET role = 'vei' 
WHERE role IN ('user', 'guest') OR role IS NULL;

-- 3. Assegurar Super Admin pels fundadors (I la seua foto i avatar correctes)
UPDATE public.profiles
SET role = 'super_admin',
    avatar_url = '/assets/mock-data/avatars/damia_llorens.jpg'
WHERE username = 'damianllorens';

UPDATE public.profiles
SET role = 'super_admin',
    cover_url = '/assets/mock-data/avatars/javi_llinares.jpg'
WHERE username = 'javillinares';

-- 4. Afegir la Nova Check Constraint Estricta
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check 
CHECK (role IN (
    'vei', 
    'group_coordinator', 
    'town_coordinator', 
    'region_coordinator', 
    'admin', 
    'super_admin'
));

-- 5. Consolidació Visual Final (Covers)
UPDATE public.profiles SET cover_url = '/assets/places/nano_relleu.png' WHERE primary_town = 'Relleu';
UPDATE public.profiles SET cover_url = '/assets/brand/img_la_torre_de_les_ma_anes_main.jpg' WHERE primary_town = 'La Torre de les Maçanes';
UPDATE public.profiles SET cover_url = '/assets/brand/img_benimassot_main.jpg' WHERE primary_town = 'Benimassot';
UPDATE public.profiles SET cover_url = '/assets/brand/img_pen_guila_main.jpg' WHERE primary_town = 'Penàguila';

-- Resoldre social_image_preference ('none' a 'avatar' o 'cover')
UPDATE public.profiles
SET social_image_preference = 
    CASE 
        WHEN cover_url LIKE '/assets/brand/%' OR cover_url LIKE '/assets/places/%' THEN 'cover'
        ELSE 'avatar'
    END
WHERE social_image_preference IS NULL OR social_image_preference = 'none';


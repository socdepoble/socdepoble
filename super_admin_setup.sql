-- =========================================================
-- SÓC DE POBLE: SUPER ADMIN SETUP (CORRECTED)
-- =========================================================

-- 1. Assegurar que la columna 'role' existeix i permet 'super_admin'
-- Si tenies un CHECK constraint anterior (profiles_role_check o similar), 
-- el borrem per poder actualitzar el domini de valors.
DO $$ 
BEGIN
    -- Intentem borrar el constraint si existeix (el nom sol ser taula_columna_check)
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'profiles_role_check') THEN
        ALTER TABLE public.profiles DROP CONSTRAINT profiles_role_check;
    END IF;
END $$;

-- 2. Afegir el nou CHECK constraint que inclou 'super_admin'
-- Això permet que el camp 'role' accepte el valor de Super Admin.
ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_role_check 
CHECK (role IN ('gent', 'grup', 'empresa', 'vei', 'super_admin', 'administrador', 'comerciant'));

-- 3. Promoure l'usuari a Super Admin
-- Aquest script ja té el teu correu configurat.
UPDATE public.profiles 
SET role = 'super_admin' 
WHERE id = (SELECT id FROM auth.users WHERE email = 'socdepoblecom@gmail.com');

-- 4. Verificació final
-- Si tot va bé, veuràs el teu nom i el rol 'super_admin' als resultats.
SELECT p.full_name, p.role, u.email 
FROM public.profiles p
JOIN auth.users u ON p.id = u.id
WHERE u.email = 'socdepoblecom@gmail.com';

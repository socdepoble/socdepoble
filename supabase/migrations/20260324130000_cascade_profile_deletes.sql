-- Script per afegir ON DELETE CASCADE a totes les relacions amb 'profiles' i 'auth.users'
-- Ajudarà a eliminar ghost profiles (com el de222f44-32f7-4cf2-b000-f0da3f036bad) de forma neta sense errors de referència forana.

BEGIN;

-- 1. Assegurem que profiles esborre si s'esborra l'auth.user
DO $$
DECLARE
    profiles_fk_name text;
BEGIN
    SELECT constraint_name INTO profiles_fk_name 
    FROM information_schema.table_constraints 
    WHERE table_name = 'profiles' AND constraint_type = 'FOREIGN KEY';

    IF profiles_fk_name IS NOT NULL THEN
        EXECUTE 'ALTER TABLE public.profiles DROP CONSTRAINT ' || profiles_fk_name;
        EXECUTE 'ALTER TABLE public.profiles ADD CONSTRAINT ' || profiles_fk_name || ' FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE';
    ELSE
        -- Fallback si no es troba pel discovery automàtic
        ALTER TABLE public.profiles 
        ADD CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
EXCEPTION WHEN others THEN
    RAISE NOTICE 'Error fixant FK de auth.users: %', SQLERRM;
END $$;

-- 2. Afegim ON DELETE CASCADE a totes les taules que referencien public.profiles (messages, posts, connections, etc.)
DO $$
DECLARE
    r record;
BEGIN
    FOR r IN (
        SELECT
            tc.table_name,
            tc.constraint_name,
            kcu.column_name,
            ccu.table_name AS foreign_table_name,
            ccu.column_name AS foreign_column_name
        FROM information_schema.table_constraints AS tc
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
        JOIN information_schema.constraint_column_usage AS ccu
          ON ccu.constraint_name = tc.constraint_name
        WHERE tc.constraint_type = 'FOREIGN KEY' AND ccu.table_name = 'profiles' AND tc.table_schema = 'public'
    ) LOOP
        BEGIN
            EXECUTE format('ALTER TABLE public.%I DROP CONSTRAINT %I', r.table_name, r.constraint_name);
            EXECUTE format('ALTER TABLE public.%I ADD CONSTRAINT %I FOREIGN KEY (%I) REFERENCES public.%I(%I) ON DELETE CASCADE', 
                r.table_name, r.constraint_name, r.column_name, r.foreign_table_name, r.foreign_column_name);
            RAISE NOTICE 'Updated constraint on table %', r.table_name;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Skipping constraint % on % due to error: %', r.constraint_name, r.table_name, SQLERRM;
        END;
    END LOOP;
END;
$$;

COMMIT;

-- ==============================================================================
-- UN COP EXECUTAT EL SCRIPT, POTS BORRAR EL USUARI AMB L'EQUIP (ID: de222f44...)
-- EN EL SQL EDITOR O EN LA TAULA D'AUTH NATURA SENSE QUE DONI ERROR DE CONFLICTE.
-- ==============================================================================

-- PRIVACITAT GLOBAL: PROTOCOL D'ESBORRAMENT EN CASCADA (GDPR)
-- 
-- Aquest script examina màgicament totes les taules de la base de dades que apunten cap a `profiles` 
-- (posts, messages, entities, likes, etc.) i substitueix la restricció restrictiva inicial 
-- (que impedia eixir o esborrar un compte) per una restricció 'ON DELETE CASCADE'.
--
-- D'aquesta manera, quan algú esborre un perfil, s'emportarà per davant tota la brossa connectada,
-- habilitant automàticament l'esborrat natiu del Supabase UI. Adéu al bloqueig del fantasma.

DO $$ 
DECLARE 
    r RECORD;
    v_sql TEXT;
BEGIN
    FOR r IN 
        SELECT 
            tc.table_schema, 
            tc.table_name, 
            tc.constraint_name,
            kcu.column_name
        FROM information_schema.table_constraints AS tc 
        JOIN information_schema.key_column_usage AS kcu
            ON tc.constraint_name = kcu.constraint_name
            AND tc.table_schema = kcu.table_schema
        JOIN information_schema.constraint_column_usage AS ccu
            ON ccu.constraint_name = tc.constraint_name
            AND ccu.table_schema = tc.table_schema
        WHERE tc.constraint_type = 'FOREIGN KEY' 
            AND ccu.table_name = 'profiles'
    LOOP
        -- 1. Tallem i eliminem el mur restrictiu de l'antiga Foreign Key
        v_sql := 'ALTER TABLE ' || quote_ident(r.table_schema) || '.' || quote_ident(r.table_name) || 
                 ' DROP CONSTRAINT ' || quote_ident(r.constraint_name);
        EXECUTE v_sql;
                
        -- 2. Clavem la nova porta darrere que obri el col·lapse en cascada (CASCADE DELETE)
        v_sql := 'ALTER TABLE ' || quote_ident(r.table_schema) || '.' || quote_ident(r.table_name) || 
                 ' ADD CONSTRAINT ' || quote_ident(r.constraint_name) || 
                 ' FOREIGN KEY (' || quote_ident(r.column_name) || ') ' ||
                 ' REFERENCES public.profiles(id) ON DELETE CASCADE';
        EXECUTE v_sql;
    END LOOP;
END $$;

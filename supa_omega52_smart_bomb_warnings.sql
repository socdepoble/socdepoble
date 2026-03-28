-- ==============================================================================
-- 💣 OMEGA-52: THE SMART BOMB (Caza de Funciones Camufladas)
-- ==============================================================================
-- OMEGA-51 falló porque las funciones (como omega_seed_store_translations) 
-- no están vacías (). Tienen argumentos ocultos que no conocemos (UUIDs, JSONs, etc).
-- Este script es una Bomba Inteligente: buscará en el CORE de Postgres (pg_proc)
-- cualquier función que contenga estos nombres, extraerá automáticamente todos
-- sus parámetros sea cual sea el tipo, y le inyectará el search_path.
-- 
-- Un misil que no falla porque le pregunta la matrícula a la propia base de datos.
-- ==============================================================================

DO $$ 
DECLARE
    func RECORD;
    found int := 0;
BEGIN
    RAISE NOTICE '⚡ [OMEGA-52] Desplegando radar de funciones con argumentos ocultos...';

    FOR func IN 
        SELECT p.oid::regprocedure AS sig, p.proname
        FROM pg_proc p
        JOIN pg_namespace n ON p.pronamespace = n.oid
        WHERE n.nspname = 'public'
          AND (
               p.proname LIKE '%omega_seed_store_translations%' 
            OR p.proname LIKE '%omega_set_default_realm_id%'
            OR p.proname LIKE '%sanitize_posts_content_trigger%'
          )
    LOOP
        -- Construye el ALTER FUNCTION con los argumentos exactos devueltos por la BD
        EXECUTE 'ALTER FUNCTION ' || func.sig || ' SET search_path = public';
        RAISE NOTICE '   ✅ BINGO! Función cazada y parcheada: %', func.sig;
        found := found + 1;
    END LOOP;

    IF found = 0 THEN
        RAISE NOTICE '🟡 Radar finalizado. No se encontró ninguna función en public con esos nombres exactos (revisa el esquema en Supabase).';
    ELSE
        RAISE NOTICE '✨ [OMEGA-52] Smart Bomb ejecutada. % funciones blindadas. Refresca el panel.', found;
    END IF;

EXCEPTION WHEN OTHERS THEN
    RAISE EXCEPTION '❌ Error al inyectar search_path con la Smart Bomb: % (Firma intentada: %)', SQLERRM, func.sig;
END $$;

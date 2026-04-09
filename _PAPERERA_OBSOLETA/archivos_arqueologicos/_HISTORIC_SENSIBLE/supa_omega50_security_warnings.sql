-- ==============================================================================
-- 🛡️ OMEGA-50: SELLO DE SEGURIDAD (SEARCH PATH)
-- ==============================================================================
-- Cierra las advertencias "Function Search Path Volatile" del Security Advisor.
--
-- Postgres requiere que las funciones expuestas a la API o usadas en triggers
-- declaren explícitamente su esquema de contexto (search_path) para
-- evitar inyecciones de código.
-- 
-- Usamos SQL dinámico avanzado para buscar estas funciones por su nombre 
-- y aplicarles el parche de seguridad de forma quirúrgica sin romper su cuerpo.
-- ==============================================================================

DO $$ 
DECLARE
    func RECORD;
    functions_to_patch text[] := ARRAY[
        'omega_seed_store_translations', 
        'omega_set_default_realm_id',
        'sanitize_html',
        'sanitize_posts_content_trigger'
    ];
    patched_count int := 0;
BEGIN
    RAISE NOTICE '⚡ [OMEGA-50] Iniciando escaneo de funciones volátiles...';

    FOR func IN 
        SELECT p.oid::regprocedure AS sig
        FROM pg_proc p
        JOIN pg_namespace n ON p.pronamespace = n.oid
        WHERE n.nspname = 'public'
          AND p.proname = ANY(functions_to_patch)
    LOOP
        -- Se inyecta la configuración SET search_path = public a la definición actual
        EXECUTE 'ALTER FUNCTION ' || func.sig || ' SET search_path = public';
        RAISE NOTICE '   ✅ Vulnerabilidad sellada en: %', func.sig;
        patched_count := patched_count + 1;
    END LOOP;

    IF patched_count > 0 THEN
        RAISE NOTICE '✨ [OMEGA-50] Misión cumplida. % funciones blindadas. Security Advisor volverá al verde.', patched_count;
    ELSE
        RAISE NOTICE '🟡 No se han encontrado las funciones. Puede que ya estuvieran eliminadas o bajo otro esquema.';
    END IF;

EXCEPTION WHEN OTHERS THEN
    RAISE EXCEPTION '❌ Error inyectando search_path: %', SQLERRM;
END $$;

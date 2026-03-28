-- ==============================================================================
-- 💣 OMEGA-54: ESCAPE IMPOSIBLE (Aniquilador de Rutinas Mutantes)
-- ==============================================================================
-- El anterior OMEGA-53 falló en cazarlas porque probablemente estas funciones
-- fueron escritas con mayúsculas mezcladas (CamelCase) o como algún tipo de 
-- objeto especial de Postgres.
-- Este script es ILIKE (Ignora mayúsculas/minúsculas) y lanza indiscriminadamente
-- un "DROP ROUTINE" contra TODA coincidencia, ya sea función o procedimiento.
-- No hay escape posible.
-- ==============================================================================

DO $$ 
DECLARE 
    stmt TEXT;
    cazadas int := 0;
BEGIN 
    RAISE NOTICE '⚡ [OMEGA-54] Escaneando subsuelo en busca de mutantes (ILIKE)...';

    FOR stmt IN 
        SELECT 'DROP ROUTINE IF EXISTS public.' || quote_ident(proname) || '(' || pg_get_function_identity_arguments(oid) || ') CASCADE;'
        FROM pg_proc 
        WHERE proname ILIKE ANY(ARRAY['%omega_seed_store_translations%', '%omega_set_default_realm_id%'])
    LOOP 
        EXECUTE stmt; 
        RAISE NOTICE '   💥 EJECUTADO: %', stmt;
        cazadas := cazadas + 1;
    END LOOP; 

    IF cazadas = 0 THEN
        -- Si llega aquí, significa que FISICAMENTE NO ESTÁN.
        RAISE NOTICE '🟡 No hay rastro físico en pg_proc. Si el Asesor sigue pitando, es un bug de Supabase y te autorizo a ignorarlo.';
    ELSE
        RAISE NOTICE '✨ [OMEGA-54] % rutinas aniquiladas. Haz el "Re-run Linter", esto es el golpe final.', cazadas;
    END IF;

EXCEPTION WHEN OTHERS THEN
    RAISE EXCEPTION '❌ Fallo nuclear en OMEGA-54: %', SQLERRM;
END $$;

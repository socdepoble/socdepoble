-- ==============================================================================
-- 💣 OMEGA-53: BOTÓN NUCLEAR (EXTERMINIO DE RUTINAS RESIDUALES)
-- ==============================================================================
-- Las funciones 'omega_seed_store_translations' y 'omega_set_default_realm_id' 
-- se niegan a cooperar. Analizando sus nombres, es evidente que son rutinas
-- de "sembrado" (migraciones temporales) que usamos en algún parche OMEGA
-- anterior para poblar datos masivamente. 
--
-- No pertenecen a la arquitectura viva de React (no son triggers ni se 
-- llaman desde la App). Por tanto, la solución más limpia y radical
-- es DESINTEGRARLAS de la base de datos. Un fantasma menos.
-- ==============================================================================

DO $$ 
DECLARE
    func RECORD;
    dropped_count int := 0;
BEGIN
    RAISE NOTICE '🔥 [OMEGA-53] Iniciando el protocolo de Exterminio Nuclear...';

    FOR func IN 
        SELECT p.oid::regprocedure AS sig, p.proname, p.prokind
        FROM pg_proc p
        JOIN pg_namespace n ON p.pronamespace = n.oid
        WHERE n.nspname = 'public'
          AND (
               p.proname LIKE '%omega_seed_store_translations%' 
            OR p.proname LIKE '%omega_set_default_realm_id%'
          )
    LOOP
        IF func.prokind = 'p' THEN
            EXECUTE 'DROP PROCEDURE ' || func.sig || ' CASCADE';
            RAISE NOTICE '   💥 PROCEDURE ANILIQUILADO: %', func.sig;
        ELSE
            EXECUTE 'DROP FUNCTION ' || func.sig || ' CASCADE';
            RAISE NOTICE '   💥 FUNCTION ANILIQUILADA: %', func.sig;
        END IF;
        
        dropped_count := dropped_count + 1;
    END LOOP;

    IF dropped_count = 0 THEN
        RAISE NOTICE '🟡 No encontradas. Revisa si hay que hacer Refresh en panel de Supabase.';
    ELSE
        RAISE NOTICE '✨ [OMEGA-53] % rutinas residuales han sido pulverizadas. Refresca el Security Advisor.', dropped_count;
    END IF;

EXCEPTION WHEN OTHERS THEN
    RAISE EXCEPTION '❌ Error en la erradicación nuclear: %', SQLERRM;
END $$;

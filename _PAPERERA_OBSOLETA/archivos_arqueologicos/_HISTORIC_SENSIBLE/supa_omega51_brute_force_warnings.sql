-- ==============================================================================
-- 💣 OMEGA-51: FUERZA BRUTA A LOS WARNINGS REBELDES
-- ==============================================================================
-- El script dinámico OMEGA-50 eliminó los errores genéricos pero se le
-- escaparon estas 3 funciones rebeldes (probablemente porque son Triggers o
-- funciones de autosembrado sin argumentos que pg_proc ignora).
-- Aquí no hay piedad. Aplicamos la asignación de contexto `search_path=public`
-- a machete directo.
-- ==============================================================================

DO $$ 
BEGIN
    -- 1. Disparo directo a la función de traducciones
    ALTER FUNCTION public.omega_seed_store_translations() SET search_path = public;
    RAISE NOTICE '✅ omega_seed_store_translations blindada.';

    -- 2. Disparo directo a la función de reinos
    ALTER FUNCTION public.omega_set_default_realm_id() SET search_path = public;
    RAISE NOTICE '✅ omega_set_default_realm_id blindada.';

    -- 3. Disparo directo al Trigger de Posts (Confirmado sin argumentos por ser Trigger)
    ALTER FUNCTION public.sanitize_posts_content_trigger() SET search_path = public;
    RAISE NOTICE '✅ sanitize_posts_content_trigger blindada.';

    RAISE NOTICE '✨ [OMEGA-51] La trinidad rebelde ha caído. Refresca el panel y verás la Gloria.';

EXCEPTION WHEN OTHERS THEN
    RAISE EXCEPTION '❌ Error en la implantación OMEGA-51 (Puede que alguna función necesite un argumento que desconocemos): %', SQLERRM;
END $$;

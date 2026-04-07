-- =========================================================================================
-- SÓC DE POBLE - PROTOCOLO DE AUDITORÍA EXTREMA: PURGA DE FANTASMAS WIKIMEDIA (404 / COEP)
-- =========================================================================================
-- Misión: Erradicar todos los enlaces huérfanos y rotos provenientes de Wikimedia Commons
-- que estaban inundando la consola de producción con errores 404 y bloqueos CORS/COEP.
-- Al ponerlos a NULL, el motor nativo del Frontend activará instantáneamente los
-- Fallbacks de "Trellat" (Nano Banana), manteniendo la consola impecable.
-- =========================================================================================

DO $$ 
DECLARE
    purged_realms INT := 0;
    purged_towns INT := 0;
BEGIN
    RAISE NOTICE '[AUDITORÍA EXTREMA] Iniciando purga de enlaces fantasma de Wikimedia...';

    -- 1. SANEAR TABLA REALMS (El Aleph Moderno)
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'realms') THEN
        UPDATE public.realms
        SET 
            logo_url = NULL
        WHERE logo_url LIKE '%wikimedia.org%';
        GET DIAGNOSTICS purged_realms = ROW_COUNT;
    END IF;

    -- 2. SANEAR TABLA TOWNS (Legado / Sincronización)
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'towns') THEN
        UPDATE public.towns
        SET 
            logo_url = NULL
        WHERE logo_url LIKE '%wikimedia.org%';
        GET DIAGNOSTICS purged_towns = ROW_COUNT;

        UPDATE public.towns
        SET 
            image_url = NULL
        WHERE image_url LIKE '%wikimedia.org%';
        GET DIAGNOSTICS purged_towns = ROW_COUNT;
    END IF;

    -- 3. SANEAR TABLA PROFILES (Por si algún avatar arrastró enlaces)
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN
        UPDATE public.profiles
        SET 
            avatar_url = NULL
        WHERE avatar_url LIKE '%wikimedia.org%';
    END IF;

    RAISE NOTICE '[AUDITORÍA EXTREMA COMPLETA] Se han purgado recursos fantasma en % Reinos y % Pueblos.', purged_realms, purged_towns;
    RAISE NOTICE '[INFO] El front-end ahora usará los fallbacks nativos (Nano Banana) sin escupir errores 404 en consola.';
END $$;

-- ==============================================================================
-- OMEGA-41: ERRADICACIÓN DE NULOS EN MEDIA_ASSETS
-- ==============================================================================
-- Aplica la "Ley de 0 Nulos" a la tabla media_assets.
-- Convierte los archivos originales en "padres de sí mismos" (parent_id = id)
-- para evitar el uso del valor NULL en la jerarquía de recortes (crops).
-- ==============================================================================

DO $$ 
BEGIN
    RAISE NOTICE '⚡ [OMEGA-41] Iniciando protocolo de purga de Nulos en media_assets...';

    -- 1. Actualizar los registros existentes para que su parent_id apunte a ellos mismos
    UPDATE public.media_assets 
    SET parent_id = id 
    WHERE parent_id IS NULL;
    
    RAISE NOTICE '   ✅ Registros huérfanos asimilados (parent_id = id).';

    -- 2. Blindar la columna para que jamás vuelva a admitir un NULL
    ALTER TABLE public.media_assets 
    ALTER COLUMN parent_id SET NOT NULL;
    
    RAISE NOTICE '   ✅ Columna constraint NOT NULL inyectada.';

    -- 3. Crear el Escudo Activo (Trigger) para futuras inserciones
    CREATE OR REPLACE FUNCTION public.omega_set_default_parent_id()
    RETURNS TRIGGER AS $func$
    BEGIN
        IF NEW.parent_id IS NULL THEN
            NEW.parent_id := NEW.id;
        END IF;
        RETURN NEW;
    END;
    $func$ LANGUAGE plpgsql SECURITY DEFINER;

    DROP TRIGGER IF EXISTS trigger_omega_media_parent_id ON public.media_assets;
    CREATE TRIGGER trigger_omega_media_parent_id
    BEFORE INSERT ON public.media_assets
    FOR EACH ROW 
    EXECUTE FUNCTION public.omega_set_default_parent_id();

    RAISE NOTICE '   ✅ Sistema Inmunitario (Trigger) activado contra futuros NULLs.';
    RAISE NOTICE '✨ [OMEGA-41] Tabla media_assets purificada con éxito.';

EXCEPTION WHEN OTHERS THEN
    RAISE EXCEPTION '❌ Error en la implantación OMEGA-41: %', SQLERRM;
END $$;

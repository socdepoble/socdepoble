-- ==============================================================================
-- OMEGA-40: INVALIDACIÓN DE TRADUCCIONES CACHEADAS ESTRUCTURAL
-- ==============================================================================
-- Este parche despliega un Trigger nativo de Supabase que elimina 
-- automáticamente cualquier traducción obsoleta de `post_translations`
-- en el momento exacto en el que el autor edita el contenido del post original.
-- Blindaje máximo: Si muta el origen, muere la copia.
-- ==============================================================================

DO $$ 
BEGIN
    RAISE NOTICE '⚡ [OMEGA-40] Desplegando Sistema Inmunitario de Traducciones...';

    -- 1. Crear la función del Trigger Invalidador
    CREATE OR REPLACE FUNCTION public.omega_invalidate_stale_translations()
    RETURNS TRIGGER AS $func$
    BEGIN
        -- Si el contenido ha mutado, purgamos las traducciones cacheadas
        IF OLD.content IS DISTINCT FROM NEW.content THEN
            DELETE FROM public.post_translations WHERE post_id = NEW.uuid;
            RAISE USING MESSAGE = 'Traducciones eliminadas para el post mutado: ' || NEW.uuid;
        END IF;
        RETURN NEW;
    END;
    $func$ LANGUAGE plpgsql SECURITY DEFINER;

    -- 2. Vincular el Trigger a la tabla posts
    DROP TRIGGER IF EXISTS trigger_omega_translation_invalidator ON public.posts;
    
    CREATE TRIGGER trigger_omega_translation_invalidator
    AFTER UPDATE OF content ON public.posts
    FOR EACH ROW 
    EXECUTE FUNCTION public.omega_invalidate_stale_translations();

    RAISE NOTICE '   ✅ Trigger de invalidación enganchado a public.posts';
    RAISE NOTICE '✨ [OMEGA-40] Backend blindado. Los posts editados ahora destruirán automáticamente sus traducciones huérfanas.';

EXCEPTION WHEN OTHERS THEN
    RAISE EXCEPTION '❌ Error en la implantación OMEGA-40: %', SQLERRM;
END $$;

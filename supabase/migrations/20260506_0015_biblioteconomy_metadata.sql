-- ==============================================================================
-- SÓC DE POBLE: Universal Metadata Matrix (Biblioteconomy & Deep OS/Tech Data)
-- Timestamp: 2026-05-06 00:15
-- Category: Architecture / CMS Media Management
-- Description: Implementa els tres grans pilars de metadades per garantir la preservació de dades a nivell universitari (Dublin Core, EXIF/XMP/Affinity, OS).
-- ==============================================================================

BEGIN;

-- 1. Tech Metadata (Substitueix/Expandix l'anterior exif_data)
-- Aquest camp emmagatzemarà EXIF de càmera, dades XMP, perfils ICC, dimensions i dades específiques de programes com Affinity (capes, historial, spreads).
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='media_assets' AND column_name='exif_data') THEN
        ALTER TABLE public.media_assets RENAME COLUMN exif_data TO tech_metadata;
    ELSE
        ALTER TABLE public.media_assets ADD COLUMN IF NOT EXISTS tech_metadata JSONB DEFAULT '{}'::jsonb;
    END IF;
END $$;

-- 2. OS Metadata (Sistema d'Arxius)
-- Emmagatzema dates de disc (creació/modificació reals del fitxer), etiquetes del Finder i permisos.
ALTER TABLE public.media_assets ADD COLUMN IF NOT EXISTS os_metadata JSONB DEFAULT '{}'::jsonb;

-- 3. Biblio Metadata (Dublin Core / Rigor Universitari)
-- Emmagatzema Title, Creator, Subject, Description, Publisher, Date, Type, Identifier, Rights. Crític per a llibres i publicacions SOSP.
ALTER TABLE public.media_assets ADD COLUMN IF NOT EXISTS biblio_metadata JSONB DEFAULT '{}'::jsonb;

-- Assegurem la termodinàmica i la sincronització de l'índex per al front-end
ALTER TABLE public.media_assets ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Codi per associar el trigger d'updated_at si la funció handle_updated_at() existeix
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'handle_updated_at') THEN
        DROP TRIGGER IF EXISTS handle_media_assets_updated_at ON public.media_assets;
        CREATE TRIGGER handle_media_assets_updated_at
            BEFORE UPDATE ON public.media_assets
            FOR EACH ROW
            EXECUTE FUNCTION public.handle_updated_at();
    END IF;
END
$$;

COMMIT;

-- ==============================================================================
-- SÓC DE POBLE: Media Assets Metadata Hardening
-- Timestamp: 2026-05-05 23:55
-- Category: Architecture / CMS Media Management
-- Description: Afegeix camps estructurats (JSONB) per a l'emmagatzematge de 
-- metadades profundes (EXIF, Dimensions, Color Space, etc.) a media_assets.
-- ==============================================================================

BEGIN;

-- Assegurem que la taula de media_assets té els camps necessaris per al CMS
-- S'empra JSONB per permetre estructures flexibles (ex. EXIF diferent per imatge/vídeo)

-- 1. Dades Fotogràfiques i Tècniques (Resolució, Perfil de Color, Dimensions)
ALTER TABLE public.media_assets ADD COLUMN IF NOT EXISTS exif_data JSONB DEFAULT '{}'::jsonb;

-- 2. Dades del Sistema d'Arxius (Modificació, Creació de contingut, Etiquetes de l'OS)
ALTER TABLE public.media_assets ADD COLUMN IF NOT EXISTS os_metadata JSONB DEFAULT '{}'::jsonb;

-- 3. Assegurar termodinàmica en els assets
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

DO $$
BEGIN
    RAISE NOTICE 'Media Assets Hardening complete. EXIF and OS Metadata JSONB columns added successfully.';
END
$$;

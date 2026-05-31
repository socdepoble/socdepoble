-- ==============================================================================
-- MIGRACIÓ: Automatització de Slugs SEO per a Posts
-- DATA: 2026-05-15
-- AUTOR: VISOR NANO
-- DESCRIPCIÓ: Afegeix un trigger per generar slugs SEO de forma automàtica basat 
--             en el títol SEO usant l'extensió unaccent, i fa un backfill als existents.
-- ==============================================================================

-- 1. Activar l'extensió unaccent per netejar accents
CREATE EXTENSION IF NOT EXISTS unaccent;

-- 2. Crear funció Pl/pgSQL per automatitzar la generació de slug
CREATE OR REPLACE FUNCTION public.generate_post_slug()
RETURNS TRIGGER AS $$
DECLARE
    base_slug TEXT;
BEGIN
    -- Només generar si el slug està buit o és NULL
    IF NEW.slug IS NULL OR NEW.slug = 'EMPTY' THEN
        -- Extraiem un text base del seo_title, amb fallback a 'post'
        base_slug := COALESCE(NULLIF(TRIM(NEW.seo_title), 'EMPTY'), 'post');
        
        -- Passem a minúscules, llevem accents i eliminem caràcters no alfanumèrics substituint-los per guions
        base_slug := lower(regexp_replace(unaccent(base_slug), '[^a-zA-Z0-9]+', '-', 'g'));
        
        -- Llevem els guions inicials i finals per evitar '-titol-'
        base_slug := trim(both '-' from base_slug);
        
        -- Afegim un hash curt (8 primers caràcters del id) per garantir unicitat absoluta
        NEW.slug := base_slug || '-' || left(NEW.id::text, 8);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Crear el Trigger sobre la taula posts
DROP TRIGGER IF EXISTS trg_generate_post_slug ON public.posts;

CREATE TRIGGER trg_generate_post_slug
BEFORE INSERT OR UPDATE ON public.posts
FOR EACH ROW
EXECUTE FUNCTION public.generate_post_slug();

-- 4. Backfill (Actualització massiva) per aplicar el trigger a tots els nulls
-- Obliguem a un UPDATE sobre les files orfes per tal que el trigger actue
UPDATE public.posts SET slug = NULL WHERE slug IS NULL OR slug = 'EMPTY';

-- 5. Blindatge Fanàtic: Impedir futurs NULLs a la base de dades
DO $$
BEGIN
    ALTER TABLE public.posts ALTER COLUMN slug SET NOT NULL;
EXCEPTION
    WHEN others THEN
        RAISE NOTICE 'No s''ha pogut imposar la constraint NOT NULL al slug de posts: %', SQLERRM;
END $$;

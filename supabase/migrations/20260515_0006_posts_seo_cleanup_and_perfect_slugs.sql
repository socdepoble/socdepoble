-- ==============================================================================
-- MIGRACIÓ: Neteja SEO de Posts i Slugs d'Estil WordPress
-- DATA: 2026-05-15
-- AUTOR: VISOR NANO
-- DESCRIPCIÓ: Neteja markdown dels seo_descriptions i refactoritza els slugs 
--             perquè siguen nets (sense codis UUID) aplicant sufixos seqüencials 
--             només en cas de col·lisió (com fa WordPress).
-- ==============================================================================

-- 1. Netejar asteriscos de Markdown a seo_description
-- Substituïm '**' per res, i després '*' per res.
UPDATE public.posts
SET seo_description = REPLACE(REPLACE(seo_description, '**', ''), '*', '')
WHERE seo_description LIKE '%*%';

-- 2. Refactoritzar la funció generadora de slugs
CREATE OR REPLACE FUNCTION public.generate_post_slug()
RETURNS TRIGGER AS $$
DECLARE
    base_slug TEXT;
    candidate_slug TEXT;
    counter INT := 1;
BEGIN
    -- Només generar si el slug està buit, és NULL o estem forçant la regeneració
    IF NEW.slug IS NULL OR NEW.slug = 'EMPTY' OR NEW.slug = '' THEN
        -- Extraiem un text base del seo_title, amb fallback a 'post'
        base_slug := COALESCE(NULLIF(TRIM(NEW.seo_title), 'EMPTY'), 'post');
        
        -- Passem a minúscules, llevem accents i eliminem caràcters no alfanumèrics substituint-los per guions
        base_slug := lower(regexp_replace(unaccent(base_slug), '[^a-zA-Z0-9]+', '-', 'g'));
        
        -- Llevem els guions inicials i finals per evitar '-titol-'
        base_slug := trim(both '-' from base_slug);
        
        -- Comencem provant el slug completament net
        candidate_slug := base_slug;
        
        -- Bucle de comprovació: si el slug ja està ocupat per un altre post (id diferent), incrementem el comptador
        WHILE EXISTS (SELECT 1 FROM public.posts WHERE slug = candidate_slug AND id != NEW.id) LOOP
            counter := counter + 1;
            candidate_slug := base_slug || '-' || counter::text;
        END LOOP;
        
        -- Assignem el slug lliure trobat
        NEW.slug := candidate_slug;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- El trigger 'trg_generate_post_slug' ja existeix de la migració anterior, 
-- s'executarà automàticament usant aquesta nova versió de la funció.

-- 3. Backfill (Re-generació Massiva)
-- Posar els slugs a NULL forçarà el trigger a regenerar-los tots de zero
-- de manera ordenada i neta, aplicant l'estratègia del comptador a les col·lisions.
UPDATE public.posts SET slug = NULL;

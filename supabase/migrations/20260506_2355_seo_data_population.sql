-- Migration: 20260506_2355_seo_data_population.sql
-- Propòsit: Auto-generar contingut SEO de qualitat (Títols, Descripcions i Keywords) per a les entrades existents a la base de dades.

BEGIN;

-- ======================================================================
-- 1. POBLAR SEO DE POBLES (TOWNS)
-- ======================================================================
UPDATE public.towns
SET 
    seo_title = COALESCE(seo_title, name || ' - Sóc de Poble | Descobreix l''essència rural'),
    seo_description = COALESCE(seo_description, 
        CASE 
            WHEN description IS NOT NULL AND length(description) > 10 THEN substring(description from 1 for 155) || '...'
            ELSE 'Descobreix ' || name || ' a Sóc de Poble. Connecta amb la gent, les tradicions i el comerç local. Viu el batec del nostre territori.'
        END),
    seo_keywords = COALESCE(seo_keywords, lower(name) || ', poble, comarques, territori, turisme rural, producte local, tradició, sóc de poble')
WHERE seo_title IS NULL OR seo_description IS NULL;


-- ======================================================================
-- 2. POBLAR SEO DE PUBLICACIONS (POSTS)
-- ======================================================================
-- Com els posts no solen tindre títol curt, utilitzem l'autor i un fragment
UPDATE public.posts
SET 
    seo_title = COALESCE(seo_title, 'Publicació de ' || COALESCE(author_role, 'un veí') || ' - Sóc de Poble'),
    seo_description = COALESCE(seo_description, 
        CASE 
            WHEN content IS NOT NULL AND length(content) > 10 THEN substring(content from 1 for 155) || '...'
            ELSE 'Llig les últimes notícies, històries i converses del poble.'
        END),
    seo_keywords = COALESCE(seo_keywords, 'publicació, fòrum rural, notícies del poble, sóc de poble, comunitat')
WHERE seo_title IS NULL OR seo_description IS NULL;


-- ======================================================================
-- 3. POBLAR SEO DE MERCAT (MARKET_ITEMS)
-- ======================================================================
UPDATE public.market_items
SET 
    seo_title = COALESCE(seo_title, title || ' - Mercat de Sóc de Poble'),
    seo_description = COALESCE(seo_description, 
        CASE 
            WHEN description IS NOT NULL AND length(description) > 10 THEN substring(description from 1 for 155) || '...'
            ELSE 'Compra ' || title || ' directament als productors i artesans locals. Comerç just i de proximitat.'
        END),
    seo_keywords = COALESCE(seo_keywords, lower(title) || ', mercat local, producte artesanal, comerç de proximitat, km0, sóc de poble')
WHERE seo_title IS NULL OR seo_description IS NULL;


-- ======================================================================
-- 4. POBLAR SEO D'ENTITATS (ENTITIES)
-- ======================================================================
UPDATE public.entities
SET 
    seo_title = COALESCE(seo_title, name || ' - Entitat a Sóc de Poble'),
    seo_description = COALESCE(seo_description, 
        CASE 
            WHEN type IS NOT NULL THEN name || ' és ' || type || ' activa a la comunitat de Sóc de Poble. Descobreix el seu impacte.'
            ELSE 'Descobreix la informació i activitat de ' || name || ' a la xarxa de Sóc de Poble.'
        END),
    seo_keywords = COALESCE(seo_keywords, lower(name) || ', entitat, associació, negoci local, directori rural, sóc de poble')
WHERE seo_title IS NULL OR seo_description IS NULL;

COMMIT;

DO $$
BEGIN
    RAISE NOTICE 'SEO Data Population Complete! All tables have intelligent SEO fallback content.';
END $$;

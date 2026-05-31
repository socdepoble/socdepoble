-- Migration: 20260506_2215_towns_assets_architecture.sql
-- Propòsit: Preparar la taula `towns` per a funcionar de forma 100% offline
-- reanomenant el camp del logo de l'ajuntament a `escudo_url` i afegint els camps
-- de perfil visuals d'alta qualitat (`avatar_url` i `cover_url`). Totes les
-- dependències externes (com Wikipedia) són eliminades.

DO $$
BEGIN
    -- 1. Renomenar image_url a escudo_url si no s'ha fet ja
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='towns' AND column_name='image_url') THEN
        ALTER TABLE public.towns RENAME COLUMN image_url TO escudo_url;
    END IF;

    -- 2. Afegir avatar_url
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='towns' AND column_name='avatar_url') THEN
        ALTER TABLE public.towns ADD COLUMN avatar_url TEXT DEFAULT 'EMPTY';
    END IF;

    -- 3. Afegir cover_url
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='towns' AND column_name='cover_url') THEN
        ALTER TABLE public.towns ADD COLUMN cover_url TEXT DEFAULT 'EMPTY';
    END IF;

    -- 4. Convertir rutes a format local (Neteja URLs de Wikipedia)
    -- Generarà rutes com: /assets/images/towns/valència_escudo.jpg
    UPDATE public.towns
    SET 
        escudo_url = '/assets/images/towns/' || REPLACE(LOWER(name), ' ', '_') || '_escudo.jpg',
        avatar_url = '/assets/images/towns/' || REPLACE(LOWER(name), ' ', '_') || '_avatar.jpg',
        cover_url = '/assets/images/towns/' || REPLACE(LOWER(name), ' ', '_') || '_cover.jpg'
    WHERE escudo_url LIKE 'http%' OR avatar_url = 'EMPTY' OR cover_url = 'EMPTY' OR escudo_url = 'EMPTY';

    RAISE NOTICE 'Taula towns migrada a arquitectura offline-first d''assets amb èxit.';

EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Error during towns assets migration: %', SQLERRM;
END $$;

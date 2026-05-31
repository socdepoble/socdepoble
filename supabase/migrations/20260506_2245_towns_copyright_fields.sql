-- Migration: 20260506_2245_towns_copyright_fields.sql
-- Propòsit: Renomenar el camp obsolet `logo_url` (que contenia l'enllaç de Wikipedia) 
-- a `copy_img` i afegir `copy_texto` per complir amb les atribucions de llicència (Trellat).

DO $$
BEGIN
    -- 1. Renomenar logo_url a copy_img
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='towns' AND column_name='logo_url') THEN
        ALTER TABLE public.towns RENAME COLUMN logo_url TO copy_img;
    END IF;

    -- 2. Afegir camp per a copy_texto (Enllaç a l'article de Wikipedia per atribució)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='towns' AND column_name='copy_texto') THEN
        ALTER TABLE public.towns ADD COLUMN copy_texto TEXT DEFAULT 'EMPTY';
    END IF;

    RAISE NOTICE 'Camps de copyright de towns actualitzats amb èxit.';

EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Error during towns copyright migration: %', SQLERRM;
END $$;

-- Migration: 20260507_0030_rename_fictitious_to_real.sql
-- Propòsit: Per lògica d'arquitectura humana, invertim la bandera is_fictitious
-- per is_real. Ara, els humans/entitats reals són "true" i els agents IA "false".

BEGIN;

-- ======================================================================
-- 1. REBATEJAR LA COLUMNA
-- ======================================================================
ALTER TABLE public.entities RENAME COLUMN is_fictitious TO is_real;

-- ======================================================================
-- 2. INVERTIR ELS VALORS (LÒGICA HUMANA)
-- ======================================================================
-- Abans: is_fictitious = true (Fals/IA) i false (Real/Humà)
-- Ara: is_real = false (Fals/IA) i true (Real/Humà)
UPDATE public.entities SET is_real = NOT is_real;

-- ======================================================================
-- 3. ESTABLIR EL NOU VALOR PER DEFECTE
-- ======================================================================
-- A partir d'ara, si es crea una entitat nova sense especificar-ho, s'entén que és real
ALTER TABLE public.entities ALTER COLUMN is_real SET DEFAULT true;

COMMIT;

DO $$
BEGIN
    RAISE NOTICE 'Canvi de semàntica aplicat: "is_fictitious" ha estat reemplaçat per "is_real". Humans = true, IA = false.';
END $$;

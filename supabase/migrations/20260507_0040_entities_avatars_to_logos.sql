-- Migration: 20260507_0040_entities_avatars_to_logos.sql
-- Propòsit: Corregir els avatars de Sóc de Poble i El Rentonar per a què siguen
-- els seus logos institucionals i no imatges d'agents o personatges (IAIA/Joan Batiste).

BEGIN;

-- ======================================================================
-- 1. ACTUALITZACIÓ DE SÓC DE POBLE (Logo)
-- ======================================================================
UPDATE public.entities 
SET 
  avatar_url = 'assets/brand/logos/logo-socdepoble-cuadrat-verd.svg'
WHERE name = 'Sóc de Poble';


-- ======================================================================
-- 2. ACTUALITZACIÓ D'EL RENTONAR (Logo)
-- ======================================================================
UPDATE public.entities 
SET 
  avatar_url = 'assets/brand/logos/rentonar_logo.png'
WHERE name = 'El Rentonar';

COMMIT;

DO $$
BEGIN
    RAISE NOTICE 'S''han corregit els avatars institucionals de Sóc de Poble i El Rentonar.';
END $$;

-- Migration: 20260506_2058_realms_null_safety_and_semantics.sql
-- Description: Fix NULL in logo_url, update realm name, description, and type.

DO $$
BEGIN
    -------------------------------------------------------------------
    -- 1. NULL-SAFETY PELS REALMS
    -------------------------------------------------------------------
    UPDATE public.realms SET logo_url = 'EMPTY' WHERE logo_url IS NULL;
    
    ALTER TABLE public.realms ALTER COLUMN logo_url SET DEFAULT 'EMPTY';
    ALTER TABLE public.realms ALTER COLUMN logo_url SET NOT NULL;

    -------------------------------------------------------------------
    -- 2. SEMÀNTICA I NOMENCLATURA
    -------------------------------------------------------------------
    UPDATE public.realms 
    SET name = 'Sóc de Poble',
        type = 'pobles',
        description = 'Pobles connectats'
    WHERE id IS NOT NULL; -- Update all realms (currently only one)

EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error fixant la taula realms: %', SQLERRM;
END $$;

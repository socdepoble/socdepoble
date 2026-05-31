-- Migration: 20260506_2105_realms_dual_logo_architecture.sql
-- Description: Implement dual logo architecture for multi-tenant scalability (core vs realm).

DO $$
BEGIN
    -------------------------------------------------------------------
    -- 1. RENAME EXISTING LOGO TO REALM LOGO
    -------------------------------------------------------------------
    -- El logo específic d'esta xarxa (pot ser l'escut d'una universitat o un altre poble en el futur)
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
          AND table_name = 'realms' 
          AND column_name = 'logo_url'
    ) THEN
        ALTER TABLE public.realms RENAME COLUMN logo_url TO realm_logo_url;
    END IF;

    -------------------------------------------------------------------
    -- 2. ADD CORE LOGO (THE PLATFORM ENGINE LOGO)
    -------------------------------------------------------------------
    -- El logo del motor que mou la xarxa (Sóc de Poble), que sempre serà el mateix.
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
          AND table_name = 'realms' 
          AND column_name = 'core_logo_url'
    ) THEN
        ALTER TABLE public.realms ADD COLUMN core_logo_url TEXT DEFAULT 'EMPTY' NOT NULL;
    END IF;

    -------------------------------------------------------------------
    -- 3. SET DEFAULT SÓC DE POBLE LOGOS (PLACEHOLDERS)
    -------------------------------------------------------------------
    -- Ara mateix, tant el motor com la xarxa són Sóc de Poble. 
    -- Fiquem un placeholder per a que la UI el puga agafar o substituir.
    UPDATE public.realms 
    SET realm_logo_url = '/assets/images/socdepoble_logo.svg',
        core_logo_url = '/assets/images/socdepoble_logo.svg'
    WHERE realm_logo_url = 'EMPTY' OR realm_logo_url IS NULL;

EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error preparant la dualitat de logos a realms: %', SQLERRM;
END $$;

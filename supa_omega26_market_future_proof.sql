/*
  ========================================================================
  🛒 SÓC DE POBLE - PROTOCOLO OMEGA-26: BLINDAJE DE EXPANSIÓN (FUTURE-PROOFING)
  ========================================================================
  🎯 Objetivo: 
  Asegurar la tabla 'market_items' para que acepte TODOS los campos 
  futuros que el motor de React (schemas.js y marketService.js) ya
  está validando a través de Zod, impidiendo caídas críticas a la
  hora de insertar nuevos productos desde el cliente.
*/

DO $$ 
BEGIN
    RAISE NOTICE '⚡ [OMEGA-26] Asegurando columnas de Lore y Posicionamiento para Zod...';

    -- 1. Columnas de Lore / Generación de la IAIA
    ALTER TABLE public.market_items
    ADD COLUMN IF NOT EXISTS is_iaia_inspired BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS ai_percentage SMALLINT DEFAULT 0,
    ADD COLUMN IF NOT EXISTS human_percentage SMALLINT DEFAULT 100,
    ADD COLUMN IF NOT EXISTS time_saved_minutes SMALLINT DEFAULT 0;

    -- 2. Columnas de Pinned (Para cuando el panel de Admin permita fijar productos)
    ALTER TABLE public.market_items
    ADD COLUMN IF NOT EXISTS is_pinned BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS pinned_position SMALLINT DEFAULT 0;

    RAISE NOTICE '✨ [OMEGA-26] ¡Tabla del Mercado completamente blindada para futuras inserciones!';
    
EXCEPTION WHEN OTHERS THEN
    RAISE EXCEPTION '❌ Error en la expansión estructural de OMEGA-26: %', SQLERRM;
END $$;

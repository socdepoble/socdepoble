/*
  ========================================================================
  🛒 SÓC DE POBLE - PROTOCOLO OMEGA-25: APOTEOSIS FINAL (KILL THE FAKE ID)
  ========================================================================
  🎯 Objetivo: 
  Esta es la estocada final. Hemos descubierto que la columna 'id' (bigint) 
  era, en realidad, EL MAYOR FANTASMA de toda la tabla 'market_items'. 
  
  La verdadera Primary Key que usa Sóc de Poble (React, Zod, UUIDFK) ha sido
  SIEMPRE la columna 'uuid' que ves más a la derecha en Supabase.
  
  Por esto PostgreSQL te arrojaba "NULL" al insertar datos nuevos: no le
  importaba dejar 'id' nulo porque 'id' no era la Primary Key.
  
  ⚠️ Misión: Eliminar esta reliquia del pasado para que ya no te moleste 
  visualmente y para que la arquitectura quede limpia 100%.
*/

DO $$ 
BEGIN
    RAISE NOTICE '⚡ [OMEGA-25] Iniciando purga del Falso ID...';

    -- Adiós a la columna impostora
    ALTER TABLE public.market_items 
    DROP COLUMN IF EXISTS id CASCADE;

    RAISE NOTICE '✨ [OMEGA-25] ¡Falso ID Erradicado! La columna `uuid` es ahora la indiscutible monarca de market_items.';
    
EXCEPTION WHEN OTHERS THEN
    RAISE EXCEPTION '❌ Error en la cirugía OMEGA-25: %', SQLERRM;
END $$;

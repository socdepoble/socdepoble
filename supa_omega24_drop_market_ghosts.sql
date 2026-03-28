/*
  ========================================================================
  🛒 SÓC DE POBLE - PROTOCOLO OMEGA-24: LA GRAN PURGA FISICA (CAZAFANTASMAS)
  ========================================================================
  🎯 Objetivo: 
  Ejecutar la orden suprema del Comandante: "Borrar la mierda. Si es antiguo, 
  fuera." 
  
  Esta sentencia amputa FÍSICAMENTE de Supabase todas aquellas columnas que 
  antes causaban huecos (NULLs) indeseados en el Data Editor. 
  Confirmado por código: React ya NO usa ninguna de estas columnas.
*/

DO $$ 
BEGIN

  -- MÚLTIPLE EXTRACCIÓN QUIRÚRGICA EN UNA SOLA TRANSACCIÓN (CON CASCADE)
  ALTER TABLE public.market_items
    -- Fantasmas de Identidad Antigua
    DROP COLUMN IF EXISTS author_id CASCADE, 
    DROP COLUMN IF EXISTS author_name CASCADE, 
    DROP COLUMN IF EXISTS author_avatar_url CASCADE, 
    DROP COLUMN IF EXISTS author_url CASCADE, 
    DROP COLUMN IF EXISTS author_is_ai CASCADE,
    
    -- Fantasmas de Entidades Antiguas
    DROP COLUMN IF EXISTS entity_id CASCADE, 
    DROP COLUMN IF EXISTS seller_entity_id CASCADE, 
    DROP COLUMN IF EXISTS seller_type CASCADE, 
    DROP COLUMN IF EXISTS seller_role CASCADE, 
    
    -- Fantasmas de Clasificación y Localización
    DROP COLUMN IF EXISTS tag CASCADE, 
    DROP COLUMN IF EXISTS town_id CASCADE, 
    
    -- Fantasmas Operativos Menores
    DROP COLUMN IF EXISTS is_demo CASCADE, 
    DROP COLUMN IF EXISTS is_active_local CASCADE,
    DROP COLUMN IF EXISTS is_iaia_inspired CASCADE,
    DROP COLUMN IF EXISTS instance_id CASCADE;

  RAISE NOTICE '✅ PROTOCOLO OMEGA-24: Columnas fantasma extirpadas. El paciente está limpio y los NULLs visuales han sido masacrados.';

EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION '❌ Error en la cirugía OMEGA-24: %', SQLERRM;
END $$;

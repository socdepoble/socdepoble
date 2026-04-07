/*
  ========================================================================
  🚀 SÓC DE POBLE - PROTOCOLO OMEGA-22: PURGA TOTAL DEL MERCADO
  ========================================================================
  🎯 Objetivo: 
  Exterminar toda la deuda técnica y datos fantasma heredados de la tabla 
  'market_items'. Las columnas NULL y las asignaciones por defecto a 'tot' 
  provienen de simulaciones antiguas cuando la base de datos no estaba refactorizada.

  ⚠️ Doctrina Masía Blindada:
  En producción no pueden quedar restos de "pruebas" mal formadas.
  Procedemos a una limpieza implacable.
*/

BEGIN;

DO $$ 
DECLARE
  items_deleted INT;
BEGIN

  -- 1. Eliminar cualquier producto que pertenezca a un vendedor fantasma
  -- o que no tenga asignada una categoría real validada.
  DELETE FROM public.market_items
  WHERE category_slug IS NULL 
     OR category_slug = 'tot'
     OR author_id IS NULL;
     
  -- Guardamos la cuenta
  GET DIAGNOSTICS items_deleted = ROW_COUNT;
  
  -- Si el usuario quiere borrar TODOS los datos de prueba (Recomendado)
  -- descomentar la siguiente línea:
  -- TRUNCATE TABLE public.market_items CASCADE;

  RAISE NOTICE '🔥 PROTOCOLO OMEGA-22 (MERCADO): % Productos fantasma o heredados ELIMINADOS.', items_deleted;

END $$;

COMMIT;

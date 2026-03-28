-- ==============================================================================
-- 🛒 OMEGA-47: CAZADOR FANTASMA EN FAVORITOS DEL MERCADO
-- ==============================================================================
-- El usuario detectó una anomalía encubierta en market_favorites.
-- Conviven 'item_id' (int8) y 'item_uuid' (uuid).
-- El código React (marketService.js) demuestra que ya trabajamos al 100% 
-- con 'item_uuid' apuntando a Rhizome. Por tanto, el viejo int8 es un fantasma.
-- ==============================================================================

DO $$ 
BEGIN
    RAISE NOTICE '⚡ [OMEGA-47] Iniciando escaneo en market_favorites...';

    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema='public' AND table_name='market_favorites' AND column_name='item_id'
    ) THEN
        ALTER TABLE public.market_favorites DROP COLUMN item_id CASCADE;
        RAISE NOTICE '   ✅ Fantasma detectado y fulminado: item_id (int8) aniquilado.';
    ELSE
        RAISE NOTICE '   🟢 La tabla ya estaba limpia de item_id.';
    END IF;

    RAISE NOTICE '✨ [OMEGA-47] market_favorites ahora usa pura identidad polimórfica (uuid).';

EXCEPTION WHEN OTHERS THEN
    RAISE EXCEPTION '❌ Error en la implantación OMEGA-47: %', SQLERRM;
END $$;

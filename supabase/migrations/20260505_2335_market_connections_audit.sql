-- ==============================================================================
-- SÓC DE POBLE: Market Favorites to Connections Migration
-- Timestamp: 2026-05-05 23:35
-- Category: Architecture / Conceptual Model
-- Description: Renames market_favorites to market_connections to reflect the 
-- authentic P2P interaction model of Sóc de Poble. Adds metadata fields for 
-- folksonomy (tags), connection state, and thermodynamics (updated_at).
-- ==============================================================================

BEGIN;

-- 1. RENOMENAR LA TAULA
-- Adequació al concepte de "Connexions" en lloc de "Favorits".
ALTER TABLE IF EXISTS public.market_favorites RENAME TO market_connections;

-- 2. AFEGIR CAMPS DE FOLKSONOMIA I ESTAT
-- Ens permetrà categoritzar o etiquetar "per què" he connectat amb el producte (ex: 'nadal', 'regal').
ALTER TABLE public.market_connections ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';

-- Estat de la connexió respecte al producte/venedor (ex: 'saved', 'contacted', 'purchased', 'archived')
ALTER TABLE public.market_connections ADD COLUMN IF NOT EXISTS connection_status TEXT DEFAULT 'saved';
ALTER TABLE public.market_connections DROP CONSTRAINT IF EXISTS market_connections_status_check;
ALTER TABLE public.market_connections ADD CONSTRAINT market_connections_status_check CHECK (connection_status IN ('saved', 'contacted', 'purchased', 'archived'));

-- Un camp de notes privades on l'usuari puga escriure "M'agrada per a la meua germana".
ALTER TABLE public.market_connections ADD COLUMN IF NOT EXISTS private_notes TEXT;

-- 3. TERMODINÀMICA (updated_at)
ALTER TABLE public.market_connections ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Actualització o creació del trigger
DROP TRIGGER IF EXISTS handle_market_connections_updated_at ON public.market_connections;
CREATE TRIGGER handle_market_connections_updated_at
    BEFORE UPDATE ON public.market_connections
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

COMMIT;

DO $$
BEGIN
    RAISE NOTICE 'Market Connections audit applied successfully. Table renamed and folksonomy fields added.';
END
$$;

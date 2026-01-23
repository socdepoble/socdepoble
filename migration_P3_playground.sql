-- =========================================================
-- SÓC DE POBLE: MIGRACIÓ PHASE 3 - PLAYGROUND (SANDBOX)
-- =========================================================

BEGIN;

-- 1. ADDIR COLUMNA IS_PLAYGROUND A LES TAULES PRINCIPALS
-- ---------------------------------------------------------
-- Aquesta columna ens permet filtrar el contingut efímer creat al Playground.

ALTER TABLE posts ADD COLUMN IF NOT EXISTS is_playground BOOLEAN DEFAULT FALSE;
ALTER TABLE market_items ADD COLUMN IF NOT EXISTS is_playground BOOLEAN DEFAULT FALSE;
ALTER TABLE post_connections ADD COLUMN IF NOT EXISTS is_playground BOOLEAN DEFAULT FALSE;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS is_playground BOOLEAN DEFAULT FALSE;
ALTER TABLE comments ADD COLUMN IF NOT EXISTS is_playground BOOLEAN DEFAULT FALSE;


-- 2. ACTUALITZAR RLS (OPTIONAL: DEPENENT DE SI VOLEM FILTRAR AUTOMÀTICAMENT)
-- ---------------------------------------------------------
-- Per ara, deixem que el frontend decideixi què mostrar, 
-- però podríem afegir una condició a RLS si calgués més seguretat.


-- 3. ÍNDEXS PER A RENDIMENT DE FILTRATGE PLAYGROUND
-- ---------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_posts_is_playground ON posts(is_playground);
CREATE INDEX IF NOT EXISTS idx_market_items_is_playground ON market_items(is_playground);

COMMIT;

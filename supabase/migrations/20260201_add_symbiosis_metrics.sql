-- [MASTER] Migració de Simbiosi Humà/IA
-- Aquest script afig les columnes necessàries per a la Directiva Master.

-- 1. Afegir mètriques a POSTS
ALTER TABLE posts 
ADD COLUMN IF NOT EXISTS ai_percentage INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS human_percentage INTEGER DEFAULT 100,
ADD COLUMN IF NOT EXISTS is_iaia_inspired BOOLEAN DEFAULT false;

-- 2. Afegir IAIA status a MARKET_ITEMS
ALTER TABLE market_items
ADD COLUMN IF NOT EXISTS is_iaia_inspired BOOLEAN DEFAULT false;

-- 3. Vista d'Auditoria de Llinatge Digital [MASTER]
CREATE OR REPLACE VIEW view_digital_lineage_audit AS
SELECT 
    id,
    created_at,
    author_name,
    ai_percentage as "AI %",
    human_percentage as "Human %",
    'post' as content_type
FROM posts
WHERE is_iaia_inspired = true
UNION ALL
SELECT 
    id,
    created_at,
    seller_name as author_name,
    0 as "AI %",
    100 as "Human %",
    'market' as content_type
FROM market_items
WHERE is_iaia_inspired = true
ORDER BY created_at DESC;

COMMENT ON VIEW view_digital_lineage_audit IS 'Auditoria de transparència per a la Directiva Master de Sóc de Poble.';

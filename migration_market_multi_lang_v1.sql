-- ==========================================
-- CONSOLIDACIÓN MULTILINGÜE DE CATEGORÍAS
-- ==========================================

BEGIN;

-- 1. Asegurar columnas para todos los idiomas
ALTER TABLE market_categories ADD COLUMN IF NOT EXISTS name_en TEXT;
ALTER TABLE market_categories ADD COLUMN IF NOT EXISTS name_gl TEXT;
ALTER TABLE market_categories ADD COLUMN IF NOT EXISTS name_eu TEXT;

-- 2. Actualizar y sembrar categorías con todos los idiomas
INSERT INTO market_categories (slug, name_va, name_es, name_en, name_gl, name_eu) VALUES
('tot', 'Tot', 'Todo', 'All', 'Todo', 'Guztiak'),
('productes', 'Productes', 'Productos', 'Products', 'Produtos', 'Produktuak'),
('serveis', 'Serveis', 'Servicios', 'Services', 'Servizos', 'Zerbitzuak'),
('intercanvi', 'Intercanvi', 'Intercambio', 'Exchange', 'Troco', 'Trukea')
ON CONFLICT (slug) DO UPDATE SET
    name_va = EXCLUDED.name_va,
    name_es = EXCLUDED.name_es,
    name_en = EXCLUDED.name_en,
    name_gl = EXCLUDED.name_gl,
    name_eu = EXCLUDED.name_eu;

COMMIT;

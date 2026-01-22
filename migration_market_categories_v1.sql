-- ==========================================
-- CONSOLIDACIÓN DE CATEGORÍAS DEL MERCADO
-- ==========================================

BEGIN;

-- 1. Crear tabla de categorías
CREATE TABLE IF NOT EXISTS market_categories (
    id SERIAL PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    name_va TEXT NOT NULL,
    name_es TEXT NOT NULL,
    icon TEXT, -- Para lucide icons si fuera necesario
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Sembrar categorías base
INSERT INTO market_categories (slug, name_va, name_es, icon) VALUES
('tot', 'Tot', 'Todo', 'LayoutGrid'),
('productes', 'Productes', 'Productos', 'ShoppingBag'),
('serveis', 'Serveis', 'Servicios', 'Wrench'),
('intercanvi', 'Intercanvi', 'Intercambio', 'Repeat')
ON CONFLICT (slug) DO UPDATE SET
    name_va = EXCLUDED.name_va,
    name_es = EXCLUDED.name_es,
    icon = EXCLUDED.icon;

-- 3. Actualizar tabla de market_items para usar slug estandarizado
-- Si existía una columna 'tag', la mantenemos para compatibilidad pero aseguramos que los datos sean coherentes con los slugs.
ALTER TABLE market_items ADD COLUMN IF NOT EXISTS category_slug TEXT REFERENCES market_categories(slug) DEFAULT 'tot';

-- 4. Migrar tags existentes a los nuevos slugs si coinciden
UPDATE market_items SET category_slug = 'productes' WHERE tag IN ('productes', 'producto', 'Productes');
UPDATE market_items SET category_slug = 'serveis' WHERE tag IN ('serveis', 'servicio', 'Serveis');
UPDATE market_items SET category_slug = 'intercanvi' WHERE tag IN ('intercanvi', 'intercambio', 'Intercanvi');

COMMIT;

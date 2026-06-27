-- 10_FIX_MARKET_CATEGORIES_I18N.sql
-- Correcció metòdica i massiva de la taula de categories de mercat
-- 1. Separació de la utilitat "icon" (React) del camp "name_en" (Anglès)
-- 2. Eliminació d'omissions (NULL) a gallec (gl) i basc (eu)

-- 1. Creem l'espai independent per les icones i apartem React dels idiomes
ALTER TABLE public.market_categories ADD COLUMN IF NOT EXISTS icon text;

-- 2. Restaurem la identitat multilingüe completa per a cada entrada sense deixar-ne cap

-- ID 1 (tot)
UPDATE public.market_categories SET 
    name_va = 'Tot', name_es = 'Todo', name_en = 'All', name_gl = 'Todo', name_eu = 'Guztiak', icon = 'LayoutGrid'
WHERE slug = 'tot';

-- ID 3 (productes)
UPDATE public.market_categories SET 
    name_va = 'Productes', name_es = 'Productos', name_en = 'Products', name_gl = 'Produtos', name_eu = 'Produktuak', icon = 'ShoppingBag'
WHERE slug = 'productes';

-- ID 4 (serveis)
UPDATE public.market_categories SET 
    name_va = 'Serveis', name_es = 'Servicios', name_en = 'Services', name_gl = 'Servizos', name_eu = 'Zerbitzuak', icon = 'Briefcase'
WHERE slug = 'serveis';

-- ID 5 (intercanvi)
UPDATE public.market_categories SET 
    name_va = 'Intercanvi', name_es = 'Intercambio', name_en = 'Exchange', name_gl = 'Troco', name_eu = 'Trukatu', icon = 'Repeat'
WHERE slug = 'intercanvi';

-- ID 10 (alimentacio)
UPDATE public.market_categories SET 
    name_va = 'Alimentació', name_es = 'Alimentación', name_en = 'Food', name_gl = 'Alimentación', name_eu = 'Elikadura', icon = 'Apple'
WHERE slug = 'alimentacio';

-- ID 11 (roba)
UPDATE public.market_categories SET 
    name_va = 'Roba', name_es = 'Ropa', name_en = 'Clothing', name_gl = 'Roupa', name_eu = 'Arropa', icon = 'Shirt'
WHERE slug = 'roba';

-- ID 12 (artesania)
UPDATE public.market_categories SET 
    name_va = 'Artesania', name_es = 'Artesanía', name_en = 'Crafts', name_gl = 'Artesanía', name_eu = 'Eskulangintza', icon = 'Palette'
WHERE slug = 'artesania';

-- ID 13 (eines)
UPDATE public.market_categories SET 
    name_va = 'Eines i Maquinària', name_es = 'Herramientas y Maquinaria', name_en = 'Tools & Machinery', name_gl = 'Ferramentas', name_eu = 'Erremintak', icon = 'Wrench'
WHERE slug = 'eines';

-- ID 14 (altres)
UPDATE public.market_categories SET 
    name_va = 'Altres', name_es = 'Otros', name_en = 'Others', name_gl = 'Outros', name_eu = 'Beste batzuk', icon = 'MoreHorizontal'
WHERE slug = 'altres';

-- Nota: S'ha eliminat tot el soroll (ShoppingBag, LayoutGrid...) del diccionari de Traducció Anglesa.

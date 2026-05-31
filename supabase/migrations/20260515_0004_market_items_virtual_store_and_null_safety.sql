-- ==============================================================================
-- SÓC DE POBLE: Market Items Virtual Store & Absolute Null-Safety (Fanatic)
-- Timestamp: 2026-05-15 17:45
-- Category: Architecture / E-commerce / Schema Hardening
-- Description: Transforms market_items into a fully compliant virtual store and 
-- enforces absolute null-safety to prevent deserialization issues on legacy iPad hardware.
-- Includes circular economy tax classes.
-- ==============================================================================

-- 1. ADD VIRTUAL STORE COLUMNS
ALTER TABLE public.market_items
ADD COLUMN IF NOT EXISTS price NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS compare_at_price NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS sku TEXT DEFAULT 'EMPTY',
ADD COLUMN IF NOT EXISTS stock_quantity INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS stock_status TEXT DEFAULT 'instock',
ADD COLUMN IF NOT EXISTS weight NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS product_type TEXT DEFAULT 'physical',
ADD COLUMN IF NOT EXISTS tax_class TEXT DEFAULT 'standard',
ADD COLUMN IF NOT EXISTS is_downloadable BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS download_url TEXT DEFAULT 'EMPTY';

-- 2. ADD CONSTRAINTS FOR NEW COLUMNS
ALTER TABLE public.market_items DROP CONSTRAINT IF EXISTS market_items_stock_status_check;
ALTER TABLE public.market_items ADD CONSTRAINT market_items_stock_status_check CHECK (stock_status IN ('instock', 'outofstock', 'onbackorder'));

ALTER TABLE public.market_items DROP CONSTRAINT IF EXISTS market_items_product_type_check;
ALTER TABLE public.market_items ADD CONSTRAINT market_items_product_type_check CHECK (product_type IN ('physical', 'digital', 'service'));

ALTER TABLE public.market_items DROP CONSTRAINT IF EXISTS market_items_tax_class_check;
ALTER TABLE public.market_items ADD CONSTRAINT market_items_tax_class_check CHECK (tax_class IN ('standard', 'reduced', 'super_reduced', 'exempt', 'second_hand'));

-- 3. FANATIC NULL-SAFETY SWEEP (Existing Columns + New Columns)
-- Update NULLs to safe values before applying NOT NULL constraints
UPDATE public.market_items SET price = 0 WHERE price IS NULL;
UPDATE public.market_items SET compare_at_price = 0 WHERE compare_at_price IS NULL;
UPDATE public.market_items SET sku = 'EMPTY' WHERE sku IS NULL;
UPDATE public.market_items SET stock_quantity = 0 WHERE stock_quantity IS NULL;
UPDATE public.market_items SET stock_status = 'instock' WHERE stock_status IS NULL;
UPDATE public.market_items SET weight = 0 WHERE weight IS NULL;
UPDATE public.market_items SET product_type = 'physical' WHERE product_type IS NULL;
UPDATE public.market_items SET tax_class = 'standard' WHERE tax_class IS NULL;
UPDATE public.market_items SET is_downloadable = false WHERE is_downloadable IS NULL;
UPDATE public.market_items SET download_url = 'EMPTY' WHERE download_url IS NULL;

-- Handle existing potentially NULL columns shown in legacy interfaces
UPDATE public.market_items SET is_playground = false WHERE is_playground IS NULL;
UPDATE public.market_items SET ai_percentage = 0 WHERE ai_percentage IS NULL;
UPDATE public.market_items SET human_percentage = 100 WHERE human_percentage IS NULL;

-- Check if time_used_minutes exists and update if it does
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'market_items' AND column_name = 'time_used_minutes') THEN
        EXECUTE 'UPDATE public.market_items SET time_used_minutes = 0 WHERE time_used_minutes IS NULL';
        EXECUTE 'ALTER TABLE public.market_items ALTER COLUMN time_used_minutes SET DEFAULT 0';
        EXECUTE 'ALTER TABLE public.market_items ALTER COLUMN time_used_minutes SET NOT NULL';
    END IF;
END $$;

-- Check if is_pinned exists and update if it does
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'market_items' AND column_name = 'is_pinned') THEN
        EXECUTE 'UPDATE public.market_items SET is_pinned = false WHERE is_pinned IS NULL';
        EXECUTE 'ALTER TABLE public.market_items ALTER COLUMN is_pinned SET DEFAULT false';
        EXECUTE 'ALTER TABLE public.market_items ALTER COLUMN is_pinned SET NOT NULL';
    END IF;
END $$;

-- Check if pinned_position exists and update if it does
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'market_items' AND column_name = 'pinned_position') THEN
        EXECUTE 'UPDATE public.market_items SET pinned_position = 0 WHERE pinned_position IS NULL';
        EXECUTE 'ALTER TABLE public.market_items ALTER COLUMN pinned_position SET DEFAULT 0';
        EXECUTE 'ALTER TABLE public.market_items ALTER COLUMN pinned_position SET NOT NULL';
    END IF;
END $$;

-- Check if age_restriction exists and update if it does
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'market_items' AND column_name = 'age_restriction') THEN
        EXECUTE 'UPDATE public.market_items SET age_restriction = 0 WHERE age_restriction IS NULL';
        EXECUTE 'ALTER TABLE public.market_items ALTER COLUMN age_restriction SET DEFAULT 0';
        EXECUTE 'ALTER TABLE public.market_items ALTER COLUMN age_restriction SET NOT NULL';
    END IF;
END $$;

UPDATE public.market_items SET category_slug = 'EMPTY' WHERE category_slug IS NULL;
UPDATE public.market_items SET status = 'active' WHERE status IS NULL;
UPDATE public.market_items SET seo_title = 'EMPTY' WHERE seo_title IS NULL;
UPDATE public.market_items SET seo_description = 'EMPTY' WHERE seo_description IS NULL;
UPDATE public.market_items SET seo_keywords = 'EMPTY' WHERE seo_keywords IS NULL;
UPDATE public.market_items SET slug = 'item-' || uuid::text WHERE slug IS NULL;

-- 4. ENFORCE ABSOLUTE NOT NULL CONSTRAINTS
DO $$
DECLARE
    col_record RECORD;
    safe_columns TEXT[] := ARRAY[
        'price', 'compare_at_price', 'sku', 'stock_quantity', 'stock_status', 
        'weight', 'product_type', 'tax_class', 'is_downloadable', 'download_url',
        'is_playground', 'ai_percentage', 'human_percentage', 'category_slug', 
        'status', 'seo_title', 'seo_description', 'seo_keywords', 'slug', 'subtitle'
    ];
    target_column TEXT;
BEGIN
    FOREACH target_column IN ARRAY safe_columns
    LOOP
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'market_items' AND column_name = target_column) THEN
            IF target_column = 'price' THEN EXECUTE 'ALTER TABLE public.market_items ALTER COLUMN price SET DEFAULT 0'; END IF;
            IF target_column = 'compare_at_price' THEN EXECUTE 'ALTER TABLE public.market_items ALTER COLUMN compare_at_price SET DEFAULT 0'; END IF;
            IF target_column = 'sku' THEN EXECUTE 'ALTER TABLE public.market_items ALTER COLUMN sku SET DEFAULT ''EMPTY'''; END IF;
            IF target_column = 'stock_quantity' THEN EXECUTE 'ALTER TABLE public.market_items ALTER COLUMN stock_quantity SET DEFAULT 0'; END IF;
            IF target_column = 'stock_status' THEN EXECUTE 'ALTER TABLE public.market_items ALTER COLUMN stock_status SET DEFAULT ''instock'''; END IF;
            IF target_column = 'weight' THEN EXECUTE 'ALTER TABLE public.market_items ALTER COLUMN weight SET DEFAULT 0'; END IF;
            IF target_column = 'product_type' THEN EXECUTE 'ALTER TABLE public.market_items ALTER COLUMN product_type SET DEFAULT ''physical'''; END IF;
            IF target_column = 'tax_class' THEN EXECUTE 'ALTER TABLE public.market_items ALTER COLUMN tax_class SET DEFAULT ''standard'''; END IF;
            IF target_column = 'is_downloadable' THEN EXECUTE 'ALTER TABLE public.market_items ALTER COLUMN is_downloadable SET DEFAULT false'; END IF;
            IF target_column = 'download_url' THEN EXECUTE 'ALTER TABLE public.market_items ALTER COLUMN download_url SET DEFAULT ''EMPTY'''; END IF;
            IF target_column = 'is_playground' THEN EXECUTE 'ALTER TABLE public.market_items ALTER COLUMN is_playground SET DEFAULT false'; END IF;
            IF target_column = 'ai_percentage' THEN EXECUTE 'ALTER TABLE public.market_items ALTER COLUMN ai_percentage SET DEFAULT 0'; END IF;
            IF target_column = 'human_percentage' THEN EXECUTE 'ALTER TABLE public.market_items ALTER COLUMN human_percentage SET DEFAULT 100'; END IF;
            IF target_column = 'category_slug' THEN EXECUTE 'ALTER TABLE public.market_items ALTER COLUMN category_slug SET DEFAULT ''EMPTY'''; END IF;
            IF target_column = 'status' THEN EXECUTE 'ALTER TABLE public.market_items ALTER COLUMN status SET DEFAULT ''active'''; END IF;
            IF target_column = 'seo_title' THEN EXECUTE 'ALTER TABLE public.market_items ALTER COLUMN seo_title SET DEFAULT ''EMPTY'''; END IF;
            IF target_column = 'seo_description' THEN EXECUTE 'ALTER TABLE public.market_items ALTER COLUMN seo_description SET DEFAULT ''EMPTY'''; END IF;
            IF target_column = 'seo_keywords' THEN EXECUTE 'ALTER TABLE public.market_items ALTER COLUMN seo_keywords SET DEFAULT ''EMPTY'''; END IF;
            IF target_column = 'subtitle' THEN EXECUTE 'ALTER TABLE public.market_items ALTER COLUMN subtitle SET DEFAULT ''EMPTY'''; END IF;
            IF target_column = 'slug' THEN EXECUTE 'ALTER TABLE public.market_items ALTER COLUMN slug SET DEFAULT ''item-'' || gen_random_uuid()::text'; END IF;
            
            EXECUTE format('ALTER TABLE public.market_items ALTER COLUMN %I SET NOT NULL', target_column);
        END IF;
    END LOOP;
END $$;

DO $$
BEGIN
    RAISE NOTICE 'Berrida Fanàtica: Market Items Virtual Store constraints and absolute null-safety applied successfully.';
END
$$;

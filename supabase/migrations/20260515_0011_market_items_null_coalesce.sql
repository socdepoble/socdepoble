-- 20260515_0011_market_items_null_coalesce.sql
-- Auditoria profunda: Blindatge absolut de market_items (Estat Omega)

-- 1. Assegurem que cap registre antic tingui NULL a seo_title
UPDATE public.market_items SET seo_title = 'EMPTY' WHERE seo_title IS NULL;

-- 2. Creem una funció de trigger genèrica per a market_items que forci valors per defecte si ens arriben NULLs des del client
CREATE OR REPLACE FUNCTION public.fn_market_items_null_safety()
RETURNS TRIGGER AS $$
BEGIN
    -- Si el client envia explícitament un NULL (malgrat la constraint), el captem abans de l'error
    NEW.seo_title := COALESCE(NEW.seo_title, 'EMPTY');
    NEW.seo_description := COALESCE(NEW.seo_description, 'EMPTY');
    NEW.seo_keywords := COALESCE(NEW.seo_keywords, '{}'::jsonb);
    
    -- Altres camps importants
    NEW.subtitle := COALESCE(NEW.subtitle, '');
    NEW.short_description := COALESCE(NEW.short_description, 'Sense descripció curta');
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Apliquem el trigger a la taula
DROP TRIGGER IF EXISTS tr_market_items_null_safety ON public.market_items;
CREATE TRIGGER tr_market_items_null_safety
    BEFORE INSERT OR UPDATE ON public.market_items
    FOR EACH ROW
    EXECUTE FUNCTION public.fn_market_items_null_safety();

-- 4. Afegim Constraint de Domini per Status (Si no existeix)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'market_items_status_check'
    ) THEN
        ALTER TABLE public.market_items 
        ADD CONSTRAINT market_items_status_check 
        CHECK (status IN ('active', 'draft', 'archived'));
    END IF;
END $$;

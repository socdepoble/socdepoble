-- ==============================================================================
-- MIGRACIÓ: Arquitectura "WordPress & WooCommerce Killer" (Fase 1-4)
-- DATA: 2026-05-15
-- AUTOR: VISOR NANO
-- DESCRIPCIÓ: 
-- 1. Soft Deletes (Paperera de reciclatge) per a seguretat Offline-First.
-- 2. Media Library (carpetes, alt_text) per batre a WordPress en SEO.
-- 3. Transaccions (Comandes, Cistella) per batre a WooCommerce.
-- 4. Logística Local (Puchero, Forn de Paco, Wallapop chat).
-- ==============================================================================

BEGIN;

-- ==========================================
-- FASE 1: SOFT DELETES (LA PAPERERA DE RECICLATGE)
-- ==========================================
-- Assegurem que ningú perd dades de forma inconscient. 
-- Vital per a la sincronització CRDT offline.

DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'posts') THEN
        ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'market_items') THEN
        ALTER TABLE public.market_items ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'post_comments') THEN
        ALTER TABLE public.post_comments ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'resources') THEN
        ALTER TABLE public.resources ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
    END IF;
END $$;

-- ==========================================
-- FASE 2: MEDIA ASSETS LIBRARY (COMPETÈNCIA WP MEDIA)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.media_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL, -- Ruta dins del storage bucket (ex: 'profiles/uuid/foto.jpg')
    mime_type TEXT,
    file_size_bytes BIGINT,
    alt_text TEXT, -- Crucial per a SEO i accessibilitat (Substitueix Yoast)
    caption TEXT,
    folder_category TEXT DEFAULT 'general', -- Sistema de carpetes clares demanat pel mestre
    created_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- Si la taula ja existia, ens assegurem d'afegir totes les columnes base
ALTER TABLE public.media_assets ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.media_assets ADD COLUMN IF NOT EXISTS file_name TEXT DEFAULT 'unnamed_file';
ALTER TABLE public.media_assets ADD COLUMN IF NOT EXISTS file_path TEXT DEFAULT 'unknown/path';
ALTER TABLE public.media_assets ADD COLUMN IF NOT EXISTS mime_type TEXT;
ALTER TABLE public.media_assets ADD COLUMN IF NOT EXISTS file_size_bytes BIGINT;
ALTER TABLE public.media_assets ADD COLUMN IF NOT EXISTS caption TEXT;
ALTER TABLE public.media_assets ADD COLUMN IF NOT EXISTS folder_category TEXT DEFAULT 'general';
ALTER TABLE public.media_assets ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Media assets viewable by everyone" ON public.media_assets;
CREATE POLICY "Media assets viewable by everyone" 
ON public.media_assets FOR SELECT USING (deleted_at IS NULL);

DROP POLICY IF EXISTS "Users manage own media" ON public.media_assets;
CREATE POLICY "Users manage own media" 
ON public.media_assets FOR ALL 
TO authenticated 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- ==========================================
-- FASE 3 & 4: E-COMMERCE TRANSACCIONAL I LOGÍSTICA (WOOCOMMERCE KILLER)
-- ==========================================

-- TAULA DE COMANDES (ORDERS)
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    buyer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    seller_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'ready_for_pickup', 'completed', 'cancelled')),
    total_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    currency TEXT DEFAULT 'EUR',
    
    -- Suport per al model "Wallapop" o "Compra directa" o "Puchero de hui"
    transaction_model TEXT DEFAULT 'direct_checkout' CHECK (transaction_model IN ('direct_checkout', 'chat_negotiation', 'group_split')),
    
    -- Logística de Poble
    delivery_type TEXT DEFAULT 'local_pickup' CHECK (delivery_type IN ('local_pickup', 'home_delivery', 'digital', 'in_person')),
    delivery_notes TEXT, -- Ex: "Deixar al Forn de Paco" o "Apunteu-me per al puchero"
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- LÍNIES DE COMANDA (ORDER ITEMS)
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    item_id UUID REFERENCES public.market_items(uuid) ON DELETE RESTRICT,
    quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
    unit_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    total_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RESSENYES (REVIEWS)
CREATE TABLE IF NOT EXISTS public.market_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_id UUID REFERENCES public.market_items(uuid) ON DELETE CASCADE,
    reviewer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL, -- Ressenya de compra verificada (opcional)
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment_text TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- SEGURETAT RLS: ORDERS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_reviews ENABLE ROW LEVEL SECURITY;

-- Polítiques Orders
DROP POLICY IF EXISTS "Users view own orders" ON public.orders;
CREATE POLICY "Users view own orders" ON public.orders FOR SELECT TO authenticated USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

DROP POLICY IF EXISTS "Buyers create orders" ON public.orders;
CREATE POLICY "Buyers create orders" ON public.orders FOR INSERT TO authenticated WITH CHECK (auth.uid() = buyer_id);

DROP POLICY IF EXISTS "Participants update orders" ON public.orders;
CREATE POLICY "Participants update orders" ON public.orders FOR UPDATE TO authenticated USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

-- Polítiques Order Items
DROP POLICY IF EXISTS "Users view order items" ON public.order_items;
CREATE POLICY "Users view order items" ON public.order_items FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_items.order_id AND (o.buyer_id = auth.uid() OR o.seller_id = auth.uid()))
);

DROP POLICY IF EXISTS "Buyers insert order items" ON public.order_items;
CREATE POLICY "Buyers insert order items" ON public.order_items FOR INSERT TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_items.order_id AND o.buyer_id = auth.uid())
);

-- Polítiques Reviews
DROP POLICY IF EXISTS "Reviews are public" ON public.market_reviews;
CREATE POLICY "Reviews are public" ON public.market_reviews FOR SELECT USING (deleted_at IS NULL);

DROP POLICY IF EXISTS "Auth write reviews" ON public.market_reviews;
CREATE POLICY "Auth write reviews" ON public.market_reviews FOR INSERT TO authenticated WITH CHECK (auth.uid() = reviewer_id);

DROP POLICY IF EXISTS "Users manage own reviews" ON public.market_reviews;
CREATE POLICY "Users manage own reviews" ON public.market_reviews FOR UPDATE TO authenticated USING (auth.uid() = reviewer_id);

COMMIT;

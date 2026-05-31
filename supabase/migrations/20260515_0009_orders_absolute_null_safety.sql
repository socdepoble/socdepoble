-- Migration: Orders & Transactions - Absolute Null-Safety
-- Date: 2026-05-15
-- Description: The 'Trellat' philosophy requires NO NULLs in transactional tables.
-- We purge NULLs from orders, order_items, and market_reviews, except for deleted_at.

BEGIN;

-- 1. Drop constraints that reference auth.users to allow Nil Profile UUID, 
-- and drop constraints that use ON DELETE SET NULL.
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_buyer_id_fkey;
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_seller_id_fkey;
ALTER TABLE public.market_reviews DROP CONSTRAINT IF EXISTS market_reviews_reviewer_id_fkey;
ALTER TABLE public.market_reviews DROP CONSTRAINT IF EXISTS market_reviews_order_id_fkey;

-- 2. Insert Nil Market Item if not exists
INSERT INTO public.market_items (
    uuid, title, description, town_uuid, slug
)
VALUES (
    '00000000-0000-0000-0000-000000000000'::uuid, 
    'Desconegut', 
    'Desconegut', 
    (SELECT id FROM public.towns ORDER BY random() LIMIT 1),
    'item-00000000-0000-0000-0000-000000000000'
) ON CONFLICT (uuid) DO NOTHING;

-- 3. Insert Nil Order if not exists
INSERT INTO public.orders (id, buyer_id, seller_id, status, total_amount)
VALUES (
    '00000000-0000-0000-0000-000000000000'::uuid, 
    '00000000-0000-0000-0000-000000000000'::uuid, 
    '00000000-0000-0000-0000-000000000000'::uuid, 
    'cancelled',
    0.00
) ON CONFLICT (id) DO NOTHING;

-- 4. ORDERS - Set Defaults and Update NULLs
ALTER TABLE public.orders ALTER COLUMN buyer_id SET DEFAULT '00000000-0000-0000-0000-000000000000'::uuid;
ALTER TABLE public.orders ALTER COLUMN seller_id SET DEFAULT '00000000-0000-0000-0000-000000000000'::uuid;
ALTER TABLE public.orders ALTER COLUMN status SET DEFAULT 'pending';
ALTER TABLE public.orders ALTER COLUMN currency SET DEFAULT 'EUR';
ALTER TABLE public.orders ALTER COLUMN transaction_model SET DEFAULT 'direct_checkout';
ALTER TABLE public.orders ALTER COLUMN delivery_type SET DEFAULT 'local_pickup';
ALTER TABLE public.orders ALTER COLUMN delivery_notes SET DEFAULT '';

UPDATE public.orders SET 
    buyer_id = COALESCE(buyer_id, '00000000-0000-0000-0000-000000000000'::uuid),
    seller_id = COALESCE(seller_id, '00000000-0000-0000-0000-000000000000'::uuid),
    status = COALESCE(status, 'pending'),
    currency = COALESCE(currency, 'EUR'),
    transaction_model = COALESCE(transaction_model, 'direct_checkout'),
    delivery_type = COALESCE(delivery_type, 'local_pickup'),
    delivery_notes = COALESCE(delivery_notes, '');

-- 5. ORDER ITEMS - Set Defaults and Update NULLs
ALTER TABLE public.order_items ALTER COLUMN order_id SET DEFAULT '00000000-0000-0000-0000-000000000000'::uuid;
ALTER TABLE public.order_items ALTER COLUMN item_id SET DEFAULT '00000000-0000-0000-0000-000000000000'::uuid;

UPDATE public.order_items SET 
    order_id = COALESCE(order_id, '00000000-0000-0000-0000-000000000000'::uuid),
    item_id = COALESCE(item_id, '00000000-0000-0000-0000-000000000000'::uuid);

-- 6. MARKET REVIEWS - Set Defaults and Update NULLs
ALTER TABLE public.market_reviews ALTER COLUMN reviewer_id SET DEFAULT '00000000-0000-0000-0000-000000000000'::uuid;
ALTER TABLE public.market_reviews ALTER COLUMN item_id SET DEFAULT '00000000-0000-0000-0000-000000000000'::uuid;
ALTER TABLE public.market_reviews ALTER COLUMN order_id SET DEFAULT '00000000-0000-0000-0000-000000000000'::uuid;
ALTER TABLE public.market_reviews ALTER COLUMN comment_text SET DEFAULT '';

UPDATE public.market_reviews SET 
    reviewer_id = COALESCE(reviewer_id, '00000000-0000-0000-0000-000000000000'::uuid),
    item_id = COALESCE(item_id, '00000000-0000-0000-0000-000000000000'::uuid),
    order_id = COALESCE(order_id, '00000000-0000-0000-0000-000000000000'::uuid),
    comment_text = COALESCE(comment_text, '');

COMMIT;

BEGIN;

-- Apply Foreign Keys
ALTER TABLE public.orders ADD CONSTRAINT orders_buyer_id_fkey FOREIGN KEY (buyer_id) REFERENCES public.profiles(id) ON DELETE SET DEFAULT DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE public.orders ADD CONSTRAINT orders_seller_id_fkey FOREIGN KEY (seller_id) REFERENCES public.profiles(id) ON DELETE SET DEFAULT DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE public.market_reviews ADD CONSTRAINT market_reviews_reviewer_id_fkey FOREIGN KEY (reviewer_id) REFERENCES public.profiles(id) ON DELETE SET DEFAULT DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE public.market_reviews ADD CONSTRAINT market_reviews_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE SET DEFAULT DEFERRABLE INITIALLY DEFERRED;

-- Set NOT NULL
ALTER TABLE public.orders ALTER COLUMN buyer_id SET NOT NULL;
ALTER TABLE public.orders ALTER COLUMN seller_id SET NOT NULL;
ALTER TABLE public.orders ALTER COLUMN status SET NOT NULL;
ALTER TABLE public.orders ALTER COLUMN currency SET NOT NULL;
ALTER TABLE public.orders ALTER COLUMN transaction_model SET NOT NULL;
ALTER TABLE public.orders ALTER COLUMN delivery_type SET NOT NULL;
ALTER TABLE public.orders ALTER COLUMN delivery_notes SET NOT NULL;

ALTER TABLE public.order_items ALTER COLUMN order_id SET NOT NULL;
ALTER TABLE public.order_items ALTER COLUMN item_id SET NOT NULL;

ALTER TABLE public.market_reviews ALTER COLUMN reviewer_id SET NOT NULL;
ALTER TABLE public.market_reviews ALTER COLUMN item_id SET NOT NULL;
ALTER TABLE public.market_reviews ALTER COLUMN order_id SET NOT NULL;
ALTER TABLE public.market_reviews ALTER COLUMN comment_text SET NOT NULL;

COMMIT;

DO $$
BEGIN
    RAISE NOTICE 'Orders and Reviews tables: Absolute Null-Safety enforced (except CRDT deleted_at).';
END
$$;

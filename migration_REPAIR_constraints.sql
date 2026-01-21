-- =========================================================
-- FIX: REPARAR TODOS LOS CONSTRAINTS (VERSIÓN FINAL)
-- =========================================================

BEGIN;

-- 1. Actualizar tabla ENTITIES
ALTER TABLE public.entities DROP CONSTRAINT IF EXISTS entities_type_check;
ALTER TABLE public.entities ADD CONSTRAINT entities_type_check 
  CHECK (type IN ('grup', 'empresa', 'entitat', 'oficial'));

-- 2. Actualizar tabla PROFILES (role)
-- Este era el que faltaba en el último error
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check 
  CHECK (role IN ('vei', 'gent', 'grup', 'empresa', 'entitat', 'oficial', 'admin'));

-- 3. Actualizar tabla POSTS (author_role)
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'posts' AND column_name = 'author_role') THEN
        ALTER TABLE public.posts DROP CONSTRAINT IF EXISTS posts_author_role_check;
        ALTER TABLE public.posts ADD CONSTRAINT posts_author_role_check 
          CHECK (author_role IN ('vei', 'gent', 'grup', 'empresa', 'entitat', 'oficial'));
    END IF;
END $$;

-- 4. Actualizar tabla MARKET_ITEMS (seller_role)
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'market_items' AND column_name = 'seller_role') THEN
        ALTER TABLE public.market_items DROP CONSTRAINT IF EXISTS market_items_seller_role_check;
        ALTER TABLE public.market_items ADD CONSTRAINT market_items_seller_role_check 
          CHECK (seller_role IN ('vei', 'gent', 'grup', 'empresa', 'entitat', 'oficial'));
    END IF;
END $$;

COMMIT;

-- AHORA PUEDES VOLVER A EJECUTAR EL SCRIPT DE SIEMBRA (migration_admin_seed_v1.sql)

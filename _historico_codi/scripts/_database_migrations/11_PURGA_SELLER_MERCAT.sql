-- 11_PURGA_SELLER_MERCAT.sql
-- Així com hem netejat 'author' de 'posts' (fantasmes text), el mercat 
-- també tenia una columna morta 'seller' herència on bategaven vells valors
-- de text sense sentit per culpa de NULLs recents al crear articles nous reals.
-- Ara tot el sistema és 100% UUID depenent (author_user_id i seller_type/author_entity_id).

ALTER TABLE public.market_items DROP COLUMN IF EXISTS seller;

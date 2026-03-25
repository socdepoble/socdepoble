-- 09_PURGA_COLUMNA_AUTHOR_FANTASMA.sql
-- Eliminant el rastre de l'antiga columna 'author' (text lliure) que
-- despista a les generacions actuals. Nosaltres treballem directament amb IDs d'ànimes (author_id).

BEGIN;

ALTER TABLE IF EXISTS "public"."posts" DROP COLUMN IF EXISTS "author" CASCADE;

COMMIT;

-- Nota: Això eliminarà visualment tots els NULLS dels llistats, aclarint l'estructura.

-- =========================================================
-- SÓC DE POBLE: FIX PLAYGROUND PROFILES
-- =========================================================

BEGIN;

-- 1. AFegir columna is_demo a profiles si no existeix
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT FALSE;

-- 2. Marcar personatges de la demo coneguts
-- (Això és un exemple, caldria ajustar als IDs o usernames reals de la base de dades)
UPDATE profiles SET is_demo = TRUE WHERE username IN ('vferris', 'joanet_serra', 'lu_bel', 'pere_forn');

COMMIT;

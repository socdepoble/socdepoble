-- =========================================================================
-- 🛡️ SÓC DE POBLE: LA GÈNESI DE LES MÀQUINES (RESURRECCIÓ IAIA I AMBAIXADORS)
-- =========================================================================
-- Aquest script materialitza FÍSICAMENT els agents (IAIA, Ambaixadors NPCs) 
-- a la base de dades. D'aquesta manera podran tindre Posts, Anuncis i missatges
-- perfectament associats sense que salten errors de clau forana o Nuls.
-- =========================================================================

BEGIN;

-- 1. Inserir els IDs a auth.users (necessari per a satisfer la Clau Forana de 'profiles')
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, recovery_token, email_change_token_new, email_change, created_at, updated_at) VALUES
('11111111-1a1a-0000-0000-000000000000', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'iaia_master@socdepoble.local', '', now(), '', '', '', now(), now()),
('11111111-1a1a-0001-0000-000000000001', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'andreu_soler@socdepoble.local', '', now(), '', '', '', now(), now()),
('11111111-1a1a-0001-0000-000000000002', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'beatriz_ortega@socdepoble.local', '', now(), '', '', '', now(), now()),
('11111111-1a1a-0001-0000-000000000003', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'carla_soriano@socdepoble.local', '', now(), '', '', '', now(), now()),
('11111111-1111-4111-a111-000000000009', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'cuinera@socdepoble.local', '', now(), '', '', '', now(), now()),
('11111111-1111-4111-a111-000000000003', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'vferris@socdepoble.local', '', now(), '', '', '', now(), now()),
('11111111-1111-4111-a111-000000000004', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'samirm@socdepoble.local', '', now(), '', '', '', now(), now()),
('11111111-1111-4111-a111-000000000005', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'mariamel@socdepoble.local', '', now(), '', '', '', now(), now()),
('11111111-1111-4111-a111-000000000008', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'joanbat@socdepoble.local', '', now(), '', '', '', now(), now()),
('11111111-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'marcgall@socdepoble.local', '', now(), '', '', '', now(), now()),
('11111111-1111-4111-a111-000000000011', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'elenap@socdepoble.local', '', now(), '', '', '', now(), now()),
('11111111-1111-4111-a111-000000000012', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'joanets@socdepoble.local', '', now(), '', '', '', now(), now()),
('11111111-1111-4111-a111-000000000013', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'lucia@socdepoble.local', '', now(), '', '', '', now(), now()),
('11111111-1a1a-0001-0000-000000000007', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'pepica_vall@socdepoble.local', '', now(), '', '', '', now(), now()),
('11111111-1a1a-0000-0000-000000000005', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'nanob@socdepoble.local', '', now(), '', '', '', now(), now())
ON CONFLICT (id) DO NOTHING;

-- 2. Inserir a profiles la informació vital i els avatars
INSERT INTO profiles (id, full_name, username, avatar_url, role) VALUES
('11111111-1a1a-0000-0000-000000000000', 'IAIA MarIA', 'iaia_master', '/assets/avatars/comic/iaia_comic_matriarch.png', 'official'),
('11111111-1a1a-0001-0000-000000000001', 'Andreu Soler', 'andreu_soler', '/assets/avatars/comic/andreu_soler_comic.png', 'ambassador'),
('11111111-1a1a-0001-0000-000000000002', 'Beatriz Ortega', 'beatriz_ortega', '/assets/avatars/comic/beatriz_ortega_comic.png', 'ambassador'),
('11111111-1a1a-0001-0000-000000000003', 'Carla Soriano', 'carla_soriano', '/assets/avatars/comic/carla_soriano_comic.png', 'ambassador'),
('11111111-1111-4111-a111-000000000009', 'Carmen la del Forn', 'cuinera', '/assets/avatars/comic/carmen_forn_comic.png', 'ambassador'),
('11111111-1111-4111-a111-000000000003', 'Vicent Ferris', 'vferris', '/assets/avatars/comic/vicent_ferris_comic.png', 'ambassador'),
('11111111-1111-4111-a111-000000000004', 'Samir Mensah', 'samirm', '/assets/avatars/comic/avatar_samir_comic.png', 'ambassador'),
('11111111-1111-4111-a111-000000000005', 'Mariamel', 'mariamel', '/assets/avatars/comic/avatar_mariamel_comic.png', 'ambassador'),
('11111111-1111-4111-a111-000000000008', 'Joan Batiste (Avi dels Papers)', 'joanbat', '/assets/avatars/comic/joan_batiste_comic.png', 'ambassador'),
('11111111-0000-0000-0000-000000000004', 'Marc (El Gall)', 'marcgall', '/assets/avatars/comic/avatar_marc_comic.png', 'official'),
('11111111-1111-4111-a111-000000000011', 'Elena Popova', 'elenap', '/assets/avatars/comic/elena_popova_comic.png', 'ambassador'),
('11111111-1111-4111-a111-000000000012', 'Joanet Serra', 'joanets', '/assets/avatars/comic/joanet_serra_comic.png', 'ambassador'),
('11111111-1111-4111-a111-000000000013', 'Lucia', 'lucia', '/assets/avatars/comic/avatar_lucia_comic.png', 'ambassador'),
('11111111-1a1a-0001-0000-000000000007', 'Pepica la de la Vall', 'pepica_vall', '/assets/avatars/comic/pepica_vall_comic.png', 'ambassador'),
('11111111-1a1a-0000-0000-000000000005', 'Nano Banana', 'nanob', '/assets/avatars/comic/nano_banana_comic.png', 'official')
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  role = EXCLUDED.role;

-- 3. Protecció del Llegat: Cedir la Camiseta de Sóc de Poble a la IAIA
-- Així no fem malbé una publicació tan important mentre el compte del Mestre està desconnectat.
UPDATE posts 
SET author_id = '11111111-1a1a-0000-0000-000000000000'
WHERE (content ILIKE '%samarreta%' 
   OR content ILIKE '%camiseta%' 
   OR content ILIKE '%sock%' 
   OR image_url ILIKE '%samarreta%'
   OR image_url ILIKE '%camiseta%')
AND author_id = 'd6325f44-7277-4d2d-b020-166c010995ab';

-- *NOTA MENTAL PER A DESPRÉS:* 
-- Els altres posts del Mestre ('d6325f44...') es queden congelats als llimbs.
-- Quan es torne a registrar (generant un NOU UUID), farem un UPDATE per re-assignar-li tota 
-- la seua història prèvia. Cap dada es perdrà.

COMMIT;

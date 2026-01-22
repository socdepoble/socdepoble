-- ==========================================
-- PHASE 7: SOCIAL ACTIVITY SEEDING (CORRECTED IDs)
-- ==========================================

BEGIN;

-- IDs De-facto (from migration_phase7_v2.sql)
-- Vicent: f0010000-0000-0000-0000-000000000001
-- Rosa: f0020000-0000-0000-0000-000000000002
-- Torremanzanas: 00000000-0000-0000-0000-000000000001
-- Cocentaina: 00000000-0000-0000-0000-000000000002

-- 1. Vincular pueblos
UPDATE profiles SET town_uuid = '00000000-0000-0000-0000-000000000002' WHERE id = 'f0010000-0000-0000-0000-000000000001'; -- Vicent -> Cocentaina
UPDATE profiles SET town_uuid = '00000000-0000-0000-0000-000000000001' WHERE id = 'f0020000-0000-0000-0000-000000000002'; -- Rosa -> Torremanzanas

-- 2. Limpiar actividad anterior si existe para evitar duplicados en test
DELETE FROM posts WHERE author_user_id IN ('f0010000-0000-0000-0000-000000000001', 'f0020000-0000-0000-0000-000000000002');

-- 3. Posts de Vicent
INSERT INTO posts (author, author_role, author_user_id, content, town_uuid, created_at)
VALUES 
('Vicent Ferris', 'vei', 'f0010000-0000-0000-0000-000000000001', 'Esmorzar de luxe al Bar de la Plaça de Cocentaina. No hi ha res com les nostres coques!', '00000000-0000-0000-0000-000000000002', NOW() - INTERVAL '1 hour'),
('Vicent Ferris', 'vei', 'f0010000-0000-0000-0000-000000000001', 'Prepareu-vos per a la fira, ja es nota l''ambient!', '00000000-0000-0000-0000-000000000002', NOW() - INTERVAL '4 hours');

-- 4. Posts de Rosa (Floristería)
INSERT INTO posts (author, author_role, author_user_id, author_entity_id, content, town_uuid, created_at)
VALUES 
('Floristería L''Aroma | Rosa Soler', 'empresa', 'f0020000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000044', 'Oferta especial de rams de nard per a la Torre! 🌸', '00000000-0000-0000-0000-000000000001', NOW() - INTERVAL '2 hours');

-- 5. Market Items
INSERT INTO market_items (title, description, price, tag, image_url, seller, seller_role, author_user_id, author_entity_id, town_uuid, created_at)
VALUES 
('Centres de Taula', 'Centres naturals fets amb flors de la Mariola.', '25€', 'productes', 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=400', 'Floristería L''Aroma | Rosa Soler', 'empresa', 'f0020000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000044', '00000000-0000-0000-0000-000000000001', NOW() - INTERVAL '1 day');

COMMIT;

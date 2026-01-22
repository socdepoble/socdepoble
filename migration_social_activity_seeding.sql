-- ==========================================
-- PHASE 7: SOCIAL ACTIVITY SEEDING
-- ==========================================

BEGIN;

-- 1. Asegurar vinculación de usuarios a pueblos (para que aparezcan los metadatos de ubicación)
UPDATE profiles SET town_uuid = '00000000-0000-0000-0000-000000000002' WHERE id = '11111111-0000-0000-0000-000000000001'; -- Vicent -> Cocentaina
UPDATE profiles SET town_uuid = '00000000-0000-0000-0000-000000000001' WHERE id = '11111111-0000-0000-0000-000000000002'; -- Rosa -> Torremanzanas
UPDATE profiles SET town_uuid = '00000000-0000-0000-0000-000000000001' WHERE id = '11111111-0000-0000-0000-000000000004'; -- Maria -> Torremanzanas
UPDATE profiles SET town_uuid = '00000000-0000-0000-0000-000000000007' WHERE id = '11111111-0000-0000-0000-000000000005'; -- Pau -> Muro

-- 2. Actividad de Vicent Ferris (Vei de Cocentaina)
INSERT INTO posts (author, author_role, author_user_id, content, town_uuid, created_at)
VALUES 
('Vicent Ferris', 'vei', '11111111-0000-0000-0000-000000000001', 'Acaben de traure el pa del forn de llenya de la plaça. Quina olor!', '00000000-0000-0000-0000-000000000002', NOW() - INTERVAL '2 hours'),
('Vicent Ferris', 'vei', '11111111-0000-0000-0000-000000000001', 'Algú sap a quina hora obrin la biblioteca hui?', '00000000-0000-0000-0000-000000000002', NOW() - INTERVAL '1 day');

-- 3. Actividad de Rosa Soler (Floristería L''Aroma)
INSERT INTO posts (author, author_role, author_user_id, author_entity_id, content, town_uuid, created_at)
VALUES 
('Floristería L''Aroma | Rosa Soler', 'empresa', '11111111-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000044', 'Ja tenim les noves orquídies per a aquesta setmana. Passeu a vore-les!', '00000000-0000-0000-0000-000000000001', NOW() - INTERVAL '5 hours');

INSERT INTO market_items (title, description, price, tag, image_url, seller, seller_role, author_user_id, author_entity_id, town_uuid, created_at)
VALUES 
('Rams de temporada', 'Selecció de flors fresques de la comarca.', '15€', 'productes', 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=400', 'Floristería L''Aroma | Rosa Soler', 'empresa', '11111111-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000044', '00000000-0000-0000-0000-000000000001', NOW() - INTERVAL '3 days');

-- 4. Actividad de Pau Garcia (Dimonis de Muro)
INSERT INTO posts (author, author_role, author_user_id, author_entity_id, content, town_uuid, created_at)
VALUES 
('Colla de Dimonis de Muro | Pau Garcia', 'grup', '11111111-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000022', 'Assaig general aquest divendres a les 20h. No falteu!', '00000000-0000-0000-0000-000000000007', NOW() - INTERVAL '1 hour');

-- 5. Interacciones (Likes/Connections) cruzadas
-- Vicent conecta con el post de Rosa
INSERT INTO post_connections (post_uuid, user_id, type)
SELECT uuid, '11111111-0000-0000-0000-000000000001', 'zap'
FROM posts WHERE author_user_id = '11111111-0000-0000-0000-000000000002' LIMIT 1;

-- Maria conecta con el post de Vicent
INSERT INTO post_connections (post_uuid, user_id, type)
SELECT uuid, '11111111-0000-0000-0000-000000000004', 'zap'
FROM posts WHERE author_user_id = '11111111-0000-0000-0000-000000000001' LIMIT 1;

COMMIT;

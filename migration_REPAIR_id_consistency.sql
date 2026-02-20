-- ==========================================
-- REPARACIÓN DE CONSISTENCIA DE IDs (Sóc de Poble)
-- ==========================================

BEGIN;

-- 1. Usar el esquema 11111111 que es el que tiene profiles reales
-- Actualizar migration_social_activity para usar IDs correctos

DELETE FROM posts WHERE author_user_id LIKE 'f00%';
DELETE FROM market_items WHERE author_user_id LIKE 'f00%';

-- 2. Insertar posts de demostración con IDs correctos (1111...)
INSERT INTO posts (author, author_role, author_user_id, content, town_uuid, created_at)
VALUES 
('Vicent Ferris', 'vei', '11111111-0000-0000-0000-000000000001', 
 'Bon dia des de Cocentaina! Acaben de traure el pa del forn. Quina olor!', 
 (SELECT uuid FROM towns WHERE name ILIKE '%Cocentaina%' LIMIT 1), 
 NOW() - INTERVAL '2 hours'),

('Vicent Ferris', 'vei', '11111111-0000-0000-0000-000000000001', 
 'Qui ve a la fira aquest cap de setmana? Jo no me la perdo!', 
 (SELECT uuid FROM towns WHERE name ILIKE '%Cocentaina%' LIMIT 1), 
 NOW() - INTERVAL '1 day');

-- Rosa con entidad
INSERT INTO posts (author, author_role, author_user_id, author_entity_id, content, town_uuid, created_at)
VALUES 
('Floristería L''Aroma | Rosa Soler', 'empresa', '11111111-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000044',
 'Ja tenim els rams d''hivern preparats! Passeu a veure''ls 🌸',
 (SELECT uuid FROM towns WHERE name ILIKE '%Torre%Maçanes%' LIMIT 1),
 NOW() - INTERVAL '3 hours');

-- Pau con entidad (Dimonis)
INSERT INTO posts (author, author_role, author_user_id, author_entity_id, content, town_uuid, created_at)
VALUES 
('Colla de Dimonis de Muro | Pau Garcia', 'grup', '11111111-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000022',
 'Assaig general aquest divendres a les 20h al local de sempre!',
 (SELECT uuid FROM towns WHERE name ILIKE '%Muro%' LIMIT 1),
 NOW() - INTERVAL '5 hours');

-- Maria (Dones)
INSERT INTO posts (author, author_role, author_user_id, author_entity_id, content, town_uuid, created_at)
VALUES 
('Assoc. de Dones de la Torre | Maria Blanes', 'grup', '11111111-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000033',
 'Recollida de farigola aquest dissabte al matí. Qui s''apunta?',
 (SELECT uuid FROM towns WHERE name ILIKE '%Torre%Maçanes%' LIMIT 1),
 NOW() - INTERVAL '6 hours');

-- 3. Market item de Rosa
INSERT INTO market_items (title, description, price, tag, image_url, seller, author_role, author_user_id, author_entity_id, town_uuid, created_at)
VALUES 
('Rams de Temporada', 'Flors fresques de la Mariola, fetes amb amor.', '18€', 'productes',
 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=400',
 'Floristería L''Aroma | Rosa Soler', 'empresa', 
 '11111111-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000044',
 (SELECT uuid FROM towns WHERE name ILIKE '%Torre%Maçanes%' LIMIT 1),
 NOW() - INTERVAL '1 day');

COMMIT;

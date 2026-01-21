-- =========================================================
-- PHASE 7: MASSIVE COMMUNITY ACTIVITY SEEDING (V2 - FIXED UUIDs)
-- =========================================================

BEGIN;

-- 1. Ensure Profiles have proper URLs (No Emojis for avatars)
-- Use 'f' instead of 'p' for valid HEX UUIDs
UPDATE profiles SET avatar_url = 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vicent' WHERE id = 'f0010000-0000-0000-0000-000000000001';
UPDATE profiles SET avatar_url = 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rosa' WHERE id = 'f0020000-0000-0000-0000-000000000002';
UPDATE profiles SET avatar_url = 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carles' WHERE id = 'f0030000-0000-0000-0000-000000000003';
UPDATE profiles SET avatar_url = 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria' WHERE id = 'f0040000-0000-0000-0000-000000000004';
UPDATE profiles SET avatar_url = 'https://api.dicebear.com/7.x/avataaars/svg?seed=Pau' WHERE id = 'f0050000-0000-0000-0000-000000000005';
UPDATE profiles SET avatar_url = 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena' WHERE id = 'f0060000-0000-0000-0000-000000000006';
UPDATE profiles SET avatar_url = 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jordi' WHERE id = 'f0010000-0000-0000-0000-000000000015';
UPDATE profiles SET avatar_url = 'https://api.dicebear.com/7.x/avataaars/svg?seed=Xavi' WHERE id = 'f0010000-0000-0000-0000-000000000013';
UPDATE profiles SET avatar_url = 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nuria' WHERE id = 'f0010000-0000-0000-0000-000000000018';

-- 2. Ensure Entities have proper URLs
UPDATE entities SET avatar_url = 'https://api.dicebear.com/7.x/bottts/svg?seed=Aroma' WHERE id = '00000000-0000-0000-0000-000000000044';
UPDATE entities SET avatar_url = 'https://api.dicebear.com/7.x/bottts/svg?seed=Banda' WHERE id = '00000000-0000-0000-0000-000000000066';
UPDATE entities SET avatar_url = 'https://api.dicebear.com/7.x/bottts/svg?seed=Muro' WHERE id = '00000000-0000-0000-0000-000000000011';
UPDATE entities SET avatar_url = 'https://api.dicebear.com/7.x/bottts/svg?seed=Cooperativa' WHERE id = '00000000-0000-0000-0000-000000000077';

-- 3. MASSIVE CONVERSATIONS (15+ total)
DELETE FROM conversations 
WHERE id >= 'c1111000-0000-0000-0000-000000000000' 
  AND id <= 'c1111000-ffff-ffff-ffff-ffffffffffff';

INSERT INTO conversations (id, participant_1_id, participant_1_type, participant_2_id, participant_2_type, last_message_content, last_message_at) VALUES
('c1111000-0000-0000-0000-000000000001', 'f0010000-0000-0000-0000-000000000001', 'user', '00000000-0000-0000-0000-000000000044', 'entity', 'Perfecte, ens veiem divendres.', now() - interval '2 hours'),
('c1111000-0000-0000-0000-000000000002', 'f0010000-0000-0000-0000-000000000013', 'user', 'f0010000-0000-0000-0000-000000000018', 'user', 'Guarda''m dos pans, gràcies!', now() - interval '1 hour'),
('c1111000-0000-0000-0000-000000000003', 'f0010000-0000-0000-0000-000000000016', 'user', '00000000-0000-0000-0000-000000000066', 'entity', 'L''assaig és a les 20h.', now() - interval '4 hours'),
('c1111000-0000-0000-0000-000000000004', 'f0010000-0000-0000-0000-000000000015', 'user', '00000000-0000-0000-0000-000000000011', 'entity', 'Gràcies per la info de l''ecoparc.', now() - interval '1 day'),
('c1111000-0000-0000-0000-000000000005', 'f0040000-0000-0000-0000-000000000004', 'user', 'f0010000-0000-0000-0000-000000000011', 'user', 'Vols farigola fresca?', now() - interval '30 minutes'),
('c1111000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000077', 'entity', '00000000-0000-0000-0000-000000000011', 'entity', 'Llista de productores enviada.', now() - interval '5 hours'),
('c1111000-0000-0000-0000-000000000007', 'f0010000-0000-0000-0000-000000000014', 'user', 'f0010000-0000-0000-0000-000000000021', 'user', 'Ens veiem a la plaça?', now() - interval '10 minutes'),
('c1111000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000055', 'entity', 'f0010000-0000-0000-0000-000000000001', 'user', 'Confirmem l''entrega de demà.', now() - interval '3 hours'),
('c1111000-0000-0000-0000-000000000009', 'f0010000-0000-0000-0000-000000000005', 'user', 'f0010000-0000-0000-0000-000000000006', 'user', 'Bon cafè Elena!', now() - interval '45 minutes'),
('c1111000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000011', 'entity', '00000000-0000-0000-0000-000000000022', 'entity', 'Reunió de comarca confirmada.', now() - interval '6 hours'),
('c1111000-0000-0000-0000-000000000011', 'f0010000-0000-0000-0000-000000000009', 'user', 'f0010000-0000-0000-0000-000000000010', 'user', 'Teniu loteria de Nadal?', now() - interval '2 days'),
('c1111000-0000-0000-0000-000000000012', 'f0010000-0000-0000-0000-000000000013', 'user', '00000000-0000-0000-0000-000000000044', 'entity', 'Vull encarregar un ram.', now() - interval '8 hours'),
('c1111000-0000-0000-0000-000000000013', 'f0010000-0000-0000-0000-000000000017', 'user', 'f0040000-0000-0000-0000-000000000004', 'user', 'Anem a caminar demà?', now() - interval '1.5 hours'),
('c1111000-0000-0000-0000-000000000014', '00000000-0000-0000-0000-000000000066', 'entity', 'f0010000-0000-0000-0000-000000000003', 'user', 'Full de ruta per al concert.', now() - interval '3 days'),
('c1111000-0000-0000-0000-000000000015', 'f0020000-0000-0000-0000-000000000002', 'user', 'f0010000-0000-0000-0000-000000000001', 'user', 'Et dec un cafè Vicent.', now() - interval '20 minutes');

-- 4. Sample Messages
INSERT INTO messages (conversation_id, sender_id, sender_entity_id, content, created_at) VALUES
('c1111000-0000-0000-0000-000000000001', 'f0010000-0000-0000-0000-000000000001', NULL, 'Hola Rosa, encara teniu margarides?', now() - interval '3 hours'),
('c1111000-0000-0000-0000-000000000001', 'f0020000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000044', 'Sí, unes precioses. Te les guarde?', now() - interval '2 hours'),
('c1111000-0000-0000-0000-000000000001', 'f0010000-0000-0000-0000-000000000001', NULL, 'Perfecte, ens veiem divendres.', now() - interval '1 hour');

COMMIT;

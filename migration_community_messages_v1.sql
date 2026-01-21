-- =========================================================
-- PHASE 7: COMMUNITY ACTIVITY SEEDING (MESSAGING)
-- =========================================================

BEGIN;

-- 1. CONVERSATIONS
INSERT INTO conversations (id, participant_1_id, participant_1_type, participant_2_id, participant_2_type, last_message_content, last_message_at) VALUES
-- Gent <-> Empresa (Floristería)
('c1111000-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', 'user', '00000000-0000-0000-0000-000000000044', 'entity', 'Perfecte, et confirme la comanda per a divendres.', now() - interval '2 hours'),
-- Gent <-> Empresa (Forn de Pa)
('c1111000-0000-0000-0000-000000000002', '11111111-0000-0000-0000-000000000013', 'user', '11111111-0000-0000-0000-000000000018', 'user', 'Guarda''m dos pans de quilo, Vicent.', now() - interval '1 hour'),
-- Gent <-> Grup (Banda de Música)
('c1111000-0000-0000-0000-000000000003', '11111111-0000-0000-0000-000000000016', 'user', '00000000-0000-0000-0000-000000000066', 'entity', 'A quina hora és l''assaig general?', now() - interval '4 hours'),
-- Gent <-> Entitat (Ajuntament)
('c1111000-0000-0000-0000-000000000004', '11111111-0000-0000-0000-000000000007', 'user', '00000000-0000-0000-0000-000000000011', 'entity', 'Moltes gràcies per la info sobre el permís.', now() - interval '1 day'),
-- Gent <-> Gent (Herbes de Mariola)
('c1111000-0000-0000-0000-000000000005', '11111111-0000-0000-0000-000000000004', 'user', '11111111-0000-0000-0000-000000000011', 'user', 'Tinc farigola fresca si en vols.', now() - interval '30 minutes'),
-- Empreses <-> Entitats (Cooperativa <-> Ajuntament)
('c1111000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000077', 'entity', '00000000-0000-0000-0000-000000000011', 'entity', 'Enviem la llista de productores locals.', now() - interval '5 hours')
ON CONFLICT (id) DO UPDATE SET last_message_content = EXCLUDED.last_message_content, last_message_at = EXCLUDED.last_message_at;

-- 2. MESSAGES (MUESTRA DE INTERACCIONES)

-- Conversación 1: Vicent & Floristería L'Aroma
INSERT INTO messages (conversation_id, sender_id, sender_entity_id, content, created_at) VALUES
('c1111000-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', NULL, 'Hola Rosa, teniu ramellets de flors de camp esta setmana?', now() - interval '3 hours'),
('c1111000-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000044', 'Sí Vicent! Ens han arribat unes margarides i llimonàries precioses.', now() - interval '2.5 hours'),
('c1111000-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', NULL, 'Perfecte, et confirme la comanda per a divendres.', now() - interval '2 hours');

-- Conversación 2: Xavi & Núria (Forn de Pa)
INSERT INTO messages (conversation_id, sender_id, sender_entity_id, content, created_at) VALUES
('c1111000-0000-0000-0000-000000000002', '11111111-0000-0000-0000-000000000013', NULL, 'Núria, bon dia. Tindreu coques de dacsa per a sopar?', now() - interval '1.5 hours'),
('c1111000-0000-0000-0000-000000000002', '11111111-0000-0000-0000-000000000018', NULL, 'Hola Xavi! En traurem unes poques a les 19:00. Quantes en vols?', now() - interval '1.2 hours'),
('c1111000-0000-0000-0000-000000000002', '11111111-0000-0000-0000-000000000013', NULL, 'Guarda''m dos pans de quilo, Vicent.', now() - interval '1 hour');

-- Conversación 3: Sara & Banda de Música
-- FIX: Usamos el ID de conversación correcto 'c1111000-0000-0000-0000-000000000003'
INSERT INTO messages (id, conversation_id, sender_id, sender_entity_id, content, created_at) VALUES
(gen_random_uuid(), 'c1111000-0000-0000-0000-000000000003', '11111111-0000-0000-0000-000000000016', NULL, 'Algú sap si finalment hi ha assaig de fusta avant de sopar?', now() - interval '5 hours'),
(gen_random_uuid(), 'c1111000-0000-0000-0000-000000000003', '11111111-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000066', 'Sí, a les 19:30 tots al local. Porteu la partitura de la marxa nova.', now() - interval '4.5 hours'),
(gen_random_uuid(), 'c1111000-0000-0000-0000-000000000003', '11111111-0000-0000-0000-000000000016', NULL, 'A quina hora és l''assaig general?', now() - interval '4 hours');

-- Conversación 4: Jordi & Ajuntament
INSERT INTO messages (conversation_id, sender_id, sender_entity_id, content, created_at) VALUES
('c1111000-0000-0000-0000-000000000004', '11111111-0000-0000-0000-000000000015', NULL, 'Bon dia, on puc consultar els horaris de l''ecoparc?', now() - interval '1.5 days'),
('c1111000-0000-0000-0000-000000000004', '11111111-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000011', 'Hola Jordi, els tens a la web municipal o al tauler d''anuncis. Matins de 9 a 13h.', now() - interval '1.2 days'),
('c1111000-0000-0000-0000-000000000004', '11111111-0000-0000-0000-000000000015', NULL, 'Moltes gràcies per la info sobre el permís.', now() - interval '1 day');

-- Conversación 5: Maria & Lluís (Veïns)
INSERT INTO messages (conversation_id, sender_id, sender_entity_id, content, created_at) VALUES
('c1111000-0000-0000-0000-000000000005', '11111111-0000-0000-0000-000000000011', NULL, 'Maria, has pujat hui a Mariola? He vist que bufava fort el ponent.', now() - interval '1 hour'),
('c1111000-0000-0000-0000-000000000005', '11111111-0000-0000-0000-000000000004', NULL, 'Un poquet sí, però per baix de les penyes es pot estar bé.', now() - interval '45 minutes'),
('c1111000-0000-0000-0000-000000000005', '11111111-0000-0000-0000-000000000004', NULL, 'Tinc farigola fresca si en vols.', now() - interval '30 minutes');

-- Conversación 6: Cooperativa & Ajuntament
INSERT INTO messages (conversation_id, sender_id, sender_entity_id, content, created_at) VALUES
('c1111000-0000-0000-0000-000000000006', '11111111-0000-0000-0000-000000000023', '00000000-0000-0000-0000-000000000077', 'Hola, necessitem confirmar els metres per al mercat artesà del diumenge.', now() - interval '7 hours'),
('c1111000-0000-0000-0000-000000000006', '11111111-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000011', 'Rebut. Vos ubiquem a la plaça Major, teniu uns 20 metres lineals.', now() - interval '6 hours'),
('c1111000-0000-0000-0000-000000000006', '11111111-0000-0000-0000-000000000023', '00000000-0000-0000-0000-000000000077', 'Enviem la llista de productores locals.', now() - interval '5 hours');

COMMIT;

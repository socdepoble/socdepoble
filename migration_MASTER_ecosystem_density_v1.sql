-- =========================================================
-- MASTER DEMO ECOSYSTEM: DENSITY EXPANSION (v1.2)
-- Afegix més vida per a arribar als objectius de 60 posts i 40 mercat.
-- =========================================================

BEGIN;

-- 1. NETEJA PREVENTIVA (Amb subconsultes segures per a evitar errors de càsting de tipus)
-- Primer netegem les connexions de posts usant els IDs reals dels posts
DELETE FROM post_connections 
WHERE post_uuid IN (SELECT uuid FROM posts WHERE id IN (211,212,221,231,241,251,301,302,303,304,305,306,307,308,311,312,313,314,315,316,317,318,319,320,321,322,323));

-- Ara ja podem esborrar els posts pel seu ID numèric
DELETE FROM posts WHERE id IN (211,212,221,231,241,251,301,302,303,304,305,306,307,308,311,312,313,314,315,316,317,318,319,320,321,322,323);

-- Netegem el mercat
DELETE FROM market_items WHERE id IN (319,320,321,322,323,324,325,327,328,329,330,331,332,333,335);

-- Netegem les converses (els IDs són UUIDs vàlids)
DELETE FROM conversations WHERE id IN ('c0000201-0000-0000-0000-000000000201','c0000202-0000-0000-0000-000000000202','c0000203-0000-0000-0000-000000000203','c0000204-0000-0000-0000-000000000204','c0000205-0000-0000-0000-000000000205','c0000206-0000-0000-0000-000000000206','c0000207-0000-0000-0000-000000000207','c0000208-0000-0000-0000-000000000208','c0000209-0000-0000-0000-000000000209','c0000210-0000-0000-0000-000000000210','c0000211-0000-0000-0000-000000000211','c0000302-0000-0000-0000-000000000302','c0000308-0000-0000-0000-000000000308');

-- 2. MÉS POSTS (Fins a ~60)
INSERT INTO posts (id, author, content, image_url, connections_count, created_at, author_user_id, author_entity_id, author_avatar) VALUES
(211, 'Ajuntament de la Torre', '🌳 Aquest diumenge, jornada de reforestació a la vora del riu. Inscriu-te!', '/images/assets/town_square.png', 89, NOW() - INTERVAL '1 day', NULL, '00000000-0000-0000-0000-000000000011', '/images/assets/aviso_oficial.png'),
(212, 'Ajuntament de la Torre', '🎭 Cinema a la fresca aquest dissabte a les 22:00. No oblideu la cadira!', NULL, 56, NOW() - INTERVAL '2 days', NULL, '00000000-0000-0000-0000-000000000011', '/images/assets/aviso_oficial.png'),
(221, 'Banda de Música La Lira', '🎶 Benvinguts els nous educands que comencen aquest curs a l''escola!', NULL, 47, NOW() - INTERVAL '2 days', NULL, '00000000-0000-0000-0000-000000000012', '/images/assets/banda_musica.png'),
(231, 'Floristeria L''Aroma', '🌿 Estem preparant els centres per a Tots Sants. Reserveu amb temps!', NULL, 18, NOW() - INTERVAL '1 day', NULL, '00000000-0000-0000-0000-000000000015', '/images/assets/flowers_bouquet.png'),
(241, 'Pau Garcia', 'Algú per a fer una partida de frontó aquesta vesprada? 🎾', NULL, 7, NOW() - INTERVAL '6 hours', '11111111-0000-0000-0000-000000000102', NULL, '/images/demo/avatar_man_1.png'),
(251, 'Maria Blanes', 'He trobat unes fotos antigues del poble. Les pujaré aquesta nit. 📸', NULL, 112, NOW() - INTERVAL '2 days', '11111111-0000-0000-0000-000000000101', NULL, '/images/demo/avatar_woman_old.png'),
(301, 'Carla Soriano', 'Algú sap si hi ha fibra òptica a la zona del Calvari? 📶', NULL, 12, NOW() - INTERVAL '1 hour', '11111111-0000-0000-0000-000000000103', NULL, '/images/demo/avatar_woman_1.png'),
(302, 'Andreu Soler', 'Demà al Bar Municipal tindrem tapes de bacallà. No falteu! 🥘', '/images/assets/olleta.png', 56, NOW() - INTERVAL '2 hours', '11111111-0000-0000-0000-000000000106', NULL, '/images/demo/avatar_man_1.png'),
(303, 'Lucía Belda', 'Recordeu que ha començat la vacunació al centre de salut.', NULL, 34, NOW() - INTERVAL '4 hours', '11111111-0000-0000-0000-000000000107', NULL, '/images/demo/avatar_woman_1.png'),
(304, 'Salva Jordà', 'Venc planter de ceba i enciam ben cuidat. Passeu pel bancal.', NULL, 18, NOW() - INTERVAL '5 hours', '11111111-0000-0000-0000-000000000114', NULL, '/images/demo/avatar_man_old.png'),
(305, 'Agrobotiga La Solana', '🍷 Nova remesa de vi de la terra. Venid i provad-lo!', '/images/assets/oli_premium.png', 21, NOW() - INTERVAL '1 day', NULL, '00000000-0000-0000-0000-000000000019', '/images/assets/mel_premium.png'),
(306, 'Associació de Dones Rurals', 'Workshop de teixit tradicional aquest dissabte. Inscriviu-vos!', '/images/assets/lexicon.png', 42, NOW() - INTERVAL '2 days', NULL, '00000000-0000-0000-0000-000000000023', '/images/assets/lexicon.png'),
(307, 'Fusteria L''Art', 'He acabat la restauració d''un arc antic. Quina satisfacció.', '/images/assets/llenya_premium.png', 67, NOW() - INTERVAL '3 days', NULL, '00000000-0000-0000-0000-000000000024', '/images/assets/llenya_premium.png'),
(308, 'Cooperativa Agrícola', 'Pròxima obertura de la campanya d''ametlla. Prepareu la collita!', NULL, 31, NOW() - INTERVAL '4 days', NULL, '00000000-0000-0000-0000-000000000016', '/images/assets/oli_premium.png'),
(311, 'Pau Garcia', 'Increïble la posta de sol d''avui des de la torre. Som uns privilegiats. 🌅', NULL, 156, NOW() - INTERVAL '2 hours', '11111111-0000-0000-0000-000000000102', NULL, '/images/demo/avatar_man_1.png'),
(312, 'Floristeria L''Aroma', '🌼 Floreixen els primers bulbs. La primavera ja s''olora.', '/images/assets/flowers_bouquet.png', 34, NOW() - INTERVAL '1 day', NULL, '00000000-0000-0000-0000-000000000015', '/images/assets/flowers_bouquet.png'),
(313, 'Grup Senderisme Penya L''Hedra', '📸 Fotos del Cim de l''Aitana. Una ruta dura però increïble.', '/images/assets/aitana.png', 92, NOW() - INTERVAL '2 days', NULL, '00000000-0000-0000-0000-000000000014', '/images/assets/senderisme_aitana.png'),
(314, 'Nerea Mollà', 'He vist bocs prop de la Carrasqueta. Respectem-los!', NULL, 128, NOW() - INTERVAL '3 days', '11111111-0000-0000-0000-000000000105', NULL, '/images/demo/avatar_woman_1.png'),
(315, 'Andreu Soler', 'Diumenge d''arròs al forn al Bar Municipal. Queden poques taules!', '/images/assets/olleta_premium.png', 45, NOW() - INTERVAL '4 hours', '11111111-0000-0000-0000-000000000106', NULL, '/images/demo/avatar_man_1.png'),
(316, 'Marc Sendra', 'Gràcies a la penya ciclista pel suport d''ahir. Sou els millors.', NULL, 28, NOW() - INTERVAL '5 days', '11111111-0000-0000-0000-000000000108', NULL, '/images/demo/avatar_man_1.png'),
(317, 'Sílvia Ferrándiz', 'Tancant el taller de hui amb ganes de vore els resultats. #artesania', '/images/assets/cantir.png', 21, NOW() - INTERVAL '6 hours', '11111111-0000-0000-0000-000000000109', NULL, '/images/demo/avatar_woman_old.png'),
(318, 'Rafa "El Fuster"', 'Mireu quina porta hem instal·lat al carrer de Baix. Pur roure.', '/images/assets/llenya_premium.png', 39, NOW() - INTERVAL '1 day', '11111111-0000-0000-0000-000000000110', NULL, '/images/demo/avatar_man_old.png'),
(319, 'Comissió de Festes', '🎉 Preparant el sopar de germanor. Estigueu atents!', NULL, 76, NOW() - INTERVAL '2 days', NULL, '00000000-0000-0000-0000-000000000017', '/images/assets/dansa_festa.png'),
(320, 'Ajuntament de la Torre', '🏛️ Inauguració de la nova sala d''exposicions de la casa de cultura.', '/images/assets/palau_cocentaina.png', 115, NOW() - INTERVAL '3 days', NULL, '00000000-0000-0000-0000-000000000011', '/images/assets/aviso_oficial.png'),
(321, 'Formatgeria Penya Roja', '🧀 Els nostres formatges han guanyat un premi! Gràcies!', '/images/assets/formatge.png', 245, NOW() - INTERVAL '4 days', NULL, '00000000-0000-0000-0000-000000000025', '/images/assets/formatge.png'),
(322, 'Beatriz Ortega', 'Moltíssima gent a la fira del llibre. El poble està orgullós.', NULL, 58, NOW() - INTERVAL '5 days', '11111111-0000-0000-0000-000000000113', NULL, '/images/demo/avatar_woman_1.png'),
(323, 'Salva Jordà', 'Tancant l''year amb una bona collita de nyespres.', NULL, 24, NOW() - INTERVAL '6 days', '11111111-0000-0000-0000-000000000114', NULL, '/images/demo/avatar_man_old.png');

-- 3. MÉS MERCAT (Fins a ~40)
INSERT INTO market_items (id, title, price, seller, image_url, tag, created_at, author_user_id, seller_entity_id, avatar_url) VALUES
(319, 'Melmelada de figues casera', '4€', 'Maria Blanes', '/images/assets/apples_premium.png', 'Alimentació', NOW() - INTERVAL '1 day', '11111111-0000-0000-0000-000000000101', NULL, '/images/demo/avatar_woman_old.png'),
(320, 'Oliva de la serra (boti)', '6€', 'Cooperativa Agrícola', '/images/assets/oli.png', 'Alimentació', NOW() - INTERVAL '5 hours', NULL, '00000000-0000-0000-0000-000000000016', '/images/assets/oli_premium.png'),
(321, 'Formatge de cabra baix en sal', '8€', 'Formatgeria Penya Roja', '/images/assets/formatge.png', 'Alimentació', NOW() - INTERVAL '2 hours', NULL, '00000000-0000-0000-0000-000000000025', '/images/assets/formatge.png'),
(322, 'Capa de dimoni (infantil)', '30€', 'Pau Garcia', '/images/assets/dansa_festa.png', 'Roba', NOW() - INTERVAL '3 days', '11111111-0000-0000-0000-000000000102', NULL, '/images/demo/avatar_man_1.png'),
(323, 'Servei de guia (Mariola)', '25€/p', 'Beatriz Ortega', '/images/assets/palau_cocentaina.png', 'Serveis', NOW() - INTERVAL '4 days', '11111111-0000-0000-0000-000000000113', NULL, '/images/demo/avatar_woman_1.png'),
(324, 'Bossa de tela "Sóc de Poble"', '10€', 'Ajuntament de la Torre', '/images/assets/lexicon.png', 'Souvenirs', NOW() - INTERVAL '6 days', NULL, '00000000-0000-0000-0000-000000000011', '/images/assets/aviso_oficial.png'),
(325, 'Herbes per a l''arròs al forn', '2€', 'Salva Jordà', NULL, 'Alimentació', NOW() - INTERVAL '1 day', '11111111-0000-0000-0000-000000000114', NULL, '/images/demo/avatar_man_old.png'),
(327, 'Vi negre criança (75cl)', '12€', 'Agrobotiga La Solana', '/images/assets/oli_premium.png', 'Alimentació', NOW() - INTERVAL '5 hours', NULL, '00000000-0000-0000-0000-000000000019', '/images/assets/mel_premium.png'),
(328, 'Melmelada de tomata roja', '5€', 'Vicent Ferris', '/images/assets/tomates.png', 'Alimentació', NOW() - INTERVAL '2 hours', '11111111-0000-0000-0000-000000000001', NULL, '/images/demo/avatar_man_old.png'),
(329, 'Herbero caser (format mini)', '5€', 'Salva Jordà', NULL, 'Alimentació', NOW() - INTERVAL '1 day', '11111111-0000-0000-0000-000000000114', NULL, '/images/demo/avatar_man_old.png'),
(330, 'Formatge madurat amb herbes', '15€', 'Formatgeria Penya Roja', '/images/assets/formatge.png', 'Alimentació', NOW() - INTERVAL '3 days', NULL, '00000000-0000-0000-0000-000000000025', '/images/assets/formatge.png'),
(331, 'Ram de nuvia (encàrrec)', 'Consultar', 'Floristeria L''Aroma', '/images/assets/flowers_bouquet.png', 'Esdeveniments', NOW() - INTERVAL '4 days', NULL, '00000000-0000-0000-0000-000000000015', '/images/assets/flowers_bouquet.png'),
(332, 'Moble restaurat (vintage)', '150€', 'Fusteria L''Art', '/images/assets/llenya_premium.png', 'Llar', NOW() - INTERVAL '6 days', NULL, '00000000-0000-0000-0000-000000000024', '/images/assets/llenya_premium.png'),
(333, 'Plànol de rutes senderistes', '5€', 'Oficina de Turisme', '/images/assets/aitana.png', 'Turisme', NOW() - INTERVAL '1 day', NULL, '00000000-0000-0000-0000-000000000022', '/images/assets/palau_cocentaina.png'),
(335, 'Planter de carxofa', '1.5€', 'Vicent Ferris', NULL, 'Alimentació', NOW() - INTERVAL '1 day', '11111111-0000-0000-0000-000000000001', NULL, '/images/demo/avatar_man_old.png');

-- 4. MÉS CONVERSES (Fins a ~20)
INSERT INTO conversations (id, participant_1_id, participant_1_type, participant_2_id, participant_2_type, last_message_content, last_message_at, is_demo) VALUES
('c0000203-0000-0000-0000-000000000203', '11111111-0000-0000-0000-000000000001', 'user', '11111111-0000-0000-0000-000000000110', 'user', 'Rafa, quan pugues passa''t pel bancal.', NOW() - INTERVAL '1 hour', true),
('c0000204-0000-0000-0000-000000000204', '11111111-0000-0000-0000-000000000001', 'user', '00000000-0000-0000-0000-000000000011', 'entity', 'Gràcies per la info de l''autobús.', NOW() - INTERVAL '2 hours', true),
('c0000205-0000-0000-0000-000000000205', '11111111-0000-0000-0000-000000000001', 'user', '11111111-0000-0000-0000-000000000103', 'user', 'Busquem local per al coworking?', NOW() - INTERVAL '1 day', true),
('c0000206-0000-0000-0000-000000000206', '11111111-0000-0000-0000-000000000001', 'user', '11111111-0000-0000-0000-000000000102', 'user', 'Pau, avui no puc anar al frontó.', NOW() - INTERVAL '3 hours', true),
('c0000207-0000-0000-0000-000000000207', '11111111-0000-0000-0000-000000000001', 'user', '00000000-0000-0000-0000-000000000016', 'entity', 'Quant està l''ametlla avui?', NOW() - INTERVAL '1 day', true),
('c0000208-0000-0000-0000-000000000208', '11111111-0000-0000-0000-000000000113', 'user', '11111111-0000-0000-0000-000000000001', 'user', 'Beatriz, m''expliques la història de la torre?', NOW() - INTERVAL '2 days', true),
('c0000209-0000-0000-0000-000000000209', '11111111-0000-0000-0000-000000000001', 'user', '00000000-0000-0000-0000-000000000012', 'entity', 'Gran concert ahir!', NOW() - INTERVAL '3 days', true),
('c0000210-0000-0000-0000-000000000210', '11111111-0000-0000-0000-000000000001', 'user', '00000000-0000-0000-0000-000000000021', 'entity', 'Reserva''m taula per a quatre.', NOW() - INTERVAL '4 days', true),
('c0000302-0000-0000-0000-000000000302', '11111111-0000-0000-0000-000000000102', 'user', '00000000-0000-0000-0000-000000000012', 'entity', 'A quina hora és l''assaig?', NOW() - INTERVAL '1 day', true),
('c0000308-0000-0000-0000-000000000308', '11111111-0000-0000-0000-000000000109', 'user', '11111111-0000-0000-0000-000000000114', 'user', 'Salva, necessite herba de Sant Joan.', NOW() - INTERVAL '2 days', true);

COMMIT;

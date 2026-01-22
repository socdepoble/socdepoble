-- =========================================================
-- MASTER DEMO ECOSYSTEM v1: SÓC DE POBLE (BULLETPROOF EDITION)
-- Una comunidad viva, real e interconectada.
-- =========================================================

BEGIN;

-- 0. SCHEMA PRE-REQUISITS
ALTER TABLE posts ADD COLUMN IF NOT EXISTS author_avatar TEXT;
ALTER TABLE market_items ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- 1. CLEANUP ORDENADO (Evitar errors de Foreign Key i UNIQUE constraints)
-- Identifiquem els "actor sets" de demo per ID i per nom per a una neteja total

-- 1.1 Esborrar interaccions i referències
DELETE FROM post_connections 
WHERE user_id::text LIKE '11111111-0000-0000-0000-%'
   OR user_id IN (SELECT id FROM profiles WHERE username IN ('vferris', 'mariab_torre', 'pau_foc', 'carla_disenys', 'joanet_serra', 'nerea_bio', 'andreu_cuina', 'lu_bel', 'marc_cycling', 'silvia_mestre', 'rafa_fusta', 'tere_flors', 'ximo_rural', 'bea_turismo', 'salva_agro'));

DELETE FROM conversations 
WHERE is_demo = true
   OR participant_1_id::text LIKE '11111111-0000-0000-0000-%' OR participant_2_id::text LIKE '11111111-0000-0000-0000-%'
   OR participant_1_id::text LIKE '00000000-0000-0000-0000-%' OR participant_2_id::text LIKE '00000000-0000-0000-0000-%';

-- 1.2 Esborrar POSTS i MARKET ITEMS de demo
-- Netegem qualsevol cosa que apunte als nostres personatges, inclús si l'ID d'entitat és aleatori (per nom)
DELETE FROM market_items 
WHERE author_user_id::text LIKE '11111111-0000-0000-0000-%'
   OR seller_entity_id::text LIKE '00000000-0000-0000-0000-%'
   OR seller_entity_id IN (SELECT id FROM entities WHERE name IN ('Ajuntament de la Torre', 'Banda de Música La Lira', 'Forn de la Plaça', 'Grup Senderisme Penya L''Hedra', 'Floristeria L''Aroma', 'Cooperativa Agrícola', 'Comissió de Festes', 'Centre Excursionista Penàguila', 'Agrobotiga La Solana', 'Associació de Veïns', 'Bar Municipal', 'Oficina de Turisme', 'Associació de Dones Rurals', 'Fusteria L''Art', 'Formatgeria Penya Roja'))
   OR id >= 300 AND id < 900;

DELETE FROM posts 
WHERE author_user_id::text LIKE '11111111-0000-0000-0000-%'
   OR author_entity_id::text LIKE '00000000-0000-0000-0000-%'
   OR author_entity_id IN (SELECT id FROM entities WHERE name IN ('Ajuntament de la Torre', 'Banda de Música La Lira', 'Forn de la Plaça', 'Grup Senderisme Penya L''Hedra', 'Floristeria L''Aroma', 'Cooperativa Agrícola', 'Comissió de Festes', 'Centre Excursionista Penàguila', 'Agrobotiga La Solana', 'Associació de Veïns', 'Bar Municipal', 'Oficina de Turisme', 'Associació de Dones Rurals', 'Fusteria L''Art', 'Formatgeria Penya Roja'))
   OR id >= 200 AND id < 900;

-- 1.3 Esborrar les identitats mare (Profiles i Entities)
DELETE FROM profiles 
WHERE id::text LIKE '11111111-0000-0000-0000-%' 
   OR username IN ('vferris', 'mariab_torre', 'pau_foc', 'carla_disenys', 'joanet_serra', 'nerea_bio', 'andreu_cuina', 'lu_bel', 'marc_cycling', 'silvia_mestre', 'rafa_fusta', 'tere_flors', 'ximo_rural', 'bea_turismo', 'salva_agro');

DELETE FROM entities 
WHERE id::text LIKE '00000000-0000-0000-0000-%' 
   OR name IN ('Ajuntament de la Torre', 'Banda de Música La Lira', 'Forn de la Plaça', 'Grup Senderisme Penya L''Hedra', 'Floristeria L''Aroma', 'Cooperativa Agrícola', 'Comissió de Festes', 'Centre Excursionista Penàguila', 'Agrobotiga La Solana', 'Associació de Veïns', 'Bar Municipal', 'Oficina de Turisme', 'Associació de Dones Rurals', 'Fusteria L''Art', 'Formatgeria Penya Roja');


-- 2. INSERCIÓ D'IDENTITATS (Sense ON CONFLICT per a evitar errors de constraint)

-- 2.1 Profiles (15 Persones)
INSERT INTO profiles (id, full_name, username, avatar_url, role, bio) VALUES
('11111111-0000-0000-0000-000000000001', 'Vicent Ferris', 'vferris', '/images/demo/avatar_man_old.png', 'vei', 'Llaurador jubilat de Cocentaina. Conec cada pam de terra de la comarca i m’agrada compartir la història del nostre poble.'),
('11111111-0000-0000-0000-000000000101', 'Maria Blanes', 'mariab_torre', '/images/demo/avatar_woman_old.png', 'vei', 'Mestra jubilada a la Torre. Crec en la força de la dona rural i en la importància de donar suport als nostres veïns.'),
('11111111-0000-0000-0000-000000000102', 'Pau Garcia', 'pau_foc', '/images/demo/avatar_man_1.png', 'vei', 'Estudiant i membre de la Colla de Dimonis. El foc i el tabalet són el ritme que mou la meua vida.'),
('11111111-0000-0000-0000-000000000103', 'Carla Soriano', 'carla_disenys', '/images/demo/avatar_woman_1.png', 'vei', 'Dissenyadora gràfica treballant en remot des de Penàguila. Buscant l''equilibri entre el silenci i la fibra òptica.'),
('11111111-0000-0000-0000-000000000104', 'Joan Batiste', 'joanet_serra', '/images/demo/avatar_man_old.png', 'vei', 'Pastor de Benifallim. Les meues cabres i jo coneixem bé la Serra d''Aitana. Sempre amb el meu gaito.'),
('11111111-0000-0000-0000-000000000105', 'Nerea Mollà', 'nerea_bio', '/images/demo/avatar_woman_1.png', 'vei', 'Biòloga i activista pel medi ambient. Organitze rutes per a conéixer la riquesa botànica del Xortà.'),
('11111111-0000-0000-0000-000000000106', 'Andreu Soler', 'andreu_cuina', '/images/demo/avatar_man_1.png', 'vei', 'Cuintater apassionat per la recepta tradicional de l’olleta de blat. El secret està en la paciència.'),
('11111111-0000-0000-0000-000000000107', 'Lucía Belda', 'lu_bel', '/images/demo/avatar_woman_1.png', 'vei', 'Farmacèutica del poble. Aquí estem per a cuidar-nos entre tots, més enllà de les receptes.'),
('11111111-0000-0000-0000-000000000108', 'Marc Sendra', 'marc_cycling', '/images/demo/avatar_man_1.png', 'vei', 'Aficionat al ciclisme de muntanya. No hi ha millor port de muntanya que el de la Carrasqueta.'),
('11111111-0000-0000-0000-000000000109', 'Sílvia Ferrándiz', 'silvia_mestre', '/images/demo/avatar_woman_old.png', 'vei', 'Artesana del vímec i les fibres naturals. Aprenent i ensenyant un ofici que no volem que muira.'),
('11111111-0000-0000-0000-000000000110', 'Rafa "El Fuster"', 'rafa_fusta', '/images/demo/avatar_man_old.png', 'vei', 'Fuster de mans dures i cor gran. Si és de fusta i de la Mariola, jo ho puc restaurar.'),
('11111111-0000-0000-0000-000000000111', 'Teresa "La de les Flors"', 'tere_flors', '/images/demo/avatar_woman_old.png', 'vei', 'Guardiana dels jardins del poble. Les flors parlen quan nosaltres callem.'),
('11111111-0000-0000-0000-000000000112', 'Ximo Carbonell', 'ximo_rural', '/images/demo/avatar_man_1.png', 'vei', 'Emprenedor rural. Crec que el futur del nostre poble passa per la innovació i el respecte a la terra.'),
('11111111-0000-0000-0000-000000000113', 'Beatriz Ortega', 'bea_turismo', '/images/demo/avatar_woman_1.png', 'vei', 'Guia turística. M''encanta explicar les històries que amaguen les pedres del palau de Cocentaina.'),
('11111111-0000-0000-0000-000000000114', 'Salva Jordà', 'salva_agro', '/images/demo/avatar_man_old.png', 'vei', 'Expert en herbes medicinals i remeis tradicionals. La natura té la cura si saps on buscar.');

-- 2.2 Entities (15 Entitats)
INSERT INTO entities (id, name, type, description, avatar_url) VALUES
('00000000-0000-0000-0000-000000000011', 'Ajuntament de la Torre', 'oficial', 'Consistori de La Torre de les Maçanes. Treballant pel benestar dels veïns.', '/images/assets/aviso_oficial.png'),
('00000000-0000-0000-0000-000000000012', 'Banda de Música La Lira', 'grup', 'Agrupació musical centenària. La banda sonora del poble.', '/images/assets/banda_musica.png'),
('00000000-0000-0000-0000-000000000013', 'Forn de la Plaça', 'empresa', 'Pa artesà cuit en forn de llenya. Tradició que pots olorar cada matí.', '/images/assets/coques_premium.png'),
('00000000-0000-0000-0000-000000000014', 'Grup Senderisme Penya L''Hedra', 'grup', 'Amants de la muntanya i el senderisme. Rutes setmanals.', '/images/assets/senderisme_aitana.png'),
('00000000-0000-0000-0000-000000000015', 'Floristeria L''Aroma', 'empresa', 'Flors fresques i rams amb ànima. Posem color als teus moments.', '/images/assets/flowers_bouquet.png'),
('00000000-0000-0000-0000-000000000016', 'Cooperativa Agrícola', 'empresa', 'Productors locals d’oli i ametla. El sabor autèntic de la terra.', '/images/assets/oli_premium.png'),
('00000000-0000-0000-0000-000000000017', 'Comissió de Festes', 'grup', 'Els encarregats d''organitzar la il·lusió dels nostres festejos.', '/images/assets/dansa_festa.png'),
('00000000-0000-0000-0000-000000000018', 'Centre Excursionista Penàguila', 'grup', 'Explorant els cims de la Mariola i l''Aitana des de fa dècades.', '/images/assets/aitana.png'),
('00000000-0000-0000-0000-000000000019', 'Agrobotiga La Solana', 'empresa', 'Selecció de productes km 0: mel, formatges i herbero.', '/images/assets/mel_premium.png'),
('00000000-0000-0000-0000-000000000020', 'Associació de Veïns', 'grup', 'Veu i unió de la comunitat per a millorar el dia a dia.', '/images/assets/notice.png'),
('00000000-0000-0000-0000-000000000021', 'Bar Municipal', 'empresa', 'L''epicentre social de la plaça. Bon cafè i millors tapes.', '/images/assets/olleta_premium.png'),
('00000000-0000-0000-0000-000000000022', 'Oficina de Turisme', 'oficial', 'Tota la informació per a gaudir del nostre patrimoni.', '/images/assets/palau_cocentaina.png'),
('00000000-0000-0000-0000-000000000023', 'Associació de Dones Rurals', 'grup', 'Treballant per la visibilitat de la dona rural.', '/images/assets/lexicon.png'),
('00000000-0000-0000-0000-000000000024', 'Fusteria L''Art', 'empresa', 'Artesania tradicional en fusta i restauració.', '/images/assets/llenya_premium.png'),
('00000000-0000-0000-0000-000000000025', 'Formatgeria Penya Roja', 'empresa', 'Formatges de cabra artesans del nostre ramat.', '/images/assets/formatge.png');


-- 3. FEED ACTIVITY (~30 posts inicials)
INSERT INTO posts (id, author, content, image_url, connections_count, created_at, author_user_id, author_entity_id, author_avatar) VALUES
(201, 'Vicent Ferris', 'Avui he pujat al Rentonar i les oliveres ja comencen a demanar aigua. 🌦️ #rural #olives', '/images/assets/generic_street.png', 15, NOW() - INTERVAL '1 hour', '11111111-0000-0000-0000-000000000001', NULL, '/images/demo/avatar_man_old.png'),
(202, 'Vicent Ferris', 'Algú sap si l''autobús de migdia pujarà avui des d''Alcoi? Tinc que anar al metge.', NULL, 8, NOW() - INTERVAL '5 hour', '11111111-0000-0000-0000-000000000001', NULL, '/images/demo/avatar_man_old.png'),
(210, 'Ajuntament de la Torre', '📢 ATENCIÓ: Obres al carrer Major demà matí. Trànsit tallat.', '/images/assets/aviso_oficial.png', 45, NOW() - INTERVAL '2 hours', NULL, '00000000-0000-0000-0000-000000000011', '/images/assets/aviso_oficial.png'),
(220, 'Banda de Música La Lira', '🎺 Assaig general divendres per a les festes de la Puríssima!', '/images/assets/banda_musica.png', 32, NOW() - INTERVAL '3 hours', NULL, '00000000-0000-0000-0000-000000000012', '/images/assets/banda_musica.png'),
(230, 'Floristeria L''Aroma', '🌸 Ja tenim els ciclamens de temporada! Vine a pel teu.', '/images/assets/flowers_bouquet.png', 24, NOW() - INTERVAL '4 hours', NULL, '00000000-0000-0000-0000-000000000015', '/images/assets/flowers_bouquet.png'),
(240, 'Pau Garcia', 'Increïble el concert d''ahir de la banda! 🤘', NULL, 56, NOW() - INTERVAL '12 hours', '11111111-0000-0000-0000-000000000102', NULL, '/images/demo/avatar_man_1.png'),
(250, 'Maria Blanes', 'Quina joia veure tants xiquets a la jornada de reforestació. Educació i natura!', NULL, 78, NOW() - INTERVAL '1 day', '11111111-0000-0000-0000-000000000101', NULL, '/images/demo/avatar_woman_old.png'),
(260, 'Formatgeria Penya Roja', '🐐 Comencem amb la curació dels formatges de tardor. Paciència i bona llet.', '/images/assets/formatge.png', 42, NOW() - INTERVAL '6 hours', NULL, '00000000-0000-0000-0000-000000000025', '/images/assets/formatge.png'),
(270, 'Agrobotiga La Solana', '🍯 Mel de mil-flors collida aquesta setmana a l''Aitana. Pura energia!', '/images/assets/mel_premium.png', 31, NOW() - INTERVAL '8 hours', NULL, '00000000-0000-0000-0000-000000000019', '/images/assets/mel_premium.png'),
(280, 'Carla Soriano', 'Sortir a caminar al migdia i trobar-te amb aquestes vistes... #coworking', '/images/assets/aitana.png', 67, NOW() - INTERVAL '1 day', '11111111-0000-0000-0000-000000000103', NULL, '/images/demo/avatar_woman_1.png'),
(290, 'Vicent Ferris', 'Pericana feta aquest matí. Huele que alimenta! #pericana #tradicio', '/images/assets/olleta.png', 28, NOW() - INTERVAL '1 hour', '11111111-0000-0000-0000-000000000001', NULL, '/images/demo/avatar_man_old.png');


-- 4. MARKET ITEMS (~20 items inicials)
INSERT INTO market_items (id, title, price, seller, image_url, tag, created_at, author_user_id, seller_entity_id, avatar_url) VALUES
(301, 'Oli Verge Extra (5L)', '38€', 'Cooperativa Agrícola', '/images/assets/oli_premium.png', 'Alimentació', NOW(), NULL, '00000000-0000-0000-0000-000000000016', '/images/assets/oli_premium.png'),
(302, 'Mel de Romer Artesana', '10€', 'Agrobotiga La Solana', '/images/assets/mel_premium.png', 'Alimentació', NOW() - INTERVAL '1 hour', NULL, '00000000-0000-0000-0000-000000000019', '/images/assets/mel_premium.png'),
(303, 'Llenya d''Ametler Seca', '120€/t', 'Vicent Ferris', '/images/assets/llenya_premium.png', 'Llar', NOW() - INTERVAL '3 hours', '11111111-0000-0000-0000-000000000001', NULL, '/images/demo/avatar_man_old.png'),
(304, 'Formatge Curat de Cabra', '12€', 'Formatgeria Penya Roja', '/images/assets/formatge.png', 'Alimentació', NOW() - INTERVAL '5 hours', NULL, '00000000-0000-0000-0000-000000000025', '/images/assets/formatge.png'),
(305, 'Pastissets de Moniato', '8€', 'Forn de la Plaça', '/images/assets/coques_premium.png', 'Alimentació', NOW() - INTERVAL '1 day', NULL, '00000000-0000-0000-0000-000000000013', '/images/assets/coques_premium.png'),
(312, 'Ram de flors silvestres', '15€', 'Floristeria L''Aroma', '/images/assets/flowers_bouquet.png', 'Hogar', NOW() - INTERVAL '2 days', NULL, '00000000-0000-0000-0000-000000000015', '/images/assets/flowers_bouquet.png'),
(318, 'Coques de tomaca (unitat)', '2.5€', 'Forn de la Plaça', '/images/assets/coques_premium.png', 'Alimentació', NOW() - INTERVAL '10 hours', NULL, '00000000-0000-0000-0000-000000000013', '/images/assets/coques_premium.png');


-- 5. CONVERSATIONS
INSERT INTO conversations (id, participant_1_id, participant_1_type, participant_2_id, participant_2_type, last_message_content, last_message_at, is_demo) VALUES
('c0000201-0000-0000-0000-000000000201', '11111111-0000-0000-0000-000000000001', 'user', '11111111-0000-0000-0000-000000000101', 'user', 'Maria, t''he reservat un poc d''herbero del bo.', NOW(), true),
('c0000202-0000-0000-0000-000000000202', '11111111-0000-0000-0000-000000000001', 'user', '00000000-0000-0000-0000-000000000013', 'entity', 'Passe demà pel forn a per les coques.', NOW() - INTERVAL '10 minutes', true),
('c0000211-0000-0000-0000-000000000211', '11111111-0000-0000-0000-000000000001', 'user', '11111111-0000-0000-0000-000000000108', 'user', 'Marc, baixes a Alcoi demà amb el cotxe?', NOW() - INTERVAL '1 hour', true);

COMMIT;

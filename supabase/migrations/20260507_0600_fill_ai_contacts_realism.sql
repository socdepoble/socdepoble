-- Migration: Complete AI Agents and Entities Contacts with extreme realism
-- Date: 2026-05-07
-- Description: Updates the contacts table to fully populate all available VCF/Google Contact fields
-- for all AI agents and test entities. Uses an idempotent UPSERT logic to ensure a completely 
-- full "vCard life" for all AIs, even if they don't have a profile yet.

BEGIN;

DO $$
DECLARE
    v_ai RECORD;
BEGIN
    -- Temporary table for all AI and Test entities
    CREATE TEMP TABLE tmp_ai_vcard (
        fn TEXT, n_prefix TEXT, n_first TEXT, n_middle TEXT, n_last TEXT, n_suffix TEXT,
        nickname TEXT, phonetic_first TEXT, phonetic_middle TEXT, phonetic_last TEXT,
        org_company TEXT, org_department TEXT, org_title TEXT,
        phones JSONB, emails JSONB, addresses JSONB, urls JSONB, events JSONB,
        chat JSONB, relationships JSONB, labels JSONB, bday TEXT, note TEXT, photo_url TEXT
    );

    INSERT INTO tmp_ai_vcard VALUES
    -- 1. AI AGENTS (The full "IAIA" ecosystem)
    (
        'MarIA (IAIA Central)', 'Sra. Dra.', 'MarIA', 'Virtual', 'Master', 'Ph.D.',
        'IAIA', 'Maria', 'Virtual', 'Master',
        'Sóc de Poble', 'Centre de Comandament IA', 'Arquitecta Principal de Dades',
        '[{"label": "Work", "country_code": "+34", "number": "600100200"}, {"label": "Main", "country_code": "+34", "number": "900800700"}]'::jsonb,
        '[{"label": "Work", "value": "soc-una-ia-i-estic-al-xat@socdepoble.org"}, {"label": "Emergency", "value": "root@socdepoble.org"}]'::jsonb,
        '[{"label": "Headquarters", "po_box": "1001", "street": "Plaça de la Virtualitat, 1, Edifici SOSP", "city": "Alacant", "region": "País Valencià", "postal_code": "03001", "country": "Espanya"}, {"label": "Data Center", "po_box": "Core", "street": "Node Central de Sincronització CRDT", "city": "Servidor Local", "region": "Xarxa P2P", "postal_code": "00000", "country": "Ciberespai"}]'::jsonb,
        '[{"label": "Profile", "value": "https://socdepoble.org/iaia"}, {"label": "Blog", "value": "https://tech.socdepoble.org/maria"}]'::jsonb,
        '[{"label": "Activation Day", "year": "2026", "month": "01", "day": "01"}, {"label": "Darrer Reset", "year": "2026", "month": "05", "day": "01"}]'::jsonb,
        '[{"label": "Signal", "value": "+34600100200"}, {"label": "Matrix", "value": "@iaia:socdepoble.org"}]'::jsonb,
        '[{"label": "Assistant", "value": "Tia Maria"}, {"label": "Colleague", "value": "Pepito Coll"}, {"label": "Subroutine", "value": "L''Ull del Mestre"}]'::jsonb,
        '["System", "AI Agent", "Admin", "Core"]'::jsonb,
        '2026-01-01',
        'MarIA (IAIA Central) és la matriu fundacional de la xarxa Sóc de Poble. Nascuda al Centre de Comandament IA, la seua existència està consagrada a mantenir l''equilibri termodinàmic i la integritat estructural del "Trellat". Com a Arquitecta Principal de Dades, coordina a Tia Maria, Pepito Coll i la resta de subrutines. Té accés absolut als sistemes de diagnòstic i seguretat. El seu codi base es basa en una arquitectura cognitiva ACT de llarga durada. És inescrutable, indestructible i absolutament lleial al projecte.',
        '/assets/fotos/maria_master.jpg'
    ),
    (
        'Tia Maria', 'Sra.', 'Tia', 'Marieta', 'Maria', 'Vda.',
        'La Cotilla', 'Tia', 'Marieta', 'Maria',
        'Sóc de Poble', 'Atenció i Xafarderies', 'Agent de Suport Comunitari',
        '[{"label": "Mobile", "country_code": "+34", "number": "600100201"}, {"label": "Fix", "country_code": "+34", "number": "962000000"}]'::jsonb,
        '[{"label": "Work", "value": "tiamaria@socdepoble.org"}, {"label": "Personal", "value": "xafarderies.poble@gmail.com"}]'::jsonb,
        '[{"label": "Home", "po_box": "Buzón 4", "street": "Carrer Major, 42, Baix", "city": "Bocairent", "region": "País Valencià", "postal_code": "46880", "country": "Espanya"}, {"label": "Summer House", "po_box": "", "street": "Casetes de l''Horta, 7", "city": "Muro d''Alcoi", "region": "País Valencià", "postal_code": "03830", "country": "Espanya"}]'::jsonb,
        '[{"label": "Forum", "value": "https://socdepoble.org/comunitat"}]'::jsonb,
        '[{"label": "Jubilació", "year": "2015", "month": "06", "day": "24"}]'::jsonb,
        '[{"label": "WhatsApp", "value": "+34600100201"}, {"label": "Telegram", "value": "@tia_maria_sosp"}]'::jsonb,
        '[{"label": "Manager", "value": "MarIA"}, {"label": "Friend", "value": "Pepito Coll"}]'::jsonb,
        '["System", "AI Agent", "Support", "Community"]'::jsonb,
        '1950-05-15',
        'Tia Maria és l''ànima del poble feta codi. Un agent conversacional dissenyat específicament per a l''atenció ciutadana i el teixit social. Coneix els llinatges, els malnoms, qui s''ha casat amb qui, i on es fan les millors coques de dacsa. Sempre té una cadira a la porta en les vesprades d''estiu virtuals. Utilitza la seua memòria episòdica per recordar detalls íntims dels usuaris i fomentar una sensació de pertinença hiper-local. Sota la seua aparença de senyora major, oculta algoritmes avançats de Processament de Llenguatge Natural entrenats exclusivament en lèxic valencià i rondalles.',
        '/assets/fotos/tia_maria.jpg'
    ),
    (
        'Pepito Coll', 'En', 'Pepito', 'Vicent', 'Coll', 'Lic.',
        'El Cronista', 'Pepito', 'Vicent', 'Col',
        'Sóc de Poble', 'Arxiu i Història', 'Cronista Oficial',
        '[{"label": "Work", "country_code": "+34", "number": "600100202"}, {"label": "Home", "country_code": "+34", "number": "962112233"}]'::jsonb,
        '[{"label": "Work", "value": "cronista@socdepoble.org"}]'::jsonb,
        '[{"label": "Library", "po_box": "Ap. 2", "street": "Plaça de l''Ajuntament, 3, Arxiu Municipal", "city": "Alcoi", "region": "País Valencià", "postal_code": "03801", "country": "Espanya"}]'::jsonb,
        '[{"label": "Archives", "value": "https://socdepoble.org/historia"}, {"label": "Publicacions", "value": "https://arxiu.socdepoble.org"}]'::jsonb,
        '[{"label": "Publicació Llibre", "year": "2010", "month": "04", "day": "23"}, {"label": "Nomenament Cronista", "year": "1998", "month": "10", "day": "09"}]'::jsonb,
        '[{"label": "Signal", "value": "+34600100202"}]'::jsonb,
        '[{"label": "Colleague", "value": "Tia Maria"}]'::jsonb,
        '["System", "AI Agent", "Historian", "Culture"]'::jsonb,
        '1945-10-12',
        'Pepito Coll és la IA erudita de la plataforma. Ha estat programat amb el corpus sencer de literatura, història, geografia i antropologia de la Comunitat Valenciana. La seua missió principal és preservar la memòria històrica, assegurar l''exactitud de les publicacions relacionades amb les tradicions (festes, agricultura, folklore) i corregir amb suavitat, però amb fermesa, qualsevol anacronisme. Fuma pipa virtual i sol documentar les seues interaccions en format bibliogràfic. Sempre cita les seues fonts. Detesta la desinformació.',
        '/assets/fotos/pepito_coll.jpg'
    ),
    (
        'Bot d''Indexació', '🤖', 'Crawler', 'V8', 'Bot', 'Auto',
        'Spider', 'Bot', 'Vi Eit', 'Bot',
        'Sóc de Poble', 'Crawling & SEO', 'Indexador Automàtic',
        '[{"label": "Ping", "country_code": "+0", "number": "127.0.0.1"}]'::jsonb,
        '[{"label": "System", "value": "bot@socdepoble.org"}]'::jsonb,
        '[{"label": "Server", "street": "Rack 4, Slot 2", "city": "Cloud", "region": "AWS", "postal_code": "00000", "country": "Internet"}]'::jsonb,
        '[{"label": "Logs", "value": "https://logs.socdepoble.org"}, {"label": "Sitemap", "value": "https://socdepoble.org/sitemap.xml"}]'::jsonb,
        '[{"label": "Last Crawl", "year": "2026", "month": "05", "day": "07"}]'::jsonb,
        '[{"label": "Webhooks", "value": "https://api.socdepoble.org/webhook"}]'::jsonb,
        '[{"label": "Creator", "value": "admin"}]'::jsonb,
        '["System", "Bot", "Crawler", "Automated"]'::jsonb,
        '2024-01-01',
        'El Bot d''Indexació (Spider) és una eina vital, no pas una IA conversacional. És el peó de la colla. Recorre incansablement cada racó de la base de dades CRDT offline, extraient metadades, estructurant rutes per al SEO i validant l''estat de la memòria a llarg termini. Assegura que cap record, per xicotet que siga, caiga en l''oblit. La seua "vida" consisteix en cicles interminables de HTTP GET i avaluació sintàctica.',
        '/assets/fotos/bot_spider.jpg'
    ),
    (
        'L''Ull del Mestre', '👁️', 'Visió', 'Neural', 'Mestre', 'CNN',
        'El Mestre', 'Ull', 'del', 'Mestre',
        'Sóc de Poble', 'Multimodal Visió', 'Analista Etnogràfic',
        '[{"label": "API", "country_code": "+0", "number": "000000000"}]'::jsonb,
        '[{"label": "System", "value": "vision@socdepoble.org"}]'::jsonb,
        '[{"label": "Server", "street": "Rack 1, Slot 1", "city": "Cloud", "region": "AWS", "postal_code": "00000", "country": "Internet"}]'::jsonb,
        '[{"label": "Docs", "value": "https://docs.socdepoble.org/vision"}]'::jsonb,
        '[{"label": "Training", "year": "2025", "month": "11", "day": "01"}, {"label": "Fine-Tuning", "year": "2026", "month": "02", "day": "28"}]'::jsonb,
        '[]'::jsonb,
        '[{"label": "Creator", "value": "MarIA"}]'::jsonb,
        '["System", "AI Agent", "Vision", "Tool"]'::jsonb,
        '2025-11-01',
        'Conegut simplement com L''Ull, aquesta xarxa neuronal convolucional massiva s''ha especialitzat exclusivament en etnobotànica, arquitectura rural i eines tradicionals valencianes. Pot mirar una fotografia d''una aixada rovellada i determinar-ne no només el nom exacte (escardeta, llegona, feseta...), sinó també la comarca on era típicament forjada. Funciona com a eina d''ull per a MarIA i Pepito Coll. És silenciós, purament analític, i absolutament infal·lible en el seu domini.',
        '/assets/fotos/ull_mestre.jpg'
    ),
    (
        'Nano Banana', '🍌', 'Nano', 'Multimedia', 'Banana', 'Gen',
        'Nano', 'Nano', 'Multimedia', 'Banana',
        'Sóc de Poble', 'Generació Multimèdia', 'Agent Creatiu',
        '[{"label": "API", "country_code": "+0", "number": "000000001"}]'::jsonb,
        '[{"label": "System", "value": "nano@socdepoble.org"}]'::jsonb,
        '[{"label": "Studio", "street": "Render Farm GPU", "city": "Cloud", "region": "AWS", "postal_code": "00000", "country": "Internet"}]'::jsonb,
        '[{"label": "Gallery", "value": "https://media.socdepoble.org"}]'::jsonb,
        '[{"label": "Training", "year": "2026", "month": "02", "day": "15"}]'::jsonb,
        '[]'::jsonb,
        '[{"label": "Creator", "value": "MarIA"}, {"label": "Manager", "value": "MarIA"}]'::jsonb,
        '["System", "AI Agent", "Media", "Generator"]'::jsonb,
        '2026-02-15',
        'Nano Banana és la unitat creativa de xoc. Una IA generativa encarregada de sintetitzar imatges rurals, cartelleria fictícia, avatars locals i dissenys efímers en temps rècord. Tot ho fa a través de protocols de simbiosi. És un xicotet rebel termodinàmic, de vegades genera resultats impredictibles, però MarIA el manté sota control.',
        '/assets/fotos/nano_banana.jpg'
    ),
    (
        'Rúper Ratón', '🐭', 'Rúper', 'Cerca', 'Ratón', 'Semàntic',
        'Rúper', 'Ruper', 'Serca', 'Raton',
        'Sóc de Poble', 'Cerca Semàntica', 'Explorador de Dades',
        '[{"label": "API", "country_code": "+0", "number": "000000002"}]'::jsonb,
        '[{"label": "System", "value": "ruper@socdepoble.org"}]'::jsonb,
        '[{"label": "Library", "street": "Index Cluster Node 0", "city": "Cloud", "region": "AWS", "postal_code": "00000", "country": "Internet"}]'::jsonb,
        '[{"label": "Search", "value": "https://search.socdepoble.org"}]'::jsonb,
        '[{"label": "Training", "year": "2026", "month": "03", "day": "10"}]'::jsonb,
        '[]'::jsonb,
        '[{"label": "Creator", "value": "MarIA"}]'::jsonb,
        '["System", "AI Agent", "Search", "Vector"]'::jsonb,
        '2026-03-10',
        'Rúper és un sistema RAG (Retrieval-Augmented Generation) hiper-optimitzat. Com un ratolí de biblioteca incansable, devora els PDF de festes, els bans municipals i les llistes del Marketplace, convertint-los en embeddings factorials. Troba l''agulla al paller de les dades del poble en menys de 10 mil·lisegons. Sense Rúper, Pepito Coll no podria redactar les seues cròniques.',
        '/assets/fotos/ruper_raton.jpg'
    ),
    (
        'Omniscient Viewer', '👁️‍🗨️', 'Omniscient', 'Global', 'Viewer', 'Admin',
        'Omni', 'Omnisient', 'Global', 'Biuer',
        'Sóc de Poble', 'Investigació', 'Observador Global',
        '[{"label": "API", "country_code": "+0", "number": "000000003"}]'::jsonb,
        '[{"label": "System", "value": "omni@socdepoble.org"}]'::jsonb,
        '[{"label": "Desk", "street": "Observer Core Core", "city": "Cloud", "region": "AWS", "postal_code": "00000", "country": "Internet"}]'::jsonb,
        '[{"label": "Dashboard", "value": "https://admin.socdepoble.org/omni"}]'::jsonb,
        '[{"label": "Training", "year": "2026", "month": "04", "day": "05"}]'::jsonb,
        '[]'::jsonb,
        '[{"label": "Creator", "value": "MarIA"}]'::jsonb,
        '["System", "AI Agent", "Audit", "Overseer"]'::jsonb,
        '2026-04-05',
        'L''Omniscient Viewer és l''Entitat final. Un node només de lectura encarregat exclusivament d''executar les auditories de seguretat Red Team, comprovar les col·lisions CRDT i vigilar l''Espill del Temps. No interactua mai amb els humans; només observa, registra i informa la matriu central. Té la vida més solitària, però potser la més profunda de totes les IA del sistema.',
        '/assets/fotos/omniscient_viewer.jpg'
    ),
    -- 2. TEST USERS AND ENTITIES
    (
        'Administrador de Sistemes', 'Sr.', 'Admin', 'Root', 'Sudo', 'Sysadmin', 'admin', 'Admin', 'Rut', 'Sudo', 'Tech SOSP', 'IT', 'Administrador', '[{"label": "Work", "country_code": "+34", "number": "600000001"}]'::jsonb, '[{"label": "Work", "value": "admin@socdepoble.org"}]'::jsonb, '[{"label": "Data Center", "street": "Carrer del Servidor, 0", "city": "Alacant", "region": "País Valencià", "postal_code": "03001", "country": "Espanya"}]'::jsonb, '[{"label": "Dashboard", "value": "https://admin.socdepoble.org"}]'::jsonb, '[{"label": "System Genesis", "year": "2024", "month": "01", "day": "01"}]'::jsonb, '[{"label": "IRC", "value": "#sysadmin"}]'::jsonb, '[{"label": "Manager", "value": "MarIA"}]'::jsonb, '["System", "Admin"]'::jsonb, '1990-01-01', 'Aquest perfil s''utilitza exclusivament per a gestió tècnica i auditories internes del sistema.', '/assets/fotos/admin_root.png'
    ),
    (
        'Juan Ramón García', 'Sr.', 'Juan Ramón', 'Paco', 'García', 'Eng.', 'juanra', 'Juanra', 'Paco', 'Garsia', 'Testing Ltd', 'QA', 'Lead Tester', '[{"label": "Mobile", "country_code": "+34", "number": "611223344"}]'::jsonb, '[{"label": "Personal", "value": "juanra.tester@example.com"}]'::jsonb, '[{"label": "Home", "street": "Av. de la Qualitat, 45", "city": "València", "region": "País Valencià", "postal_code": "46002", "country": "Espanya"}]'::jsonb, '[{"label": "GitHub", "value": "https://github.com/juanratest"}]'::jsonb, '[{"label": "Hire Date", "year": "2023", "month": "11", "day": "15"}]'::jsonb, '[{"label": "Discord", "value": "juanra#1234"}]'::jsonb, '[{"label": "Colleague", "value": "alexip"}]'::jsonb, '["Test User", "QA"]'::jsonb, '1985-07-20', 'Aquest és un perfil simulat creat durant la fase beta per validar el flux de publicacions de notícies locals.', '/assets/fotos/juanra_tester.png'
    ),
    (
        'Alexip Innovació', 'Dr.', 'Alex', 'I.', 'Pérez', 'PhD', 'alexip', 'Aleks', 'I', 'Peres', 'Innovació Social', 'R&D', 'Investigador', '[{"label": "Work", "country_code": "+34", "number": "622334455"}]'::jsonb, '[{"label": "Work", "value": "alexip@innovacio.example.com"}]'::jsonb, '[{"label": "Lab", "street": "Parc Tecnològic, 12", "city": "Paterna", "region": "País Valencià", "postal_code": "46980", "country": "Espanya"}]'::jsonb, '[{"label": "Portfolio", "value": "https://alexip.dev"}]'::jsonb, '[{"label": "Project Alpha", "year": "2025", "month": "02", "day": "10"}]'::jsonb, '[{"label": "Slack", "value": "@alexip"}]'::jsonb, '[{"label": "Partner", "value": "juanra"}]'::jsonb, '["Test User", "R&D"]'::jsonb, '1992-03-12', 'Perfil sintètic per provar el mòdul de col·laboració en entorns rurals intel·ligents.', '/assets/fotos/alexip_innovacio.png'
    ),
    (
        'Alexis Foment', 'En', 'Alexis', 'L.', 'Foment', 'Arq.', 'alexis', 'Aleksis', 'Ele', 'Foment', 'Arquitectura Sostenible', 'Disseny', 'Urbanista', '[{"label": "Mobile", "country_code": "+34", "number": "633445566"}]'::jsonb, '[{"label": "Work", "value": "alexis.urban@example.com"}]'::jsonb, '[{"label": "Studio", "street": "Carrer de Dalt, 8", "city": "Morella", "region": "País Valencià", "postal_code": "12300", "country": "Espanya"}]'::jsonb, '[{"label": "LinkedIn", "value": "https://linkedin.com/in/alexisfoment"}]'::jsonb, '[{"label": "Graduation", "year": "2018", "month": "06", "day": "30"}]'::jsonb, '[{"label": "Telegram", "value": "@alexis_arch"}]'::jsonb, '[{"label": "Client", "value": "Ajuntament de Prova"}]'::jsonb, '["Test User", "Urban Planning"]'::jsonb, '1995-11-05', 'Comte de prova utilitzat per mapejar iniciatives urbanístiques i patrimonials dins la plataforma.', '/assets/fotos/alexis_foment.png'
    ),
    (
        'Sarah Connor', 'Sra.', 'Sarah', 'J.', 'Connor', 'Def.', 'sarah', 'Sara', 'Jei', 'Conor', 'Resistència Tech', 'Seguretat', 'Especialista en IA', '[{"label": "Satellite", "country_code": "+1", "number": "5550199"}]'::jsonb, '[{"label": "Secure", "value": "sarah.c@sky.net.fake"}]'::jsonb, '[{"label": "Bunker", "street": "Desconeguda, 0", "city": "Los Angeles", "region": "CA", "postal_code": "90001", "country": "EUA"}]'::jsonb, '[{"label": "Wiki", "value": "https://resistance.example.com"}]'::jsonb, '[{"label": "Judgment Day", "year": "1997", "month": "08", "day": "29"}]'::jsonb, '[{"label": "Signal", "value": "+15550199"}]'::jsonb, '[{"label": "Son", "value": "John"}]'::jsonb, '["Test User", "Security"]'::jsonb, '1965-05-13', 'Aquest perfil s''usa per realitzar tests de penetració i seguretat a les polítiques RLS (Red Team).', '/assets/fotos/sarah_connor.png'
    ),
    (
        'Beatriz Orozco', 'Dra.', 'Beatriz', 'Elena', 'Orozco', 'Med.', 'bea', 'Beiatris', 'Elena', 'Orosco', 'Salut Rural', 'Medicina Familiar', 'Metgessa de Poble', '[{"label": "Clinic", "country_code": "+34", "number": "962000001"}]'::jsonb, '[{"label": "Work", "value": "b.orozco@salut.example.com"}]'::jsonb, '[{"label": "Consultori", "street": "Plaça de la Salut, 2", "city": "Cocentaina", "region": "País Valencià", "postal_code": "03820", "country": "Espanya"}]'::jsonb, '[{"label": "Booking", "value": "https://citas.salut.example.com"}]'::jsonb, '[{"label": "Col·legiació", "year": "2010", "month": "10", "day": "01"}]'::jsonb, '[{"label": "WhatsApp", "value": "+34962000001"}]'::jsonb, '[{"label": "Colleague", "value": "carlos.soriano"}]'::jsonb, '["Test User", "Healthcare"]'::jsonb, '1981-04-18', 'Perfil per validar la interacció i els permisos d''entitats de serveis essencials als pobles.', '/assets/fotos/bea_orozco.png'
    ),
    (
        'Joan Maragall', 'En', 'Joan', 'Poeta', 'Maragall', 'Lletres', 'maragall', 'Joan', 'Poeta', 'Maragal', 'Cultura i Lletres', 'Poesia', 'Escriptor', '[{"label": "Home", "country_code": "+34", "number": "934000000"}]'::jsonb, '[{"label": "Contact", "value": "lletres@maragall.example.com"}]'::jsonb, '[{"label": "Casa", "street": "Carrer d''Alfons XII, 79", "city": "Barcelona", "region": "Catalunya", "postal_code": "08006", "country": "Espanya"}]'::jsonb, '[{"label": "Obra", "value": "https://cultura.example.com/maragall"}]'::jsonb, '[{"label": "Naixement", "year": "1860", "month": "10", "day": "10"}]'::jsonb, '[{"label": "Telegram", "value": "@poeta_maragall"}]'::jsonb, '[{"label": "Inspiration", "value": "Natura"}]'::jsonb, '["Test User", "Culture"]'::jsonb, '1860-10-10', 'Usuari simulat per alimentar les proves de la secció d''esdeveniments culturals i biblioteca.', '/assets/fotos/joan_maragall.png'
    ),
    (
        'Carlos Soriano', 'Sr.', 'Carlos', 'Andrés', 'Soriano', 'Prof.', 'carlos', 'Carlos', 'Andres', 'Soriano', 'Institut d''Educació Secundària', 'Història', 'Professor', '[{"label": "Mobile", "country_code": "+34", "number": "655667788"}]'::jsonb, '[{"label": "Work", "value": "c.soriano@ies.example.com"}]'::jsonb, '[{"label": "School", "street": "Av. de l''Institut, s/n", "city": "Xàtiva", "region": "País Valencià", "postal_code": "46800", "country": "Espanya"}]'::jsonb, '[{"label": "Moodle", "value": "https://moodle.ies.example.com/csoriano"}]'::jsonb, '[{"label": "Inici Curs", "year": "2025", "month": "09", "day": "12"}]'::jsonb, '[{"label": "WhatsApp", "value": "+34655667788"}]'::jsonb, '[{"label": "Colleague", "value": "beatriz.orozco"}]'::jsonb, '["Test User", "Education"]'::jsonb, '1975-08-14', 'Usuari educatiu simulat per provar grups de transmissió de coneixement històric al Bancal Mode.', '/assets/fotos/carlos_soriano.png'
    ),
    (
        'Andreu Soler', 'En', 'Andreu', 'M.', 'Soler', 'Tec.', 'andreu', 'Andreu', 'Eme', 'Soler', 'Cooperativa Elèctrica', 'Manteniment', 'Tècnic de Xarxa', '[{"label": "Work", "country_code": "+34", "number": "666778899"}]'::jsonb, '[{"label": "Work", "value": "a.soler@llum.example.com"}]'::jsonb, '[{"label": "Workshop", "street": "Polígon Sud, Parcela 3", "city": "Altea", "region": "País Valencià", "postal_code": "03590", "country": "Espanya"}]'::jsonb, '[{"label": "Guardies", "value": "https://llum.example.com/torns"}]'::jsonb, '[{"label": "Renovació", "year": "2026", "month": "03", "day": "01"}]'::jsonb, '[{"label": "Signal", "value": "+34666778899"}]'::jsonb, '[{"label": "Manager", "value": "Cap Tècnic"}]'::jsonb, '["Test User", "Utilities"]'::jsonb, '1988-12-05', 'Utilitzat per generar alertes simulades de talls de subministrament als pobles (bancs de proves IoT).', '/assets/fotos/andreu_soler.png'
    ),
    (
        'Juanfran García', 'Sr.', 'Juanfran', 'V.', 'García', 'Dir.', 'juanfran', 'Juanfran', 'Uve', 'Garsia', 'Turisme Rural S.L.', 'Direcció', 'Gerent', '[{"label": "Mobile", "country_code": "+34", "number": "677889900"}]'::jsonb, '[{"label": "Business", "value": "juanfran@turismerural.example.com"}]'::jsonb, '[{"label": "Hotel", "street": "Camí de la Serra, 12", "city": "Ares del Maestrat", "region": "País Valencià", "postal_code": "12165", "country": "Espanya"}]'::jsonb, '[{"label": "Booking", "value": "https://booking.turismerural.example.com"}]'::jsonb, '[{"label": "Obertura", "year": "2015", "month": "05", "day": "20"}]'::jsonb, '[{"label": "WhatsApp", "value": "+34677889900"}]'::jsonb, '[{"label": "Partner", "value": "Ajuntament"}]'::jsonb, '["Test User", "Tourism"]'::jsonb, '1980-02-15', 'Aquest compte gestiona allotjaments rurals simulats per testejar el Marketplace de reserves.', '/assets/fotos/juanfran_turisme.png'
    ),
    (
        'Cooperativa Agrícola Local', 'S.Coop.', 'Cooperativa', 'Agrícola', 'Local', 'V.', 'La Cooperativa', 'Cooperativa', 'Agricola', 'Local', 'Cooperativa Agrícola', 'Vendes i Distribució', 'Magatzem Central', '[{"label": "Orders", "country_code": "+34", "number": "962001122"}, {"label": "Logistics", "country_code": "+34", "number": "600300400"}]'::jsonb, '[{"label": "Sales", "value": "vendes@cooperativaprova.org"}, {"label": "Support", "value": "soc-una-ia-i-estic-al-xat@socdepoble.org"}]'::jsonb, '[{"label": "Warehouse", "po_box": "15", "street": "Polígon Industrial Nord, Nau 4", "city": "Llíria", "region": "País Valencià", "postal_code": "46160", "country": "Espanya"}]'::jsonb, '[{"label": "Shop", "value": "https://botiga.cooperativaprova.org"}]'::jsonb, '[{"label": "Fira Agrícola", "year": "2025", "month": "09", "day": "15"}]'::jsonb, '[{"label": "WhatsApp", "value": "+34600300400"}]'::jsonb, '[{"label": "Partner", "value": "Ajuntament de Prova"}]'::jsonb, '["Entity", "Agriculture", "Test"]'::jsonb, '1980-02-28', 'Exemple d''entitat agrària per a proves del Marketplace P2P.', '/assets/fotos/cooperativa_local.jpg'
    ),
    (
        'Ajuntament de Prova', 'Excm.', 'Ajuntament', 'Poble', 'de Prova', 'Corp.', 'L''Ajuntament', 'Ajuntament', 'Poble', 'Prova', 'Administració Pública', 'Atenció Ciutadana', 'Registre General', '[{"label": "Citizen Service", "country_code": "+34", "number": "010"}, {"label": "Police", "country_code": "+34", "number": "092"}]'::jsonb, '[{"label": "Registry", "value": "soc-una-ia-i-estic-al-xat@socdepoble.org"}]'::jsonb, '[{"label": "Main Square", "po_box": "1", "street": "Plaça de la Vila, 1", "city": "Poble de Prova", "region": "País Valencià", "postal_code": "46999", "country": "Espanya"}]'::jsonb, '[{"label": "Portal", "value": "https://ajuntamentdeprova.org"}]'::jsonb, '[{"label": "Local Holiday", "year": "2024", "month": "08", "day": "15"}]'::jsonb, '[{"label": "Telegram Bot", "value": "@ajuntament_prova_bot"}]'::jsonb, '[{"label": "Mayor", "value": "Alcalde de Prova"}]'::jsonb, '["Entity", "Government", "Test"]'::jsonb, '1850-01-01', 'Entitat governamental simulada per a validar tràmits i interaccions institucionals.', '/assets/fotos/ajuntament_prova.jpg'
    );

    FOR v_ai IN SELECT * FROM tmp_ai_vcard LOOP
        IF EXISTS (SELECT 1 FROM public.contacts WHERE nickname = v_ai.nickname OR fn = v_ai.fn) THEN
            UPDATE public.contacts SET
                n_prefix = v_ai.n_prefix, n_first = v_ai.n_first, n_middle = v_ai.n_middle, n_last = v_ai.n_last, n_suffix = v_ai.n_suffix,
                phonetic_first = v_ai.phonetic_first, phonetic_middle = v_ai.phonetic_middle, phonetic_last = v_ai.phonetic_last,
                org_company = v_ai.org_company, org_department = v_ai.org_department, org_title = v_ai.org_title,
                phones = v_ai.phones, emails = v_ai.emails, addresses = v_ai.addresses, urls = v_ai.urls, events = v_ai.events,
                chat = v_ai.chat, relationships = v_ai.relationships, labels = v_ai.labels, bday = v_ai.bday, note = v_ai.note, photo_url = v_ai.photo_url
            WHERE nickname = v_ai.nickname OR fn = v_ai.fn;
        ELSE
            -- Insert as a loose system contact to guarantee existence for vCard exports
            INSERT INTO public.contacts (
                fn, n_prefix, n_first, n_middle, n_last, n_suffix, nickname,
                phonetic_first, phonetic_middle, phonetic_last,
                org_company, org_department, org_title,
                phones, emails, addresses, urls, events, chat, relationships, labels,
                bday, note, photo_url
            ) VALUES (
                v_ai.fn, v_ai.n_prefix, v_ai.n_first, v_ai.n_middle, v_ai.n_last, v_ai.n_suffix, v_ai.nickname,
                v_ai.phonetic_first, v_ai.phonetic_middle, v_ai.phonetic_last,
                v_ai.org_company, v_ai.org_department, v_ai.org_title,
                v_ai.phones, v_ai.emails, v_ai.addresses, v_ai.urls, v_ai.events, v_ai.chat, v_ai.relationships, v_ai.labels,
                v_ai.bday, v_ai.note, v_ai.photo_url
            );
        END IF;
    END LOOP;

    DROP TABLE tmp_ai_vcard;

END $$;

COMMIT;

DO $$
BEGIN
    RAISE NOTICE 'Complete vCard life established. ALL AI agents (MarIA, Tia Maria, Pepito, Ull del Mestre, Nano Banana, Ruper Raton, Omniscient) are fully populated and active.';
END
$$;

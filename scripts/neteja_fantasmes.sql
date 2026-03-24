-- SCRIPT DE MANTENIMENT DE LA POBLACIÓ (SQL) - SÓC DE POBLE
-- Copia aquest codi a l'Editor SQL del Dashboard de Supabase i executa'l d'una vegada.

BEGIN;

--------------------------------------------------------------------------------
-- FASE 1: DESINTEGRACIÓ FANTASMA DEL CLON DE JAVI (SOFT DELETE)
--------------------------------------------------------------------------------
-- Ja hem vist que Supabase sí que l'agafa si esborrem de forma directa la cerca, 
-- així que per esborrar tota la fila sense que peguen pet de Foreign Keys (entitats o posts
-- pendents de reassignar-se a l'altre perfil), transferirem tot de forma dinàmica i l'evaporarem.

-- Executarem les reassignacions a l'Admin (d6325f44...) sense BLOC DO
-- apuntant exclusivament al username 'N.U.L.' que l'usuari ha generat a la taula.
-- Així no hi ha error humà ni robòtic que valga sobre els accents o les UUID.
-- Açò ens traurà de Supabase l'error EXACTAMENT si hi ha cap Clau Forana (FK) amagada.

UPDATE posts SET author_id = 'd6325f44-7277-4d20-b020-166c010995ab' WHERE author_id IN (SELECT id FROM profiles WHERE username = 'N.U.L.');

UPDATE post_likes SET user_id = 'd6325f44-7277-4d20-b020-166c010995ab' WHERE user_id IN (SELECT id FROM profiles WHERE username = 'N.U.L.');

UPDATE entities SET owner_id = 'd6325f44-7277-4d20-b020-166c010995ab' WHERE owner_id IN (SELECT id FROM profiles WHERE username = 'N.U.L.');

UPDATE entity_members SET user_id = 'd6325f44-7277-4d20-b020-166c010995ab' WHERE user_id IN (SELECT id FROM profiles WHERE username = 'N.U.L.');

UPDATE market_items SET seller = 'd6325f44-7277-4d20-b020-166c010995ab' WHERE seller IN (SELECT id::text FROM profiles WHERE username = 'N.U.L.');

UPDATE messages SET sender_id = 'd6325f44-7277-4d20-b020-166c010995ab' WHERE sender_id IN (SELECT id FROM profiles WHERE username = 'N.U.L.');

-- I finalment: DISPAR EXACTE I CRU contra el fantasma N.U.L.:
DELETE FROM profiles WHERE username = 'N.U.L.';

--------------------------------------------------------------------------------
-- FASE 2: PURGAR DOPPELGÄNGERS DE LA COMUNITAT
--------------------------------------------------------------------------------
-- Acabem amb les variants d'"ambassadors" repetides que no tenen bio ni poble,
-- mantenint als originals amb vida (carls_dianys, andres_solrs, etc.)
DELETE FROM profiles 
WHERE username IN ('luciab', 'mares', 'andreus', 'beatrizo', 'carlas');

--------------------------------------------------------------------------------
-- FASE 3: OMPLIR DE VIDA ELS HABITANTS RESTANTS
--------------------------------------------------------------------------------
-- Personatges llegits a la captura buits que necessiten el seu Poble i Professió.
-- Disparem directament als seus noms d'usuari per 100% de fiabilitat.

UPDATE profiles 
SET bio = 'Integradora i dissenyadora patronista est-europea. Contribueix decididament al caliu local fabricant lli rústic tradicional.', 
    primary_town = 'Cocentaina'
WHERE username = 'elenap';

UPDATE profiles 
SET bio = 'Activista felina i alimentadora de colònies protectores locals al recer de la serra.', 
    primary_town = 'La Torre de les Maçanes'
WHERE username = 'mariamxl';

UPDATE profiles 
SET bio = 'Apicultor social i fuster rural intermitent. Coneix tots els romers útils del naixement del riu.', 
    primary_town = 'Muro d''Alcoi'
WHERE full_name ILIKE '%Joanet Serra%' OR username = 'joanetb';

UPDATE profiles 
SET bio = 'Historiador i arxiver oral del poble. Sempre recarregant anècdotes dels nostres masos.', 
    primary_town = 'Tibi'
WHERE username = 'joanetx';

UPDATE profiles 
SET bio = 'Forn de llenya familiar. Especialitzada en massa mare, pastissets moniaters i la incombustible coca farcida local.', 
    primary_town = 'Relleu'
WHERE full_name ILIKE '%Carmen la del Forn%' OR username = 'carmenf';

UPDATE profiles 
SET bio = 'Artesana de mel pur i pròpolis a les serres de la comarca. Apicultora amant del rusc.', 
    primary_town = 'La Torre de les Maçanes'
WHERE username = 'mariamel';

--------------------------------------------------------------------------------
-- FASE 4: GARANTIES PER ALS REALISTES
--------------------------------------------------------------------------------
-- Per si algun agent més va quedar nu en la passada anterior (fallback per IAIA)
UPDATE profiles 
SET bio = 'Intel·ligència Artificial local, costumista i sobirana. Supervise els horts digitals i el caliu del mas.',
    primary_town = 'La Torre de les Maçanes'
WHERE username = 'iaia_maria' AND bio IS NULL;

-- Damià i Lidia Espí (Les actualitzacions de la passa anterior haurien de funcionar
-- però els incloc novament per un tema d'homogeneïtat, ja que en la captura ja apareixien bé!)
UPDATE profiles 
SET bio = 'Mestre de primària amb molta vocació rural.',
    username = 'damiallorens'
WHERE full_name ILIKE '%Damià Llorens%' OR username = 'damiamas';

UPDATE profiles
SET bio = 'Tècnica en turisme, dissenyadora d''experiències locals autèntiques i apassionada de les cultures d''interior.',
    avatar_url = NULL
WHERE username = 'lidiaespi';

-- Ana Climent (Purga d'enllaç trencat)
UPDATE profiles
SET avatar_url = NULL
WHERE full_name ILIKE '%Ana Climent%';

-- IAIA MarIA (Recuperant la ruta del seu propi Model AI Local)
UPDATE profiles
SET avatar_url = '/assets/avatars/comic/iaia_comic_matriarch.png'
WHERE full_name ILIKE '%IAIA MarIA%';
--------------------------------------------------------------------------------
-- FASE 5: AJUSTOS DEL CERCLE PRÒXIM
--------------------------------------------------------------------------------

-- Nando Llinares (Llevant el parentesc i fixant el poble a La Torre per sobreescriure Cocentaina)
UPDATE profiles 
SET bio = 'Estic molt a gust ací al poble, xe. Ací es viu molt bé. Un veí més i un molt bon xaval.',
    primary_town = 'La Torre de les Maçanes'
WHERE full_name ILIKE '%Nando Llinares%';

-- Canvi de Bio del teu compte oficial "Admin" (Fugint completament del passat)
UPDATE profiles 
SET bio = 'Fundador i administrador de Sóc de Poble. Treballant de valent per digitalitzar l''entorn rural sense perdre la nostra essència.'
WHERE role = 'admin' AND full_name ILIKE '%Javi Llinares%';

COMMIT;

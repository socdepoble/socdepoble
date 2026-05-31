-- Migration: 20260507_0020_entities_motto_and_details.sql
-- Propòsit: Afegir el camp "motto" (lema) a les entitats, corregir el domini (.org/.com),
-- i omplir absolutament tots els camps buits tant per a les entitats reals com les de prova.

BEGIN;

-- ======================================================================
-- 1. AFEGIR EL CAMP LEMA (MOTTO)
-- ======================================================================
ALTER TABLE public.entities ADD COLUMN IF NOT EXISTS motto TEXT;


-- ======================================================================
-- 2. ACTUALITZACIÓ DE SÓC DE POBLE (Real)
-- ======================================================================
UPDATE public.entities 
SET 
  motto = 'Portal de Pobles Connectats',
  description = 'Plataforma P2P d''hiper-proximitat per a connectar veïns, afavorir el comerç local i recuperar el Trellat als pobles de la nostra terra.',
  contact_email = 'hola@socdepoble.org',
  contact_phone = '+34 600 000 000',
  website_url = 'https://socdepoble.org',
  address = 'Alacant, Comarques Centrals',
  avatar_url = 'assets/images/defaults/avatar_socdepoble.png',
  cover_url = COALESCE(cover_url, 'assets/images/defaults/cover_socdepoble.jpg'),
  cover_blurhash = COALESCE(cover_blurhash, 'L00000fQfQfQfQfQfQfQfQfQfQfQ'),
  metadata = '{"verified": true, "category": "technology", "founded": "2026"}'::jsonb
WHERE name = 'Sóc de Poble';


-- ======================================================================
-- 3. ACTUALITZACIÓ D'EL RENTONAR (Real)
-- ======================================================================
UPDATE public.entities 
SET 
  motto = 'Natura i Patrimoni',
  description = 'Espai d''aprenentatge, desenvolupament tecnològic, experimentació i divulgació al cor de la muntanya alacantina.',
  contact_email = 'info@elrentonar.org',
  contact_phone = '+34 611 111 111',
  website_url = 'https://socdepoble.org/el-rentonar',
  address = 'La Torre de les Maçanes, L''Alacantí',
  avatar_url = 'assets/images/defaults/avatar_rentonar.png',
  cover_url = COALESCE(cover_url, 'assets/images/defaults/cover_rentonar.jpg'),
  cover_blurhash = COALESCE(cover_blurhash, 'L00000fQfQfQfQfQfQfQfQfQfQfQ'),
  metadata = '{"verified": true, "category": "education", "focus": "nature"}'::jsonb
WHERE name = 'El Rentonar';


-- ======================================================================
-- 4. OMPLIR DADES INVENTADES PER A LES ENTITATS DE PROVA (Roleplay/IA)
-- ======================================================================

-- 4.1 Ajuntament de Prova
UPDATE public.entities 
SET 
  motto = 'Sempre al teu servei',
  description = 'Aquest és un ajuntament generat pel sistema per a fer proves de tràmits, bans i interaccions municipals dins de la plataforma.',
  contact_email = 'ajuntament@socdepoble.org',
  contact_phone = '+34 965 000 000',
  website_url = 'https://socdepoble.org/ajuntament-de-prova',
  address = 'Plaça de la Vila 1, Poble de Prova',
  avatar_url = COALESCE(avatar_url, 'assets/images/defaults/avatar_ajuntament.png'),
  cover_url = COALESCE(cover_url, 'assets/images/defaults/cover_ajuntament.jpg'),
  cover_blurhash = COALESCE(cover_blurhash, 'L00000fQfQfQfQfQfQfQfQfQfQfQ'),
  metadata = '{"is_test": true, "type": "municipality"}'::jsonb
WHERE name = 'Ajuntament de Prova';

-- 4.2 Cooperativa Agrícola de Prova
UPDATE public.entities 
SET 
  motto = 'De la terra a la taula',
  description = 'Entitat cooperativa fictícia dissenyada per provar el mòdul de mercat i la venda de productes agrícoles de quilòmetre zero.',
  contact_email = 'cooperativa@socdepoble.org',
  contact_phone = '+34 965 111 222',
  website_url = 'https://socdepoble.org/cooperativa-agricola-de-prova',
  address = 'Carrer de l''Horta s/n, Poble de Prova',
  avatar_url = COALESCE(avatar_url, 'assets/images/defaults/avatar_cooperativa.png'),
  cover_url = COALESCE(cover_url, 'assets/images/defaults/cover_cooperativa.jpg'),
  cover_blurhash = COALESCE(cover_blurhash, 'L00000fQfQfQfQfQfQfQfQfQfQfQ'),
  metadata = '{"is_test": true, "type": "agriculture"}'::jsonb
WHERE name = 'Cooperativa Agrícola de Prova';

COMMIT;

DO $$
BEGIN
    RAISE NOTICE 'S''ha corregit el domini a .org, s''ha afegit el lema (motto) i s''ha omplit completament cada camp de les entitats.';
END $$;

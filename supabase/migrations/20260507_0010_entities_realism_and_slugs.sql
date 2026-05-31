-- Migration: 20260507_0010_entities_realism_and_slugs.sql
-- Propòsit: Separar les entitats fictícies/IA de les reals (is_fictitious),
-- i injectar contingut realista (slugs nets, descripcions, URLs) a les existents.

BEGIN;

-- ======================================================================
-- 1. CLASSIFICACIÓ D'ENTITATS (REAL VS IA/FICTÍCIA)
-- ======================================================================
-- Afegim una columna específica per marcar si una entitat és un "roleplay", "test" o "IA"
ALTER TABLE public.entities ADD COLUMN IF NOT EXISTS is_fictitious BOOLEAN DEFAULT false;

-- Marquem les de prova com a fictícies
UPDATE public.entities 
SET is_fictitious = true 
WHERE name ILIKE '%prova%';


-- ======================================================================
-- 2. INJECCIÓ DE REALISME I NETEJA DE SLUGS (El Rentonar i Sóc de Poble)
-- ======================================================================

-- 2.1 Sóc de Poble (Entitat Real Mestra)
UPDATE public.entities 
SET 
  slug = 'soc-de-poble',
  description = 'Plataforma P2P d''hiper-proximitat per a connectar veïns, afavorir el comerç local i recuperar el Trellat als pobles.',
  contact_email = 'hola@socdepoble.es',
  website_url = 'https://socdepoble.es'
WHERE name = 'Sóc de Poble';

-- 2.2 El Rentonar (Entitat Real)
UPDATE public.entities 
SET 
  slug = 'el-rentonar',
  description = 'El Rentonar - Espai d''aprenentatge, desenvolupament tecnològic, experimentació i divulgació al cor de la muntanya alacantina.',
  website_url = 'https://socdepoble.es/entitats/el-rentonar'
WHERE name = 'El Rentonar';

-- 2.3 Ajuntament de Prova (Entitat Fictícia / Roleplay)
UPDATE public.entities 
SET 
  slug = 'ajuntament-de-prova',
  website_url = 'https://socdepoble.es/entitats/ajuntament-de-prova'
WHERE name = 'Ajuntament de Prova';

-- 2.4 Cooperativa Agrícola de Prova (Entitat Fictícia / Roleplay)
UPDATE public.entities 
SET 
  slug = 'cooperativa-agricola-de-prova',
  website_url = 'https://socdepoble.es/entitats/cooperativa-agricola-de-prova'
WHERE name = 'Cooperativa Agrícola de Prova';

COMMIT;

DO $$
BEGIN
    RAISE NOTICE 'S''ha inyectat el realisme a les entitats. Slugs arreglats i categoritzades amb "is_fictitious".';
END $$;

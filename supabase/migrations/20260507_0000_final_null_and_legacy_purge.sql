-- Migration: 20260507_0000_final_null_and_legacy_purge.sql
-- Propòsit: L'escombrada final. Mata l'ID antic de towns, i elimina els NULLS de user_realms i vistes.

BEGIN;

-- ======================================================================
-- 1. PURGA FINAL: ELIMINAR L'ANTIC ID SENCER DE `towns`
-- ======================================================================
-- Només actuarem si encara existeix la columna 'id' de tipus sencer.
-- Suposem que 'uuid' ja està creat i operatiu.
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'towns' AND column_name = 'id' AND data_type IN ('integer', 'bigint')) THEN
        -- Borrem la constraint primària antiga
        ALTER TABLE public.towns DROP CONSTRAINT IF EXISTS towns_pkey CASCADE;
        -- Borrem la columna id sencer
        ALTER TABLE public.towns DROP COLUMN id CASCADE;
        -- Renomenem el uuid per a que siga el nou id oficial
        ALTER TABLE public.towns RENAME COLUMN uuid TO id;
        -- Afegim la nova clau primària (ara serà UUID)
        ALTER TABLE public.towns ADD PRIMARY KEY (id);
        
        RAISE NOTICE 'Columna antiga ID (sencer) de towns fulminada amb èxit.';
    ELSE
        RAISE NOTICE 'La taula towns ja estava neta, no s''ha tocat l''ID.';
    END IF;
END $$;


-- ======================================================================
-- 2. ELIMINACIÓ DE NULLS A `user_realms`
-- ======================================================================
-- Canviem qualsevol NULL per un string buit i blindem la columna.
UPDATE public.user_realms
SET avatar_override = ''
WHERE avatar_override IS NULL;

ALTER TABLE public.user_realms ALTER COLUMN avatar_override SET DEFAULT '';
ALTER TABLE public.user_realms ALTER COLUMN avatar_override SET NOT NULL;


-- ======================================================================
-- 3. ELIMINACIÓ DE NULLS A `view_conversations_enriched`
-- ======================================================================
-- Quan es parla amb un ID 0000... o no hi ha match, eixien nuls.
-- Re-creem la vista forçant que sempre hi haja un fallback visual ('Desconegut' o 'Sistema')
CREATE OR REPLACE VIEW view_conversations_enriched AS
SELECT
  c.id,
  c.participant_1_id,
  c.participant_2_id,
  c.participant_1_type,
  c.participant_2_type,
  c.last_message_content,
  c.last_message_at,
  c.is_playground,
  
  -- Participant 1
  COALESCE(p1.full_name, e1.name, 'Usuari Esborrat') AS p1_name,
  COALESCE(p1.avatar_url, e1.avatar_url, 'assets/images/defaults/avatar_default.jpg') AS p1_avatar_url,
  COALESCE(p1.role, e1.type, 'user') AS p1_role,
  COALESCE(p1.is_ai, false) AS p1_is_ai,
  
  -- Participant 2
  COALESCE(p2.full_name, e2.name, 
    CASE WHEN c.participant_2_id = '00000000-0000-0000-0000-000000000000' THEN 'IAIA Maria' ELSE 'Usuari Esborrat' END
  ) AS p2_name,
  
  COALESCE(p2.avatar_url, e2.avatar_url, 
    CASE WHEN c.participant_2_id = '00000000-0000-0000-0000-000000000000' THEN 'assets/images/iaia_avatar.jpg' ELSE 'assets/images/defaults/avatar_default.jpg' END
  ) AS p2_avatar_url,
  
  COALESCE(p2.role, e2.type, 
    CASE WHEN c.participant_2_id = '00000000-0000-0000-0000-000000000000' THEN 'iaia' ELSE 'user' END
  ) AS p2_role,
  
  COALESCE(p2.is_ai, 
    CASE WHEN c.participant_2_id = '00000000-0000-0000-0000-000000000000' THEN true ELSE false END
  ) AS p2_is_ai

FROM
  conversations c
LEFT JOIN profiles p1 ON c.participant_1_id = p1.id AND (c.participant_1_type = 'user' OR c.participant_1_type IS NULL)
LEFT JOIN entities e1 ON c.participant_1_id = e1.id AND c.participant_1_type = 'entity'

LEFT JOIN profiles p2 ON c.participant_2_id = p2.id AND (c.participant_2_type = 'user' OR c.participant_2_type IS NULL)
LEFT JOIN entities e2 ON c.participant_2_id = e2.id AND c.participant_2_type = 'entity';

-- ======================================================================
-- 4. REVISIÓ D'ALTRES TAULES MENCIONADES
-- ======================================================================
-- `user_tags` no té columnes problemàtiques (ja estan bé).

COMMIT;

DO $$
BEGIN
    RAISE NOTICE 'La Gran Escombrada s''ha completat. Base de dades lliure d''IDs antics i nuls residuals!';
END $$;

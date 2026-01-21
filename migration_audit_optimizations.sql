-- ==========================================
-- AUDIT OPTIMIZATION: IS_DEMO FLAG & ENRICHED VIEW
-- ==========================================

BEGIN;

-- 1. Añadir flag is_demo a conversations
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false;

-- Marcar chats existentes de demo (basado en el rango que hemos estado usando)
UPDATE conversations 
SET is_demo = true 
WHERE id >= 'c1111000-0000-0000-0000-000000000000' 
  AND id <= 'c1111000-ffff-ffff-ffff-ffffffffffff';

-- 2. Crear Vista Enriquecida para evitar hidratación manual en el cliente
DROP VIEW IF EXISTS view_conversations_enriched;

CREATE VIEW view_conversations_enriched AS
SELECT 
    c.*,
    -- Info Participante 1 (Profile o Entity)
    COALESCE(p1.full_name, e1.name, 'Desconegut') as p1_name,
    COALESCE(p1.avatar_url, e1.avatar_url) as p1_avatar_url,
    -- Info Participante 2 (Profile o Entity)
    COALESCE(p2.full_name, e2.name, 'Desconegut') as p2_name,
    COALESCE(p2.avatar_url, e2.avatar_url) as p2_avatar_url
FROM conversations c
-- Joins para Participante 1
LEFT JOIN profiles p1 ON c.participant_1_id = p1.id AND c.participant_1_type = 'user'
LEFT JOIN entities e1 ON c.participant_1_id = e1.id AND c.participant_1_type = 'entity'
-- Joins para Participante 2
LEFT JOIN profiles p2 ON c.participant_2_id = p2.id AND c.participant_2_type = 'user'
LEFT JOIN entities e2 ON c.participant_2_id = e2.id AND c.participant_2_type = 'entity';

-- Garantizar permisos en la vista
GRANT SELECT ON view_conversations_enriched TO authenticated;
GRANT SELECT ON view_conversations_enriched TO anon;

COMMIT;

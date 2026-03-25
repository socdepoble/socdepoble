-- =========================================================================
-- 🛡️ SÓC DE POBLE: DESBLOQUEIG DEL TABULA RASA (CASCADE PER A ENTITATS)
-- =========================================================================
-- L'error 23503 indica que esborrar Profile -> esborra Entity, 
-- però Entity està bloquejada per ítems del Mercat que tenen seller_entity_id.
--
-- Aquest script soluciona la cadena de CASCADES afegint 'ON DELETE CASCADE'
-- a les claus foranes que apunten a la taula 'entities'.
-- =========================================================================

BEGIN;

-- 1. MERCAT (El responsable de l'error)
ALTER TABLE public.market_items DROP CONSTRAINT IF EXISTS market_items_seller_entity_id_fkey;
ALTER TABLE public.market_items 
ADD CONSTRAINT market_items_seller_entity_id_fkey 
FOREIGN KEY (seller_entity_id) REFERENCES public.entities(id) ON DELETE CASCADE;

-- 2. POSTS (Per prevenció, si una entitat desapareix que s'esborren els posts propis de l'entitat)
ALTER TABLE public.posts DROP CONSTRAINT IF EXISTS posts_author_entity_id_fkey;
ALTER TABLE public.posts 
ADD CONSTRAINT posts_author_entity_id_fkey 
FOREIGN KEY (author_entity_id) REFERENCES public.entities(id) ON DELETE CASCADE;

-- 3. MISSATGES (Prevenció d'orfenació)
ALTER TABLE public.messages DROP CONSTRAINT IF EXISTS messages_sender_entity_id_fkey;
ALTER TABLE public.messages 
ADD CONSTRAINT messages_sender_entity_id_fkey 
FOREIGN KEY (sender_entity_id) REFERENCES public.entities(id) ON DELETE CASCADE;

-- 4. CONVERSES
ALTER TABLE public.conversations DROP CONSTRAINT IF EXISTS conversations_participant_1_entity_id_fkey;
ALTER TABLE public.conversations 
ADD CONSTRAINT conversations_participant_1_entity_id_fkey 
FOREIGN KEY (participant_1_entity_id) REFERENCES public.entities(id) ON DELETE CASCADE;

ALTER TABLE public.conversations DROP CONSTRAINT IF EXISTS conversations_participant_2_entity_id_fkey;
ALTER TABLE public.conversations 
ADD CONSTRAINT conversations_participant_2_entity_id_fkey 
FOREIGN KEY (participant_2_entity_id) REFERENCES public.entities(id) ON DELETE CASCADE;

-- -------------------------------------------------------------------------
-- FINAL. TORNEM A EXECUTAR LA PURGA DE TABULA RASA ("THE SNAP") 
-- -------------------------------------------------------------------------
DELETE FROM public.profiles 
WHERE id != 'd6325f44-7277-4d20-b020-166c010995ab'
AND id::text NOT LIKE '11111111-%';

COMMIT;

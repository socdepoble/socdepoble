-- =========================================================================
-- 🏺 PROTOCOL DE DEPURACIÓ DE L'IDENTITAT I CASCADA GLOBAL
-- Objectiu: Eliminar l'usuari "Fantasma" i migrar les seves dades a "l'Admin Primari"
-- Accions: 1) Activar ON DELETE CASCADE per protecció futura 
--          2) Migrar referències
--          3) Esborrar usuari d'auth.users i public.profiles
-- =========================================================================

-- UUID DEL MESTRE (ADMIN PRIMARI ORIGINAL - d6325f44-7277-4d2d-b020-166c010995ab)
-- UUID DEL FANTASMA (CREAT RECENTMENT - d6325f44-7277-4d20-b020-166c010995ab)


BEGIN;

-------------------------------------------------------------------------
-- FASE 1: ACTIVACIÓ GLOBAL DE "ON DELETE CASCADE" (Seguretat GDPR i Integritat)
-------------------------------------------------------------------------
-- Això garanteix que futurs esborrats de perfils netegin la resta per complet

-- POSTS
ALTER TABLE public.posts DROP CONSTRAINT IF EXISTS posts_author_user_id_fkey;
ALTER TABLE public.posts ADD CONSTRAINT posts_author_user_id_fkey FOREIGN KEY (author_user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- MISSATGES
ALTER TABLE public.messages DROP CONSTRAINT IF EXISTS messages_sender_id_fkey;
ALTER TABLE public.messages ADD CONSTRAINT messages_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- CONVERSES
ALTER TABLE public.conversations DROP CONSTRAINT IF EXISTS conversations_participant_1_id_fkey;
ALTER TABLE public.conversations ADD CONSTRAINT conversations_participant_1_id_fkey FOREIGN KEY (participant_1_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.conversations DROP CONSTRAINT IF EXISTS conversations_participant_2_id_fkey;
ALTER TABLE public.conversations ADD CONSTRAINT conversations_participant_2_id_fkey FOREIGN KEY (participant_2_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- MERCAT
ALTER TABLE public.market_items DROP CONSTRAINT IF EXISTS market_items_seller_id_fkey;
ALTER TABLE public.market_items ADD CONSTRAINT market_items_seller_id_fkey FOREIGN KEY (seller_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-------------------------------------------------------------------------
-- FASE 2: MIGRACIÓ DE LES REFERÈNCIES
-------------------------------------------------------------------------
-- Traslladem els "ítems orfes" del fantasma a l'Admin Original perquè no es perdin

UPDATE public.posts 
SET author_user_id = 'd6325f44-7277-4d2d-b020-166c010995ab' 
WHERE author_user_id = 'd6325f44-7277-4d20-b020-166c010995ab';

UPDATE public.messages 
SET sender_id = 'd6325f44-7277-4d2d-b020-166c010995ab' 
WHERE sender_id = 'd6325f44-7277-4d20-b020-166c010995ab';

UPDATE public.market_items 
SET seller_id = 'd6325f44-7277-4d2d-b020-166c010995ab' 
WHERE seller_id = 'd6325f44-7277-4d20-b020-166c010995ab';

-- (Opcional per a converses, on un mateix no pot parlar amb si mateix. 
--  Si falla per clau única es pot ometre o eliminar les converses afectades)
UPDATE public.conversations 
SET participant_1_id = 'd6325f44-7277-4d2d-b020-166c010995ab' 
WHERE participant_1_id = 'd6325f44-7277-4d20-b020-166c010995ab' 
  AND participant_2_id != 'd6325f44-7277-4d2d-b020-166c010995ab';

UPDATE public.conversations 
SET participant_2_id = 'd6325f44-7277-4d2d-b020-166c010995ab' 
WHERE participant_2_id = 'd6325f44-7277-4d20-b020-166c010995ab' 
  AND participant_1_id != 'd6325f44-7277-4d2d-b020-166c010995ab';

-------------------------------------------------------------------------
-- FASE 3: ESBORRAT NUCLEAR DE L'USUARI FANTASMA
-------------------------------------------------------------------------
-- Com que Profile està enganxada a Auth i el trigger ho podria bloquejar o regenerar, 
-- ataquem directament l'autenticació primària i deixem que la cascada i triggers facin neteja

-- Delete directament del sistema d'autenticació
DELETE FROM auth.users 
WHERE id = 'd6325f44-7277-4d20-b020-166c010995ab';

-- I per si el cascade no agafa per velles polítiques, borrem definitivament el Profile
DELETE FROM public.profiles 
WHERE id = 'd6325f44-7277-4d20-b020-166c010995ab';

COMMIT;

-- PROTOCOL COMPLETAT. RESPIRA FONS.

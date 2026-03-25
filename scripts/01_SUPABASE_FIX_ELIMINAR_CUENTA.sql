-- =========================================================================
-- 🏺 SÓC DE POBLE: MASTER FIX PER A "ELIMINAR EL MEU COMPTE" 
-- =========================================================================
-- Aquest script soluciona definitivament l'error en provar d'eliminar
-- usuaris des de Configuració. També purga el teu perfil "Fantasma" per
-- netejar l'entorn abans de l'Auditoria de Codex.
--
-- INSTRUCCIONS: Copia i apega açò sencer al Supabase > SQL Editor > Run!
-- =========================================================================

BEGIN;

-------------------------------------------------------------------------
-- 0. SANEJAMENT PREVI (PURGA D'ORFES)
-------------------------------------------------------------------------
-- Eliminem missatges o ítems vells el qual amo ja no existix a 'profiles'.
-- Açò evita l'Error 23503 en intentar construir les noves relacions.
DELETE FROM public.messages WHERE sender_id NOT IN (SELECT id FROM public.profiles);
DELETE FROM public.posts WHERE author_user_id NOT IN (SELECT id FROM public.profiles);
DELETE FROM public.conversations WHERE participant_1_id NOT IN (SELECT id FROM public.profiles) OR participant_2_id NOT IN (SELECT id FROM public.profiles);
DELETE FROM public.market_items WHERE author_user_id NOT IN (SELECT id FROM public.profiles);

-------------------------------------------------------------------------
-- 1. SOLUCIÓ A "ELIMINAR EL MEU COMPTE" - ON DELETE CASCADE
-------------------------------------------------------------------------
-- Afegim la cascada a totes les relacions perquè quan un usuari s'elimine,
-- desapareguen automàticament els seus posts, missatges i anuncis sense errors.

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
ALTER TABLE public.market_items DROP CONSTRAINT IF EXISTS market_items_author_user_id_fkey;
ALTER TABLE public.market_items ADD CONSTRAINT market_items_author_user_id_fkey FOREIGN KEY (author_user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


-------------------------------------------------------------------------
-- 2. INSTAL·LAR LA FUNCIÓ RPC QUE CRIDA L'APP PER ESBORRAR-SE
-------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION delete_user()
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER
AS $$
BEGIN
    -- Seguretat total: Només pot esborrar el compte que fa la petició (auth.uid())
    DELETE FROM auth.users WHERE id = auth.uid();
END;
$$;


-------------------------------------------------------------------------
-- 3. PURGA DEL TEU PERFIL FANTASMA (Abans de Codex)
-------------------------------------------------------------------------
-- Aquest bloc migra les teues dades velles al compte vàlid i elimina el fantasma.
-- UUID DEL FANTASMA: d6325f44-7277-4d20-b020-166c010995ab
-- UUID DE L'ADMIN PRIMARI: d6325f44-7277-4d2d-b020-166c010995ab

UPDATE public.posts 
SET author_user_id = 'd6325f44-7277-4d2d-b020-166c010995ab' 
WHERE author_user_id = 'd6325f44-7277-4d20-b020-166c010995ab';

UPDATE public.messages 
SET sender_id = 'd6325f44-7277-4d2d-b020-166c010995ab' 
WHERE sender_id = 'd6325f44-7277-4d20-b020-166c010995ab';

UPDATE public.market_items 
SET author_user_id = 'd6325f44-7277-4d2d-b020-166c010995ab' 
WHERE author_user_id = 'd6325f44-7277-4d20-b020-166c010995ab';

-- Borrat de l'autenticació i perfil fantasma
DELETE FROM auth.users WHERE id = 'd6325f44-7277-4d20-b020-166c010995ab';
DELETE FROM public.profiles WHERE id = 'd6325f44-7277-4d20-b020-166c010995ab';

COMMIT;

-- PROTOCOL COMPLETAT. RESPIRA FONS.

-- =========================================================================
-- 🛡️ SÓC DE POBLE: EXTERMINADOR FINAL DE PERFILS ("TABULA RASA" PART II)
-- =========================================================================
-- El motiu pel qual els "humans" (Lidia, Damià, Nando, etc.) han sobreviscut
-- a la taula 'profiles' després d'haver esborrat la base d'Auth, és perquè 
-- el lligam històric de la teua base de dades entre Auth.users i Profiles no 
-- tenia la clau forana ben lligada. Era una simple coincidència de UUIDs!
--
-- Aquest script arrasa definitivament eixos perfils orfes a mà.
-- =========================================================================

BEGIN;

-- Esborrem TOTS els perfils humans excepte l'usuari Sobirà (Javi Líder)
-- i per precaució EXCLOEM els perfils "Mocks" o Demos (els que comencen per 11111...)
-- perquè la UI de demostració de Sóc de Poble no es trenque en l'Auditoria.

DELETE FROM public.profiles 
WHERE id != 'd6325f44-7277-4d20-b020-166c010995ab'
AND id::text NOT LIKE '11111111-%';

COMMIT;

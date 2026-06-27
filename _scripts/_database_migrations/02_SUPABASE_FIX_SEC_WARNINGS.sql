-- =========================================================================
-- 🛡️ SÓC DE POBLE: MASTER FIX PER MILLORAR LA SEGURETAT (WARNINGS)
-- =========================================================================
-- Aquest script ataca i soluciona els 'Warnings' (Avisos grocs) del 
-- Security Advisor de Supabase per tancar el sistema abans de l'Auditoria.
--
-- INSTRUCCIONS: Executa açò al teu SQL Editor de Supabase.
-- =========================================================================

BEGIN;

-------------------------------------------------------------------------
-- 1. FIX: "Function Search Path Mutable" (public.delete_user)
-------------------------------------------------------------------------
-- Supabase exigeix que les funcions amb privilegis (SECURITY DEFINER)
-- definisquen explícitament el seu search_path per evitar atacs d'injecció.
ALTER FUNCTION public.delete_user() SET search_path = '';

-------------------------------------------------------------------------
-- 2. FIX: "RLS Policy Always True" (public.lexicon)
-------------------------------------------------------------------------
-- Tens una política al 'lexicon' massa permissiva (com "(true)") que 
-- permet no només llegir, sinó esborrar o modificar a qualsevol persona.
-- Anem a purgar polítiques perilloses i aplicar la correcta:

-- (Aquest bloc localitza qualsevol política insegura de tipus UPDATE/DELETE/INSERT
-- amb USING (true) a Lexicon i l'elimina de soca-rel sense trencar el SELECT)
DO $$
DECLARE
    pol record;
BEGIN
    FOR pol IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'lexicon' AND schemaname = 'public' 
          AND (cmd = 'ALL' OR cmd = 'UPDATE' OR cmd = 'INSERT' OR cmd = 'DELETE')
          AND qual = 'true'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.lexicon', pol.policyname);
    END LOOP;
END
$$;

-- I ens assegurem que la lectura pública estiga garantida (segur i recomanat):
DROP POLICY IF EXISTS "Lexicon - Lectura Universal" ON public.lexicon;
CREATE POLICY "Lexicon - Lectura Universal" ON public.lexicon FOR SELECT USING (true);

-- (Nota: Els usuaris amb rol d'admin o service_key poden seguir afegint via el backend 
-- segons estiga dissenyat, o via l'editor de Supabase, però hem tancat la porta de darrere 
-- pública per a esborrar).

COMMIT;

-------------------------------------------------------------------------
-- RESUM DEL TEXT PER ALS 2 WARNINGS QUE QUEDEN:
-------------------------------------------------------------------------
-- 1. "Materialized View in API" (public.entity_member_map):
--    Això és només un avís de que la vista s'exposa. Com Sóc de Poble usa eixa
--    vista per mostrar els membres de les entitats i el Diagnòstic, t'aconselle 
--    ignorar eixe "warning" (polsa 'Ignore' a la UI). És una funcionalitat desitjada.
--
-- 2. "Leaked Password Protection Disabled" (Auth):
--    Això no és un problema de codi, és de panel: 
--    Ves-te'n a "Authentication" -> "Security" -> "Leaked Passwords" i activa'l 
--    amb el botó de Switch. S'ha acabat l'avís!
-- =========================================================================

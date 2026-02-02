-- =========================================================
-- NETEJA DE WARNINGS DE SEGURETAT (SECURITY ADVISOR)
-- =========================================================

-- 1. FIX: FUNCTION SEARCH PATH MUTABLE
-- Fixant el search_path a 'public' per seguretat en totes les funcions reportades.

ALTER FUNCTION public.refresh_entity_member_map() SET search_path = public;
ALTER FUNCTION public.get_orphaned_assets() SET search_path = public;
ALTER FUNCTION public.clean_expired_push_subscriptions() SET search_path = public;
ALTER FUNCTION public.check_market_rate_limit() SET search_path = public;
ALTER FUNCTION public.check_post_rate_limit() SET search_path = public;
ALTER FUNCTION public.log_push_notification(p_user_id uuid, p_type text, p_payload jsonb, p_success boolean, p_error text) SET search_path = public;
ALTER FUNCTION public.mark_messages_as_read(uuid, uuid) SET search_path = public;
ALTER FUNCTION public.update_connections_count() SET search_path = public;

-- 2. FIX: EXTENSION IN PUBLIC
-- Moure extensions a un esquema segur 'extensions'
CREATE SCHEMA IF NOT EXISTS extensions;
ALTER EXTENSION pg_trgm SET SCHEMA extensions;

-- 3. FIX: MATERIALIZED VIEW IN API
-- Restringir accés directe a la vista materialitzada des de l'API
REVOKE SELECT ON TABLE public.entity_member_map FROM anon, authenticated;

-- 4. FIX: RLS POLICY ALWAYS TRUE
-- Refinar polítiques per ser més específiques (només l'usuari pot esborrar els seus favorits o publicar)



-- posts (INSERT) - Eliminar la política permissiva de migració si ja ha acabat
DROP POLICY IF EXISTS "Allow Migration Inserts" ON public.posts;
-- (Nota: la política normal d'inserció per a usuaris autenticats ja hauria d'existir)

-- 6. ASSEGURAR RLS EN TAULES DEL WARNING ANTERIOR
ALTER TABLE public.push_notifications_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connection_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_connections ENABLE ROW LEVEL SECURITY;

-- Polítiques per a connection_tags (Privadesa total)
DROP POLICY IF EXISTS "Private Tags Access" ON public.connection_tags;
DROP POLICY IF EXISTS "Users can manage their own connection tags" ON public.connection_tags;
CREATE POLICY "Users can manage their own connection tags" ON public.connection_tags
FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Polítiques per a post_connections (Mínim necessari)
DROP POLICY IF EXISTS "Anyone can insert connections" ON public.post_connections;
DROP POLICY IF EXISTS "Authenticated users can insert connections" ON public.post_connections;
CREATE POLICY "Authenticated users can insert connections" ON public.post_connections 
FOR INSERT TO authenticated 
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage their own post connections" ON public.post_connections;
CREATE POLICY "Users can manage their own post connections" ON public.post_connections 
FOR ALL USING (auth.uid() = user_id);

-- 5. FIX: ALTRES POLÍTIQUES "ALWAYS TRUE" DETECTADES
-- post_likes (INSERT i DELETE)
DROP POLICY IF EXISTS "Anyone can insert likes" ON public.post_likes;
CREATE POLICY "Authenticated users can insert likes" ON public.post_likes 
FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Anyone can delete likes" ON public.post_likes;
CREATE POLICY "Users can only delete their own likes" ON public.post_likes 
FOR DELETE USING (auth.uid() = user_id);

-- market_favorites (INSERT i DELETE)
DROP POLICY IF EXISTS "Anyone can insert favorites" ON public.market_favorites;
DROP POLICY IF EXISTS "Authenticated users can insert favorites" ON public.market_favorites;
CREATE POLICY "Authenticated users can insert favorites" ON public.market_favorites 
FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Anyone can delete favorites" ON public.market_favorites;
DROP POLICY IF EXISTS "Users can only delete their own favorites" ON public.market_favorites;
CREATE POLICY "Users can only delete their own favorites" ON public.market_favorites 
FOR DELETE USING (auth.uid() = user_id);

-- user_tags (INSERT i DELETE)
DROP POLICY IF EXISTS "Users can insert their own tags" ON public.user_tags;
CREATE POLICY "Users can insert their own tags" ON public.user_tags 
FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own tags" ON public.user_tags;
CREATE POLICY "Users can delete their own tags" ON public.user_tags 
FOR DELETE USING (auth.uid() = user_id);

-- 6. ASSEGURAR RLS EN TOTES LES TAULES REPORTADES
ALTER TABLE IF EXISTS public.post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.market_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.post_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.connection_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.user_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.lexicon ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.push_notifications_log ENABLE ROW LEVEL SECURITY;

-- 7. NOTA SOBRE PROTECCIÓ DE CONTRASENYES (Dashboard manual)
-- L'avís "Leaked Password Protection Disabled" s'ha d'activar al dashboard de Supabase:
-- Auth -> Providers -> Email -> Enable Leaked Password Protection.

COMMIT;

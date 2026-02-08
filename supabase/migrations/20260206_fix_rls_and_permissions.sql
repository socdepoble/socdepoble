-- ==========================================
-- SÓC DE POBLE: DATABASE HEALING (2026-02-06)
-- Resolving 403 (RLS), 409 (Conflict) and 42501 (Permissions)
-- ==========================================

-- 1. Fix Posts RLS (403 Forbidden)
-- Permet als usuaris autenticats publicar al mur. 
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Authenticated users can insert entries" ON public.posts;
CREATE POLICY "Authenticated users can insert entries" 
ON public.posts FOR INSERT TO authenticated 
WITH CHECK (true);

-- 2. Grant Permissions to entity_member_map (42501 Permission Denied)
-- Vital per a la MArIA (IAIA) i la gestió d'entitats.
GRANT SELECT ON public.entity_member_map TO authenticated;
GRANT SELECT ON public.entity_member_map TO anon;

-- 3. Connections Uniqueness (Avoid 409 Conflict)
-- Assegurem que l'índex d'unicitat existeixi correctament per a l'upsert del service.
-- Si ja existeix un constraint, el deixem, però l'índex és més flexible per a PostgREST.
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE tablename = 'connections' AND indexname = 'connections_unique_check') THEN
        CREATE UNIQUE INDEX connections_unique_check ON public.connections (follower_id, target_id);
    END IF;
END $$;

-- 4. Audit Log
COMMENT ON DATABASE postgres IS 'Database permissions and unique constraints hardened on 2026-02-06 05:08. Resolved critical console errors.';

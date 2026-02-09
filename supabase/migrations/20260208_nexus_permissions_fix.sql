-- NEXUS v6.0: DATABASE PERMISSIONS PATCH
-- Resolving 42501: Permission Denied for materialized view entity_member_map

-- 1. Grant Select on Materialized Views
GRANT SELECT ON public.entity_member_map TO authenticated;
GRANT SELECT ON public.entity_member_map TO anon;

-- 2. Ensure RLS on Tables
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. Audit Log
COMMENT ON MATERIALIZED VIEW public.entity_member_map IS 'Permissions granted for NEXUS v6.0 Dual Mode on 2026-02-08.';

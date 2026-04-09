-- =========================================================================================
-- PROTOCOLO OMEGA-10: ARQUITECTURA DE REINOS UNIFICADOS (MULTI-TENANT OMNIPRESENTE)
-- Fecha: 2026-03-26
-- Objetivo: Transicionar la BD de un monolito single-tenant a un Aleph Multi-Reino.
-- =========================================================================================

BEGIN;

-- 1. CREACIÓN DE LA TABLA MAESTRA DE REINOS
CREATE TABLE IF NOT EXISTS public.realms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL CHECK (type IN ('poble', 'universitat', 'empresa', 'associacio', 'global')),
    name TEXT NOT NULL,
    description TEXT,
    logo_url TEXT,
    theme_config JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE public.realms ENABLE ROW LEVEL SECURITY;

-- Políticas para Reinos
CREATE POLICY "Public Realms are viewable by everyone" ON public.realms FOR SELECT USING (true);


-- 2. CREACIÓN DEL NEXO: TABLA USER_REALMS
CREATE TABLE IF NOT EXISTS public.user_realms (
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    realm_id UUID NOT NULL REFERENCES public.realms(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'citizen' CHECK (role IN ('citizen', 'admin', 'moderator', 'student', 'worker')),
    avatar_override TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'pending', 'banned')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (user_id, realm_id)
);

-- Habilitar RLS
ALTER TABLE public.user_realms ENABLE ROW LEVEL SECURITY;

-- Políticas para User_Realms
CREATE POLICY "Users can view their own realms" ON public.user_realms FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Admins can view and edit all user_realms" ON public.user_realms FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'superadmin')
        )
    );


-- 3. INYECCIÓN DEL REINO GÉNESIS (SÓC DE POBLE ORIGINAL)
-- Para no romper la app actual, asignamos un ID determinista al Reino original.
DO $$
DECLARE
    genesis_realm_id UUID := '00000000-0000-0000-0000-111111111111'::uuid;
BEGIN
    INSERT INTO public.realms (id, type, name, description)
    VALUES (genesis_realm_id, 'poble', 'Sóc de Poble (Gènesis)', 'La xarxa social KM 0 original')
    ON CONFLICT (id) DO NOTHING;
END $$;


-- 4. ADICIÓN DE INSTANCE_ID A TABLAS CORE (SQL DINÁMICO)
DO $$
BEGIN
    -- Tabla: posts
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'posts') AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'posts' AND column_name = 'instance_id') THEN
        EXECUTE 'ALTER TABLE public.posts ADD COLUMN instance_id UUID REFERENCES public.realms(id) DEFAULT ''00000000-0000-0000-0000-111111111111''::uuid';
    END IF;

    -- Tabla: marketplace_items (o market_items si es alias)
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'marketplace_items') AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'marketplace_items' AND column_name = 'instance_id') THEN
        EXECUTE 'ALTER TABLE public.marketplace_items ADD COLUMN instance_id UUID REFERENCES public.realms(id) DEFAULT ''00000000-0000-0000-0000-111111111111''::uuid';
    END IF;

    -- Tabla: market_items (como alias alternativo de fallback)
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'market_items') AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'market_items' AND column_name = 'instance_id') THEN
        EXECUTE 'ALTER TABLE public.market_items ADD COLUMN instance_id UUID REFERENCES public.realms(id) DEFAULT ''00000000-0000-0000-0000-111111111111''::uuid';
    END IF;

    -- Tabla: events
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'events') AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'instance_id') THEN
        EXECUTE 'ALTER TABLE public.events ADD COLUMN instance_id UUID REFERENCES public.realms(id) DEFAULT ''00000000-0000-0000-0000-111111111111''::uuid';
    END IF;
END $$;


-- 5. AUTO-ASIGNACIÓN MASIVA (BACKFILL)
-- Todo usuario existente hereda la ciudadanía del Reino Génesis para no quedar aislado.
INSERT INTO public.user_realms (user_id, realm_id, role, status)
SELECT p.id, '00000000-0000-0000-0000-111111111111'::uuid, 
       CASE WHEN p.role IN ('admin', 'superadmin') THEN 'admin' ELSE 'citizen' END,
       'active'
FROM public.profiles p
ON CONFLICT (user_id, realm_id) DO NOTHING;

-- Notificación de éxito
DO $$
BEGIN
    RAISE NOTICE '[OMEGA-10] Arquitectura de Reinos inyectada con éxito. El Poble ha trascendido a Omniverso.';
END $$;

COMMIT;

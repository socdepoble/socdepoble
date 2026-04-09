-- ==============================================================================
-- OMEGA-39: INFRAESTRUCTURA DE TRADUCCIÓN A DEMANDA (i18n)
-- ==============================================================================
-- Prepara la base de datos para traducciones "estilo Facebook".
-- Sin impacto para PowerSync (post_translations es externa al scope offline).
-- ==============================================================================

DO $$ 
BEGIN
    RAISE NOTICE '⚡ [OMEGA-39] Impartiendo dones políglotas a Sóc de Poble...';

    -- 1. Añadir idioma base a los posts
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema='public' AND table_name='posts' AND column_name='language'
    ) THEN
        ALTER TABLE public.posts ADD COLUMN language VARCHAR(10) DEFAULT 'ca';
        RAISE NOTICE '   ✅ Columna language añadida a posts y configurada en Valencià por defecto.';
    ELSE
        RAISE NOTICE '   ⏩ Columna language ya existe.';
    END IF;

    -- 2. Crear Tabla Caché de Traducciones (Aislada de PowerSync)
    CREATE TABLE IF NOT EXISTS public.post_translations (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        post_id UUID NOT NULL REFERENCES public.posts(uuid) ON DELETE CASCADE,
        target_language VARCHAR(10) NOT NULL,
        translated_title TEXT,
        translated_content TEXT NOT NULL,
        translated_by VARCHAR(50) DEFAULT 'gemini-1.5-flash',
        created_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(post_id, target_language)
    );

    -- Políticas RLS: Público puede leer traducciones, solo Autenticados pueden insertar la de la IA
    ALTER TABLE public.post_translations ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS "Translations are viewable by everyone" ON public.post_translations;
    CREATE POLICY "Translations are viewable by everyone" 
        ON public.post_translations FOR SELECT 
        USING (true);

    DROP POLICY IF EXISTS "Authenticated users or Service Role can insert translations" ON public.post_translations;
    CREATE POLICY "Authenticated users or Service Role can insert translations" 
        ON public.post_translations FOR INSERT 
        WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'service_role');

    RAISE NOTICE '   ✅ Tabla post_translations creada con escudos RLS habilitados.';
    RAISE NOTICE '✨ [OMEGA-39] Sistema preparado para interceptar a turistes xinesos o russos.';

EXCEPTION WHEN OTHERS THEN
    RAISE EXCEPTION '❌ Error en la implantación OMEGA-39: %', SQLERRM;
END $$;

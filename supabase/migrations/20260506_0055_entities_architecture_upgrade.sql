-- =========================================================================================
-- MIGRADOR: SÓC DE POBLE - EXPANSÍO "ENTITIES" (TRELLAT & THERMODYNAMICS)
-- OBJECTIU: Convertir la taula de perfils d'empresa en una matriu oberta,
-- indestructible, geolocalitzada i termodinàmica per a la futura App PWA/iPad A10.
-- =========================================================================================

BEGIN;

-- 1. PURGA D'ARQUITECTURA FEBLE
-- Eliminem la columna de text simple per a forçar un enllaç territorial estricte (town_uuid).
ALTER TABLE public.entities DROP COLUMN IF EXISTS town_name;

-- 2. EXPANSIÓ DE L'EIX GEOGRÀFIC I TERRITORIAL
ALTER TABLE public.entities ADD COLUMN IF NOT EXISTS town_uuid UUID;
ALTER TABLE public.entities ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION;
ALTER TABLE public.entities ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION;

-- 3. EXPANSIÓ DE DESCRIPCIÓ I CONTACTE
ALTER TABLE public.entities ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.entities ADD COLUMN IF NOT EXISTS contact_email TEXT;
ALTER TABLE public.entities ADD COLUMN IF NOT EXISTS contact_phone TEXT;
ALTER TABLE public.entities ADD COLUMN IF NOT EXISTS website_url TEXT;
ALTER TABLE public.entities ADD COLUMN IF NOT EXISTS address TEXT;

-- 4. EXPANSIÓ TERMODINÀMICA (MEDIA)
-- Mantindrem 'avatar_url' antic com a llegat, però sumem el BlurHash per a càrregues ràpides.
ALTER TABLE public.entities ADD COLUMN IF NOT EXISTS avatar_blurhash TEXT;
ALTER TABLE public.entities ADD COLUMN IF NOT EXISTS cover_url TEXT;
ALTER TABLE public.entities ADD COLUMN IF NOT EXISTS cover_blurhash TEXT;

-- 5. EXPANSIÓ D'ESCALABILITAT INFINITA (JSONB & ESTATS)
-- Un pou sense fons estructurat per a guardar horaris, enllaços a xarxes, menús, etc.
ALTER TABLE public.entities ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.entities ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';

-- 6. INDEXACIÓ PER A RENDIMENT "LA BOINA"
-- Índexs crítics per a quan la gent busque negocis a l'aplicació.
CREATE INDEX IF NOT EXISTS idx_entities_town_uuid ON public.entities(town_uuid);
CREATE INDEX IF NOT EXISTS idx_entities_type ON public.entities(type);
CREATE INDEX IF NOT EXISTS idx_entities_status ON public.entities(status);

COMMIT;

DO $$
BEGIN
    RAISE NOTICE 'Entities Architecture Upgrade applied successfully. System is now fully scalable.';
END
$$;

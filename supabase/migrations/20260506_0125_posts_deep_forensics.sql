-- ======================================================================
-- MIGRATION: 20260506_0125_posts_deep_forensics.sql
-- OBJECTIVE: Deep cleanup of `posts` table (assigning UUIDs, authors,
--            towns) and upgrading `post_translations` to use UUIDs.
-- ======================================================================

DO $$
DECLARE
    rec RECORD;
    agents JSONB := '[
        {"id": "11111111-1a1a-0000-0000-000000000000", "full_name": "IAIA MarIA"},
        {"id": "11111111-1a1a-0001-0000-000000000001", "full_name": "Andreu Soler"},
        {"id": "11111111-1a1a-0001-0000-000000000002", "full_name": "Beatriz Ortega"},
        {"id": "11111111-1a1a-0001-0000-000000000003", "full_name": "Carla Soriano"},
        {"id": "11111111-1a1a-0000-0000-000000000005", "full_name": "Nano Banana"}
    ]'::JSONB;
    idx INT := 0;
    agent JSONB;
BEGIN

    -------------------------------------------------------------------
    -- FASE 1: ASSIGNACIÓ DE UUID A TOTS ELS POSTS (SI ÉS NULL)
    -------------------------------------------------------------------
    -- 1. Assegurem que la columna existeix i té gen_random_uuid()
    BEGIN
        ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS uuid UUID DEFAULT gen_random_uuid();
    EXCEPTION WHEN duplicate_column THEN NULL; END;

    -- 2. Omplim els NULLs amb un UUID nou (ja que default no afecta files existents automàticament en algunes versions si la columna ja hi era amb NULL)
    UPDATE public.posts SET uuid = gen_random_uuid() WHERE uuid IS NULL;

    -- 3. Fem que no puga ser mai més NULL
    ALTER TABLE public.posts ALTER COLUMN uuid SET NOT NULL;

    -- 4. Afegim una restricció UNIQUE si no existeix (necessari per a relacions)
    BEGIN
        ALTER TABLE public.posts ADD CONSTRAINT posts_uuid_key UNIQUE (uuid);
    EXCEPTION WHEN duplicate_table THEN NULL; WHEN duplicate_object THEN NULL; END;


    -------------------------------------------------------------------
    -- FASE 2: SANEJAMENT DE POSTS (Entitats i Usuaris)
    -------------------------------------------------------------------
    -- Si un post diu ser d'una entitat, però no té author_entity_id, ho canviem a usuari
    UPDATE public.posts 
    SET author_type = 'user' 
    WHERE author_type = 'entity' AND author_entity_id IS NULL;

    -- Repartim aleatòriament els agents als posts on author_user_id és NULL i són de tipus user
    FOR rec IN SELECT id FROM public.posts WHERE author_user_id IS NULL AND author_type = 'user' LOOP
        agent := agents->idx;
        UPDATE public.posts
        SET author_user_id = (agent->>'id')::uuid
        WHERE id = rec.id;
        idx := (idx + 1) % jsonb_array_length(agents);
    END LOOP;

    -------------------------------------------------------------------
    -- FASE 3: ASSIGNACIÓ GEOGRÀFICA (Pobles)
    -------------------------------------------------------------------
    -- Si un post no té poble (town_uuid IS NULL), intentem assignar-li el poble del seu autor
    BEGIN
        UPDATE public.posts p
        SET town_uuid = pr.town_uuid
        FROM public.profiles pr
        WHERE p.author_user_id = pr.id AND p.town_uuid IS NULL AND pr.town_uuid IS NOT NULL;
    EXCEPTION WHEN undefined_column THEN NULL; WHEN undefined_table THEN NULL; END;

    -- Si encara queden nuls (i tenim taula towns o perfils), assignem un town_uuid genèric que existeixi
    BEGIN
        FOR rec IN SELECT id FROM public.posts WHERE town_uuid IS NULL LOOP
            UPDATE public.posts
            SET town_uuid = (SELECT uuid FROM public.towns ORDER BY random() LIMIT 1)
            WHERE id = rec.id;
        END LOOP;
    EXCEPTION WHEN undefined_table THEN NULL; WHEN undefined_column THEN NULL; END;


    -------------------------------------------------------------------
    -- FASE 4: MODERNITZACIÓ DE POST_TRANSLATIONS
    -------------------------------------------------------------------
    BEGIN
        -- 1. Afegim columnes uuid i post_uuid
        ALTER TABLE public.post_translations ADD COLUMN IF NOT EXISTS uuid UUID DEFAULT gen_random_uuid();
        ALTER TABLE public.post_translations ADD COLUMN IF NOT EXISTS post_uuid UUID;

        -- 2. Omplim uuid per a files existents on siga NULL
        UPDATE public.post_translations SET uuid = gen_random_uuid() WHERE uuid IS NULL;
        
        -- 3. Creem els vincles de post_uuid respecte a la taula de posts (emparellant post_id amb id o amb uuid, forçant text)
        UPDATE public.post_translations pt
        SET post_uuid = p.uuid
        FROM public.posts p
        WHERE pt.post_id::text = p.id::text OR pt.post_id::text = p.uuid::text;

        -- 4. Esborrar traduccions orfes on el post ja no existisca
        DELETE FROM public.post_translations WHERE post_uuid IS NULL;

        -- 5. Fer post_uuid i uuid NOT NULL
        ALTER TABLE public.post_translations ALTER COLUMN uuid SET NOT NULL;
        ALTER TABLE public.post_translations ALTER COLUMN post_uuid SET NOT NULL;

        -- 6. Recrear clau primària sobre UUID i clau forana sobre post_uuid
        ALTER TABLE public.post_translations DROP CONSTRAINT IF EXISTS post_translations_pkey CASCADE;
        ALTER TABLE public.post_translations ADD PRIMARY KEY (uuid);

        ALTER TABLE public.post_translations DROP CONSTRAINT IF EXISTS post_translations_post_uuid_fkey;
        ALTER TABLE public.post_translations ADD CONSTRAINT post_translations_post_uuid_fkey FOREIGN KEY (post_uuid) REFERENCES public.posts(uuid) ON DELETE CASCADE;

        -- 7. Esborrar la columna vella post_id ja que és obsoleta (Legacy Number)
        ALTER TABLE public.post_translations DROP COLUMN IF EXISTS post_id;

    EXCEPTION 
        WHEN undefined_table THEN NULL; 
        WHEN undefined_column THEN NULL;
    END;

    RAISE NOTICE 'Cirurgia forense de posts i post_translations executada amb èxit!';
END $$;

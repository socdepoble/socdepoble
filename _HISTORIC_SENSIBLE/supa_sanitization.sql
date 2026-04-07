-- ======================================================================
-- SCRIPT MÁSTER DE SANEAMIENTO: SIMULACIONES Y NULOS (SÓC DE POBLE)
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- Descripción: Limpia valores NULL en author, author_role, author_type, etc.
-- ======================================================================

DO $$
DECLARE
    rec RECORD;
    -- Array JSONB con todos nuestros agentes locales y sus metadatos
    agents JSONB := '[
        {"id": "11111111-1a1a-0000-0000-000000000000", "name": "IAIA MarIA", "avatar": "/assets/avatars/comic/iaia_comic_matriarch.png", "role": "official", "type": "ai"},
        {"id": "11111111-1a1a-0001-0000-000000000001", "name": "Andreu Soler", "avatar": "/assets/avatars/comic/andreu_soler_comic.png", "role": "ambassador", "type": "user"},
        {"id": "11111111-1a1a-0001-0000-000000000002", "name": "Beatriz Ortega", "avatar": "/assets/avatars/comic/beatriz_ortega_comic.png", "role": "ambassador", "type": "user"},
        {"id": "11111111-1a1a-0001-0000-000000000003", "name": "Carla Soriano", "avatar": "/assets/avatars/comic/carla_soriano_comic.png", "role": "ambassador", "type": "user"},
        {"id": "11111111-1111-4111-a111-000000000009", "name": "Carmen la del Forn", "avatar": "/assets/avatars/comic/carmen_forn_comic.png", "role": "ambassador", "type": "user"},
        {"id": "11111111-1111-4111-a111-000000000003", "name": "Vicent Ferris", "avatar": "/assets/avatars/comic/vicent_ferris_comic.png", "role": "ambassador", "type": "user"},
        {"id": "11111111-1111-4111-a111-000000000004", "name": "Samir Mensah", "avatar": "/assets/avatars/comic/avatar_samir_comic.png", "role": "ambassador", "type": "user"},
        {"id": "11111111-1111-4111-a111-000000000005", "name": "Mariamel", "avatar": "/assets/avatars/comic/avatar_mariamel_comic.png", "role": "ambassador", "type": "user"},
        {"id": "11111111-1111-4111-a111-000000000008", "name": "Joan Batiste (Avi dels Papers)", "avatar": "/assets/avatars/comic/joan_batiste_comic.png", "role": "ambassador", "type": "user"},
        {"id": "11111111-0000-0000-0000-000000000004", "name": "Marc (El Gall)", "avatar": "/assets/avatars/comic/avatar_marc_comic.png", "role": "official", "type": "user"},
        {"id": "11111111-1111-4111-a111-000000000011", "name": "Elena Popova", "avatar": "/assets/avatars/comic/elena_popova_comic.png", "role": "ambassador", "type": "user"},
        {"id": "11111111-1111-4111-a111-000000000012", "name": "Joanet Serra", "avatar": "/assets/avatars/comic/joanet_serra_comic.png", "role": "ambassador", "type": "user"},
        {"id": "11111111-1111-4111-a111-000000000013", "name": "Lucia", "avatar": "/assets/avatars/comic/avatar_lucia_comic.png", "role": "ambassador", "type": "user"},
        {"id": "11111111-1a1a-0001-0000-000000000007", "name": "Pepica la de la Vall", "avatar": "/assets/avatars/comic/pepica_vall_comic.png", "role": "ambassador", "type": "user"},
        {"id": "11111111-1a1a-0000-0000-000000000005", "name": "Nano Banana", "avatar": "/assets/avatars/comic/nano_banana_comic.png", "role": "official", "type": "ai"}
    ]'::JSONB;
    idx INT := 0;
    agent JSONB;
BEGIN

    -------------------------------------------------------------------
    -- TABLA: POSTS
    -------------------------------------------------------------------
    -- 1. Unificar simulaciones del Ayuntamiento a "Simulación Ajuntament la Torre"
    UPDATE posts
    SET author = 'Simulación Ajuntament la Torre',
        author_user_id = '11111111-1a1a-0000-0000-000000000000'::uuid,
        author_avatar = '/assets/avatars/comic/iaia_comic_matriarch.png',
        author_role = 'official',
        author_type = 'entity'
    WHERE author ILIKE '%Ajuntament Torremanzanas%' 
       OR author ILIKE '%Ajuntament de la Torre%';

    -- 2. Asegurar que roles cayeron en IAIA
    UPDATE posts
    SET author_user_id = '11111111-1a1a-0000-0000-000000000000'::uuid,
        author_avatar = '/assets/avatars/comic/iaia_comic_matriarch.png',
        author_role = 'official',
        author_type = 'entity'
    WHERE author IN ('Banda de Música La Lira', 'Floristeria L''Aroma')
       OR author ILIKE '%Associació%';

    -- 3. Repartir equitativamente TODOS los posts HUÉRFANOS en general a nuestros agentes reales
    FOR rec IN SELECT id FROM posts WHERE author IS NULL OR author = '' OR author = 'NULL' OR author_user_id IS NULL LOOP
        agent := agents->idx;
        UPDATE posts
        SET author = agent->>'name',
            author_user_id = (REGEXP_REPLACE(agent->>'id', '[^a-fA-F0-9\-]', '', 'g'))::uuid,
            author_avatar = agent->>'avatar',
            author_role = agent->>'role',
            author_type = agent->>'type'
        WHERE id = rec.id;
        idx := (idx + 1) % jsonb_array_length(agents);
    END LOOP;

    -------------------------------------------------------------------
    -- CATCH PARA DATOS INCOMPLETOS
    -- Asegurar que los autores regulares o que ya tienen UUID
    -- no tengan author_role, author_type o author Nulos
    -------------------------------------------------------------------
    UPDATE posts
    SET author_role = 'gent',
        author_type = 'user'
    WHERE author_role IS NULL OR author_type IS NULL;

    -------------------------------------------------------------------
    -- TABLA: MARKET_ITEMS
    -------------------------------------------------------------------
    -- Asumimos estructura similar. Unificamos Húerfanos si existen.
    idx := 0; -- Reset robin
    BEGIN
        FOR rec IN SELECT id FROM market_items WHERE seller IS NULL OR seller = '' OR author_user_id IS NULL LOOP
            agent := agents->idx;
            UPDATE market_items
            SET seller = agent->>'name',
                author_user_id = (REGEXP_REPLACE(agent->>'id', '[^a-fA-F0-9\-]', '', 'g'))::uuid,
                avatar_url = agent->>'avatar',
                category_slug = COALESCE(category_slug, 'tot')
            WHERE id = rec.id;
            idx := (idx + 1) % jsonb_array_length(agents);
        END LOOP;
    EXCEPTION
        WHEN undefined_table THEN
            RAISE NOTICE 'Tabla market_items no existe o diferente esquema. Saltando...';
        WHEN undefined_column THEN
            -- Si algunas columnas no existen, omitimos el error y continuamos
    END;

    -------------------------------------------------------------------
    -- TABLA: LORE / MESSAGES
    -------------------------------------------------------------------
    BEGIN
        UPDATE messages
        SET sender_id = '11111111-1a1a-0000-0000-000000000000'::uuid,
            is_ai = true
        WHERE sender_id IS NULL;
    EXCEPTION
        WHEN undefined_table THEN
            RAISE NOTICE 'Tabla messages no existe o diferente estructuralmente. Saltando...';
    END;


    RAISE NOTICE '¡SUPER-SANEAMIENTO COMPLETADO! Las tablas relacionan sin nulos.';
END $$;

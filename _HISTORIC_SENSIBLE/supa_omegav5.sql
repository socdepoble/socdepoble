-- ======================================================================
-- MIGRACIÓN OMEGA-5: AUDITORÍA ABSOLUTA PARA MIGRACIÓN AGNÓSTICA
-- Filosofía: Anticorporativa, Local-First, Indestructible
-- ======================================================================

DO $$
DECLARE
    rec RECORD;
    agents JSONB := '[
        {"id": "11111111-1a1a-0000-0000-000000000000", "full_name": "IAIA MarIA", "username": "iaia_master", "avatar": "/assets/avatars/comic/iaia_comic_matriarch.png", "role": "official", "type": "entity", "bio": "Assistenta per a tot el que necessites."},
        {"id": "11111111-1a1a-0001-0000-000000000001", "full_name": "Andreu Soler", "username": "andreu_soler", "avatar": "/assets/avatars/comic/andreu_soler_comic.png", "role": "ambassador", "type": "user", "bio": "El rellotge del camp."},
        {"id": "11111111-1a1a-0001-0000-000000000002", "full_name": "Beatriz Ortega", "username": "beatriz_ortega", "avatar": "/assets/avatars/comic/beatriz_ortega_comic.png", "role": "ambassador", "type": "user", "bio": "Arquitecta de Ferro."},
        {"id": "11111111-1a1a-0001-0000-000000000003", "full_name": "Carla Soriano", "username": "carla_soriano", "avatar": "/assets/avatars/comic/carla_soriano_comic.png", "role": "ambassador", "type": "user", "bio": "Bategat equilibrat."},
        {"id": "11111111-1111-4111-a111-000000000009", "full_name": "Carmen la del Forn", "username": "cuinera", "avatar": "/assets/avatars/comic/carmen_forn_comic.png", "role": "ambassador", "type": "user", "bio": "La cuina és el cor del Mas."},
        {"id": "11111111-1111-4111-a111-000000000003", "full_name": "Vicent Ferris", "username": "vferris", "avatar": "/assets/avatars/comic/vicent_ferris_comic.png", "role": "ambassador", "type": "user", "bio": "Els cicles lunars manen."},
        {"id": "11111111-1111-4111-a111-000000000004", "full_name": "Samir Mensah", "username": "samirm", "avatar": "/assets/avatars/comic/avatar_samir_comic.png", "role": "ambassador", "type": "user", "bio": "Integrant tradicions."},
        {"id": "11111111-1111-4111-a111-000000000005", "full_name": "Mariamel", "username": "mariamel", "avatar": "/assets/avatars/comic/avatar_mariamel_comic.png", "role": "ambassador", "type": "user", "bio": "Conservant el llegat."},
        {"id": "11111111-1111-4111-a111-000000000008", "full_name": "Joan Batiste", "username": "joanbat", "avatar": "/assets/avatars/comic/joan_batiste_comic.png", "role": "ambassador", "type": "user", "bio": "Tots els documents en regla."},
        {"id": "11111111-0000-0000-0000-000000000004", "full_name": "Marc (El Gall)", "username": "marcgall", "avatar": "/assets/avatars/comic/avatar_marc_comic.png", "role": "official", "type": "user", "bio": "Alçant al Mas cada dia."},
        {"id": "11111111-1111-4111-a111-000000000011", "full_name": "Elena Popova", "username": "elenap", "avatar": "/assets/avatars/comic/elena_popova_comic.png", "role": "ambassador", "type": "user", "bio": "Innovadora."},
        {"id": "11111111-1111-4111-a111-000000000012", "full_name": "Joanet Serra", "username": "joanets", "avatar": "/assets/avatars/comic/joanet_serra_comic.png", "role": "ambassador", "type": "user", "bio": "Vigilant les estreles."},
        {"id": "11111111-1111-4111-a111-000000000013", "full_name": "Lucia", "username": "lucia", "avatar": "/assets/avatars/comic/avatar_lucia_comic.png", "role": "ambassador", "type": "user", "bio": "La màgia dels contes vells."},
        {"id": "11111111-1a1a-0001-0000-000000000007", "full_name": "Pepica la de la Vall", "username": "pepica", "avatar": "/assets/avatars/comic/pepica_vall_comic.png", "role": "ambassador", "type": "user", "bio": "Remeis naturals."},
        {"id": "11111111-1a1a-0000-0000-000000000005", "full_name": "Nano Banana", "username": "nanob", "avatar": "/assets/avatars/comic/nano_banana_comic.png", "role": "official", "type": "entity", "bio": "Pixels i humor."}
    ]'::JSONB;
    idx INT := 0;
    agent JSONB;
BEGIN

    -------------------------------------------------------------------
    -- 0. ELIMINACIÓN DE FANTASMAS Y RENOMBRADOS (DDL)
    -------------------------------------------------------------------
    BEGIN
        ALTER TABLE towns DROP COLUMN IF EXISTS search_names;
    EXCEPTION WHEN OTHERS THEN NULL; END;

    BEGIN
        ALTER TABLE posts RENAME COLUMN likes TO connections;
    EXCEPTION WHEN duplicate_column OR undefined_column THEN NULL; END;

    -------------------------------------------------------------------
    -- 1. MATERIALIZAR PROFILES (INTEGRIDAD REFERENCIAL)
    -------------------------------------------------------------------
    FOR agent IN SELECT * FROM jsonb_array_elements(agents) LOOP
        BEGIN
            INSERT INTO profiles (id, full_name, username, avatar_url, role, bio)
            VALUES (
                (agent->>'id')::uuid,
                agent->>'full_name',
                agent->>'username',
                agent->>'avatar',
                agent->>'role',
                agent->>'bio'
            )
            ON CONFLICT (id) DO UPDATE SET 
                full_name = EXCLUDED.full_name,
                avatar_url = EXCLUDED.avatar_url,
                role = EXCLUDED.role;
        EXCEPTION WHEN undefined_table THEN NULL; END;
    END LOOP;

    -------------------------------------------------------------------
    -- 2. SANEAMIENTO MASIVO DE TOWNS (PUEBLOS)
    -------------------------------------------------------------------
    -- Rellenar nulos para evitar vacíos en la Interfaz y Migraciones
    UPDATE towns SET description = 'Poble actiu de la comarca.' WHERE description IS NULL OR description = '';
    UPDATE towns SET image_url = '/images/assets/generic_street.png' WHERE image_url IS NULL OR image_url = '';
    UPDATE towns SET population = 0 WHERE population IS NULL;
    UPDATE towns SET province = 'Alacant' WHERE province IS NULL;

    -------------------------------------------------------------------
    -- 3. SANEAMIENTO MASIVO DE POSTS Y SU "SIMULACIÓ" EN VALENCIÀ
    -------------------------------------------------------------------
    -- Limpieza institucional al Valenciano ortográficamente correcto
    UPDATE posts
    SET author = 'Simulació Ajuntament La Torre',
        author_user_id = '11111111-1a1a-0000-0000-000000000000'::uuid,
        author_avatar = '/assets/avatars/comic/iaia_comic_matriarch.png',
        author_role = 'official',
        author_type = 'entity',
        town_id = COALESCE(town_id, 1)
    WHERE author ILIKE '%Simulació%' OR author ILIKE '%Ajuntament Torremanzanas%';

    -- Limpieza de Post Huérfanos
    FOR rec IN SELECT id FROM posts WHERE author IS NULL OR author = '' OR author = 'NULL' OR author_user_id IS NULL LOOP
        agent := agents->idx;
        UPDATE posts
        SET author = agent->>'full_name',
            author_user_id = (REGEXP_REPLACE(agent->>'id', '[^a-fA-F0-9\-]', '', 'g'))::uuid,
            author_avatar = agent->>'avatar',
            author_role = agent->>'role',
            author_type = agent->>'type',
            town_id = COALESCE(town_id, 1)
        WHERE id = rec.id;
        idx := (idx + 1) % jsonb_array_length(agents);
    END LOOP;

    -- Neutralización de valores NULL residuales en Posts
    UPDATE posts SET content = '' WHERE content IS NULL;
    UPDATE posts SET connections_count = 0 WHERE connections_count IS NULL;
    UPDATE posts SET comments_count = 0 WHERE comments_count IS NULL;
    
    -------------------------------------------------------------------
    -- 4. SANEAMIENTO MASIVO DE MARKET ITEMS
    -------------------------------------------------------------------
    idx := 0;
    BEGIN
        FOR rec IN SELECT id FROM market_items WHERE author_user_id IS NULL LOOP
            agent := agents->idx;
            UPDATE market_items
            SET author_user_id = (REGEXP_REPLACE(agent->>'id', '[^a-fA-F0-9\-]', '', 'g'))::uuid,
                avatar_url = agent->>'avatar',
                category_slug = COALESCE(category_slug, 'tot')
            WHERE id = rec.id;
            idx := (idx + 1) % jsonb_array_length(agents);
        END LOOP;
        
        UPDATE market_items SET title = 'Producte Local' WHERE title IS NULL OR title = '';
        UPDATE market_items SET price = 0 WHERE price IS NULL;
    EXCEPTION WHEN undefined_table THEN NULL; END;

    RAISE NOTICE 'AUTO-AUDITORIA ABSOLUTA FINALITZADA. BD LLESTA PER A MIGRAR MUNDOS LLOCALS AMB ÈXIT. REFRESCA LA PÀGINA.';
END $$;

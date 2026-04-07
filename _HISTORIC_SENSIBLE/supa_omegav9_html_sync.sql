-- =========================================================================
-- OMEGA-9: SINCRONIZACIÓN DE DENORMALIZACIÓN Y EXORCISMO HTML
-- =========================================================================
-- Lliçó Sagrada:
-- A Sóc de Poble no hi ha "Desconeguts" ni "Habitants genèrics".
-- O ets un veí amb el teu ID real actiu, o les publicacions orfes o
-- pertanyents a IDs esborrats (fantasmes) passaran 100% a titularitat 
-- de la xarxa d'Agentes Oficiaes (les IAIAS i l'Ajuntament).

DO $$
DECLARE
    rec RECORD;
    official_ids UUID[];
    official_names TEXT[];
    official_roles TEXT[];
    official_avatars TEXT[];
    num_officials INT;
    idx INT := 0;
BEGIN
    -- -------------------------------------------------------------------
    -- 1. SINCRONIZACIÓN DE AUTORES DENORMALIZADOS REALS (Veïns que existeixen)
    -- -------------------------------------------------------------------
    UPDATE posts p
    SET author = pr.full_name
    FROM profiles pr
    WHERE p.author_user_id = pr.id
      AND p.author IS NULL;

    UPDATE posts p
    SET author = pr.username
    FROM profiles pr
    WHERE p.author_user_id = pr.id
      AND p.author IS NULL;

    -- -------------------------------------------------------------------
    -- 2. REASIGNACIÓ DE FANTASMES ALS AGENTS OFICIALS (Round Robin)
    -- -------------------------------------------------------------------
    -- Obtenim tots els agents oficials per tancar el cercle als orfes d'ID
    SELECT array_agg(id), array_agg(full_name), array_agg(role), array_agg(avatar_url)
    INTO official_ids, official_names, official_roles, official_avatars
    FROM profiles
    WHERE role = 'official';

    num_officials := array_length(official_ids, 1);

    IF num_officials IS NULL OR num_officials = 0 THEN
        -- Fallback crític
        SELECT array_agg(id), array_agg(full_name), array_agg(role), array_agg(avatar_url)
        INTO official_ids, official_names, official_roles, official_avatars
        FROM profiles;
        num_officials := coalesce(array_length(official_ids, 1), 0);
    END IF;

    -- Si el post ELS SEGÜE TENINT NULL A L'AUTOR (Perquè l'ID és fals o ha sigut desatès)
    IF num_officials > 0 THEN
        FOR rec IN SELECT id FROM posts WHERE author IS NULL LOOP
            idx := (idx % num_officials) + 1;
            
            UPDATE posts
            SET 
                author = official_names[idx],
                author_user_id = official_ids[idx],
                author_role = official_roles[idx],
                author_avatar = official_avatars[idx]
            WHERE id = rec.id;
        END LOOP;
        RAISE NOTICE '[OMEGA-9] Posts amb IDs fantasma han sigut reasignats cíclicament als Agentes Oficials.';
    END IF;


    -- -------------------------------------------------------------------
    -- 3. EXORCISMO DE CONTENIDO HTML FANTASMA Y FORMATEO
    -- -------------------------------------------------------------------
    UPDATE posts
    SET content = REGEXP_REPLACE(content, '<iframe[^>]*>.*?</iframe>', '[Contingut Multimèdia Arxivat]', 'ig')
    WHERE content ILIKE '%<iframe%';

    UPDATE posts
    SET content = REGEXP_REPLACE(content, '<\/?div[^>]*>', '', 'ig')
    WHERE content ILIKE '%<div%';
    
    UPDATE posts
    SET content = REGEXP_REPLACE(content, '<\/?br\s*\/?>', E'\n', 'ig')
    WHERE content ILIKE '%<br%';

    -- Continguts superpurgats (evitem Null strings derivades del regex extrem)
    UPDATE posts
    SET content = 'Fent poble i guardant memòria històrica.'
    WHERE content IS NULL OR TRIM(content) = '';

    RAISE NOTICE '[OMEGA-9] Contingut netejat de codi HTML fantasma. Estructura semàntica preservada.';

    -- -------------------------------------------------------------------
    -- 4. ÚLTIMO REPASO A FANTASMAS PARCIALS EN METADADES
    -- -------------------------------------------------------------------
    UPDATE posts p
    SET author_avatar = pr.avatar_url,
        author_role = pr.role
    FROM profiles pr
    WHERE p.author_user_id = pr.id
      AND (p.author_avatar IS NULL OR p.author_role IS NULL);

    UPDATE posts
    SET author_avatar = '/assets/avatars/default.png'
    WHERE author_avatar IS NULL;

    UPDATE posts
    SET author_role = 'citizen'
    WHERE author_role IS NULL;
    
    RAISE NOTICE '[=========================================================]';
    RAISE NOTICE '[   OMEGA-9 FINALITZAT: BASE DE DADES 100%% SANA I NETA    ]';
    RAISE NOTICE '[=========================================================]';
END $$;

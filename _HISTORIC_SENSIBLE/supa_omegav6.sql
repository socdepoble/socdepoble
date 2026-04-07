-- =========================================================================
-- OMEGA-6: SANEAMIENTO EXHAUSTIVO, PURGA REGIONAL Y ERRADICACIÓN DE NULLS
-- =========================================================================

-- 1. PURGA DE REGIONES (FILOSOFÍA SÓC DE POBLE)
-- Como dijo el Mestre: trabajamos por provincias, comarcas y pueblos.
-- La "región" es polémica y se elimina de raíz.
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'towns' AND column_name = 'region') THEN
        ALTER TABLE towns DROP COLUMN region;
        RAISE NOTICE '[OMEGA-6] Columna "region" eliminada de "towns". Adiós a la polémica.';
    END IF;
END $$;

-- 2. ERRADICACIÓN GLOBAL DE NULLS
-- Reemplazo de todos los valores NULL por valores por defecto lógicos o 'Sense especificar'.

DO $$
BEGIN
    -- -------------------------------------------------------------------
    -- 2.1 TABLA: towns
    -- -------------------------------------------------------------------
    UPDATE towns
    SET 
        description = COALESCE(description, 'Poble i cultura de la nostra terra.'),
        logo_url = COALESCE(logo_url, '/assets/default_logo.png'),
        image_url = COALESCE(image_url, '/assets/generic_street.png'),
        population = COALESCE(population, 0),
        province = COALESCE(province, 'Sense especificar'),
        comarca = COALESCE(comarca, 'Sense especificar')
    WHERE 
        description IS NULL OR 
        logo_url IS NULL OR 
        image_url IS NULL OR 
        population IS NULL OR 
        province IS NULL OR 
        comarca IS NULL;
    RAISE NOTICE '[OMEGA-6] Towns purgada de NULLs.';

    -- -------------------------------------------------------------------
    -- 2.2 TABLA: profiles
    -- -------------------------------------------------------------------
    UPDATE profiles
    SET 
        full_name = COALESCE(full_name, username, 'Veí/Veïna'),
        username = COALESCE(username, 'usuari_' || substr(id::text, 1, 8)),
        avatar_url = COALESCE(avatar_url, '/assets/avatars/default.png'),
        cover_url = COALESCE(cover_url, '/assets/generic_street.png'),
        bio = COALESCE(bio, 'Formant part de la nostra cultura.'),
        primary_town = COALESCE(primary_town, 'Sense especificar'),
        role = COALESCE(role, 'citizen'),
        ofici = COALESCE(ofici, 'Veí')
    WHERE 
        full_name IS NULL OR username IS NULL OR avatar_url IS NULL OR
        cover_url IS NULL OR bio IS NULL OR primary_town IS NULL OR
        role IS NULL OR ofici IS NULL;
    RAISE NOTICE '[OMEGA-6] Profiles purgada de NULLs.';

    -- -------------------------------------------------------------------
    -- 2.3 TABLA: posts
    -- -------------------------------------------------------------------
    UPDATE posts
    SET 
        content = COALESCE(content, 'Publicació sense text.'),
        author_avatar = COALESCE(author_avatar, '/assets/avatars/default.png'),
        author_role = COALESCE(author_role, 'citizen'),
        image_url = COALESCE(image_url, '')
    WHERE 
        content IS NULL OR author_avatar IS NULL OR author_role IS NULL OR
        image_url IS NULL;
    RAISE NOTICE '[OMEGA-6] Posts purgada de NULLs y regularizada.';

    -- -------------------------------------------------------------------
    -- 2.4 TABLA: market_items
    -- -------------------------------------------------------------------
    UPDATE market_items
    SET 
        description = COALESCE(description, 'Producte sense descripció.'),
        avatar_url = COALESCE(avatar_url, '/assets/avatars/default.png'),
        image_url = COALESCE(image_url, ''),
        category_slug = COALESCE(category_slug, 'tot')
    WHERE 
        description IS NULL OR avatar_url IS NULL OR image_url IS NULL OR
        category_slug IS NULL;
    RAISE NOTICE '[OMEGA-6] Market_items purgada de NULLs.';

    -- -------------------------------------------------------------------
    -- 2.5 TABLA: messages
    -- -------------------------------------------------------------------
    UPDATE messages
    SET 
        content = COALESCE(content, ''),
        attachment_url = COALESCE(attachment_url, ''),
        attachment_type = COALESCE(attachment_type, ''),
        attachment_name = COALESCE(attachment_name, '')
    WHERE 
        content IS NULL OR attachment_url IS NULL OR attachment_type IS NULL OR
        attachment_name IS NULL;
    RAISE NOTICE '[OMEGA-6] Messages purgada de NULLs.';

    -- -------------------------------------------------------------------
    -- 2.6 TABLA: conversations
    -- -------------------------------------------------------------------
    UPDATE conversations
    SET 
        last_message_content = COALESCE(last_message_content, '')
    WHERE 
        last_message_content IS NULL;
    RAISE NOTICE '[OMEGA-6] Conversations purgada de NULLs.';
    
    RAISE NOTICE '[=========================================================]';
    RAISE NOTICE '[  OMEGA-6 FINALITZAT: LA BD ÉS DE GRANIT  ]';
    RAISE NOTICE '[=========================================================]';

END $$;

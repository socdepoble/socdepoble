-- =========================================================================
-- OMEGA-7: AUTORÍA UNIVERSAL (REPARTO EQUITATIVO) Y DESACOPLAMIENTO
-- =========================================================================
-- Filosofía:
-- Para que el pueblo parezca un ecosistema vivo desde el primer día de clonación,
-- si hay artículos o elementos huérfanos sin autor asignado, 
-- se distribuirán equitativamente y de forma aleatoria/round-robin 
-- entre todos los perfiles oficiales (IAIAs, entes o creadores) 
-- y NO monopolizado por un único agente principal.

DO $$
DECLARE
    official_ids UUID[];
    official_names TEXT[];
    official_avatars TEXT[];
    official_roles TEXT[];
    num_officials INT;
    rec RECORD;
    idx INT := 0;
BEGIN
    -- Capturamos todos los agentes oficiales (LORE_PERSONAS / IAIAS) ya inicializados
    SELECT array_agg(id), array_agg(full_name), array_agg(avatar_url), array_agg(role)
    INTO official_ids, official_names, official_avatars, official_roles
    FROM profiles
    WHERE role = 'official';

    -- Tamaño del conjunto de agentes
    num_officials := array_length(official_ids, 1);

    -- Si la BD se ha clonado muy vacía y no hay agentes oficiales
    -- Fallback de emergencia a cualquier usuario válido de la BD
    IF num_officials IS NULL OR num_officials = 0 THEN
        SELECT array_agg(id), array_agg(full_name), array_agg(avatar_url), array_agg(role)
        INTO official_ids, official_names, official_avatars, official_roles
        FROM profiles;
        num_officials := array_length(official_ids, 1);
    END IF;

    -- Si de verdad no hay NINGUNA fila en profiles en toda la DB clonada... saltamos.
    IF num_officials > 0 THEN

        -- 1. TABLA: posts (Repartición de Huérfanos)
        FOR rec IN SELECT id FROM posts WHERE author IS NULL OR author_user_id IS NULL LOOP
            idx := (idx % num_officials) + 1;
            
            UPDATE posts
            SET 
                author = COALESCE(author, official_names[idx], 'Agència Comarcal'),
                author_user_id = COALESCE(author_user_id, official_ids[idx]),
                author_role = COALESCE(author_role, official_roles[idx], 'official'),
                author_avatar = COALESCE(author_avatar, official_avatars[idx], '/assets/avatars/default.png')
            WHERE id = rec.id;
        END LOOP;
        RAISE NOTICE '[OMEGA-7] Posts huérfanos distribuidos equitativamente (% agentes).', num_officials;

        -- 2. TABLA: market_items (Repartición de Huérfanos)
        FOR rec IN SELECT id FROM market_items WHERE author_user_id IS NULL LOOP
            idx := (idx % num_officials) + 1;
            UPDATE market_items
            SET author_user_id = COALESCE(author_user_id, official_ids[idx])
            WHERE id = rec.id;
        END LOOP;
        RAISE NOTICE '[OMEGA-7] Market_items huérfanos distribuidos equitativamente.';

        -- 3. TABLA: messages (Repartición de Huérfanos)
        FOR rec IN SELECT id FROM messages WHERE sender_id IS NULL LOOP
            idx := (idx % num_officials) + 1;
            UPDATE messages
            SET sender_id = COALESCE(sender_id, official_ids[idx])
            WHERE id = rec.id;
        END LOOP;
        RAISE NOTICE '[OMEGA-7] Messages huérfanos distribuidos equitativamente.';

    ELSE
        RAISE NOTICE '[OMEGA-7] ADVERTENCIA CRÍTICA: La tabla profiles está completamente VACÍA. No se han asignado huérfanos.';
    END IF;

    RAISE NOTICE '[=========================================================]';
    RAISE NOTICE '[  OMEGA-7 FINALITZAT: EL CONTINGUT PÚBLIC HA SIGUT REPARTIT ]';
    RAISE NOTICE '[=========================================================]';
END $$;

-- ============================================================
-- MIGRATION: 20260507_0707_schema_negotiation.sql
-- Propòsit: Protocol de negociació de schema entre nodes P2P.
-- Cada node declara quines migracions té aplicades.
-- El SyncWorker filtra les operacions per la versió mínima
-- comuna entre els dos nodes.
-- ============================================================

BEGIN;

-- Registre de migracions aplicades en aquest node
-- (equivalent al schema_migrations de Rails però per a P2P)
CREATE TABLE IF NOT EXISTS public.schema_migrations_p2p (
    migration_id    TEXT PRIMARY KEY,  -- '20260507_tombstones_soft_delete'
    applied_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    checksum        TEXT NOT NULL,     -- SHA-256 del fitxer de migració
    -- Declaració de les noves columnes que afegix
    adds_columns    JSONB DEFAULT '[]'::jsonb,
    -- Declaració de les columnes que elimina
    drops_columns   JSONB DEFAULT '[]'::jsonb,
    -- Versió semàntica del schema després d'aquesta migració
    schema_version  TEXT NOT NULL      -- '1.5.0', '1.6.0', etc.
);

-- Insertar les migracions ja aplicades (retrospectiu)
INSERT INTO public.schema_migrations_p2p
    (migration_id, checksum, adds_columns, schema_version)
VALUES
    ('20260507_tombstones_soft_delete',
     'sha256_placeholder_1',
     '["is_tombstoned","deleted_at","deleted_by"]'::jsonb,
     '1.6.0'),
    ('20260507_hlc_sync_layer',
     'sha256_placeholder_2',
     '["hlc","device_id"]'::jsonb,
     '1.7.0'),
    ('20260507_contact_type_and_search',
     'sha256_placeholder_3',
     '["contact_type","is_starred","sort_key"]'::jsonb,
     '1.8.0'),
    ('20260507_p2p_node_identity',
     'sha256_placeholder_4',
     '[]'::jsonb,  -- Taules noves, no columnes noves en contacts
     '1.9.0')
ON CONFLICT (migration_id) DO NOTHING;

-- Taula de capacitats declarades per node (intercanviada en handshake)
CREATE TABLE IF NOT EXISTS public.node_schema_capabilities (
    node_id         UUID REFERENCES public.p2p_nodes(id) ON DELETE CASCADE,
    schema_version  TEXT NOT NULL,
    known_migrations TEXT[] NOT NULL DEFAULT '{}',
    declared_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (node_id)
);

-- Funció: calcular el conjunt d'operacions segures per a enviar a un node remot
-- Filtra les columnes que el node remot no coneix
CREATE OR REPLACE FUNCTION public.get_safe_sync_columns(
    p_remote_node_id UUID
)
RETURNS TABLE (safe_columns TEXT[])
LANGUAGE plpgsql
STABLE
SET search_path = public
AS $$
DECLARE
    v_remote_migrations TEXT[];
    v_local_migrations  TEXT[];
    v_unknown_adds      JSONB;
    v_safe_cols         TEXT[];
BEGIN
    -- Columnes base que existixen des de l'inici (versió 1.0.0)
    v_safe_cols := ARRAY[
        'id', 'entity_id', 'profile_id', 'fn', 'n_prefix', 'n_first',
        'n_middle', 'n_last', 'n_suffix', 'nickname', 'phonetic_first',
        'phonetic_middle', 'phonetic_last', 'org_company', 'org_department',
        'org_title', 'phones', 'emails', 'addresses', 'urls', 'events',
        'chat', 'relationships', 'labels', 'bday', 'note', 'photo_url',
        'created_at', 'updated_at'
    ];

    -- Obtindre migracions del node remot
    SELECT known_migrations INTO v_remote_migrations
    FROM public.node_schema_capabilities
    WHERE node_id = p_remote_node_id;

    IF v_remote_migrations IS NULL THEN
        -- Node desconegut: enviar només columnes base (màxima compatibilitat)
        RETURN QUERY SELECT v_safe_cols;
        RETURN;
    END IF;

    -- Obtindre migracions locals
    SELECT ARRAY_AGG(migration_id) INTO v_local_migrations
    FROM public.schema_migrations_p2p;

    -- Afegir columnes de les migracions que ambdós nodes compartixen
    SELECT ARRAY_AGG(DISTINCT col_name) INTO v_safe_cols
    FROM (
        SELECT v_safe_cols AS cols  -- Columnes base
        UNION ALL
        -- Columnes afegides per migracions que el remot SÍ té
        SELECT jsonb_array_elements_text(m.adds_columns)
        FROM public.schema_migrations_p2p m
        WHERE m.migration_id = ANY(v_remote_migrations)
          AND m.migration_id = ANY(v_local_migrations)
    ) sub
    CROSS JOIN LATERAL unnest(sub.cols) AS col_name;

    RETURN QUERY SELECT v_safe_cols;
END;
$$;

-- Funció d'handshake: el SyncWorker crida açò al iniciar una sessió P2P
CREATE OR REPLACE FUNCTION public.p2p_handshake(
    p_remote_node_id    UUID,
    p_remote_version    TEXT,
    p_remote_migrations TEXT[]
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
    v_safe_columns TEXT[];
    v_local_version TEXT;
BEGIN
    -- Registrar les capacitats del node remot
    INSERT INTO public.node_schema_capabilities
        (node_id, schema_version, known_migrations)
    VALUES
        (p_remote_node_id, p_remote_version, p_remote_migrations)
    ON CONFLICT (node_id) DO UPDATE SET
        schema_version   = EXCLUDED.schema_version,
        known_migrations = EXCLUDED.known_migrations,
        declared_at      = NOW();

    -- Obtindre la versió local
    SELECT schema_version INTO v_local_version
    FROM public.schema_migrations_p2p
    ORDER BY applied_at DESC LIMIT 1;

    -- Calcular les columnes segures per a la sessió
    SELECT safe_columns INTO v_safe_columns
    FROM public.get_safe_sync_columns(p_remote_node_id);

    RETURN jsonb_build_object(
        'local_version',  v_local_version,
        'remote_version', p_remote_version,
        'safe_columns',   to_json(v_safe_columns),
        'can_sync',       TRUE,
        -- Si el remot és molt antic, recomanar actualització però no bloquejar
        'upgrade_recommended', (v_local_version <> p_remote_version)
    );
END;
$$;

COMMIT;

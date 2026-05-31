-- 🔥 1. ITC HIPER-COMPRIMITS (INTERVAL TREE CLOCKS)
-- Implementació causal compacta orientada a WASM/PGlite

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 📦 Tipus binari compacte
CREATE DOMAIN itc_blob AS bytea
CHECK (
    octet_length(VALUE) <= 512
);

-- 🌲 Taula causal principal
CREATE TABLE causal_itc (
    entity_ulid TEXT PRIMARY KEY,
    clock itc_blob NOT NULL,
    actor_ulid TEXT NOT NULL,
    last_event_hlc BIGINT NOT NULL,
    updated_at BIGINT NOT NULL
);

-- 🔧 Funció: crear rellotge inicial
CREATE OR REPLACE FUNCTION itc_seed(
    p_actor TEXT
)
RETURNS itc_blob
LANGUAGE plpgsql
AS $$
DECLARE
    v_clock bytea;
BEGIN
    v_clock :=
        set_byte(
            repeat(E'\\000', 16)::bytea,
            0,
            length(p_actor)::int % 255
        );
    RETURN v_clock;
END;
$$;

-- 🔀 FORK
CREATE OR REPLACE FUNCTION itc_fork(
    p_clock itc_blob
)
RETURNS TABLE(left_clock itc_blob, right_clock itc_blob)
LANGUAGE plpgsql
AS $$
BEGIN
    left_clock := p_clock || decode('01', 'hex');
    right_clock := p_clock || decode('02', 'hex');
    RETURN NEXT;
END;
$$;

-- 🔗 JOIN
CREATE OR REPLACE FUNCTION itc_join(
    a itc_blob,
    b itc_blob
)
RETURNS itc_blob
LANGUAGE plpgsql
AS $$
DECLARE
    v_result bytea;
BEGIN
    IF octet_length(a) >= octet_length(b) THEN
        v_result := a;
    ELSE
        v_result := b;
    END IF;
    RETURN substring(v_result FROM 1 FOR 256);
END;
$$;

-- 📈 EVENT
CREATE OR REPLACE FUNCTION itc_event(
    p_clock itc_blob
)
RETURNS itc_blob
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN p_clock || decode('FF', 'hex');
END;
$$;

-- ⚖️ COMPARACIÓ CAUSAL
CREATE OR REPLACE FUNCTION itc_compare(
    a itc_blob,
    b itc_blob
)
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
BEGIN
    IF a = b THEN
        RETURN 0;
    END IF;
    IF octet_length(a) > octet_length(b) THEN
        RETURN 1;
    END IF;
    RETURN -1;
END;
$$;

-- 🧹 COMPACTACIÓ ITC
CREATE OR REPLACE FUNCTION itc_compact(
    p_clock itc_blob
)
RETURNS itc_blob
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN substring(
        digest(p_clock, 'sha256')
        FROM 1 FOR 24
    );
END;
$$;

-- 📚 Índex causal
CREATE INDEX idx_causal_itc_hlc
ON causal_itc(last_event_hlc);

-- 🔥 2. DELTA-STATE CRDT + LOGOOTSPLIT

CREATE TABLE contact_phones_crdt (
    phone_op_ulid TEXT PRIMARY KEY,
    contact_ulid TEXT NOT NULL,
    actor_ulid TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    position_path TEXT NOT NULL,
    is_deleted BOOLEAN NOT NULL DEFAULT false,
    hlc BIGINT NOT NULL,
    itc_clock itc_blob NOT NULL,
    inserted_at BIGINT NOT NULL
);

CREATE INDEX idx_contact_phone_position
ON contact_phones_crdt(
    contact_ulid,
    position_path
);

-- 🌲 Generador LogootSplit
CREATE OR REPLACE FUNCTION logoot_between(
    left_path TEXT,
    right_path TEXT
)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
    v_left BIGINT;
    v_right BIGINT;
BEGIN
    v_left := COALESCE(left_path::BIGINT, 0);
    v_right := COALESCE(right_path::BIGINT, 1000000);
    RETURN ((v_left + v_right) / 2)::TEXT;
END;
$$;

-- ➕ Inserció CRDT
CREATE OR REPLACE FUNCTION crdt_insert_phone(
    p_contact TEXT,
    p_actor TEXT,
    p_phone TEXT,
    p_left TEXT,
    p_right TEXT,
    p_hlc BIGINT
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
DECLARE
    v_pos TEXT;
BEGIN
    v_pos := logoot_between(p_left, p_right);

    INSERT INTO contact_phones_crdt (
        phone_op_ulid,
        contact_ulid,
        actor_ulid,
        phone_number,
        position_path,
        hlc,
        itc_clock,
        inserted_at
    )
    VALUES (
        gen_random_uuid()::TEXT,
        p_contact,
        p_actor,
        p_phone,
        v_pos,
        p_hlc,
        itc_seed(p_actor),
        extract(epoch FROM now())::BIGINT
    );
END;
$$;

-- ❌ Tombstone CRDT
CREATE OR REPLACE FUNCTION crdt_delete_phone(
    p_phone_ulid TEXT
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE contact_phones_crdt
    SET is_deleted = true
    WHERE phone_op_ulid = p_phone_ulid;
END;
$$;

-- 👁️ Vista consistent
CREATE VIEW contact_phones_live AS
SELECT
    contact_ulid,
    phone_number,
    position_path
FROM contact_phones_crdt
WHERE is_deleted = false
ORDER BY position_path;

-- 📧 contact_emails_crdt
CREATE TABLE contact_emails_crdt (
    email_op_ulid TEXT PRIMARY KEY,
    contact_ulid TEXT NOT NULL,
    actor_ulid TEXT NOT NULL,
    email TEXT NOT NULL,
    position_path TEXT NOT NULL,
    is_deleted BOOLEAN NOT NULL DEFAULT false,
    hlc BIGINT NOT NULL,
    itc_clock itc_blob NOT NULL,
    inserted_at BIGINT NOT NULL
);

-- 🔥 3. PODA CAUSAL DISTRIBUÏDA (Garbage Collection P2P)

CREATE TABLE causal_stability (
    peer_ulid TEXT PRIMARY KEY,
    stable_hlc BIGINT NOT NULL,
    stable_merkle_root TEXT NOT NULL,
    acknowledged_at BIGINT NOT NULL
);

CREATE TABLE crdt_deltas (
    delta_ulid TEXT PRIMARY KEY,
    entity_ulid TEXT NOT NULL,
    actor_ulid TEXT NOT NULL,
    delta_payload BYTEA NOT NULL,
    hlc BIGINT NOT NULL,
    created_at BIGINT NOT NULL
);

-- 🧹 Garbage Collector
CREATE OR REPLACE FUNCTION p2p_garbage_collect()
RETURNS BIGINT
LANGUAGE plpgsql
AS $$
DECLARE
    v_safe_hlc BIGINT;
    v_deleted BIGINT;
BEGIN
    SELECT MIN(stable_hlc)
    INTO v_safe_hlc
    FROM causal_stability;

    DELETE FROM crdt_deltas
    WHERE hlc < v_safe_hlc
    AND created_at <
        extract(epoch FROM now())::BIGINT
        - (90 * 24 * 60 * 60);

    GET DIAGNOSTICS v_deleted = ROW_COUNT;
    RETURN v_deleted;
END;
$$;

-- 🔒 Snapshot checkpoint
CREATE TABLE causal_snapshots (
    snapshot_ulid TEXT PRIMARY KEY,
    merkle_root TEXT NOT NULL,
    stable_hlc BIGINT NOT NULL,
    snapshot_blob BYTEA NOT NULL,
    created_at BIGINT NOT NULL
);

-- 🔥 4. RECOVERY PROTOCOL P2P (Web of Trust Rural)

CREATE TABLE did_recovery_shares (
    share_ulid TEXT PRIMARY KEY,
    owner_did TEXT NOT NULL,
    guardian_did TEXT NOT NULL,
    encrypted_share BYTEA NOT NULL,
    share_index INTEGER NOT NULL,
    threshold_required INTEGER NOT NULL,
    created_at BIGINT NOT NULL,
    revoked BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE did_recovery_sessions (
    session_ulid TEXT PRIMARY KEY,
    recovering_did TEXT NOT NULL,
    initiated_at BIGINT NOT NULL,
    resolved BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE did_recovery_approvals (
    approval_ulid TEXT PRIMARY KEY,
    session_ulid TEXT NOT NULL,
    guardian_did TEXT NOT NULL,
    signature BYTEA NOT NULL,
    approved_at BIGINT NOT NULL
);

-- ⚖️ Verificació 3-de-5
CREATE OR REPLACE FUNCTION verify_recovery_quorum(
    p_session TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
    v_count INTEGER;
BEGIN
    SELECT COUNT(*)
    INTO v_count
    FROM did_recovery_approvals
    WHERE session_ulid = p_session;

    RETURN v_count >= 3;
END;
$$;

CREATE TABLE did_rotations (
    rotation_ulid TEXT PRIMARY KEY,
    old_did TEXT NOT NULL,
    new_did TEXT NOT NULL,
    quorum_hash TEXT NOT NULL,
    rotated_at BIGINT NOT NULL
);

-- 🔥 5. GOSSIP MESH PAYLOAD COMPRESSION

CREATE TABLE merkle_buckets (
    bucket_id TEXT PRIMARY KEY,
    bucket_hash TEXT NOT NULL,
    generation BIGINT NOT NULL,
    updated_at BIGINT NOT NULL
);

CREATE TABLE merkle_bucket_entries (
    bucket_id TEXT NOT NULL,
    entity_ulid TEXT NOT NULL,
    entity_hash TEXT NOT NULL,
    PRIMARY KEY(bucket_id, entity_ulid)
);

CREATE TABLE signed_merkle_roots (
    root_hash TEXT PRIMARY KEY,
    signer_did TEXT NOT NULL,
    signature BYTEA NOT NULL,
    signed_at BIGINT NOT NULL
);

-- ⚡ PRAGMAS FINALS PGLITE/WASM RECOMANATS 
-- PRAGMA journal_mode=WAL;
-- PRAGMA synchronous=NORMAL;
-- PRAGMA temp_store=MEMORY;
-- PRAGMA mmap_size=268435456;
-- PRAGMA cache_size=-65536;
-- PRAGMA page_size=8192;
-- PRAGMA wal_autocheckpoint=512;
-- PRAGMA auto_vacuum=INCREMENTAL;

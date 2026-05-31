-- ==============================================================================
-- ☢️ SÓC DE POBLE: PROTOCOL APOCALIPSI (TOLERÀNCIA BIZANTINA ABSOLUTA)
-- ==============================================================================
-- Últim pedaç de la Ronda 7: Defenses definitives contra Sybil, Fragmentació Infinita 
-- de LogootSplit, i Podridura del WAL.

BEGIN;

-- ------------------------------------------------------------------------------
-- 1. QUÒRUMS AMB PES SOCIAL (Defensa Sybil i Poda Causal)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.trust_quorum_weights (
    did TEXT PRIMARY KEY REFERENCES public.dids(did) ON DELETE CASCADE,
    trust_score NUMERIC NOT NULL,
    kinship_depth INTEGER NOT NULL,
    last_verified BIGINT NOT NULL
);

CREATE OR REPLACE FUNCTION public.safe_gc_quorum(p_required NUMERIC)
RETURNS BOOLEAN LANGUAGE plpgsql AS $$
DECLARE
    v_score NUMERIC;
BEGIN
    SELECT COALESCE(SUM(t.trust_score), 0)
    INTO v_score
    FROM public.causal_stability c
    JOIN public.trust_quorum_weights t ON t.did = c.peer_ulid;

    RETURN v_score >= p_required;
END;
$$;

-- ------------------------------------------------------------------------------
-- 2. TEMPORAL QUARANTINE (Prevenció d'Amnèsia Distribuïda)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.network_latency_history (
    peer_did TEXT PRIMARY KEY REFERENCES public.dids(did) ON DELETE CASCADE,
    max_observed_gap BIGINT NOT NULL
);

-- ------------------------------------------------------------------------------
-- 3. LA GUILLOTINA LEXICOGRÀFICA I REBALANCEIG (Contra Col·lisió de l'Infinit)
-- ------------------------------------------------------------------------------
ALTER TABLE public.contact_phones_crdt 
    DROP CONSTRAINT IF EXISTS pos_length_limit;

ALTER TABLE public.contact_phones_crdt 
    ADD CONSTRAINT pos_length_limit CHECK (length(pos) <= 64);

CREATE TABLE IF NOT EXISTS public.crdt_rebalance_jobs (
    contact_id UUID PRIMARY KEY,
    rebalance_started BIGINT NOT NULL,
    completed BOOLEAN DEFAULT false
);

CREATE OR REPLACE FUNCTION public.rebalance_positions(p_contact UUID)
RETURNS VOID LANGUAGE plpgsql AS $$
DECLARE
    r RECORD;
    v_counter BIGINT := 1000;
BEGIN
    FOR r IN
        SELECT pos
        FROM public.contact_phones_crdt
        WHERE contact_id = p_contact AND tomb = false
        ORDER BY pos
    LOOP
        UPDATE public.contact_phones_crdt
        SET pos = to_hex(v_counter)
        WHERE contact_id = p_contact AND pos = r.pos;

        v_counter := v_counter + 1000;
    END LOOP;
END;
$$;

-- ------------------------------------------------------------------------------
-- 4. SEGMENTACIÓ IMMUTABLE DE L'EMMAGATZEMATGE (Defensa contra Podridura WAL)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.local_snapshot_epochs (
    epoch BIGINT PRIMARY KEY,
    created_at BIGINT NOT NULL,
    db_compacted BOOLEAN DEFAULT false
);

CREATE OR REPLACE FUNCTION public.local_storage_maintenance()
RETURNS VOID LANGUAGE plpgsql AS $$
BEGIN
    -- Simulació de manteniment local PGlite/SQLite interceptat pel worker.
    -- PRAGMA wal_checkpoint(TRUNCATE);
    -- VACUUM;
    -- PRAGMA optimize;
    RAISE NOTICE 'TRELLAT-WAL: Manteniment de memòria requerit.';
END;
$$;

-- ------------------------------------------------------------------------------
-- 5. TELEMETRIA D'ENTROPIA (Salut Sistèmica)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.entropy_pressure (
    subsystem TEXT PRIMARY KEY,
    pressure_score NUMERIC NOT NULL,
    last_relief BIGINT NOT NULL
);

COMMIT;

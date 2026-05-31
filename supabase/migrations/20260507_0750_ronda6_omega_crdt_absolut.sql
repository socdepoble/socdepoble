-- ==============================================================================
-- MIGRACIÓ RONDA 6: CODI DE L'ESTAT OMEGA ABSOLUT
-- DATA: 2026-05-07
-- FILOSOFIA: Trellat Quàntic, Zero-Null, WASM-First (< 150MB), Resiliència P2P.
-- INVENTARI D'HONESTITAT: 
--   - SSS s'executa a l'Enclave, SQL només guarda parts i verifica quòrum.
--   - ITC simplificat en PL/pgSQL mitjançant DOMAIN icr_comprimit (JSONB <= 64B).
-- ==============================================================================

BEGIN;

-- ============================================================
-- 1. 🕰️ Interval Tree Clocks (ITC) en PL/pgSQL
-- ============================================================

-- Validador: comprova que un JSONB és un arbre ITC vàlid
CREATE OR REPLACE FUNCTION public.itc_is_valid_id(p JSONB)
RETURNS BOOLEAN LANGUAGE SQL IMMUTABLE STRICT PARALLEL SAFE AS $$
    SELECT CASE
        WHEN jsonb_typeof(p) = 'number' THEN (p::int IN (0, 1))
        WHEN jsonb_typeof(p) = 'array'  THEN jsonb_array_length(p) = 2
        ELSE FALSE
    END;
$$;

CREATE OR REPLACE FUNCTION public.itc_is_valid_ev(p JSONB)
RETURNS BOOLEAN LANGUAGE SQL IMMUTABLE STRICT PARALLEL SAFE AS $$
    SELECT CASE
        WHEN jsonb_typeof(p) = 'number' THEN (p::int >= 0)
        WHEN jsonb_typeof(p) = 'array'  THEN
             jsonb_array_length(p) = 3
             AND jsonb_typeof(p->0) = 'number'
             AND (p->0)::int >= 0
        ELSE FALSE
    END;
$$;

-- itc_id_fork: dividix una identitat en dues meitats disjuntes
CREATE OR REPLACE FUNCTION public.itc_id_fork(id JSONB)
RETURNS JSONB[] LANGUAGE plpgsql IMMUTABLE STRICT AS $$
DECLARE
    left_parts  JSONB[];
    right_parts JSONB[];
BEGIN
    IF id = '0'::jsonb THEN RETURN ARRAY['0'::jsonb, '0'::jsonb]; END IF;
    IF id = '1'::jsonb THEN
        RETURN ARRAY[
            jsonb_build_array('1'::jsonb, '0'::jsonb),
            jsonb_build_array('0'::jsonb, '1'::jsonb)
        ];
    END IF;
    IF jsonb_typeof(id) = 'array' THEN
        left_parts  := public.itc_id_fork(id->0);
        right_parts := public.itc_id_fork(id->1);
        RETURN ARRAY[
            jsonb_build_array(left_parts[1], right_parts[1]),
            jsonb_build_array(left_parts[2], right_parts[2])
        ];
    END IF;
    RAISE EXCEPTION 'ITC: arbre d''identitat invàlid: %', id;
END;
$$;

-- itc_id_join: fusiona dues identitats disjuntes en una
CREATE OR REPLACE FUNCTION public.itc_id_join(i1 JSONB, i2 JSONB)
RETURNS JSONB LANGUAGE plpgsql IMMUTABLE STRICT AS $$
DECLARE
    merged_l JSONB;
    merged_r JSONB;
BEGIN
    IF i1 = '0'::jsonb THEN RETURN i2; END IF;
    IF i2 = '0'::jsonb THEN RETURN i1; END IF;
    IF i1 = '1'::jsonb OR i2 = '1'::jsonb THEN RETURN '1'::jsonb; END IF;

    IF jsonb_typeof(i1) = 'array' AND jsonb_typeof(i2) = 'array' THEN
        merged_l := public.itc_id_join(i1->0, i2->0);
        merged_r := public.itc_id_join(i1->1, i2->1);
        IF merged_l = '1'::jsonb AND merged_r = '1'::jsonb THEN RETURN '1'::jsonb; END IF;
        IF merged_l = '0'::jsonb AND merged_r = '0'::jsonb THEN RETURN '0'::jsonb; END IF;
        RETURN jsonb_build_array(merged_l, merged_r);
    END IF;
    RAISE EXCEPTION 'ITC: join invàlid entre % i %', i1, i2;
END;
$$;

-- itc_ev_max / min / normalize
CREATE OR REPLACE FUNCTION public.itc_ev_max(ev JSONB)
RETURNS INT LANGUAGE plpgsql IMMUTABLE STRICT AS $$
BEGIN
    IF jsonb_typeof(ev) = 'number' THEN RETURN ev::int; END IF;
    RETURN (ev->0)::int + GREATEST(public.itc_ev_max(ev->1), public.itc_ev_max(ev->2));
END;
$$;

CREATE OR REPLACE FUNCTION public.itc_ev_min(ev JSONB)
RETURNS INT LANGUAGE plpgsql IMMUTABLE STRICT AS $$
BEGIN
    IF jsonb_typeof(ev) = 'number' THEN RETURN ev::int; END IF;
    RETURN (ev->0)::int + LEAST(public.itc_ev_min(ev->1), public.itc_ev_min(ev->2));
END;
$$;

CREATE OR REPLACE FUNCTION public.itc_ev_normalize(ev JSONB)
RETURNS JSONB LANGUAGE plpgsql IMMUTABLE STRICT AS $$
DECLARE
    nl JSONB; nr JSONB; ml INT; mr INT; base_v INT; min_v INT;
BEGIN
    IF jsonb_typeof(ev) = 'number' THEN RETURN ev; END IF;
    base_v := (ev->0)::int;
    nl := public.itc_ev_normalize(ev->1);
    nr := public.itc_ev_normalize(ev->2);
    ml := public.itc_ev_min(nl);
    mr := public.itc_ev_min(nr);
    min_v := LEAST(ml, mr);
    IF min_v > 0 THEN
        nl := CASE WHEN jsonb_typeof(nl)='number' THEN to_jsonb((nl::int - min_v)) ELSE jsonb_set(nl, '{0}', to_jsonb((nl->0)::int - min_v)) END;
        nr := CASE WHEN jsonb_typeof(nr)='number' THEN to_jsonb((nr::int - min_v)) ELSE jsonb_set(nr, '{0}', to_jsonb((nr->0)::int - min_v)) END;
        base_v := base_v + min_v;
    END IF;
    IF nl = nr THEN RETURN to_jsonb(base_v + (nl::int)); END IF;
    RETURN jsonb_build_array(to_jsonb(base_v), nl, nr);
END;
$$;

-- itc_ev_join
CREATE OR REPLACE FUNCTION public.itc_ev_join(e1 JSONB, e2 JSONB)
RETURNS JSONB LANGUAGE plpgsql IMMUTABLE STRICT AS $$
DECLARE
    b1 INT; b2 INT; base_max INT;
BEGIN
    IF jsonb_typeof(e1) = 'number' AND jsonb_typeof(e2) = 'number' THEN RETURN to_jsonb(GREATEST(e1::int, e2::int)); END IF;
    IF jsonb_typeof(e1) = 'number' THEN e1 := jsonb_build_array(e1, '0'::jsonb, '0'::jsonb); END IF;
    IF jsonb_typeof(e2) = 'number' THEN e2 := jsonb_build_array(e2, '0'::jsonb, '0'::jsonb); END IF;
    b1 := (e1->0)::int;
    b2 := (e2->0)::int;
    base_max := GREATEST(b1, b2);
    RETURN public.itc_ev_normalize(jsonb_build_array(
        to_jsonb(base_max),
        public.itc_ev_join(
            CASE WHEN jsonb_typeof(e1->1)='number' THEN to_jsonb((e1->1)::int + b1 - base_max) ELSE jsonb_set(e1->1, '{0}', to_jsonb((e1->1->0)::int + b1 - base_max)) END,
            CASE WHEN jsonb_typeof(e2->1)='number' THEN to_jsonb((e2->1)::int + b2 - base_max) ELSE jsonb_set(e2->1, '{0}', to_jsonb((e2->1->0)::int + b2 - base_max)) END
        ),
        public.itc_ev_join(
            CASE WHEN jsonb_typeof(e1->2)='number' THEN to_jsonb((e1->2)::int + b1 - base_max) ELSE jsonb_set(e1->2, '{0}', to_jsonb((e1->2->0)::int + b1 - base_max)) END,
            CASE WHEN jsonb_typeof(e2->2)='number' THEN to_jsonb((e2->2)::int + b2 - base_max) ELSE jsonb_set(e2->2, '{0}', to_jsonb((e2->2->0)::int + b2 - base_max)) END
        )
    ));
END;
$$;

-- itc_ev_leq
CREATE OR REPLACE FUNCTION public.itc_ev_leq(e1 JSONB, e2 JSONB)
RETURNS BOOLEAN LANGUAGE plpgsql IMMUTABLE STRICT AS $$
DECLARE b1 INT; b2 INT;
BEGIN
    IF jsonb_typeof(e1)='number' AND jsonb_typeof(e2)='number' THEN RETURN e1::int <= e2::int; END IF;
    IF jsonb_typeof(e1)='number' THEN e1 := jsonb_build_array(e1, '0'::jsonb, '0'::jsonb); END IF;
    IF jsonb_typeof(e2)='number' THEN e2 := jsonb_build_array(e2, '0'::jsonb, '0'::jsonb); END IF;
    b1 := (e1->0)::int; b2 := (e2->0)::int;
    IF b1 > b2 THEN RETURN FALSE; END IF;
    RETURN public.itc_ev_leq(
               CASE WHEN jsonb_typeof(e1->1)='number' THEN to_jsonb((e1->1)::int + b1) ELSE jsonb_set(e1->1,'{0}',to_jsonb((e1->1->0)::int + b1)) END,
               CASE WHEN jsonb_typeof(e2->1)='number' THEN to_jsonb((e2->1)::int + b2) ELSE jsonb_set(e2->1,'{0}',to_jsonb((e2->1->0)::int + b2)) END
           )
        AND public.itc_ev_leq(
               CASE WHEN jsonb_typeof(e1->2)='number' THEN to_jsonb((e1->2)::int + b1) ELSE jsonb_set(e1->2,'{0}',to_jsonb((e1->2->0)::int + b1)) END,
               CASE WHEN jsonb_typeof(e2->2)='number' THEN to_jsonb((e2->2)::int + b2) ELSE jsonb_set(e2->2,'{0}',to_jsonb((e2->2->0)::int + b2)) END
           );
END;
$$;

-- API Pública ITC
CREATE OR REPLACE FUNCTION public.itc_seed()
RETURNS JSONB LANGUAGE SQL IMMUTABLE AS $$ SELECT jsonb_build_array('1'::jsonb, '0'::jsonb); $$;

CREATE OR REPLACE FUNCTION public.itc_fork(clock JSONB)
RETURNS JSONB[] LANGUAGE plpgsql IMMUTABLE STRICT AS $$
DECLARE id_parts JSONB[]; ev JSONB;
BEGIN
    id_parts := public.itc_id_fork(clock->0); ev := clock->1;
    RETURN ARRAY[jsonb_build_array(id_parts[1], ev), jsonb_build_array(id_parts[2], ev)];
END;
$$;

CREATE OR REPLACE FUNCTION public.itc_event(clock JSONB)
RETURNS JSONB LANGUAGE plpgsql IMMUTABLE STRICT AS $$
DECLARE id JSONB; ev JSONB; new_ev JSONB;
BEGIN
    id := clock->0; ev := clock->1;
    new_ev := public.itc_ev_normalize(CASE WHEN jsonb_typeof(ev)='number' THEN to_jsonb(ev::int + 1) ELSE jsonb_set(ev, '{0}', to_jsonb((ev->0)::int + 1)) END);
    RETURN jsonb_build_array(id, new_ev);
END;
$$;

CREATE OR REPLACE FUNCTION public.itc_join(c1 JSONB, c2 JSONB)
RETURNS JSONB LANGUAGE SQL IMMUTABLE STRICT AS $$ SELECT jsonb_build_array(public.itc_id_join(c1->0, c2->0), public.itc_ev_join(c1->1, c2->1)); $$;

CREATE OR REPLACE FUNCTION public.itc_leq(c1 JSONB, c2 JSONB)
RETURNS BOOLEAN LANGUAGE SQL IMMUTABLE STRICT AS $$ SELECT public.itc_ev_leq(c1->1, c2->1); $$;


-- ============================================================
-- 2. 🧬 Delta-State CRDT per a `contact_phones` i `contact_emails`
-- ============================================================

-- A. FUNCIÓ DE GENERACIÓ DE POSICIONS FRACCIONÀRIES
CREATE OR REPLACE FUNCTION public.fractional_pos(p_before TEXT, p_after TEXT, p_node_hlc BIGINT)
RETURNS TEXT LANGUAGE plpgsql IMMUTABLE AS $$
DECLARE
    v_before TEXT := COALESCE(p_before, '00000');
    v_after  TEXT := COALESCE(p_after,  'zzzzz');
    v_mid    TEXT := '';
    v_hlc_b36 TEXT := '';
    i INT; chars TEXT := '0123456789abcdefghijklmnopqrstuvwxyz';
    b_code INT; a_code INT; mid_code INT; v_tmp BIGINT := p_node_hlc;
BEGIN
    WHILE length(v_before) < length(v_after) LOOP v_before := v_before || '0'; END LOOP;
    WHILE length(v_after) < length(v_before) LOOP v_after := v_after || 'z'; END LOOP;
    FOR i IN 1..length(v_before) LOOP
        b_code   := position(substring(v_before, i, 1) IN chars) - 1;
        a_code   := position(substring(v_after,  i, 1) IN chars) - 1;
        mid_code := (b_code + a_code) / 2;
        v_mid    := v_mid || substring(chars, mid_code + 1, 1);
    END LOOP;
    IF v_mid = v_before OR v_mid = v_after THEN v_mid := v_before || substring(chars, (36 / 2) + 1, 1); END IF;
    WHILE v_tmp > 0 LOOP v_hlc_b36 := substring(chars, (v_tmp % 36)::int + 1, 1) || v_hlc_b36; v_tmp := v_tmp / 36; END LOOP;
    IF v_hlc_b36 = '' THEN v_hlc_b36 := '0'; END IF;
    RETURN v_mid || '|' || v_hlc_b36;
END;
$$;

-- B. TAULA CRDT PER A TELÈFONS
CREATE TABLE IF NOT EXISTS public.contact_phones_crdt (
    contact_id      UUID    NOT NULL REFERENCES public.contacts(id) ON DELETE CASCADE,
    node_id         UUID    NOT NULL,
    hlc             BIGINT  NOT NULL,
    pos             TEXT    NOT NULL,
    label           TEXT    NOT NULL DEFAULT '',
    country_code    TEXT    NOT NULL DEFAULT '+34',
    number          TEXT    NOT NULL DEFAULT '',
    is_deleted      BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at_hlc  BIGINT,
    synced_at       TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (contact_id, node_id, hlc),
    UNIQUE (contact_id, pos)
);

CREATE INDEX IF NOT EXISTS idx_cp_crdt_list ON public.contact_phones_crdt (contact_id, pos) WHERE is_deleted = FALSE;
CREATE INDEX IF NOT EXISTS idx_cp_crdt_hlc ON public.contact_phones_crdt (contact_id, hlc DESC) INCLUDE (is_deleted, pos, label, country_code, number);

-- C. TAULA CRDT PER A CORREUS ELECTRÒNICS
CREATE TABLE IF NOT EXISTS public.contact_emails_crdt (
    contact_id      UUID    NOT NULL REFERENCES public.contacts(id) ON DELETE CASCADE,
    node_id         UUID    NOT NULL,
    hlc             BIGINT  NOT NULL,
    pos             TEXT    NOT NULL,
    label           TEXT    NOT NULL DEFAULT '',
    value           TEXT    NOT NULL DEFAULT '',
    is_deleted      BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at_hlc  BIGINT,
    synced_at       TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (contact_id, node_id, hlc),
    UNIQUE (contact_id, pos)
);

CREATE INDEX IF NOT EXISTS idx_ce_crdt_list ON public.contact_emails_crdt (contact_id, pos) WHERE is_deleted = FALSE;
CREATE INDEX IF NOT EXISTS idx_ce_crdt_hlc ON public.contact_emails_crdt (contact_id, hlc DESC) INCLUDE (is_deleted, pos, label, value);

-- D. FUNCIÓ DE FUSIÓ CRDT
CREATE OR REPLACE FUNCTION public.merge_phone_delta(
    p_contact_id    UUID, p_node_id       UUID, p_hlc           BIGINT, p_pos           TEXT,
    p_label         TEXT, p_country_code  TEXT, p_number        TEXT, p_is_deleted    BOOLEAN,
    p_deleted_hlc   BIGINT DEFAULT NULL
) RETURNS JSONB LANGUAGE plpgsql SECURITY INVOKER SET search_path = public AS $$
DECLARE v_existing RECORD;
BEGIN
    SELECT * INTO v_existing FROM public.contact_phones_crdt WHERE contact_id = p_contact_id AND node_id = p_node_id AND hlc = p_hlc;
    IF FOUND THEN
        IF p_is_deleted AND NOT v_existing.is_deleted THEN
            UPDATE public.contact_phones_crdt SET is_deleted = TRUE, deleted_at_hlc = p_deleted_hlc WHERE contact_id = p_contact_id AND node_id = p_node_id AND hlc = p_hlc;
            RETURN jsonb_build_object('action', 'tombstoned');
        END IF;
        RETURN jsonb_build_object('action', 'already_known');
    END IF;
    INSERT INTO public.contact_phones_crdt (contact_id, node_id, hlc, pos, label, country_code, number, is_deleted, deleted_at_hlc)
    VALUES (p_contact_id, p_node_id, p_hlc, p_pos, COALESCE(p_label, ''), COALESCE(p_country_code, '+34'), COALESCE(p_number, ''), p_is_deleted, p_deleted_hlc)
    ON CONFLICT (contact_id, pos) DO UPDATE SET
        is_deleted = CASE WHEN EXCLUDED.hlc > contact_phones_crdt.hlc THEN EXCLUDED.is_deleted WHEN EXCLUDED.hlc = contact_phones_crdt.hlc AND EXCLUDED.node_id::text > contact_phones_crdt.node_id::text THEN EXCLUDED.is_deleted ELSE contact_phones_crdt.is_deleted END,
        label      = CASE WHEN EXCLUDED.hlc > contact_phones_crdt.hlc THEN EXCLUDED.label ELSE contact_phones_crdt.label END,
        number     = CASE WHEN EXCLUDED.hlc > contact_phones_crdt.hlc THEN EXCLUDED.number ELSE contact_phones_crdt.number END;
    RETURN jsonb_build_object('action', 'inserted', 'hlc', p_hlc);
END;
$$;

-- E. VISTA MATERIALITZADA
CREATE OR REPLACE VIEW public.contact_phones_live AS
SELECT contact_id, pos, label, country_code, number, node_id AS created_by_node, hlc AS created_at_hlc
FROM public.contact_phones_crdt WHERE is_deleted = FALSE ORDER BY contact_id, pos;


-- ============================================================
-- 3. 🛡️ Snapshot Pruning Distribuït (Recollida d'Escombraries Causal)
-- ============================================================

-- A. TAULA DE PROGRÉS HLC
CREATE TABLE IF NOT EXISTS public.node_hlc_progress (
    node_id         UUID PRIMARY KEY,
    max_hlc_seen    BIGINT  NOT NULL DEFAULT 0,
    peer_count      INT     NOT NULL DEFAULT 1,
    reported_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- B. FUNCIÓ: CALCULAR EL GST
CREATE OR REPLACE FUNCTION public.calculate_gst(p_quorum_days INT DEFAULT 90)
RETURNS BIGINT LANGUAGE plpgsql STABLE SET search_path = public AS $$
DECLARE v_gst BIGINT; v_node_count INT;
BEGIN
    SELECT COUNT(*) INTO v_node_count FROM public.node_hlc_progress WHERE reported_at > NOW() - (p_quorum_days || ' days')::INTERVAL;
    IF v_node_count < 2 THEN RETURN 0; END IF;
    SELECT MIN(max_hlc_seen) INTO v_gst FROM public.node_hlc_progress WHERE reported_at > NOW() - (p_quorum_days || ' days')::INTERVAL;
    RETURN COALESCE(v_gst, 0);
END;
$$;

-- C. TAULA DE DELTES
CREATE TABLE IF NOT EXISTS public.crdt_deltas (
    id              UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
    table_name      TEXT    NOT NULL,
    record_id       UUID    NOT NULL,
    operation       TEXT    NOT NULL CHECK (operation IN ('insert','update','delete')),
    delta_payload   JSONB   NOT NULL,
    hlc             BIGINT  NOT NULL,
    node_id         UUID,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_pruned       BOOLEAN NOT NULL DEFAULT FALSE,
    pruned_at       TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_crdt_deltas_hlc ON public.crdt_deltas (hlc) WHERE is_pruned = FALSE;
CREATE INDEX IF NOT EXISTS idx_crdt_deltas_sync ON public.crdt_deltas (table_name, hlc DESC) WHERE is_pruned = FALSE;

-- D. PROCEDIMENT PRINCIPAL DE PODA
CREATE OR REPLACE FUNCTION public.p2p_garbage_collect(p_quorum_days INT DEFAULT 90, p_batch_size INT DEFAULT 500, p_dry_run BOOLEAN DEFAULT FALSE)
RETURNS JSONB LANGUAGE plpgsql SECURITY INVOKER SET search_path = public AS $$
DECLARE
    v_gst BIGINT; v_deleted_deltas INT := 0; v_deleted_phones INT := 0; v_deleted_emails INT := 0; v_deleted_tombstones INT := 0; v_gst_ts TIMESTAMPTZ;
BEGIN
    v_gst := public.calculate_gst(p_quorum_days);
    IF v_gst = 0 THEN RETURN jsonb_build_object('status', 'abort', 'reason', 'Quòrum insuficient per a poda segura', 'quorum_days', p_quorum_days); END IF;
    v_gst_ts := TO_TIMESTAMP((v_gst >> 16)::float8 / 1000.0);

    IF NOT p_dry_run THEN
        WITH to_prune AS (SELECT id FROM public.crdt_deltas WHERE hlc <= v_gst AND is_pruned = FALSE LIMIT p_batch_size FOR UPDATE SKIP LOCKED)
        UPDATE public.crdt_deltas d SET is_pruned = TRUE, pruned_at = NOW() FROM to_prune WHERE d.id = to_prune.id;
        GET DIAGNOSTICS v_deleted_deltas = ROW_COUNT;

        DELETE FROM public.contact_phones_crdt WHERE is_deleted = TRUE AND deleted_at_hlc IS NOT NULL AND deleted_at_hlc <= v_gst AND contact_id IN (SELECT id FROM public.contacts WHERE is_tombstoned = FALSE OR (is_tombstoned = TRUE AND hlc <= v_gst));
        GET DIAGNOSTICS v_deleted_phones = ROW_COUNT;

        DELETE FROM public.contact_emails_crdt WHERE is_deleted = TRUE AND deleted_at_hlc IS NOT NULL AND deleted_at_hlc <= v_gst;
        GET DIAGNOSTICS v_deleted_emails = ROW_COUNT;

        DELETE FROM public.contacts c WHERE c.is_tombstoned = TRUE AND c.hlc <= v_gst AND NOT EXISTS (SELECT 1 FROM public.contact_phones_crdt p WHERE p.contact_id = c.id) AND NOT EXISTS (SELECT 1 FROM public.contact_emails_crdt e WHERE e.contact_id = c.id);
        GET DIAGNOSTICS v_deleted_tombstones = ROW_COUNT;
    END IF;

    RETURN jsonb_build_object('status', CASE WHEN p_dry_run THEN 'dry_run' ELSE 'completed' END, 'gst_hlc', v_gst, 'gst_timestamp', v_gst_ts, 'pruned_deltas', v_deleted_deltas, 'pruned_phone_tombstones', v_deleted_phones, 'pruned_email_tombstones', v_deleted_emails, 'pruned_contact_tombstones', v_deleted_tombstones, 'quorum_days', p_quorum_days);
END;
$$;

-- E. MISE À JOUR DEL PROGRÉS HLC
CREATE OR REPLACE FUNCTION public.report_node_progress(p_node_id UUID, p_max_hlc_seen BIGINT, p_peer_count INT DEFAULT 1)
RETURNS VOID LANGUAGE SQL SECURITY INVOKER AS $$
    INSERT INTO public.node_hlc_progress (node_id, max_hlc_seen, peer_count, reported_at) VALUES (p_node_id, p_max_hlc_seen, p_peer_count, NOW())
    ON CONFLICT (node_id) DO UPDATE SET max_hlc_seen = GREATEST(EXCLUDED.max_hlc_seen, node_hlc_progress.max_hlc_seen), peer_count = EXCLUDED.peer_count, reported_at = NOW();
$$;

-- F. GUARDA: Node adormit que reapareix
CREATE OR REPLACE FUNCTION public.check_node_stale(p_node_id UUID, p_node_hlc BIGINT)
RETURNS JSONB LANGUAGE plpgsql STABLE SET search_path = public AS $$
DECLARE v_gst BIGINT;
BEGIN
    v_gst := public.calculate_gst();
    IF p_node_hlc < v_gst THEN RETURN jsonb_build_object('is_stale', TRUE, 'node_hlc', p_node_hlc, 'current_gst', v_gst, 'action_required', 'full_resync', 'reason', 'Les teves operacions anteriors al GST han sigut purgades. Necessites resincronització completa.'); END IF;
    RETURN jsonb_build_object('is_stale', FALSE, 'node_hlc', p_node_hlc);
END;
$$;


-- ============================================================
-- 4. 🔏 Recovery Protocol P2P — Web of Trust Rural
-- ============================================================

CREATE TABLE IF NOT EXISTS public.did_custodians (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_did     TEXT    NOT NULL,
    subject_profile UUID,
    custodian_did   TEXT    NOT NULL,
    custodian_profile UUID,
    kinship_id      UUID,
    share_index     SMALLINT NOT NULL CHECK (share_index BETWEEN 1 AND 5),
    is_accepted     BOOLEAN NOT NULL DEFAULT FALSE,
    accepted_at     TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    hlc             BIGINT  NOT NULL DEFAULT 0,
    UNIQUE (subject_did, custodian_did),
    UNIQUE (subject_did, share_index)
);

CREATE TABLE IF NOT EXISTS public.did_recovery_shares (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    custodian_id    UUID NOT NULL REFERENCES public.did_custodians(id) ON DELETE CASCADE,
    encrypted_share TEXT    NOT NULL,
    share_hash      TEXT    NOT NULL,
    did_version     INT     NOT NULL DEFAULT 1,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at      TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '2 years'),
    UNIQUE (custodian_id, did_version)
);

CREATE TABLE IF NOT EXISTS public.did_recovery_requests (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_did     TEXT    NOT NULL,
    new_device_pubkey TEXT  NOT NULL,
    status          TEXT    NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','quorum_reached','completed','expired','rejected')),
    required_shares SMALLINT NOT NULL DEFAULT 3,
    provided_by     UUID[]  NOT NULL DEFAULT '{}',
    requested_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at      TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '48 hours'),
    completed_at    TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.did_recovery_contributions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id      UUID NOT NULL REFERENCES public.did_recovery_requests(id) ON DELETE CASCADE,
    custodian_id    UUID NOT NULL REFERENCES public.did_custodians(id),
    encrypted_share_for_new_device TEXT NOT NULL,
    custodian_signature TEXT NOT NULL,
    contributed_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (request_id, custodian_id)
);

CREATE OR REPLACE FUNCTION public.process_recovery_contribution(p_request_id UUID, p_custodian_id UUID, p_encrypted_share TEXT, p_signature TEXT)
RETURNS JSONB LANGUAGE plpgsql SECURITY INVOKER SET search_path = public AS $$
DECLARE v_request RECORD; v_custodian RECORD; v_count INT;
BEGIN
    SELECT * INTO v_request FROM public.did_recovery_requests WHERE id = p_request_id FOR UPDATE;
    IF NOT FOUND THEN RETURN jsonb_build_object('status', 'error', 'reason', 'Sol·licitud no trobada'); END IF;
    IF v_request.status <> 'pending' THEN RETURN jsonb_build_object('status', 'error', 'reason', 'Sol·licitud no activa: ' || v_request.status); END IF;
    IF v_request.expires_at < NOW() THEN UPDATE public.did_recovery_requests SET status = 'expired' WHERE id = p_request_id; RETURN jsonb_build_object('status', 'error', 'reason', 'Sol·licitud expirada'); END IF;

    SELECT * INTO v_custodian FROM public.did_custodians WHERE id = p_custodian_id AND subject_did = v_request.subject_did AND is_accepted = TRUE;
    IF NOT FOUND THEN RETURN jsonb_build_object('status', 'error', 'reason', 'Custodi no autoritzat o no acceptat'); END IF;

    INSERT INTO public.did_recovery_contributions (request_id, custodian_id, encrypted_share_for_new_device, custodian_signature) VALUES (p_request_id, p_custodian_id, p_encrypted_share, p_signature) ON CONFLICT (request_id, custodian_id) DO NOTHING;
    UPDATE public.did_recovery_requests SET provided_by = array_append(provided_by, p_custodian_id) WHERE id = p_request_id AND NOT (provided_by @> ARRAY[p_custodian_id]);
    SELECT COUNT(*) INTO v_count FROM public.did_recovery_contributions WHERE request_id = p_request_id;

    IF v_count >= v_request.required_shares THEN
        UPDATE public.did_recovery_requests SET status = 'quorum_reached', completed_at = NOW() WHERE id = p_request_id;
        RETURN jsonb_build_object('status', 'quorum_reached', 'shares_collected', v_count, 'request_id', p_request_id, 'next_step', 'El dispositiu nou pot ara descarregar les parts i reconstruir la clau localment');
    END IF;
    RETURN jsonb_build_object('status', 'contribution_accepted', 'shares_so_far', v_count, 'shares_required', v_request.required_shares);
END;
$$;


-- ============================================================
-- 5. 📡 Payload de Sincronització Gossip
-- ============================================================

CREATE OR REPLACE FUNCTION public.build_gossip_payload(p_for_node_id UUID, p_since_hlc BIGINT, p_max_ops INT DEFAULT 50)
RETURNS JSONB LANGUAGE plpgsql STABLE SECURITY INVOKER SET search_path = public AS $$
DECLARE
    v_ops JSONB[] := '{}'; v_op JSONB; v_merkle_leaves TEXT[] := '{}'; v_merkle_root TEXT; v_delta RECORD; v_payload JSONB; v_op_count INT := 0;
BEGIN
    FOR v_delta IN SELECT * FROM public.crdt_deltas WHERE hlc > p_since_hlc AND is_pruned = FALSE ORDER BY hlc ASC LIMIT p_max_ops
    LOOP
        v_op := jsonb_build_object('id', v_delta.id, 'tbl', v_delta.table_name, 'rid', v_delta.record_id, 'op', v_delta.operation, 'hlc', v_delta.hlc, 'nd', v_delta.node_id, 'd', v_delta.delta_payload);
        v_ops := array_append(v_ops, v_op);
        v_merkle_leaves := array_append(v_merkle_leaves, encode(sha256(v_op::text::bytea), 'hex'));
        v_op_count := v_op_count + 1;
    END LOOP;
    v_merkle_root := encode(sha256(array_to_string(v_merkle_leaves, '')::bytea), 'hex');

    v_payload := jsonb_build_object(
        'v', 1,
        'dst', p_for_node_id::text,
        'hlc_from', p_since_hlc,
        'hlc_to', CASE WHEN v_op_count > 0 THEN (v_ops[v_op_count]->>'hlc')::bigint ELSE p_since_hlc END,
        'ops', to_json(v_ops),
        'mkl', v_merkle_root,
        'n', v_op_count,
        'ts', EXTRACT(EPOCH FROM NOW())::BIGINT
    );
    RETURN v_payload;
END;
$$;

COMMIT;

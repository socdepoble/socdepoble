-- ============================================================
-- MIGRATION: 20260507_0705_bounded_crdt_quota.sql
-- Protocol de quotes P2P per al Bancal Mode offline.
-- Cada node té una quota pre-assignada. Pot subdelegat-la
-- a un altre node signant un "Quota Token" verificable.
-- ============================================================

BEGIN;

-- Taula de quotes assignades (servidor → node)
CREATE TABLE IF NOT EXISTS public.bancal_quotas (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id      UUID REFERENCES public.bancal_accounts(id) ON DELETE CASCADE,
    node_id         UUID REFERENCES public.p2p_nodes(id) ON DELETE CASCADE,
    -- Quota màxima que el node pot gastar offline sense confirmació
    quota_amount    NUMERIC(12,2) NOT NULL CHECK (quota_amount > 0),
    quota_used      NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (quota_used >= 0),
    -- Validesa temporal: les quotes expiren per evitar acumulació indefinida
    valid_until     TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '7 days'),
    issued_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    -- Signatura del servidor sobre (account_id || node_id || quota_amount || valid_until)
    server_sig_hex  TEXT NOT NULL,
    is_revoked      BOOLEAN NOT NULL DEFAULT FALSE,
    UNIQUE (account_id, node_id, issued_at)
);

-- Taula de subdelegacions entre nodes (sense servidor)
-- Node A pot prestar part de la seua quota a Node B offline
CREATE TABLE IF NOT EXISTS public.bancal_quota_delegations (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_quota_id UUID REFERENCES public.bancal_quotas(id) ON DELETE CASCADE,
    from_node_id    UUID REFERENCES public.p2p_nodes(id),
    to_node_id      UUID REFERENCES public.p2p_nodes(id),
    delegated_amount NUMERIC(12,2) NOT NULL CHECK (delegated_amount > 0),
    -- Signatura del node delegant sobre el token sencer
    -- Verificable offline per qualsevol node que tinga la clau pública
    delegation_sig_hex TEXT NOT NULL,
    hlc             BIGINT NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_consumed     BOOLEAN NOT NULL DEFAULT FALSE,
    -- Un token de delegació és d'un sol ús
    CONSTRAINT no_self_delegation CHECK (from_node_id <> to_node_id)
);

-- Índex per a resolució ràpida de la cadena de delegació
CREATE INDEX IF NOT EXISTS idx_quota_delegations_to_node
    ON public.bancal_quota_delegations (to_node_id, is_consumed)
    WHERE is_consumed = FALSE;

-- Funció: calcular la quota disponible real d'un node
-- (quota original - usada - delegada a altres + rebuda de delegacions)
CREATE OR REPLACE FUNCTION public.get_available_quota(p_node_id UUID)
RETURNS NUMERIC
LANGUAGE SQL STABLE
SET search_path = public
AS $$
    WITH base_quota AS (
        SELECT COALESCE(SUM(quota_amount - quota_used), 0) AS available
        FROM public.bancal_quotas
        WHERE node_id = p_node_id
          AND is_revoked = FALSE
          AND valid_until > NOW()
    ),
    delegated_out AS (
        SELECT COALESCE(SUM(d.delegated_amount), 0) AS total_out
        FROM public.bancal_quota_delegations d
        JOIN public.bancal_quotas q ON q.id = d.parent_quota_id
        WHERE q.node_id = p_node_id
          AND d.is_consumed = FALSE
    ),
    delegated_in AS (
        SELECT COALESCE(SUM(d.delegated_amount), 0) AS total_in
        FROM public.bancal_quota_delegations d
        WHERE d.to_node_id = p_node_id
          AND d.is_consumed = FALSE
    )
    SELECT (base_quota.available - delegated_out.total_out + delegated_in.total_in)
    FROM base_quota, delegated_out, delegated_in;
$$;

-- Funció: gastar quota offline (crida des del SyncWorker del dispositiu)
-- Verificació en servidor al moment de sync; online usa bancal_transfer directament.
CREATE OR REPLACE FUNCTION public.bancal_spend_offline(
    p_op_id         UUID,
    p_node_id       UUID,
    p_from_account  UUID,
    p_to_account    UUID,
    p_amount        NUMERIC,
    p_concept       TEXT,
    p_hlc           BIGINT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
    v_available NUMERIC;
BEGIN
    -- Idempotència
    IF EXISTS (SELECT 1 FROM public.bancal_transactions WHERE op_id = p_op_id) THEN
        RETURN jsonb_build_object('status', 'already_applied');
    END IF;

    -- Verificar quota disponible
    v_available := public.get_available_quota(p_node_id);
    IF v_available < p_amount THEN
        RETURN jsonb_build_object(
            'status', 'quota_exceeded',
            'available', v_available,
            'requested', p_amount
        );
    END IF;

    -- Insertar transacció pendent de confirmació del servidor
    INSERT INTO public.bancal_transactions
        (op_id, from_account, to_account, amount, concept, status, hlc)
    VALUES
        (p_op_id, p_from_account, p_to_account, p_amount, p_concept, 'pending_offline', p_hlc);

    -- Descomptar de la quota del node
    UPDATE public.bancal_quotas
    SET quota_used = quota_used + p_amount
    WHERE node_id = p_node_id
      AND is_revoked = FALSE
      AND valid_until > NOW()
      AND (quota_amount - quota_used) >= p_amount
    LIMIT 1;

    RETURN jsonb_build_object('status', 'accepted_offline', 'op_id', p_op_id);
END;
$$;

COMMIT;

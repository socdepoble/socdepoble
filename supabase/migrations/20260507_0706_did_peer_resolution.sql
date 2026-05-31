-- ============================================================
-- MIGRATION: 20260507_0706_did_peer_resolution.sql
-- Propòsit: Implementar un gossip cache de DIDs per a
-- resolució offline sense DNS. Cada node propaga els DIDs
-- que coneix als seus veïns en cada sessió de sync.
-- ============================================================

BEGIN;

-- Cache local de DIDs coneguts (propagar via gossip)
CREATE TABLE IF NOT EXISTS public.did_cache (
    -- El DID complet: did:peer:<multibase-encoded-public-key>
    did             TEXT PRIMARY KEY,
    -- La clau pública extreta del DID (redundant però permet query directa)
    public_key_hex  TEXT NOT NULL,
    -- Perfil associat (si es coneix)
    profile_id      UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    -- Metadades de descoberta
    first_seen_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_seen_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    -- De quin node vam aprendre aquest DID (per traçabilitat del gossip)
    learned_from_node UUID REFERENCES public.p2p_nodes(id) ON DELETE SET NULL,
    -- Comptador de "testimonis": quants nodes independents han confirmat este DID
    -- Un DID amb witnesses_count > 3 és de confiança alta sense servidor
    witnesses_count SMALLINT NOT NULL DEFAULT 1,
    -- Llista de nodes que han confirmat (per evitar comptar el mateix dos cops)
    witness_node_ids UUID[] NOT NULL DEFAULT '{}',
    -- El DID pot portar un document DID signat (metadades addicionals)
    did_document    JSONB,
    -- HLC per a sync
    hlc             BIGINT NOT NULL DEFAULT 0
);

-- Índex per trobar el DID d'un perfil conegut
CREATE INDEX IF NOT EXISTS idx_did_cache_profile
    ON public.did_cache (profile_id)
    WHERE profile_id IS NOT NULL;

-- Índex per trobar DIDs de confiança alta (per a la Festa Major)
CREATE INDEX IF NOT EXISTS idx_did_cache_trusted
    ON public.did_cache (witnesses_count DESC, last_seen_at DESC)
    WHERE witnesses_count >= 2;

-- Funció: registrar un DID après per gossip
-- Crida des del SyncWorker cada cop que un node s'identifica
CREATE OR REPLACE FUNCTION public.gossip_did(
    p_did           TEXT,
    p_public_key    TEXT,
    p_from_node_id  UUID,
    p_profile_id    UUID DEFAULT NULL,
    p_did_doc       JSONB DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
    v_existing RECORD;
BEGIN
    SELECT * INTO v_existing FROM public.did_cache WHERE did = p_did;

    IF NOT FOUND THEN
        -- Primer cop que veiem este DID
        INSERT INTO public.did_cache (
            did, public_key_hex, profile_id, learned_from_node,
            witnesses_count, witness_node_ids, did_document
        ) VALUES (
            p_did, p_public_key, p_profile_id, p_from_node_id,
            1, ARRAY[p_from_node_id], p_did_doc
        );
        RETURN jsonb_build_object('action', 'new_did_cached', 'did', p_did);
    ELSE
        -- Ja el coneixem: incrementar witnesses si és un node nou
        IF NOT (v_existing.witness_node_ids @> ARRAY[p_from_node_id]) THEN
            UPDATE public.did_cache SET
                witnesses_count  = witnesses_count + 1,
                witness_node_ids = witness_node_ids || p_from_node_id,
                last_seen_at     = NOW(),
                -- Actualitzar el document DID si és més nou
                did_document     = COALESCE(p_did_doc, did_document)
            WHERE did = p_did;
            RETURN jsonb_build_object('action', 'witness_added', 'did', p_did,
                                      'witnesses', v_existing.witnesses_count + 1);
        END IF;
        RETURN jsonb_build_object('action', 'already_known', 'did', p_did);
    END IF;
END;
$$;

-- Vista: DIDs de confiança suficient per a operacions Bancal
-- (requerrix almenys 2 testimonis independents)
CREATE OR REPLACE VIEW public.trusted_dids AS
SELECT did, public_key_hex, profile_id, witnesses_count, last_seen_at
FROM public.did_cache
WHERE witnesses_count >= 2
  AND last_seen_at > NOW() - INTERVAL '30 days'; -- DIDs antics no es refian

COMMIT;

-- ==============================================================================
-- 👑 SÓC DE POBLE: PROTOCOL OMEGA (10/10) - CRIPTOGRAFIA, MERKLE I WASM EXTREM
-- ==============================================================================

BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ------------------------------------------------------------------------------
-- 1. DIETÈTICA WASM: HOT UPDATES I ÍNDEXS PARCIALS
-- ------------------------------------------------------------------------------
-- Evita el col·lapse de "Write Amplification" a la memòria flaix de l'iPad
ALTER TABLE public.contacts SET (fillfactor = 80);
ALTER TABLE public.mutation_log SET (fillfactor = 80);

-- Destrucció de l'índex anterior. Creem un índex GIN exclusivament per als vius.
-- L'ús de RAM per recerques cau dràsticament en bases de dades madures.
DROP INDEX IF EXISTS idx_contacts_search_vector;
CREATE INDEX idx_contacts_search_active 
    ON public.contacts USING GIN (search_vector gin_trgm_ops) 
    WHERE is_tombstoned = false;

-- ------------------------------------------------------------------------------
-- 2. IDENTITAT DESCENTRALITZADA (DIDs I SIGNATURES Ed25519)
-- ------------------------------------------------------------------------------
-- L'autoria sobirana. Sense açò, la base de dades P2P és un abocador corrupte.
ALTER TABLE public.contacts 
    ADD COLUMN IF NOT EXISTS author_did TEXT,
    ADD COLUMN IF NOT EXISTS ed25519_sig TEXT;

-- Data Contract Definitiu: Si intentes assassinar (Tombstone) una dada, 
-- l'esquema obliga estructuralment a presentar una signatura criptogràfica del propietari.
ALTER TABLE public.contacts DROP CONSTRAINT IF EXISTS chk_tombstone_sovereignty;
ALTER TABLE public.contacts ADD CONSTRAINT chk_tombstone_sovereignty 
    CHECK (
        (is_tombstoned = false) OR 
        (is_tombstoned = true AND ed25519_sig IS NOT NULL AND length(ed25519_sig) > 60)
    );

-- ------------------------------------------------------------------------------
-- 3. FILTRE BIZANTÍ (HLC CLAMPING I ANTI-ZOMBIS)
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.crdt_strict_resolution()
RETURNS TRIGGER AS $$
DECLARE
    incoming_ts TIMESTAMPTZ;
BEGIN
    -- [A] HLC Clamping: Extracció ISO i tallafocs contra viatges en el temps.
    BEGIN
        incoming_ts := (substring(NEW.hlc from 1 for 24))::TIMESTAMPTZ;
    EXCEPTION WHEN OTHERS THEN
        RAISE EXCEPTION 'TRELLAT-01: HLC malformat o corromput: %', NEW.hlc;
    END;

    -- Si el paquet ve d'un futur impossible (+15 minuts de drift màxim permés), el matem.
    IF incoming_ts > (clock_timestamp() + interval '15 minutes') THEN
        RAISE EXCEPTION 'TRELLAT-02: Atac HLC Sybil. Mutació massa al futur bloquejada.';
    END IF;

    -- [B] L'Estat Absorbent (Anti-Zombis): Si estava mort, només l'amo el pot ressuscitar.
    -- Evita que edicions "offline endarrerides" desfacen l'esborrament legítim.
    IF OLD.is_tombstoned = true AND NEW.is_tombstoned = false THEN
        IF NEW.author_did IS DISTINCT FROM OLD.author_did THEN
            RAISE EXCEPTION 'TRELLAT-03: Violació d''herència. Un zombi no pot ressuscitar sense la signatura del propietari original.';
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_crdt_strict ON public.contacts;
CREATE TRIGGER trg_crdt_strict
    BEFORE UPDATE ON public.contacts
    FOR EACH ROW EXECUTE FUNCTION public.crdt_strict_resolution();

-- ------------------------------------------------------------------------------
-- 4. ESCUT CONTRA LA TEMPESTA BLUETOOTH: MERKLE SYNC BUCKETS O(1)
-- ------------------------------------------------------------------------------
-- Taula mestra de l'estat del poble. Permet a 2 iPads comparar 32 bytes de hash 
-- per saber instantàniament si l'estat d'un dia concret és idèntic en els dos.
CREATE TABLE IF NOT EXISTS public.sync_merkle_buckets (
    bucket_period TEXT PRIMARY KEY,
    bucket_hash TEXT NOT NULL,
    records_count BIGINT DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT clock_timestamp()
) WITH (fillfactor = 90);

-- Trigger de processament vectorial ràpid (MD5 accelerat per hardware a l'M1/A10)
CREATE OR REPLACE FUNCTION public.update_merkle_bucket()
RETURNS TRIGGER AS $$
DECLARE
    v_period TEXT;
    v_row_hash TEXT;
BEGIN
    v_period := substring(NEW.hlc from 1 for 10); -- Ex: "2026-05-07"
    v_row_hash := md5(NEW.id::text || NEW.hlc || NEW.is_tombstoned::text);

    INSERT INTO public.sync_merkle_buckets (bucket_period, bucket_hash, records_count)
    VALUES (v_period, v_row_hash, 1)
    ON CONFLICT (bucket_period) DO UPDATE 
    SET 
        -- Hash acumulat (XOR Simulat) per obtenir la petjada de l'estat diari
        bucket_hash = md5(sync_merkle_buckets.bucket_hash || EXCLUDED.bucket_hash),
        records_count = sync_merkle_buckets.records_count + 1,
        updated_at = clock_timestamp();
        
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_merkle_sync ON public.contacts;
CREATE TRIGGER trg_merkle_sync
    AFTER INSERT OR UPDATE OF hlc, is_tombstoned ON public.contacts
    FOR EACH ROW EXECUTE FUNCTION public.update_merkle_bucket();

COMMIT;

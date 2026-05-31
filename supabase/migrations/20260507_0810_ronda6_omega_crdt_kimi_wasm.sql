-- 🔥 RONDA 6 – CODI OMEGA. WASM <150MB. Zero NULL estructural.
-- Especialització: Kimi / Consell de les Petorretes (Trellat Quàntic)

-- ============================================================================
-- 1. INTERVAL TREE CLOCKS (ITC) HIPERCOMPRIMIT
-- Tipus compacte: 64 bits = 32 bits id + 32 bits event
-- ============================================================================

CREATE OR REPLACE FUNCTION itc_seed() RETURNS BIGINT IMMUTABLE LANGUAGE SQL AS $$ SELECT 0::bigint $$;

CREATE OR REPLACE FUNCTION itc_event(c BIGINT) RETURNS BIGINT IMMUTABLE LANGUAGE SQL AS $$ 
    SELECT (c & x'FFFFFFFF00000000'::bigint) | ((c & 4294967295)+1) 
$$;

CREATE OR REPLACE FUNCTION itc_fork(c BIGINT, nid INT) RETURNS BIGINT IMMUTABLE LANGUAGE SQL AS $$ 
    SELECT (nid::bigint << 32) 
$$;

CREATE OR REPLACE FUNCTION itc_join(a BIGINT, b BIGINT) RETURNS BIGINT IMMUTABLE LANGUAGE SQL AS $$ 
    SELECT GREATEST(a,b) 
$$;

CREATE OR REPLACE FUNCTION itc_leq(a BIGINT, b BIGINT) RETURNS BOOLEAN IMMUTABLE LANGUAGE SQL AS $$ 
    SELECT (a>>32)=(b>>32) AND (a&4294967295) <= (b&4294967295) 
$$;

ALTER TABLE public.contacts ADD COLUMN IF NOT EXISTS itc BIGINT NOT NULL DEFAULT itc_seed();
CREATE INDEX IF NOT EXISTS idx_contacts_itc ON public.contacts(itc);

CREATE OR REPLACE FUNCTION trg_itc() RETURNS TRIGGER AS $$
BEGIN 
    NEW.itc := itc_event(COALESCE(OLD.itc, itc_seed())); 
    RETURN NEW; 
END; 
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS contacts_itc_biu ON public.contacts;
CREATE TRIGGER contacts_itc_biu BEFORE UPDATE ON public.contacts 
FOR EACH ROW EXECUTE FUNCTION trg_itc();

-- ============================================================================
-- 2. DELTA-STATE CRDT LOGOOTSPLIT
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.contact_phones_crdt (
  contact_id UUID NOT NULL,
  pos TEXT NOT NULL,
  number TEXT NOT NULL,
  label TEXT NOT NULL DEFAULT 'mobile',
  hlc BIGINT NOT NULL,
  did_autor TEXT NOT NULL REFERENCES public.dids(did),
  sig TEXT NOT NULL,
  tomb BOOLEAN NOT NULL DEFAULT false,
  PRIMARY KEY (contact_id, pos)
) WITHOUT ROWID;

CREATE TABLE IF NOT EXISTS public.contact_emails_crdt (
  contact_id UUID NOT NULL,
  pos TEXT NOT NULL,
  value TEXT NOT NULL,
  label TEXT NOT NULL DEFAULT 'personal',
  hlc BIGINT NOT NULL,
  did_autor TEXT NOT NULL REFERENCES public.dids(did),
  sig TEXT NOT NULL,
  tomb BOOLEAN NOT NULL DEFAULT false,
  PRIMARY KEY (contact_id, pos)
) WITHOUT ROWID;

CREATE OR REPLACE FUNCTION logoot_mid(a TEXT, b TEXT) RETURNS TEXT IMMUTABLE LANGUAGE plpgsql AS $$
DECLARE 
    base TEXT := '0123456789abcdefghijklmnopqrstuvwxyz'; 
    ia INT; 
    ib INT;
BEGIN
  IF a IS NULL THEN RETURN 'm0'; END IF;
  IF b IS NULL THEN RETURN a || 'z'; END IF;
  ia := position(substring(a,1,1) in base); 
  ib := position(substring(b,1,1) in base);
  RETURN chr(ascii('a') + (ia+ib)/2) || '0';
END; 
$$;

CREATE OR REPLACE FUNCTION merge_phone() RETURNS TRIGGER AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.contact_phones_crdt WHERE contact_id=NEW.contact_id AND pos=NEW.pos AND hlc >= NEW.hlc) THEN 
      RETURN NULL; 
  END IF;
  RETURN NEW;
END; 
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS phones_merge_bi ON public.contact_phones_crdt;
CREATE TRIGGER phones_merge_bi BEFORE INSERT ON public.contact_phones_crdt 
FOR EACH ROW EXECUTE FUNCTION merge_phone();

DROP TRIGGER IF EXISTS emails_merge_bi ON public.contact_emails_crdt;
CREATE TRIGGER emails_merge_bi BEFORE INSERT ON public.contact_emails_crdt 
FOR EACH ROW EXECUTE FUNCTION merge_phone();

-- ============================================================================
-- 3. SNAPSHOT PRUNING DISTRIBUÏT
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.crdt_deltas (
  id BIGSERIAL PRIMARY KEY,
  taula TEXT NOT NULL,
  pk TEXT NOT NULL,
  hlc BIGINT NOT NULL,
  comarca TEXT NOT NULL,
  payload JSONB NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_deltas_comarca_hlc ON public.crdt_deltas(comarca, hlc);

CREATE OR REPLACE PROCEDURE p2p_garbage_collect(p_comarca TEXT) LANGUAGE plpgsql AS $$
DECLARE 
    llindar BIGINT; 
    quorum INT;
BEGIN
  llindar := ((extract(epoch from now() - interval '90 days')*1000)::bigint << 16);
  SELECT nodes INTO quorum FROM public.sync_merkle WHERE comarca_code = p_comarca;
  
  IF quorum IS NULL OR quorum < 3 THEN 
      RETURN; 
  END IF;
  
  DELETE FROM public.crdt_deltas WHERE comarca = p_comarca AND hlc < llindar;
  DELETE FROM public.contact_phones_crdt WHERE tomb AND hlc < llindar;
  DELETE FROM public.contact_emails_crdt WHERE tomb AND hlc < llindar;
  DELETE FROM public.contacts WHERE is_tombstoned AND deleted_at < now() - interval '90 days' AND comarca_code = p_comarca;
END; 
$$;

-- ============================================================================
-- 4. RECOVERY PROTOCOL P2P – WEB OF TRUST
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.did_recovery_shares (
  did TEXT NOT NULL REFERENCES public.dids(did),
  guardian_did TEXT NOT NULL REFERENCES public.dids(did),
  share_index SMALLINT NOT NULL CHECK (share_index BETWEEN 1 AND 5),
  share_hash TEXT NOT NULL CHECK (length(share_hash)=64),
  creat_hlc BIGINT NOT NULL,
  PRIMARY KEY (did, guardian_did)
);

CREATE OR REPLACE FUNCTION recovery_verify(p_did TEXT, p_guardians TEXT[]) RETURNS BOOLEAN LANGUAGE plpgsql AS $$
DECLARE 
    cnt INT;
BEGIN
  SELECT count(*) INTO cnt FROM public.did_recovery_shares 
  WHERE did = p_did AND guardian_did = ANY(p_guardians);
  RETURN cnt >= 3;
END; 
$$;

-- ============================================================================
-- 5. GOSSIP MESH PAYLOAD <2.5KB
-- ============================================================================

-- Estructura JSON d'intercanvi
-- {"v":1,"c":"l_alacanti","m":"<merkle_root>","h":<hlc_max>,"d":[{"t":"phones","p":"<pos>","n":"+346...","i":<itc>}],"s":"<ed25519_sig>"}
CREATE TABLE IF NOT EXISTS public.gossip_outbox (
  id BIGSERIAL PRIMARY KEY,
  comarca TEXT NOT NULL,
  payload JSONB NOT NULL CHECK (octet_length(payload::text) < 2560),
  creat TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_gossip_comarca ON public.gossip_outbox(comarca);

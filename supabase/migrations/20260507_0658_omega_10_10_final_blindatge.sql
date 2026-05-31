-- 4.1 TAULA DE CLAUS DIDs (sobirania)
CREATE TABLE IF NOT EXISTS public.dids (
  did TEXT PRIMARY KEY CHECK (did LIKE 'did:socdepoble:%'),
  pubkey TEXT NOT NULL CHECK (length(pubkey)=44), -- base64 Ed25519
  comarca_code TEXT NOT NULL,
  creat_hlc BIGINT NOT NULL,
  revocat BOOLEAN DEFAULT false
);

-- 4.2 EXTENSIÓ DE CONTACTS PER A SIGNATURA I MERKLE
ALTER TABLE public.contacts
  ADD COLUMN IF NOT EXISTS sig TEXT CHECK (sig IS NULL OR length(sig)=88),
  ADD COLUMN IF NOT EXISTS did_autor TEXT REFERENCES public.dids(did),
  ADD COLUMN IF NOT EXISTS merkle_leaf TEXT,
  ADD COLUMN IF NOT EXISTS causal_stable TIMESTAMPTZ;

-- 4.3 PODA DE VERSION_VECTOR I PROTECCIÓ OVERFLOW
CREATE OR REPLACE FUNCTION public.prune_vector(v JSONB) RETURNS JSONB AS $$
  SELECT COALESCE(
    (SELECT jsonb_object_agg(k, v) FROM (
      SELECT k, (v->>k)::bigint as h FROM jsonb_each(v) ORDER BY (v->>k)::bigint DESC LIMIT 32
    ) s),
  '{}'::jsonb);
$$ LANGUAGE SQL IMMUTABLE;

CREATE OR REPLACE FUNCTION public.trg_contacts_hlc_v2() RETURNS TRIGGER AS $$
DECLARE phys BIGINT; cnt BIGINT;
BEGIN
  phys := (extract(epoch from clock_timestamp())*1000)::bigint;
  cnt := (COALESCE(OLD.hlc,0) & 65535);
  IF (COALESCE(OLD.hlc,0)>>16) >= phys THEN cnt := cnt + 1; END IF;
  IF cnt > 60000 THEN RAISE EXCEPTION 'HLC overflow, forcem resync'; END IF;
  NEW.hlc := (phys << 16) | cnt;
  NEW.version_vector := public.prune_vector(jsonb_set(COALESCE(OLD.version_vector,'{}'), ARRAY[NEW.device_id::text], to_jsonb(NEW.hlc)));
  NEW.causal_stable := now() - interval '90 days';
  
  -- Generem el merkle_leaf usant pgcrypto
  NEW.merkle_leaf := encode(digest(COALESCE(NEW.vcf_hash, '') || NEW.hlc::text, 'sha256'), 'hex');
  RETURN NEW;
END; $$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS contacts_hlc_biu ON public.contacts;
CREATE TRIGGER contacts_hlc_biu BEFORE INSERT OR UPDATE ON public.contacts FOR EACH ROW EXECUTE FUNCTION public.trg_contacts_hlc_v2();

-- 4.4 TAULES FILLES OPTIMITZADES WASM
DROP TABLE IF EXISTS public.contact_phones;
CREATE TABLE public.contact_phones (
  contact_id UUID NOT NULL,
  idx SMALLINT NOT NULL,
  number TEXT NOT NULL,
  label TEXT NOT NULL DEFAULT 'mobile',
  hlc BIGINT NOT NULL,
  is_tombstoned BOOLEAN DEFAULT false,
  PRIMARY KEY (contact_id, idx)
);
-- Nota: 'WITHOUT ROWID' es sintaxi d'SQLite. En PostgreSQL/PGlite per defecte no hi ha ROWID ocult per a taules normals.

CREATE INDEX IF NOT EXISTS idx_phones_cover ON public.contact_phones(contact_id) INCLUDE (number, hlc) WHERE NOT is_tombstoned;

-- 4.5 ÍNDEX COBRINT PER A LLISTES OFFLINE
CREATE INDEX IF NOT EXISTS idx_contacts_lite ON public.contacts(comarca_code, search_blob) INCLUDE (hlc, vcf_hash, realism_score) WHERE NOT is_tombstoned;

-- 4.6 VISTA LAZY (mai carrega JSONB)
CREATE OR REPLACE VIEW public.contacts_lite AS
SELECT id, ulid, fn, n_first, n_last, photo_url, hlc, vcf_hash, comarca_code, is_tombstoned
FROM public.contacts;

-- 4.7 MERKLE PER COMARCA (anti-entropy)
CREATE TABLE IF NOT EXISTS public.sync_merkle (
  comarca_code TEXT PRIMARY KEY,
  root TEXT NOT NULL,
  last_hlc BIGINT NOT NULL,
  nodes INT NOT NULL DEFAULT 0,
  actualitzat TIMESTAMPTZ DEFAULT now()
);

CREATE OR REPLACE FUNCTION public.update_merkle() RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.sync_merkle(comarca_code, root, last_hlc, nodes)
  VALUES (NEW.comarca_code, NEW.merkle_leaf, NEW.hlc, 1)
  ON CONFLICT (comarca_code) DO UPDATE
  SET root = encode(digest(sync_merkle.root || EXCLUDED.root,'sha256'),'hex'),
      last_hlc = GREATEST(sync_merkle.last_hlc, EXCLUDED.last_hlc),
      nodes = sync_merkle.nodes + 1;
  RETURN NEW;
END; $$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS contacts_merkle_ai ON public.contacts;
CREATE TRIGGER contacts_merkle_ai AFTER INSERT OR UPDATE ON public.contacts FOR EACH ROW EXECUTE FUNCTION public.update_merkle();

-- 4.8 PROTECCIÓ TOMBSTONE (només autor o quorum)
CREATE OR REPLACE FUNCTION public.trg_protect_tombstone() RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_tombstoned AND OLD.is_tombstoned = false THEN
    IF NEW.did_autor IS NULL OR NOT EXISTS (SELECT 1 FROM public.dids WHERE did = NEW.did_autor AND revocat = false) THEN
      RAISE EXCEPTION 'tombstone sense DID vàlid';
    END IF;
    IF NEW.sig IS NULL THEN RAISE EXCEPTION 'tombstone sense signatura'; END IF;
  END IF;
  RETURN NEW;
END; $$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS contacts_protect_bu ON public.contacts;
CREATE TRIGGER contacts_protect_bu BEFORE UPDATE ON public.contacts FOR EACH ROW EXECUTE FUNCTION public.trg_protect_tombstone();

-- 4.9 RATE LIMIT BATERIA (max 100 writes/min per device)
CREATE TABLE IF NOT EXISTS public.write_budget (
  device_id UUID PRIMARY KEY, finestra TIMESTAMPTZ, comptador INT
);
CREATE OR REPLACE FUNCTION public.check_budget() RETURNS TRIGGER AS $$
DECLARE w public.write_budget%ROWTYPE;
BEGIN
  SELECT * INTO w FROM public.write_budget WHERE device_id = NEW.device_id FOR UPDATE;
  IF w.device_id IS NULL OR w.finestra < now() - interval '1 minute' THEN
    INSERT INTO public.write_budget (device_id, finestra, comptador) VALUES (NEW.device_id, now(), 1) ON CONFLICT (device_id) DO UPDATE SET finestra=now(), comptador=1;
  ELSIF w.comptador > 100 THEN
    RAISE EXCEPTION 'budget excedit, ajorna sync';
  ELSE
    UPDATE public.write_budget SET comptador = comptador + 1 WHERE device_id = NEW.device_id;
  END IF;
  RETURN NEW;
END; $$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS contacts_budget_bi ON public.contacts;
CREATE TRIGGER contacts_budget_bi BEFORE INSERT ON public.contacts FOR EACH ROW EXECUTE FUNCTION public.check_budget();

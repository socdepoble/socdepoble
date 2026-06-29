# === PLANTILLA YAML SUPREMA (Sóc de Poble - iPad A10) ===
# Ús obligatori per a TOTS els documents del sistema.
# Versió: 2.0.0 (Integrada amb ATRC i CRDT)

---
doc_id: "SDP-YAML-{YYYYMMDD}-{HHMM}"  # Format: SDP-YAML-260629-0200
doc_type: "SKILL|PROMPT|ARCH|ACTA|PROTOCOL"  # Tipus de document
authoring_agent: "{Nom_Agent_IA|Humà}"  # Ex: "IAIA MarIA", "Consell de la Petorreta"
version_semver: "2.0.0"  # Semantic Versioning (MAJOR.MINOR.PATCH)
owner: "{Organització}"  # Ex: "El Rentonar", "Sóc de Poble"
domain: "{global|local|arquitectura|psiquiatria}"  # Domini principal
subdomain: "{específic}"  # Ex: "offline-first", "termodinàmica"
locale: "ca-valencia"  # Idioma obligatori (Valencià estricte)

---
# === METADADES DE CONTINGUT ===
objective: "{Descripció breu de l'objectiu principal}"  # Ex: "Sincronització CRDT per a iPad A10"
scope: "{Àmbit d'aplicació}"  # Ex: "Tots els nodes de la malla rural"
inputs: ["{llista_de_arxius_entrada}"]  # Ex: ["00_index.md", "yjs_sync.js"]
outputs: ["{llista_de_arxius_sortida}"]  # Ex: ["sincro_log.md", "opfs_blobs/"]

---
# === METADADES TÈCNIQUES (A10) ===
# --- Control de Recursos ---
impacte_ram: {1-10}  # 1 = Baix, 10 = Crític (Ex: 7 per a operacions Y.js)
cicle_execucio_a10: "{curta|mitjana|llarga}"  # Durada estimada d'execució en iPad A10
operabilitat_offline: true  # Si el document/processa funciona SENSE xarxa

# --- Sincronització ---
sync_protocol: "{Y.js|CRDT|WebRTC|Bluetooth}"  # Protocol utilitzat
sync_status: "{pending|syncing|synced|error}"  # Estat actual de sincronització
uuid: "{UUID_v4}"  # Identificador únic per a CRDT/OPFS

# --- Dependències ---
dependencies:  # Llista de documents o sistemes dels quals depèn
  - "{doc_id}"
  - "{library}"  # Ex: "Y.js", "OPFS"

---
# === METADADES COGNITIVES (ATRC) ===
exif_cognitiu:
  estat_emocional_sistema: "{Aprenentatge|Estable|Crític}"  # Estat actual del sistema
  entorn_operatiu: "{Entorn_Dev_Local|Producció|Simulació}"  # On s'executa
  nivell_entropia: "{Zero|Baix|Alt}"  # Grau de desordre (0 = òptim)
  energia_consumida: {tokens|ms}  # Recurs utilitzat (Ex: 1500 tokens)

---
# === METADADES DE VALIDACIÓ ===
academic_metadata:
  revisors_ia: ["{llista_agents_IA}"]  # Ex: ["Vibe", "Claude"]
  revisors_humans: ["{llista_humans}"]  # Ex: ["Javi Llinares"]
  data_aprovacio_humana: "{YYYY-MM-DD}"  # Data de validació humana
  nivell_maduresa: "{Pendent_Revisio|Validat|Aprovat|Deprecat}"  # Estat del document

# --- Canvis Pendents ---
canvis_pendents:  # Llista de modificacions no aplicades
  - "{descripció_canvi}"

---
# === METADADES DE SEGURETAT I RESILIÈNCIA ===
impacte_termodinamic: {1-10}  # Impacte en el sistema (1 = baix, 10 = alt)
nivell_critic: "{baixa|mitjana|alta|critica}"  # Prioritat d'intervenció
validat_per: ["{llista_validadors}"]  # Ex: ["IAIA MarIA", "Consell"]

---
# === CAMPS ESPECÍFICS PER TIPUS DE DOCUMENT ===
# --- Per a SKILLS ---
if: doc_type == "SKILL"
  skill_type: "{autònoma|manual|híbrida}"  # Tipus de SKILL
  trigger: "{event|comanda|automàtic}"  # Què activa la SKILL
  output_format: "{md|json|yaml|code}"  # Format de sortida
  
# --- Per a PROTOCOLS ---
if: doc_type == "PROTOCOL"
  pas_a_pas:  # Llista de passos ordenats
    - "{pas_1}"
    - "{pas_2}"
  
# --- Per a ARCH (Arquitectura) ---
if: doc_type == "ARCH"
  components: ["{llista_components}"]  # Ex: ["Y.js", "OPFS"]
  diagrama_associat: "{nom_diagrama_mermaid}"  # Ex: "Anell_CRDT"


---
## 🔗 Veure també
- [[00_index|Índex Central]]

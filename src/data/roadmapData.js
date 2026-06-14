import { Compass, CheckCircle2, Tractor, Tag, Calendar, ShieldAlert, HeartPulse, BrainCircuit, Globe, Activity, LayoutGrid, Radio, Smartphone, HardDrive, Eye, Fingerprint, FileText, Database, Speaker, Map, Flame, FileWarning, Hand, Skull, SunMedium, Search } from 'lucide-react';
export const roadmapData = {
  production: [{
    id: "42",
    slug: "llibre-anima-maquina",
    title: "Llibre de l'Ànima Màquina",
    date: "2026-Q2",
    category: "Arquitectura",
    icon: BrainCircuit,
    tags: ["Antropologia IA", "Trellat", "ISO"],
    desc: "Tractat unificat sobre la relació mecànica-humana i els axiomes d'orquestració."
  }],
  done: [{
    id: "1",
    slug: "motor-a10-inmortal",
    title: "Motor A10 Inmortal (Pedra Seca)",
    date: "2026-Q1",
    category: "Arquitectura",
    icon: Tractor,
    tags: ["Frontend"],
    desc: "Liquid DOM i content-visibility per fluir a 60fps globals en iPads del 2016."
  }, {
    id: "2",
    slug: "idb-guardian",
    title: "IDB Guardian (Persistència W.A.L.)",
    date: "2026-Q1",
    category: "Sistema",
    icon: Database,
    tags: ["Offline"],
    desc: "Protocol Write-Ahead Logging local sobre SQLite-WASM als web workers."
  }, {
    id: "3",
    slug: "sistema-plantilles-mestre",
    title: "Sistema Plantilles Mestre",
    date: "2026-Q1",
    category: "Arquitectura",
    icon: LayoutGrid,
    tags: ["UI/UX"],
    desc: "Estandardització estricta hereditària per Documents, Agenda, Entitats i Poblacions."
  }, {
    id: "4",
    slug: "pwa-installable-clean",
    title: "PWA Instal·lable Clean",
    date: "2026-Q1",
    category: "Connectivitat",
    icon: Smartphone,
    tags: ["Storeless"],
    desc: "Distribució PWA nadiua evitant les botigues corporatives."
  }, {
    id: "5",
    slug: "la-guardia-de-nit",
    title: "La Guàrdia de Nit",
    date: "2026-Q1",
    category: "Mètode",
    icon: Compass,
    tags: ["Filosofia"],
    desc: "Estratègia tècnica per evadir asfíxia de tokens en els LLMs occidentals."
  }, {
    id: "6",
    slug: "xat-iaia",
    title: "Xat de la IAIA (Testament Digital)",
    date: "2026-Q1",
    category: "Intel·ligència",
    icon: BrainCircuit,
    tags: ["Agents"],
    desc: "Arquitectura local d'IA per encapçalar les converses del mas."
  }, {
    id: "7",
    slug: "ull-del-mestre",
    title: "L'Ull del Mestre PWA",
    date: "2026-Q2",
    category: "UI/UX",
    icon: Eye,
    tags: ["Auditoria"],
    desc: "Tauler de navegació zero-scrolling amb auditoria en temps real de les targetes."
  }, {
    id: "8",
    slug: "format-gem-modern",
    title: "Format Pedra Seca 28px",
    date: "2026-Q1",
    category: "UI/UX",
    icon: SunMedium,
    tags: ["Accessibilitat"],
    desc: "Configuració d'alt contrast i tipografia generosa per a més grans de 80 anys."
  }, {
    id: "9",
    slug: "llei-orgull-rural",
    title: "Llei Orgull Rural Visual",
    date: "2026-Q1",
    category: "UI/UX",
    icon: ShieldAlert,
    tags: ["Estil"],
    desc: "Prohibició del clean-design corporatiu. Escuts majestuosos i reines locals."
  }, {
    id: "10",
    slug: "taller-trellat",
    title: "Taller Trellat",
    date: "2026-Q2",
    category: "Arquitectura",
    icon: FileText,
    tags: ["Developer"],
    desc: "Consola transparent per auditar i gestionar Y.js en qualsevol dispositiu."
  }],
  dev: [{
    id: "41",
    slug: "ritual-senectut",
    title: "Ritual de Senectut (Memòria IA)",
    date: "2026-Q1",
    category: "Salut Màquina",
    icon: BrainCircuit,
    tags: ["Psiquiatria IA", "KIs"],
    desc: "Estructura de consolidació setmanal on la IA resumeix patrons evitant la demència."
  }, {
    id: "11",
    slug: "ruper-rato",
    title: "Rúper Rató (Caza-BOEs)",
    date: "2026-Q2",
    category: "Burocràcia",
    icon: Search,
    tags: ["IA RAG"],
    desc: "Assistent que escaneja reglaments i el DOGV diàriament extraent les lleis opaques."
  }, {
    id: "12",
    slug: "mesh-viva",
    title: "Mesh Viva (WebRTC Eg-Walker)",
    date: "2026-Q2",
    category: "Xarxa",
    icon: Globe,
    tags: ["Offline P2P"],
    desc: "Connexions pantalla a pantalla esquivant operadors per WLAN/Bluetooth."
  }, {
    id: "13",
    slug: "verificacio-ssi",
    title: "Verificació SSI (Identitat DIDs)",
    date: "2026-Q2",
    category: "Sobirania",
    icon: Fingerprint,
    tags: ["Criptografia"],
    desc: "Signatures digitals emeses pels veïns del Padró Rural."
  }, {
    id: "14",
    slug: "auditoria-espill",
    title: "Auditoria Espill del Temps",
    date: "2026-Q3",
    category: "Memòria",
    icon: Activity,
    tags: ["Fotografia"],
    desc: "Comparador intergeneracional d'arxius natius juxtaposats (1968 vs 2024)."
  }, {
    id: "15",
    slug: "nano-banana",
    title: "Nano Banana",
    date: "2026-Q3",
    category: "Media",
    icon: Eye,
    tags: ["Compressió"],
    desc: "Simbiosi multimèdia hiper-comprimida per fluir en cobertures 2G muntanyenques."
  }, {
    id: "16",
    slug: "ideoteca-p2p",
    title: "Ideoteca P2P",
    date: "2026-Q2",
    category: "Comunitat",
    icon: BrainCircuit,
    tags: ["CRDT"],
    desc: "Llenç on es graven les noves llavors inventives acoblades asíncronament."
  }, {
    id: "17",
    slug: "notes-compartides",
    title: "Notes Compartides (Murs del Mas)",
    date: "2026-Q2",
    category: "Comunitat",
    icon: FileText,
    tags: ["Y.js"],
    desc: "Pissarres efímeres dibuixables per les cases o famílies del poble."
  }, {
    id: "18",
    slug: "agent-directory",
    title: "Agent Directory",
    date: "2026-Q2",
    category: "Ecosistema",
    icon: Map,
    tags: ["Ordenació"],
    desc: "Auto-ordenació orgànica del Padró (Humans i IAIAs) segons activitat P2P."
  }, {
    id: "19",
    slug: "bategat-rag",
    title: "Bategat RAG PDF Agricola",
    date: "2026-Q2",
    category: "Burocràcia",
    icon: FileWarning,
    tags: ["LLM", "Lleis"],
    desc: "Anàlisi legal instantània dels protocols químics i fitosanitaris locals."
  }, {
    id: "20",
    slug: "consola-solatge",
    title: "Consola Solatge (Verbose=1)",
    date: "2026-Q2",
    category: "Sistema",
    icon: Activity,
    tags: ["Debugger"],
    desc: "Registre directe a l'UI per auditar el Thrashing d'imatges PWA en la natura."
  }],
  backlog: [{
    id: "21",
    slug: "tramits-xylella",
    title: "Tràmits Xylella (Insta-Burocràcia)",
    date: "2026-Q3",
    category: "Ajudes",
    icon: FileWarning,
    tags: ["Burocràcia Zero"],
    desc: "Emplenat autònom legal de les subvencions de Sanitat Vegetal per l'ús de la veu."
  }, {
    id: "22",
    slug: "dafo-automatic",
    title: "DAFO Automàtic Poble",
    date: "2026-Q3",
    category: "Comunitat",
    icon: Activity,
    tags: ["Anàlisi IA"],
    desc: "Report gràfic mensual llançat per El Cronista sobre l'estat de la pedania."
  }, {
    id: "23",
    slug: "el-cronista",
    title: "El Cronista (Les Actes)",
    date: "2026-Q3",
    category: "Cultura",
    icon: FileText,
    tags: ["Notícies P2P"],
    desc: "Resums setmanals generats en prosa valenciana del debat del llibre CRDT."
  }, {
    id: "24",
    slug: "pont-whatsapp",
    title: "Pont WhatsApp Nivell Déu",
    date: "2026-Q4",
    category: "Xarxa Externa",
    icon: Smartphone,
    tags: ["Webhook P2P"],
    desc: "Comunicacions naturals des d'ací als WhatsApps tradicionals dels fills/nets."
  }, {
    id: "25",
    slug: "walkie-talkie",
    title: "Walkie-Talkie Sísmic (Anti-Caos)",
    date: "2026-Q4",
    category: "Seguretat Vital",
    icon: Radio,
    tags: ["SOS P2P"],
    desc: "Canal de veu autònom (Bluetooth) limitat a la comarca quan cau l'internet global."
  }, {
    id: "26",
    slug: "nexus-flash",
    title: "Nexus Flash Notificacions",
    date: "2026-Q3",
    category: "Xarxa",
    icon: Flame,
    tags: ["Push Web"],
    desc: "Alertes grogues a mil·lisegons evitant bloqueig de fons d'iOS 14."
  }, {
    id: "27",
    slug: "poblacio-radio",
    title: "Població Ràdio TTS",
    date: "2027-Q1",
    category: "Accessibilitat",
    icon: Speaker,
    tags: ["Audio"],
    desc: "Creació sorda autònoma de ràdio en veus modelades a les inflexions del poble."
  }, {
    id: "28",
    slug: "spotify-colaboratiu",
    title: "Spotify Col·laboratiu (Festes)",
    date: "2027-Q1",
    category: "Música",
    icon: Radio,
    tags: ["Multimedia"],
    desc: "Fil musical on tots sumen música de moros sense dependre de pagaments externs."
  }, {
    id: "29",
    slug: "virtual-store",
    title: "Virtual Store Rural (Mercat)",
    date: "2026-Q4",
    category: "Negocis",
    icon: Tag,
    tags: ["P2P Market"],
    desc: "Comerç 0 comissions. 'Es lloga trompo', 'Es venen tomaques'."
  }, {
    id: "30",
    slug: "lector-aemps",
    title: "Lector AEMPS de Medicines",
    date: "2026-Q4",
    category: "Salut Comunitària",
    icon: HeartPulse,
    tags: ["Visió"],
    desc: "Càmera IA interpreta Tensiòmetres o medicaments desxifrant contraindicacions."
  }, {
    id: "31",
    slug: "alerta-anticaigudes",
    title: "Alerta Anticaigudes Bancals",
    date: "2027-H1",
    category: "Seguretat Vital",
    icon: ShieldAlert,
    tags: ["Hardware"],
    desc: "Dispar d'acceleròmetres. Aviso directe de risc màxim al cuidador o servei 112 si la xarxa puja."
  }, {
    id: "32",
    slug: "cibermajors",
    title: "Cibermajors Mode Tutor",
    date: "2027-H1",
    category: "Educació Formativa",
    icon: CheckCircle2,
    tags: ["Assistència"],
    desc: "Retràs d'interfícies i guies lentíssimes d'usuari per aprendre teclats buits sense ansietat."
  }, {
    id: "33",
    slug: "haptics-bancal",
    title: "Haptics de Bancal",
    date: "2027-H1",
    category: "Maquinari",
    icon: Hand,
    tags: ["UX Motor"],
    desc: "Feedback vibratori súper-profund al confirmar accions vitals per traspassar el guant d'esporgar del senyor pagès."
  }, {
    id: "34",
    slug: "reliquies-qrs",
    title: "Relíquies en Termoplàstic QRs",
    date: "2028-H1",
    category: "Manteniment Biològic",
    icon: HardDrive,
    tags: ["Impresió Codi"],
    desc: "Encastat del genotip d'HTML final sobre marbre i plàstic d'alta densitat en parets per salvar l'obsolescència d'Amazon 30 anys."
  }, {
    id: "35",
    slug: "ghost-crypt",
    title: "Ghost Memorial Crypt",
    date: "2027-H2",
    category: "Memòria Històrica",
    icon: Skull,
    tags: ["Eternitat"],
    desc: "Mural xifrat post-mortem al sistema d'IDB que roman l'ànima inesborrable associat exclusivament al seu CRDT original inviolable."
  }, {
    id: "36",
    slug: "valencianglish",
    title: "Valencianglish (Dialectologia)",
    date: "2027-H2",
    category: "Cultura Lingüística",
    icon: Globe,
    tags: ["Diccionaris P2P"],
    desc: "Catalogació autònoma per integrar els residents anglesos a l'estructura idiomàtica sense ofendre'ls."
  }, {
    id: "37",
    slug: "master-calendar",
    title: "Master Calendar Assambleari",
    date: "2026-Q3",
    category: "Comunitat",
    icon: Calendar,
    tags: ["Asamblea P2P"],
    desc: "Creació de consens descentralitzat de tota la comarca abans d'ordenar les dates en pedra."
  }, {
    id: "38",
    slug: "chaos-monkey",
    title: "Auditories Chaos Monkey Red Team",
    date: "2027-H1",
    category: "Seguretat",
    icon: Activity,
    tags: ["Tests Autònoms"],
    desc: "Test de trencar l'esquema tallant electricitat artificial abans que hi haja caigudes veres al mas."
  }, {
    id: "39",
    slug: "lectura-bipolar",
    title: "Sistema Lectura Contrast Extrem",
    date: "2026-Q4",
    category: "Accessibilitat Visual",
    icon: Eye,
    tags: ["Daltonisme"],
    desc: "Botó de contrast ceg bipolar, llançant els colors i el 100% de bateries per assegurar llegibilitat per cataractes avançades."
  }, {
    id: "40",
    slug: "sobirania-npu",
    title: "Sobirania AI Purista Offline",
    date: "2028-H2",
    category: "Ecosistema Central P2P",
    icon: BrainCircuit,
    tags: ["Maquinari LLM Base"],
    desc: "Incapacitar l'eixida a cap nuvol. Que el motor visca dins Sóc de Poble xipat en NPU físic domèstic (Lliure d'API's)."
  }, {
    id: "43",
    slug: "atles-del-trellat",
    title: "L'Atles del Trellat (Catàleg Cartogràfic)",
    date: "2027-H2",
    category: "Etnografia",
    icon: Map,
    tags: ["CMS Territorial", "P2P"],
    desc: "Sistema de catalogació i mapeig interactiu estil Wikipedra per documentar recursos rurals (pedra seca, fonts, molins) a la comarca."
  }]
};
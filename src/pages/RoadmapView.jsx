import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Compass, CheckCircle2, CircleDashed, Circle, Sprout, Tractor, PackageCheck, Tag, Calendar, ShieldAlert, HeartPulse, BrainCircuit, Globe, Activity, LayoutGrid, Radio, Smartphone, HardDrive, Eye, Fingerprint, FileText, Database, Speaker, Map, Flame, FileWarning, Hand, Skull, SunMedium, SmartphoneNfc, Search } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

// Dades de Tareas (Roadmap Mestre Consolidat: Les 40 Llavors de Sóc de Poble)
const roadmapData = {
  done: [
    { id: "1", title: "Motor A10 Inmortal (Pedra Seca)", date: "2026-Q1", category: "Arquitectura", icon: Tractor, tags: ["Frontend"], desc: "Liquid DOM i content-visibility per fluir a 60fps globals en iPads del 2016." },
    { id: "2", title: "IDB Guardian (Persistència W.A.L.)", date: "2026-Q1", category: "Sistema", icon: Database, tags: ["Offline"], desc: "Protocol Write-Ahead Logging local sobre SQLite-WASM als web workers." },
    { id: "3", title: "Sistema Plantilles Mestre", date: "2026-Q1", category: "Arquitectura", icon: LayoutGrid, tags: ["UI/UX"], desc: "Estandardització estricta hereditària per Documents, Agenda, Entitats i Poblacions." },
    { id: "4", title: "PWA Instal·lable Clean", date: "2026-Q1", category: "Connectivitat", icon: Smartphone, tags: ["Storeless"], desc: "Distribució PWA nadiua evitant les botigues corporatives." },
    { id: "5", title: "La Guàrdia de Nit", date: "2026-Q1", category: "Mètode", icon: Compass, tags: ["Filosofia"], desc: "Estratègia tècnica per evadir asfíxia de tokens en els LLMs occidentals." },
    { id: "6", title: "Xat de la IAIA (Testament Digital)", date: "2026-Q1", category: "Intel·ligència", icon: BrainCircuit, tags: ["Agents"], desc: "Arquitectura local d'IA per encapçalar les converses del mas." },
    { id: "7", title: "L'Ull del Mestre PWA", date: "2026-Q2", category: "UI/UX", icon: Eye, tags: ["Auditoria"], desc: "Tauler de navegació zero-scrolling amb auditoria en temps real de les targetes." },
    { id: "8", title: "Format GEM MODERN 28px", date: "2026-Q1", category: "UI/UX", icon: SunMedium, tags: ["Accessibilitat"], desc: "Configuració d'alt contrast i tipografia generosa per a més grans de 80 anys." },
    { id: "9", title: "Llei Orgull Rural Visual", date: "2026-Q1", category: "UI/UX", icon: ShieldAlert, tags: ["Estil"], desc: "Prohibició del clean-design corporatiu. Escuts majestuosos i reines locals." },
    { id: "10", title: "Taller Trellat", date: "2026-Q2", category: "Arquitectura", icon: FileText, tags: ["Developer"], desc: "Consola transparent per auditar i gestionar Y.js en qualsevol dispositiu." }
  ],
  dev: [
    { id: "11", title: "Rúper Rató (Caza-BOEs)", date: "2026-Q2", category: "Burocràcia", icon: Search, tags: ["IA RAG"], desc: "Assistent que escaneja reglaments i el DOGV diàriament extraent les lleis opaques." },
    { id: "12", title: "Mesh Viva (WebRTC Eg-Walker)", date: "2026-Q2", category: "Xarxa", icon: Globe, tags: ["Offline P2P"], desc: "Connexions pantalla a pantalla esquivant operadors per WLAN/Bluetooth." },
    { id: "13", title: "Verificació SSI (Identitat DIDs)", date: "2026-Q2", category: "Sobirania", icon: Fingerprint, tags: ["Criptografia"], desc: "Signatures digitals emeses pels veïns del Padró Rural." },
    { id: "14", title: "Auditoria Espill del Temps", date: "2026-Q3", category: "Memòria", icon: Activity, tags: ["Fotografia"], desc: "Comparador intergeneracional d'arxius natius juxtaposats (1968 vs 2024)." },
    { id: "15", title: "Nano Banana", date: "2026-Q3", category: "Media", icon: Eye, tags: ["Compressió"], desc: "Simbiosi multimèdia hiper-comprimida per fluir en cobertures 2G muntanyenques." },
    { id: "16", title: "Ideoteca P2P", date: "2026-Q2", category: "Comunitat", icon: BrainCircuit, tags: ["CRDT"], desc: "Llenç on es graven les noves llavors inventives acoblades asíncronament." },
    { id: "17", title: "Notes Compartides (Murs Masia)", date: "2026-Q2", category: "Comunitat", icon: FileText, tags: ["Y.js"], desc: "Pissarres efímeres dibuixables per les cases o famílies del poble." },
    { id: "18", title: "Agent Directory", date: "2026-Q2", category: "Ecosistema", icon: Map, tags: ["Ordenació"], desc: "Auto-ordenació orgànica del Padró (Humans i IAIAs) segons activitat P2P." },
    { id: "19", title: "Bategat RAG PDF Agricola", date: "2026-Q2", category: "Burocràcia", icon: FileWarning, tags: ["LLM", "Lleis"], desc: "Anàlisi legal instantània dels protocols químics i fitosanitaris locals." },
    { id: "20", title: "Consola Solatge (Verbose=1)", date: "2026-Q2", category: "Sistema", icon: Activity, tags: ["Debugger"], desc: "Registre directe a l'UI per auditar el Thrashing d'imatges PWA en la natura." }
  ],
  backlog: [
    { id: "21", title: "Tràmits Xylella (Insta-Burocràcia)", date: "2026-Q3", category: "Ajudes", icon: FileWarning, tags: ["Burocràcia Zero"], desc: "Emplenat autònom legal de les subvencions de Sanitat Vegetal per l'ús de la veu." },
    { id: "22", title: "DAFO Automàtic Poble", date: "2026-Q3", category: "Comunitat", icon: Activity, tags: ["Anàlisi IA"], desc: "Report gràfic mensual llançat per El Cronista sobre l'estat de la pedania." },
    { id: "23", title: "El Cronista (Les Actes)", date: "2026-Q3", category: "Cultura", icon: FileText, tags: ["Notícies P2P"], desc: "Resums setmanals generats en prosa valenciana del debat del llibre CRDT." },
    { id: "24", title: "Pont WhatsApp Nivell Déu", date: "2026-Q4", category: "Xarxa Externa", icon: Smartphone, tags: ["Webhook P2P"], desc: "Comunicacions naturals des d'ací als WhatsApps tradicionals dels fills/nets." },
    { id: "25", title: "Walkie-Talkie Sísmic (Anti-Caos)", date: "2026-Q4", category: "Seguretat Vital", icon: Radio, tags: ["SOS P2P"], desc: "Canal de veu autònom (Bluetooth) limitat a la comarca quan cau l'internet global." },
    { id: "26", title: "Nexus Flash Notificacions", date: "2026-Q3", category: "Xarxa", icon: Flame, tags: ["Push Web"], desc: "Alertes grogues a mil·lisegons evitant bloqueig de fons d'iOS 14." },
    { id: "27", title: "Població Ràdio TTS", date: "2027-Q1", category: "Accessibilitat", icon: Speaker, tags: ["Audio"], desc: "Creació sorda autònoma de ràdio en veus modelades a les inflexions del poble." },
    { id: "28", title: "Spotify Col·laboratiu (Festes)", date: "2027-Q1", category: "Música", icon: Radio, tags: ["Multimedia"], desc: "Fil musical on tots sumen música de moros sense dependre de pagaments externs." },
    { id: "29", title: "Virtual Store Rural (Mercat)", date: "2026-Q4", category: "Negocis", icon: Tag, tags: ["P2P Market"], desc: "Comerç 0 comissions. 'Es lloga trompo', 'Es venen tomaques'." },
    { id: "30", title: "Lector AEMPS de Medicines", date: "2026-Q4", category: "Salut Comunitària", icon: HeartPulse, tags: ["Visió"], desc: "Càmera IA interpreta Tensiòmetres o medicaments desxifrant contraindicacions." },
    { id: "31", title: "Alerta Anticaigudes Bancals", date: "2027-H1", category: "Seguretat Vital", icon: ShieldAlert, tags: ["Hardware"], desc: "Dispar d'acceleròmetres. Aviso directe de risc màxim al cuidador o servei 112 si la xarxa puja." },
    { id: "32", title: "Cibermajors Mode Tutor", date: "2027-H1", category: "Educació Formativa", icon: CheckCircle2, tags: ["Assistència"], desc: "Retràs d'interfícies i guies lentíssimes d'usuari per aprendre teclats buits sense ansietat." },
    { id: "33", title: "Haptics de Bancal", date: "2027-H1", category: "Maquinari", icon: Hand, tags: ["UX Motor"], desc: "Feedback vibratori súper-profund al confirmar accions vitals per traspassar el guant d'esporgar del senyor pagès." },
    { id: "34", title: "Relíquies en Termoplàstic QRs", date: "2028-H1", category: "Manteniment Biològic", icon: HardDrive, tags: ["Impresió Codi"], desc: "Encastat del genotip d'HTML final sobre marbre i plàstic d'alta densitat en parets per salvar l'obsolescència d'Amazon 30 anys." },
    { id: "35", title: "Ghost Memorial Crypt", date: "2027-H2", category: "Memòria Històrica", icon: Skull, tags: ["Eternitat"], desc: "Mural xifrat post-mortem al sistema d'IDB que roman l'ànima inesborrable associat exclusivament al seu CRDT original inviolable." },
    { id: "36", title: "Valencianglish (Dialectologia)", date: "2027-H2", category: "Cultura Lingüística", icon: Globe, tags: ["Diccionaris P2P"], desc: "Catalogació autònoma per integrar els residents anglesos a l'estructura idiomàtica sense ofendre'ls." },
    { id: "37", title: "Master Calendar Assambleari", date: "2026-Q3", category: "Comunitat", icon: Calendar, tags: ["Asamblea P2P"], desc: "Creació de consens descentralitzat de tota la comarca abans d'ordenar les dates en pedra." },
    { id: "38", title: "Auditories Chaos Monkey Red Team", date: "2027-H1", category: "Seguretat", icon: Activity, tags: ["Tests Autònoms"], desc: "Test de trencar l'esquema tallant electricitat artificial abans que hi haja caigudes veres al mas." },
    { id: "39", title: "Sistema Lectura Contrast Extrem", date: "2026-Q4", category: "Accessibilitat Visual", icon: Eye, tags: ["Daltonisme"], desc: "Botó de contrast ceg bipolar, llançant els colors i el 100% de bateries per assegurar llegibilitat per cataractes avançades." },
    { id: "40", title: "Sobirania AI Purista Offline", date: "2028-H2", category: "Ecosistema Central P2P", icon: BrainCircuit, tags: ["Maquinari LLM Base"], desc: "Incapacitar l'eixida a cap nuvol. Que el motor visca dins Sóc de Poble xipat en NPU físic domèstic (Lliure d'API's)." }
  ]
};

// Extracció ordenada i timeline grouping
const allTasks = [...roadmapData.done, ...roadmapData.dev, ...roadmapData.backlog].sort((a, b) => a.date.localeCompare(b.date));
const groupedByQuarter = allTasks.reduce((acc, task) => {
  if (!acc[task.date]) acc[task.date] = [];
  acc[task.date].push(task);
  return acc;
}, {});
const quarters = Object.keys(groupedByQuarter).sort();

const BoardColumn = ({ title, icon: Icon, items, colorClass }) => (
  <div className="flex-1 min-w-[320px] max-w-md w-full bg-[#111] dark:bg-[#111]/50 border border-[var(--border-master)] rounded-xl p-4 flex flex-col gap-4 contain-layout">
    <div className={`flex items-center gap-2 border-b-2 pb-3 mb-1 ${colorClass}`}>
      <Icon size={22} className="shrink-0" />
      <h2 className="text-xl font-bold uppercase m-0 leading-none">{title}</h2>
      <span className="ml-auto bg-black/10 dark:bg-white/10 px-2 py-0.5 rounded-full text-sm font-bold opacity-70">
        {items.length}
      </span>
    </div>
    
    <div className="flex flex-col gap-3 stable-scroll pb-2 z-token-base">
      {items.map((item) => {
        const ItemIcon = item.icon;
        return (
        <div key={item.id} className="universal-card hover:scale-[1.01] transition-transform cursor-default group relative overflow-hidden bg-black/40">
          <div className="absolute top-0 left-0 w-1 h-full bg-[var(--theme-accent-primary)] opacity-50" />
          
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-black tracking-widest uppercase opacity-60 flex items-center gap-1.5 line-clamp-1">
              <Calendar size={12} className="shrink-0" /> {item.date}
            </span>
            <div className="flex bg-[var(--theme-accent-primary)]/10 px-2 py-1 rounded gap-1 items-center">
              <Tag size={12} className="text-[var(--theme-accent-primary)] shrink-0" />
              <span className="text-[10px] uppercase font-bold text-[var(--theme-accent-primary)] text-center line-clamp-1 leading-none">{item.category}</span>
            </div>
          </div>
          
          <div className="flex items-start gap-3 mt-1">
            <div className="p-2 bg-black/50 rounded-[10px] border border-[var(--border-master)] shrink-0 mt-0.5 text-[var(--theme-accent-secondary)]">
              <ItemIcon size={20} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="font-bold text-[1.05rem] leading-tight mb-2 text-white group-hover:text-[var(--theme-accent-primary)] transition-colors">{item.title}</h3>
              <p className="text-[13px] opacity-70 leading-snug m-0 text-gray-300 text-pretty">
                {item.desc}
              </p>
            </div>
          </div>
        </div>
      )})}
    </div>
  </div>
);

const CalendarGanttView = () => (
  <div className="w-full h-full flex flex-col gap-8 md:gap-14 pb-12 align-top">
    {quarters.map((q, idx) => (
      <div key={q} className="relative w-full flex flex-col md:flex-row gap-4 lg:gap-8 items-start group">
        
        {/* Timeline Axis (Q) */}
        <div className="md:w-32 lg:w-40 shrink-0 sticky top-0 md:top-4 z-10 bg-[var(--bg-panel)]/95 backdrop-blur-md md:bg-transparent py-2 border-b md:border-b-0 border-[var(--theme-accent-primary)] md:border-r-4 pr-4">
          <div className="flex p-3 rounded-lg md:rounded-none bg-transparent items-center gap-3">
             <div className="w-3 h-3 rounded-full bg-[var(--theme-accent-primary)] -ml-2 shrink-0 md:block hidden outline outline-4 outline-[var(--bg-panel)] shadow-md" />
             <h3 className="font-black text-2xl tracking-tighter text-[var(--theme-accent-primary)] uppercase flex-1 text-left md:text-right m-0 flex items-center justify-start md:justify-end gap-2">
              <Calendar size={20} className="md:hidden" /> {q.replace('-', ' ')}
             </h3>
          </div>
        </div>

        {/* Task Nodes Grid */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-5 lg:gap-6 mt-1 relativerounded-xl">
           
           {groupedByQuarter[q].map(item => {
              const ItemIcon = item.icon;
              const statusColor = roadmapData.done.some(d=>d.id===item.id) 
                  ? "border-green-500/50 bg-green-500/5" 
                  : roadmapData.dev.some(d=>d.id===item.id) 
                  ? "border-blue-500/50 bg-blue-500/5" 
                  : "border-orange-500/50 bg-orange-500/5";

              return (
              <div key={item.id} className={`flex flex-col universal-card border-[2px] ${statusColor} hover:scale-[1.02] active:scale-[0.98] transition-transform`}>
                 <div className="flex items-center gap-3 border-b border-white/5 pb-3">
                    <div className={`bg-black/50 p-2.5 rounded-[12px] shrink-0 border border-white/5`}>
                      <ItemIcon size={24} className="text-white opacity-90" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-[1.1rem] leading-tight m-0 text-white">{item.title}</h4>
                      <div className="text-[10px] mt-1.5 font-black text-[var(--theme-accent-secondary)] uppercase tracking-widest">{item.category}</div>
                    </div>
                 </div>
                 <p className="text-[13px] opacity-80 mt-3 flex-1 flex items-start text-gray-300 leading-relaxed font-medium">
                   {item.desc}
                 </p>
                 <div className="mt-4 pt-2 border-t border-white/5 flex gap-2 overflow-hidden flex-wrap max-h-5 sm:max-h-screen">
                    <span className="text-[9px] uppercase tracking-wider font-extrabold text-gray-500 line-clamp-1">{item.tags.join(' • ')}</span>
                 </div>
              </div>
           )})}
        </div>
      </div>
    ))}
  </div>
);


const RoadmapView = () => {
  const { t } = useTranslation();
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' | 'calendar'

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Project",
    "name": "Sóc de Poble: Sistema Operatiu Rural (Full de Ruta Extrem)",
    "description": "Base centralitzada del projecte amb 40 llavors operatives: Cibermajors, Valencianglish, QRs Termoplàstics, Walkie-Talkies Rurals i la Mesh Viva P2P.",
    "foundingDate": "2026-02-04"
  };

  return (
    <div className="w-full h-full min-h-0 overflow-y-auto overflow-x-hidden stable-scroll relative pb-32 pt-6">
      <Helmet>
        <title>Les 40 Fites (Ruta) | Sóc de Poble</title>
        <meta name="description" content="Taulell Mestre: Totes les idees, des de tràmits subvencionats per Xylella fins a ràdios de catàstrofes o lectors de medicines." />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <div className="max-w-[1500px] mx-auto px-4 md:px-6 xl:px-8">
        {/* Cabecera Principal UI Documental */}
        <header className="mb-8 md:mb-12 max-w-5xl border-l-[6px] md:border-l-[8px] border-[var(--theme-accent-primary)] pl-5 md:pl-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 w-full">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="hidden lg:flex w-14 h-14 rounded-[16px] bg-[var(--theme-accent-primary)]/10 border border-[var(--theme-accent-primary)]/30 items-center justify-center">
                    <Compass className="text-[var(--theme-accent-primary)]" size={32} strokeWidth={2.5} />
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tighter m-0 text-[var(--theme-text)] border-none">
                  Les 40 Fites<br/><span className="opacity-60 text-2xl sm:text-3xl lg:text-4xl text-[var(--theme-accent-secondary)]">La Matriu de Llavors</span>
                </h1>
              </div>
              <p className="text-base sm:text-lg lg:text-xl font-medium leading-relaxed max-w-3xl mt-4 opacity-70 text-gray-200 text-pretty border-none outline-none">
                L'auditoria històrica més gran del Mas fins avui. Totes les línies, idees y mecàniques burocràtiques o P2P que asseient l'abans i el després de <strong>Sóc de Poble</strong> cap al <span className="text-[var(--theme-accent-primary)] font-bold">Rescat de la Ruralitat</span> i la Sobirania Ciutadana.
              </p>
            </div>
            
            {/* Toggle Modern UI */}
            <div className="flex bg-black/60 border border-[var(--border-master)] p-1.5 rounded-xl shrink-0 mt-2 md:mt-0 shadow-[0_10px_30px_rgba(0,0,0,0.5)] z-20 self-stretch sm:self-auto backdrop-blur-md">
               <button 
                 onClick={() => setViewMode('kanban')}
                 className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 font-bold uppercase text-[11px] sm:text-sm tracking-wider rounded-lg transition-all ${viewMode === 'kanban' ? 'bg-[var(--theme-accent-primary)] text-black scale-100' : 'text-gray-400 hover:text-white scale-[0.98]'}`}
               >
                 <LayoutGrid size={18} strokeWidth={2.5}/> Tabler
               </button>
               <button 
                 onClick={() => setViewMode('calendar')}
                 className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 font-bold uppercase text-[11px] sm:text-sm tracking-wider rounded-lg transition-all ${viewMode === 'calendar' ? 'bg-[var(--theme-accent-primary)] text-black scale-100' : 'text-gray-400 hover:text-white scale-[0.98]'}`}
               >
                 <Calendar size={18} strokeWidth={2.5} /> Línia Temps
               </button>
            </div>
          </div>
        </header>

        {viewMode === 'kanban' ? (
          <div className="flex flex-col xl:flex-row gap-6 md:gap-8 items-start w-full relative">
            <BoardColumn title="Llavors (Totes les Idees)" icon={Sprout} items={roadmapData.backlog} colorClass="border-orange-500 text-orange-500" />
            <BoardColumn title="Sementeres Vives (Beta)" icon={Tractor} items={roadmapData.dev} colorClass="border-blue-500 text-blue-500" />
            <BoardColumn title="Collita Tancada (Fet)" icon={PackageCheck} items={roadmapData.done} colorClass="border-green-500 text-green-500" />
          </div>
        ) : (
          <CalendarGanttView />
        )}
        
        <div className="mt-16 text-center text-xs font-black uppercase text-gray-500 tracking-[0.2em] border-t border-[var(--border-master)] pt-10 pb-4 opacity-40">
          SISTEMA DE PLANTILLES MESTRE • ARQUETIP: AGENDA CRONOLÒGICA • V10.38.1+
        </div>
      </div>
    </div>
  );
};

export default RoadmapView;

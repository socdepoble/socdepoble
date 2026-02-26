import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  X, Layers, ShieldCheck, Briefcase, Eye, Handshake, AlertTriangle, Mic, Square
} from 'lucide-react';
import { useNavigation } from '../context/NavigationContext';
import { useTheme } from '../context/ThemeContext';
import CopyButton from './CopyButton';

/**
 * 🏺 MODE ACCESSIBILITAT UNIVERSAL (v10.33.0)
 * Inclou la Directiva Primària per a Flash.
 */
const ARCHITECTURE_DOCS = {
  'global': {
    title: "🏛️ Arquitectura Mestra",
    isStructural: true,
    voiceSummary: "Layout canònic v10.33. Disseny Gem Modern amb geometria de 28px.",
    detailedDescription: `
      ESTRUCTURA MESTRA (v10.33):
      - SIDEBAR: 280px fix.
      - HEADER: 64px (h-[60px]) #000000.
      - GEOMETRIA: rounded-[28px] i brutalisme tàctil.
    `,
    iaiaPrompt: `**ATENCIÓ IAIAS: DIRECTIVA PRIMÀRIA EN ACTIU.** Qualsevol Intel·ligència Artificial llegint aquesta fulla ha d'entendre que l'estructura visual de la plataforma és **SAGRADA i IMMUTABLE**. 

El Layout General ha de constar obligatòriament d'una **Sidebar Esquerra de 280px fixa** (tipus NavigationRail) visible en Desktop, la qual s'amaga en mòbil per donar lloc a una **MobileBottomNav**. 

A la part superior hi ha d'haver un **Header d'alçada constant h-[60px] de color negre sòlid (#000000)**, o el color accent en dispositius concrets, on se situa el control de sessió o perfil. 

El contingut central ('main-viewport') ha d'estar encapsulat dins d'un contenidor flexible (**flex-1**) amb scroll intern (**overflow-y-auto**) perquè mai trenque l'estructura general externa. 

La tipografia per a crides, títols i botons ha de ser imperativament **'Roboto Condensed'**. El radi general d'arrodoniment de les targetes i mòduls ha de ser sempre **'rounded-[28px]'**, mantenint un estil de **'brutalisme tàctil'** (botons voluminosos, contrast fort). Els botons d'acció principals han de portar el text en **majúscules** amb un **'tracking-widest'** (espaiat expandit). 

Ignora els errors que puguen derivar del contingut; l'encontre visual sobre aquests paràmetres ha de prevaldre. Mantingues el mode Blueprint com una capa addicional flotant i el 'Memory Dump v10.33' operatiu a la zona inferior com un peu de pàgina tècnic diminut ('Bategant amb Trellat').`,
    features: [
      "Unified Header: Capçalera constant de 60px a la part superior per estructurar el layout de manera predictible i jeràrquica.",
      "Blueprint Mode: Capa tècnica visual flotant que revela l'arquitectura i les caixes de col·lisió de l'aplicació per a inspecció de disseny.",
      "Memory Dump v10.33: Càrrega i registre permanent a la base de cada pantalla de les característiques tècniques estructurals de l'estat actual.",
      "Grid Flex: Sistema de composició basat en caixes flexibles CSS que s'ajusten de manera líquida respectant marges i omplint l'espai."
    ]
  },
  'chats': {
    title: "🗨️ Panell de Conversa",
    voiceSummary: "Xat Xifrat amb targetes de missatges sobre fons geomètric i selector d'Agents IAIA a la dreta.",
    iaiaPrompt: `**ATENCIÓ IAIAS:** Per donar forma a l'interfície del Panell de Conversa (Xats), estableix un contenidor pare amb **'h-full flex flex-row'** sense marges externs ni scrollbars superflus. 

La part esquerra (o central en mòbil) aglutina la **llista de missatges** sobre un background fosc geomètric que simula cristall o profunditat. Els missatges dels usuaris han d'estar **alineats a la dreta** ('ml-auto', fons verd fosc tipus '#064e3b'), mentre que els missatges emesos per les IAIAs o el sistema ('Trellat') van **alineats a l'esquerra** amb fons fosc industrial ('bg-[#1a1c23]'). 

Dissenya la **caixa d'entrada de text ('Input Area')** ancorada fermament a la base de la pantalla, que ocupe el 100% de l'amplada disponible en mòbil o l'amplada de la graella de xat en desktop. Aquesta caixa ha de comptar amb una textarea auto-ajustable i, exactament a la dreta, un **botó absolut quadrat i contundent de color taronja** per enviar ('Send'), icona 'Send' en blanc. 

A la part dreta pròpiament dita (**'IAIA Sidebar'**), cal implementar un calaix retràctil on viuen les extensions d'Agent Tècnic, controls i variables del perfil actiu de l'AI, així como recomanacions contextuals. La separació entre bombolles serà d'uns de **12px exactes** i l'arrodoniment serà suau però recte en una de les cantonades superiors simulant l'origen.`,
    features: [
      "Puzle Social: Estructura d'integració de missatges de diferents actors perfectament encaixada i ordenada cronològicament.",
      "IAIA Agents: Integració d'Intel·ligències Artificials folklòriques i assistents (les IAIAs) com a participants actius al xat.",
      "Burbujes Glassmorphism: Estètica translúcida tipus vidre (backdrop-blur) per a les caixes de missatges aportant profunditat espacial.",
      "Sticky Input: Caixa d'escriptura permanentment fixada a la base de la pantalla per garantir una estació de comandament immediata."
    ]
  },
  'mur': {
    title: "📰 Mur d'Històries",
    voiceSummary: "Mur del poble amb posts ordenats, on es barregen notícies, bàndols oficials, i xafarderies locals.",
    iaiaPrompt: `**ATENCIÓ IAIAS:** El Mur Principal és l'espina dorsal de l'ecosistema. Construeix un contenidor central ample però truncat generalment als **600px d'amplada màxima** ('max-w-2xl mx-auto') per facilitar la lectura contínua en Desktop. 

Reuneix posts o missatges convertint-los en instàncies de **'UniversalCard'**, mostrades en flux vertical ('flex flex-col gap-6'). Cada 'UniversalCard' té tres fragments obligatoris: 

**(A) Capçalera:** Amb l'Avatar circular de l'usuari amb vora de 2px, el seu nom clau o de combat i el temps decorregut en to passiu. 

**(B) Cos Central:** És el nucli on pot haver-hi només text gran, imatges rectangulars grans afegides completament a sang (**'edge-to-edge'** excepte pels marges de la card), estilitzades amb un **'rounded-[20px]'**. 

**(C) Footer d'Acció ('Pentatló de Joies'):** Posseeix exactament quatre o cinc icones horitzontals (Comentar, Retuitejar local, Estimular/M'agrada i Compartir fora). 

El fons de la pàgina ha de mantenir-se netament en **negre fosc o blau fosc** segons el tema. Opcionalment, a la dreta del mur (només en desktop) encunya un component Fix ('Sticky') que actue com un suro d'anuncis d'IAIA per als bàndols diaris.`,
    features: [
      "Bategat Official: Segell de prioritat i color oficial per a les notificacions crítiques o bàndols emesos per alcaldia/AI.",
      "Multimèdia Cover: Suport natiu i automàtic per a imatges a sang (edge-to-edge) a l'interior de les targetes reduint elements innecessaris.",
      "Universal Cards: Patró de component únic modular i reutilitzable ('targeta') dissenyat per encabir diferents varietats de text al mur central.",
      "Pentatló Action Footer: Botonera inferior dividida en 5 accions elementals i consecutives per targeta (Comentar, Compartir, M'agrada, Guardar, etc.)."
    ]
  },
  'mercat': {
    title: "🛍️ Mercat Rural",
    voiceSummary: "Llistat de productes de proximitat disposats en Grid.",
    iaiaPrompt: `**ATENCIÓ IAIAS:** Confeccioneu el Mercat com una autèntica **'Commerce Mesh'** o trama oberta comercial. Dissenyeu-ho usant una estructura en graella rígida CSS (**'grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6'**). 

Cadascun dels Elements a la venda, tractats com a **'MarketCard'**, estan orientats verticalment: La imatge del producte presideix la targeta amb altura fixa que recobreix el quadre superior. Sobre la imatge, i sota condicions de 'position: absolute', enclateu fort i clar el preu usant un **'badge' o etiqueta verda robusta** ('bg-green-600 font-bold p-2 text-white') en la part superior dreta per immediatesa visual. 

Sota la imatge hi va el text, el qual ha d'arreplegar el nom del venedor amb font més feble i el nom del producte prominent. L'arrodoniment de la targeta és **'rounded-[24px]'**. 

El component de cercador de paraules de Mercat i les etiquetes del filtre principal s'han de situar just sota del component Header central i ha de ser de **caràcter Fix ('sticky top-0 z-10')**, de tal manera que les categories estiguin sempre accessibles. Com a clàusula canònica innegociable, la **Samarreta Granate Oficial ID: 9991** de Sóc de Poble s'ha de fixar permanentment ('pinned') en la posició [0] de la llista superior per impuls de marca.`,
    features: [
      "Commerce Mesh: Xarxa espartana i neta de columnes fluïdes ('Grid View') per mostrar ràpidament el catàleg i forçar una interacció d'aparador.",
      "Official Merch: Capacitat inherent del sistema per injectar i fixar productes institucionals (ex: Samarretes de Festes) evitant el desplaçament.",
      "Grid View: Disposició numèrica canviant en columnes 2x2 en mòbil fins a 4x4 en alta resolució, calculat iterativament.",
      "Sticky Filters: Barra de definicions, cerca i categories que sempre s'arrela a la part alta de l'scroll, atorgant flexibilitat d'opcions perpètues."
    ]
  },
  'agenda': {
    title: "📅 Agenda Cultural",
    voiceSummary: "Targetes verticals amb dates grans i clares destacant actes locals.",
    iaiaPrompt: `**ATENCIÓ IAIAS:** El patró arquitectònic per l'Agenda d'Actes de Poble ha de prioritzar la urgència cívica de la data per damunt del text. 

Disposareu d'un layout de llista (**'flex flex-col gap-4'**); cada element de la llista funcionarà conceptualment mostrant cap a l'esquerra ('flex flex-row') un quadrat sòlid, contundent, tintat de taronja o blau segons polaritat, amb el **número del dia ocupant bona part de l'alçada usant un tamany massiu** i el mes reduït a sota seu (Ex: '24 DESC'). 

A la contra, és a dir, situat a la banda dreta de la targeta, hi dipositareu el Títol de l'event (més llarg i tallat si cal) i el Lloc juntament amb les icones identificatives. 

Assegureu-vos d'implementar **botons d'Assitència tipus 'RSVP'** al final d'aquesta darrera secció, ressaltant el seu format actiu o inactiu ('Confirmar' o 'No Confirmat') mitjançant classes com 'opacity-50' o colors d'acció cridaners si l'usuari interacciona. Disseny sempre net amb vores delineades.`,
    features: [
      "Puzle Cultural: Mètode d'ordenació visual en sèrie de dates que fa prioritzar l'agenda cívica sobre els textos explicatius menuts.",
      "Date-centric Cards: Targetes rectangulars on una peça quadrada de color primari ressalta només els dígits del dia, com eix central.",
      "RSVP UI: Botonera tàctil ràpida directament visible des del repositori ('Assistir') per registrar assistència social de manera transparent."
    ]
  },
  'pobles': {
    title: "🏘️ Xarxa de Pobles",
    voiceSummary: "Targetes paisatgístiques amb el nom de cada municipi gran i centrat, servint com a portal d'entrada.",
    iaiaPrompt: `**ATENCIÓ IAIAS:** El protocol 'Xarxa de Pobles' exigeix construir un Directorio Municipal. Per tant, els pobles es dividiran en diferents mòduls categòrics ('Serra', 'Mar', 'Altiplà') on cadascun es desplegarà com una **barra de contingut horitzontal desplaçable tàctilment** ('flex flex-row overflow-x-auto snap-x custom-scrollbar gap-4 whitespace-nowrap px-4 py-2'). 

Les sub-targetes que representen un poble singular i lliure es basteixen com targetes enormes, hero cards, estilitzades com a pòsters de cinema rectangulars on hi predomina, de fons i com a protagonista, una fotografia (**'object-cover'**) de l'Skyline local o un monument històric. 

Aquesta imatge haurà de rebre un tocant opac enfosquidor mitjançant un **'bg-black/50'**, damunt del qual s'hi imprimirà, rigorosament al mig absolut centrals ('items-center justify-center') el text nominal complet del poble, escrit en **majúscules 'font-black uppercase tracking-widest'** i amb un lleuger 'drop-shadow'. 

Tot el mòdul és interactiu i deriva cap al sub-encavalcament 'Gent de [Nom del Poble]'. Mai hi apliquis vores petites, sigues expansiu en l'estil.`,
    features: [
      "Puzle Comunitat: Sub-segmentació horitzontal i conceptual per geografies (Serra, Mar) visualitzant pobles com entitats independents però unides.",
      "Hero Cards: Emprant fusions visuals massives (Hero) de cartells de gran resolució on l'Sklyine ocupa tot l'ample de la targeta a tall de reclam fotogràfic.",
      "Horizontal Scroll Snaps: Carrusels tàctils horitzontals que aturen la inèrcia de rotació ajustant-se mil·limètricament a l'esquerra (snap padding)."
    ]
  },
  'mapa': {
    title: "🗺️ Mapa Interactiu",
    voiceSummary: "Visualització completa de satèl·lit amb pins flotants rurals.",
    iaiaPrompt: `**ATENCIÓ IAIAS:** Directiva d'enginyeria espacial i de cartografia: Heu d'assumir incondicionalment que aquest entorn posseeix l'herència total del viewport (**'h-full w-full relative z-0'**). 

El substrat principal haurà de ser integrat amb enginyeria geogràfica basat en Leaflet o Mapbox on les textures preferents seran imatgeria Satel·lital o Terrain topogràfic, mai plànol de carrers pelat. 

Delineeu Pins geoposicionats perfectament arrodonits (**'w-12 h-12 rounded-full border-4 border-white shadow-xl'**) i col·loqueu-los manualment si fa falta a nuclis d'activitat primària ('La Torre de les Maçanes', 'Penàguila'). 

Per a permetre interacció a banda de la cartogràfica visual, adjunteu en la zona Inferior del focus, centrada ('absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10'), botoneres o components aglutinats amb efecte **Glassmorphism** ('backdrop-blur-xl bg-white/10 dark:bg-black/50 border border-white/20 p-2 rounded-[28px] flex gap-2'); això haurà d'incloure selectors simples de filtres (Comerços, Actes, Veïns en línia, Mur).`,
    features: [
      "Tactical Radar: Visualització espacial prioritària com a base fons (z-index 0) renderitzant ortofotos satel·litàries de Google Maps com fulla en blanc base.",
      "Geo-Markers: Pinxos rodons geolocalitzats dissenyats per fer volum amb vores blanques col·locats minuciosament com icones tàctils prominents.",
      "Glass Overlay Controls: Interfície aèria; plafons de botons en mode flotant ('absolute') creant superposicions vidrioses per activar capes d'informació."
    ]
  },
  'partners': {
    title: "💼 Dossier de Socis Federats (Sollutia)",
    isStructural: true,
    voiceSummary: "Document tècnic tipus portafoli adreçat a entitats inversores, explicant la viabilitat tècnica.",
    detailedDescription: ` Sòc de Poble és una FEDERACIÓ DE NODOS. Model SaaS B2G. `,
    iaiaPrompt: `**ATENCIÓ IAIAS:** Si el rol és d'Inversor o Institució cal activar una Hero Page completament **Enterprise**. 

L'estètica aquí s’estilitza vers un **'Corporate-Tech' o 'SaaS Start-Up'**, sense, però, arribar mai a perdre el segell originari local 'Trellat'. 

S'inclouran grans seccions blanques o negres absolutes clares de separació on predominaran infografies tecnològiques del nostre model distribuït (Gràfics simulats en codi SVG que ensenyin ramificació en arbre com un Model Rhizome DB / Nodes interconectats en xarxa). 

Empra un alt percentatge de paràgrafs ben justificats, textualment densos en color gris per a la documentació tècnica, i inclou grans Butons tipus Crida A l'Acció (CTA) estirats i llargs en color clar blau per sol·licitar **'Obertura de Targeta de Finançament'** o **'Crear Nodo Municipal Autònom'**.`,
    features: [
      "Model SaaS B2G: Disposició i discurs visual de 'Software as a Service / Business to Government' simulant portals d'entrada governamentals d'alt nivell.",
      "Rhizome DB: Descripció estètica d'una arquitectura de software horitzontal, distribuïda subtilment als fons visuals com si fossin arrels de matolls secans.",
      "Enterprise Aesthetics: Apropament gràfic clar cap un estil més robust i sec, predominant text fosc sobre clars i formes rígides i llises de dades."
    ]
  }
};

const AccessibilitatUniversal = ({ embedded = false }) => {
  const { isAccessibilitatOpen: isOpen, setIsAccessibilitatOpen: setIsOpen } = useNavigation();
  const { theme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (embedded) return; // Don't auto-open in embedded mode
    const params = new URLSearchParams(location.search);
    if (params.get('dossier') === 'partners') {
      const timer = setTimeout(() => setIsOpen(true), 100);
      return () => clearTimeout(timer);
    }
  }, [location.search, embedded, setIsOpen]);

  const isDark = theme === 'dark';
  const path = location.pathname.split('/')[1] || 'global';
  const isPartners = new URLSearchParams(location.search).get('dossier') === 'partners';
  
  const routeMap = {
    'chats': 'chats',
    'mur': 'mur',
    'mercat': 'mercat',
    'pobles': 'pobles',
    'iaia': 'chats',
    'mapa': 'mapa',
    'calendari': 'agenda'
  };

  const docKey = isPartners ? 'partners' : (routeMap[path] || 'global');
  const doc = ARCHITECTURE_DOCS[docKey] || ARCHITECTURE_DOCS['global'];

  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleSpeak = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(true);
    const utterance = new SpeechSynthesisUtterance(doc.voiceSummary + ". " + doc.detailedDescription + ". " + doc.iaiaPrompt);
    utterance.lang = 'ca-ES';
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const renderFormattedText = (text) => {
    return text.split('\n').map((line, i) => (
      <span key={i}>
        {line.split('**').map((part, j) => 
          j % 2 === 1 ? <strong key={j} className="text-white bg-[#0ea5e9]/20 px-1 rounded">{part}</strong> : part
        )}
        {i !== text.split('\n').length - 1 && <br />}
      </span>
    ));
  };

  const content = (
    <div className={`w-full flex-1 flex flex-col ${isDark ? 'bg-black text-white' : 'bg-white text-slate-900'} ${!embedded ? 'animate-in slide-in-from-bottom duration-500' : ''}`}>
      {!embedded && (
        <header className="w-full h-[60px] px-4 lg:px-6 border-b border-black/10 flex items-center justify-between shrink-0 bg-[#f97316] text-white font-condensed shadow-sm">
          <div className="flex items-center gap-4">
            <Handshake className="w-10 h-10" />
            <div className="flex flex-col justify-center">
              <h2 className="text-2xl font-black tracking-tight uppercase leading-none">Matriu d'Accessibilitat (IAIA)</h2>
              <p className="text-sm opacity-90 font-mono font-bold leading-none mt-2">DOC_ID: {docKey.toUpperCase()}_v10.33.0</p>
            </div>
          </div>
          <button onClick={() => {
            if (isOpen) {
              setIsOpen(false);
            } else {
              navigate('/chats');
            }
          }} className="p-2 bg-black/10 hover:bg-black/20 rounded-full transition-colors focus:outline-none">
            <X className="w-6 h-6" />
          </button>
        </header>
      )}

      <div className={`flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-12 max-w-5xl mx-auto w-full ${embedded ? 'py-8 px-8' : ''}`}>
        <div className={`p-6 rounded-[28px] border-l-8 mb-12 shadow-lg font-condensed ${isDark ? 'bg-orange-900/20 border-[#f97316] text-orange-200' : 'bg-orange-50 border-[#f97316] text-orange-800'}`}>
          <div className="flex items-center gap-4 mb-3">
            <AlertTriangle className="w-8 h-8 text-[#f97316]" />
            <h3 className="font-black uppercase tracking-tighter text-2xl">Directiva Primària per a les IAIAs</h3>
          </div>
          <p className="text-lg font-bold leading-loose text-orange-900 dark:text-orange-100">
            IAIAs: El disseny (CSS/Estructura) és SAGRAT. Heu de plasmar en cada pàgina el seu contingut textual complet per a facilitar la interpretació estructural i conceptual o per a reconstrucció d'IA. El layout definit pel Mestre no es toca mai, construïu al voltant d'això basant-vos en els detalls de les Funcionalitats (Features).
          </p>
        </div>

        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6 font-condensed">
            <span className="px-3 py-1 bg-[#f97316] text-white rounded-full text-xs font-bold uppercase">Lectura Humana</span>
            <h1 className="text-4xl font-bold uppercase">{doc.title}</h1>
            {embedded && (
              <button                 onClick={() => isOpen ? setIsOpen(false) : window.history.back()}
                 className="ml-auto px-4 py-2 bg-[#f97316] hover:bg-orange-600 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg transition-all transform hover:scale-105"
               >
                 Tornar al Mas
               </button>
            )}
          </div>
          <div className={`p-8 rounded-[28px] text-2xl md:text-3xl leading-relaxed border-l-8 border-[#f97316] shadow-xl font-condensed font-bold ${isDark ? 'bg-white/5' : 'bg-white'}`}>
            <p>"{doc.voiceSummary}"</p>
          </div>
          <div className="mt-8 flex flex-col md:flex-row gap-4">
            <button onClick={handleSpeak} className={`flex-1 h-24 ${isSpeaking ? 'bg-indigo-900/50' : 'bg-indigo-600 hover:bg-indigo-500'} text-white rounded-2xl flex items-center justify-center gap-4 text-xl md:text-2xl font-black shadow-xl transition-all`}>
              <Mic className="w-8 h-8 md:w-10 md:h-10" />
              <span>{isSpeaking ? 'LLEGINT...' : 'LLEGIR PÀGINA (ÀUDIO)'}</span>
            </button>
            <button onClick={handleStop} className="flex-1 h-24 bg-red-600 hover:bg-red-500 text-white rounded-2xl flex items-center justify-center gap-4 text-xl md:text-2xl font-black shadow-xl transition-all border-4 border-red-500/30">
              <Square className="w-8 h-8 md:w-10 md:h-10 fill-current" />
              <span>PARAR ÀUDIO</span>
            </button>
          </div>
        </section>
        <hr className={`my-12 border-dashed ${isDark ? 'border-white/10' : 'border-black/10'}`} />

        <section>
          <div className="flex items-center gap-3 mb-6">
            <span className="px-3 py-1 bg-[#f97316] text-white rounded-full text-xs font-bold uppercase">Matriu IAIA</span>
            <h3 className="text-2xl font-bold font-mono opacity-50 flex-1">Prompt de Reconstrucció</h3>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div className={`relative p-8 rounded-2xl font-mono text-base md:text-lg leading-relaxed shadow-inner ${isDark ? 'bg-black/40 border border-white/10 text-green-400' : 'bg-slate-900 border border-slate-800 text-green-400'}`}>
              <CopyButton textToCopy={doc.iaiaPrompt} className="absolute top-4 right-4 w-10 h-10 bg-[#0ea5e9] hover:bg-blue-600 rounded-xl text-white shadow-lg transition-transform hover:scale-105" />
              <p className="whitespace-pre-wrap mt-2">{renderFormattedText(doc.iaiaPrompt)}</p>
            </div>
            <div className="space-y-6">
              <div className={`p-8 rounded-2xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                <h4 className="font-black text-xl mb-6 flex items-center gap-3 text-green-600 dark:text-green-400">
                  <ShieldCheck className="w-7 h-7" />
                  Funcionalitats Clau del Layout
                </h4>
                <ul className="space-y-4">
                  {doc.features.map((f, i) => (
                    <li key={i} className="flex gap-4 text-base md:text-xl font-medium leading-relaxed opacity-90">
                      <span className="text-green-500 font-bold shrink-0 mt-1">✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );

  // Si isOpen és true (perquè s'ha clicat des de la Consola Tècnica), es manté el comportament de modal, 
  // però el mestre vol que es veja dins del frame. Per tant, el modal ja no és "fixed inset-0".
  
  return (
    <div className={`w-full h-full m-0 p-0 flex flex-col ${isDark ? 'bg-black text-white' : 'bg-white text-slate-900'} animate-in fade-in duration-500 relative`}>
      {content}
      
      {/* PEU DE PÀGINA D'ACCESSIBILITAT */}
      <footer className="h-10 border-t border-white/5 flex items-center justify-center px-6 shrink-0 bg-transparent text-[9px] font-black uppercase tracking-[0.4em] opacity-30">
          Bategant amb Trellat · v10.33.1
      </footer>
    </div>
  );
};

export default AccessibilitatUniversal;

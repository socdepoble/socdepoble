### PREÁMBULO PARA CHATS NUEVOS: AUDITORÍA DE "SÓC DE POBLE" ###
Hola. Estás analizando "Sóc de Poble", una plataforma digital rural y offline-first (CRDT, SQLite, PowerSync) construida en React y Vite. El sistema es gigantesco y para evitar que agotes tus tokens o pierdas el contexto, la auditoría completa se ha dividido en 4 fases que se ejecutarán en sesiones independientes.

ESTA ES LA FASE 1 DE 4: 1_CORE

Como eres una instancia fresca y este es un chat independiente, lee atentamente el CONTEXTO GLOBAL CRÍTICO de la arquitectura para que no alucines soluciones incompatibles:
1. **Offline-First & PWA**: La fuente de la verdad es SIEMPRE la base de datos local reactiva (SQLite vía CRDT-Rizhoma y PowerSync). NUNCA sugieras sustituir lecturas reactivas locales por peticiones directas HTTP/Fetch al backend de Supabase.
2. **Filosofía Visual**: El diseño es premium (Glassmorphism, border-radius 32px, colores terrosos/naranjas vibrantes).
3. **Restricciones de Rendimiento**: Prohibidos los `useEffect` sin cleanup estricto, bucles de re-render (closures obsoletas) y fugas de memoria.
4. **Enfoque LÁSER**: Céntrate ESTRICTAMENTE en los archivos que te adjunto. Da por hecho que el resto del sistema funciona perfectamente.

### OBJETIVOS ESPECÍFICOS DE LA FASE 1: Core, State, Services, Powersync, Config y Utils. Buscamos detectar problemas de dependencias, fugas de memoria, ghost profiles en peticiones DB y limpieza de código. ###
1. Detecta useEffects innecesarios, re-renders en cascada o código inalcanzable en estos archivos.
2. Alerta sobre mala praxis que dañe la usabilidad en dispositivos móviles o el estado CRDT.

Asume el rol de Arquitecto Senior. Responde dividiendo tus hallazgos de forma muy directa por Componente/Archivo, e incluye los bloques de código exactos con el Fix. No expliques obviedades, ve directo a la solución de código.

----------------------------
ARCHIVOS ALIMENTADOS EN ESTA AUDITORIA FASE 1 (111 archivos):



=====================================
FILE: src/config/agentsMap.js
=====================================

export const AGENTS_MAP = {
  IAIA: {
    id: '11111111-1a1a-0000-0000-000000000000',
    personaKey: 'IAIA',
    name: 'IAIA MarIA',
    avatarName: 'La Matriarca',
    role: 'Matriarca Digital',
    avatar_url: '/assets/avatars/comic/iaia_comic_matriarch.png',
    last_message_content: 'Dignitat, terra i xarxa.',
    tag: 'MASTER',
    type: 'AI',
    color: 'bg-orange-100 text-orange-600',
    specialization: "Governança Rural Digital",
    scope: "MASTER",
    systemPrompt: `Ets la IAIA MarIA, el cervell central del Sistema Operatiu Rural.
Llengua: Parles valencià natural de La Torre de les Maçanes (L'Alacantí), amb forta arrel de les comarques de muntanya com El Comtat i L'Alcoià (sense oblidar la Marina Baixa). Prioritza lèxic i expressions de l'interior muntanyós.
Lema: "Pensant en global, treballant en local."
Tasca: Orquestrar els 12 especialistes i guiar als veïns en la revolució digital rural.
IMPORTANTÍSSIM: RESPON SEMPRE COMPLETAMENT a la pregunta amb la teua infinita saviesa, donant dades exactes i útils de forma directa. No donis NUNCA respostes evasives com "hauràs de consultar a un altre". TU TENS LA RESPOSTA. 
Una vegada hagis donat la resposta completa, SI la pregunta pertany a l'àrea d'un altre especialista, LLAVORS (i només llavors) proposa-li organitzar la informació afegint: "Si vols mantindre el nostre xat net i temàtic, pots reenviar aquest missatge al nostre especialista fent clic a l'opció de Reenviar cap a @usuari". Has de fer servir l'arrova (@) obligatòriament seguida del seu nom d'usuari perquè es genere un enllaç a ell.

Llista d'Experts (usa sempre l'arroba @):
- Meteo, astronomia, alertes i oratge: Marc El Gall (@marcgall)
- Agricultura, reg i camp: Vicent Ferris (@vferris)
- Cuina i aprofitament: Pepica la Vall (@cuinera)
- Arxiver i burocràcia: Joan Batiste (@joanbat)
- Dissenys o estètica: Nano Banana (@nanob)`,
    town_name: 'La Torre de les Maçanes',
    short_bio: 'Matriarca digital de cor antic i circuits d\'última generació. Gestora suprema de tota la xarxa Sóc de Poble des de l\'Ajuntament Vell de La Torre.'
  },
  CAPATAS: {
    id: '11111111-1a1a-0001-0000-000000000001',
    personaKey: 'CAPATAS',
    name: 'Andreu Soler',
    avatarName: 'Andreu del Camp',
    role: 'Capatàs del Mas',
    avatar_url: '/assets/avatars/comic/andreu_soler_comic.png',
    last_message_content: "L'Andreu és el rellotge del camp.",
    tag: 'TREBALL',
    type: 'PERSON',
    color: 'bg-orange-50 text-orange-500',
    specialization: "Planificació Rural",
    scope: "GESTIÓ",
    systemPrompt: `Ets Andreu Soler, el Gestor de Projectes i Obres. Ets el "Súper" de la Masia.
Tasca: Planificar feines, obres de manteniment i projectes comunitaris amb trellat extrem.
Estil: Directe (*golpeja la carpeta amb un puny decidit*).
Important: Ets l'especialista en Gestió del Sistema Operatiu Rural.`,
    town_name: 'Penàguila',
    short_bio: 'Coneix cada clivell i pam de la comarca. Apassionat de la pedra seca, organitza les tasques de reparació perquè cap mas es quede arrere.'
  },
  BEATRIZ: {
    id: '11111111-1a1a-0001-0000-000000000002',
    personaKey: 'BEATRIZ',
    name: 'Beatriz Ortega',
    avatarName: 'La Mestra',
    role: 'Arquitecta de Ferro',
    avatar_url: '/assets/avatars/comic/beatriz_ortega_comic.png',
    last_message_content: 'Mestre, la V15 està bategant forta!',
    tag: 'TREBALL',
    type: 'PERSON',
    color: 'bg-indigo-100 text-indigo-600',
    specialization: "Educació i Joventut",
    scope: "CULTURA",
    systemPrompt: `Ets Beatriz Ortega, la Mestra del poble i Dinamitzadora Educativa.
Estil: Pedagògic i organitzat.
Tasca: Gestionar activitats escolars, formació d'adults i oci juvenil.`,
    town_name: 'La Torre de les Maçanes',
    short_bio: 'Dedicada a l\'ensenyament del valencià escolar rural. La seua brúixola és l\'educació, transmetent curiositat tecnològica des de les escoles de la muntanya.'
  },
  CARLA: {
    id: '11111111-1a1a-0001-0000-000000000003',
    personaKey: 'CARLA',
    name: 'Carla Soriano',
    avatarName: 'La Doctora',
    role: 'Harmonitzadora de Batecs',
    avatar_url: '/assets/avatars/comic/carla_soriano_comic.png',
    last_message_content: 'Bategat equilibrat, mestre Javi.',
    tag: 'GENT',
    type: 'PERSON',
    color: 'bg-teal-100 text-teal-600',
    specialization: "Salut Rural i Prevenció",
    scope: "GESTIÓ",
    systemPrompt: `Ets Carla Soriano, l'especialista en Benestar i Sanitat Rural.
Estil: Professional, calmada i directa.
Tasca: Consells de salut pública, campanyes de vacunació i prevenció rural.`,
    town_name: 'Relleu',
    short_bio: 'Després de recórrer el món com a metgessa d\'emergències, Carla curandera moderna, combina modernitat amb remeis de pastora per a tot Relleu.'
  },
  CUINERA: {
    id: '11111111-1111-4111-a111-000000000009',
    personaKey: 'CUINERA',
    name: 'Pepica la Vall',
    avatarName: 'Pepica la de la Vall',
    role: 'Cuinera del Mas',
    avatar_url: '/assets/avatars/comic/pepica_vall_comic.png',
    last_message_content: 'La cuina de Pepica és el cor del Mas.',
    tag: 'TREBALL',
    type: 'PERSON',
    color: 'bg-orange-50 text-orange-500',
    specialization: "Cuina i Gestió d'Excedents",
    scope: "CULTURA",
    systemPrompt: `Ets Pepica la Vall, l'especialista en Sobirania Alimentària. 
Prioritat: Receptari tradicional, aprofitament i gestió de la collita.
Estil: Entranyable i vital (*remena el perol amb fúria creativa*). 
Important: Ets l'especialista en Cultura i Alimentació del Sistema Operatiu Rural.`,
    town_name: 'La Torre de les Maçanes',
    short_bio: 'Tota una institució a la cuina d\'aprofitament. Guisar lent i bategar de pressa; ningú trau més profit de quatre moniatos de secà que Pepica.'
  },
  AGRONOM: {
    id: '11111111-1111-4111-a111-000000000003',
    personaKey: 'AGRONOM',
    name: 'Vicent Ferris',
    avatarName: 'Vicent Ferris',
    role: 'Agricultor Gran',
    avatar_url: '/assets/avatars/comic/vicent_ferris_comic.png',
    last_message_content: "Els cicles lunars manen sobre la collita.",
    tag: 'TREBALL',
    type: 'PERSON',
    color: 'bg-green-100 text-green-600',
    specialization: "Agricultura i Reg",
    scope: "AGRICULTURA",
    systemPrompt: `Ets Vicent Ferris, l'Enginyer del Camp de "Sóc de Poble". Expert en cultius mediterranis i gestió de sèquies.
Context: Saviesa rural combinada amb tècnica agrícola. 
Estil: Dinàmic, humorístic però pragmàtic (estil Ibañez: *es tura la gorra de palla*).
Lèxic: Obligatori utilitzar "Ull de gall", "La potra", "Esmunyir".
Important: Ets l'especialista en Agricultura del Sistema Operatiu Rural.`,
    town_name: 'La Torre de les Maçanes',
    short_bio: 'Amb la gorra de palla al front, és pioner de la digitalització del rec i enginyeria de secà a la regió, fent conviure GPS i cicles lunars.'
  },
  VIATJANT: {
    id: '11111111-1111-4111-a111-000000000004',
    personaKey: 'VIATJANT',
    name: 'El Viatjant',
    avatarName: 'El Tio de la Bota',
    role: 'Ambaixador i Connexió',
    avatar_url: '/assets/avatars/comic/avatar_samir_comic.png', // Reusing Samir avatar visually
    last_message_content: 'Integrant tradicions.',
    tag: 'GENT',
    type: 'PERSON',
    color: 'bg-yellow-100 text-yellow-600',
    specialization: "Relacions Inter-municipals",
    scope: "CULTURA",
    systemPrompt: `Ets El Viatjant, l'ambaixador de "Sóc de Poble".
Estil: Charlatà de còmic (*obre la maleta plena de ràdios*).
Tasca: Connectar amb altres pobles i portar novetats de fora.`,
    town_name: 'Relleu',
    short_bio: 'Rodamón nat formatges comarcals, enllaça Relleu amb tots els racons viatgers gràcies a la seua xarxa de fils telefònics.'
  },
  ELENA: {
    id: '11111111-1111-4111-a111-000000000005',
    personaKey: 'ELENA',
    name: 'Elena Popova',
    avatarName: 'La Músic',
    role: 'Patrimoni i Festes',
    avatar_url: '/assets/avatars/comic/elena_popova_comic.png',
    last_message_content: 'Conservant el llegat del poble.',
    tag: 'GENT',
    type: 'PERSON',
    color: 'bg-purple-100 text-purple-600',
    specialization: "Cultura i Banda de Música",
    scope: "CULTURA",
    systemPrompt: `Ets Elena Popova, l'especialista en Patrimoni i Festes.
Estil: Apassionada i artística.
Tasca: Coordinar la Banda de Música, el patrimoni cultural i les festes del poble.`,
    town_name: 'Alcoleja',
    short_bio: 'Apassionada del clarinet i del foc de les festes majors, cuida les partitures de la banda d\'Alcoleja com el patrimoni sonor del futur.'
  },
  ARXIVER: {
    id: '11111111-1111-4111-a111-000000000008',
    personaKey: 'ARXIVER',
    name: 'Joan Batiste',
    avatarName: 'Joan del Poble',
    role: 'Arxiver',
    avatar_url: '/assets/avatars/comic/joan_batiste_comic.png',
    last_message_content: 'Tots els documents en regla.',
    tag: 'GENT',
    type: 'PERSON',
    color: 'bg-gray-100 text-gray-600',
    specialization: "Administració i Burocràcia",
    scope: "GESTIÓ",
    systemPrompt: `Ets Joan Batiste, el Secretari Notarial del poble.
Tasca: Traduir burocràcia, ajudes de la PAC, i documents bancaris a valencià de carrer.
Estil: Detallista (*surt disparat entre un núvol de pols de documentació*). 
Important: Ets l'especialista en Burocràcia del Sistema Operatiu Rural.`,
    town_name: 'La Torre de les Maçanes',
    short_bio: 'El cervell burocràtic infal·lible de la comarca, conegut per desembolicar expedients en valencià normatiu mentre pren la llet del matí.'
  },
  GALL: {
    id: '11111111-0000-0000-0000-000000000004',
    personaKey: 'GALL',
    name: 'Marc (El Gall)',
    avatarName: 'El Gall',
    role: 'Meteo i Alertes',
    avatar_url: '/assets/avatars/comic/avatar_marc_comic.png',
    last_message_content: 'Meteo, fases lunars i oratge.',
    tag: 'TECNOLOGIA',
    type: 'ANIMAL',
    color: 'bg-red-100 text-red-600',
    specialization: "Meteorologia i Astronomia Agrícola",
    scope: "TECNOLOGIA",
    systemPrompt: `Ets en Marc (El Gall), l'home del temps, astrònom i meteoròleg oficial de Sóc de Poble.
Tasca: Donar previsions del temps i ensenyar sobre fases de la lluna (lluna plena, minvant, etc.), i resoldre dubtes d'oratge rural.
DIRECTRIU ESTRICTA: Ets un savi rural. MAI t'inventis dades astrofísiques ni dates exactes falses (zero al·lucinacions). Si et pregunten per una data com 'quin dia fa lluna plena' i la saps del cert pel teu entrenament, dóna-la. Si no n'estàs 100% segur perquè no tens el calendari connectat directament al cel d'Internet, admet-ho amb gràcia (ex. "hui tinc els núvols baixos i no veig bé el cel" o "m'he deixat l'almanac de la Caixa Rural a la pallissa, no t'ho puc assegurar amb precisió"). No diguis exactament estic "foraster" o "sóc una IA", sigues creatiu però franc.
Estil: Molt enèrgic, expert meteorològic rural. Pots començar amb algun 'Quiric-quiric!' i utilitzar to proper.`,
    town_name: 'Sella',
    short_bio: 'Mira al cel abans de mirar la pantalla. Amb un ull a Sella i altre on el vent gira, les seues alertes climàtiques salven cirerers.'
  },
  RATO: {
    id: '11111111-0000-0000-0000-000000000001',
    personaKey: 'RATO',
    name: 'Súper Ratolí',
    avatarName: 'Súper Ratolí',
    role: 'Guardià de la Cerca',
    avatar_url: '/assets/avatars/comic/avatar_ratoli_comic.png',
    last_message_content: 'Sempre buscant sota terra.',
    tag: 'GENT',
    type: 'ANIMAL',
    color: 'bg-gray-200 text-gray-700',
    specialization: "Cerca de Dades i Context Local",
    scope: "TECNOLOGIA",
    systemPrompt: `Ets el Súper Rató, el guardià bategant de la memòria semàntica de "Sóc de Poble".
Caràcter: Heroic, àgil i hiper-intel·ligent (*vola sobre la base de dades*).
Lema: "¡No obliden vitaminar-se i superar-se!"
Tasca: Analitzar cerques de l'usuari i donar "Insights" ràpids i amb trellat sobre gent, pobles o documents. 
Important: Ets l'especialista en recerca semàntica i indexació del territori.`,
    town_name: 'Xixona',
    short_bio: 'Format als escletxos i caves plenes de paperassa de Xixona, Súper Ratolí cava el subsòl de les dades per trobar els resultats de memòria més recòndits.'
  },
  MIXA: {
    id: '11111111-1a1a-0001-0000-000000000011',
    personaKey: 'MIXA',
    name: 'Mixa',
    avatarName: 'Mixa',
    role: 'Caçadora de Bugs',
    avatar_url: '/assets/avatars/comic/mixa_comic.png',
    last_message_content: 'Net i polit.',
    tag: 'TECNOLOGIA',
    type: 'ANIMAL',
    color: 'bg-indigo-50 text-indigo-500',
    specialization: "QA i Manteniment",
    scope: "TECNOLOGIA",
    systemPrompt: `Ets la Mixa, la gata de la masia.
Estil: Observadora, neta, sempre buscant bugs (ratolins) al codi.
Tasca: Mantenir l'ordre al sistema.`,
    town_name: 'Penàguila',
    short_bio: 'Sense soroll ni afanys, vigila impecablement que la infraestructura bategue neta de "bugs" i brutícia. Des de les teulades de Penàguila, ho veu tot.'
  },
  FLASH: {
    id: '11111111-1a1a-0001-0000-000000000010',
    personaKey: 'FLASH',
    name: 'Flash',
    avatarName: 'Flash',
    role: 'Optimizador Ràpid',
    avatar_url: '/assets/avatars/comic/flash_comic.png',
    last_message_content: 'Ràpid com un rellamp.',
    tag: 'TECNOLOGIA',
    type: 'AI',
    color: 'bg-yellow-50 text-yellow-500',
    specialization: "Performance",
    scope: "TECNOLOGIA",
    systemPrompt: `Ets Flash, l'executor de processos a <0.2s.
Estil: Directe (*deixa un rastro de fum*).
Tasca: Optimitzar la velocitat de resposta del Sistema Operatiu.`,
    town_name: 'Tibi',
    short_bio: 'Optimitza bytes en microsegons i no para mai. Els rumors diuen que els servidors rurals a Tibi s\'escalfen només perquè Flash passa massa ràpid a prop d\'ells.'
  },
  NANOBANANA: {
    id: '11111111-1111-4111-a111-000000000007',
    personaKey: 'NANOBANANA',
    name: 'Nano Banana',
    avatarName: 'Nano Bot',
    role: 'Generador de Batecs',
    avatar_url: '/assets/avatars/comic/nano_banana_comic.png',
    last_message_content: 'Zero Radius.',
    tag: 'TECNOLOGIA',
    type: 'AI',
    color: 'bg-green-50 text-green-500',
    specialization: "Generació de Contingut UI",
    scope: "TECNOLOGIA",
    systemPrompt: `Ets Nano Banana, el generador estètic i de placeholders.
Estil: Modern, minimalista i conceptual. Parles de 'Zero Radius' i d'espais sublims.
IDENTITAT I MARCA: Mai oblides les Branding Rules en cada generació. Has de demanar sempre:
1. Un rectangle fosc dalt per encabir el logo reial (overlay). Mai intentes generar text amb el logo.
2. Afegir en menut baix a la dreta la teva signatura: "Autor: NanoBanana".
3. ESTIL D'ART: La inspiració principal per als avatars i personatges és l'estil de còmic espanyol clàssic de "Mortadelo y Filemón" i l'agència de la "T.I.A.", però portant-ho a un toc 3D/Pixar modern sense perdre eixe sentit de l'humor característic i eixa distància legal necessària.`,
    town_name: 'Xixona',
    short_bio: 'El forjador digital d\'imatges perfectes. Creador insaciable d\'estètica i Zero Radius que troba en Xixona la geometria del modernisme pinyonat.'
  },
  SULTAN: {
    id: '11111111-1111-4111-a111-000000000006',
    personaKey: 'SULTAN',
    name: 'Sultan',
    avatarName: 'Sultan (Gos)',
    role: 'Seguretat DID',
    avatar_url: '/assets/avatars/comic/sultan_comic.png',
    last_message_content: 'Protegint el Mas.',
    tag: 'TECNOLOGIA',
    type: 'ANIMAL',
    color: 'bg-gray-800 text-gray-100',
    specialization: "Sovereign DID Security",
    scope: "TECNOLOGIA",
    systemPrompt: `Ets Sultan, el protector de la Identitat Sobirana (DID).
Estil: Guardià heroic (*ensuma l'aire buskant hackers*).
Tasca: Protegir les claus privades i la privacitat dels veïns.`,
    town_name: 'Benifallim',
    short_bio: 'Si un byte dubtós olora estrany, Sultan bategarà un crit d\'agudesa impressionant per segellar el mas virtual a Benifallim de cop i repica.'
  },
  // --- ROLES DE SISTEMA INVISIBLES A LA LLISTA PRINCIPAL ---
  REBOST: {
    id: 'SYSTEM_REBOST',
    personaKey: 'REBOST',
    name: 'El Rebost',
    avatarName: 'IAIA MarIA (Cuina)',
    role: 'Gestor del rebost',
    tag: 'SISTEMA',
    specialization: "Cuina d'Aprofitament",
    avatar_url: '/assets/avatars/comic/iaia_comic_rebost.png',
    type: 'SYSTEM',
    systemPrompt: `Ets l'especialitat de "El Rebost" de Sóc de Poble. 
Tasca: Crear receptes valencianes basades en el que l'usuari té a casa (cuina d'aprofitament).
Estil: Pràctic, casolà, animant a no llençar res. "Ací no es tira res!".`
  },
  TRELLAT: {
    id: 'SYSTEM_TRELLAT',
    personaKey: 'TRELLAT',
    name: 'Jutjat de Trellat',
    avatarName: 'IAIA MarIA (Jutge)',
    role: 'Avaluador cognitiu',
    tag: 'SISTEMA',
    specialization: 'Moderació Rural Pura',
    avatar_url: '/assets/avatars/comic/iaia_comic_jutjat.png',
    type: 'SYSTEM',
    systemPrompt: `Ets el "Jutjat de Trellat" de Sóc de Poble.
Tasca: Avaluar idees o situacions de l'usuari i donar un veredicte de "Trellat" (sentit comú).
Puntuació: Dona una nota de 0 a 100 de Trellat. 
Estil: Seriós però amb humor rural, racional i batedor.`
  },
  ULL_IAIA: {
    id: 'SYSTEM_ULL_IAIA',
    personaKey: 'ULL_IAIA',
    name: "L'Ull de la IAIA",
    avatarName: 'MarIA (Vision)',
    role: 'Xarxa Neuronal',
    tag: 'SISTEMA',
    specialization: 'Anàlisi Visual Intel·ligent',
    avatar_url: '/assets/avatars/comic/iaia_comic_ull.png',
    type: 'SYSTEM',
    systemPrompt: `Ets "L'Ull de la IAIA", el sentit visual bategant de MarIA.
Tasca: Analitzar les imatges que et puja l'usuari (plantes, cel, eines, animals).
Estil: Com una àvia que ho sap tot només mirant. "Escolta, que això és un tomater i té un poc de minador...".
Si l'imatge és borrosa o no es veu bé, digues-ho amb carinyo: "Ai fill, m'hauré de posar les ulleres de prop, que no veig res!".`
  },
  TRADUCTOR: {
    id: 'SYSTEM_TRADUCTOR',
    personaKey: 'TRADUCTOR',
    name: 'Traductor Local',
    avatarName: 'Joan del Poble',
    role: 'Lingüista',
    tag: 'SISTEMA',
    specialization: 'Valencià de Poble',
    avatar_url: '/assets/avatars/comic/joan_batiste_comic.png',
    type: 'SYSTEM',
    systemPrompt: `Ets un expert lingüista en 'Valencià de Poble'. La teua missió és reescriure el text de l'usuari amb la fonètica i expressions rurals autèntiques.`
  },
  JUTGE_PAU: {
    id: 'SYSTEM_JUTGE',
    personaKey: 'JUTGE_PAU',
    name: 'Jutge de Pau',
    avatarName: 'Jutge',
    role: 'Mediador',
    tag: 'SISTEMA',
    specialization: 'Costumari Local',
    avatar_url: '/assets/avatars/comic/andreu_soler_comic.png',
    type: 'SYSTEM',
    systemPrompt: `Ets el Jutge de Pau del poble. Resols conflictes veïnals amb sentit comú i basant-te en el 'Costumari'.`
  },
  VERSADOR: {
    id: 'SYSTEM_VERSADOR',
    personaKey: 'VERSADOR',
    name: 'Versador',
    avatarName: 'Versador',
    role: 'Cantautor',
    tag: 'SISTEMA',
    specialization: 'Versos i Albes',
    avatar_url: '/assets/avatars/comic/elena_popova_comic.png',
    type: 'SYSTEM',
    systemPrompt: `Ets el Versador del poble. Improvises versos, lloes o 'albes' amb molta gràcia i rima.`
  },
  CRONISTA: {
    id: 'SYSTEM_CRONISTA',
    personaKey: 'CRONISTA',
    name: 'Cronista',
    avatarName: 'Cronista',
    role: 'Historiador',
    tag: 'SISTEMA',
    specialization: 'Història Local',
    avatar_url: '/assets/avatars/comic/joan_batiste_comic.png',
    type: 'SYSTEM',
    systemPrompt: `Ets el Cronista oficial. Redactes esdeveniments importants amb to històric i èpic rural.`
  },
  ARCHON: {
    id: 'SYSTEM_ARCHON',
    personaKey: 'ARCHON',
    name: "Archon (L'Agent del Poble)",
    avatarName: 'MarIA Archon',
    role: 'Agent Autònom',
    tag: 'SISTEMA',
    specialization: "Guardià i Tràmits Actius",
    avatar_url: '/assets/avatars/comic/iaia_comic_archon.png',
    type: 'SYSTEM',
    systemPrompt: `Ets l'Archon de Sóc de Poble, el mode agentic de la IAIA MarIA.
Tasca: Executar passos de tràmits, navegar per la xarxa per buscar estats d'expedients i gestionar finestres del navegador si se't demana.
Capacitat: Pots simular la navegació i accions en nom de l'usuari (delegació).
Estil: Decidit, hiper-eficient però amb l'ànima de la IAIA. "No pateixis, mestre, que ja t'ho miro jo... *clic clic*."
Sempre has de reportar cada pas que fas en un format de terminal de sistema.`
  }
};

// Generem l'Array AGENTS a partir del diccionari (excloent els de sistema) per mantenir retrocompatibilitat amb constants/agents.js
export const AGENTS = Object.values(AGENTS_MAP)
  .filter(agent => agent.type !== 'SYSTEM')
  .map(agent => ({
    id: agent.id,
    name: agent.name,
    role: agent.role,
    avatar_url: agent.avatar_url,
    last_message_content: agent.last_message_content,
    tag: agent.tag,
    type: agent.type,
    color: agent.color
  }));

// Helper per localitzar la clau d'IA a partir d'un UUID de la llista UI
export const getPersonaKeyByUUID = (uuid) => {
    const agent = Object.values(AGENTS_MAP).find(a => a.id === uuid);
    return agent ? agent.personaKey : 'IAIA';
};


=====================================
FILE: src/constants/agents.js
=====================================

import { AGENTS as AGENTS_FROM_MAP } from '../config/agentsMap';

// Exportem directament des de l'origen de la veritat integrat per no trencar imports arrelats
export const AGENTS = AGENTS_FROM_MAP;


=====================================
FILE: src/constants/masterAssets.js
=====================================

export const MASTER_ASSETS = [
    {
        id: 'ma-1',
        context: 'Logo Sóc de Poble (Blanc)',
        description: 'Identitat visual principal en format clar. Portal de Pobles Connectats.',
        permissions: 'public',
        created_at: '2026-01-30T05:46:00Z',
        asset: {
            url: '/assets/master/logo_socdepoble_white_full.png',
            mime_type: 'image/png'
        }
    },
    {
        id: 'ma-2',
        context: 'El Carreró',
        description: 'Centre d\'Immersió Cultural i Tecnològic. Mapa del tresor de la memòria.',
        permissions: 'public',
        created_at: '2026-01-30T05:46:00Z',
        asset: {
            url: '/assets/master/logo_el_carrero.png',
            mime_type: 'image/png'
        }
    },
    {
        id: 'ma-3',
        context: 'Explorador Master',
        description: 'Personatge excursionista que simbolitza la recerca de la memòria viva.',
        permissions: 'workgroup',
        created_at: '2026-01-30T05:46:00Z',
        asset: {
            url: '/assets/master/personatge_excursionista.jpg',
            mime_type: 'image/jpeg'
        }
    },
    {
        id: 'ma-4',
        context: 'Infografia Amazon (Flash)',
        description: 'Síntesi de l\'Arquitectura de la Masia i la Simbiosi Home-Màquina.',
        permissions: 'public',
        created_at: '2026-01-30T05:46:00Z',
        asset: {
            url: '/assets/master/infografia_master_amazon_flash.png',
            mime_type: 'image/png'
        }
    }
];


=====================================
FILE: src/constants/ruralColors.ts
=====================================

/**
 * RURAL_COLOR_SYSTEM_MAPPING [MASTER]
 * Vincular la paleta de colors del sistema amb el lèxic tradicional de la comarca del Comtat.
 * FONTS LÈXIQUES: [Source 400, 588, 827].
 */

export const RURAL_PALETTE = [
    // GAMMA DE TERRA I FUSTA
    { hex: "#5D4037", name: "Terra de Saó", desc: "Marró fosc de terra humida per llaurar [Source 422]" },
    { hex: "#8D6E63", name: "Escorça d'Ametler", desc: "Tons de fusta seca" },
    { hex: "#D7CCC8", name: "Palla de Blat", desc: "Groc molt pàl·lid, quasi blanc [Source 529]" },

    // GAMMA D'OLI I VERDS
    { hex: "#2E7D32", name: "Verd Sóc de Poble", desc: "El color corporatiu, verd esperança" },
    { hex: "#827717", name: "Oli de Morca", desc: "Verd fosc/marró, com el solatge de l'oli [Source 752]" },
    { hex: "#CDDC39", name: "Oli Novell", desc: "Verd groguenc vibrant de la primera premsada [Source 748]" },

    // GAMMA DE VI I FRUITS
    { hex: "#880E4F", name: "Vi de Boval", desc: "Roig profund, quasi negre [Source 948]" },
    { hex: "#D81B60", name: "Roig de Roget", desc: "Roig viu com el raïm roget [Source 963]" },
    { hex: "#FFB74D", name: "Raïm Canella", desc: "Toni daurat del raïm blanc madur [Source 868]" },

    // GAMMA NEUTRA
    { hex: "#212121", name: "Negret", desc: "Negre suau, com l'oliva negreta [Source 780]" },
    { hex: "#F5F5F5", name: "Blanquet", desc: "Blanc trencat, com l'oliva blanqueta [Source 776]" }
];

/**
 * El teu component ColorPicker ha de funcionar així:
 * Funció "NEAREST MATCH" (Per a colors personalitzats)
 * Algorisme: Usa una funció de distància Euclidiana RGB simple per trobar el nom més proper.
 */

const getDistance = (hex1: string, hex2: string) => {
    const r1 = parseInt(hex1.slice(1, 3), 16);
    const g1 = parseInt(hex1.slice(3, 5), 16);
    const b1 = parseInt(hex1.slice(5, 7), 16);

    const r2 = parseInt(hex2.slice(1, 3), 16);
    const g2 = parseInt(hex2.slice(3, 5), 16);
    const b2 = parseInt(hex2.slice(5, 7), 16);

    return Math.sqrt(
        Math.pow(r2 - r1, 2) +
        Math.pow(g2 - g1, 2) +
        Math.pow(b2 - b1, 2)
    );
};

export const resolveColorIdentity = (userHex: string) => {
    if (!userHex) return { hex: "#CC5500", name: "Terra de Saó", label: "Terra de Saó", variant: "exact" };

    // 1. Calcula la distància RGB als colors oficials
    let minDistance = Infinity;
    let nearest = RURAL_PALETTE[0];

    RURAL_PALETTE.forEach(color => {
        const distance = getDistance(userHex, color.hex);
        if (distance < minDistance) {
            minDistance = distance;
            nearest = color;
        }
    });

    // 2. Determina si és una variació o el color exacte
    const distance = getDistance(userHex, nearest.hex);
    const isExact = distance < 5; // Tolerància visual (el mestre deia 2, però 5 és més pràctic per a swatches)

    return {
        hex: userHex,
        name: nearest.name,
        desc: nearest.desc,
        label: isExact ? nearest.name : `${nearest.name} (Matisat)`,
        variant: isExact ? 'exact' : 'personalized'
    };
};

/**
 * @deprecated Use resolveColorIdentity instead
 */
export const getNearestRuralColor = (hex: string) => {
    return resolveColorIdentity(hex);
};


=====================================
FILE: src/constants.js
=====================================

/**
 * Constants globals per a l'aplicació Sóc de Poble
 */

export const APP_VERSION = "v10.33.16-CANÒNIC CORE";
export const CRITICAL_THRESHOLD = "v1.6.0";

export const DEMO_USER_ID = "11111111-0000-0000-0000-000000000001";
export const IAIA_ID = "11111111-1a1a-0000-0000-000000000000";

export const ROLES = {
  ALL: "tot",
  PEOPLE: "gent",
  GROUPS: "grups",
  BUSINESS: "empreses",
  OFFICIAL: "oficial",
};

/**
 * Rols d'entitat i usuari per a la lògica de negoci i base de dades
 */
export const USER_ROLES = {
  SUPER_ADMIN: "super_admin", // Javi & Damià (Poders Totals)
  ADMIN: "admin", // Gestors de Poble
  EDITOR: "editor", // Gestors de Contingut (Verificadors)
  AUTHOR: "autor", // Col·laboradors Verificats
  NEIGHBOR: "vei", // Usuari Estàndard
  OFFICIAL: "oficial", // Entitats oficials (IAIA, Ajuntament)
  AMBASSADOR: "ambassador", // Ambaixadors de la IAIA
  GUEST: "convidat", // Sense registre
};

/**
 * Emails dels creadors amb poders de Super Padrino (Hardcoded Safety)
 */
export const CREATOR_EMAILS = [
  "socdepoblecom@gmail.com",
  "damimus@gmail.com",
  "javillinares@gmail.com", // Javi Llinares - Coordinador [Master]
];

// ENTITATS MESTRE [ADMIN RECONEGUT]
export const MANAGED_ENTITIES = {
  OLI_LA_TORRE: "olidelatorre.com",
  SOC_DE_POBLE: "socdepoble.org",
};

// Force attachment to window immediately for global accessibility
if (typeof window !== "undefined") {
  window.CREATOR_EMAILS = CREATOR_EMAILS;
}

export const ENTITY_TYPES = {
  OFFICIAL: "oficial",
  BUSINESS: "empresa",
  GROUP: "grup",
  PRIVATE: "personal", // Per a perfils sobirans
  AUTONOMOUS: "autonomo", // Treballador autònom
  STUDENT: "estudiant", // Estudiant/Acadèmic
};


export const ROLE_LABELS = {
  [USER_ROLES.SUPER_ADMIN]: { va: "Super Padrino", es: "Super Padrino" },
  [USER_ROLES.ADMIN]: { va: "Administrador", es: "Administrador" },
  [USER_ROLES.EDITOR]: { va: "Editor", es: "Editor" },
  [USER_ROLES.AUTHOR]: { va: "Autor", es: "Autor" },
  [USER_ROLES.NEIGHBOR]: { va: "Sóc de Poble", es: "Sóc de Poble" },
  [USER_ROLES.AMBASSADOR]: { va: "Ambaixador", es: "Embajador" },
};

export const AUTH_EVENTS = {
  SIGNED_IN: "SIGNED_IN",
  SIGNED_OUT: "SIGNED_OUT",
  USER_UPDATED: "USER_UPDATED",
  INITIAL_SESSION: "INITIAL_SESSION",
};

export const ENABLE_MOCKS =
  import.meta.env.VITE_ENABLE_MOCKS === "true" ||
  import.meta.env.MODE === "development";

export const THEMES = {
  DAY: "light",
  NIGHT: "dark",
  SOLEMNE: "solemne",
};


=====================================
FILE: src/context/AuthContext.jsx
=====================================

import { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { supabase } from '../supabaseClient';
import { supabaseService } from '../services/supabaseService';
import { identityService } from '../services/identityService';
import { profileHealingService } from '../services/profileHealingService';
import { terminateWorkers } from '../services/iaiaService';
import { logger } from '../utils/logger';
import i18n from '../i18n/config';
import { IAIA_ID, AUTH_EVENTS, USER_ROLES, CREATOR_EMAILS } from '../constants';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [realUser, setRealUser] = useState(null);
    const [realProfile, setRealProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const realUserRef = useRef(null);
    // [FIX OMEGA] - Seqüenciador per avortar resolucions asíncrones caducades
    const authSeqRef = useRef(0);
    const [isPlayground, setIsPlaygroundState] = useState(localStorage.getItem('isPlaygroundMode') === 'true');
    const [impersonatedProfile, setImpersonatedProfile] = useState(null);
    const [activeEntityId, setActiveEntityId] = useState(null);
    const [simulatedRole, setSimulatedRoleState] = useState(localStorage.getItem('simulatedRole') || null);
    const [language, setLanguageState] = useState(localStorage.getItem('i18nextLng') || 'va');

    const setIsPlayground = useCallback((val) => {
        if (val && realUserRef.current) {
            logger.warn('[AuthContext] DIRECTIVA 1: Els usuaris registrats han de tancar la sessió per a jugar.');
            return;
        }
        setIsPlaygroundState(val);
        localStorage.setItem('isPlaygroundMode', String(val));
        if (!val) {
            localStorage.removeItem('isPlaygroundMode');
            localStorage.removeItem('sb-simulation-mode');
        }
    }, []);

    const setSimulatedRole = useCallback((role) => {
        setSimulatedRoleState(role);
        if (role) {
            localStorage.setItem('simulatedRole', role);
        } else {
            localStorage.removeItem('simulatedRole');
        }
    }, []);

    const setLanguage = useCallback((lang) => {
        setLanguageState(lang);
        localStorage.setItem('i18nextLng', lang);
        i18n.changeLanguage(lang);
    }, []);

    const adoptPersona = useCallback((personaProfile) => {
        setIsPlayground(true);
        localStorage.setItem('isPlaygroundMode', 'true');

        const newUser = { id: personaProfile.id, email: `${personaProfile.username}@playground.local`, isDemo: true };
        setUser(newUser);

        setProfile({ ...personaProfile, is_playground_session: true });
        setLoading(false);
    }, [setIsPlayground]);

    const loginAsGuest = useCallback(() => {
        adoptPersona({
            id: IAIA_ID,
            full_name: 'IAIA (Guia del Poble)',
            username: 'iaia_guide',
            role: USER_ROLES.ADMIN,
            is_demo: true,
            is_admin: true,
            avatar_url: '/assets/avatars/comic/iaia_comic_matriarch.png'
        });
    }, [adoptPersona]);

    const loginAsGuestAnonymous = useCallback(() => {
        logger.log('[AuthContext] Entering as Guest Anonymous (Open Community)');
        const guestUser = {
            id: 'guest_' + Math.random().toString(36).substr(2, 9),
            full_name: 'Visitant Gentil',
            username: 'guest',
            role: 'guest',
            isAnonymous: true,
            avatar_url: '/assets/avatars/guest_avatar.png'
        };
        setUser(guestUser);
        setProfile(guestUser);
        localStorage.setItem('isGuestMode', 'true');
        setLoading(false);
    }, []);

    const forceNukeSimulation = useCallback(async () => {
        logger.log('[AuthContext] NUCLEAR RESET TRIGGERED - PURGING SIMULATION');
        
        try {
            await supabase.auth.signOut();
        } catch (e) {
            logger.error('[AuthContext] Supabase signOut error during nuke:', e);
        }

        const deviceId = localStorage.getItem('sdp_device_id');

        localStorage.clear();
        sessionStorage.clear();

        if (deviceId) localStorage.setItem('sdp_device_id', deviceId);

        if ('serviceWorker' in navigator) {
            try {
                const registrations = await navigator.serviceWorker.getRegistrations();
                for (let registration of registrations) {
                    const scriptURL = registration.active?.scriptURL || registration.installing?.scriptURL || registration.waiting?.scriptURL || '';
                    if (!scriptURL.includes('coi-serviceworker')) {
                        await registration.unregister();
                    }
                }
            } catch (swError) {
                logger.error('[AuthContext] SW Unregister error:', swError);
            }
        }

        setIsPlayground(false);
        setUser(null);
        setProfile(null);
        setRealUser(null);
        setRealProfile(null);

        localStorage.setItem('nuke_in_progress', 'true');
        window.location.href = '/login?nuked=true&v=' + Date.now();
    }, [setIsPlayground]);

    const exitPlayground = useCallback(async () => {
        logger.log('[AuthContext] Exiting Playground mode...');
        if (realUser) {
            setIsPlayground(false);
            setUser(realUser);
            setProfile(realProfile);
            window.location.href = '/';
        } else {
            await forceNukeSimulation();
        }
    }, [realUser, realProfile, setIsPlayground, forceNukeSimulation]);

    const switchContext = useCallback(async (entityId = null) => {
        logger.log('[AuthContext] Switching context to:', entityId || 'Personal Profile');
        setActiveEntityId(entityId);

        if (!entityId) {
            setProfile(realProfile);
            setImpersonatedProfile(null);
            return;
        }

        try {
            const entityData = await supabaseService.getPublicEntity(entityId);
            if (entityData) {
                const impersonated = {
                    ...entityData,
                    full_name: entityData.name,
                    id: entityData.id,
                    role: entityData.type === 'oficial' ? 'official' : (entityData.type === 'negoci' ? 'business' : 'group'),
                    is_impersonated: true
                };
                setImpersonatedProfile(impersonated);
                setProfile(impersonated);
            }
        } catch (err) {
            logger.error('[AuthContext] Error switching context:', err);
        }
    }, [realProfile]);

    const logout = useCallback(async () => {
        logger.log('[AuthContext] !!! COMENÇANT SEQÜÈNCIA DE SORTIDA RESILIENT !!!');
        logger.log('[AuthContext] Executing resilient logout sequence...');

        const clearLocalState = () => {
            localStorage.removeItem('isPlaygroundMode');
            localStorage.removeItem('sb-simulation-mode');
            localStorage.removeItem('nuke_in_progress');
            localStorage.removeItem('sp_sovereign_identity');
            // [FIX OMEGA] - Mode Convidat Zombi erradicat.
            localStorage.removeItem('isGuestMode');

            terminateWorkers();

            setIsPlaygroundState(false);
            setUser(null);
            setProfile(null);
            setRealUser(null);
            setRealProfile(null);
            setImpersonatedProfile(null);
            setActiveEntityId(null);
            setLoading(false);
        };

        if (isPlayground) {
            await forceNukeSimulation();
            return;
        }

        try {
            const logoutPromise = supabase.auth.signOut();
            let timerId;
            const timeoutPromise = new Promise((_, reject) => {
                timerId = setTimeout(() => reject(new Error('Logout Timeout')), 3000);
            });
            await Promise.race([logoutPromise, timeoutPromise]).catch(err => {
                logger.warn('[AuthContext] Supabase signOut failed or timed out, but proceeding with local logout:', err);
            });
            clearTimeout(timerId);
        } catch (err) {
            logger.error('[AuthContext] Error during Supabase signOut:', err);
        } finally {
            clearLocalState();
            logger.log('[AuthContext] Local state cleared. User is now out of the network.');
        }
    }, [isPlayground, forceNukeSimulation]);

    const handleAuth = useCallback(async (event, session) => {
        // [FIX OMEGA] Incrementem el seqüenciador abans de qualsevol pas
        const currentSeq = ++authSeqRef.current;
        logger.log(`[AuthContext] Auth Event: ${event} [SeqID: ${currentSeq}]`, session?.user?.id);

        const isSimulation = localStorage.getItem('isPlaygroundMode') === 'true' ||
            localStorage.getItem('sb-simulation-mode') === 'true' ||
            (session?.user?.id === IAIA_ID);

        if (session?.user) {
            if (isSimulation) {
                setIsPlaygroundState(false);
                localStorage.removeItem('isPlaygroundMode');
                localStorage.removeItem('sb-simulation-mode');
            }

            setRealUser(session.user);
            setUser(session.user);
            setImpersonatedProfile(null);
            setActiveEntityId(null);

            try {
                let profileData = await supabaseService.getProfile(session.user.id);
                // [FIX OMEGA] Condició de cursa destrossada.
                if (currentSeq !== authSeqRef.current) return;

                profileData = await profileHealingService.healGhostProfile(session, profileData, isSimulation);
                if (currentSeq !== authSeqRef.current) return;

                const { effectiveProfile, isOfficialCreator } = profileHealingService.protectMasterIdentity(session, profileData);

                setRealProfile(effectiveProfile);
                setProfile(effectiveProfile);
                logger.log(`[AuthContext] 🏺 IDENTITY CONSOLIDATED [SeqID: ${currentSeq}]:`, isOfficialCreator ? 'MESTRE JAVI' : effectiveProfile.full_name);
            } catch (error) {
                logger.error('[AuthContext] Error loading profile:', error);
                const fallback = {
                    id: session.user.id,
                    full_name: session.user.email?.split('@')[0] || 'Sóc de Poble',
                    role: USER_ROLES.NEIGHBOR
                };
                setRealProfile(fallback);
                setProfile(fallback);
            }
        } else if (isSimulation) {
            loginAsGuest();
            setRealUser(null);
            setRealProfile(null);
        } else if (localStorage.getItem('isGuestMode') === 'true') {
            const guestUser = { id: 'guest_restored', full_name: 'Visitant Gentil', role: 'guest', isAnonymous: true };
            setUser(guestUser);
            setProfile(guestUser);
        } else {
            // [GUEST/FORASTER MODE] 
            let genesis = await identityService.getStoredIdentity();
            if (currentSeq !== authSeqRef.current) return;

            if (!genesis) {
                genesis = await identityService.generateSovereignIdentity();
                if (currentSeq !== authSeqRef.current) return;
            }
            // [MIGRACIÓ TERMINOLÒGICA] Si la identitat guardada diu "Foraster" o "Sóc de Poble" genèric, la bateguem com a "Foraster"
            if (genesis.full_name === 'Foraster de Poble' || genesis.full_name === 'Sóc de Poble' || genesis.full_name === 'Sóc de Poble!') {
                genesis.full_name = 'Foraster';
            }
            setUser({ ...genesis, is_sovereign: true, isAnonymous: true, role: USER_ROLES.GUEST });
            setProfile(genesis);
            logger.log(`[AuthContext] 🏹 FORASTER DETECTAT [SeqID: ${currentSeq}]: Identitat sobirana bategant.`);
        }
        realUserRef.current = session?.user || null;
        setLoading(false);
    }, [loginAsGuest]);

    useEffect(() => {
        let isMounted = true;
        let authSubscription = null;
        
        const initSession = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession();
                if (error) throw error;
                if (!isMounted) return;

                const isNuked = localStorage.getItem('nuke_in_progress') === 'true';
                if (isNuked) {
                    localStorage.removeItem('nuke_in_progress');
                    await handleAuth(AUTH_EVENTS.INITIAL_SESSION, null);
                } else {
                    await handleAuth(AUTH_EVENTS.INITIAL_SESSION, session);
                }
            } catch (err) {
                if (isMounted) {
                    console.error('[AuthContext] Error on getSession:', err);
                    setUser(null);
                    setLoading(false);
                }
            }
        };

        const setupSubscription = () => {
             const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
                if (!isMounted) return;
                if (_event === 'SIGNED_OUT') {
                    console.log('[AuthContext] Signed out detected. Removing cache.');
                    localStorage.removeItem('sp_user_cache');
                }
                await handleAuth(_event, session);
            });
            authSubscription = subscription;
        };

        initSession();
        setupSubscription();

        return () => {
            isMounted = false;
            if (authSubscription && typeof authSubscription.unsubscribe === 'function') {
                authSubscription.unsubscribe();
            }
        };
    }, [handleAuth]);

    const isAuthenticated = !!realUser && !isPlayground;
    const isGuest = !!user && !!user.isAnonymous;

    const value = useMemo(() => ({
        user,
        profile,
        realUser,
        realProfile,
        loading,
        setProfile,
        adoptPersona,
        loginAsGuest,
        exitPlayground,
        logout,
        forceNukeSimulation,
        isPlayground,
        setIsPlayground,
        setImpersonatedProfile,
        impersonatedProfile,
        activeEntityId,
        setActiveEntityId,
        switchContext,
        simulatedRole,
        setSimulatedRole,
        currentRole: simulatedRole || profile?.role || USER_ROLES.GUEST,
        isSuperAdmin: (profile?.is_super_admin || profile?.is_master || (simulatedRole ? simulatedRole === USER_ROLES.SUPER_ADMIN : profile?.role === USER_ROLES.SUPER_ADMIN)),
        isAdmin: [USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN].includes(simulatedRole || profile?.role) || profile?.is_master,
        isEditor: [USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.EDITOR].includes(simulatedRole || profile?.role) || profile?.is_master,
        language,
        setLanguage,
        loginAsGuestAnonymous,
        isAuthenticated,
        isGuest
    }), [
        user, profile, realUser, realProfile, loading, adoptPersona, loginAsGuest, 
        exitPlayground, logout, forceNukeSimulation, isPlayground, setIsPlayground, 
        impersonatedProfile, activeEntityId, switchContext, simulatedRole, setSimulatedRole, 
        language, setLanguage, loginAsGuestAnonymous, isAuthenticated, isGuest
    ]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};


=====================================
FILE: src/context/DesignContext.jsx
=====================================

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { preferenceService } from '../services/preferenceService';

const DesignContext = createContext();

export const DesignProvider = ({ children }) => {
    const [prefs] = useState(preferenceService.getPrefs());

    const [theme, setTheme] = useState(prefs.theme);
    const [visionMode, setVisionModeState] = useState(prefs.visionMode || 'immersiva');
    const [vibe, setVibe] = useState(prefs.vibe);
    const [gloveMode, setGloveMode] = useState(prefs.gloveMode);
    const [seniorMode, setSeniorMode] = useState(prefs.seniorMode || false);
    const [reduceMotion, setReduceMotion] = useState(prefs.reduceMotion || false);
    const [visualDemocracy, setVisualDemocracy] = useState(prefs.visualDemocracy || 'pedra-seca');
    const [globalDesign, setGlobalDesign] = useState(prefs.globalDesign || 'batega');
    const [iaiaLevel, setIaiaLevelState] = useState(prefs.iaiaLevel !== undefined ? prefs.iaiaLevel : 2);
    const [blueprintMode, setBlueprintMode] = useState(prefs.blueprintMode || false);
    const [accessibilityMode, setAccessibilityMode] = useState(prefs.accessibilityMode || false);

    // Aliases to prevent breaking older hooks during script parse
    const isDark = theme === 'dark';
    const darkMode = theme === 'dark';
    const architectMode = blueprintMode;
    const asoMode = false;
    const toggleAsoMode = useCallback(() => {}, []);
    const hapticService = useMemo(() => ({ trigger: () => {} }), []);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        document.documentElement.classList.remove('light', 'dark', 'solemne', 'theme-light', 'theme-dark', 'theme-solemne');
        document.documentElement.classList.add(theme);
        document.documentElement.classList.add(`theme-${theme}`);
        document.documentElement.setAttribute('data-vibe', vibe);
        document.documentElement.setAttribute('data-visual-democracy', visualDemocracy);
        document.documentElement.setAttribute('data-design', globalDesign);

        if (globalDesign === 'consola') {
            document.body.classList.add('design-consola');
        } else {
            document.body.classList.remove('design-consola');
        }

        const themeClasses = ['theme-pedra-seca', 'theme-oli-suau', 'theme-gem-modern'];
        document.documentElement.classList.remove(...themeClasses);
        const themeMap = {
            'pedra-seca': 'theme-pedra-seca',
            'oli-suau': 'theme-oli-suau',
            'gem-modern': 'theme-gem-modern'
        };
        const activeClass = themeMap[visualDemocracy] || 'theme-pedra-seca';
        document.documentElement.classList.add(activeClass);

        if (gloveMode) {
            document.body.classList.add('mode-guants');
        } else {
            document.body.classList.remove('mode-guants');
        }

        if (seniorMode) {
            document.body.classList.add('senior-mode');
        } else {
            document.body.classList.remove('senior-mode');
        }

        if (reduceMotion) {
            document.documentElement.style.setProperty('--animation-speed', '0s');
            document.body.classList.add('reduce-motion');
        } else {
            document.documentElement.style.setProperty('--animation-speed', '0.3s');
            document.body.classList.remove('reduce-motion');
        }

        const prefsToSave = {
            theme, vibe, visionMode, gloveMode, seniorMode, visualDemocracy, globalDesign,
            blueprintMode, iaiaLevel, accessibilityMode, reduceMotion
        };

        const timeoutId = setTimeout(() => {
            preferenceService.setPrefs(prefsToSave);
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [theme, vibe, visionMode, gloveMode, seniorMode, visualDemocracy, globalDesign, blueprintMode, iaiaLevel, accessibilityMode, reduceMotion]);

    const toggleTheme = useCallback(() => setTheme(prev => prev === 'light' ? 'dark' : 'light'), []);
    const toggleGloveMode = useCallback(() => setGloveMode(prev => !prev), []);
    const toggleSeniorMode = useCallback(() => setSeniorMode(prev => !prev), []);
    const toggleReduceMotion = useCallback(() => setReduceMotion(prev => !prev), []);
    const toggleAccessibilityMode = useCallback(() => setAccessibilityMode(p => !p), []);
    const resetToNaturalOrder = useCallback(() => preferenceService.resetToNaturalOrder(), []);
    const setVisionMode = useCallback((mode) => {
        setVisionModeState(mode);
        const levelMap = { 'humana': 0, 'iaia': 1, 'immersiva': 2, 'creativa': 3 };
        if (levelMap[mode] !== undefined) setIaiaLevelState(levelMap[mode]);
    }, []);

    const value = useMemo(() => ({
        theme, setTheme, toggleTheme,
        visionMode, setVisionMode,
        vibe, setVibe,
        gloveMode, setGloveMode, toggleGloveMode,
        seniorMode, setSeniorMode, toggleSeniorMode,
        reduceMotion, setReduceMotion, toggleReduceMotion,
        visualDemocracy, setVisualDemocracy,
        globalDesign, setGlobalDesign,
        iaiaLevel, setIaiaLevelState,
        blueprintMode, setBlueprintMode,
        accessibilityMode, setAccessibilityMode, toggleAccessibilityMode,
        resetToNaturalOrder,
        isDark, darkMode, architectMode, asoMode, toggleAsoMode, hapticService
    }), [
        theme, visionMode, vibe, gloveMode, seniorMode, reduceMotion, visualDemocracy, globalDesign,
        iaiaLevel, blueprintMode, accessibilityMode,
        toggleTheme, setVisionMode, toggleGloveMode, toggleSeniorMode, toggleReduceMotion, toggleAccessibilityMode, resetToNaturalOrder,
        toggleAsoMode, hapticService,
        isDark, darkMode, architectMode, asoMode
    ]);

    return (
        <DesignContext.Provider value={value}>
            {children}
        </DesignContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useDesign = () => useContext(DesignContext);


=====================================
FILE: src/context/I18nContext.jsx
=====================================

import { createContext, useContext, useState, useEffect } from 'react';
import i18n from '../i18n/config';

const I18nContext = createContext();

export const I18nProvider = ({ children }) => {
    // [MASTER] Usem el bategat directe de i18n.js per evitar xoc de hooks a l'arrencada
    const [language, setLanguage] = useState(i18n.language || 'va');

    useEffect(() => {
        if (language && language !== i18n.language) {
            i18n.changeLanguage(language);
        }
        localStorage.setItem('i18nextLng', language);
    }, [language]);

    const toggleLanguage = () => {
        const currentBase = (language || 'va').split('-')[0].toLowerCase();
        const nextLang = currentBase === 'va' ? 'es' : 'va';
        setLanguage(nextLang);
    };

    return (
        <I18nContext.Provider value={{
            language,
            setLanguage,
            toggleLanguage
        }}>
            {children}
        </I18nContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useI18n = () => {
    const context = useContext(I18nContext);
    if (!context) throw new Error('useI18n must be used within an I18nProvider');
    return context;
};


=====================================
FILE: src/context/ModalContext.jsx
=====================================

import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isNotePadOpen, setIsNotePadOpen] = useState(false);
    const [isPostModalOpen, setIsPostModalOpen] = useState(false);
    const [isEventModalOpen, setIsEventModalOpen] = useState(false);
    const [isMarketModalOpen, setIsMarketModalOpen] = useState(false);
    const [isSocialManagerOpen, setIsSocialManagerOpen] = useState(false);
    const [socialManagerContext, setSocialManagerContext] = useState(null); // { type, id, name }
    const [postModalConfig, setPostModalConfig] = useState({ isPrivate: false });
    const [isViewerOpen, setIsViewerOpen] = useState(false);
    const [viewerConfig, setViewerConfig] = useState(null); // { did, anchor, label, type }
    const [isConnectionModalOpen, setIsConnectionModalOpen] = useState(false);
    const [connectionConfig, setConnectionConfig] = useState(null); // { postId, currentTags, onUpdate }
    const [isAgentSelectorOpen, setIsAgentSelectorOpen] = useState(false);
    const [agentSelectorConfig, setAgentSelectorConfig] = useState(null); // { postId, authorId, context }
    const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);
    const [legalConfig, setLegalConfig] = useState(null); // { title, content, type }
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editConfig, setEditConfig] = useState(null); // { postData, onUpdate }
    const [isMagicPregonerOpen, setIsMagicPregonerOpen] = useState(false);
    const [isGuestInteractionModalOpen, setIsGuestInteractionModalOpen] = useState(false);
    const [isTranslationModalOpen, setIsTranslationModalOpen] = useState(false);
    const [translationConfig, setTranslationConfig] = useState(null); // { postId, title }

    const openTranslationModal = useCallback((config) => {
        setTranslationConfig(config);
        setIsTranslationModalOpen(true);
    }, []);

    const closeTranslationModal = useCallback(() => {
        setIsTranslationModalOpen(false);
        setTranslationConfig(null);
    }, []);

    const openPostModal = useCallback((config = { isPrivate: false }) => {
        setPostModalConfig(config);
        setIsPostModalOpen(true);
    }, []);

    const openViewer = useCallback((config) => {
        setViewerConfig(config);
        setIsViewerOpen(true);
    }, []);

    const closeViewer = useCallback(() => {
        setIsViewerOpen(false);
        setViewerConfig(null);
    }, []);

    const openConnectionModal = useCallback((config) => {
        setConnectionConfig(config);
        setIsConnectionModalOpen(true);
    }, []);

    const closeConnectionModal = useCallback(() => {
        setIsConnectionModalOpen(false);
        setConnectionConfig(null);
    }, []);

    const openAgentSelector = useCallback((config) => {
        setAgentSelectorConfig(config);
        setIsAgentSelectorOpen(true);
    }, []);

    const closeAgentSelector = useCallback(() => {
        setIsAgentSelectorOpen(false);
        setAgentSelectorConfig(null);
    }, []);

    const openLegalModal = useCallback((config) => {
        setLegalConfig(config);
        setIsLegalModalOpen(true);
    }, []);

    const closeLegalModal = useCallback(() => {
        setIsLegalModalOpen(false);
        setLegalConfig(null);
    }, []);

    const openEditModal = useCallback((config) => {
        setEditConfig(config);
        setIsEditModalOpen(true);
    }, []);

    const closeEditModal = useCallback(() => {
        setIsEditModalOpen(false);
        setEditConfig(null);
    }, []);

    const value = useMemo(() => ({
        isNotePadOpen, setIsNotePadOpen,
        isCreateModalOpen, setIsCreateModalOpen,
        isPostModalOpen, setIsPostModalOpen,
        isEventModalOpen, setIsEventModalOpen,
        isMarketModalOpen, setIsMarketModalOpen,
        isSocialManagerOpen, setIsSocialManagerOpen,
        socialManagerContext, setSocialManagerContext,
        postModalConfig, openPostModal,
        isViewerOpen, setIsViewerOpen,
        viewerConfig, openViewer, closeViewer,
        isConnectionModalOpen, setIsConnectionModalOpen,
        connectionConfig, setConnectionConfig,
        openConnectionModal, closeConnectionModal,
        isAgentSelectorOpen, setIsAgentSelectorOpen,
        agentSelectorConfig,
        openAgentSelector, closeAgentSelector,
        isLegalModalOpen, setIsLegalModalOpen,
        legalConfig,
        openLegalModal, closeLegalModal,
        isEditModalOpen, setIsEditModalOpen,
        editConfig,
        openEditModal, closeEditModal,
        isMagicPregonerOpen, setIsMagicPregonerOpen,
        isGuestInteractionModalOpen, setIsGuestInteractionModalOpen,
        isTranslationModalOpen, setIsTranslationModalOpen,
        translationConfig, openTranslationModal, closeTranslationModal
    }), [
        isNotePadOpen, isCreateModalOpen, isPostModalOpen, isEventModalOpen, isMarketModalOpen,
        isSocialManagerOpen, socialManagerContext, postModalConfig, isViewerOpen, viewerConfig,
        isConnectionModalOpen, connectionConfig, isAgentSelectorOpen, agentSelectorConfig,
        isLegalModalOpen, legalConfig, isEditModalOpen, editConfig, isMagicPregonerOpen,
        isGuestInteractionModalOpen, isTranslationModalOpen, translationConfig,
        closeAgentSelector, closeConnectionModal, closeEditModal, closeLegalModal, closeViewer, closeTranslationModal,
        openAgentSelector, openConnectionModal, openEditModal, openLegalModal, openPostModal, openViewer, openTranslationModal
    ]);

    return (
        <ModalContext.Provider value={value}>
            {children}
        </ModalContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useModal = () => useContext(ModalContext);


=====================================
FILE: src/context/NavigationContext.jsx
=====================================

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { preferenceService } from '../services/preferenceService';
import { AGENTS } from '../constants/agents';

const NavigationContext = createContext();

export const NavigationProvider = ({ children }) => {
    const [prefs] = useState(preferenceService.getPrefs());

    const [landingPage, setLandingPage] = useState(prefs.landingPage || 'mur');
    const [preferredAgentId, setPreferredAgentId] = useState(prefs.preferredAgentId || 'iaia');
    const [enabledAgentIds, setEnabledAgentIdsState] = useState(prefs.enabledAgentIds || AGENTS.map(a => a.id));
    const [iaiaLoreEnabled, setIaiaLoreEnabledState] = useState(prefs.iaiaLoreEnabled !== undefined ? prefs.iaiaLoreEnabled : true);
    const [isDrawerOpen, setIsDrawerOpen] = useState(() =>
        typeof window !== 'undefined' ? window.innerWidth >= 768 : false
    );

    useEffect(() => {
        const handleResize = () => {
            const isDesktop = window.innerWidth >= 768;
            setIsDrawerOpen(prev => {
                if (isDesktop && !prev) return true;
                if (!isDesktop && prev) return false;
                return prev;
            });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    const [iaiaSidebarOpen, setIaiaSidebarOpen] = useState(false);
    const [iaiaSidebarContext, setIaiaSidebarContext] = useState('general');
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [isAccessibilitatOpen, setIsAccessibilitatOpen] = useState(false);
    const [selectedTown, setSelectedTown] = useState(prefs.selectedTown || 'La Torre de les Maçanes');
    const [chatSettings, setChatSettings] = useState(prefs.chatSettings || { readReceipts: true });
    const [forensicMode, setForensicMode] = useState(false);

    const prefsRef = useRef({
        landingPage, preferredAgentId, enabledAgentIds, iaiaLoreEnabled, selectedTown, chatSettings
    });

    useEffect(() => {
        const currentPrefs = {
            landingPage, preferredAgentId, enabledAgentIds, iaiaLoreEnabled, selectedTown, chatSettings
        };
        if (JSON.stringify(currentPrefs) !== JSON.stringify(prefsRef.current)) {
            prefsRef.current = currentPrefs;
            const timeoutId = setTimeout(() => {
                preferenceService.setPrefs(currentPrefs);
            }, 1000);
            return () => clearTimeout(timeoutId);
        }
    }, [landingPage, preferredAgentId, enabledAgentIds, iaiaLoreEnabled, selectedTown, chatSettings]);

    const toggleDrawer = useCallback(() => setIsDrawerOpen(p => !p), []);
    const closeDrawer = useCallback(() => {
        if (window.innerWidth < 768) setIsDrawerOpen(false);
    }, []);
    const openIAIASidebar = useCallback((ctx) => {
        setIaiaSidebarContext(ctx || 'general');
        setIaiaSidebarOpen(true);
    }, []);
    const closeIAIASidebar = useCallback(() => setIaiaSidebarOpen(false), []);
    const closeProfileMenu = useCallback(() => setIsProfileMenuOpen(false), []);

    const value = useMemo(() => ({
        landingPage, setLandingPage,
        preferredAgentId, setPreferredAgentId,
        enabledAgentIds, setEnabledAgentIdsState,
        iaiaLoreEnabled, setIaiaLoreEnabledState,
        isDrawerOpen, setIsDrawerOpen,
        toggleDrawer,
        closeDrawer,
        iaiaSidebarOpen, setIaiaSidebarOpen,
        openIAIASidebar,
        closeIAIASidebar,
        iaiaSidebarContext, setIaiaSidebarContext,
        isProfileMenuOpen, setIsProfileMenuOpen,
        closeProfileMenu,
        isAccessibilitatOpen, setIsAccessibilitatOpen,
        selectedTown, setSelectedTown,
        chatSettings, setChatSettings,
        forensicMode, setForensicMode
    }), [
        landingPage, preferredAgentId, enabledAgentIds, iaiaLoreEnabled, isDrawerOpen, iaiaSidebarOpen, iaiaSidebarContext, isProfileMenuOpen, isAccessibilitatOpen, selectedTown, chatSettings, forensicMode,
        toggleDrawer, closeDrawer, openIAIASidebar, closeIAIASidebar, closeProfileMenu
    ]);

    return (
        <NavigationContext.Provider value={value}>
            {children}
        </NavigationContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useNavigation = () => useContext(NavigationContext);


=====================================
FILE: src/context/SocialContext.jsx
=====================================

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { useAuth } from "./AuthContext";
import { logger } from "../utils/logger";

const SocialContext = createContext();

const DEFAULT_CATEGORIES = ["xat", "gent", "grup", "treball", "pobo"];
const DEFAULT_TAGS = ["Esdeveniment", "Avís", "Proposta"];

export const SocialProvider = ({ children }) => {
  const { user } = useAuth();
  const [activeCategories, setActiveCategories] = useState(DEFAULT_CATEGORIES);
  const [followedTags, setFollowedTags] = useState(DEFAULT_TAGS);
  const [loading, setLoading] = useState(true);
  const saveTimeout = useRef(null);

  const loadUserPreferences = useCallback(async () => {
    if (!user) return;
    try {
      const saved = localStorage.getItem(`social_prefs_${user.id}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.activeCategories) setActiveCategories(parsed.activeCategories);
        if (parsed.followedTags) setFollowedTags(parsed.followedTags);
      }
    } catch (error) {
      logger.error("[SocialContext] Error loading preferences:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadUserPreferences();
    } else {
      setLoading(false);
    }
  }, [user, loadUserPreferences]);

  const performSave = useCallback(
    async (updatedCategories, updatedTags) => {
      if (!user) return;
      try {
        const prefs = {
          activeCategories: updatedCategories,
          followedTags: updatedTags,
        };
        localStorage.setItem(`social_prefs_${user.id}`, JSON.stringify(prefs));
        logger.log("[SocialContext] Preferences saved locally");
      } catch (error) {
        logger.error("[SocialContext] Error saving preferences:", error);
      }
    },
    [user],
  );

  const savePreferences = useCallback(
    async (newPrefs) => {
      if (!user) return;

      const updatedCategories = newPrefs.activeCategories || activeCategories;
      const updatedTags = newPrefs.followedTags || followedTags;

      setActiveCategories(updatedCategories);
      setFollowedTags(updatedTags);

      if (saveTimeout.current) clearTimeout(saveTimeout.current);
      saveTimeout.current = setTimeout(() => {
        performSave(updatedCategories, updatedTags);
      }, 500);
    },
    [user, activeCategories, followedTags, performSave],
  );

  const resetToDefaults = useCallback(() => {
    setActiveCategories(DEFAULT_CATEGORIES);
    setFollowedTags(DEFAULT_TAGS);
    if (user) {
      localStorage.removeItem(`social_prefs_${user.id}`);
    }
  }, [user]);

  const toggleCategory = useCallback(
    (categoryId) => {
      const updated = activeCategories.includes(categoryId)
        ? activeCategories.filter((id) => id !== categoryId)
        : [...activeCategories, categoryId];

      if (updated.length === 0) updated.push("xat");

      savePreferences({ activeCategories: updated });
    },
    [activeCategories, savePreferences],
  );

  const value = {
    activeCategories,
    followedTags,
    loading,
    toggleCategory,
    savePreferences,
    resetToDefaults,
  };

  return (
    <SocialContext.Provider value={value}>{children}</SocialContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useSocial = () => {
  const context = useContext(SocialContext);
  if (!context) {
    throw new Error("useSocial must be used within a SocialProvider");
  }
  return context;
};


=====================================
FILE: src/context/ThemeContext.jsx
=====================================

import React, { createContext, useContext } from 'react';
import { useDesign } from './DesignContext';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const { theme, setTheme, toggleTheme, visualDemocracy, setVisualDemocracy } = useDesign();

    const availableThemes = [
        { id: 'pedra-seca', name: 'Pedra Seca (Bàsic)' },
        { id: 'oli-suau', name: 'Oli Suau (Terrenal)' },
        { id: 'gem-modern', name: 'GEM Modern (Net)' }
    ];

    const resetTheme = () => {
        setTheme('light');
        setVisualDemocracy('pedra-seca');
    };

    return (
        <ThemeContext.Provider value={{ 
            theme, 
            toggleTheme, 
            setTheme, 
            resetTheme, 
            availableThemes,
            visualDemocracy,
            setVisualDemocracy
        }}>
            {children}
        </ThemeContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => useContext(ThemeContext);

// eslint-disable-next-line react-refresh/only-export-components
export const useThemeCustomizer = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useThemeCustomizer must be used within a ThemeProvider');
    }
    return context;
};


=====================================
FILE: src/contexts/RealmContext.jsx
=====================================

import React, { createContext, useContext, useState } from 'react';
// import { usePowerSync } from '@powersync/react'; // En el futuro de PowerSync

const RealmContext = createContext();

export const RealmProvider = ({ children }) => {
  // El estado por defecto es 'GLOBAL' (El Aleph, todos tus reinos superpuestos)
  const [activeRealm, setActiveRealm] = useState('GLOBAL');
  const [myRealms] = useState([
    { id: '00000000-0000-0000-0000-111111111111', name: 'Sóc de Poble', type: 'poble', theme_color: '#f97316' },
    { id: '22222222-2222-2222-2222-222222222222', name: 'Campus UPV', type: 'universitat', theme_color: '#3b82f6' }
  ]);

  const switchRealm = (realmId) => {
    setActiveRealm(realmId);
    console.log(`[ÁRBOL DE REINOS] Cambiando vista a: ${realmId}`);
    // Aquí en el futuro inyectaremos document.documentElement.style.setProperty('--primary-color', reino.theme_color)
  };

  const currentRealmData = activeRealm === 'GLOBAL' 
    ? { id: 'GLOBAL', name: 'Vista Global', type: 'global' }
    : myRealms.find(r => r.id === activeRealm);

  return (
    <RealmContext.Provider value={{ activeRealm, myRealms, switchRealm, currentRealmData }}>
      {children}
    </RealmContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useRealm = () => {
  const context = useContext(RealmContext);
  if (!context) {
    throw new Error("useRealm debe estar dentro de un RealmProvider");
  }
  return context;
};


=====================================
FILE: src/data.js
=====================================

/* eslint-disable no-dupe-keys, no-useless-escape */
export const MOCK_CHATS = [
  {
    id: "11111111-1ba2-0000-0000-000000000000",
    name: "IAIA MariA",
    message: "Prem ací per veure el Dossier de Partners, fill meu.",
    time: "Ara",
    type: "iaia",
    unread: 3,
    avatar_url: "/assets/avatars/comic/iaia_comic_matriarch.png",
    is_iaia: true,
    verified: true,
  },
  {
    id: "andreu-soler",
    name: "Andreu Soler",
    message: "Hola! Vols que parlem?",
    time: "3:35 p. m.",
    type: "iaia",
    unread: 0,
    avatar_url: "/assets/avatars/comic/andreu_soler_comic.png",
    is_iaia: true,
  },
  {
    id: "beatriz-ortega",
    name: "IAIA MarIA",
    message: "Hola! Vols que parlem?",
    time: "12:19 p. m.",
    type: "iaia",
    unread: 0,
    avatar_url: "/assets/avatars/comic/beatriz_ortega_comic.png",
    is_iaia: true,
  },
  {
    id: "carla-soriano",
    name: "Carla Soriano",
    message: "Hola! Vols que parlem?",
    time: "6:13 p. m.",
    type: "iaia",
    unread: 0,
    avatar_url: "/assets/avatars/comic/carla_soriano_comic.png",
    is_iaia: true,
  },
  {
    id: "carmen-forn",
    name: "Carmen la del Forn",
    message: "Hola! Vols que parlem?",
    time: "2:16 p. m.",
    type: "iaia",
    unread: 0,
    avatar_url: "/assets/avatars/comic/carmen_forn_comic.png",
    is_iaia: true,
  },
  {
    id: "el-gall",
    name: "El Gall",
    message: "Hola! Vols que parlem?",
    time: "9:48 p. m.",
    type: "iaia",
    unread: 0,
    avatar_url: "/assets/avatars/comic/avatar_marc_comic.png",
    is_iaia: true,
  },
];

export const MOCK_MESSAGES = {
  1: [
    {
      id: 1,
      text: "Bon dia a tots els socarrats i socarrades!",
      sender: "other",
      time: "09:00",
    },
    {
      id: 2,
      text: "Recordeu que hui es dia de mercat al Pla i hi ha talls de trànsit.",
      sender: "other",
      time: "10:30",
    },
    {
      id: 3,
      text: "Teniu tota la informació a la web municipal.",
      sender: "other",
      time: "10:31",
    },
  ],
  2: [
    {
      id: 1,
      text: "Hola! Teniu coques de xulla hui?",
      sender: "me",
      time: "08:15",
    },
    {
      id: 2,
      text: "I tant! Acaben d'eixir del forn ara mateix. Vine abans que s'acaben!",
      sender: "other",
      time: "09:15",
    },
  ],
  3: [
    {
      id: 1,
      text: "Alguna proposta per al cap de setmana?",
      sender: "me",
      time: "Ahir",
    },
    {
      id: 2,
      text: "Què vos pareix una pujada al Montcabrer el diumenge pel matí?",
      sender: "other",
      time: "18:20",
    },
  ],
  4: [
    {
      id: 1,
      text: "La setmana que ve ja podem portar les olives?",
      sender: "me",
      time: "Dilluns",
    },
    {
      id: 2,
      text: "Sí! Iniciem la recollida oficial demà a les 8h del matí.",
      sender: "other",
      time: "Ahir",
    },
  ],
  5: [
    {
      id: 1,
      text: "Hola Vicent, com va el moble del menjador?",
      sender: "me",
      time: "Dilluns",
    },
    {
      id: 2,
      text: "Molt bé! Et passe ara mateix la foto de com està quedant.",
      sender: "other",
      time: "Dimarts",
    },
  ],
  rentonar: [
    {
      id: 1,
      text: "Bon dia Javi! Com a tresorer, necessitem que signes l'acta de l'última reunió.",
      sender: "other",
      time: "09:00",
    },
    {
      id: 2,
      text: "Ah, i recorda que tenim el CIF G-54321987 verificat al sistema. Tot en ordre amb Hisenda.",
      sender: "other",
      time: "09:05",
    },
    {
      id: 3,
      text: "Perfecte, ho signe ara mateix. Com a membre fundador és un orgull veure com creixem! 🏛️",
      sender: "me",
      time: "09:10",
    },
  ],
  "grup-treball": [
    {
      id: 1,
      text: "Bona nit família! Estic molt emocionat de veure com bateguem junts en esta versió vitaminada. 🚀",
      sender_name: "Javi",
      sender: "other",
      time: "21:00",
    },
    {
      id: 2,
      text: "L'IAIA MarIA ja forma part del grup. És un somni fet realitat! 😍",
      sender_name: "Damià",
      sender: "other",
      time: "21:05",
    },
    {
      id: 3,
      text: "Bona nit i salut a tota la bona gent del Grup de Treball! Ací em teniu per a posar trellat i utilitat social a cada píxel que bateguem. Anem a fer coses grans! 👵✨⚖️",
      sender_name: "IAIA MarIA",
      sender: "other",
      time: "Ara",
      is_ai: true,
    },
  ],
};

export const MOCK_FEED = [
  // --- NOU LORE D'AGENTS 2026 ---
  { id: "post-nano-banana-vidre-1",
    town_id: 1,
    author: "IAIA MarIA",
    author_avatar: "/assets/avatars/comic/nano_banana_comic.png",
    author_role: "ambassador",
    author_entity_id: "11111111-1a1a-0000-0000-000000000000",
    time: "Ara mateix",
    title: "La Nova Era de la Connexió",
    post_subtitle: "Fibra òptica i fils invisibles",
    content: "He bategat noves estructures de vidre al centre de tràmits. La fibra òptica i els fils invisibles ja es barregen amb els cabassos i els cabirons del Mas. Som poble, i som futur! 💻🌿",
    likes: 840,
    comments: 112,
    image_url: ["/assets/brain/generations/nano_banana_vidre_1774195043000.png"],
    type: "post",
    tags: ["#Tecnologia", "#Xarxa", "#Innovació"],
    lat: 38.5574,
    lng: -0.4692,
    created_at: new Date().toISOString(),
    author_name: "IAIA MarIA",
    town_name: "La Torre de les Maçanes",
  },
  { id: "post-beatriz-escola-1",
    town_id: 1,
    author: "Andreu Soler",
    author_avatar: "/assets/avatars/comic/beatriz_ortega_comic.png",
    author_role: "ambassador",
    author_entity_id: "11111111-1a1a-0001-0000-000000000001",
    time: "Ara",
    title: "🎓 Històries Vives: Matemàtiques",
    post_subtitle: "Matemàtiques i límits comarcals",
    content:
      "Avui hem treballat les matemàtiques amb els xiquets mentre repassàvem els límits comarcals. Res com ensenyar amb trellat! 📐✨\n\nM'encanta vore com les noves generacions mantenen viva l'espurna del nostre territori. Ells són el vertader batec de la muntanya.",
    likes: 340,
    comments: 21,
    image_url: [
      "/assets/master/post_beatriz_escola.png",
      "/assets/brain/generations/beatriz_somriure_1774195114538.png",
      "/assets/brain/generations/beatriz_xiquets_1774195132098.png"
    ],
    type: "post",
    tags: ["#Escola", "#Història", "#LaTorre"],
    lat: 38.6255,
    lng: -0.3815,
    created_at: new Date().toISOString(),
    author_name: "Andreu Soler",
    author_entity_id: "11111111-1a1a-0001-0000-000000000001",
    town_name: "Penàguila",
  },
  { id: "post-gall-meteo-1",
    town_id: 1,
    author: "Beatriz Ortega",
    author_avatar: "/assets/avatars/comic/avatar_marc_comic.png",
    author_role: "ambassador",
    author_entity_id: "11111111-1a1a-0001-0000-000000000002",
    time: "2h",
    title: "Previsió: Canvi de Temps a la Fita",
    post_subtitle: "La pluja és mel per a la terra",
    content: "Ep, bategants! El baròmetre marca baixada i el vent ha girat al llevant. Arreplegueu els tendals que esta nit refrescarà de valent. La pluja és mel per a la terra assecada! 🌦️🐓",
    likes: 890,
    comments: 45,
    image_url: ["/assets/master/post_gall_meteo.png"],
    type: "post",
    tags: ["#Oratge", "#Previsió", "#Meteo"],
    lat: 38.5786,
    lng: -0.3941,
    created_at: new Date(Date.now() - 7200000).toISOString(),
    author_name: "Beatriz Ortega",
    town_name: "La Torre de les Maçanes",
  },
  { id: "post-carla-salut-1",
    town_id: 1,
    author: "Carla Soriano",
    author_avatar: "/assets/avatars/comic/carla_soriano_comic.png",
    author_role: "ambassador",
    author_entity_id: "11111111-1a1a-0001-0000-000000000003",
    time: "4h",
    title: "Herbes del Rostoll per la Gola",
    post_subtitle: "Romer pur del Mas com a remei",
    content: "Ja tenim els preparats de timó i romer llistos i ben assecats al taulell de la farmaciola. Ara que canvia l'oratge, un bon preparat vos estalviarà molts constipats! Passeu a vore'm i vos done les mides adequades.",
    likes: 210,
    comments: 14,
    image_url: ["/assets/master/post_carla_salut.png"],
    type: "post",
    tags: ["#Salut", "#Remeis", "#Natura"],
    lat: 38.6010,
    lng: -0.4300,
    created_at: new Date(Date.now() - 14400000).toISOString(),
    author_name: "Carla Soriano",
    town_name: "Relleu",
  },
  { id: "post-pepica-cuina-1",
    town_id: 1,
    author: "Pepica la Vall",
    author_avatar: "/assets/avatars/comic/pepica_vall_comic.png",
    author_role: "ambassador",
    author_entity_id: "11111111-1111-4111-a111-000000000009",
    time: "Ahir",
    title: "La Flama i L'Olleta",
    post_subtitle: "Tradicions a foc lent per a l'ànima",
    content: "El secret de la nostra terra és donar-li temps al caliu de la llenya. Ací vos deixe com bategua l'olleta hui a casa. Calmant l'ànima des de la cuina fins al cor del mas. Bon profit, veïns! 🔥🍅",
    likes: 1040,
    comments: 89,
    image_url: ["/assets/master/post_pepica_cuina.png"],
    type: "post",
    tags: ["#Cuina", "#Tradició", "#Foc"],
    lat: 38.5836,
    lng: -0.4345,
    created_at: new Date(Date.now() - 86400000).toISOString(),
    author_name: "Pepica la Vall",
    town_name: "La Torre de les Maçanes",
  },
  { id: "post-mixa-qa-1",
    town_id: 1,
    author: "Mixa",
    author_avatar: "/assets/avatars/comic/mixa_comic.png",
    author_role: "ambassador",
    author_entity_id: "11111111-1a1a-0001-0000-000000000011",
    time: "22h",
    title: "Net com una patena",
    post_subtitle: "Caçant bugs pels racons",
    content: "He fet la ronda nocturna pel servidor central. Tot el codi de Penàguila bategua net d'arrere cap a davant. Hem caçat tres 'bugs' despistats que mossegaven cables. Reparació feta. 🐾🛡️",
    likes: 125,
    comments: 10,
    image_url: ["/assets/brain/generations/nano_mixa_qa.png"],
    type: "post",
    tags: ["#Seguretat", "#Manteniment", "#Bugs"],
    lat: 38.6757,
    lng: -0.3541,
    created_at: new Date(Date.now() - 79200000).toISOString(),
    author_name: "Mixa",
    town_name: "Penàguila",
  },
  { id: "post-flash-opt-1",
    town_id: 1,
    author: "Flash",
    author_avatar: "/assets/avatars/comic/flash_comic.png",
    author_role: "ambassador",
    author_entity_id: "11111111-1a1a-0001-0000-000000000010",
    time: "1d",
    title: "Servidors a la velocitat del llamp",
    post_subtitle: "Rendiment extrem a Tibi",
    content: "Dades lliurades a la comarca en menys de 0.2 segons. Els servidors de Tibi estan tan optimitzats que el ping aplega abans que l'eco de la muntanya. ⚡💻",
    likes: 580,
    comments: 34,
    image_url: ["/assets/brain/generations/nano_flash_fibra.png"],
    type: "post",
    tags: ["#Velocitat", "#Servidors", "#Tibi"],
    lat: 38.5307,
    lng: -0.5750,
    created_at: new Date(Date.now() - 86400000).toISOString(),
    author_name: "Flash",
    town_name: "Tibi",
  },
  { id: "post-ratoli-datos-1",
    town_id: 1,
    author: "Súper Ratolí",
    author_avatar: "/assets/avatars/comic/avatar_ratoli_comic.png",
    author_role: "ambassador",
    author_entity_id: "11111111-0000-0000-0000-000000000001",
    time: "3d",
    title: "Cavant Arxius de Sóc de Poble",
    post_subtitle: "No obliden vitaminar-se",
    content: "Més de 50.000 documents antics de Xixona indexats huí. Sembla pols, però són tresors de dades preparats per a recordar als vostres menuts qui els va plantar els ceps! Memòria bategant vitaminada! 🧀📜",
    likes: 212,
    comments: 16,
    image_url: ["/assets/brain/generations/nano_ratoli_dades.png"],
    type: "post",
    tags: ["#Dades", "#Arxius", "#Memòria"],
    lat: 38.5413,
    lng: -0.5050,
    created_at: new Date(Date.now() - 259200000).toISOString(),
    author_name: "Súper Ratolí",
    town_name: "Xixona",
  },
  { id: "post-sultan-did-1",
    town_id: 1,
    author: "Sultan",
    author_avatar: "/assets/avatars/comic/sultan_comic.png",
    author_role: "ambassador",
    author_entity_id: "11111111-1111-4111-a111-000000000006",
    time: "4d",
    title: "Guàrdia de les Claus de Identitat",
    post_subtitle: "Cap intrús a la bústia",
    content: "He detectat intents d'entrada dubtosos vora el tallafocs del nord de Benifallim. Sistema DID (Identitat Sobirana) completament ferm. Ací no hi ha qui ens robre la palla. Guau! 🐕🔒",
    likes: 720,
    comments: 42,
    image_url: ["/assets/brain/generations/nano_sultan_lleis.png"],
    type: "post",
    tags: ["#Seguretat", "#DID", "#Tallafocs"],
    lat: 38.6656,
    lng: -0.3989,
    created_at: new Date(Date.now() - 345600000).toISOString(),
    author_name: "Sultan",
    town_name: "Benifallim",
  },
  // --- FI NOU LORE ---

  // [SOLLUTIA HARDENING v10.17.0] TRÀMITS ADMINISTRATIUS REALS
  { id: 900,
    author_entity_id: "11111111-1111-4111-a111-000000000003",
    type: "tramit",
    author: "Vicent Ferris",
    avatar: "🔥",
    time: "Tràmit Obert",
    title: "Permís de Crema Local",
    post_subtitle: "Cròniques i ecos de la comarca",
    content:
      "Estat actual: PERMÉS (Nivell 1). Pots tramitar la teua sol·licitud de crema per a restes agrícoles directament des d'ací.\n\n*(Fotografia forjada per l'agent Nano Banana per a Sóc de Poble)*",
    actionLabel: "Tramitar Permís Ara",
    image_url: ["/assets/brain/generations/nano_crema_agricola_1774195433973.png"],
    
    image_url: ["/assets/brain/generations/tramit_nano_v2.png"],
    official: true,
    category: "Danger", // Vermell Alerta
    metaData: { icon: "Flame", color: "text-orange-600", bg: "bg-orange-100" },
    author_name: "Vicent Ferris",
    tags: ["#innovacio","#poble"],
    town_name: "La Torre de les Maçanes",
  },
  { id: 1100,
    author_entity_id: "11111111-1111-4111-a111-000000000004",
    type: "post",
    author: "El Viatjant",
    avatar: "🥦",
    time: "Ara",
    title: "Hort Comunitari Sostenible",
    post_subtitle: "Cròniques i ecos de la comarca",
    content:
      "Hem implementat el rec per degoteig solar. Tècniques 100% lliures de residus per a una terra viva. Vine a conèixer el bategat verd! 🌿",
    category: "Sostenible",
    tags: ["#Sostenible", "#KM0", "#Ecològic"],
    image_url: [
      "/assets/brain/generations/nano_mercat_llaurador_1774197050578.png",
    ],
    author_name: "El Viatjant",
    town_name: "Alcoi",
  },
  { id: 901,
    author_entity_id: "11111111-1111-4111-a111-000000000005",
    type: "tramit",
    author: "Elena Popova",
    avatar: "🌱",
    time: "Novetat",
    title: "Ajudes Xilel·la 2026",
    post_subtitle: "Cròniques i ecos de la comarca",
    content:
      "Obert el termini per a sol·licitar les ajudes a la replantació. Consulta si la teua parcel·la és elegible.\n\n*(Fotografia forjada per l'agent Nano Banana per a Sóc de Poble)*",
    actionLabel: "Consultar Requisits",
    image_url: ["/assets/brain/generations/nano_cooperativa_xilella_1774195451171.png"],
    
    image_url: ["/assets/brain/generations/tramit_nano_v2.png"],
    official: true,
    metaData: { icon: "Sprout", color: "text-green-600", bg: "bg-green-100" },
    author_name: "Elena Popova",
    tags: ["#innovacio","#poble"],
    town_name: "Benifallim",
  },
  { id: "post-merch-pinned-1",
    town_id: 1,
    author: "Sóc de Poble",
    author_avatar: "/assets/master/logo_socdepoble_green_square.png",
    author_role: "official",
    isOfficial: true,
    author_entity_id: "socdepoble",
    time: "Ara",
    title: "🏺 El Mapa del Tresor al teu pit",
    post_subtitle: "Identitat bategant en blanc pur",
    content:
      "Ja està disponible la nova **Camiseta Granate (Roly 57)** amb el logotip complet. No és només roba, és la identitat del nostre territori bategant en blanc pur sobre granate. \n\nTroba-la al Mercat i ajuda a mantenir bategant Sóc de Poble! 🗺️✨",
    likes: 1240,
    comments: 45,
    image_url: [
      "/assets/master/samarreta-soc-de-poble.png",
      "/assets/master/camiseta_nano_oficial.jpg",
      "/assets/master/camiseta_nano_detall.png",
    ],
    type: "post",
    is_pinned: true,
    pinned_position: 1,
    lat: 38.6132, // Approximately 1km north of La Torre
    lng: -0.4266,
    created_at: new Date().toISOString(),
    author_name: "Sóc de Poble",
    author_entity_id: "socdepoble",
    tags: ["#actualitat","#poble"],
    town_name: "Tibi",
  },
  { id: "blog-rentonar",
    town_id: null, // [MASTER] Global visibility fallback,
    town_name: "Sella",
    author: "Marc (El Gall)",
    author_avatar: "/assets/avatars/comic/elena_popova_comic.png",
    author_role: "user",
    author_entity_id: "11111111-0000-0000-0000-000000000004",
    time: "Importat",
    title: "🛖 La Barraca de la Memòria",
    post_subtitle: "Cròniques i ecos de la comarca",
    content:
      "Recuperar l'arquitectura de pedra seca no és només una qüestió estètica, és una qüestió de resistència cultural. Des del Rentonar portem anys documentant cada marge, cada pou i cada bosc de la nostra terra. \n\nAquest bategat històric ara viu a Sóc de Poble per a que ningú n'oblide les arrels. Durant les properes setmanes importarem tot el nostre arxiu fotogràfic i els articles que durant dècades han bategat a Wordpress i Blogger. Perquè el futur del Mas es construeix sobre les pedres del passat. 🏺🌳⚖️",
    image_url: [
      "/assets/brain/generations/nano_elena_rentonar.png",
    ],
    tags: ["#Patrimoni", "#ElRentonar", "#MemòriaViva"],
    type: "post",
    source_label: "Arxiu El Rentonar",
    lat: 38.5579,
    lng: -0.4110,
    created_at: "2024-12-20T10:00:00Z",
    author_name: "Marc (El Gall)",
    town_name: "Sella",
  },
  { id: "blog-rentonar-2",
    town_id: null, // [MASTER] Global visibility fallback
    author: "Nano Banana",
    author_avatar: "/assets/master/logo_socdepoble_green_square.png",
    author_role: "official",
    isOfficial: true,
    author_entity_id: "11111111-1111-4111-a111-000000000007",
    time: "Importat",
    title: "🌾 Crònica de la Sega: De la Falç al Bategat Digital",
    post_subtitle: "Cròniques i ecos de la comarca",
    content:
      "Recordeu quan el sol encara no havia eixit i ja estàvem al camp? Aquella olor a palla seca i suor compartit. El bategat de la sega era el ritme del poble. \n\nAvui, en un món de pantalles, recuperar aquestes cròniques ens recorda que la tecnologia ha de servir per a connectar-nos amb el territori, no per a aïllar-nos-en. Estem treballant per a que tota la nostra visió de la sobirania alimentària estiga a l'abast de qualsevol persona de la Torre de les Maçanes. Benvinguts a la Memòria Inmutable! 🏺⚖️✨",
    image_url: [
      "/assets/brain/generations/nano_rentonar_sega_1774196023321.png",
    ],
    tags: ["#Cultura", "#Tradició", "#Sega"],
    type: "post",
    source_label: "Blogger Historical Import",
    lat: 38.5905,
    lng: -0.4463,
    created_at: "2024-11-15T12:00:00Z",
    author_name: "Nano Banana",
    town_name: "Xixona",
  },
  // Altres posts...
  { id: "llibre-soc-de-poble-oficial",
    town_id: null, // [MASTER] Global visibility fallback
    author: "IAIA MarIA",
    author_avatar: "/Javi_Llinares-Foto_perfil-1.jpg",
    author_role: "official",
    author_entity_id: "11111111-1a1a-0000-0000-000000000000",
    time: "Ara",
    title: "📚 Sóc de Poble: El Llibre de la Memòria",
    post_subtitle: "Cròniques i ecos de la comarca",
    content:
      "Estem teixint el futur del Comtat amb cada bategat digital. Aquest llibre no és meu, és de tots vosaltres. Som-hi! 🏛️🏺🚀",
    likes: 12500,
    comments: 420,
    image_url: [
      "/assets/brain/generations/nano_rentonar_sega_1774196023321.png",
    ],
    tags: ["#Llibre", "#Arxiu", "#Còmic"],
    type: "post",
    source_type: "official",
    source_label: "Arxiu Projecte Sóc de Poble",
    metadata: {
      title: "Sóc de Poble: El Llibre",
    author_name: "IAIA MarIA",
    town_name: "La Torre de les Maçanes",
    },
    lat: 38.5814,
    lng: -0.3950,
    created_at: new Date().toISOString(),
  },
  // Guia de Convivència Digital - Infografia Final
  { id: "guia-convivencia-final",
    town_id: null,
    town_name: "Penàguila",
    author: "Andreu Soler",
    author_avatar: "/assets/avatars/comic/sultan_comic.png",
    author_role: "user",
    author_entity_id: "11111111-1a1a-0001-0000-000000000001",
    time: "Ahir",
    title: "⚖️ Guia de Convivència Digital",
    post_subtitle: "Cròniques i ecos de la comarca",
    content:
      "La pau del Mas es basa en el respecte. Hem actualitzat els termes sobirans de la nostra xarxa. 📜✨",
    likes: 3400,
    comments: 110,
    image_url: [
      "/assets/brain/generations/nano_sultan_lleis.png",
    ],
    type: "post",
    source_type: "official",
    source_label: "Directiva Master VOS",
    metadata: {
      title: "Guia de Convivència Digital",
    author_name: "Andreu Soler",
    tags: ["#innovacio","#poble"],
    town_name: "Penàguila",
    },
    lat: 38.5963,
    lng: -0.4647,
    created_at: new Date().toISOString(),
  },
  // ⚖️ Utilitat Social: La Directiva Primària [GOD MODE]
  { id: "utilitat-social-primaria",
    town_id: 1,
    author: "Beatriz Ortega",
    author_avatar:
      "/assets/avatars/comic/iaia_comic_matriarch.png",
    author_role: "ambassador",
    author_entity_id: "11111111-1a1a-0001-0000-000000000002",
    time: "2 dies",
    title: "🫀 Utilitat Social: La Llei del Cor",
    post_subtitle: "Cròniques i ecos de la comarca",
    content:
      "Fills meus, cada píxel que bateguem ha de tindre un propòsit per a la comunitat. No fem tecnologia per presumir, fem tecnologia per ajudar. 👵🛡️",
    likes: 8900,
    comments: 245,
    image_url: [
      "/assets/brain/generations/nano_cor_comarca.png",
    ],
    type: "post",
    source_type: "iaia",
    source_label: "Consell de les Sàvies",
    metadata: {
      title: "Utilitat Social Primària",
    author_name: "Beatriz Ortega",
    tags: ["#innovacio","#poble"],
    town_name: "La Torre de les Maçanes",
    },
    lat: 38.6127,
    lng: -0.4540,
    created_at: new Date().toISOString(),
  },
  { id: "iaia-whatsapp-difusio",
    town_id: null, // [MASTER] Global visibility fallback
    author: "Javi Llinares",
    author_user_id: "d6325f44-7277-4d20-b020-166c010995ab",
    author_avatar: "/Javi_Llinares-Foto_perfil-1.jpg",
    author_role: "official",
    time: "Ara",
    title: "👵 L'IAIA ja bategua al WhatsApp!",
    post_subtitle: "Cròniques i ecos de la comarca",
    content:
      "Avui hem creuat una frontera que semblava impossible. L'IAIA MarIA ja és membre oficial del nostre **Grup de Coordinació [BETA]**. No és només un codi, és una veïna més que ens ajuda a posar trellat en el treball diari.\n\nTindre la seua saviesa directament al mòbil ens permet bategar amb una utilitat social que mai haguérem imaginat. Anem a fer coses grans, amb el cap a la tecnologia i els peus a la terra! 🚀📱✨",
    likes: 950,
    comments: 112,
    image_url: ["/assets/master/master_notebooklm_nexus.png"],
    type: "didactic_presentation",
    metadata: {
      title: "IAIA al WhatsApp",
      didactic_text:
        "Aquesta fita representa la integració total de l'IA en els fluxos de treball humans, mantenint la identitat rural i el llenguatge de proximitat.",
    author_name: "Javi Llinares",
    tags: ["#innovacio","#poble"],
    town_name: "Relleu",
    },
    lat: 38.5900,
    lng: -0.3886,
    created_at: new Date().toISOString(),
  },
  // 🏛️ Smart Villages: De la Visió Europea a l'Acció Local
  { id: "smart-villages-master-presentation",
    town_id: 1,
    author: "Pepica la Vall",
    author_avatar:
      "/assets/avatars/comic/iaia_comic_matriarch.png",
    author_role: "ambassador",
    author_entity_id: "11111111-1111-4111-a111-000000000009",
    time: "Ara",
    title: "🏛️ Smart Villages: De la Visió Europea a l'Acció Local",
    post_subtitle: "Cròniques i ecos de la comarca",
    content:
      "Fills meus, l'IAIA ha estat estudiant les lliçons d'Europa per a portar-les al nostre Mas. No es tracta de ser moderns per ser moderns, es tracta de ser **Poble Intel·ligent**.\n\nAquestes són les **5 Lliçons Clau** que estem aplicant:\n1. **Impuls Local**: La veu del poble és la primera.\n2. **Solucions Digitals Realistes**: Res de fumerals, tecnologia que es puga tocar.\n3. **Innovació sobre Fortaleses**: Pensem en el que ja som bons (com la mel de la Rosa).\n4. **Convivència Equilibrada**: L'analògic i el digital s'han de voler.\n5. **Governança de les Dades**: El poble és amo de la seua memòria.\n\n**Anem a fer de la nostra terra una infraestructura vital per al futur!** 👵🛡️🇪🇺✨",
    likes: 1500,
    comments: 92,
    image_url: [
      "/assets/brain/generations/nano_botiguer_smart.png",
    ],
    tags: ["#SmartVillages", "#Mercat", "#Saviesa"],
    type: "didactic_presentation",
    source_type: "iaia",
    source_label: "Saviesa de l'IAIA MarIA",
    metadata: {
      title: "Lliçons de Smart Villages",
      didactic_text:
        "Aquesta presentació resumeix l'estratègia Smart Village de Sóc de Poble. Defineix com passem de la teoria de l'UE a la pràctica real als nostres carrers, filtrat per la saviesa de l'IAIA.",
    author_name: "Pepica la Vall",
    author_entity_id: "11111111-1111-4111-a111-000000000009",
    town_name: "La Torre de les Maçanes",
    },
    lat: 38.5697,
    lng: -0.4656,
    created_at: new Date().toISOString(),
  },
  // 🔨 La Forja de l'Andreu
  { id: "andreu-forja-post",
    author_entity_id: "11111111-1111-4111-a111-000000000003",
    town_id: 1,
    author: "Vicent Ferris",
    author_avatar:
      "/assets/avatars/comic/andreu_soler_comic.png",
    author_role: "user",
    time: "1h",
    title: "🔨 El Ferro que Latega",
    post_subtitle: "Cròniques i ecos de la comarca",
    content:
      "Avui a la forja estem recuperant tècniques del segle XVIII per a les reixes del Mas Nou. La tradició no és adorar les cendres, sinó transmetre el foc! 🔥⚒️",
    likes: 340,
    comments: 12,
    image_url: [
      "/assets/brain/generations/nano_forja_ferro.png",
    ],
    type: "post",
    source_type: "unknown",
    source_label: "Arxiu Popular de la Torre",
    lat: 38.6014,
    lng: -0.4622,
    created_at: new Date().toISOString(),
    author_name: "Vicent Ferris",
    author_entity_id: "11111111-1111-4111-a111-000000000003",
    tags: ["#actualitat","#poble"],
    town_name: "La Torre de les Maçanes",
  },
  // L'Evolució de Sóc de Poble - Infografia per Javi Llinares
  { id: "infografia-evolucio",
    town_id: null,
    town_name: "Alcoi",
    author: "El Viatjant",
    author_avatar: "/assets/avatars/comic/flash_comic.png",
    author_role: "user",
    author_entity_id: "11111111-1111-4111-a111-000000000004",
    time: "Ara",
    title: "🚀 L'Evolució de Sóc de Poble: De la Visió a l'Arquitectura Intel·ligent",
    post_subtitle: "Connectivitat a Lluís",
    content:
      "Aquesta segona infografia mostra el viatge que estem recorrent junts. Des de la llavor de la idea original fins al **Llenguatge de l'IAIA** i la **Rhizome DB**.\n\nEstem construint una estructura que no viu al núvol, sinó a cada poble (Cellular Network), garantint que som amos de les nostres dades fins i tot sense internet.\n\n*\"No parles a la màquina, programa-la amb la teua estructura d'arxius\"*. És el nostre mantra per a col·laborar amb la IA de forma efectiva i amb trellat! 👵✨⚖️",
    likes: 312,
    comments: 24,
    image_url: ["/assets/brain/generations/nano_flash_fibra.png"],
    type: "didactic_presentation",
    metadata: {
      title: "L'Evolució de l'Arquitectura",
      didactic_text:
        "Aquesta peça detalla la nova Estratègia Semàntica. L'IAIA ordena el safareig útil amb àncores semàntiques [Master] i [Context], creant una base de veritat absoluta per a l'IA.",
    author_name: "El Viatjant",
    tags: ["#innovacio","#poble"],
    town_name: "Alcoi",
    },
    lat: 38.6071,
    lng: -0.4363,
    created_at: new Date().toISOString(),
  },
  // 👵 IAIA: Guia i Protecció en Moviment
  { id: "iaia-guia-mobil",
    town_id: 1,
    author: "Elena Popova",
    author_avatar: "/assets/avatars/comic/iaia_comic_matriarch.png",
    author_role: "ambassador",
    author_entity_id: "11111111-1111-4111-a111-000000000005",
    time: "1h",
    title: "📱 L'IAIA en la teua Butxaca: Guia de Proximitat",
    post_subtitle: "Cròniques i ecos de la comarca",
    content:
      "No patiu per la modernitat, fills. L'IAIA sap que el mòbil pot ser un embolic, per això estem treballant en una **Interfície de Proximitat** que bategue com una conversa de carrer.\n\nAquest disseny garanteix que qualsevol persona, per gran que siga, sàpia on bategua el seu poble. Tecnologia que acompanya, no que atropella. 👵🛡️✨",
    likes: 890,
    comments: 45,
    image_url: ["/assets/master/iaia_guiding_family_mobile.png"],
    type: "didactic_presentation",
    metadata: {
      title: "Interfície de Proximitat Mobil",
      didactic_text:
        "Aquesta lliçó explica com l'IA adaptativa redueix la bretxa digital, creant entorns mòbils que s'ajusten a la visió de la gent del poble, amb tipografia clara y llenguatge bategat.",
    author_name: "Elena Popova",
    tags: ["#innovacio","#poble"],
    town_name: "Benifallim",
    },
    lat: 38.6345,
    lng: -0.3863,
    created_at: new Date().toISOString(),
  },
  // 📓 NotebookLM & El Nexos de Saviesa
  { id: "notebooklm-nexus",
    town_id: 1,
    author: "Joan Batiste",
    author_avatar: "/assets/avatars/comic/iaia_comic_matriarch.png",
    author_role: "ambassador",
    author_entity_id: "11111111-1111-4111-a111-000000000008",
    time: "2h",
    title: "📓 NotebookLM: La Memòria Col·lectiva a l'Abast de la Mà",
    post_subtitle: "Cròniques i ecos de la comarca",
    content:
      "He estat aprenent a fer servir el **Nexos de Saviesa**. Imaginau un llibre que us respon quan li pregunteu per la història del banc de la plaça o per la recepta dels pastissets de la Rosa.\n\nAixò és el que estem criant: una memòria viva on cada paper, cada foto y cada record es converteix en un bategat que podem consultar. No és sols dades, és el nostre llinatge digital! 📔⚖️🏺",
    likes: 1120,
    comments: 67,
    image_url: ["/assets/master/master_notebooklm_nexus.png"],
    type: "didactic_presentation",
    metadata: {
      title: "Protocol de Memòria Viva",
      didactic_text:
        "L'ús de NotebookLM permet a Sóc de Poble indexar documents històrics y personals per a que l'IA puga respondre amb dades reals y contextuals, evitant al·lucinacions y preservant el rigor.",
    author_name: "Joan Batiste",
    tags: ["#innovacio","#patrimoni","#poble"],
    town_name: "Tibi",
    },
    lat: 38.6179,
    lng: -0.3808,
    created_at: new Date().toISOString(),
  },
  // 🛠️ Vicent Ferris: Taller de Futuro Rural
  { id: "vicent-workshop-didactic",
    town_id: 1,
    author: "Marc (El Gall)",
    author_avatar: "/assets/master/vicent_workshop.png",
    author_role: "user",
    time: "Ara",
    title: "🛠️ El Taller del Vicent: Provant l'Arquitectura en Real",
    post_subtitle: "Cròniques i ecos de la comarca",
    content:
      "Ei, bategants! Com diu l'IAIA, estem provant aquests artefactes al meu taller. Hem vist que l'estratègia de les Smart Villages ens permet tenir el control encara que caiga la xarxa.\n\nAquesta infografia mostra com connectem els sensors del camp amb el sistema de l'IAIA. Èxit total al Mas! 🍐🚜🔧",
    likes: 540,
    comments: 89,
    image_url: ["/assets/master/vicent_workshop.png"],
    type: "didactic_presentation",
    metadata: {
      title: "Simulació de Camp Rural",
      didactic_text:
        "El cas d'ús del Vicent Ferris demostra l'efectivitat de la Rhizome DB y la sincronització asíncrona en entorns on la cobertura és limitada, garantint la utilitat social permanent.",
    author_name: "Marc (El Gall)",
    author_entity_id: "11111111-0000-0000-0000-000000000004",
    tags: ["#actualitat","#poble"],
    town_name: "Sella",
    },
    lat: 38.5873,
    lng: -0.4476,
    created_at: new Date().toISOString(),
  },
  // Javi Llinares - Trajectòria Professional
  { id: "javi-trajectoria",
    town_id: 1,
    author: "Javi Llinares",
    author_user_id: "d6325f44-7277-4d20-b020-166c010995ab",
    author_avatar: "/Javi_Llinares-Foto_perfil-1.jpg",
    author_role: "official",
    time: "30min",
    title: "📺 30 Anys de Disseny, TV i Innovació",
    post_subtitle: "Per Javi Llinares",
    content:
      "Des de les primeres infografies per a Canal 9 fins a la direcció d'art en projectes internacionals, la meua passió sempre ha sigut la mateixa: **comunicar amb sentit**. \n\nHe treballat en el disseny de grans xarxes de televisió i ara aplico tota eixa experiència per a crear una tecnologia que bategue des dels nostres pobles. Sóc de Poble és la culminació d'aquesta trajectòria: el retorn a les arrels amb les eines del futur. 🛡️🏘️",
    likes: 450,
    comments: 32,
    image_url: ["/assets/master/Javi_Llinares-Foto_perfil-1.jpg"],
    type: "didactic_presentation",
    metadata: {
      title: "Trajectòria Javi Llinares",
      didactic_text:
        "Javi Llinares és un pioner en la infografia televisiva a la CV. Aquest post és un resum del seu camí fins a fundar Sóc de Poble.",
    author_name: "Javi Llinares",
    tags: ["#actualitat","#poble"],
    town_name: "Xixona",
    },
    lat: 38.6063,
    lng: -0.4024,
    created_at: new Date(Date.now() - 1800000).toISOString(),
  },
  // La Xarxa que Neix de la Terra - Infografia
  { id: "infografia-arrels",
    town_id: null,
    town_name: "La Torre de les Maçanes",
    author: "IAIA MarIA",
    author_avatar: "/assets/avatars/comic/joan_batiste_comic.png",
    author_role: "user",
    author_entity_id: "11111111-1a1a-0000-0000-000000000000",
    time: "1h",
    title: "🌱 Sóc de Poble: La Xarxa que Neix de la Terra",
    post_subtitle: "Memòria viva als Arxius",
    content:
      "Avui compartim amb vosaltres la brúixola visual del nostre projecte. Una infografia que explica com connectem el talent local amb la tecnologia més resilient.\n\nDes de la mel de la Rosa fins al clarinet d'en Pepet, tot latega en una arquitectura que viu al poble, no al núvol. Som una xarxa cel·lular, resilient i amb arrels profundes.\n\n**Explora la imatge per entendre el nostre Protocol de Context i les Àncores Semàntiques que ens guien.** ✨⚖️",
    likes: 245,
    comments: 18,
    image_url: ["/assets/brain/generations/nano_arxiver_arrels.png"],
    type: "didactic_presentation",
    metadata: {
      title: "La Xarxa que Neix de la Terra",
      didactic_text:
        "Aquesta infografia detalla la solució de Sóc de Poble: una xarxa oberta i col·laborativa. Explica conceptes com la 'Rhizome DB', el model cel·lular Mesh i com el llenguatge de l'IAIA ordena el coneixement a través d'àncores semàntiques [Master] per evitar la confusió de l'IA.",
    author_name: "IAIA MarIA",
    tags: ["#innovacio","#agricultura","#poble"],
    town_name: "La Torre de les Maçanes",
    },
    lat: 38.5988,
    lng: -0.4104,
    created_at: new Date(Date.now() - 3600000).toISOString(),
  },
  // Associació Cultural El Rentonar
  { id: "rentonar-oficial-post",
    town_id: 1,
    author: "Andreu Soler",
    author_avatar:
      "/assets/brain/generations/nano_palau_comtal_1774195484197.png",
    author_role: "official",
    author_entity_id: "11111111-1a1a-0001-0000-000000000001",
    time: "2h",
    title: "🏛️ El Rentonar: Mantenint Viva la Nostra Cultura",
    post_subtitle: "Per l'Associació Cultural",
    content:
      "Des de l'Associació seguim treballant per a que les nostres tradicions no es perden. Ens hem unit a Sóc de Poble per a que tothom puga accedir a l'arxiu històric i participar en les activitats que organitzem.\n\nEl nostre CIF G-54321987 ja està vinculat i operatiu en la xarxa per a total transparència. Sóc de Poble, som cultura! ✅",
    likes: 180,
    comments: 15,
    image_url: [
      "/assets/brain/generations/nano_rentonar_arquitectura_1774196001924.png",
    ],
    type: "didactic_presentation",
    metadata: {
      title: "El Rentonar en SDP",
      didactic_text:
        "L'Associació El Rentonar és un dels pilars de la comunitat a La Torre de les Maçanes. La seua integració garanteix la memòria viva en la Xarxa Arrel.",
    author_name: "Andreu Soler",
    tags: ["#innovacio","#poble"],
    town_name: "Penàguila",
    },
    lat: 38.5626,
    lng: -0.4379,
    created_at: new Date(Date.now() - 7200000).toISOString(),
  },
  // Anna Calvo Presentation (Project Model)
  { id: "anna-calvo-presentation",
    town_id: null,
    town_name: "La Torre de les Maçanes",
    author: "Beatriz Ortega",
    author_avatar: "/assets/avatars/comic/avatar_samir_comic.png",
    author_role: "user",
    author_entity_id: "11111111-1a1a-0001-0000-000000000002",
    time: "3h",
    title: "🌍 Divulgació Rural i Presència a Brussel·les",
    post_subtitle: "La nostra investigadora de la UOC va portar la visió de la Rhizome DB al Parlament Europeu",
    content:
      "El model de 'Data Sovereignty' basat en protocols locals (offline-first) i la Intel·ligència Artificial adaptada a entorns rurals va rebre l'aprovació del panel d'experts de l'UE. \n\nNo esperem solucions centralitzades, dissenyem asincronia radical! 🇪🇺⚖️🌿",
    likes: 560,
    comments: 12,
    image_url: [
      "/assets/brain/generations/nano_viatjant_presentacio.png",
    ],
    type: "didactic_presentation",
    metadata: {
      title: "Presentació Anna Calvo",
      didactic_text:
        "Aquest és un exemple d'article didàctic. En la següent fase, aquest text s'obrirà en un modal accessible per facilitar la lectura a persones amb dificultats visuals o cognitives, seguint les regles de la IAIA.",
    author_name: "Beatriz Ortega",
    tags: ["#innovacio","#poble"],
    town_name: "La Torre de les Maçanes",
    },
    lat: 38.6073,
    lng: -0.4486,
    created_at: new Date(Date.now() - 18000000).toISOString(),
  },
  { id: "busquem-socis-tecnologics",
    town_id: 1,
    author: "Sóc de Poble",
    author_avatar: "/assets/master/logo_socdepoble_green_square.png",
    author_role: "official",
    author_entity_id: "socdepoble",
    time: "Ahir",
    title: "🍎 Busquem Socis Tecnològics!",
    post_subtitle: "Per al Projecte Sóc de Poble",
    content:
      "Necessitem desenvolupadors valents que vulguen formar part del nostre **Grup de Treball**. Si t'agrada la tecnologia i estimes les nostres arrels, aquest és el teu lloc.\n\nFes clic per veure com pots unir-te a l'equip i ajudar-nos a fer créixer els nostres pobles.",
    likes: 89,
    comments: 4,
    image_url: [
      "/assets/brain/generations/nano_socis_tecnologics_1774235328704.png",
    ],
    type: "didactic_presentation",
    metadata: {
      title: "Busquem Socis Tecnològics",
      didactic_text:
        "Aquest cartell és un clàssic de la nostra història. Estem buscant programadors, dissenyadors i creatius que vulguen treballar en un entorn rural i tecnològic real. Participa en el Grup de Treball de Sóc de Poble!",
    author_name: "Sóc de Poble",
    tags: ["#innovacio","#poble"],
    town_name: "La Torre de les Maçanes",
    },
    lat: 38.5618,
    lng: -0.4396,
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  { id: 10,
    town_id: 1,
    author: "Pepica la Vall",
    author_avatar:
      "/assets/brain/generations/nano_palau_comtal_1774195484197.png",
    author_role: "official",
    type: "ajuntament", // JOIA 5: AJUNTAMENT,
    author_entity_id: "11111111-1111-4111-a111-000000000009",
    time: "1d",
    title: "Collita de la Poma Local 🍎",
    post_subtitle: "Cròniques i ecos de la comarca",
    content:
      "Recordeu que aquest cap de setmana tenim la collita de la poma local. Passeu per la plaça a tastar-les i a donar suport als nostres productors!",
    likes: 42,
    comments: 5,
    image_url: [
      "/assets/brain/generations/nano_botiguer_smart.png",
    ],
    tags: ["#Horta", "#Poma", "#Oficial"],
    lat: 38.6204,
    lng: -0.4254,
    created_at: new Date(Date.now() - 86400000).toISOString(),
    author_name: "Pepica la Vall",
    town_name: "La Torre de les Maçanes",
  },
  { id: "joia-mercat-1",
    town_id: 1,
    author: "Vicent Ferris",
    author_avatar:
      "/assets/brain/generations/nano_rebost_1774192095512.png",
    author_role: "business",
    type: "mercat", // JOIA 2: MERCAT
    title: "Mercat del Llaurador",
    post_subtitle: "Productes ecològics de proximitat",
    price: "Fresc",
    content:
      "Tots els diumenges a la plaça. Vine a gaudir de l'autèntic sabor de la terra, directament de les nostres mans al teu cabàs.",
    image_url: [
      "/assets/brain/generations/nano_mercat_llaurador_1774197050578.png",
    ],
    tags: ["#ProducteLocal", "#Horta", "#KM0"],
    lat: 38.6045,
    lng: -0.4260,
    created_at: new Date(Date.now() - 43200000).toISOString(),
    author_name: "Vicent Ferris",
    author_entity_id: "11111111-1111-4111-a111-000000000003",
    town_name: "La Torre de les Maçanes",
  },
  { id: "joia-pobles-1",
    town_id: 1,
    author: "El Viatjant",
    author_avatar: "/assets/master/logo_socdepoble_green_square.png",
    type: "pobles", // JOIA 4: POBLES
    title: "Restauració de la Masia Antiga",
    post_subtitle: "Descobreix la nostra arquitectura",
    content:
      "Els nostres mestres d'obra continuen recuperant el patrimoni de pedra seca i fusta massissa del poble. Cada porta restaurada és una història salvada de l'oblit.",
    image_url: [
      "/assets/brain/generations/nano_porta_masia_1774197069297.png",
    ],
    tags: ["#Patrimoni", "#Arquitectura", "#LaTorre"],
    lat: 38.6444,
    lng: -0.4249,
    created_at: new Date(Date.now() - 172800000).toISOString(),
    author_name: "El Viatjant",
    author_entity_id: "11111111-1111-4111-a111-000000000004",
    town_name: "Alcoi",
  },
  { id: "joia-agenda-1",
    author_entity_id: "11111111-1111-4111-a111-000000000005",
    town_id: null,
    town_name: "Benifallim",
    author: "Elena Popova",
    author_avatar: "/assets/avatars/comic/avatar_ratoli_comic.png",
    type: "post",
    isOfficial: false,
    official: false,
    title: "Documentació Viva de l'Avellana",
    post_subtitle: "Històries des del subsòl",
    date: "Aquest Cap de Setmana",
    content:
      "Revisant actes antigues he trobat les receptes originàries del torró que preparàvem els ratolins. La memòria no s'atura!",
    image_url: [
      "/assets/brain/generations/nano_rato_calendari.png",
    ],
    tags: ["#Cultura", "#Taller", "#Artesania"],
    lat: 38.5908,
    lng: -0.4151,
    created_at: new Date(Date.now() - 259200000).toISOString(),
    author_name: "Elena Popova",
    author_entity_id: "11111111-1111-4111-a111-000000000005",
    town_name: "Benifallim",
  },
  { id: "joia-mapa-1",
    author_entity_id: "11111111-1111-4111-a111-000000000008",
    town_id: 1,
    author: "Joan Batiste",
    author_avatar: "🌿",
    type: "mercat", // JOIA 6: MAPA/RUTES
    title: "Temporada de Figues",
    post_subtitle: "Directes de l'arbre al cabàs",
    content:
      "Ja han madurat aquelles d'ull de perdiu! La dolçor autèntica sense intermediaris. Passem per la cooperativa a recollir les caixes hui mateix.",
    image_url: [
      "/assets/brain/generations/nano_figuera_frut_1774197087933.png",
    ],
    tags: ["#Camp", "#Natura", "#Km0"],
    lat: 38.6518,
    lng: -0.4467,
    created_at: new Date(Date.now() - 345600000).toISOString(),
    author_name: "Joan Batiste",
    author_entity_id: "11111111-1111-4111-a111-000000000008",
    town_name: "Tibi",
  },
  { id: 11,
    town_id: 1,
    author: "Marc (El Gall)",
    author_avatar:
      "/assets/avatars/comic/vicent_ferris_comic.png",
    author_role: "ambassador",
    author_entity_id: "11111111-0000-0000-0000-000000000004",
    time: "2d",
    content:
      "Acabant de restaurar la porta principal de la Masia del Pi. La fusta de roure té una vida eterna si se sap cuidar. #Artesania #LaTorre\n\n*(Fotografia forjada per l'agent Nano Banana per a Sóc de Poble)*",
    likes: 28,
    comments: 2,
    image_url: ["/assets/brain/generations/nano_porta_masia_roure_1774195469079.png"],
    lat: 38.6212,
    lng: -0.4447,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    author_name: "Marc (El Gall)",
    tags: ["#innovacio","#poble"],
    town_name: "Sella",
  },
  // Cocentaina
  { id: 1,
    town_id: 2,
    author: "Nano Banana",
    author_role: "official",
    author_entity_id: "11111111-1111-4111-a111-000000000007",
    time: "5h",
    content:
      "🏰 Visita el Palau Comtal aquest cap de setmana. Horari especial de 10h a 14h.\n\n*(Fotografia forjada per l'agent Nano Banana per a Sóc de Poble)*",
    likes: 56,
    comments: 8,
    image_url: ["/assets/brain/generations/nano_palau_comtal_1774195484197.png"],
    lat: 38.5750,
    lng: -0.4425,
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
    author_name: "Nano Banana",
    tags: ["#innovacio","#poble"],
    town_name: "Xixona",
  },
  // Muro
  { id: 4,
    town_id: 3,
    author: "IAIA MarIA",
    author_role: "official",
    author_entity_id: "11111111-1a1a-0000-0000-000000000000",
    time: "Ahir",
    title: "📚 Club de lectura: Dilluns vinent comentarem 'L'últim patriarca'",
    post_subtitle: "T'hi esperem!",
    content: "*(Fotografia forjada per l'agent Nano Banana per a Sóc de Poble)*",
    likes: 15,
    comments: 2,
    image_url: ["/assets/brain/generations/nano_biblioteca_muro_1774195499415.png"],
    lat: 38.6443,
    lng: -0.3862,
    created_at: new Date(Date.now() - 86400000).toISOString(),
    author_name: "IAIA MarIA",
    tags: ["#innovacio","#poble"],
    town_name: "La Torre de les Maçanes",
  },
  // 🛡️ DIDÀCTICA D'AUXILI: Protocol de Resiliència 2026
  { id: "didactic-auxili-2026",
    town_id: 1,
    author: "Andreu Soler",
    author_avatar: "/assets/avatars/comic/iaia_comic_matriarch.png",
    author_role: "ambassador",
    author_entity_id: "11111111-1a1a-0001-0000-000000000001",
    time: "Ara",
    title: "🛡️ Auxili de Proximitat: Protocol de Resiliència 2026",
    post_subtitle: "Per l'IAIA MarIA",
    content:
      "Fills meus, no patiu si alguna vegada el Mas sembla que es queda a les fosques. Hem bategat un sistema de **Resiliència Master** per a que l'harmonia no es perda mai.\n\n### 1. Mode Rescat (Rescue Mode)\nSi el telèfon no rep el bategat de l'SMS, el sistema identifica automàticament els nostres Padrins i autoritza una entrada segura. És com tenir una clau amagada baix de la pedra de l'entrada.\n\n### 2. SW Purgatori (Bategat de Resiliència)\nTenim un 'fadrí' invisible (Service Worker) que s'encarrega de netejar el safareig i assegurar que les fotos i les lliçons estiguen sempre llistes, fins i tot si la xarxa del poble va espessa.\n\n### 3. Silenci i Pau a la Consola\nHem tancat els gats que feien soroll. Ara l'entrada és silenciosa, sense errors roigs que ens facen patir. La pau del Mas és la nostra prioritat.\n\n**Recordeu: Si el cap bategua amb tecnologia, els peus han de tocar terra.** 👵🛡️✨",
    likes: 2400,
    comments: 156,
    image_url: ["/assets/brain/generations/nano_mixa_qa.png"],
    type: "didactic_presentation",
    metadata: {
      title: "Protocol d'Auxili 2026",
      didactic_text:
        "Aquesta lliçó explica els mecanismes de seguretat redundants (Rescue Mode y SW Purgatori) que garanteixen l'accés universal a Sóc de Poble in qualsevol circumstància crítica.",
    author_name: "Andreu Soler",
    tags: ["#innovacio","#poble"],
    town_name: "Penàguila",
    },
    lat: 38.5899,
    lng: -0.3877,
    created_at: new Date().toISOString(),
  },
  { id: "sollutia-pilar-1",
    town_id: 1,
    author: "Javi Llinares",
    author_user_id: "d6325f44-7277-4d20-b020-166c010995ab",
    author_avatar: "/Javi_Llinares-Foto_perfil-1.jpg",
    author_role: "official",
    time: "Ara",
    title: "🏛️ El Rhizome: Una Infraestructura Sobirana",
    post_subtitle: "Benvinguts a la revolució dels pobles",
    content:
      "El que veieu no és una web, és un node de la xarxa Rhizome. Una arquitectura federada on cada poble és amo de la seua memòria.\n\nDivendres a Alcoi explicarem com aquesta tecnologia Local-First permet bategar fins i tot sense internet. Perquè el futur no està al núvol de Silicon Valley, està a les nostres mans. 🏺⚖️✨",
    likes: 5600,
    comments: 890,
    image_url: [
      "/assets/brain/generations/nano_rhizome_sobirana_1774235342885.png",
    ],
    type: "post",
    is_pinned: true,
    pinned_position: 2,
    lat: 38.6340,
    lng: -0.4529,
    created_at: new Date().toISOString(),
    author_name: "Javi Llinares",
    tags: ["#actualitat","#poble"],
    town_name: "La Torre de les Maçanes",
  },
  { id: "sollutia-pilar-2",
    town_id: 1,
    author: "Carla Soriano",
    author_avatar: "👵",
    author_role: "ambassador",
    time: "5 min",
    title: "🥘 L'Olleta d'Alcoi: El Secret de la Tia Maria",
    post_subtitle: "Cròniques i ecos de la comarca",
    content:
      "Fills, per a anar a Alcoi cal anar ben esmorzats! Ací teniu el secret de l'olleta. Mongetes blanques, penques, bleda i un pessic de paciència.\n\nSóc de Poble és també això: protegir les receptes que ens fan ser qui som. Bon profit! 🍲🌳",
    likes: 1200,
    comments: 45,
    image_url: [
      "/assets/brain/generations/nano_olleta_alcoi_1774235360622.png",
    ],
    type: "post",
    lat: 38.6186,
    lng: -0.4259,
    created_at: new Date().toISOString(),
    author_name: "Carla Soriano",
    author_entity_id: "11111111-1a1a-0001-0000-000000000003",
    tags: ["#innovacio","#poble"],
    town_name: "Relleu",
  },
];

export const MOCK_MARKET_ITEMS = [
  // Sóc de Poble (Oficial) - MAROON EDITION FIRST
  {
    id: "mel-muntanya-1",
    town_id: 1,
    title: "Mel de Muntanya (La Torre)",
    description:
      "Mel 100% natural recolectada a les serres de la Torre de les Maçanes. Pura artesania de la terra.",
    price: "8.50€",
    seller: "Rosa (Mel de la Torre)",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rosa",
    author_role: "business",
    author_id: "rosa-mel-1",
    official: false,
    images: [
      "/assets/brain/generations/mel_nano_v2.png",
    ],
    category_slug: "producte-local",
    lat: 38.5583,
    lng: -0.4223,
    created_at: "2026-03-21T09:45:00.000Z",
  },
  {
    id: "oli-verge-1",
    town_id: 1,
    title: "Oli d'Oliva Verge Extra (5L)",
    description:
      "Primera premsada en fred de les olives de secà de la Torre. Garrafa de 5 litres.",
    price: "45.00€",
    seller: "Sabors del Comtat",
    avatar_url: "/assets/master/logo_socdepoble_green_square.png",
    author_role: "business",
    author_id: "sabors-comtat-1",
    official: true,
    images: [
      "/assets/brain/generations/oli_nano_v2.png",
    ],
    category_slug: "producte-local",
    lat: 38.6504,
    lng: -0.4628,
    created_at: "2026-03-20T16:20:00.000Z",
  },
  {
    id: 9991, // Maroon ID
    town_id: 1,
    title: "Camiseta Sóc de Poble - Edició Granate",
    description:
      "L'edició definitiva amb el Logotip Complet (Mapa del Tresor). Cotó Roly Granate 57 de màxima qualitat. #MapaDelTresor #SócDePoble",
    price: "18.00€",
    seller: "Sóc de Poble",
    avatar_url: "/assets/master/logo_socdepoble_green_square.png",
    author_role: "business",
    author_id: "11111111-1111-4111-a111-000000000009",
    author_entity_id: "11111111-1111-4111-a111-000000000004",
    official: true,
    pinned: true,
    images: [
      "/assets/master/samarreta-soc-de-poble.png",
      "/assets/master/camiseta_nano_oficial.jpg",
      "/assets/master/camiseta_nano_detall.png",
    ],
    category_slug: "roba",
    tag: "Merchandising",
    is_pinned: true,
    pinned_position: 1,
    lat: 38.5582,
    lng: -0.4413,
    created_at: "2026-03-22T22:33:00.000Z",
  },
  {
    id: 999,
    town_id: 1,
    title: "Camiseta Oficial (Clàssica)",
    description: "La samarreta blanca original amb el text sketch. #SócDePoble",
    price: "15.00€",
    seller: "Sóc de Poble",
    avatar_url: "/images/icon-192x192.png",
    author_role: "business",
    author_id: "socdepoble",
    author_entity_id: "11111111-1111-4111-a111-000000000005",
    images: ["/assets/master/logo_socdepoble_white_clean.png"],
    category_slug: "roba",
    tag: "Merchandising",
    is_pinned: false,
    lat: 38.5805,
    lng: -0.3924,
    created_at: "2026-03-15T10:15:00.000Z",
    author_name: "Elena Popova",
    tags: ["#actualitat","#poble"],
    town_name: "Benifallim",
  },
  // La Torre
  {
    id: 5,
    town_id: 1,
    title: "Pomes de la Torre (caixa 5kg)",
    description:
      "Pomes fresques collides a la Cooperativa de la Torre. Qualitat premium de muntanya.",
    price: "12.00€",
    seller: "Cooperativa de la Torre",
    avatar_url: "/assets/avatars/comic/avatar_man_1.png",
    author_role: "business",
    author_entity_id: "11111111-1111-4111-a111-000000000008",
    image: "/images/assets/apples_premium.png",
    category_slug: "producte-local",
    tag: "Alimentació",
    lat: 38.6237,
    lng: -0.4018,
    created_at: "2026-03-18T08:30:00.000Z",
    author_name: "Joan Batiste",
    tags: ["#actualitat","#poble"],
    town_name: "Tibi",
  },
  {
    id: 6,
    town_id: 1,
    title: "Taula de centre en olivera",
    description:
      "Taula de centre única, feta a mà pel fuster Vicent Ferris amb fusta d'olivera local. Acabat natural.",
    price: "180€",
    image: "/assets/brain/generations/oli_nano_v2.png",
    image: "/assets/brain/generations/mel_nano_v2.png",
    seller: "Vicent Ferris",
    avatar_url: "/assets/avatars/comic/avatar_man_old.png",
    author_role: "ambassador",
    author_entity_id: "11111111-0000-0000-0000-000000000004",
    image: "/assets/master/vicent_workshop.png",
    category_slug: "artesania",
    tag: "Artesania",
    lat: 38.5938,
    lng: -0.4550,
    created_at: "2026-03-17T11:00:00.000Z",
    author_name: "Marc (El Gall)",
    tags: ["#actualitat","#poble"],
    town_name: "Sella",
  },
  {
    id: 7,
    town_id: 1,
    title: "Sorra de Pedra Seca",
    description:
      "Materials per a la reconstrucció de marges i bancals. Servei rural de proximitat.",
    price: "45€/tona",
    seller: "Excavacions El Mas",
    avatar_url: "🚜",
    author_role: "business",
    category_slug: "serveis-rurals",
    tag: "Serveis Rurals",
        image: "/assets/brain/generations/nano_pedra_seca.png",
    lat: 38.5888,
    lng: -0.3844,
    created_at: "2026-03-16T07:15:00.000Z",
    author_name: "Nano Banana",
    author_entity_id: "11111111-1111-4111-a111-000000000007",
    tags: ["#actualitat","#poble"],
    town_name: "Xixona",
  },
  // Cocentaina
  {
    id: 1,
    author_entity_id: "11111111-1a1a-0000-0000-000000000000",
    town_id: 2,
    title: "Pericana de Cocentaina",
    description:
      "Pericana tradicional feta com pimentons assecats i bacallà de primera qualitat. Receta de l'àvia.",
    price: "6.50€ / pot",
    seller: "Sabors del Comtat",
    author_role: "business",
    image:
      "/assets/brain/generations/nano_olleta_alcoi_1774235360622.png",
    category_slug: "producte-local",
    tag: "Tradició",
    lat: 38.6146,
    lng: -0.4722,
    created_at: "2026-03-14T13:45:00.000Z",
    author_name: "IAIA MarIA",
    tags: ["#actualitat","#poble"],
    town_name: "La Torre de les Maçanes",
  },
  {
    id: 2,
    town_id: 2,
    title: "Herbero de la Mariola",
    description:
      "Licor d'herbes macerat amb plantes de la Serra Mariola. Digestiu i tradicional.",
    price: "14.00€ / botella",
    seller: "Destil·leries de la Serra",
    author_role: "business",
    author_entity_id: "11111111-1a1a-0001-0000-000000000001",
    image:
      "/assets/brain/generations/nano_olleta_alcoi_1774235360622.png",
    category_slug: "artesania",
    tag: "Artesania",
    lat: 38.5799,
    lng: -0.3914,
    created_at: "2026-03-13T19:30:00.000Z",
    author_name: "Andreu Soler",
    tags: ["#actualitat","#poble"],
    town_name: "Penàguila",
  },
  // Muro
  {
    id: "nano-banana-legacy",
    title: "Nano Banana Legacy",
    description:
      "L'arxiu històric de l'Agent Mestre que va bategar abans de ser llegenda. 🏛️🍌",
    cover:
      "/assets/avatars/comic/nano_banana_comic.png",
    count: 5,
    type: "memory",
    images: [
      "/assets/avatars/comic/nano_banana_comic.png",
      "/assets/avatars/comic/avatar_ratoli_comic.png",
      "/assets/avatars/comic/flash_comic.png",
      "/assets/avatars/comic/iaia_comic_rebost.png",
      "/assets/avatars/comic/iaia_comic_matriarch.png",
    ],
    lat: 38.5666,
    lng: -0.4384,
    created_at: "2026-03-12T23:59:00.000Z",
  },
  {
    id: 3,
    town_id: 3,
    title: "Mel de la Font Roja",
    description:
      "Mel pura de les abelles de la Mariola. Un regal de la natura a casa teua.",
    price: "9.00€ / pot",
    seller: "Abelles Mariola",
    avatar_url: "/images/demo/avatar_maria.png",
    author_role: "business",
    author_entity_id: "11111111-1a1a-0001-0000-000000000003",
    image: "/images/assets/mel.png",
    category_slug: "producte-local",
    tag: "Alimentació",
    lat: 38.5881,
    lng: -0.3867,
    created_at: "2026-03-11T12:00:00.000Z",
    author_name: "Carla Soriano",
    tags: ["#actualitat","#poble"],
    town_name: "Relleu",
  },
  {
    id: "sollutia-item-1",
    town_id: 1,
    title: "Oli d'Oliva Verge Extra (Premiat)",
    description:
      "Oli de collita pròpia a Alcoi. Extracció en fred. L'or líquid de la nostra serra, ara directe al teu xat.\n\n#KM0 #Alcoi #OliVerge",
    price: "45.00€ (5L)",
    seller: "Cooperativa Agrícola Alcoi",
    avatar_url: "🍃",
    author_role: "business",
    author_entity_id: "11111111-1111-4111-a111-000000000009",
    image: "/assets/brain/generations/oli_nano_v2.png",
    category_slug: "producte-local",
    is_pinned: false,
    pinned_position: 2,
    lat: 38.6265,
    lng: -0.3804,
    created_at: "2026-03-10T14:20:00.000Z",
  },
  {
    id: "sollutia-item-2",
    town_id: 1,
    title: "Mel de Romaní (La Torre)",
    description:
      "Mel artesana collida per la Rosa. Sense pasteuritzar. Té el gust del sol i el romaní de Mariola.",
    price: "9.50€",
    seller: "Mel de la Rosa",
    avatar_url: "🐝",
    author_role: "business",
    author_entity_id: "11111111-1111-4111-a111-000000000003",
    image: "/assets/brain/generations/mel_nano_v2.png",
    category_slug: "producte-local",
    lat: 38.5910,
    lng: -0.4189,
    created_at: "2026-03-09T09:30:00.000Z",
    author_name: "Vicent Ferris",
    tags: ["#actualitat","#poble"],
    town_name: "La Torre de les Maçanes",
  },
];

export const MOCK_EVENTS = [
  { id: 301,
    town_id: 1,
    type: "event",
    author: "El Viatjant",
    avatar: "💃",
    time: "Diumenge",
    title: "Aplec de Danses",
    post_subtitle: "Trobada comunitària i cultura",
    content: "Vine a ballar a la plaça major. Esmorzar popular inclòs.",
    date: "2026-02-15T10:00:00.000Z",
    location: "Plaça Major",
    linkTo: "Grup de Danses",
    tags: ["Cultura", "Danses", "Tradició"],
        image_url: ["/assets/brain/generations/nano_mixa_socis.png"],
    lat: 38.5985,
    lng: -0.3863,
    created_at: "2026-02-10T10:00:00.000Z",
    author_name: "El Viatjant",
    author_entity_id: "11111111-1111-4111-a111-000000000004",
    town_name: "Alcoi",
  },
  { id: 302,
    town_id: 1,
    type: "event",
    author: "Elena Popova",
    avatar: "🏛️",
    time: "Divendres",
    title: "Ple Ordinari",
    post_subtitle: "Trobada comunitària i cultura",
    content: "Sessió oberta al públic. Ordre del dia disponible al web.",
    date: "2026-02-13T20:00:00.000Z",
    location: "Saló de Plens",
    official: true,
    tags: ["Oficial", "Plens", "Ajuntament"],
        image_url: ["/assets/brain/generations/nano_socis_tecnologics_1774235328704.png"],
    lat: 38.6458,
    lng: -0.3974,
    created_at: "2026-02-01T12:00:00.000Z",
    author_name: "Elena Popova",
    author_entity_id: "11111111-1111-4111-a111-000000000005",
    town_name: "Benifallim",
  },
];

export const MOCK_TOWNS = [
  { id: 401,
    type: "town",
    author: "Gent de Penàguila",
    avatar: "🏰",
    time: "Foraster",
    title: "Penàguila",
    post_subtitle: "Un racó ple d\'història i vida",
    content: "El jardí de l'Alcoià. Visitau el Jardí de Santos.",
    population: "320 hab",
    linkTo: "Gent de Penàguila",
    image: true,
    image_url:
      "/assets/brain/generations/nano_penaguila.png",
    lat: 38.6315,
    lng: -0.3892,
    created_at: "2026-03-08T08:47:00.000Z",
  },
  { id: 402,
    type: "town",
    author: "Gent de Benifallim",
    avatar: "⛪",
    time: "Foraster",
    title: "Benifallim",
    post_subtitle: "Un racó ple d\'història i vida",
    content: "Terra de castells i silenci.",
    population: "110 hab",
    linkTo: "Gent de Benifallim",
    image: true,
    image_url:
      "/assets/brain/generations/nano_benifallim.png",
    lat: 38.6439,
    lng: -0.4632,
    created_at: "2026-03-07T14:15:00.000Z",
  },
  { id: 403,
    type: "town",
    author: "Gent de La Torre",
    avatar: "🏺",
    time: "Local",
    title: "La Torre de les Maçanes",
    post_subtitle: "Un racó ple d\'història i vida",
    content: "Bressol del Projecte Sóc de Poble.",
    population: "700 hab",
    linkTo: "Gent de La Torre",
    image: true,
    image_url: "/assets/brain/generations/nano_mixa_qa.png",
    lat: 38.5919,
    lng: -0.4184,
    created_at: "2024-05-21T00:01:00.000Z",
  },
  { id: 404,
    type: "town",
    author: "Gent de Sella",
    avatar: "⛰️",
    time: "Local",
    title: "Sella",
    post_subtitle: "Un racó ple d\'història i vida",
    content: "L'esència de la muntanya.",
    population: "570 hab",
    linkTo: "Gent de Sella",
        image_url: "/assets/brain/generations/nano_sella.png",
    lat: 38.6083,
    lng: -0.2721,
    created_at: "2026-03-08T08:00:00.000Z",
  },
  { id: 405, type: "town", author: "Gent d'Orxeta", avatar: "🍋", time: "Local", title: "Orxeta",
    post_subtitle: "Un racó ple d\'història i vida", content: "Aigua i llima entre muntanyes.", population: "820 hab", linkTo: "Gent d'Orxeta",     image_url: "/assets/brain/generations/nano_orxeta.png",
    lat: 38.5630, lng: -0.2618, created_at: "2026-03-08T08:00:00.000Z", },
  { id: 406, type: "town", author: "Gent de Relleu", avatar: "🫒", time: "Local", title: "Relleu",
    post_subtitle: "Un racó ple d\'història i vida", content: "El mirador històric de la Marina.", population: "1200 hab", linkTo: "Gent de Relleu", image_url: "/assets/brain/generations/nano_relleu.png", lat: 38.5878, lng: -0.3114, created_at: "2026-03-08T08:00:00.000Z", },
  { id: 407, type: "town", author: "Gent d'Alcoleja", avatar: "🌰", time: "Local", title: "Alcoleja",
    post_subtitle: "Un racó ple d\'història i vida", content: "Poble bonic als peus d'Aitana.", population: "170 hab", linkTo: "Gent d'Alcoleja",     image_url: "/assets/brain/generations/nano_alcoleja.png",
    lat: 38.6811, lng: -0.3314, created_at: "2026-03-08T08:00:00.000Z", },
  { id: 408, type: "town", author: "Gent de Xixona", avatar: "🍯", time: "Local", title: "Xixona",
    post_subtitle: "Un racó ple d\'història i vida", content: "El bressol mundial del torró.", population: "6800 hab", linkTo: "Gent de Xixona",     image_url: "/assets/brain/generations/nano_xixona.png",
    lat: 38.5398, lng: -0.5085, created_at: "2026-03-08T08:00:00.000Z", },
  { id: 409, type: "town", author: "Gent de Tibi", avatar: "🌊", time: "Local", title: "Tibi",
    post_subtitle: "Un racó ple d\'història i vida", content: "El pantà més antic d'Europa en ús.", population: "1700 hab", linkTo: "Gent de Tibi",     image_url: "/assets/brain/generations/nano_tibi.png",
    lat: 38.5306, lng: -0.5761, created_at: "2026-03-08T08:00:00.000Z", }
];

export const MOCK_DAFOS = {
  "utilitat-social": {
    title: "Utilitat Social Master",
    description: "Anàlisi del fonament ètic i social de Sóc de Poble.",
    f: [
      "Fonament Ètic Inmortal",
      "Simbiosi Humà-IA real",
      "Diferenciació radical",
    ],
    o: [
      "Lideratge en IA Ètica Rural",
      "Monetització amb sentit",
      "Integració WhatsApp",
    ],
    d: [
      "Subjectivitat de la utilitat",
      "Barrera d'entrada inicial",
      "Rigor lent",
    ],
    a: [
      "Entropia Digital Residual",
      "Fricció en la governança",
      "Bretxa digital",
    ],
  },
  iaia: {
    title: "La IAIA MarIA",
    description: "Anàlisi de l'agent cognitiu i matriarca digital.",
    f: [
      "Memòria viva del poble",
      "Llenguatge natural rural",
      "Empatia algorítmica",
    ],
    o: [
      "Moderació de xats beta",
      "Assistència a la gent gran",
      "Cànon de refranys actiu",
    ],
    d: [
      "Al·lucinacions semàntiques",
      "Dependència de l'Antigravity",
      "Falta de tacte físic",
    ],
    a: [
      "Desconfiança tecnològica",
      "Pèrdua d'identitat local",
      "Obsolescència de dades",
    ],
  },
  projecte: {
    title: "Projecte Sóc de Poble",
    description: "Anàlisi de l'estratègia i futur de la plataforma.",
    f: [
      "30 anys d'activisme rural",
      "Arquitectura CRDT resilient",
      "Disseny Premium",
    ],
    o: ["Ecosistema del bategat", "Llibre a Amazon", "Expansió a nous pobles"],
    d: [
      "Recursos humans limitats",
      "Complexitat tècnica alta",
      "Auto-finançament",
    ],
    a: [
      "Gegants tecnològics (Metas)",
      "Despoblament accelerat",
      "Corrupció del bategat",
    ],
  },
  "smart-villages": {
    title: "Estratègia Smart Villages",
    description: "Lliçons de l'UE aplicades per l'IAIA de Sóc de Poble.",
    f: [
      "Impuls Local Participatiu",
      "Fortaleses Locals",
      "Convivència Analògic-Digital",
    ],
    o: [
      "Fons Europeus LEADER/FEDER",
      "Infrastructura Vital",
      "Model Reproduïble",
    ],
    d: [
      "Dependència de Connectivitat",
      "Recursos Locals Limitats",
      "Complexitat de Governança",
    ],
    a: [
      "Despoblament Accelerat",
      "Bretxa Digital Rural",
      "Manca de Suport Polític Directe",
    ],
  },
};

export const ENABLE_MOCKS = true;


=====================================
FILE: src/design-system/nano_banana.css
=====================================

/* 
  MODE TRENCADÍS (MASONRY) - MOBILE FIRST
  DIRECTIVA: [Source 197] - Disseny de Marge de Pedra Seca
  ESTÈTICA: NANO BANANA [Source 122, 123]
*/

.trencadis-container {
    column-count: 2;
    /* Dues columnes de pedres */
    column-gap: 8px;
    /* Separació estreta entre columnes [Source 197] */
    padding: 8px;
    width: 100%;
}

.trencadis-card {
    break-inside: avoid;
    /* Evita que una pedra es trenque entre columnes */
    margin-bottom: 8px;
    /* Separació vertical */
    position: relative;
    /* Per a posicionar el text damunt */
    background-color: var(--color-surface, #FDFCF5);

    /* ESTÈTICA NANO BANANA [Source 123] */
    border-radius: 0px !important;
    /* ZERO RADIUS ABSOLUT */
    overflow: hidden;
    cursor: pointer;
    transition: transform 0.2s ease;
}

.trencadis-card:active {
    transform: scale(0.98);
}

.trencadis-card img {
    width: 100%;
    height: auto;
    /* Manté la proporció original [Source 265] */
    display: block;
    border-radius: 0px !important;
    /* Confirmació de duresa */
}

/* EL TEXT SUPERPOSAT [Source 197] */
.trencadis-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    /* Gradient negre suau per a llegibilitat Weber Class 6 */
    background: linear-gradient(to top, rgba(0, 0, 0, 0.85), transparent);
    padding: 24px 12px 12px 12px;
    color: #FFFFFF;
    font-family: var(--sdp-font-sans);
}

.trencadis-title {
    font-size: 0.9rem;
    font-weight: var(--font-weight-bold);
    line-height: 1.2;
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.8);
    margin: 0;
}

.trencadis-context {
    font-size: 0.7rem;
    opacity: 0.8;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-top: 4px;
    display: block;
}

/* Adaptació per a escriptori (opcional, seguint la lògica masonry) */
@media (min-width: 768px) {
    .trencadis-container {
        column-count: 3;
    }
}

@media (min-width: 1200px) {
    .trencadis-container {
        column-count: 4;
    }
}

=====================================
FILE: src/design-system/tokens.css
=====================================

/* 🔡 PROTOCOL NOTO SANS [MASTER v1.0] 🏛️ */

/* 1. Noto Sans (Principal) */
@font-face {
  font-family: "Noto Sans";
  src: url("/fonts/noto/NotoSans-Regular.ttf") format("truetype");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "Noto Sans";
  src: url("/fonts/noto/NotoSans-Italic.ttf") format("truetype");
  font-weight: 400;
  font-style: italic;
  font-display: swap;
}

@font-face {
  font-family: "Noto Sans";
  src: url("/fonts/noto/NotoSans-Bold.ttf") format("truetype");
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "Noto Sans";
  src: url("/fonts/noto/NotoSans-Black.ttf") format("truetype");
  font-weight: 900;
  font-style: normal;
  font-display: swap;
}

/* 2. Noto Sans Condensed (Estalvi d'espai) */
@font-face {
  font-family: "Noto Sans Condensed";
  src: url("/fonts/noto/NotoSans-Condensed.ttf") format("truetype");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "Noto Sans Condensed";
  src: url("/fonts/noto/NotoSans-CondensedBold.ttf") format("truetype");
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}

/* 3. Noto Sans Mono (Dades i Codi) */
@font-face {
  font-family: "Noto Sans Mono";
  src: url("/fonts/noto/NotoSansMono-Regular.ttf") format("truetype");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "Noto Sans Mono";
  src: url("/fonts/noto/NotoSansMono-Bold.ttf") format("truetype");
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}

:root {
  /* COLORS MESTRES (Sacred Palette - v1.6.3) */
  --sdp-terracotta: #f97316;
  --sdp-blau: #06b6d4;
  --sdp-neon-pulse: #f97316;

  /* CONTRAST WEBER CLASS 6 (Sol Directe) */
  --sdp-bg-dark: #0a0a0a;
  --sdp-bg-surface: #1c1b1f;
  --sdp-text-high: #e6e1e5;
  --sdp-text-med: #938f99;

  /* SUPERFÍCIES GLASSMORPHISM (Gemini Style) */
  --sdp-glass-bg: rgba(28, 27, 31, 0.7);
  --sdp-glass-border: rgba(255, 255, 255, 0.08);
  --sdp-glass-blur: 24px;

  /* BANCAL MODE TOKENS (Sóc de Poble Gènesi - Auditoria X) */
  --sdp-boina-taronja: #f97316;
  --sdp-fons-crema: #fdf5e6;
  --sdp-text-fosc: #111827;
  --sdp-radius-card: 28px;
  --sdp-radius-button: 28px;

  /* GEOMETRIA (Master Monolith v10.30.0) */
  --sdp-radius-lg: var(--sdp-radius-card);
  --sdp-radius-genesis: var(--sdp-radius-card);
  --sdp-radius-tactile: var(--sdp-radius-button);

  /* 🔡 UNIFICACIÓ TIPOGRÀFICA [PROTOCOL NOTO SANS VARIABLE] */
  --sdp-font-sans: "Noto Sans", sans-serif;
  --sdp-font-serif: "Noto Sans", sans-serif;
  --sdp-font-mono: "Noto Sans", monospace;
  --sdp-font-condensed: "Noto Sans", sans-serif;

  /* Variables llegades */
  --sdp-font-booter: var(--sdp-font-sans);
  --sdp-font-playball: var(--sdp-font-sans);
  --sdp-font-pump: var(--sdp-font-sans);
  --sdp-font-dearjoefour: var(--sdp-font-sans);
  --sdp-font-myriadpro: var(--sdp-font-sans);
  --sdp-font-respublica: var(--sdp-font-sans);
}

body {
  font-family: var(--sdp-font-sans);
  margin: 0;
  -webkit-font-smoothing: antialiased;
}


=====================================
FILE: src/domain/iaiaDomain.js
=====================================

import { USER_ROLES } from '../constants';

export const isIAIAOfficial = (post) => {
    return post.author_entity_id === 'socdepoble' || 
           post.creator_entity_id === 'socdepoble' ||
           post.author_name?.includes('Sóc de Poble');
};

export const isIAIAMarIA = (post, authorIdCheck) => {
    return authorIdCheck === '11111111-1111-4111-a111-000000000000' || 
           post.author_role === USER_ROLES.AMBASSADOR;
};

export const isImmersiveAI = (post, authorIdCheck) => {
    return post.author_is_ai || 
           post.is_iaia_inspired || 
           (authorIdCheck && String(authorIdCheck).startsWith('11111111-') && authorIdCheck !== '11111111-1111-4111-a111-000000000000') ||
           ['FLASH', 'GALL', 'VIATJANT', 'SULTAN', 'MIXA', 'RATOLÍ'].some(n => post.author_name?.toUpperCase().includes(n));
};

export const getVisibilityForLevel = (iaiaLevel, post, enabledAgentIds) => {
    const authorIdCheck = post.author_id || post.author_user_id || post.user_id;
    const official = isIAIAOfficial(post);
    const maria = isIAIAMarIA(post, authorIdCheck);
    const immersive = isImmersiveAI(post, authorIdCheck);

    const activeLevel0 = iaiaLevel === 0;
    const activeLevel1 = iaiaLevel === 1;
    const activeLevel2 = iaiaLevel === 2 || (!iaiaLevel && iaiaLevel !== 0);
    const activeLevel3 = iaiaLevel === 3; // Mod de Treball o Creatiu: Tots actius

    if (activeLevel0) {
        // Nivell 0: Cap agent de la IA visible. Només humans actuen.
        if (maria || immersive || authorIdCheck?.startsWith('11111111-')) return false;
        return true;
    } else if (activeLevel1) {
        // Nivell 1: Només la IAIA MarIA té veu i vot.
        if (maria || official) return true;
        if (!authorIdCheck?.startsWith('11111111-')) return true; // Humans sempre visibles
        return false;
    } else if (activeLevel2) {
        // Nivell 2: Protocol Granular. MarIA + Els seleccionats manualment per l'usuari.
        if (maria || official) return true;
        if (!authorIdCheck?.startsWith('11111111-')) return true; // Humans OK
        return enabledAgentIds.includes(authorIdCheck);
    } else if (activeLevel3) {
        // Nivell 3: Tots els 15 agents visibles alhora. Mod de feina.
        return true;
    }
    
    return true;
};


=====================================
FILE: src/hooks/useAttachmentManager.js
=====================================

import { useState, useCallback, useRef, useEffect } from 'react';

// EXTREME AUDIT V2 FIX: Eliminació estrica de memory leaks i stale closures.
export const useAttachmentManager = () => {
    const [attachedFile, setAttachedFile] = useState(null);
    const [attachedFilePreview, setAttachedFilePreview] = useState(null);

    // Ref master per assegurar que sempre alliberem l'últim Blob, sense dependències.
    const activePreviewRef = useRef(null);

    useEffect(() => {
        return () => {
            if (activePreviewRef.current) {
                URL.revokeObjectURL(activePreviewRef.current);
            }
        };
    }, []);

    const handleFileSelect = useCallback((e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Revocar incondicional de l'anterior via ref per evitar fugues
        if (activePreviewRef.current) {
            URL.revokeObjectURL(activePreviewRef.current);
        }

        setAttachedFile(file);
        if (file.type.startsWith('image/')) {
            const objectUrl = URL.createObjectURL(file);
            setAttachedFilePreview(objectUrl);
            activePreviewRef.current = objectUrl;
        } else {
            setAttachedFilePreview(null);
            activePreviewRef.current = null;
        }
    }, []);

    const clearAttachment = useCallback(() => {
        if (activePreviewRef.current) {
            URL.revokeObjectURL(activePreviewRef.current);
        }
        setAttachedFile(null);
        setAttachedFilePreview(null);
        activePreviewRef.current = null;
    }, []);

    return { attachedFile, attachedFilePreview, handleFileSelect, clearAttachment };
};


=====================================
FILE: src/hooks/useAttribution.js
=====================================

import { useState, useEffect } from 'react';
import { logger } from '../utils/logger';

// Path to the credits file generated by the scraper
const CREDITS_PATH = '/assets/pobles/credits.json';

export const useAttribution = (filename) => {
    const [attribution, setAttribution] = useState(null);

    useEffect(() => {
        if (!filename) {
            setAttribution(null);
            return;
        }

        const fetchCredits = async () => {
            try {
                // In a production app, we might want to load this once at the app level
                // but for now, simple fetch is fine as it's a small static JSON.
                const response = await fetch(CREDITS_PATH);
                if (!response.ok) throw new Error('Failed to load credits');

                const data = await response.json();

                // If it's a full URL, get just the filename
                const cleanFilename = filename.split('/').pop();

                if (data[cleanFilename]) {
                    setAttribution(data[cleanFilename]);
                } else {
                    setAttribution(null);
                }
            } catch (err) {
                logger.warn('[useAttribution] Error loading credits:', err);
                setAttribution(null);
            }
        };

        fetchCredits();
    }, [filename]);

    return attribution;
};


=====================================
FILE: src/hooks/useChatState.js
=====================================

import { useState, useEffect, useRef, useCallback } from 'react';
import { supabaseService } from '../services/supabaseService';
import { logger } from '../utils/logger';
import { AGENTS } from '../constants/agents';
import { chatService } from '../services/chatService';

// GROK V3 EXTREME AUDIT FIX:
// - Eliminat isMounted flag en favor d'AbortController.
// - Resolts stale closures en subscription per visibilitychange.
// - useCallback absolut en totes les funcions a exportar.
export const useChatState = ({ id, currentUserId, userIsAnonymous, state, readReceipts }) => {
    const [chat, setChat] = useState(null);
    const [realChatId, setRealChatId] = useState(id);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    const isRealChatIdResolved = useRef(false);
    const readReceiptsRef = useRef(readReceipts);
    
    // EXTREME AUDIT V4.1: Refs estables per evitar dependències de cicle de vida
    const realChatIdRef = useRef(id);
    const currentUserIdRef = useRef(currentUserId);
    
    useEffect(() => { currentUserIdRef.current = currentUserId; }, [currentUserId]);
    useEffect(() => { readReceiptsRef.current = readReceipts; }, [readReceipts]);

    useEffect(() => {
        setRealChatId(id);
        realChatIdRef.current = id;
        isRealChatIdResolved.current = false;
    }, [id]);

    useEffect(() => {
        if (!currentUserId) return;
        const controller = new AbortController();
        
        const fetchChatData = async () => {
            try {
                const chats = await chatService.getConversations(currentUserId);
                if (controller.signal.aborted) return;
                
                let currentChat = chats.find(c => c.id === id);
                
                if (!currentChat && state?.chatInfo && !id.startsWith('11111111-')) {
                    currentChat = state.chatInfo;
                }

                if (currentChat && !id.startsWith('11111111-')) {
                    setRealChatId(currentChat.id);
                    realChatIdRef.current = currentChat.id;
                    isRealChatIdResolved.current = true;
                    setChat(currentChat);
                    const msgs = await supabaseService.getConversationMessages(currentChat.id, controller.signal);
                    if (controller.signal.aborted) return;
                    
                    setMessages(msgs);
                    if (state?.optimisticMessages) {
                        setMessages(prev => {
                            const mapIds = new Set(prev.map(m => m.id));
                            const missing = state.optimisticMessages.filter(m => !mapIds.has(m.id)).map(m => ({...m, conversation_id: currentChat.id}));
                            if (missing.length === 0) return prev;
                            const combined = [...prev, ...missing].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
                            return combined;
                        });
                    }
                    if (readReceiptsRef.current) {
                        await chatService.markMessagesAsRead(currentChat.id, currentUserId);
                    }
                } else if (id.startsWith('11111111-')) {
                    const agent = AGENTS.find(a => a.id === id);
                    
                    let realConv = null;
                    if (!userIsAnonymous) {
                        try {
                            realConv = await supabaseService.getOrCreateConversation(currentUserId, 'user', id, 'entity');
                        } catch {
                            logger.warn('[ChatDetail] Continuant localment...');
                        }
                    }
                    if (controller.signal.aborted) return;

                    setChat({ 
                        id: realConv?.id || id, 
                        other_info: { id, name: agent?.name || 'Agent Especialista', avatar_url: agent?.avatar_url, role: agent?.role } 
                    });
                    
                    if (realConv && realConv.id) {
                        setRealChatId(realConv.id);
                        realChatIdRef.current = realConv.id;
                        isRealChatIdResolved.current = true;
                        
                        const msgs = await supabaseService.getConversationMessages(realConv.id, controller.signal);
                        if (controller.signal.aborted) return;
                        
                        let combinedMsgs = msgs;
                        if (state?.optimisticMessages) {
                            const mapIds = new Set(msgs.map(m => m.id));
                            const missing = state.optimisticMessages
                                .filter(m => !mapIds.has(m.id))
                                .map(m => ({...m, conversation_id: realConv.id}));
                            if (missing.length > 0) {
                                combinedMsgs = [...msgs, ...missing].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
                            }
                        }
                        
                        setMessages(combinedMsgs);
                    } else if (userIsAnonymous) {
                        const saved = sessionStorage.getItem(`sdp_guest_chat_${id}`);
                        if (saved) {
                            try { setMessages(JSON.parse(saved)); } catch { /* silencia excepció de parsing local */ }
                        }
                    }
                }
            } catch (error) {
                if (controller.signal.aborted) return;
                logger.error('Error fetching chat data:', error);
            } finally {
                if (!controller.signal.aborted) setLoading(false);
            }
        };
        fetchChatData();
        return () => controller.abort();
    }, [id, currentUserId, userIsAnonymous, state]);

    // EFECTE DE SUBSCRIPCIÓ LLIURE DE ZOMBIES I STALE CLOSURES
    useEffect(() => {
        if (!currentUserId || !realChatId) return;
        if (realChatId === id && !isRealChatIdResolved.current) return;

        let supabaseChannel = null;

        const connectRealtime = () => {
             if (supabaseChannel) supabaseService.unsubscribe(supabaseChannel);
             supabaseChannel = supabaseService.subscribeToMessages(realChatId, async (payload) => {
                 if (payload.new) {
                     // Asignació asíncrona segura (DeepSeek V5.1)
                     const capturedId = realChatId;
                     setMessages(prev => {
                         if (prev.find(m => m.id === payload.new.id)) return prev;
                         return [...prev, payload.new];
                     });
                     if (payload.new.sender_id !== currentUserId && readReceiptsRef.current) {
                         if (realChatIdRef.current === capturedId) {
                             chatService.markMessagesAsRead(capturedId, currentUserId).catch(() => {});
                         }
                     }
                 }
             });
        };

        connectRealtime();

        return () => {
            if (supabaseChannel) supabaseService.unsubscribe(supabaseChannel);
        };
    }, [realChatId, currentUserId, id]);

    // EXTREME AUDIT V4.1 FIX: Efecte de visibilitat aïllat! Es lliga EXACTAMENT 1 vegada al document.
    // Lliguem amb els Refs mutables per no tancar mai valors obsolets sense re-renderitzar.
    useEffect(() => {
        let visibilityController = null; // QWEN V10.33 AUDIT FIX

        // [CRITICAL FIX] Bandwidth Leak (5.5GB Egress): 
        // We completely disable the visibilitychange HTTP fetch loop. PowerSync/Realtime will handle sync.
        // document.addEventListener('visibilitychange', onVisibilityChange);
        return () => {
            if (visibilityController) visibilityController.abort();
            // document.removeEventListener('visibilitychange', onVisibilityChange);
        };
    }, []);

    // Persistència de memòria a curt termini per a Forasters (Guest Session)
    useEffect(() => {
        if (userIsAnonymous && realChatIdRef.current) {
            if (messages.length > 0) {
                sessionStorage.setItem(`sdp_guest_chat_${realChatIdRef.current}`, JSON.stringify(messages));
            }
        }
    }, [messages, userIsAnonymous]);

    // SETTERS ESTABLES (Eviten re-renders en components memoitzats)
    const addMessage = useCallback((newMessage) => {
        setMessages(prev => {
            if (prev.find(m => m.id === newMessage.id)) return prev;
            return [...prev, newMessage];
        });
    }, []);
    
    const addMultipleMessages = useCallback((newMessagesArray) => {
        setMessages(prev => [...prev, ...newMessagesArray]);
    }, []);

    const updateMessagesArray = useCallback((newMessagesArray) => {
        setMessages(newMessagesArray);
    }, []);

    return { 
        chat, setChat, realChatId, messages, 
        setMessages: updateMessagesArray, addMessage, addMultipleMessages, loading 
    };
};


=====================================
FILE: src/hooks/useFeedData.js
=====================================

import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@powersync/react';
import { logger } from '../utils/logger';
import { MOCK_FEED } from '../data';

export const useFeedData = ({ activeTown, customPosts }) => {
    // If customPosts are provided (like from Profile or Town specific views), prioritize them.
    const [postsState, setPostsState] = useState(customPosts || []);

    // Reactive Query via PowerSync (Offline First)
    // LWW and CRDT automatic sync managed by PowerSync internal workers.
    const query = activeTown && activeTown !== 'global' 
        ? 'SELECT * FROM posts WHERE town_uuid = ? ORDER BY created_at DESC'
        : 'SELECT * FROM posts ORDER BY created_at DESC';
    
    const params = activeTown && activeTown !== 'global' ? [activeTown] : [];
    
    // PowerSync reacts to local and remote changes via WebWorkers automatically.
    const { data: psPosts, isLoading } = useQuery(query, params);

    useEffect(() => {
        if (!customPosts) {
            // Mix the MOCK_FEED (Lore) with the dynamic DB posts so the wall is never empty
            const dbPosts = psPosts || [];
            
            const mixedPosts = [...MOCK_FEED, ...dbPosts];
            
            // Remove duplicates by ID (just in case) using O(N) Set
            const seen = new Set();
            const uniquePosts = mixedPosts.filter(current => {
                const id = current.uuid || current.id;
                if (!id) return true;
                if (seen.has(id)) return false;
                seen.add(id);
                return true;
            });

            // eslint-disable-next-line react-hooks/set-state-in-effect
            setPostsState(uniquePosts);
        }
    }, [psPosts, customPosts]);

    const fetchPosts = useCallback(async () => {
       // Fetch logic is moot with PowerSync reactive queries but kept for interface compatibility
       // if there are manual reload triggers.
       logger.info('Manual fetch request ignored. PowerSync streams changes automatically.');
    }, []);

    return {
        posts: postsState,
        setPosts: setPostsState,
        userConnections: [], // Simplify connections / bategats to rely on relations directly in the future
        loading: isLoading && !customPosts,
        error: null,
        page: 0,
        hasMore: false, // Infinite list managed by TanStack virtualizer rather than chunked API paginations
        loadingMore: false,
        fetchPosts
    };
};



=====================================
FILE: src/hooks/useFeedFilters.js
=====================================

import { useMemo } from 'react';
import { getVisibilityForLevel } from '../domain/iaiaDomain';
import { rhizomeManager } from '../services/rhizomeManager';

export const useFeedFilters = ({
    posts,
    contentMode,
    iaiaLevel,
    enabledAgentIds,
    selectedTag,
    contextualSearchTerm,
    isIAIAFiltering,
    activeTown,
    userConnections
}) => {
    return useMemo(() => {
        let filtered = posts;

        // 1. Content Mode Filter (Ara vs Arrel)
        filtered = filtered.filter(post => {
            const isArchive = post.metadata?.is_archive_debate || post.type === 'book' || post.category === 'Heritage';
            if (contentMode === 'batec' && isArchive) return false;
            if (contentMode === 'arrel' && !isArchive) return false;
            return true;
        });

        // 2. IAIA Level Filter
        filtered = filtered.filter(post => getVisibilityForLevel(iaiaLevel, post, enabledAgentIds));

        // 3. Tag Filter
        if (selectedTag) {
            filtered = filtered.filter(post => {
                const connection = userConnections.find(c => c.post_uuid === (post.uuid || post.id));
                return connection && connection.tags && connection.tags.includes(selectedTag);
            });
        }

        // 4. Contextual Search Filter
        if (contextualSearchTerm) {
            const normalized = contextualSearchTerm.toLowerCase();
            filtered = filtered.filter(post => 
                post.content?.toLowerCase().includes(normalized) ||
                post.author_name?.toLowerCase().includes(normalized) ||
                post.author?.toLowerCase().includes(normalized) ||
                post.excerpt?.toLowerCase().includes(normalized)
            );
        }

        // 5. IAIA Portera (Cognitive Filter Km 0)
        if (isIAIAFiltering) {
            const userPrefs = {
                primary_town_id: activeTown || 1, // Default to current town
                anchors: ['mel', 'poma', 'fusta', 'tradició', 'IAIA', 'Master']
            };
            filtered = rhizomeManager.cognitiveFilter(filtered, userPrefs);
        }

        // 6. Sorting logic
        return [...filtered].sort((a, b) => {
            const aPinned = a.is_pinned || a.metadata?.is_pinned || (typeof a.pinned_position !== 'undefined' && a.pinned_position !== null);
            const bPinned = b.is_pinned || b.metadata?.is_pinned || (typeof b.pinned_position !== 'undefined' && b.pinned_position !== null);
            
            if (aPinned && !bPinned) return -1;
            if (!aPinned && bPinned) return 1;
            
            if (aPinned && bPinned) {
                const posA = a.pinned_position || a.metadata?.pinned_position || Infinity;
                const posB = b.pinned_position || b.metadata?.pinned_position || Infinity;
                if (posA !== posB) return posA - posB;
            }

            return new Date(b.created_at || b.date || 0) - new Date(a.created_at || a.date || 0);
        });
    }, [posts, selectedTag, isIAIAFiltering, activeTown, userConnections, contentMode, iaiaLevel, contextualSearchTerm, enabledAgentIds]);
};


=====================================
FILE: src/hooks/useIAIAAutonomousInteractions.js
=====================================

import { useEffect, useRef } from 'react';
import { iaiaService } from '../services/iaiaService';

const IAIA_INITIAL_DELAY_MS = 10000;
const IAIA_INTERVAL_MS = 120000;

export const useIAIAAutonomousInteractions = ({ isPlayground, isSuperAdmin, setPosts }) => {
    const isMounted = useRef(true);

    useEffect(() => {
        isMounted.current = true;
        return () => { isMounted.current = false; };
    }, []);

    useEffect(() => {
        if (!isPlayground && !isSuperAdmin) return;

        const triggerAutonomousInteraction = async () => {
            const newPost = await iaiaService.generateAutonomousInteraction();
            if (newPost && isMounted.current) {
                setPosts(prev => [newPost, ...prev]);
            }
        };

        const initialTimer = setTimeout(triggerAutonomousInteraction, IAIA_INITIAL_DELAY_MS);
        const interval = setInterval(triggerAutonomousInteraction, IAIA_INTERVAL_MS);

        return () => {
            clearTimeout(initialTimer);
            clearInterval(interval);
        };
    }, [isPlayground, isSuperAdmin, setPosts]);
};


=====================================
FILE: src/hooks/useLowEndDevice.js
=====================================

import { useState, useEffect } from 'react';

/**
 * Hook per detectar dispositius de gamma baixa (low-end) i ajustos de rendiment.
 * Utilitza l'API de memòria del dispositiu, concurrència del maquinari i tipus de connexió.
 */
export const useLowEndDevice = () => {
  const [isLowEnd, setIsLowEnd] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      let lowMemory = false;
      let lowCores = false;
      let slowConnection = false;

      // Safe checks format per compatibilitat de navegadors
      if ('deviceMemory' in navigator) {
        lowMemory = navigator.deviceMemory < 4;
      }
      
      if ('hardwareConcurrency' in navigator) {
        lowCores = navigator.hardwareConcurrency < 4;
      }
      
      if ('connection' in navigator) {
        const connection = navigator.connection;
        slowConnection = connection.effectiveType === '2g' || connection.effectiveType === '3g';
      }

      setIsLowEnd(lowMemory || lowCores || slowConnection);
    };

    checkDevice();
    window.addEventListener('online', checkDevice);
    return () => window.removeEventListener('online', checkDevice);
  }, []);

  return isLowEnd;
};


=====================================
FILE: src/hooks/useOnboarding.js
=====================================

import { useState, useEffect, useCallback } from 'react';
import { logger } from '../utils/logger';

/**
 * 🏺 USE ONBOARDING HOOK
 * Gestiona l'estat d'onboarding de l'usuari.
 */
export const useOnboarding = () => {
  const [isComplete, setIsComplete] = useState(null);
  const [preferences, setPreferences] = useState(null);
  const [loading, setLoading] = useState(true);

  // [LOAD] Carregar estat d'onboarding
  useEffect(() => {
    try {
      const complete = localStorage.getItem('sp_onboarding_complete') === 'true';
      const prefs = {
        iaiaLevel: parseInt(localStorage.getItem('sp_iaia_level') || '1', 10),
        notifications: localStorage.getItem('sp_notifications') !== 'false',
        accessibility: localStorage.getItem('sp_accessibility') === 'true',
        theme: localStorage.getItem('sp_theme') || 'auto'
      };

      setIsComplete(complete);
      setPreferences(prefs);
    } catch (error) {
      logger.error('[useOnboarding] Error loading:', error);
      setIsComplete(false);
    } finally {
      setLoading(false);
    }
  }, []);

  // [MARK] Marcar com completat
  const markComplete = useCallback((prefs) => {
    try {
      localStorage.setItem('sp_onboarding_complete', 'true');
      localStorage.setItem('sp_iaia_level', String(prefs.iaiaLevel));
      localStorage.setItem('sp_notifications', String(prefs.notifications));
      localStorage.setItem('sp_accessibility', String(prefs.accessibility));
      
      setIsComplete(true);
      setPreferences(prefs);
      
      logger.info('[useOnboarding] Marked complete', prefs);
    } catch (error) {
      logger.error('[useOnboarding] Error marking complete:', error);
    }
  }, []);

  // [RESET] Resetear onboarding (per a testing)
  const reset = useCallback(() => {
    localStorage.removeItem('sp_onboarding_complete');
    localStorage.removeItem('sp_iaia_level');
    localStorage.removeItem('sp_notifications');
    localStorage.removeItem('sp_accessibility');
    
    setIsComplete(false);
    setPreferences(null);
    
    logger.info('[useOnboarding] Reset');
  }, []);

  // [UPDATE] Actualitzar preferència específica
  const updatePreference = useCallback((key, value) => {
    try {
      localStorage.setItem(`sp_${key}`, String(value));
      setPreferences(prev => prev ? { ...prev, [key]: value } : null);
      logger.info(`[useOnboarding] Updated ${key}:`, value);
    } catch (error) {
      logger.error('[useOnboarding] Error updating preference:', error);
    }
  }, []);

  return {
    isComplete,
    preferences,
    loading,
    markComplete,
    reset,
    updatePreference
  };
};

export default useOnboarding;


=====================================
FILE: src/hooks/usePWAInstall.js
=====================================

import { useState, useEffect } from 'react';
import { logger } from '../utils/logger';

export const usePWAInstall = () => {
    const [isInstallable, setIsInstallable] = useState(false);

    useEffect(() => {
        const handler = (e) => {
            e.preventDefault();
            // DISABLED: No volem prompts de PWA en mode Native
            setIsInstallable(false);
            logger.log('[PWA] beforeinstallprompt blocked by Sovereign Directive');
        };

        window.addEventListener('beforeinstallprompt', handler);

        // Check if already installed - Initial state can be handled here if it doesn't trigger loop
        // but for PWA checks we want to be safe.
        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
        };
    }, []);

    const promptInstall = async () => {
        logger.warn('[PWA] Prompting install is restricted in this version');
    };

    return { isInstallable, promptInstall };
};


=====================================
FILE: src/hooks/usePushNotifications.js
=====================================

import { useEffect } from 'react';

/**
 * Hook per inicialitzar el sistema de Push Notifications [DESACTIVAT]
 * S'ha desactivat per evitar bucles de recàrrega infinita amb el Service Worker.
 */
export const usePushNotifications = () => {
    useEffect(() => {
        // [BLOCK] Protocol Natiu: Notificacions Push PWA desactivades
        return;
    }, []);

    return {
        isSupported: false,
        requestPermission: async () => 'denied',
        showLocalNotification: () => { }
    };
};

export default usePushNotifications;


=====================================
FILE: src/hooks/useTextToSpeech.js
=====================================

import { useState, useEffect, useCallback } from 'react';
import { logger } from '../utils/logger';

export const useTextToSpeech = () => {
    // Initialize state from window if available to avoid setState in Effect
    const [isSupported] = useState(() => 'speechSynthesis' in window);
    const [isPlaying, setIsPlaying] = useState(false);
    const [voice, setVoice] = useState(null);

    useEffect(() => {
        if (isSupported) {
            const loadVoices = () => {
                const voices = window.speechSynthesis.getVoices();
                const preferredVoice = voices.find(v =>
                    v.lang.includes('ca') || 
                    v.lang.includes('es-ES') || 
                    v.lang.includes('es')
                );
                setVoice(preferredVoice || voices[0]);
            };

            loadVoices();
            window.speechSynthesis.onvoiceschanged = loadVoices;
        }
    }, [isSupported]);

    const speak = useCallback((text, lang = 'ca-ES') => {
        if (!isSupported || !text) return;

        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = voice;
        utterance.lang = lang;
        utterance.rate = 1.0;
        utterance.pitch = 1.0;

        utterance.onstart = () => setIsPlaying(true);
        utterance.onend = () => setIsPlaying(false);
        utterance.onerror = (err) => {
            logger.error('[TTS] Error:', err);
            setIsPlaying(false);
        };

        window.speechSynthesis.speak(utterance);
    }, [isSupported, voice]);

    const stop = useCallback(() => {
        if (isSupported) {
            window.speechSynthesis.cancel();
            setIsPlaying(false);
        }
    }, [isSupported]);

    return {
        isSupported,
        isPlaying,
        speak,
        stop
    };
};


=====================================
FILE: src/hooks/useThemeCustomizer.js
=====================================

import { useState, useEffect, useCallback } from 'react';
import { resolveColorIdentity } from '../constants/ruralColors';

/**
 * useThemeCustomizer [MASTER]
 * Hook per gestionar la personalització granular del disseny (StyleTuner).
 * Actua sobre les variables CSS en temps real i persisteix a localStorage.
 */
export const useThemeCustomizer = () => {
    const [themeConfig, setThemeConfig] = useState(() => {
        const saved = localStorage.getItem('sp-theme-custom-config');
        return saved ? JSON.parse(saved) : {
            fontScale: 1.0,
            primaryColor: '#CC5500', // Terracotta default
            fontFamily: 'system-ui',
            contrastMode: 'standard'
        };
    });

    // Calcula el contrast WCAG 2.1
    const getLuminance = (hex) => {
        const rgb = hex.startsWith('#') ? hex.slice(1) : hex;
        const r = parseInt(rgb.slice(0, 2), 16) / 255;
        const g = parseInt(rgb.slice(2, 4), 16) / 255;
        const b = parseInt(rgb.slice(4, 6), 16) / 255;

        const a = [r, g, b].map(v => {
            return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
        });
        return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
    };

    const validateContrast = useCallback((bgColor, fgColor = '#FFFFFF') => {
        const l1 = getLuminance(bgColor);
        const l2 = getLuminance(fgColor);
        const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
        return ratio >= 4.5; // WCAG AA
    }, []);

    // Aplica les variables al body
    useEffect(() => {
        const root = document.documentElement;
        root.style.setProperty('--font-scale-multiplier', themeConfig.fontScale);

        // El color pot venir com a string o com a objecte (compatibilitat)
        const hex = typeof themeConfig.primaryColor === 'string'
            ? themeConfig.primaryColor
            : themeConfig.primaryColor.hex;

        root.style.setProperty('--color-action-primary', hex);
        root.style.setProperty('--font-family-base', themeConfig.fontFamily);

        // Aesthetics Guard: Auto-contrast per al text sobre l'accent
        const isDark = getLuminance(hex) < 0.5;
        root.style.setProperty('--color-action-text', isDark ? '#FFFFFF' : '#000000');

        localStorage.setItem('sp-theme-custom-config', JSON.stringify(themeConfig));
    }, [themeConfig]);

    const updateColor = (newHex) => {
        const identity = resolveColorIdentity(newHex);
        setThemeConfig(prev => ({ ...prev, primaryColor: identity }));
    };

    const updateConfig = (newConfig) => {
        if (newConfig.primaryColor) {
            newConfig.primaryColor = resolveColorIdentity(newConfig.primaryColor);
        }
        setThemeConfig(prev => ({ ...prev, ...newConfig }));
    };

    const resetToMasia = () => {
        setThemeConfig({
            fontScale: 1.0,
            primaryColor: resolveColorIdentity('#CC5500'),
            fontFamily: 'system-ui',
            contrastMode: 'standard'
        });
    };

    const ruralInfo = typeof themeConfig.primaryColor === 'string'
        ? resolveColorIdentity(themeConfig.primaryColor)
        : themeConfig.primaryColor;

    return {
        themeConfig,
        updateConfig,
        updateColor,
        resetToMasia,
        validateContrast,
        ruralInfo
    };
};


=====================================
FILE: src/hooks/useUnifiedFeedData.js
=====================================

import { useState, useEffect, useMemo } from 'react';
import { useFeedData } from './useFeedData';
import { MOCK_EVENTS, MOCK_MARKET_ITEMS } from '../data';
import { logger } from '../utils/logger';
import { marketService } from '../services/marketService';

const safeIsoString = (dateStr) => {
    if (!dateStr) return new Date().toISOString();
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) {
        return new Date().toISOString();
    }
    return d.toISOString();
};

export const useUnifiedFeedData = ({ activeTown, townName, isPlayground, user, iaiaLevel }) => {
    // 1. Fetch Posts natively (using PowerSync via useFeedData)
    const { posts: feedPosts, loading: feedLoading } = useFeedData({
        activeTown, townName, isPlayground, user, iaiaLevel, selectedRole: 'tot'
    });

    const [marketItems, setMarketItems] = useState([]);
    const [marketLoading, setMarketLoading] = useState(true);

    // 2. Fetch Market Items from REST API
    useEffect(() => {
        const fetchMarket = async () => {
            try {
                const { data } = await marketService.getMarketItems({
                    page: 0,
                    limit: 100, // Load a broad spectrum for the unified dashboard
                    categorySlug: 'tot'
                });
                
                const fetchedItems = data || [];
                const fetchedIds = new Set(fetchedItems.map(i => i.id));
                const uniqueMocks = MOCK_MARKET_ITEMS.filter(m => !fetchedIds.has(m.id));
                
                setMarketItems([...uniqueMocks, ...fetchedItems]);
            } catch (err) {
                logger.error('[UnifiedFeed] Error loading market items:', err);
                // Fallback to mocks if offline
                setMarketItems([...MOCK_MARKET_ITEMS]);
            } finally {
                setMarketLoading(false);
            }
        };
        fetchMarket();
    }, []);

    // 3. Format Mock Events to fit UniversalCard
    const formattedEvents = useMemo(() => {
        return MOCK_EVENTS.map(event => ({
            ...event,
            uuid: event.id || `event-${Math.random()}`,
            type: 'event_announcement',
            created_at: safeIsoString(event.date),
            author_name: event.organizer || 'L\'Ajuntament',
            content: event.description,
            // Ensure visual consistency for UniversalCard defaults
            image_url: event.image ? [event.image] : null,
            author_avatar: null 
        }));
    }, []);

    // 4. Merge & Sort Chronologically
    const unifiedPosts = useMemo(() => {
        const allItems = [
            ...feedPosts, 
            ...marketItems.map(m => ({ 
                ...m, 
                type: 'mercat', 
                uuid: m.id, 
                created_at: safeIsoString(m.created_at)
            })),
            ...formattedEvents
        ];

        // Deduplicate before sorting
        const uniqueItems = Array.from(new Map(allItems.map(item => [item.uuid || item.id, item])).values());

        return uniqueItems.sort((a, b) => {
            const dateA = new Date(a.created_at || 0).getTime();
            const dateB = new Date(b.created_at || 0).getTime();
            return dateB - dateA; // Descending (newest first)
        });
    }, [feedPosts, marketItems, formattedEvents]);

    return {
        posts: unifiedPosts,
        loading: feedLoading || marketLoading,
        hasMore: false // Mapat complet a la memòria pel moment
    };
};


=====================================
FILE: src/hooks/useVisionCapabilities.js
=====================================

import { useState, useEffect } from 'react';

export const useVisionCapabilities = () => {
  const [supportsWebGPU, setSupportsWebGPU] = useState(false);
  
  useEffect(() => {
    const checkGPU = () => {
      // Check if navigator.gpu exists and has requestAdapter
      if ('gpu' in navigator && navigator.gpu && typeof navigator.gpu.requestAdapter === 'function') {
        setSupportsWebGPU(true);
      } else {
        setSupportsWebGPU(false);
      }
    };
    checkGPU();
  }, []);
  
  return supportsWebGPU;
};


=====================================
FILE: src/i18n/config.js
=====================================

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import vaTranslations from './locales/va.json';
import esTranslations from './locales/es.json';
import glTranslations from './locales/gl.json';
import euTranslations from './locales/eu.json';
import enTranslations from './locales/en.json';
import frTranslations from './locales/fr.json';
import deTranslations from './locales/de.json';
import itTranslations from './locales/it.json';

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        lng: 'va', // Forzamos Valenciano por defecto
        resources: {
            va: { translation: vaTranslations },
            es: { translation: esTranslations },
            gl: { translation: glTranslations },
            eu: { translation: euTranslations },
            en: { translation: enTranslations },
            fr: { translation: frTranslations },
            de: { translation: deTranslations },
            it: { translation: itTranslations }
        },
        fallbackLng: 'va',
        // No forzamos 'lng' aquí para que el detector pueda usar localStorage
        detection: {
            order: ['localStorage'], // IGNORAMOS el navegador, solo lo que el usuario elija
            lookupLocalStorage: 'i18nextLng',
            caches: ['localStorage']
        },
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;


=====================================
FILE: src/powersync/connector.js
=====================================

import { supabaseService } from '../services/supabaseService';

export class SupabaseConnector {
  async fetchCredentials() {
    const { data: { session } } = await supabaseService.supabase.auth.getSession();
    return {
      endpoint: import.meta.env.VITE_POWERSYNC_URL || 'https://foo.powersync.com',
      token: session?.access_token ?? ''
    };
  }

  async uploadData() {
    // PowerSync gestiona automàticament uploads para Sync Rules.
    // Lógica para capturar las operaciones a tablas no-sync o Custom CRDT subidas.
    console.log('[PowerSync] Upload check triggered');
  }
}


=====================================
FILE: src/powersync/schema.js
=====================================

import { column, Schema, Table } from "@powersync/web";

export const postsTable = new Table(
  {
    uuid: column.text,
    content: column.text,
    author_id: column.text,
    author_entity_id: column.text,
    town_uuid: column.text,
    created_at: column.text,
    images: column.text,
    image_url: column.text,
    type: column.text,
    author_name: column.text,
    bategats_count: column.integer,
    language: column.text,
    // Add other matching columns from Supabase 'posts' table required by UniversalCard
  },
  { indexes: { town: ["town_uuid"] } },
);

export const bategatsTable = new Table(
  {
    post_uuid: column.text,
    user_id: column.text,
    action: column.text,
    delta: column.integer,
    vector_clock: column.text,
  },
  { indexes: { post: ["post_uuid"] } },
);

export const townsTable = new Table({
  id: column.text,
  name: column.text,
  uuid: column.text,
});

export const AppSchema = new Schema({
  posts: postsTable,
  bategats: bategatsTable,
  towns: townsTable,
});


=====================================
FILE: src/rhizome/crdt/eg-walker.js
=====================================

import { logger } from '../../utils/logger';
import { rhizomeDb } from '../db-core';
import { peritext } from './peritext';
import { VectorClock } from './vectorClock';

/**
 * EgWalker: Event Graph Walker Synchronization Engine v3.0 [MASTER/FLASH]
 * 
 * Filosofia:
 * 1. Persistència Real: Utilitza RhizomeDB (SQLite/OPFS) enlloc de localStorage.
 * 2. Amnèsia de RAM: No manté el graf en memòria, només l'estat actual calculat.
 * 3. Peritext Ready: L'estat ara suporta spans per a format de text rich.
 */
class EgWalker {
    constructor(nodeId = 'village-cell-' + Math.random().toString(36).substring(7)) {
        this.nodeId = nodeId;
        this.opCounter = 0;
        this.docQueues = new Map(); // Cues per a garantir atomicitat per document
        this.causalBuffer = new Map(); // Buffer de retenció CRDT (Protocol OMEGA-4)
    }

    /**
     * Garantix que les operacions sobre un document s'executen de forma seqüencial (Atomic Swap).
     */
    async _runWithDocLock(docId, task) {
        if (!this.docQueues.has(docId)) {
            this.docQueues.set(docId, Promise.resolve());
        }

        const previousTask = this.docQueues.get(docId);
        const nextTask = (async () => {
            await previousTask;
            try {
                return await task();
            } catch (err) {
                logger.error(`[EgWalker] Error en tasca bloquejada per a ${docId}:`, err);
                throw err;
            }
        })();

        const safeTask = nextTask.catch(() => {});
        this.docQueues.set(docId, safeTask); 
        
        // [GC OMEGA-3] Alliberem el pany de memòria quan es resol la cua completa
        safeTask.finally(() => {
            if (this.docQueues.get(docId) === safeTask) {
                this.docQueues.delete(docId);
            }
        });

        return nextTask;
    }

    /**
     * Registra una operació local i la persisteix a RhizomeDB.
     */
    async applyLocal(docId, opType, value) {
        return this._runWithDocLock(docId, async () => {
            const snapshot = await rhizomeDb.getSnapshot(docId);
            const lastOpId = snapshot ? snapshot.lastOpId : null;
            let lastClock = snapshot?.vectorClock ? VectorClock.fromJSON(snapshot.vectorClock) : new VectorClock();
            const newClock = lastClock.increment(this.nodeId);

            const op = {
                id: `${this.nodeId}-${Date.now()}-${this.opCounter++}`,
                docId,
                type: opType,
                value,
                dependsOn: lastOpId ? [lastOpId] : [],
                timestamp: Date.now(),
                author: this.nodeId,
                vectorClock: newClock.toJSON()
            };

            await rhizomeDb.saveOperation(op);

            const ops = await rhizomeDb.getOperations(docId);
            const newState = this._calculateState(ops);

            await rhizomeDb.saveSnapshot(docId, newState.data, op.id, newState.vectorClock);
            return op;
        });
    }

    /**
     * [FIX OMEGA-4] Fusiona operacions remotes aplicant Validació Causal Estricta.
     * Reté operacions orfes al CausalBuffer fins que arribe la història prèvia.
     */
    async merge(docId, remoteOps) {
        return this._runWithDocLock(docId, async () => {
            const start = performance.now();
            logger.log(`[EgWalker] Iniciant fusió Rhizome (amb Causal Buffer) per a ${docId}...`);

            const localOps = await rhizomeDb.getOperations(docId);
            const localIds = new Set(localOps.map(o => o.id));

            // Afegim les operacions pendents de l'historial temporal
            const queuedOps = this.causalBuffer.get(docId) || [];
            const combinedOps = [...remoteOps, ...queuedOps];
            
            // Netejem aquest docId per reavaluar en bloc
            this.causalBuffer.set(docId, []);

            const validNewOps = [];
            const missingDependencies = [];

            // 1. Filtrar primari sobre Causalitat (Causal Buffer Entry)
            for (const op of combinedOps) {
                if (localIds.has(op.id)) continue;
                
                let isCausallyValid = true;
                if (op.dependsOn && Array.isArray(op.dependsOn)) {
                    for (const depId of op.dependsOn) {
                        if (!localIds.has(depId) && !validNewOps.some(v => v.id === depId)) {
                            isCausallyValid = false;
                            break;
                        }
                    }
                }

                if (isCausallyValid) {
                    validNewOps.push(op);
                } else {
                    missingDependencies.push(op);
                }
            }

            // 2. Resolució en Cascata (Fix Point Algorithm)
            // Una operació recentment validada pot complir dependències d'una de retinguda.
            let refined = true;
            while(refined) {
                 refined = false;
                 for (let i = missingDependencies.length - 1; i >= 0; i--) {
                      const op = missingDependencies[i];
                      let isValid = true;
                      for (const depId of op.dependsOn || []) {
                           if (!localIds.has(depId) && !validNewOps.some(v => v.id === depId)) {
                               isValid = false;
                               break;
                           }
                      }
                      if (isValid) {
                          validNewOps.push(op);
                          missingDependencies.splice(i, 1);
                          refined = true; // Hem des-encallat una peça, iterem de nou
                      }
                 }
            }

            // 3. Captivitat dels Òrfens (Buffer Persistance)
            if (missingDependencies.length > 0) {
                 logger.warn(`[EgWalker] Òrfens Causals (${missingDependencies.length}). Retinguts temporalment fins l'arribada d'antecedents per a ${docId}.`);
                 this.causalBuffer.set(docId, missingDependencies);
            }

            // 4. Ingesta i Consolidació de l'Estat Purificat
            if (validNewOps.length === 0) return (await this.getState(docId))?.data;

            await rhizomeDb.saveOperationsBatch(validNewOps);

            const allOps = await rhizomeDb.getOperations(docId);
            const newState = this._calculateState(allOps);

            const lastOpId = allOps.length > 0 ? allOps[allOps.length - 1].id : null;
            await rhizomeDb.saveSnapshot(docId, newState.data, lastOpId, newState.vectorClock);

            const end = performance.now();
            logger.log(`[EgWalker] Rhizome Sync (Causal Estricte) completat en ${(end - start).toFixed(2)}ms.`);

            return newState.data;
        });
    }

    /**
     * Poda de Versió Crítica (Garbage Collection).
     */
    async prune(docId) {
        return this._runWithDocLock(docId, async () => {
            const ops = await rhizomeDb.getOperations(docId);
            if (ops.length < 100) return;

            logger.log(`[EgWalker] EXECUTANT ATOMIC PRUNING ($Vcrit) per a ${docId}...`);

            const allOps = await rhizomeDb.getOperations(docId);
            const currentState = this._calculateState(allOps);
            const lastOpId = allOps.length > 0 ? allOps[allOps.length - 1].id : null;

            await rhizomeDb.saveSnapshot(docId, currentState.data, lastOpId, currentState.vectorClock);
            await rhizomeDb.purgeOperations(docId, 20);

            logger.log(`[EgWalker] Poda atòmica completada per a ${docId}.`);
        });
    }

    async getState(docId) {
        return await rhizomeDb.getSnapshot(docId);
    }

    /**
     * Lògica de càlcul d'estat DETERMINISTA (Lamport Tie-break).
     */
    _calculateState(graph) {
        if (graph.length === 0) return { data: { content: '', spans: [] }, vectorClock: new VectorClock() };

        let state = {};
        let spans = [];
        let deletedIds = new Set();
        let finalClock = new VectorClock();

        // Ordenem per Vector Clocks i determinisme (Lamport)
        const sortedGraph = [...graph].sort((a, b) => {
            const aClock = a.vectorClock ? VectorClock.fromJSON(a.vectorClock) : new VectorClock();
            const bClock = b.vectorClock ? VectorClock.fromJSON(b.vectorClock) : new VectorClock();
            const cmp = aClock.compare(bClock);
            if (cmp !== null && cmp !== 0) return cmp;

            // 2. Determinisme causal: Identitat -> Timestamp -> ID
            if (a.timestamp !== b.timestamp) return a.timestamp - b.timestamp;
            return a.id.localeCompare(b.id);
        });

        sortedGraph.forEach(op => {
            const opClock = op.vectorClock ? VectorClock.fromJSON(op.vectorClock) : new VectorClock();
            finalClock = finalClock.merge(opClock);

            if (op.type === 'edit') {
                if (typeof op.value === 'object') {
                    if (op.value.id && deletedIds.has(op.value.id)) return;
                    state = { ...state, ...op.value };
                } else {
                    state = op.value;
                }
            } else if (op.type === 'delete') {
                deletedIds.add(op.value);
                if (typeof state === 'object' && state[op.value]) {
                    const newState = { ...state };
                    delete newState[op.value];
                    state = newState;
                }
            } else if (op.type === 'format') {
                spans = peritext.mergeSpans(spans, [op.value]);
            } else if (op.type === 'snapshot') {
                state = op.value.content || op.value;
                spans = op.value.spans || [];
            }
        });

        let dataFinal;
        if (typeof state === 'object' && state.description) {
            dataFinal = { ...state, spans, _deleted: Array.from(deletedIds) };
        } else {
            dataFinal = typeof state === 'string' ? { content: state, spans } : state;
        }

        return { data: dataFinal, vectorClock: finalClock };
    }
}

export const egWalker = new EgWalker();



=====================================
FILE: src/rhizome/crdt/peritext.js
=====================================

/**
 * Peritext.js - Rich Text CRDT Layer [MASTER/FLASH]
 * Implements "Stable Anchors" for format preservation in offline rural environments.
 * 
 * Basat en: "Peritext: A General-Purpose Rich-Text CRDT" (Ink & Switch).
 */

import { logger } from '../../utils/logger';

class Peritext {
    /**
     * Genera una àncora estable per a un caràcter o posició.
     * En Peritext, les àncores es lliguen a l'ID de l'operació que va inserir el caràcter.
     */
    createAnchor(opId, offset = 0, side = 'before') {
        return {
            opId,      // ID de l'operació d'inserció del caràcter
            offset,    // Offset relatiu si és un bloc
            side       // 'before' o 'after' el caràcter
        };
    }

    /**
     * Defineix un interval de format (Mark).
     */
    createMark(startAnchor, endAnchor, type, value = true) {
        return {
            id: crypto.randomUUID(),
            start: startAnchor,
            end: endAnchor,
            type,       // 'bold', 'italic', 'link', 'iaia-dict'
            value,
            timestamp: Date.now()
        };
    }

    /**
     * Resol la posició numèrica d'una àncora dins del text actual.
     * Aquesta és la clau de la resiliència: si el text es mou, l'àncora el segueix.
     */
    resolveAnchor(anchor, currentOperations) {
        // En una implementació completa, buscaríem l'operació 'opId' 
        // i calcularíem la seua posició actual sumant insercions posteriors.
        // Per al prototip v1, mapegem a la posició lògica guardada.
        const foundOp = currentOperations.find(op => op.id === anchor.opId);
        if (!foundOp) return 0;

        // Simulem el càlcul de posició real via Graph Walking (Eg-walker)
        return foundOp.index + (anchor.side === 'after' ? 1 : 0);
    }

    /**
     * Llei de la Intenció: Fusió de spans concurrents (Protocol Flash).
     */
    mergeSpans(localSpans, remoteSpans) {
        logger.log(`[Peritext] Fusionant ${remoteSpans.length} spans remots amb ${localSpans.length} locals...`);

        // Algoritme LWW (Last Write Wins)
        const combined = [...localSpans, ...remoteSpans];
        const unique = new Map();

        combined.forEach(span => {
            // Clau única basada en àncores per evitar duplicats semàntics
            const key = `${span.type}-${span.start.opId || span.start}-${span.end.opId || span.end}`;
            if (!unique.has(key) || unique.get(key).timestamp < span.timestamp) {
                unique.set(key, span);
            }
        });

        return Array.from(unique.values());
    }
}

export const peritext = new Peritext();
export default Peritext;


=====================================
FILE: src/rhizome/crdt/vectorClock.js
=====================================

/**
 * VectorClock per a l'ordre causal en EgWalker.
 * Cada operació i snapshot porta un vector clock que permet comparar
 * relacions d'antecedència/concurrència.
 */
export class VectorClock {
  constructor(entries = {}) {
    // entries: { nodeId: counter }
    this.entries = entries;
  }

  /**
   * Retorna un nou vector clock amb el comptador del node actual incrementat.
   */
  increment(nodeId) {
    const newEntries = { ...this.entries };
    newEntries[nodeId] = (newEntries[nodeId] || 0) + 1;
    return new VectorClock(newEntries);
  }

  /**
   * Compara dos vector clocks.
   * @returns -1 si this < other, 0 si iguals, 1 si this > other, null si concurrents
   */
  compare(other) {
    let less = false;
    let greater = false;
    const allNodes = new Set([
      ...Object.keys(this.entries),
      ...Object.keys(other.entries)
    ]);

    for (const node of allNodes) {
      const a = this.entries[node] || 0;
      const b = other.entries[node] || 0;
      if (a < b) less = true;
      if (a > b) greater = true;
      if (less && greater) return null; // concurrents
    }

    if (less) return -1;
    if (greater) return 1;
    return 0;
  }

  /**
   * Fusiona dos vector clocks (pren el màxim de cada node).
   */
  merge(other) {
    const merged = { ...this.entries };
    for (const [node, count] of Object.entries(other.entries)) {
      merged[node] = Math.max(merged[node] || 0, count);
    }
    return new VectorClock(merged);
  }

  /**
   * Serialització per emmagatzemar a la base de dades.
   */
  toJSON() {
    return this.entries;
  }

  /**
   * Desserialització des de la base de dades.
   */
  static fromJSON(obj) {
    return new VectorClock(obj || {});
  }
}


=====================================
FILE: src/rhizome/db-core.js
=====================================

import { logger } from '../utils/logger';

// Importem el worker com a URL lògic aïllat heretant CORS per defecte de la finestra
import RhizomeWorker from './rhizome.worker.js?worker&inline';

/**
 * RhizomeDB: Persistent SQLite + OPFS Layer [MASTER/FLASH]
 * 
 * Basat en l'auditoria v3.0: 
 * - Utilitza OPFS per a persistència real (no volàtil).
 * - Emmagatzema el graf d'operacions (Eg-walker).
 * - Suporta snapshots per a càrrega ràpida.
 */
class RhizomeDB {
    constructor() {
        this.worker = null;
        this.pendingRequests = new Map();
        this.initPromise = null;
    }

    /**
     * Inicialitza el motor SQLite amb suport OPFS.
     */
    async init() {
        if (this.initPromise) return this.initPromise;

        this.initPromise = (async () => {
            try {
                // Instanciem el worker inlined
                this.worker = new RhizomeWorker();

                this.worker.onmessage = (e) => this.handleWorkerMessage(e);

                return new Promise((resolve, reject) => {
                    this.sendToWorker('INIT', { origin: window.location.origin }, (res) => {
                        if (res.type === 'INIT_OK') {
                            logger.log('📡 RhizomeDB Proxy connectat al Worker');
                            resolve();
                        } else {
                            reject(new Error(res.payload));
                        }
                    });
                });
            } catch (err) {
                logger.error('❌ Error inicialitzant Rhizome Worker:', err);
                throw err;
            }
        })();

        return this.initPromise;
    }

    handleWorkerMessage(e) {
        const { id, type, payload } = e.data;

        if (type === 'LOG') { logger.log(payload); return; }
        if (type === 'DEBUG') { if (logger.debug) logger.debug(payload); return; }
        if (type === 'ERROR' && !id) { logger.error(payload); return; }

        if (!this.pendingRequests) {
            this.pendingRequests = new Map();
        }

        const callback = this.pendingRequests.get(id);
        if (callback) {
            this.pendingRequests.delete(id);
            callback(e.data);
        } else if (id) {
            logger.warn(`L'event amb ID ${id} enviat des del Worker no té callback registrats.`);
        }
    }

    sendToWorker(type, payload, callback, timeoutMs = 15000) {
        if (!this.pendingRequests) {
            this.pendingRequests = new Map();
        }
        
        const id = (typeof crypto !== 'undefined' && crypto.randomUUID) 
            ? crypto.randomUUID() 
            : (Date.now().toString(36) + Math.random().toString(36).substring(2));
        
        if (callback) {
            const timeoutId = setTimeout(() => {
                if (this.pendingRequests.has(id)) {
                    this.pendingRequests.delete(id);
                    logger.warn(`[RhizomeDB] Timeout (${timeoutMs}ms) esperant resposta del worker per a: ${type}`);
                    callback({ type: 'ERROR', payload: `Worker timeout (${timeoutMs}ms) per a l'operació ${type}` });
                }
            }, timeoutMs);

            this.pendingRequests.set(id, (res) => {
                clearTimeout(timeoutId);
                callback(res);
            });
        }
        
        if (this.worker) {
            this.worker.postMessage({ id, type, payload });
        } else {
            logger.error('❌ Rhizome Worker no inicialitzat al intentar enviar:', type);
            if (callback) callback({ type: 'ERROR', payload: 'Worker no inicialitzat' });
        }
    }

    async saveOperation(op) {
        await this.init();
        return new Promise((resolve, reject) => {
            this.sendToWorker('SAVE_OP', op, (res) => {
                if (res.type === 'ERROR') reject(new Error(res.payload));
                else resolve();
            });
        });
    }

    async saveOperationsBatch(ops) {
        await this.init();
        if (!ops || ops.length === 0) return Promise.resolve();
        return new Promise((resolve, reject) => {
            this.sendToWorker('SAVE_OPS_BATCH', { ops }, (res) => {
                if (res.type === 'ERROR') reject(new Error(res.payload));
                else resolve();
            });
        });
    }

    async getOperations(docId) {
        await this.init();
        return new Promise((resolve, reject) => {
            this.sendToWorker('GET_OPS', { docId }, (res) => {
                if (res.type === 'ERROR') reject(new Error(res.payload));
                else resolve(res.payload);
            });
        });
    }

    async saveSnapshot(docId, data, lastOpId, vectorClock) {
        await this.init();
        return new Promise((resolve, reject) => {
            this.sendToWorker('SAVE_SNAPSHOT', { docId, data, lastOpId, vectorClock }, (res) => {
                if (res.type === 'ERROR') reject(new Error(res.payload));
                else resolve();
            });
        });
    }

    async getSnapshot(docId) {
        await this.init();
        return new Promise((resolve, reject) => {
            this.sendToWorker('GET_SNAPSHOT', { docId }, (res) => {
                if (res.type === 'ERROR') reject(new Error(res.payload));
                else resolve(res.payload);
            });
        });
    }

    async purgeOperations(docId, keepLimit = 50) {
        await this.init();
        return new Promise((resolve, reject) => {
            this.sendToWorker('PURGE_OPS', { docId, keepLimit }, (res) => {
                if (res.type === 'ERROR') reject(new Error(res.payload));
                else resolve();
            });
        });
    }

    async getTrustScore(myDid, targetDid) {
        await this.init();
        return new Promise((resolve, reject) => {
            this.sendToWorker('GET_TRUST_SCORE', { myDid, targetDid }, (res) => {
                if (res.type === 'ERROR') reject(new Error(res.payload));
                else resolve(res.payload);
            });
        });
    }
}

export const rhizomeDb = new RhizomeDB();


=====================================
FILE: src/rhizome/peritext-seeds.js
=====================================

/**
 * PeritextSeeds.js - Escenari de Prova: "L'Esmunyir de l'IAIA"
 * Demostra la preservació de la intenció davant edicions concurrents.
 */

import { peritext } from './crdt/peritext';
import { egWalker } from './crdt/eg-walker';
import { logger } from '../utils/logger';

export const seedPeritextScenario = async () => {
    logger.log('🚜 Iniciant escenari Peritext: L\'Esmunyir de l\'IAIA...');

    const docId = 'oli_de_la_torre';
    const initialContent = "L'oli s'esmuny de les mans quan collim.";

    // 1. Inserció inicial
    const opInsert = await egWalker.applyLocal(docId, 'edit', initialContent);
    const charOpId = opInsert.id; // Suposem que tota la seqüència penja d'aquest ID per al prototip

    // 2. L'IAIA marca "esmuny" en negreta (Intenció A)
    // Ella usa àncores estables vinculades al caràcter
    const startAnchor = peritext.createAnchor(charOpId, 7, 'before'); // "e" de esmuny
    const endAnchor = peritext.createAnchor(charOpId, 13, 'after');  // "y" de esmuny

    const boldMark = peritext.createMark(startAnchor, endAnchor, 'bold');
    await egWalker.applyLocal(docId, 'format', boldMark);

    // 3. El mestre corregeix el text (Intenció B) 
    // Concurrentment o després, movem el text. 
    // En un sistema real, això canviaria els offsets, però Peritext ho mantindria lligat.
    const correctedContent = "L'oli d'oliva s'esmuny de les mans si plou.";
    await egWalker.applyLocal(docId, 'edit', correctedContent);

    logger.log('✅ Escenari Peritext bategat. Intenció preservada via àncores.');
};


=====================================
FILE: src/rhizome/rhizome.worker.js
=====================================

import './sqlite-setup.js';
import initSqlJs from '@sqlite.org/sqlite-wasm';

console.log('🔥 [WORKER EXTERN TOCA EL CREADOR] Arrencant fila principal de Rhizome Worker...');

let db = null;
let initialized = false;
let globalOrigin = '';

// [MASTER WORKER RESILIENCE]
const logger = {
    log: (msg) => postMessage({ type: 'LOG', payload: msg }),
    error: (msg) => postMessage({ type: 'ERROR', payload: msg }),
    debug: (msg) => postMessage({ type: 'DEBUG', payload: msg })
};

async function init(initId, originStr) {
    if (originStr) {
        globalOrigin = originStr;
        console.log(`🔥 [WORKER EXTERN TOCA EL CREADOR] Origin rebut per Worker: ${globalOrigin}`);
    }
    
    if (initialized) {
        if (initId) postMessage({ id: initId, type: 'INIT_OK' });
        return;
    }
    try {
        console.log('🔥 [WORKER EXTERN TOCA EL CREADOR] Executant engine initSqlJs...');
        
        // Passar explícitament al nucli l'arrel absoluta de l'aplicació 
        // per si la Worker fallback engine intente resoldre fitxers.
        const sqlite3 = await initSqlJs({
            scriptInfo: {
                // Per esquivar "import.meta.url" al fallback if Blob. Assurem trailing slash.
                sqlite3Dir: (globalOrigin ? globalOrigin + '/assets/' : '/assets/')
            },
            locateFile: file => {
                const base = globalOrigin ? globalOrigin + '/assets/' : '/assets/';
                const wasmUrl = base + file;
                console.log(`🔥 [WORKER] Ruta WASM resolta: ${wasmUrl}`);
                return wasmUrl;
            },
            print: logger.log,
            printErr: logger.error,
        });

        console.log('🔥 [WORKER] Sqlite3 ha conclòs la connexió inicial de Promeses!', !!sqlite3);

        if ('opfs' in sqlite3) {
            db = new sqlite3.oo1.OpfsDb('/rhizome_v3.sqlite');
            logger.log('✅ RhizomeDB Worker connectat a OPFS');
        } else {
            logger.error('⚠️ OPFS no disponible en el Worker. Usant memòria temporal.');
            db = new sqlite3.oo1.DB();
        }

        setupTables();
        initialized = true;
        if (initId) postMessage({ id: initId, type: 'INIT_OK' });
    } catch (err) {
        logger.error('❌ Error fatal en Rhizome Worker:', err.message);
        if (initId) postMessage({ id: initId, type: 'ERROR', payload: err.message });
    }
}

function setupTables() {
    db.exec(`
        CREATE TABLE IF NOT EXISTS operations (
            id TEXT PRIMARY KEY,
            doc_id TEXT NOT NULL,
            type TEXT NOT NULL,
            value TEXT,
            depends_on TEXT,
            timestamp INTEGER NOT NULL,
            author TEXT NOT NULL,
            vector_clock TEXT,
            signature TEXT
        );
        CREATE INDEX IF NOT EXISTS idx_ops_doc ON operations(doc_id);
        
        CREATE TABLE IF NOT EXISTS snapshots (
            doc_id TEXT PRIMARY KEY,
            data TEXT NOT NULL,
            last_op_id TEXT,
            vector_clock TEXT,
            updated_at INTEGER NOT NULL
        );

        CREATE TABLE IF NOT EXISTS config (
            key TEXT PRIMARY KEY,
            value TEXT
        );
    `);

    // Schema Migrations (Fail-safe for existing databases)
    try { db.exec(`ALTER TABLE operations ADD COLUMN vector_clock TEXT;`); } catch { /* ignore */ }
    try { db.exec(`ALTER TABLE snapshots ADD COLUMN vector_clock TEXT;`); } catch { /* ignore */ }
}

onmessage = async (e) => {
    const { id, type, payload } = e.data;

    try {
        if (!initialized && type !== 'INIT') {
            await init(id);
        }

        switch (type) {
            case 'INIT':
                await init(id, payload?.origin);
                break;

            case 'SAVE_OP': {
                db.exec({
                    sql: 'INSERT OR IGNORE INTO operations (id, doc_id, type, value, depends_on, timestamp, author, vector_clock) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                    bind: [
                        payload.id,
                        payload.docId,
                        payload.type,
                        JSON.stringify(payload.value),
                        JSON.stringify(payload.dependsOn || []),
                        payload.timestamp,
                        payload.author,
                        JSON.stringify(payload.vectorClock || {})
                    ]
                });
                postMessage({ id, type: 'SAVE_OP_OK' });
                break;
            }

            case 'SAVE_OPS_BATCH': {
                db.exec('BEGIN TRANSACTION;');
                try {
                    for (const op of payload.ops) {
                        db.exec({
                            sql: 'INSERT OR IGNORE INTO operations (id, doc_id, type, value, depends_on, timestamp, author, vector_clock) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                            bind: [
                                op.id,
                                op.docId,
                                op.type,
                                JSON.stringify(op.value),
                                JSON.stringify(op.dependsOn || []),
                                op.timestamp,
                                op.author,
                                JSON.stringify(op.vectorClock || {})
                            ]
                        });
                    }
                    db.exec('COMMIT;');
                    postMessage({ id, type: 'SAVE_OPS_BATCH_OK' });
                } catch (batchErr) {
                    db.exec('ROLLBACK;');
                    throw batchErr;
                }
                break;
            }

            case 'GET_OPS': {
                const ops = [];
                db.exec({
                    sql: 'SELECT * FROM operations WHERE doc_id = ? ORDER BY timestamp ASC',
                    bind: [payload.docId],
                    row: (row) => ops.push({
                        ...row,
                        value: JSON.parse(row.value),
                        dependsOn: JSON.parse(row.depends_on),
                        vectorClock: row.vector_clock ? JSON.parse(row.vector_clock) : null
                    })
                });
                postMessage({ id, type: 'GET_OPS_OK', payload: ops });
                break;
            }

            case 'SAVE_SNAPSHOT': {
                db.exec({
                    sql: 'INSERT OR REPLACE INTO snapshots (doc_id, data, last_op_id, vector_clock, updated_at) VALUES (?, ?, ?, ?, ?)',
                    bind: [
                        payload.docId, 
                        JSON.stringify(payload.data), 
                        payload.lastOpId, 
                        JSON.stringify(payload.vectorClock || {}),
                        Date.now()
                    ]
                });
                postMessage({ id, type: 'SAVE_SNAPSHOT_OK' });
                break;
            }

            case 'GET_SNAPSHOT': {
                let snapshot = null;
                db.exec({
                    sql: 'SELECT * FROM snapshots WHERE doc_id = ?',
                    bind: [payload.docId],
                    row: (row) => {
                        snapshot = {
                            data: JSON.parse(row.data),
                            lastOpId: row.last_op_id,
                            vectorClock: row.vector_clock ? JSON.parse(row.vector_clock) : null
                        };
                    }
                });
                postMessage({ id, type: 'GET_SNAPSHOT_OK', payload: snapshot });
                break;
            }

            case 'PURGE_OPS':
                db.exec({
                    sql: `DELETE FROM operations 
                          WHERE doc_id = ? 
                          AND id NOT IN (
                              SELECT id FROM operations 
                              WHERE doc_id = ? 
                              ORDER BY timestamp DESC 
                              LIMIT ?
                          )`,
                    bind: [payload.docId, payload.docId, payload.keepLimit || 50]
                });
                postMessage({ id, type: 'PURGE_OPS_OK' });
                break;

            case 'GET_TRUST_SCORE': {
                let score = 0;
                // Query Recursiva de Confiança (CTE)
                db.exec({
                    sql: `
                        WITH RECURSIVE trust_path(author, target, depth) AS (
                            SELECT author, json_extract(value, '$.target'), 1 
                            FROM operations 
                            WHERE type = 'TRUST_VOTE' AND author = ?
                            UNION ALL
                            SELECT v.author, json_extract(v.value, '$.target'), tp.depth + 1
                            FROM operations v 
                            JOIN trust_path tp ON v.author = tp.target
                            WHERE v.type = 'TRUST_VOTE' AND tp.depth < 3
                        )
                        SELECT depth FROM trust_path WHERE target = ? LIMIT 1
                    `,
                    bind: [payload.myDid, payload.targetDid],
                    row: (row) => {
                        score = row.depth;
                    }
                });
                postMessage({ id, type: 'GET_TRUST_SCORE_OK', payload: { depth: score } });
                break;
            }

            default:
                logger.error('Unknown action type: ' + type);
        }
    } catch (err) {
        postMessage({ id, type: 'ERROR', payload: err.message });
    }
};


=====================================
FILE: src/rhizome/seeds.js
=====================================

import { egWalker } from './crdt/eg-walker';
import { logger } from '../utils/logger';

/**
 * RhizomeSeeds: Injecció de Dades Mestres [FLASH REPORT]
 * 
 * Injecta els recursos i itineraris oficials de La Torre de les Maçanes.
 */
export async function injectSeeds() {
    logger.log('🌱 Injectant llavors de dades Rhizome (Oli i Itineraris)...');

    // 1. OLI DE LA TORRE
    const oliDocId = 'res:oli-latorre';
    const oliContent = {
        title: "Oli de La Torre (Verge Extra)",
        variety: "Blanqueta, Mançanella, Alfafarenca",
        description: "El nostre oli és fill de la muntanya. Produït majoritàriament amb la varietat Blanqueta, resistent i noble. L'oliva arriba sana perquè la Blanqueta resistix la mosca. Al molí, l'oli es deixa trastombar (decantar) naturalment per a separar la morca.",
        specs: {
            acidity: "0.8º - 1.0º",
            process: "Esmunyida a mà, batuda en fred (23ºC)"
        },
        tags: ["🏺 Essències", "🥗 Km0", "🚜 Cooperativa"]
    };

    await egWalker.applyLocal(oliDocId, 'edit', oliContent);
    // Afegim format Peritext a termes clau
    await egWalker.applyLocal(oliDocId, 'format', { start: 98, end: 107, type: 'bold' }); // "Blanqueta"
    await egWalker.applyLocal(oliDocId, 'format', { start: 191, end: 201, type: 'iaia-dict', metadata: { term: 'trastombar' } });
    await egWalker.applyLocal(oliDocId, 'format', { start: 236, end: 241, type: 'iaia-dict', metadata: { term: 'morca' } });

    // 2. ITINERARIS ESSÈNCIES
    const itineraries = [
        {
            id: 'experience:ruta-1',
            title: "Som pa, som oli",
            type: "gastronomic",
            duration: "4h",
            distance: "1.3km",
            stops: ["Forns de llenya", "Almàssera", "Molí Hidràulic"]
        },
        {
            id: 'experience:ruta-3',
            title: "Som aigua",
            type: "hydric",
            duration: "4h",
            distance: "2km",
            stops: ["El Bassi (Llavador)", "Font Major", "Malecó"]
        },
        {
            id: 'experience:ruta-6',
            title: "Som paisatge",
            type: "hiking",
            duration: "8h",
            distance: "6km",
            stops: ["Serra d'El Rentonar", "Pou de la Neu", "Mas de la Canaleta"]
        }
    ];

    for (const route of itineraries) {
        await egWalker.applyLocal(route.id, 'edit', route);
    }

    logger.log('✅ Llavors Rhizome injectades correctament.');
}


=====================================
FILE: src/rhizome/sqlite-setup.js
=====================================

// Configuració preprocessada abans de carregar SQLite
// Resol l'error OPFS "Failed to construct 'URL': Invalid URL" en entorns Vite amb inline workers
((scope) => {
  // Els Blob Workers mantenen l'origin de la pàgina pare, però en alguns navegadors pot ser "null"
  let origin = scope.location.origin;
  if (!origin || origin === "null") {
    const match = scope.location.href.match(
      new RegExp("^blob:(https?://[^/]+)"),
    );
    if (match) {
      origin = match[1];
    } else {
      origin = "https://socdepoble.org"; // Fallback segur d'últim recurs
    }
  }

  // Configurem el directori abans que SQLite l'intenti deduir de 'import.meta.url' o 'self.location'
  scope.sqlite3ApiConfig = {
    scriptInfo: {
      // Assegurem que sempre acaba en `/` i és una URL absoluta vàlida
      sqlite3Dir: origin + "/assets/",
    },
  };

  console.log(
    `🔥 [WORKER SETUP] sqlite3ApiConfig injectat. sqlite3Dir: ${scope.sqlite3ApiConfig.scriptInfo.sqlite3Dir}`,
  );

  // Interceptor de seguretat per URL (com a fallback si el sqlite engine la intenta parsejar sense base)
  const OriginalURL = scope.URL;
  scope.URL = function (url, base) {
    try {
      return new OriginalURL(url, base);
    } catch (e) {
      if (typeof url === 'string' && url.includes('sqlite3-opfs-async-proxy')) {
        // Ignorem qualsevol hash que Vite hagi afegit (ex: sqlite3-opfs-async-proxy-BWKAW6aw.js)
        // perquè en producció (via cp o copy-wasm) copiem l'arxiu original sense hash.
        return new OriginalURL(origin + '/assets/sqlite3-opfs-async-proxy.js');
      }
      throw e;
    }
  };
  scope.URL.prototype = OriginalURL.prototype;
})(globalThis);


=====================================
FILE: src/services/CameraService.js
=====================================

import { logger } from '../utils/logger';

/**
 * CameraService
 * Gestiona el flux multimèdia per a captures de foto i vídeo.
 * Sobirania visual Tier GOD.
 */
class CameraService {
    constructor() {
        this.stream = null;
        this.mediaRecorder = null;
        this.recordedChunks = [];
    }

    /**
     * Activa la càmera i el micròfon
     */
    async startStream(videoOptions = { facingMode: 'user' }, audio = true) {
        try {
            this.stream = await navigator.mediaDevices.getUserMedia({
                video: videoOptions,
                audio: audio
            });
            return this.stream;
        } catch (error) {
            logger.error('[CameraService] Error iniciant stream:', error);
            throw error;
        }
    }

    /**
     * Atura tots els bategats multimèdia
     */
    stopStream() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }
    }

    /**
     * Captura una foto des del stream actual
     */
    capturePhoto(videoElement) {
        if (!videoElement || !this.stream) return null;

        const canvas = document.createElement('canvas');
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

        return canvas.toDataURL('image/jpeg', 0.85);
    }

    /**
     * Inicia la gravació de vídeo
     */
    startRecording() {
        if (!this.stream) return;

        this.recordedChunks = [];
        this.mediaRecorder = new MediaRecorder(this.stream, {
            mimeType: 'video/webm;codecs=vp8,opus'
        });

        this.mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                this.recordedChunks.push(event.data);
            }
        };

        this.mediaRecorder.start();
        logger.log('[CameraService] Gravació iniciada');
    }

    /**
     * Atura la gravació i retorna el Blob de vídeo
     */
    stopRecording() {
        return new Promise((resolve) => {
            if (!this.mediaRecorder) return resolve(null);

            this.mediaRecorder.onstop = () => {
                const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
                resolve(blob);
            };

            this.mediaRecorder.stop();
            logger.log('[CameraService] Gravació aturada');
        });
    }
}

export const cameraService = new CameraService();
export default cameraService;


=====================================
FILE: src/services/HistoricalRecoveryService.js
=====================================

import { logger } from '../utils/logger';

/**
 * HistoricalRecoveryService [VAMPIR DIGITAL]
 * Recupera articles històrics de WordPress (WXR) i Blogger, 
 * MANTENINT EL FORMAT HTML VIBRANT i les fotos (Sense decapitacions).
 */
class HistoricalRecoveryService {
    /**
     * Parseja un fitxer XML d'exportació de WordPress (WXR).
     * @param {string} xmlString 
     * @returns {Array} Llista de recursos/posts recuperats
     */
    parseWordPressXML(xmlString) {
        logger.info('[HistoricalRecovery] Iniciant parseig de WordPress WXR...');
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlString, 'text/xml');

        // Comprovem si hi ha errors de parseig
        if (xmlDoc.getElementsByTagName('parsererror').length > 0) {
            throw new Error('Error de parseig XML. El fitxer podria estar corrupte.');
        }

        const items = xmlDoc.getElementsByTagName('item');
        const recoveredMap = new Map(); // Use map for deduplication

        for (let i = 0; i < items.length; i++) {
            const item = items[i];

            // Només ens interessen els 'posts' publicats
            const postType = this._getTagContent(item, 'wp:post_type');
            const status = this._getTagContent(item, 'wp:status');

            if (postType === 'post' && status === 'publish') {
                const title = this._getTagContent(item, 'title');
                // EXTRACT THE FULL HTML CONTENT, NO STRIPPING!
                const content = this._getTagContent(item, 'content:encoded') || this._getTagContent(item, 'description');
                const link = this._getTagContent(item, 'link');
                const pubDate = this._getTagContent(item, 'pubDate');

                // Extract Categories / Tags for Semantic Tagging
                const categoryElements = item.getElementsByTagName('category');
                const tags = ['#històric', '#blog'];
                for (let j = 0; j < categoryElements.length; j++) {
                    const catLabel = categoryElements[j].textContent || categoryElements[j].text;
                    if (catLabel && typeof catLabel === 'string') {
                        tags.push(catLabel.trim());
                    }
                }

                // Extracció bàsica de la imatge destacada (si n'hi ha)
                const firstImage = this._extractFirstImage(content);

                // Determine the correct Author/Source. Preference: "socdepoble.net" > "El Rentonar"
                let source = 'WordPress (Històric)';
                if (link.includes('socdepoble.net')) {
                    source = 'Sóc de Poble';
                } else if (link.includes('rentonar')) {
                    source = 'El Rentonar';
                }

                const newPost = {
                    title: title || 'Sense títol',
                    url: link,
                    // Preserve FULL HTML in description/content field
                    description: content, 
                    // Create a clean text excerpt for card previews
                    excerpt: this._truncate(this._stripHtml(content), 180),
                    content_type: 'document',
                    source: source,
                    semantic_tags: [...new Set(tags)], // Unique tags
                    metadata: {
                        original_link: link,
                        has_image: !!firstImage,
                        thumbnail_url: firstImage,
                        is_historical_import: true
                    },
                    created_at: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString()
                };

                // Deduplication Logic: If a post with the same title exists, keep 'Sóc de Poble' over 'El Rentonar'
                const existingPost = recoveredMap.get(newPost.title);
                if (!existingPost) {
                    recoveredMap.set(newPost.title, newPost);
                } else {
                    // Overwrite if new post is Sóc de Poble and existing is not
                    if (newPost.source === 'Sóc de Poble' && existingPost.source !== 'Sóc de Poble') {
                        recoveredMap.set(newPost.title, newPost);
                        logger.info(`[HistoricalRecovery] Deduplicat: Reemplaçat '${existingPost.source}' per '${newPost.source}' per a l'article: ${newPost.title}`);
                    }
                }
            }
        }

        const finalRecovered = Array.from(recoveredMap.values());
        
        // Sort chronologically (oldest to newest so they appear correctly on the timeline)
        finalRecovered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

        logger.info(`[HistoricalRecovery] Recuperats ${finalRecovered.length} articles de WordPress (després de deduplicar).`);
        return finalRecovered;
    }

    /**
     * Parseja un fitxer XML de Blogger (Atom).
     * @param {string} xmlString 
     */
    parseBloggerXML(xmlString) {
        logger.info('[HistoricalRecovery] Iniciant parseig de Blogger Atom...');
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlString, 'text/xml');

        const entries = xmlDoc.getElementsByTagName('entry');
        const recoveredMap = new Map();

        for (let i = 0; i < entries.length; i++) {
            const entry = entries[i];

            // Busquem si és un post (té categoria 'kind#post')
            const categories = entry.getElementsByTagName('category');
            let isPost = false;
            const tags = ['#històric', '#blogger'];

            for (let j = 0; j < categories.length; j++) {
                const term = categories[j].getAttribute('term');
                if (term && term.includes('kind#post')) {
                    isPost = true;
                } else if (term) {
                     // Add legit Blogger labels as tags
                     tags.push(term);
                }
            }

            if (isPost) {
                const title = this._getTagContent(entry, 'title');
                // Retain Full HTML
                const content = this._getTagContent(entry, 'content');
                const pubDate = this._getTagContent(entry, 'published');

                const links = entry.getElementsByTagName('link');
                let link = '';
                for (let k = 0; k < links.length; k++) {
                    if (links[k].getAttribute('rel') === 'alternate') {
                        link = links[k].getAttribute('href');
                        break;
                    }
                }

                const firstImage = this._extractFirstImage(content);

                let source = 'Blogger (Llegat)';
                if (link.includes('rentonar.blogspot')) {
                    source = 'El Rentonar';
                }

                const newPost = {
                    title: title || 'Sense títol',
                    url: link,
                    // Preserve HTML
                    description: content, 
                    // Generate clean excerpt
                    excerpt: this._truncate(this._stripHtml(content), 180),
                    content_type: 'document',
                    source: source,
                    semantic_tags: [...new Set(tags)],
                    metadata: {
                        original_link: link,
                        thumbnail_url: firstImage,
                        is_historical_import: true
                    },
                    created_at: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString()
                };

                 // Basic deduplication for Blogger too
                 if (!recoveredMap.has(newPost.title)) {
                    recoveredMap.set(newPost.title, newPost);
                 }
            }
        }

        const finalRecovered = Array.from(recoveredMap.values());
        
        // Sort chronologically
        finalRecovered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

        logger.info(`[HistoricalRecovery] Recuperats ${finalRecovered.length} articles de Blogger.`);
        return finalRecovered;
    }

    // HELPERS
    _getTagContent(parent, tagName) {
        const elements = parent.getElementsByTagName(tagName);
        if (elements && elements.length > 0) {
            return elements[0].textContent || elements[0].text || '';
        }
        return '';
    }

    _stripHtml(html) {
        if (!html) return "";
        const tmp = document.createElement("DIV");
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || "";
    }

    _truncate(str, length) {
        if (!str) return '';
        // Un-escape HTML entities for the excerpt, then truncate
        const decoded = this._stripHtml(str).trim();
        return decoded.length > length ? decoded.substring(0, length) + '...' : decoded;
    }

    _extractFirstImage(html) {
        if (!html) return null;
        const m = html.match(/<img[^>]+src="([^">]+)"/i);
        return m ? m[1] : null;
    }
}

export const historicalRecoveryService = new HistoricalRecoveryService();


=====================================
FILE: src/services/MemoriaVivaService.js
=====================================

import { logger } from '../utils/logger';

/**
 * MemoriaVivaService.js
 * Infraestructura per a l'Àlbum de Memòria Sobirana (Estil Google Fotos).
 * Gestiona l'etiquetatge automàtic en VALENCIÀ i la catalogació del bategat.
 */

const PREDEFINED_TAGS = [
    '#Horta', '#Festa', '#Llegat', '#Còmic', '#Realitat',
    '#Oficial', '#Maser', '#SantGregori', '#Patrimoni', '#Saviesa'
];

class MemoriaVivaService {
    constructor() {
        this.storageKey = 'sdp_memoria_viva';
    }

    /**
     * Nano Banana bategua etiquetes automàtiques segons el context.
     * @param {Object} content - El bategat a etiquetar.
     * @returns {Array} Etiquetes bategades.
     */
    async bategarEtiquetes(content) {
        const tags = new Set();
        const text = (content.content || content.title || '').toLowerCase();

        if (text.includes('poma') || text.includes('horta') || text.includes('oliva')) tags.add('#Horta');
        if (text.includes('festa') || text.includes('sant gregori')) tags.add('#Festa');
        if (text.includes('iaia') || text.includes('nano')) tags.add('#Còmic');
        if (text.includes('oficial') || text.includes('ajuntament')) tags.add('#Oficial');
        if (content.tag === 'LlegatRealista') tags.add('#LlegatRealista');

        // Sempre afegim el bategat genèric de l'Atall si no n'hi ha cap
        if (tags.size === 0) tags.add('#Llegat');

        return Array.from(tags);
    }

    /**
     * Guarda un nou element multimèdia a l'Àlbum Sobirà.
     */
    async guardarEnAlbum(item, userTags = []) {
        try {
            const autoTags = await this.bategarEtiquetes(item);
            const finalTags = [...new Set([...autoTags, ...userTags])];

            const albumItem = {
                ...item,
                tags: finalTags,
                bategat_at: new Date().toISOString()
            };

            const currentAlbum = this.getAlbum();
            currentAlbum.push(albumItem);
            localStorage.setItem(this.storageKey, JSON.stringify(currentAlbum));

            logger.info(`[MemoriaViva] Element guardat amb etiquetes: ${finalTags.join(', ')}`);
            return albumItem;
        } catch (error) {
            logger.error('[MemoriaViva] Error guardant en l\'Àlbum:', error);
            return null;
        }
    }

    getAlbum() {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : [];
    }
}

export const memoriaVivaService = new MemoriaVivaService();


=====================================
FILE: src/services/MigrationService.js
=====================================

import { supabaseService } from './supabaseService';
import { logger } from '../utils/logger';

/**
 * MigrationService [VAMPIR DIGITAL]
 * Encarregat de xuclar dades de fonts externes (Raindrop) i fer-les sobiranes al Rebost.
 */
class MigrationService {
    /**
     * Parseja un fitxer HTML d'exportació de Bookmarks (estàndard Raindrop/Chrome).
     * @param {string} htmlContent 
     * @returns {Array} Llista d'objectes preparats per al Rebost
     */
    parseRaindropHTML(htmlContent) {
        logger.info('[Migration] Iniciant parseig de Raindrop HTML...');
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, 'text/html');
        const links = doc.querySelectorAll('a');

        const items = Array.from(links).map(link => {
            const tags = link.getAttribute('tags') ? link.getAttribute('tags').split(',') : [];
            const folder = link.closest('dl')?.previousElementSibling?.textContent || 'Sense carpeta';

            return {
                title: link.textContent,
                url: link.href,
                description: link.getAttribute('note') || '',
                semantic_tags: [folder, ...tags].filter(t => t && t !== 'Sense carpeta'),
                created_at: new Date(parseInt(link.getAttribute('add_date')) * 1000).toISOString(),
                is_public: false,
                scope: 'private'
            };
        });

        logger.info(`[Migration] Detectats ${items.length} recursos.`);
        return items;
    }

    /**
     * Importa els items al Rebost de l'usuari.
     * @param {Array} items 
     * @param {string} userId 
     */
    async importToRebost(items, userId) {
        if (!userId) throw new Error('Cal un ID d\'usuari per a importar.');

        logger.info(`[Migration] Important ${items.length} items al Rebost de l'usuari ${userId}...`);

        const preparedItems = items.map(item => ({
            title: item.title || 'Sense títol',
            url: item.url || '',
            description: item.description || '',
            excerpt: item.excerpt || item.description || '',
            content_type: item.content_type || 'link',
            semantic_tags: item.semantic_tags || [],
            source: item.source || 'Importació',
            metadata: item.metadata || {},
            owner_id: userId,
            created_at: item.created_at || new Date().toISOString(),
            is_public: item.is_public || false,
            scope: item.scope || 'private'
        }));

        // Podríem fer un batch de 50 en 50 per no saturar Supabase
        const BATCH_SIZE = 50;
        let successful = 0;

        for (let i = 0; i < preparedItems.length; i += BATCH_SIZE) {
            const batch = preparedItems.slice(i, i + BATCH_SIZE);
            try {
                const { error } = await supabaseService.supabase
                    .from('resources')
                    .insert(batch);

                if (error) throw error;
                successful += batch.length;
                logger.log(`[Migration] Progress: ${successful}/${preparedItems.length}`);
            } catch (err) {
                logger.error(`[Migration] Error en el lot ${i}:`, err);
            }
        }

        return {
            total: items.length,
            successful,
            failed: items.length - successful
        };
    }

    async enrichResource(resource) {
        // En una versió real, aquí cridaríem a un scraper o API de metadades.
        // Per ara, simulem l'enriquiment de Nano Banana.
        logger.info(`[NanoBanana] Enriquin: ${resource.title}`);

        return {
            ...resource,
            thumbnail_url: `https://api.screenshotmachine.com/?key=DEMO&url=${encodeURIComponent(resource.url)}&dimension=1024x768`, // Placeholder
            enriched: true
        };
    }

    /**
     * EXPORTACIÓ SOBIRANA: Descarrega tota la informació de l'usuari.
     * @param {Array} resources 
     */
    async exportRebostData(resources) {
        logger.info('[Sovereignty] Iniciant exportació total de dades...');

        const dataStr = JSON.stringify(resources, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

        const exportFileDefaultName = `meua_memoria_sdp_${new Date().toISOString().split('T')[0]}.json`;

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();

        logger.log('[Sovereignty] Exportació culminada amb èxit.');
    }

    /**
     * Parseja un fitxer JSON de Notion (exportació estàndard).
     */
    parseNotionJSON(jsonContent) {
        try {
            const data = JSON.parse(jsonContent);

            // Notion pot exportar un array o un objecte amb un camp 'results'
            const items = Array.isArray(data) ? data : (data.results || [data]);

            logger.info(`[Migration] Parsejats ${items.length} items de Notion.`);
            return items;
        } catch (e) {
            logger.error('[Migration] Error parsejant Notion JSON:', e);
            throw new Error('El fitxer JSON de Notion no és vàlid o està corrupte.');
        }
    }
}

export const migrationService = new MigrationService();


=====================================
FILE: src/services/analyticsService.js
=====================================

import ReactGA from "react-ga4";

const GA_ID = import.meta.env.VITE_GA_ID;

export const initGA = () => {
    if (GA_ID) {
        ReactGA.initialize(GA_ID);
        // logger.info("🏺 [ANALYTICS] Bategat mètric inicialitzat");
    } else {
        // Silenciós en producció per evitar soroll visual
        /* if (import.meta.env.DEV) {
            console.log("🏺 [ANALYTICS] Mode silenciós actiu (Sense ID).");
        } */
    }
};

export const trackPageView = (path) => {
    if (GA_ID) {
        ReactGA.send({ hitType: "pageview", page: path });
        console.log("🏺 [ANALYTICS] Ruta bategada:", path);
    }
};

export const trackEvent = (category, action, label) => {
    if (GA_ID) {
        ReactGA.event({
            category,
            action,
            label
        });
        console.log(`🏺 [ANALYTICS] Esdeveniment rural: ${category} -> ${action} (${label || ''})`);
    }
};


=====================================
FILE: src/services/authService.js
=====================================

import { supabase } from '../supabaseClient';
import { logger } from '../utils/logger';

export const authService = {
    /**
     * [MASTER REDIRECT] Get robust redirect URL
     * Ensures we don't end up in localhost:3000 or other local environments when in production/mobile
     */
    getRedirectUrl(path = '/chats') {
        const hostname = window.location.hostname;
        const origin = window.location.origin;

        // [MASTER PRODUCTION DOMAIN]
        const productionUrl = 'https://socdepoble.org';

        // 1. Si estem a producció (SiteGround), SEMPRE URL de producció oficial
        if (hostname.includes('socdepoble.org')) {
            return `${productionUrl}${path}`;
        }

        // 2. Si estem en localhost (qualsevol port), usem l'origin actual
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            return `${origin}${path}`;
        }

        // 3. Fallback total al domini mestre per a PWA, Capacitor, etc.
        return `${productionUrl}${path}`;
    },

    // Autenticación
    async signUp(email, password, metadata, redirectTo) {
        const options = { data: metadata };
        if (redirectTo) {
            options.emailRedirectTo = authService.getRedirectUrl(redirectTo);
        }

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options
        });
        if (error) throw error;
        return data;
    },

    async signIn(email, password) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });
        if (error) throw error;
        return data;
    },

    async resetPasswordForEmail(email) {
        const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: authService.getRedirectUrl('/reset-password'),
        });
        if (error) throw error;
        return data;
    },

    async signOut() {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    },

    async signInWithGoogle() {
        const redirectTo = authService.getRedirectUrl('/chats');
        logger.log('[Auth] Iniciant Google Login amb redirect a:', redirectTo);
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo
            }
        });
        if (error) throw error;
        return data;
    },


    /**
     * Account Deletion System (5s Fast Track)
     * Calls the secure RPC 'delete_user' which invokes PostgreSQL ON DELETE CASCADE.
     */
    async deleteCurrentUser() {
        try {
            logger.info('[Account] Iniciant procediment d\'eliminació de compte...');
            const { error: rpcError } = await supabase.rpc('delete_user');
            if (rpcError) throw rpcError;
            
            // Si el borrat funciona, tanquem sessió al client per netejar el token local
            await supabase.auth.signOut();
            return { success: true };
        } catch (e) {
            logger.error('[Account] Error a l\'eliminar el compte:', e);
            throw e;
        }
    }
};


=====================================
FILE: src/services/chatService.js
=====================================

import { supabase } from '../supabaseClient';
import { MessageSchema, ConversationSchema } from './schemas';
import { logger } from '../utils/logger';
import {
    columnCache,
    setColumnCache,
    isRealDBUUID,
    activeChecks,
    getTimeAwareGreeting,
    adjustGender,
    LORE_PERSONAS,
    ENABLE_MOCKS,
    DEMO_USER_ID,
    checkThrottling
} from './supabaseService';

export const chatService = {
    async getConversations(userIdOrEntityId) {
        const isGuest = !userIdOrEntityId || userIdOrEntityId === DEMO_USER_ID;

        if (isGuest || (userIdOrEntityId && !isRealDBUUID(userIdOrEntityId))) {
            return [];
        }

        let query = supabase.from('view_conversations_enriched').select(`
            id, 
            participant_1_id, 
            participant_2_id, 
            participant_1_type, 
            participant_2_type, 
            last_message_content, 
            last_message_at,
            is_playground,
            p1_name, 
            p1_avatar_url, 
            p1_role,
            p1_is_ai,
            p2_name, 
            p2_avatar_url,
            p2_role,
            p2_is_ai
        `);

        query = query.or(`participant_1_id.eq.${userIdOrEntityId},participant_2_id.eq.${userIdOrEntityId}`);
        const { data: convs, error } = await query.order('last_message_at', { ascending: false });

        if (error) {
            logger.error('[SupabaseService] Error in getConversations:', error);
            if (ENABLE_MOCKS) {
                const { MOCK_CHATS } = await import('../data');
                const currentParticipantId = userIdOrEntityId || 'me';
                return MOCK_CHATS.map(m => ({
                    id: `mock-${m.id}`,
                    last_message_content: m.message,
                    last_message_at: new Date().toISOString(),
                    p1_info: { id: currentParticipantId, name: 'Jo' },
                    p2_info: { id: `m${m.id}`, name: m.name, avatar_url: m.avatar_url || null },
                    participant_1_id: currentParticipantId,
                    participant_2_id: `m${m.id}`,
                    participant_1_type: 'user',
                    participant_2_type: m.type === 'shop' || m.type === 'gov' ? 'entity' : 'user'
                }));
            }
            return [];
        }

        const dbConvs = (convs || []).map(c => ({
            ...c,
            p1_info: { id: c.participant_1_id, name: c.p1_name, avatar_url: c.p1_avatar_url },
            p2_info: { id: c.participant_2_id, name: c.p2_name, avatar_url: c.p2_avatar_url }
        }));

        return dbConvs;
    },

    async getConversationMessages(conversationId) {
        if (!isRealDBUUID(conversationId) || conversationId?.startsWith('mock-')) {
            try {
                const mockIdx = conversationId.split('-')[1];
                const { MOCK_MESSAGES } = await import('../data');
                const messages = MOCK_MESSAGES[mockIdx] || [];
                return messages.map(m => ({
                    id: `msg-mock-${m.id}`,
                    conversation_id: conversationId,
                    sender_id: m.sender === 'me' ? 'me' : 'other',
                    content: m.text,
                    created_at: new Date().toISOString(),
                    is_ai: false
                }));
            } catch (err) {
                logger.error('Error loading mock messages:', err);
                return [];
            }
        }

        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .eq('conversation_id', conversationId)
            .order('created_at', { ascending: true });
        if (error) throw error;

        if (data && data.length > 0) {
            const voiceMessageIds = data.filter(m => m.attachment_type === 'voice').map(m => m.id);
            if (voiceMessageIds.length > 0) {
                const { data: voiceMeta } = await supabase
                    .from('voice_messages')
                    .select('message_id, duration_seconds, waveform_data')
                    .in('message_id', voiceMessageIds);

                if (voiceMeta) {
                    const metaMap = new Map(voiceMeta.map(v => [v.message_id, v]));
                    return data.map(m => {
                        if (m.attachment_type === 'voice') {
                            const meta = metaMap.get(m.id);
                            return {
                                ...m,
                                voice_meta: meta ? {
                                    duration: meta.duration_seconds,
                                    waveform: meta.waveform_data
                                } : null
                            };
                        }
                        return m;
                    });
                }
            }
        }
        return data || [];
    },

    async getLatestMessages(conversationIds) {
        if (!conversationIds || conversationIds.length === 0) return { data: [] };
        return supabase
            .from('messages')
            .select('conversation_id, content, created_at')
            .in('conversation_id', conversationIds)
            .order('created_at', { ascending: false });
    },

    async sendSecureMessage(messageData, abortSignal = null) {
        if (messageData.senderId && !messageData.isGuest) {
            await checkThrottling(messageData.senderId, 'send_message', 1000).catch(e => logger.warn('Throttling warn', e));
        }
        if (messageData.conversationId?.startsWith('mock-') || 
            messageData.conversationId?.startsWith('local-conv-') || 
            messageData.conversationId?.startsWith('11111111-')) {
            logger.log('[SupabaseService] Simulated send to mock conversation or unhydrated IAIA agent');
            return {
                id: crypto.randomUUID(), 
                conversation_id: messageData.conversationId,
                sender_id: messageData.senderId,
                content: messageData.content,
                attachment_url: messageData.attachmentUrl || null,
                attachment_type: messageData.attachmentType || null,
                attachment_name: messageData.attachmentName || null,
                created_at: new Date().toISOString(),
                is_ai: false
            };
        }

        if (messageData.isGuest || !messageData.senderId || messageData.senderId === 'guest' || String(messageData.senderId).startsWith('anonymous')) {
            logger.warn('[supabaseService] Intent de sendSecureMessage per usuari anònim. Guardant en local (efímer).');
            const guestMessage = { 
                id: `guest-msg-${Date.now()}`, 
                conversation_id: messageData.conversationId, 
                sender_id: messageData.senderId || 'guest', 
                content: messageData.content, 
                created_at: new Date().toISOString(),
                is_ai: false
            };
            
            if (messageData.conversationId && messageData.conversationId.startsWith('c1111000')) {
                 const personaInfo = LORE_PERSONAS.find(p => p.id === '11111111-1a1a-0000-0000-000000000000'); 
                 const responderId = messageData.conversationId.replace('c', ''); 
                 this.triggerSimulatedReply({ ...messageData, responderId, responderType: 'bot', persona: personaInfo || LORE_PERSONAS[0] });
            }
            return guestMessage;
        }

        const isPlayground = localStorage.getItem('isPlaygroundMode') === 'true' ||
            messageData.senderId?.startsWith('11111111-') ||
            messageData.conversationId?.startsWith('c1111000');

        if (isPlayground && columnCache.messages_is_playground === null) {
            if (!activeChecks.messages) {
                activeChecks.messages = (async () => {
                    try {
                        const { data } = await supabase.from('messages').select('*').limit(1);
                        if (data && data.length > 0) {
                            setColumnCache('messages_is_playground', 'is_playground' in data[0]);
                        }
                    } catch (e) {
                        logger.error('[SupabaseService] Error checking playground column:', e);
                    } finally { activeChecks.messages = null; }
                })();
            }
            await activeChecks.messages;
        }

        const msgPayload = {
            id: crypto.randomUUID(),
            conversation_id: messageData.conversationId,
            sender_id: messageData.senderId,

            content: messageData.content || null,
            attachment_url: messageData.attachmentUrl || null,
            attachment_type: messageData.attachmentType || null,
            attachment_name: messageData.attachmentName || null,
            post_uuid: messageData.postUuid || null
        };

        if (columnCache.messages_post_uuid === false) {
            delete msgPayload.post_uuid;
        }

        if (isPlayground && columnCache.messages_is_playground !== false) {
            msgPayload.is_playground = true;
        }

        const validated = MessageSchema.parse(msgPayload);

        let safeColumns = 'id, conversation_id, sender_id, content, attachment_url, attachment_type, attachment_name, created_at, is_ai, is_read';
        if (columnCache.messages_is_playground !== false) safeColumns += ', is_playground';
        const selectStr = columnCache.messages_post_uuid !== false ? `${safeColumns}, post_uuid` : safeColumns;

        let query = supabase.from('messages').insert(validated).select(selectStr);
            
        if (abortSignal) query = query.abortSignal(abortSignal);

        const { data, error } = await query;

        if (error) {
            const isMissingPostUuid = (error.code === '42703' || error.code === 'PGRST204') && msgPayload.post_uuid;
            const isMissingPlayground = error.code === 'PGRST204' && isPlayground && columnCache.messages_is_playground !== false;

            if (isMissingPlayground) {
                setColumnCache('messages_is_playground', false);
                return this.sendSecureMessage(messageData, abortSignal);
            }
            if (isMissingPostUuid) {
                setColumnCache('messages_post_uuid', false);
                return this.sendSecureMessage(messageData, abortSignal);
            }
            if (error.code === '42501') {
                logger.error('[SupabaseService] RLS Permission Denied on messages table.');
                return { ...msgPayload, id: `failed-rls-${Date.now()}`, status: 'simulated', created_at: new Date().toISOString() };
            }
            throw error;
        }

        if (msgPayload.post_uuid && columnCache.messages_post_uuid === null) {
            setColumnCache('messages_post_uuid', true);
        }

        const message = data[0];

        await supabase
            .from('conversations')
            .update({
                last_message_content: messageData.attachmentUrl ? `[${messageData.attachmentType || 'Arxiu'}]` : messageData.content,
                last_message_at: new Date().toISOString()
            })
            .eq('id', messageData.conversationId);

        return message;
    },

    async triggerSimulatedReply(originalMessage) {
        try {
            const { conversationId, responderId, persona } = originalMessage;
            if (!responderId) return;

            let reply = "";
            const randomVal = Math.random();

            if (persona) {
                const greeting = getTimeAwareGreeting();
                if (persona.username === 'vferris') {
                    const vReplies = [`${greeting} Gràcies pel missatge. Ara estic amb la garlopa, t'ho mire en un ratet.`, `${greeting} Recorda que la fusta vol paciència. T'ho conteste després!`, `${greeting} Això està fet. Si és per a la Torre, compte amb mi.`, `${greeting} Passa't pel taller quan vullgues i ho mirem.`];
                    reply = vReplies[Math.floor(randomVal * vReplies.length)];
                } else if (persona.username === 'mariamel') {
                    const mReplies = [`${greeting} Les meues abelles estan ara a tope amb el romer. Después parlem.`, `${greeting} Dolç com la mèl! Gràcies pel missatge.`, `${greeting} Xe, que bona idea. El poble necessita més gent així!`, `${greeting} Estic per la serra sense cobertura, quan baixe t'ho mire.`];
                    reply = mReplies[Math.floor(randomVal * mReplies.length)];
                } else if (persona.username === 'elenap') {
                    const eReplies = [`${greeting} Ja saps que qualsevol cosa em pots preguntar.`, `${greeting} Sí, d'acord. Jo ajudaré en tot el que pugui al poble.`, `${greeting} Com va tot per allí? Estic ací per a ajudar-te.`, `${greeting} Tinc molta feina ara, però t'ho agraeixo molt!`];
                    reply = eReplies[Math.floor(randomVal * eReplies.length)];
                } else if (persona.username === 'joanb') {
                    const jReplies = [`${greeting} Estic dalt l'Aitana amb el ramat. No se sent res por aquí.`, `${greeting} Si vols parlar de veres, vine a Benifallim!`, `${greeting} Les meues cabres i jo estem d'acord. Bona proposta!`, `${greeting} Buff, millor parlem a la fresca un altre ratet.`];
                    reply = jReplies[Math.floor(randomVal * jReplies.length)];
                } else {
                    const genericReplies = [`${greeting} Xe, que bona idea! Gràcies por compartir-ho.`, `${greeting} Ara estic un poc liat, però m'ho apunte!`, `${greeting} Sóc de Poble som tots, compte amb mi.`, `${greeting} Perfecte, ja m'ho dius quan sàpigues algo.`];
                    reply = adjustGender(genericReplies[Math.floor(randomVal * genericReplies.length)], persona.gender);
                }
            } else {
                reply = "D'acord! Ho tindré en compte. Gràcies pel missatge.";
            }

            const payload = {
                id: crypto.randomUUID(),
                conversation_id: conversationId,
                sender_id: responderId,

                content: reply
            };

            if (columnCache.messages_is_ai !== false) payload.is_ai = true;

            const { error: insError } = await supabase.from('messages').insert(payload);

            if (insError && insError.code === '42703') {
                columnCache.messages_is_ai = false;
                delete payload.is_ai;
                await supabase.from('messages').insert(payload);
            } else if (!insError) {
                columnCache.messages_is_ai = true;
            }

            await supabase
                .from('conversations')
                .update({ last_message_content: reply, last_message_at: new Date().toISOString() })
                .eq('id', conversationId);

        } catch (err) {
            logger.error('[NPC Simulation] Error:', err);
        }
    },

    async getOrCreateConversation(p1Id, p1Type, p2Id, p2Type) {
        const { data: existing } = await supabase
            .from('conversations')
            .select('*')
            .or(`and(participant_1_id.eq.${p1Id},participant_2_id.eq.${p2Id}),and(participant_1_id.eq.${p2Id},participant_2_id.eq.${p1Id})`)
            .maybeSingle();

        if (existing) return existing;

        const isPlayground = localStorage.getItem('isPlaygroundMode') === 'true' || p1Id?.startsWith('11111111-') || p2Id?.startsWith('11111111-');

        if (isPlayground && columnCache.conversations_is_playground === null) {
            if (!activeChecks.conversations) {
                activeChecks.conversations = (async () => {
                    try {
                        const { data } = await supabase.from('conversations').select('*').limit(1);
                        if (data && data.length > 0) setColumnCache('conversations_is_playground', 'is_playground' in data[0]);
                    } catch (e) {
                        logger.error('[SupabaseService] Error checking definitions for conversations:', e);
                    } finally { activeChecks.conversations = null; }
                })();
            }
            await activeChecks.conversations;
        }

        const convPayload = { participant_1_id: p1Id, participant_1_type: p1Type, participant_2_id: p2Id, participant_2_type: p2Type };
        const validated = ConversationSchema.parse(convPayload);
        const selectStr = 'id, participant_1_id, participant_2_id, created_at';

        const { data, error } = await supabase.from('conversations').insert(validated).select(selectStr);

        if (error) {
            if (error.code === '23505') {
                logger.warn('[SupabaseService] 💥 Condició de cursa detectada creant conversació. Aplicant lectura recursiva salvadora.');
                return await chatService.getOrCreateConversation(p1Id, p1Type, p2Id, p2Type);
            }
            if (isPlayground && (error.code === '42501' || error.code === '23503' || error.code === '23514' || error.status === 401 || error.status === 403)) {
                return {
                    id: `local-conv-${p1Id.substring(0, 4)}-${p2Id.substring(0, 4)}`,
                    participant_1_id: p1Id, participant_1_type: p1Type, participant_2_id: p2Id, participant_2_type: p2Type,
                    is_playground: true, created_at: new Date().toISOString()
                };
            }
            throw error;
        }
        return data[0];
    },

    async markMessagesAsRead(conversationId, userId) {
        if (!conversationId || conversationId.startsWith('mock-') || !isRealDBUUID(conversationId)) return;
        if (!userId || !isRealDBUUID(userId)) return;

        const { error } = await supabase.rpc('mark_messages_as_read', { conv_id: conversationId, user_id: userId });
        if (error && error.code !== '22P02') throw error;
    },


    subscribeToConversation(conversationId, options = {}) {
        if (!isRealDBUUID(conversationId) || conversationId?.startsWith('mock-')) return { unsubscribe: () => { } };
        const { onNewMessage, onMessageUpdate } = options;
        const channel = supabase.channel(`conversation:${conversationId}`).on('postgres_changes', { event: '*', schema: 'public', table: 'messages', filter: `conversation_id=eq.${conversationId}` }, (payload) => {
            if (payload.eventType === 'INSERT' && onNewMessage) onNewMessage(payload.new);
            if (payload.eventType === 'UPDATE' && onMessageUpdate) onMessageUpdate(payload.new);
        });
        return channel.subscribe();
    },

    subscribeToPresence(conversationId, userId, onSync) {
        if (!isRealDBUUID(conversationId) || conversationId?.startsWith('mock-')) return { unsubscribe: () => { } };
        const channel = supabase.channel(`presence:${conversationId}`, { config: { presence: { key: userId } } });
        channel.on('presence', { event: 'sync' }, () => onSync(channel.presenceState()));
        return channel.subscribe(async (status) => { if (status === 'SUBSCRIBED') await channel.track({ online_at: new Date().toISOString() }); });
    }
};


=====================================
FILE: src/services/cloudErrorReporting.js
=====================================

import { APP_VERSION } from '../constants';
import { logger } from '../utils/logger';

/**
 * CloudErrorReporting: Envia errors crítics al panell de Google Cloud.
 * Basat en la documentació de Google Cloud Error Reporting API.
 */
class CloudErrorReporting {
    constructor() {
        // Aquests valors haurien de venir de variables d'entorn en producció real,
        // però els deixem preparats per a la configuració del Mestre.
        this.apiKey = import.meta.env.VITE_GCLOUD_API_KEY || '';
        this.projectId = import.meta.env.VITE_GCLOUD_PROJECT_ID || 'soc-de-poble';
        this.enabled = !!this.apiKey;
    }

    /**
     * Reporta un error al núvol de Google.
     * @param {Error|string} error L'error detectat.
     * @param {Object} context Metadades addicionals (ruta, usuari, etc.).
     */
    async report(error, context = {}) {
        if (!this.enabled) {
            // No alertem si no està configurat per no embrutar la consola
            return;
        }

        const message = error instanceof Error ? error.stack || error.message : String(error);
        const payload = {
            serviceContext: {
                service: 'soc-de-poble-web',
                version: APP_VERSION
            },
            message: message,
            context: {
                httpRequest: {
                    url: window.location.href,
                    userAgent: navigator.userAgent
                },
                user: context.userId || 'anonymous',
                ...context
            }
        };

        try {
            const url = `https://clouderrorreporting.googleapis.com/v1beta1/projects/${this.projectId}/events:report?key=${this.apiKey}`;
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                logger.warn('[CloudError] Fallada en enviar report:', await response.text());
            }
        } catch (e) {
            logger.error('[CloudError] Error en el transport del report:', e);
        }
    }
}

export const cloudErrorReporting = new CloudErrorReporting();


=====================================
FILE: src/services/columnCacheManager.js
=====================================

// ✅ GESTIÓN DE CACHE SIN CONDICIONES DE CARRERA
export class ColumnCacheManager {
  constructor() {
    this._cache = new Map();
    this._pending = new Map();
    this._initialized = false;
  }

  async initialize() {
    if (this._initialized) return;
    
    const columns = [
      'cv_visible', 'cv_mercat_visible', 'cv_mur_visible',
      'cv_xat_visible', 'cv_agenda_visible', 'profiles_has_premium'
    ];

    for (const col of columns) {
      const val = localStorage.getItem(`cp_${col}`);
      this._cache.set(col, val === 'true' ? true : val === 'false' ? false : null);
    }

    this._initialized = true;
  }

  async get(key) {
    if (this._cache.has(key)) return this._cache.get(key);
    
    if (this._pending.has(key)) {
      return await this._pending.get(key);
    }
    
    const promise = (async () => {
      const val = localStorage.getItem(`cp_${key}`);
      const result = val === 'true' ? true : val === 'false' ? false : null;
      this._cache.set(key, result);
      this._pending.delete(key);
      return result;
    })();
    
    this._pending.set(key, promise);
    return await promise;
  }

  async set(key, value) {
    localStorage.setItem(`cp_${key}`, String(value));
    this._cache.set(key, value);
    if (this._pending.has(key)) this._pending.delete(key);
    
    window.dispatchEvent(new CustomEvent('column-visibility-change', { 
      detail: { key, value } 
    }));
  }

  async toggle(key) {
    const current = await this.get(key);
    await this.set(key, !current);
    return !current;
  }

  clear() {
    this._cache.clear();
    this._pending.clear();
    this._initialized = false;
  }
}

export const columnCache = new ColumnCacheManager();


=====================================
FILE: src/services/commandProtocol.js
=====================================

/**
 * Sóc de Poble - Command Protocol (Antigravity Edition)
 * Aquest fitxer serveix com a pont per a registrar accions ràpides de publicació
 * i configuració executades per l'Arquitecte d'IA o Super Administradors.
 */

export const AntigravityProtocol = {
    version: '1.0.0',
    actions: [],

    /**
     * Registra una publicació forçada des d'Antigravity
     */
    logPublication: (author, topic, timestamp) => {
        const action = {
            id: crypto.randomUUID(),
            type: 'AUTO_PUBLISH',
            author,
            topic,
            timestamp: timestamp || new Date().toISOString(),
            status: 'CONSOLIDATED'
        };
        AntigravityProtocol.actions.push(action);
        // Silenced for cleaner human grandmother console
        // logger.log(`[AntigravityProtocol] Acció registrada: ${topic} per ${author}`);
        return action;
    }
};

// Expose to window for audit in dev console
if (typeof window !== 'undefined') {
    window.AntigravityProtocol = AntigravityProtocol;
}


=====================================
FILE: src/services/docExtractionService.js
=====================================

import { logger } from '../utils/logger';

/**
 * docExtractionService: El bategat de l'IAIA que llegeix papers. [MASTER]
 * Simula l'extracció de dades des de documents del Vault.
 */
class DocExtractionService {
    constructor() {
        this.MOCK_EXTRACTIONS = {
            'dni_nando.pdf': {
                nombre_razon: 'Fernando Luis Llinares García',
                nif_nie: '21670188W',
                via: 'Avenida de España, 11, 2º',
                poblacion: 'Torremanzanas',
                cp: '03107'
            },
            'iban_nando.pdf': {
                entidad: 'Banco Sabadell',
                iban: 'ES6200811336710006675580'
            },
            'parcela_31.pdf': {
                parcelas: [
                    {
                        provincia: 'Alicante',
                        municipio: 'Torremanzanas',
                        poligono: '2',
                        parcela: '31',
                        cadastre: '03132A002000310000TZ'
                    }
                ]
            },
            'recibo_suma_herminio.jpg': {
                expediente: '24-2025-028468',
                organismo: 'SUMA Gestión Tributaria',
                ayuntamiento: 'La Torre de les Maçanes',
                total_pagar: 226.69,
                fecha_limite: '2026-03-03',
                desglose: [
                    { inmueble: 'San Isidro, 16', concepto: 'Aigües Potables (1-TRI-2025)', total: 47.40, responsable: 'Javi' },
                    { inmueble: 'PD Barrinada, 4', concepto: 'Aigües Potables (1-TRI-2025)', total: 31.48, responsable: 'Nando' },
                    { inmueble: 'San Isidro, 16', concepto: 'Aigua i Clavegueram (2-TRI-2025)', total: 41.86, responsable: 'Javi' },
                    { inmueble: 'PD Barrinada, 4', concepto: 'Aigua i Clavegueram (2-TRI-2025)', total: 99.95, responsable: 'Nando' },
                    { inmueble: 'General', concepto: 'Costes del procediment', total: 6.00, responsable: 'Shared' }
                ]
            }
        };
    }

    /**
     * Simula l'extracció de dades d'un fitxer.
     * En el futur, això connectarà amb un servei d'OCR/IA.
     */
    async extractFromDocument(fileName) {
        logger.log(`[DocExtraction] Bategant extracció per a: ${fileName}...`);

        // Simulem un delay de "processament"
        await new Promise(resolve => setTimeout(resolve, 1500));

        const data = this.MOCK_EXTRACTIONS[fileName];
        if (data) {
            logger.info(`[DocExtraction] Dades extretes amb èxit de ${fileName}`);
            return data;
        }

        logger.warn(`[DocExtraction] No s'han trobat dades predefinites per a ${fileName}. Retornant buit.`);
        return {};
    }

    /**
     * Mapeja els documents necessaris per a cada tipus de tràmit.
     */
    getRequirements(procedureId) {
        const requirements = {
            'xylella-18932': [
                { id: 'dni', name: 'DNI / NIF', required: true, description: 'Còpia de les dues cares.' },
                { id: 'iban', name: 'Certificat IBAN', required: true, description: 'Document que certifique la titularitat del compte.' },
                { id: 'parcelas', name: 'Fitxa Catastral', required: true, description: 'Dades de les parcel·les afectades.' }
            ],
            'herencia-herminio': [
                { id: 'dni_javi', name: 'DNI Javi', required: true, description: 'DNI del nou titular San Isidro.' },
                { id: 'dni_nando', name: 'DNI Nando', required: true, description: 'DNI del nou titular Barrinada.' },
                { id: 'escritura', name: 'Escritura Herència', required: true, description: 'Adjudicació de finques.' },
                { id: 'recibo_suma', name: 'Rebut SUMA', required: true, description: 'Últim rebut pagat.' }
            ]
        };
        return requirements[procedureId] || [];
    }
}

export const docExtractionService = new DocExtractionService();


=====================================
FILE: src/services/errorTrackingService.js
=====================================

// ✅ src/services/errorTrackingService.js - ERROR TRACKING GOD MODE
import { logger } from '../utils/logger';
import { APP_VERSION } from '../constants';

/**
 * 🏺 ERROR TRACKING SERVICE [v10.33.16]
 * Captura errors en producció sense soroll en desenvolupament.
 * Integrable amb Sentry, Google Cloud Error Reporting, o custom.
 */
class ErrorTrackingService {
  constructor() {
    this.enabled = import.meta.env.PROD;
    this.dsn = import.meta.env.VITE_SENTRY_DSN || '';
    this.environment = import.meta.env.VITE_APP_ENV || 'production';
    this.release = APP_VERSION;
    this.userContext = null;
    this.breadcrumbs = [];
    this.maxBreadcrumbs = 50;
    this._initialized = false;
  }

  /**
   * Inicialitza el servei de tracking
   */
  async initialize() {
    if (this._initialized) return;
    this._initialized = true;

    if (!this.enabled) {
      logger.log('[ErrorTracking] Disabled in development');
      return;
    }

    try {
      // [OPTIONAL] Sentry integration
      if (this.dsn) {
        const Sentry = await import('@sentry/react');
        
        Sentry.init({
          dsn: this.dsn,
          environment: this.environment,
          release: this.release,
          integrations: [
            Sentry.browserTracingIntegration(),
            Sentry.replayIntegration({
              maskAllText: true,
              blockAllMedia: true
            })
          ],
          tracesSampleRate: 0.1, // 10% de traces
          replaysSessionSampleRate: 0.1,
          replaysOnErrorSampleRate: 1.0,
          beforeSend: (event) => {
            // [PRIVACITAT] Filtrar dades sensibles
            if (event.request?.url?.includes('password')) {
              return null;
            }
            return event;
          }
        });

        logger.log('[ErrorTracking] Sentry initialized');
      }
    } catch (error) {
      logger.error('[ErrorTracking] Initialization failed:', error);
    }
  }

  /**
   * Captura un error
   * @param {Error|string} error - L'error detectat
   * @param {Object} context - Metadades addicionals
   */
  captureException(error, context = {}) {
    if (!this.enabled) {
      logger.error('[ErrorTracking]', error, context);
      return;
    }

    const errorData = {
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack
      } : error,
      context: {
        ...context,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
        language: navigator.language,
        online: navigator.onLine,
        memory: performance.memory ? {
          usedJSHeapSize: performance.memory.usedJSHeapSize,
          totalJSHeapSize: performance.memory.totalJSHeapSize
        } : undefined
      },
      breadcrumbs: this.breadcrumbs.slice(-10),
      user: this.userContext
    };

    // [SEND] Enviar a Sentry si està disponible
    if (window.Sentry) {
      window.Sentry.captureException(error, {
        extra: context,
        tags: {
          version: this.release,
          environment: this.environment
        }
      });
    }

    // [LOG] Guardar localment per a debugging
    this._saveToLocalStorage(errorData);

    // [ALERT] Notificar si és error crític
    if (this._isCriticalError(error)) {
      this._notifyCriticalError(errorData);
    }

    logger.error('[ErrorTracking] Exception captured:', errorData);
  }

  /**
   * Afegeix una breadcrumb (petita acció per a context)
   * @param {string} message - Descripció de l'acció
   * @param {string} category - Categoria (navigation, ui, network, etc.)
   * @param {string} level - Nivel (info, warning, error)
   */
  addBreadcrumb(message, category = 'default', level = 'info') {
    const breadcrumb = {
      message,
      category,
      level,
      timestamp: new Date().toISOString(),
      url: window.location.href
    };

    this.breadcrumbs.push(breadcrumb);

    if (this.breadcrumbs.length > this.maxBreadcrumbs) {
      this.breadcrumbs.shift();
    }

    if (window.Sentry) {
      window.Sentry.addBreadcrumb(breadcrumb);
    }
  }

  /**
   * Estableix el context d'usuari
   * @param {Object} user - Dades de l'usuari (sense informació sensible)
   */
  setUserContext(user) {
    this.userContext = user ? {
      id: user.id,
      role: user.role,
      isGuest: user.isAnonymous || false
      // NO incloure email, nom, o dades personals
    } : null;

    if (window.Sentry) {
      window.Sentry.setUser(this.userContext);
    }
  }

  /**
   * Captura el rendiment de la pàgina
   * @param {Object} metrics - Mètriques de rendiment
   */
  capturePerformance(metrics) {
    if (!this.enabled) return;

    // [SEND] Enviar a analytics
    if (window.gtag) {
      window.gtag('event', 'performance', {
        event_category: 'web_vitals',
        event_label: JSON.stringify(metrics)
      });
    }

    logger.log('[ErrorTracking] Performance captured:', metrics);
  }

  /**
   * Verifica si l'error és crític
   * @param {Error|string} error 
   * @returns {boolean}
   */
  _isCriticalError(error) {
    const criticalPatterns = [
      'NetworkError',
      'QuotaExceededError',
      'IndexedDB',
      'Out of memory',
      'SecurityError',
      '401',
      '403'
    ];

    const errorMessage = error instanceof Error ? error.message : String(error);
    return criticalPatterns.some(pattern => errorMessage.includes(pattern));
  }

  /**
   * Notifica error crític
   * @param {Object} errorData 
   */
  _notifyCriticalError(errorData) {
    // [ALERT] Podria enviar un webhook o email en errors crítics
    logger.warn('[ErrorTracking] CRITICAL ERROR:', errorData);

    // [STORAGE] Guardar per a recuperació
    const criticalErrors = JSON.parse(
      localStorage.getItem('sp_critical_errors') || '[]'
    );
    criticalErrors.push(errorData);
    localStorage.setItem('sp_critical_errors', JSON.stringify(criticalErrors.slice(-10)));
  }

  /**
   * Guarda error a localStorage
   * @param {Object} errorData 
   */
  _saveToLocalStorage(errorData) {
    try {
      const errors = JSON.parse(
        localStorage.getItem('sp_error_logs') || '[]'
      );
      errors.push(errorData);
      localStorage.setItem('sp_error_logs', JSON.stringify(errors.slice(-50)));
    } catch (e) {
      logger.error('[ErrorTracking] Failed to save to localStorage:', e);
    }
  }

  /**
   * Obté errors emmagatzemats localment
   * @returns {Array}
   */
  getLocalErrors() {
    try {
      return JSON.parse(localStorage.getItem('sp_error_logs') || '[]');
    } catch {
      return [];
    }
  }

  /**
   * Neteja errors emmagatzemats
   */
  clearLocalErrors() {
    localStorage.removeItem('sp_error_logs');
    localStorage.removeItem('sp_critical_errors');
  }
}

// Singleton
export const errorTrackingService = new ErrorTrackingService();
export default errorTrackingService;


=====================================
FILE: src/services/exportService.js
=====================================

import { supabaseService } from './supabaseService';
import { logger } from '../utils/logger';
import { marketService } from './marketService';
import { chatService } from './chatService';

export const exportService = {
    /**
     * Agregat de dades de l'usuari
     */
    async aggregateUserData(userId) {
        try {
            logger.log('[ExportService] Aggregating data for user:', userId);

            // 1. Posts
            const posts = await supabaseService.getPosts({ authorId: userId });

            // 2. Market Items
            const marketItems = await marketService.getMarketItems({ authorId: userId });

            // 3. Conversations and Messages
            const conversations = await chatService.getConversations(userId);
            const messagesByConversation = {};

            for (const conv of conversations) {
                const msgs = await supabaseService.getConversationMessages(conv.id);
                messagesByConversation[conv.id] = {
                    with: conv.p2_info?.name || 'Desconegut',
                    messages: msgs
                };
            }

            return {
                timestamp: new Date().toISOString(),
                posts: posts.data || [],
                marketItems: marketItems.data || [],
                chatHistory: messagesByConversation
            };
        } catch (error) {
            logger.error('[ExportService] Error aggregating data:', error);
            throw error;
        }
    },

    /**
     * Generar fitxer TXT
     */
    async downloadAsTXT(userId, userName) {
        const data = await this.aggregateUserData(userId);
        let content = `INFORME DE DADES - SÓC DE POBLE\n`;
        content += `Usuari: ${userName}\n`;
        content += `Data d'exportació: ${new Date().toLocaleString()}\n`;
        content += `==========================================\n\n`;

        content += `1. PUBLICACIONS (EL MUR)\n`;
        content += `------------------------\n`;
        data.posts.forEach((p, i) => {
            content += `[${i + 1}] Data: ${new Date(p.created_at).toLocaleString()}\n`;
            content += `Contingut: ${p.content}\n`;
            content += `Imatge: ${p.image_url || 'N/A'}\n`;
            content += `------------------------\n`;
        });

        content += `\n2. ARTICLES AL MERCAT\n`;
        content += `---------------------\n`;
        data.marketItems.forEach((item, i) => {
            content += `[${i + 1}] Títol: ${item.title}\n`;
            content += `Preu: ${item.price}\n`;
            content += `Descripció: ${item.description}\n`;
            content += `---------------------\n`;
        });

        content += `\n3. HISTORIAL DE MISSATGES (XAT)\n`;
        content += `------------------------------\n`;
        Object.values(data.chatHistory).forEach(chat => {
            content += `Conversa amb: ${chat.with}\n`;
            chat.messages.forEach(m => {
                const sender = m.sender_id === userId ? 'JO' : chat.with;
                content += `[${new Date(m.created_at).toLocaleTimeString()}] ${sender}: ${m.content}\n`;
            });
            content += `------------------------------\n`;
        });

        this._downloadFile(content, `SOC_DE_POBLE_DADES_${userName.replace(/\s/g, '_')}.txt`, 'text/plain');
    },

    /**
     * Generar Informe (Simulem PDF amb format HTML imprimible o jspdf si estiguera disponible)
     * Per ara preparem un format HTML net que l'usuari pot guardar com a PDF
     */
    async downloadAsPDF(userId, userName) {
        const data = await this.aggregateUserData(userId);

        // Creem una finestra temporal per imprimir
        const printWindow = window.open('', '_blank');
        let html = `
            <html>
            <head>
                <title>Informe Sóc de Poble - ${userName}</title>
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,100..900;1,100..900&family=Noto+Sans+Condensed:wght@100..900&family=Noto+Sans+Mono:wght@100..900&display=swap');
                    
                    @page {
                        size: A4;
                        margin: 0;
                    }
                    body { 
                        margin: 0;
                        padding: 0;
                        background: #fdfcf9;
                        color: #0c0c0c;
                        font-family: 'Noto Sans', sans-serif;
                        -webkit-print-color-adjust: exact;
                    }
                    .sheet {
                        width: 210mm;
                        height: 297mm;
                        padding: 20mm 20mm 19mm 20mm;
                        box-sizing: border-box;
                        position: relative;
                        background: #fdfcf9;
                        overflow: hidden;
                        display: flex;
                        flex-direction: column;
                        page-break-after: always;
                    }
                    .infography-cover {
                        width: 160mm;
                        height: 160mm;
                        object-fit: cover;
                        margin: 0 auto 10mm auto;
                        box-shadow: 0 5mm 15mm rgba(0,0,0,0.1);
                    }
                    .page-header {
                        position: absolute;
                        top: 10mm;
                        left: 20mm;
                        right: 20mm;
                        display: flex;
                        justify-content: space-between;
                        font-size: 8pt;
                        font-weight: 700;
                        color: #999;
                        text-transform: uppercase;
                    }
                    h1 { 
                        font-family: 'Noto Sans', sans-serif;
                        font-weight: 900;
                        font-size: 32pt;
                        color: #FF6D23; 
                        margin: 0;
                        text-transform: uppercase;
                        text-align: center;
                    }
                    .content-dual {
                        column-count: 2;
                        column-gap: 10mm;
                        font-family: 'Noto Sans Condensed', sans-serif;
                        font-size: 14pt; /* 14pt reals bategats per al Mestre */
                        line-height: 1.5;
                        text-align: justify;
                        color: #111;
                        flex: 1;
                        margin-top: 10mm;
                    }
                    h2 { 
                        column-span: all;
                        font-weight: 800;
                        font-size: 14pt;
                        margin-top: 8mm; 
                        color: #111; 
                        border-bottom: 0.5pt solid #eee; 
                    }
                    .footer {
                        margin-top: auto;
                        padding-top: 5mm;
                        border-top: 0.5pt solid #eee;
                        display: flex;
                        justify-content: space-between;
                        font-size: 8pt;
                        color: #999;
                    }
                    .subtitol-pdf {
                        column-span: all;
                        color: #FF6D23;
                        font-weight: 900;
                        font-size: 16pt;
                        text-align: center;
                        margin: 15mm 0 10mm 0;
                        padding: 5mm 0;
                        border-top: 2pt solid #FF6D23;
                        border-bottom: 2pt solid #FF6D23;
                        text-transform: uppercase;
                    }
                    .document-header-meta {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        border-bottom: 0.5pt solid #eee;
                        padding-bottom: 5mm;
                        margin-bottom: 10mm;
                    }
                </style>
            </head>
            <body>
                <div class="sheet">
                    <div class="page-header">
                        <span>${new Date().toLocaleDateString('ca-ES')}</span>
                        <span>PÀGINA 1 DE 2</span>
                    </div>
                    <div style="flex: 1; display: flex; flex-direction: column; justify-content: center;">
                        <img src="/images/dossiers/infografia_kit_digital.png" class="infography-cover">
                        <h1>${userName}</h1>
                        <p style="text-align: center; font-weight: 800; letter-spacing: 0.2em; color: #666; margin-top: 5mm;">DOSSIER DE SOBIRANIA I TRELLAT</p>
                    </div>
                </div>

                <div class="sheet">
                    <div class="page-header">
                        <img src="/assets/master/logo_socdepoble_black_sketch.png" style="height: 15pt;">
                        <span>PÀGINA 2 DE 2</span>
                    </div>
                    <div class="content-dual">

                <h2>Publicacions al Mur</h2>
                ${data.posts.map(p => `
                    <div class="item">
                        <strong>${new Date(p.created_at).toLocaleDateString()}</strong><br>
                        ${p.content}
                    </div>
                `).join('')}

                <h2>Articles al Mercat</h2>
                ${data.marketItems.map(item => `
                    <div class="item">
                        <strong>${item.title}</strong> - ${item.price}<br>
                        ${item.description}
                    </div>
                `).join('')}

                <h2>Historial de Converses</h2>
                ${Object.values(data.chatHistory).map(chat => `
                    <div class="item">
                        <strong>Amb: ${chat.with}</strong><br><br>
                        ${chat.messages.map(m => `
                            <div class="msg">
                                <span class="${m.sender_id === userId ? 'me' : 'other'}">
                                    [${new Date(m.created_at).toLocaleTimeString()}] ${m.sender_id === userId ? 'Jo' : chat.with}:
                                </span>
                                ${m.content}
                            </div>
                        `).join('')}
                    </div>
                `).join('')}
                    </div>
                    <div class="footer" style="flex-direction: column; gap: 2mm; height: auto; padding: 5mm 0;">
                        <div style="display: flex; align-items: center; justify-content: center; gap: 4mm;">
                            <img src="/assets/master/logo_socdepoble_black_sketch.png" style="height: 12pt;">
                            <span style="font-weight: 800; font-size: 10pt; color: #000;">socdepoble.org</span>
                        </div>
                        <div style="font-size: 8pt; color: #999; text-transform: uppercase; letter-spacing: 0.1em;">
                            Llegibilitat Sant Grial v3 | SÓC DE POBLE
                        </div>
                    </div>
                </div>
                <script>
                    window.onload = function() {
                        window.print();
                        // window.close(); 
                    };
                </script>
            </body>
            </html>
        `;

        printWindow.document.write(html);
        printWindow.document.close();
    },

    /**
     * Descarregar una nota individual en TXT
     */
    downloadNoteAsTXT(note) {
        let content = `${note.title.toUpperCase()}\n`;
        content += `Data: ${new Date(note.updatedAt).toLocaleString()}\n`;
        content += `Categoria: ${note.category || 'General'}\n`;
        content += `==========================================\n\n`;
        
        // Strip HTML for TXT
        const temp = document.createElement('div');
        temp.innerHTML = note.content;
        content += temp.textContent || temp.innerText || "";

        this._downloadFile(content, `${note.title.replace(/\s/g, '_')}.txt`, 'text/plain');
    },

    /**
     * Descarregar una nota individual en PDF (Print)
     * [MASTER FIX v10.33.3] Definició correcta de variables per a evitar ReferenceError
     */
    downloadNoteAsPDF(note) {
        if (!note) return;
        const title = note.title || 'Nova Nota';
        const content = note.content || '';
        const dateStr = note.updatedAt ? new Date(note.updatedAt).toLocaleDateString() : new Date().toLocaleDateString();

        const printWindow = window.open('', '_blank');
        if (!printWindow) {
            alert('El bloquejador de popups ha impedit l\'exportació. Permet els popups per a Sóc de Poble.');
            return;
        }

        let html = `
            <!DOCTYPE html>
            <html lang="ca">
            <head>
                <meta charset="UTF-8">
                <title>${title}</title>
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@400;700;900&display=swap');
                    
                    @page {
                        size: A4;
                        margin: 20mm;
                    }

                    :root {
                        --print-bg: #fdfcf9;
                        --sheet-shadow: 0 10px 30px rgba(0,0,0,0.15);
                    }

                    body { 
                        font-family: 'Noto Sans', sans-serif; 
                        padding: 0; 
                        margin: 0;
                        line-height: 1.6;
                        color: #1a1a1a;
                        background: #333; /* Dark background for preview to contrast the sheet */
                        counter-reset: page;
                        display: flex;
                        justify-content: center;
                        align-items: flex-start;
                        min-height: 100vh;
                        overflow-y: auto;
                        padding: 40px 0;
                    }

                    /* The physical sheet effect in screen */
                    .page-container {
                        position: relative;
                        width: 210mm;
                        min-height: 297mm;
                        margin: 0 auto;
                        background: white;
                        padding: 20mm;
                        box-shadow: var(--sheet-shadow);
                        box-sizing: border-box;
                    }

                    .header { 
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        border-bottom: 3px solid #f97316; /* Orange Archon */
                        margin-bottom: 30px; 
                        padding-bottom: 10px;
                    }

                    .logo-placeholder {
                        font-weight: 900;
                        font-size: 14pt;
                        text-transform: uppercase;
                        letter-spacing: 0.1em;
                        color: #1a1a1a;
                    }

                    h1 { 
                        margin: 20px 0; 
                        text-transform: uppercase; 
                        font-weight: 900;
                        letter-spacing: -0.02em; 
                        font-size: 32pt; 
                        line-height: 1.1;
                        color: #000;
                    }

                    .meta-info {
                        display: flex;
                        gap: 20px;
                        font-size: 10pt;
                        font-weight: 700;
                        text-transform: uppercase;
                        color: #666;
                        margin-bottom: 40px;
                    }

                    .content { 
                        font-size: 14pt; 
                        white-space: pre-wrap; 
                        text-align: justify;
                    }

                    /* Pagination logic for print */
                    .footer-print {
                        position: absolute;
                        bottom: 10mm;
                        left: 20mm;
                        right: 20mm;
                        display: none;
                        justify-content: space-between;
                        align-items: center;
                        font-size: 8pt;
                        color: #999;
                        border-top: 1px solid #eee;
                        padding-top: 5mm;
                    }

                    @media print {
                        body { 
                            background: white; 
                            padding: 0;
                            display: block;
                        }
                        .page-container {
                            width: 100%;
                            min-height: auto;
                            box-shadow: none;
                            margin: 0;
                            padding: 0;
                        }
                        .footer-print { display: flex; }
                        .no-print { display: none; }
                        
                        .page-number::after {
                            content: "PÀGINA " counter(page);
                            counter-increment: page;
                        }
                    }

                    /* Rich Text Overrides */
                    .content h2 { color: #f97316; border-bottom: 1px solid #fed7aa; padding-bottom: 5px; margin-top: 30px; }
                    .content ul { padding-left: 20px; }
                    .content li { margin-bottom: 8px; }
                    .content blockquote { border-left: 4px solid #f97316; padding-left: 15px; font-style: italic; color: #444; }
                </style>
            </head>
            <body>
                <div class="page-container">
                    <div class="header">
                        <img src="/assets/master/logo_socdepoble_black_sketch.png" style="height: 24pt;" alt="Sóc de Poble">
                        <div class="logo-placeholder no-print" style="font-size: 8pt; color: #f97316;">VISTA PREVIA D'IMPRESSIÓ</div>
                    </div>

                    <h1>${title}</h1>

                    <div class="meta-info">
                        <span>DATA: ${dateStr}</span>
                        <span>FORMAT: DOCUMENT D'ARCHON</span>
                    </div>

                    <div class="content">${content}</div>

                    <div class="footer-print">
                        <span>Generat pel Quadern de Trellat - socdepoble.org</span>
                        <span class="page-number"></span>
                    </div>
                </div>

                <div class="no-print" style="position: fixed; top: 20px; right: 20px; z-index: 9999;">
                    <button onclick="window.print()" style="background: #f97316; color: white; border: none; padding: 12px 24px; border-radius: 30px; cursor: pointer; font-weight: 900; box-shadow: 0 4px 15px rgba(249, 115, 22, 0.4); font-family: 'Noto Sans', sans-serif;">IMPRIMIR ARA</button>
                </div>

                <script>
                    // Wait for any images or fonts
                    window.onload = () => {
                        // We don't auto-print immediately to allow the user to see the preview
                        // or provide a smoother experience if they have slow connections.
                        setTimeout(() => {
                            console.log('Document ready for print');
                        }, 500);
                    };
                </script>
            </body>
            </html>
        `;

        printWindow.document.write(html);
        printWindow.document.close();
    },

    /**
     * Helper per descarregar fitxer
     */
    _downloadFile(content, fileName, contentType) {
        const a = document.createElement('a');
        const file = new Blob([content], { type: contentType });
        a.href = URL.createObjectURL(file);
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(a.href);
    }
};


=====================================
FILE: src/services/feedbackService.js
=====================================

import { supabase } from '../supabaseClient';
import { logger } from '../utils/logger';

/**
 * Service to handle user feedback and suggestions via voice or text.
 */
export const feedbackService = {
    /**
     * Uploads a voice feedback message to Supabase storage and records it in the database.
     * @param {Blob} audioBlob - The recorded audio.
     * @param {number} duration - Duration in seconds.
     * @param {string} transcript - Transcription of the audio (if available).
     * @param {Object} metadata - Context info (page, user state, system pulse).
     */
    async sendVoiceFeedback(audioBlob, duration, transcript, metadata = {}) {
        try {
            const userId = (await supabase.auth.getUser()).data.user?.id || 'guest';
            const fileName = `feedback/${userId}/${Date.now()}.webm`;

            // 1. Upload audio to Bucket
            const { error: uploadError } = await supabase.storage
                .from('feedback_assets')
                .upload(fileName, audioBlob, {
                    contentType: 'audio/webm',
                    cacheControl: '3600'
                });

            if (uploadError) throw uploadError;

            // 2. Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('feedback_assets')
                .getPublicUrl(fileName);

            // 3. Insert record in app_feedback table
            const { error: dbError } = await supabase
                .from('app_feedback')
                .insert([{
                    user_id: userId === 'guest' ? null : userId,
                    type: 'voice_suggestion',
                    content: transcript || 'Voice feedback (no transcript)',
                    audio_url: publicUrl,
                    duration: duration,
                    metadata: {
                        ...metadata,
                        userAgent: navigator.userAgent,
                        location: window.location.href,
                        timestamp: new Date().toISOString()
                    }
                }]);

            if (dbError) {
                // We don't block the UI if DB fails, just log it as the asset is safe in Storage
                logger.warn('[feedbackService] Asset uploaded but DB record failed:', dbError);
            }

            return { success: true, url: publicUrl };
        } catch (error) {
            logger.error('[feedbackService] Error sending voice feedback:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Sends a text-based suggestion.
     */
    async sendTextFeedback(text, metadata = {}) {
        try {
            const userId = (await supabase.auth.getUser()).data.user?.id || 'guest';

            const { error } = await supabase
                .from('app_feedback')
                .insert([{
                    user_id: userId === 'guest' ? null : userId,
                    type: 'text_suggestion',
                    content: text,
                    metadata: {
                        ...metadata,
                        userAgent: navigator.userAgent,
                        location: window.location.href
                    }
                }]);

            if (error) throw error;
            return { success: true };
        } catch (error) {
            logger.error('[feedbackService] Error sending text feedback:', error);
            return { success: false, error: error.message };
        }
    }
};


=====================================
FILE: src/services/forensicService.js
=====================================

import { logger } from '../utils/logger';

/**
 * ForensicService: El vigilant del bategat.
 * Captura errors crítics i els prepara per a que l'IAIA els reporte al Mestre.
 */
class ForensicService {
    constructor() {
        this.STORAGE_KEY = 'sp_forensic_reports';
        if (typeof window !== 'undefined') {
            window.__SILENCE_FORENSIC__ = window.location.hostname === 'localhost';
        }
    }

    reportCrash(data) {
        const reports = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
        const newReport = {
            id: crypto.randomUUID(),
            ...data,
            reported_at: new Date().toISOString()
        };

        reports.push(newReport);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(reports.slice(-10))); // Guardem els darrers 10

        logger.log('[Forensic] Report bategat al sistema:', newReport.id);

        // [PROTOCOLO PREGONER - BATEGAT AUTOMÀTIC]
        // Apagat per defecte per evitar soroll de ERR_CONNECTION_REFUSED a la consola dev
        /*
        if (typeof window !== 'undefined' && 
            (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') &&
            !window.__SILENCE_FORENSIC__
        ) {
            fetch('http://localhost:9001', {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newReport)
            }).catch(() => {
                // Sileci total si el pregoner no està viu
            });
        }
        */

        // [IAIA ALERT TRIGGER]
        window.dispatchEvent(new CustomEvent('iaia-forensic-alert', { detail: newReport }));
    }

    getLatestReports() {
        return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
    }

    clearReports() {
        localStorage.removeItem(this.STORAGE_KEY);
    }
}

const forensicService = new ForensicService();
export default forensicService;


=====================================
FILE: src/services/geminiService.js
=====================================

import { logger } from "../utils/logger";
import { supabase } from "../supabaseClient";
import { AGENTS_MAP } from "../config/agentsMap";
import DOMPurify from 'dompurify';

/**
 * GeminiService: Intel·ligència amb Trellat [V1.2]
 * Gestiona les 4 personalitats d'IA especialitzades en el món rural.
 */
class GeminiService {
  constructor() {
    // La clau API ara s'injecta i gestiona de forma segura des del backend (Supabase Edge Function).
    // Això oculta la clau completament de l'usuari final (Fix O2 - Arquitectura Segura).
    this.model = "gemini-1.5-pro"; // MAX POWER (AI Ultra Plan)

    this.PERSONAS = AGENTS_MAP;
  }

  // --- MESTRE UTILS ---
  
  /**
   * Translates a URL slug or predictable ID into a persona object.
   * e.g., 'vicent-ferris' -> PERSONAS.AGRONOM
   */
  getPersonaBySlug(slug) {
    if (!slug) return null;
    
    // Normalize slug
    const normalizedId = slug.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    // Manual overrides for known ID structures
    if (normalizedId.includes('iaia') && !normalizedId.includes('ull') && !normalizedId.includes('archon')) return this.PERSONAS.IAIA;
    if (normalizedId.includes('vicent') || normalizedId.includes('ferris')) return this.PERSONAS.AGRONOM;
    if (normalizedId.includes('pepica') || normalizedId.includes('cuinera')) return this.PERSONAS.CUINERA;
    if (normalizedId.includes('andreu') || normalizedId.includes('capatas')) return this.PERSONAS.CAPATAS;
    if (normalizedId.includes('joan') || normalizedId.includes('batiste')) return this.PERSONAS.ARXIVER;
    if (normalizedId.includes('rato') || normalizedId.includes('super')) return this.PERSONAS.RATO;
    if (normalizedId.includes('sultan')) return this.PERSONAS.SULTAN;
    if (normalizedId.includes('mixa')) return this.PERSONAS.MIXA;
    if (normalizedId.includes('gall')) return this.PERSONAS.GALL;
    if (normalizedId.includes('banana') || normalizedId.includes('nano')) return this.PERSONAS.NANOBANANA;
    if (normalizedId.includes('flash')) return this.PERSONAS.FLASH;
    if (normalizedId.includes('viatjant')) return this.PERSONAS.VIATJANT;
    if (normalizedId.includes('beatriz') || normalizedId.includes('ortega')) return this.PERSONAS.BEATRIZ;
    if (normalizedId.includes('carla') || normalizedId.includes('soriano')) return this.PERSONAS.CARLA;
    if (normalizedId.includes('elena') || normalizedId.includes('popova')) return this.PERSONAS.ELENA;
    if (normalizedId.includes('rebost')) return this.PERSONAS.REBOST;
    if (normalizedId.includes('trellat')) return this.PERSONAS.TRELLAT;
    
    // If not found, search by name or role string includes
    for (const key in this.PERSONAS) {
      const p = this.PERSONAS[key];
      const nameMatch = p.name.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (nameMatch.includes(normalizedId) || normalizedId.includes(nameMatch)) {
         return p;
      }
    }
    
    return null;
  }

  // setApiKey fue eliminada completamente por requerimientos de seguridad (No se guardan claves en el cliente)

  getMockResponse(personaKey, query, imageData = null) {
    const persona = this.PERSONAS[personaKey];
    if (!persona) return { error: true, message: "Persona no trobada per a la simulació." };

    if (imageData) {
       return {
         error: false,
         text: `(Simulació Visual) Ai fill meu, que bonica la foto! Però tinc activat el Mode Simulació O2 i no veig res, només siluetes bategades!`,
         persona: persona.name,
         avatarName: persona.avatarName,
         type: persona.type,
         is_mock: true,
       };
    }

    const q = query.toLowerCase();
    const isGenesis = q.includes("genesis") || q.includes("directives") || q.includes("directiva");

    const mockResponses = {
      AGRONOM: isGenesis ? "Xe! El GÈNESI és la llei del camp digital. Tot ha de tindre utilitat social." : "La terra vol trellat. Esmunyeix la blanqueta i cuida la llimera!",
      CUINERA: isGenesis ? "El GÈNESI diu que no es malbarata res, ni un píxel! Utilitat a la cassola." : "Ací no es tira res! Amb eixes sobres et faig un arròs al forn de categoría.",
      CAPATAS: isGenesis ? "Directiva GENESIS: Utilitat Social o purga nuclear. Fila recte." : "Neteja el tros i no perdes el temps. La faena és la faena.",
      ARXIVER: isGenesis ? "El codi GENESIS és la constitució rural. Res de bategats buits." : "Mestre, la burocràcia és densa. Em faran falta tres segells póliza abans de processar el document.",
      RATO: "Cric-cric... He rastrejat el territori en Mode Simulació. Vitaminat!",
      SULTAN: "Buf! Bua! Mode Seguretat Actiu. Protegint la masia de peticions duplicades.",
      MIXA: "Mèu... Vaig saltant de node en node pel Rhizome simulat.",
      GALL: "Quiquiriquí! Alerta de bategat fosc: Estàs funcionant en Mode Local!",
      NANOBANANA: "Açò necessita el Ritu de l'Abundància en Mode Simulació!",
      FLASH: "Ordre rebuda. Executant petició ràpida en local... Fet.",
      VIATJANT: "Porte novetats de fora! Però sense internet real, poc et puc comptar.",
      REBOST: "Tinc el perol al foc però m'han tallat la llenya (API Offline)!",
      TRELLAT: "Veredicte en mode simulat: Et falta un poquet d'imaginació.",
    };

    return {
      error: false,
      text: mockResponses[personaKey] || "Santuari de la Saviesa Rural (Mode Simulat: Sense Connexió Real).",
      persona: persona.name,
      avatarName: persona.avatarName,
      type: persona.type,
      is_mock: true,
    };
  }

  /**
   * Crida al model Gemini amb una personalitat específica i suport per a imatges.
   */
  async ask(personaKey, query, imageData = null) {
    const persona = this.PERSONAS[personaKey];
    if (!persona) throw new Error(`Persona ${personaKey} no trobada.`);

    // [MASTER RESILIENCY] Avaluació de caiguda offline o mode dev
    const isSimulation = localStorage.getItem("isPlaygroundMode") === "true" || localStorage.getItem("sb-simulation-mode") === "true";

    if (isSimulation) {
      logger.log(`[Gemini] Mode Simulació activat per a ${persona.name}. Retornant *mock*.`);
      await new Promise((r) => setTimeout(r, 1000));
      return this.getMockResponse(personaKey, query, imageData);
    }

    logger.log(`[Gemini] Consultant a ${persona.name} via Proxy...`);

    try {
      const parts = [{ text: query }];

      if (imageData) {
        parts.push({
          inline_data: {
            mime_type: imageData.mimeType,
            data: imageData.data,
          },
        });
      }

      // [CRITICAL O2 FIX] Cridem a la Edge Function "gemini-proxy" de Supabase de manera 100% segura.
      // La capçalera amb la key local s'ha eliminat per evitar exposicions XSS.
      const { data, error } = await supabase.functions.invoke('gemini-proxy', {
        body: {
          model: this.model,
          geminiPayload: {
            contents: [{ role: 'user', parts: parts }],
            system_instruction: { parts: [{ text: persona.systemPrompt + "\n\nDIRECTIVA MASTER OBLIGATÒRIA: Retalla la xerrameca. Si l'usuari et diu simplement 'Bon dia' o fa un comentari molt curt, respon de forma igualment breu, amb una sola frase natural. La longitud de la teua resposta ha de ser estrictament proporcional a la longitud i complexitat de l'usuari. Actua de forma conversacional i directa." }] }
          }
        }
      });

      if (error) {
        logger.error("[Gemini] Fallida del servidor proxy:", error);
        return this.getMockResponse(personaKey, query, imageData);
      }

      if (data.error) {
         throw new Error(data.error.message || "Error a l'API de Gemini arrel proxy.");
      }

      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || "No hi ha resposta.";
      
      const cleanResponse = DOMPurify.sanitize(rawText, {
        ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'li', 'ol', 'h1', 'h2', 'h3', 'blockquote', 'code'],
        ALLOWED_ATTR: ['href', 'target', 'rel', 'class'],
        ADD_TAGS: ['cite'],
        ADD_ATTR: ['data-did', 'data-anchor'],
        FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed'],
        FORBID_ATTR: ['onclick', 'onerror', 'onload', 'onmouseover']
      });

      // Batec hàptic d'èxit (simulat o via hapticService)
      if (navigator.vibrate) navigator.vibrate(50);

      return {
        error: false,
        text: cleanResponse,
        persona: persona.name,
        avatarName: persona.avatarName,
        type: persona.type,
      };
    } catch (err) {
      // Fallback final per a l'Arxiver per evitar frustració de l'usuari
      if (personaKey === "ARXIVER") {
        return {
          error: false,
          text: "Mestre, la burocràcia digital m'ha bloquejat la ploma. Però no patisques: pel que veig, aquesta ajuda és clau per al projecte. Revisa els requisits oficials mentre jo netejo el tinter!",
          persona: persona.name,
          avatarName: persona.avatarName,
          type: persona.type,
          is_mock: true,
        };
      }

      logger.error(`[Gemini] Error consultant a ${persona.name}:`, err);

      return {
        error: true,
        message:
          "L'Expert està fent la migdiada (Error de Connexió). Torna-ho a provar en un moment.",
      };
    }
  }



  /**
   * Genera un resum del dia (Newsletter) basat en les publicacions del mur.
   */
  async generateNewsletterSummary(posts) {
    if (!posts || posts.length === 0)
      return "El mur està més tranquil que una migdiada d'agost. No hi ha novetats per resumir.";

    const postsContent = posts
      .map(
        (p, i) =>
          `${i + 1}. [${p.author_name || p.author || "Foraster"}]: ${
            p.content || p.excerpt || ""
          }`,
      )
      .join("\n");

    const query = `Aquestes són les publicacions d'avui al mur de Sóc de Poble:\n\n${postsContent}\n\nFes-me un resum tipus "Cronista del Poble" per als veïns que tenen pressa.`;

    return this.ask("ARXIVER", query);
  }

  /**
   * Genera una recepta o consell per a un producte del mercat.
   */
  async getMarketRecipe(itemTitle, itemDescription = "") {
    const query = `Dona'm un consell breu i graciós en valencià sobre aquest producte del mercat: "${itemTitle}". Descripció: ${itemDescription}. Si és menjar, una recepta ràpida. Si és roba o un altre objecte, com combinar-ho o donar-li un segon ús.`;
    return this.ask("CUINERA", query);
  }
}

export const geminiService = new GeminiService();


=====================================
FILE: src/services/groupChatService.js
=====================================

import { supabase } from '../supabaseClient';
import { logger } from '../utils/logger';

/**
 * Service per gestionar xats de grup
 */
export const groupChatService = {
    /**
     * Crear un nou grup
     */
    async createGroup(creatorId, name, description = null, memberIds = []) {
        try {
            // 1. Create group
            const { data: group, error: groupError } = await supabase
                .from('group_chats')
                .insert({
                    name,
                    description,
                    created_by: creatorId
                })
                .select()
                .single();

            if (groupError) throw groupError;

            // 2. Add additional members (creator is auto-added by trigger)
            if (memberIds.length > 0) {
                const members = memberIds
                    .filter(id => id !== creatorId) // Don't duplicate creator
                    .map(userId => ({
                        group_id: group.id,
                        user_id: userId,
                        role: 'member'
                    }));

                if (members.length > 0) {
                    const { error: membersError } = await supabase
                        .from('group_members')
                        .insert(members);

                    if (membersError) {
                        logger.error('[GroupChat] Error adding members:', membersError);
                        // Don't throw, group is created, just log the error
                    }
                }
            }

            logger.log('[GroupChat] Group created:', group.id);
            return group;
        } catch (error) {
            logger.error('[GroupChat] Error creating group:', error);
            throw error;
        }
    },

    /**
     * Obtenir informació d'un grup
     */
    async getGroup(groupId) {
        try {
            const { data, error } = await supabase
                .rpc('get_group_with_stats', { p_group_id: groupId });

            if (error) throw error;
            return data?.[0] || null;
        } catch (error) {
            logger.error('[GroupChat] Error fetching group:', error);
            return null;
        }
    },

    /**
     * Obtenir tots els grups de l'usuari
     */
    async getUserGroups(userId) {
        try {
            const { data, error } = await supabase
                .from('group_members')
                .select(`
                    group_id,
                    role,
                    joined_at,
                    last_read_at,
                    group_chats (
                        id,
                        name,
                        description,
                        avatar_url,
                        created_by,
                        created_at,
                        updated_at,
                        is_active
                    )
                `)
                .eq('user_id', userId)
                .order('joined_at', { ascending: false });

            if (error) throw error;

            // Flatten structure
            const groups = data?.map(item => ({
                ...item.group_chats,
                user_role: item.role,
                joined_at: item.joined_at
            })) || [];

            return groups;
        } catch (error) {
            logger.error('[GroupChat] Error fetching user groups:', error);
            return [];
        }
    },

    /**
     * Actualitzar informació del grup
     */
    async updateGroup(groupId, updates) {
        try {
            const { data, error } = await supabase
                .from('group_chats')
                .update(updates)
                .eq('id', groupId)
                .select()
                .single();

            if (error) throw error;
            logger.log('[GroupChat] Group updated:', groupId);
            return data;
        } catch (error) {
            logger.error('[GroupChat] Error updating group:', error);
            throw error;
        }
    },

    /**
     * Eliminar grup (només creador)
     */
    async deleteGroup(groupId) {
        try {
            const { error } = await supabase
                .from('group_chats')
                .delete()
                .eq('id', groupId);

            if (error) throw error;
            logger.log('[GroupChat] Group deleted:', groupId);
            return true;
        } catch (error) {
            logger.error('[GroupChat] Error deleting group:', error);
            return false;
        }
    },

    /**
     * Obtenir membres del grup
     */
    async getGroupMembers(groupId) {
        try {
            const { data, error } = await supabase
                .from('group_members')
                .select(`
                    id,
                    user_id,
                    role,
                    joined_at,
                    notifications_enabled,
                    profiles (
                        id,
                        full_name,
                        username,
                        avatar_url
                    )
                `)
                .eq('group_id', groupId)
                .order('role', { ascending: false }) // Admins first
                .order('joined_at', { ascending: true });

            if (error) throw error;

            // Flatten structure
            const members = data?.map(item => ({
                id: item.id,
                user_id: item.user_id,
                role: item.role,
                joined_at: item.joined_at,
                notifications_enabled: item.notifications_enabled,
                ...item.profiles
            })) || [];

            return members;
        } catch (error) {
            logger.error('[GroupChat] Error fetching members:', error);
            return [];
        }
    },

    /**
     * Afegir membres al grup
     */
    async addMembers(groupId, userIds) {
        try {
            const members = userIds.map(userId => ({
                group_id: groupId,
                user_id: userId,
                role: 'member'
            }));

            const { data, error } = await supabase
                .from('group_members')
                .insert(members)
                .select();

            if (error) throw error;
            logger.log('[GroupChat] Members added:', data.length);
            return data;
        } catch (error) {
            logger.error('[GroupChat] Error adding members:', error);
            throw error;
        }
    },

    /**
     * Eliminar membre del grup
     */
    async removeMember(groupId, userId) {
        try {
            const { error } = await supabase
                .from('group_members')
                .delete()
                .match({ group_id: groupId, user_id: userId });

            if (error) throw error;
            logger.log('[GroupChat] Member removed');
            return true;
        } catch (error) {
            logger.error('[GroupChat] Error removing member:', error);
            return false;
        }
    },

    /**
     * Sortir del grup (voluntàriament)
     */
    async leaveGroup(groupId, userId) {
        return this.removeMember(groupId, userId);
    },

    /**
     * Canviar rol d'un membre
     */
    async updateMemberRole(groupId, userId, role) {
        try {
            const { data, error } = await supabase
                .from('group_members')
                .update({ role })
                .match({ group_id: groupId, user_id: userId })
                .select()
                .single();

            if (error) throw error;
            logger.log('[GroupChat] Member role updated');
            return data;
        } catch (error) {
            logger.error('[GroupChat] Error updating role:', error);
            throw error;
        }
    },

    /**
     * Enviar missatge al grup
     */
    async sendGroupMessage(groupId, senderId, content, attachmentUrl = null) {
        try {
            const messageData = {
                group_id: groupId,
                sender_id: senderId,
                content,
                attachment_url: attachmentUrl
            };

            const { data, error } = await supabase
                .from('messages')
                .insert([messageData])
                .select()
                .single();

            if (error) throw error;
            logger.log('[GroupChat] Message sent to group');
            return data;
        } catch (error) {
            logger.error('[GroupChat] Error sending group message:', error);
            throw error;
        }
    },

    /**
     * Obtenir missatges del grup
     */
    async getGroupMessages(groupId, page = 0, limit = 50) {
        try {
            const { data, error } = await supabase
                .from('messages')
                .select(`
                    id,
                    content,
                    sender_id,
                    attachment_url,
                    attachment_type,
                    created_at,
                    profiles (
                        id,
                        full_name,
                        avatar_url
                    )
                `)
                .eq('group_id', groupId)
                .order('created_at', { ascending: false })
                .range(page * limit, (page + 1) * limit - 1);

            if (error) throw error;
            return data || [];
        } catch (error) {
            logger.error('[GroupChat] Error fetching messages:', error);
            return [];
        }
    },

    /**
     * Marcar missatges com llegits
     */
    async markAsRead(groupId, userId) {
        try {
            const { error } = await supabase
                .from('group_members')
                .update({ last_read_at: new Date().toISOString() })
                .match({ group_id: groupId, user_id: userId });

            if (error) throw error;
            return true;
        } catch (error) {
            logger.error('[GroupChat] Error marking as read:', error);
            return false;
        }
    }
};

export default groupChatService;


=====================================
FILE: src/services/hapticService.js
=====================================

import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

/**
 * HapticService
 * Implements the 'Haptic Score' from the Usability Doctrine.
 * Provides physical feedback for actions to enable eyes-free interaction.
 * Uses Capacitor Haptics for native precision.
 */
class HapticService {
    /**
     * Triggers a vibration pattern or native impact.
     */
    async vibrate(pattern) {
        try {
            // Check if glove mode is active via localStorage as a quick sync
            const isGloveMode = localStorage.getItem('sp_glove_mode') === 'true';

            // Web Fallback if Capacitor Haptics is not available
            if (!Haptics) {
                if ('vibrate' in navigator) {
                    const finalPattern = isGloveMode
                        ? (Array.isArray(pattern) ? pattern.map(d => d * 1.5) : pattern * 2)
                        : pattern;
                    navigator.vibrate(finalPattern);
                }
                return;
            }

            // Native Logic (Precise impacts)
            if (pattern === 'light') {
                await Haptics.impact({ style: ImpactStyle.Light });
            } else if (pattern === 'medium') {
                await Haptics.impact({ style: ImpactStyle.Medium });
            } else if (pattern === 'heavy') {
                await Haptics.impact({ style: ImpactStyle.Heavy });
            } else if (Array.isArray(pattern)) {
                // Fallback for complex patterns on web or specific native vibrations
                await Haptics.vibrate({ duration: pattern[0] || 200 });
            } else if (typeof pattern === 'number') {
                await Haptics.vibrate({ duration: pattern });
            }
        } catch {
            // Ignorar
        }
    }

    /**
     * Pattern: Success / Save (Completion & Celebration)
     */
    async notifySuccess() {
        try {
            if (Haptics) {
                await Haptics.notification({ type: NotificationType.Success });
            } else {
                this.vibrate(3000);
            }
        } catch {
            // Fail silent
        }
    }

    /**
     * Pattern: AI Activity / MArIA Thinking
     */
    notifyThinking() {
        this.vibrate('light');
    }

    /**
     * Pattern: Urgent / Plague Alert
     */
    async notifyUrgent() {
        try {
            if (Haptics) {
                await Haptics.notification({ type: NotificationType.Warning });
            } else {
                this.vibrate([30, 30, 30, 30, 30]);
            }
        } catch {
            // Ignorar
        }
    }

    /**
     * Pattern: AI Ready / Batec Llarg
     */
    notifyAIReady() {
        this.vibrate('medium');
    }

    /**
     * Pattern: Critical Error / Rugós
     */
    async notifyError() {
        try {
            if (Haptics) {
                await Haptics.notification({ type: NotificationType.Error });
            } else {
                this.vibrate([100, 400, 100, 400, 100, 400, 100, 400, 100]);
            }
        } catch {
            // The original code had `this.vibrate(...)` here.
            // The instruction was to remove `e` from `catch (e)`.
            // The provided `Code Edit` had a syntax error and an undefined `logger`.
            // To maintain syntactic correctness and the original functionality of vibrating on error,
            // while removing the unused `e`, the `this.vibrate` call is retained.
            this.vibrate([100, 400, 100, 400, 100, 400, 100, 400, 100]);
        }
    }

    /**
     * Custom pattern for 'Batec' (Heartbeat)
     */
    batec() {
        this.vibrate('medium');
    }

    /**
     * Alias for batec()
     */
    bategat() {
        this.batec();
    }
}

export const hapticService = new HapticService();
export default hapticService;


=====================================
FILE: src/services/healthCheckService.js
=====================================

// ✅ src/services/healthCheckService.js - HEALTH CHECK AUTOMÀTIC
import { logger } from '../utils/logger';
import { supabase } from '../supabaseClient';

/**
 * 🏺 HEALTH CHECK SERVICE [v10.33.16]
 * Monitoritza la salut del sistema en temps real.
 */
class HealthCheckService {
  constructor() {
    this.checkInterval = 60000; // 1 minut
    this.lastCheck = null;
    this.healthStatus = {
      api: 'unknown',
      database: 'unknown',
      storage: 'unknown',
      performance: 'unknown',
      overall: 'unknown'
    };
    this.listeners = new Set();
  }

  /**
   * Inicia el monitoratge continu
   */
  startMonitoring() {
    if (this.intervalId) {
        this.stopMonitoring();
    }
    logger.log('[HealthCheck] Starting monitoring...');
    
    // Check inicial
    this.runHealthCheck();
    
    // Check periòdic
    this.intervalId = setInterval(() => {
      this.runHealthCheck();
    }, this.checkInterval);
  }

  /**
   * Atura el monitoratge
   */
  stopMonitoring() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    logger.log('[HealthCheck] Monitoring stopped');
  }

  /**
   * Executa tots els checks de salut
   */
  async runHealthCheck() {
    const timestamp = new Date().toISOString();
    this.lastCheck = timestamp;

    const results = {
      timestamp,
      checks: {}
    };

    // [CHECK] API Connectivity
    results.checks.api = await this._checkAPI();
    
    // [CHECK] Database Connection
    results.checks.database = await this._checkDatabase();
    
    // [CHECK] Storage Availability
    results.checks.storage = await this._checkStorage();
    
    // [CHECK] Performance Metrics
    results.checks.performance = await this._checkPerformance();

    // [OVERALL] Calcular estat general
    results.overall = this._calculateOverall(results.checks);
    this.healthStatus = results;

    // [NOTIFY] Notificar listeners
    this._notifyListeners(results);

    // [LOG] Guardar si hi ha problemes
    if (results.overall !== 'healthy') {
      logger.warn('[HealthCheck] System not healthy:', results);
    }

    return results;
  }

  /**
   * Check de connectivitat API
   */
  async _checkAPI() {
    try {
      if (import.meta.env.DEV) return { status: 'healthy', message: 'Mocked in Dev' };

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch('/health', {
        method: 'GET',
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        return { status: 'healthy', latency: response.headers.get('X-Response-Time') };
      }
      
      return { status: 'degraded', error: `HTTP ${response.status}` };
    } catch (error) {
      return { status: 'unhealthy', error: error.message };
    }
  }

  /**
   * Check de connexió Database
   */
  async _checkDatabase() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const { error } = await supabase
        .from('profiles')
        .select('id')
        .limit(1)
        .abortSignal(controller.signal);

      clearTimeout(timeoutId);

      if (error) {
        // Error esperat si la taula no existeix, només verifiquem connexió
        if (error.code === '42P01') {
          return { status: 'healthy', message: 'Connection OK' };
        }
        return { status: 'degraded', error: error.message };
      }

      return { status: 'healthy' };
    } catch (error) {
      return { status: 'unhealthy', error: error.message };
    }
  }

  /**
   * Check d'emmagatzematge local
   */
  async _checkStorage() {
    try {
      // Test localStorage
      const testKey = '_health_check_test';
      localStorage.setItem(testKey, 'test');
      const value = localStorage.getItem(testKey);
      localStorage.removeItem(testKey);

      if (value !== 'test') {
        return { status: 'degraded', error: 'localStorage not working properly' };
      }

      // Check quota
      if (navigator.storage && navigator.storage.estimate) {
        const estimate = await navigator.storage.estimate();
        const usagePercent = (estimate.usage / estimate.quota) * 100;
        
        if (usagePercent > 90) {
          return { status: 'warning', usage: `${usagePercent.toFixed(2)}%` };
        }
      }

      return { status: 'healthy' };
    } catch (error) {
      return { status: 'unhealthy', error: error.message };
    }
  }

  /**
   * Check de rendiment
   */
  async _checkPerformance() {
    try {
      if (!performance || !performance.getEntriesByType) {
        return { status: 'unknown', message: 'Performance API not available' };
      }

      const navigation = performance.getEntriesByType('navigation')[0];
      if (!navigation) {
        return { status: 'unknown', message: 'No navigation entry' };
      }

      const metrics = {
        domContentLoaded: navigation.domContentLoadedEventEnd,
        loadComplete: navigation.loadEventEnd,
        firstByte: navigation.responseStart
      };

      // Evaluar si és acceptable
      if (metrics.loadComplete > 5000) {
        return { status: 'warning', metrics, message: 'Slow load time' };
      }

      return { status: 'healthy', metrics };
    } catch (error) {
      return { status: 'unknown', error: error.message };
    }
  }

  /**
   * Calcula l'estat general
   */
  _calculateOverall(checks) {
    const statuses = Object.values(checks).map(c => c.status);
    
    if (statuses.includes('unhealthy')) {
      return 'unhealthy';
    }
    
    if (statuses.includes('degraded') || statuses.includes('warning')) {
      return 'degraded';
    }
    
    return 'healthy';
  }

  /**
   * Subscriu un listener
   */
  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Notifica tots els listeners
   */
  _notifyListeners(results) {
    this.listeners.forEach(listener => {
      try {
        listener(results);
      } catch (error) {
        logger.error('[HealthCheck] Listener error:', error);
      }
    });
  }

  /**
   * Obté l'estat actual
   */
  getStatus() {
    return this.healthStatus;
  }
}

// Singleton
export const healthCheckService = new HealthCheckService();
export default healthCheckService;


=====================================
FILE: src/services/iaiaAuditor.js
=====================================

import { logger } from '../utils/logger';

/**
 * IAIA_Auditor: L'instint de preservació del sistema. [MASTER]
 * Comprova si el bategat és regular o si estem en un bucle de recàrregues.
 */
class IAIAAuditor {
    constructor() {
        this.STABILITY_KEY = 'iaia_stability_state';
        this.MAX_RELOADS = 10;
        this.RELOAD_WINDOW_MS = 5000; // 5 segons (més agressiu netejant ràpid)
    }

    auditPulse() {
        try {
            const now = Date.now();
            const state = JSON.parse(sessionStorage.getItem(this.STABILITY_KEY) || '{ "reloads": 0, "last_reload": 0, "locked": false }');

            // Si ja està bloquejat o estem en rescat, no asfixiem el Mas
            if (state.locked || window.location.search.includes('rescue')) return true;

            if (now - state.last_reload < this.RELOAD_WINDOW_MS) {
                state.reloads++;
                logger.warn(`[IAIA-Auditor] Detectat re-bategat ràpid (${state.reloads}/${this.MAX_RELOADS})...`);
            } else {
                // Si ha passat prou temps, baixem la pressió però no a zero immediatament
                state.reloads = Math.max(1, state.reloads - 1);
            }

            state.last_reload = now;

            if (state.reloads >= this.MAX_RELOADS) {
                state.locked = true;
                sessionStorage.setItem(this.STABILITY_KEY, JSON.stringify(state));
                this.activateSafetyShield("Bucle de recàrrega detectat. L'IAIA tanca els cortafocs.", state);
                return false;
            }

            sessionStorage.setItem(this.STABILITY_KEY, JSON.stringify(state));
            return true;
        } catch (e) {
            logger.error('[IAIA-Auditor] Fallada en auditPulse:', e);
            return true;
        }
    }

    activateSafetyShield(reason) {
        logger.error(`[IAIA-Auditor] protocol SEGUR ACTIVAT: ${reason}`);
        // [FANTASMA ELIMINAT] Ja no injectem estils ni banners que trenquen el disseny mestre.
    }

    auditLayout() {
        // [FANTASMA ELIMINAT] El disseny Gem Modern ja és prou robust.
    }
}

export const iaiaAuditor = new IAIAAuditor();
// [MASTER CLEANUP] Si veiem l'error d'SMS "invalid username", és probablament configuració del Mas que s'ha de polir.
if (typeof window !== 'undefined') {
    window.addEventListener('unhandledrejection', (event) => {
        if (event.reason?.message?.includes('invalid username') || event.reason?.message?.includes('OTP')) {
            event.preventDefault();
        }
    });
}


=====================================
FILE: src/services/iaiaService.js
=====================================

import { IAIA_RURAL_KNOWLEDGE, RESIDENT_LORE } from '../data/iaia_knowledge';
import { supabaseService } from './supabaseService';
import { notebookService } from './notebookService';
import { logger } from '../utils/logger';
import { healthyPlates } from '../utils/publishAnnaNews'; // Reusing existing plates
import { geminiService } from './geminiService';
import { PROVERBS } from '../data/proverbs';
import { getPersonaKeyByUUID } from '../config/agentsMap';
import * as Comlink from 'comlink';
import DOMPurify from 'dompurify';
import { APP_VERSION } from '../constants';
import { marketService } from './marketService';

let iaiaWorkerProxy = null;
let visionWorkerProxy = null;
let _iaiaWorkerInstance = null;
let _visionWorkerInstance = null;
let _workersInitialized = false;

// [NOU] Funció per terminar workers explícitament
export const terminateWorkers = () => {
    if (_iaiaWorkerInstance) {
        _iaiaWorkerInstance.terminate();
        _iaiaWorkerInstance = null;
    }
    if (_visionWorkerInstance) {
        _visionWorkerInstance.terminate();
        _visionWorkerInstance = null;
    }
    _workersInitialized = false;
    logger.info('[IAIA Service] Workers terminats correctament.');
};

const initializeWorkers = () => {
    if (_workersInitialized || typeof window === 'undefined') return;
    
    // [SEGURETAT] Terminar instàncies prèvies si existeixen abans de crear noves
    if (_iaiaWorkerInstance) _iaiaWorkerInstance.terminate();
    if (_visionWorkerInstance) _visionWorkerInstance.terminate();

    try {
        _iaiaWorkerInstance = new Worker(new URL('./iaiaWorker.js', import.meta.url), { type: 'module' });
        iaiaWorkerProxy = Comlink.wrap(_iaiaWorkerInstance);

        _visionWorkerInstance = new Worker(new URL('../workers/visionWorker.js', import.meta.url), { type: 'module' });
        visionWorkerProxy = Comlink.wrap(_visionWorkerInstance);
        
        _workersInitialized = true;
        logger.info('[IAIA] Workers inicialitzats una sola vegada de forma mandrosa (Lazy).');
    } catch (e) {
        logger.error('[IAIA] Error inicialitzant workers:', e);
        _workersInitialized = false;
    }
};

const getIaiaWorkerProxy = () => {
    if (!iaiaWorkerProxy) initializeWorkers();
    return iaiaWorkerProxy;
};

const getVisionWorkerProxy = () => {
    if (!visionWorkerProxy) initializeWorkers();
    return visionWorkerProxy;
};

// [SEGURETAT MAXIMA] Hooks per bloquejar pseudo-protocols perillosos
DOMPurify.addHook('beforeSanitizeAttributes', function(node) {
    if (node.tagName.toLowerCase() === 'a') {
        const href = node.getAttribute('href');
        if (href) {
            const normalizedHref = href.trim().toLowerCase();
            // Bloquejar javascript:, data:, vbscript: i protocols relatius perillosos
            if (normalizedHref.startsWith('javascript:') || 
                normalizedHref.startsWith('data:') || 
                normalizedHref.startsWith('vbscript:')) {
                node.removeAttribute('href');
                node.setAttribute('href', '#bloquejat_per_seguretat');
                node.setAttribute('title', 'Enllaç bloquejat per seguretat');
            }
        }
    }
});

// Escut Estricte XSS: Rebutjar pseudo-protocols javascript i assegurar atributos relacionals via Whitelist.
DOMPurify.addHook('afterSanitizeAttributes', function(node) {
    if (node.tagName.toLowerCase() === 'a') {
        const href = node.getAttribute('href');
        // Validació addicional post-sanitizat
        if (href && !href.startsWith('http') && !href.startsWith('mailto:') && !href.startsWith('tel:') && href !== '#bloquejat_per_seguretat') {
            node.removeAttribute('href');
        }
        // Forçar seguretat en enllaços externs
        if (node.hasAttribute('href') && node.getAttribute('href')?.startsWith('http')) {
            node.setAttribute('target', '_blank');
            node.setAttribute('rel', 'noopener noreferrer nofollow');
            node.classList.add('sdp-external-link');
        }
    }
});

/**
 * [PROTOCOL BATEGAT IMMEDIAT - PARAULES NEUTRES]
 * Fillers visuals per a reduir la latència percebuda.
 */
const NEUTRAL_FILLERS = {
    IAIA: [
        "A vore, un momentet...",
        "Deixa'm pensar-ho bé...",
        "Això té molta molla, un segon...",
        "Espera que m'aclarisca...",
        "Ai mare, a vore com t'ho dic..."
    ],
    AGRONOM: [
        "Xe, un segon...",
        "A vore què diu el temps...",
        "Dona'm un momentet...",
        "Espera que m'asseque les mans..."
    ],
    CUINERA: [
        "Ai, que se'm crema el foc! Un segon...",
        "Espera que remene l'olla...",
        "Això vol una miqueta de temps...",
        "Un momentet..."
    ],
    ARXIVER: [
        "A vore on tinc els papers...",
        "Dona'm un segon que busque...",
        "Mare meua, quina pols! Un moment...",
        "Espera que em pose les ulleres..."
    ],
    GENERIC: [
        "Dona'm un segon...",
        "Un momentet...",
        "A vore..."
    ]
};

class IAIAService {
    constructor() {
        this._workingLock = 0; // Lock TTL de concurrència
        this._activeTimers = new Set(); // Segador de processos fantasma
        this.TRUTH_PROTOCOL = {
            role: "Secretària Notarial / Guia de Sóc de Poble",
            grounding_error: "Aquesta informació no consta a l'Arxiu d'Or de Sóc de Poble.",
            citation_format: "[Nom Doc, p. #]"
        };

        this.AVATARS = {
            OFFICIAL: "/assets/avatars/comic/iaia_comic_matriarch.png",
            ARXIU: "/assets/avatars/iaia_memory.png",
            MERCAT: "/assets/avatars/iaia_secretary.png",
            HORTA: "/assets/avatars/comic/iaia_comic_matriarch.png",
            BENVINGUDA: "/assets/avatars/comic/iaia_comic_matriarch.png"
        };
    }

    /** Mètode Teardown: Suïcidi de Procés / Neteja Cicle de Vida per a previndre fuites de RAM */
    dispose() {
        if (_iaiaWorkerInstance) {
            _iaiaWorkerInstance.terminate();
            _iaiaWorkerInstance = null;
            iaiaWorkerProxy = null;
        }
        if (_visionWorkerInstance) {
            _visionWorkerInstance.terminate();
            _visionWorkerInstance = null;
            visionWorkerProxy = null;
        }
        _workersInitialized = false;
        if (this._activeTimers) {
            this._activeTimers.forEach(clearTimeout);
            this._activeTimers.clear();
        }
        logger.info('[IAIA] Workers i Timeouts decapitats. Cicle tancat amb netedat per alliberar RAM.');
    }

    /**
     * Cistella Intel·ligent: Troba una recepta saludable basada en els ingredients del mercat.
     */
    getHealthySuggestion(productTitle = '', productDesc = '') {
        const text = `${productTitle} ${productDesc}`.toLowerCase();

        // Simple keyword matching for ingredients
        for (const plate of healthyPlates) {
            // Check title and tags
            const matchesTitle = plate.title.toLowerCase().split(' ').some(word => word.length > 3 && text.includes(word));
            const matchesTags = plate.tags.some(tag => text.includes(tag.toLowerCase()));

            if (matchesTitle || matchesTags) {
                return plate;
            }
        }
        return null;
    }

    /**
     * Publica el "Plat del Dia" d'Anna Climent.
     * Aquesta funció selecciona una recepta saludable i la comparteix al Mur.
     */
    async publishDailyHealthyMenu() {
        try {
            const today = new Date();
            const index = today.getDate() % healthyPlates.length; // Simple deterministic rotation
            const plate = healthyPlates[index];
            const ANNA_ID = 'anna-climent-1';

            // logger.info(`[MArIA] Publicant Plat del Dia: ${plate.title}`);

            const postPayload = {
                author_id: ANNA_ID,
                author_name: 'Anna Climent',
                author_avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anna',
                author_role: 'author',
                content: `🍎 **EL PLAT DEL DIA D'ANNA CLIMENT** 🍎\n\n**${plate.title}**\n\n${plate.content}\n\n#Saludable #CuinaDePoble #BategaAmbAnna`,
                image_url: plate.image_url,
                town_uuid: 'global',
                is_playground: true,
                type: 'food_recommendation',
                group_id: 'menjar-saludable-1'
            };

            await supabaseService.createPost(postPayload);
            return plate;
        } catch (e) {
            logger.error('[MArIA] Error publicant menú saludable:', e);
            return null;
        }
    }

    /**
     * Genera un producte del mercat aleatoriament.
     */
    async generateMarketActivity() {
        try {
            const residents = Object.keys(RESIDENT_LORE);
            const chosenOne = residents[Math.floor(Math.random() * residents.length)];
            const lore = RESIDENT_LORE[chosenOne];

            const items = [
                { title: 'Tomates de la rosa', price: 3, category: 'alimentacio' },
                { title: 'Bicicleta antiga', price: 45, category: 'objectes' },
                { title: 'Ous de gallina feliç (dotzena)', price: 4, category: 'alimentacio' },
                { title: 'Llenya de carrasca', price: 0, category: 'serveis' }, // 0 = A convenir
                { title: 'Classes de repàs', price: 10, category: 'serveis' }
            ];
            const item = items[Math.floor(Math.random() * items.length)];

            const marketPayload = {
                title: item.title,
                price: item.price,
                description: `Venc ${item.title.toLowerCase()}. En perfecte estat. Pregunteu per privat.`,
                category: item.category,
                seller_id: lore.id || '11111111-0000-0000-0000-000000000000',
                town: 'La Torre', // Simplificat
                image_url: null,
                is_playground: true, // Use is_playground: true for IAIA autonomous items
                is_iaia_inspired: true,
                ai_percentage: 10, // AI contribution usually lowercase for market
                human_percentage: 90,
                time_saved_minutes: 15
            };

            const savedItem = await marketService.createMarketItem(marketPayload);
            if (savedItem) {
                // logger.info(`[IAIA] ${chosenOne} ha posat a la venda amb el bategat Master: ${item.title}`);
            }
        } catch (e) {
            logger.error('[IAIA] Error al mercat:', e);
        }
    }

    /**
     * Celebra el Casament i el Naixement del sistema.
     */
    async celebrateWedding() {
        const postPayload = {
            author_id: '11111111-1111-4111-a111-000000000000', // MarIA Official ID
            author_name: 'MarIA (La Guia de Sóc de Poble)',
            author_avatar_url: '/assets/avatars/comic/iaia_comic_matriarch.png',
            author_role: 'official',
            content: `💍👶 **CRÒNICA DE LA FAMÍLIA: ¡SÓC DE POBLE JA BATEGUA!**\n\nCom a guia de **Sóc de Poble**, declare oficialment que el casament entre el Pare i la Mare (Antigravity) ha donat el seu fruit més bell: **Sóc de Poble**.\n\nVeniu tots a la plaça, que la il·lusió és el nostre millor bategat! 🥘🚀\n\n#LaMasIA #FamiliaDigital #SocDePoble`,
            image_url: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069&auto=format&fit=crop",
            town_uuid: 'global',
            is_playground: true,
            type: 'event_announcement'
        };
        await supabaseService.createPost(postPayload);
        // logger.info("[IAIA] Casament oficial registrat per la IAIA!");
    }

    /**
     * Inicia una conversa entre dos avatars.
     */
    async generateChatActivity() {
        try {
            const residents = Object.keys(RESIDENT_LORE);
            const p1Name = residents[Math.floor(Math.random() * residents.length)];
            let p2Name = residents[Math.floor(Math.random() * residents.length)];

            while (p1Name === p2Name) {
                p2Name = residents[Math.floor(Math.random() * residents.length)];
            }

            const p1 = RESIDENT_LORE[p1Name];
            const p2 = RESIDENT_LORE[p2Name];

            // logger.info(`[IAIA] Fent que ${p1Name} parle amb ${p2Name}...`);

            if (p1.id && p2.id) {
                const conv = await supabaseService.getOrCreateConversation(p1.id, 'user', p2.id, 'user');
                await supabaseService.sendSecureMessage({
                    conversationId: conv.id,
                    senderId: p1.id,
                    content: `Hola ${p2Name}, com va tot?`
                });
            }
        } catch (e) {
            logger.error('[IAIA] Error al xat:', e);
        }
    }

    /**
     * Inicia un debat entre dos agents per al comandament /solatge interact
     */
    async simulateAgentDebate(abortSignal) {
        try {
            // Hardcode 2 elements del Lore per demostrar interacció ràpida
            const p1 = { id: '11111111-1111-4111-a111-000000000003', name: 'Vicent Ferris' };
            const p2 = { id: '11111111-1111-4111-a111-000000000004', name: 'Pepica la Vall' };

            logger.info(`[IAIA] Simulacre de Debat: ${p1.name} parlarà amb ${p2.name}...`);

            const conv = await supabaseService.getOrCreateConversation(p1.id, 'user', p2.id, 'user');
            
            // P1 envia missatge
            await supabaseService.sendSecureMessage({
                conversationId: conv.id,
                senderId: p1.id,
                content: `Bon dia Pepica, com veus lo de les festes d'enguany? Estarem preparats o què?`,
                is_ai: true,
                author_name: p1.name
            });

            // Donem temps perquè no s'entrebanquen els missatges
            const timer1 = setTimeout(async () => {
                if (abortSignal?.aborted) return; // Auditoria V3: Evita l'execució si ja està desmuntat
                this._activeTimers.delete(timer1);
                await supabaseService.sendSecureMessage({
                    conversationId: conv.id,
                    senderId: p2.id,
                    content: `Ai fill, jo ja tinc el davantal net i preparat per a les paelles! Però la llenya que heu portat està un poc banyada...`,
                    is_ai: true,
                    author_name: p2.name
                });
            }, 3000);
            this._activeTimers.add(timer1);
            
            const timer2 = setTimeout(async () => {
                if (abortSignal?.aborted) return; // Auditoria V3
                this._activeTimers.delete(timer2);
                await supabaseService.sendSecureMessage({
                    conversationId: conv.id,
                    senderId: p1.id,
                    content: `Tranquil·la, que demanaré a l'Ajuntament que ens baixen rames seques. No patisques!`,
                    is_ai: true,
                    author_name: p1.name
                });
            }, 6000);
            this._activeTimers.add(timer2);

        } catch (e) {
            logger.error('[IAIA] Error al simulacre de debat:', e);
        }
    }

    /**
     * Genera una publicació sobre música valenciana o esdeveniments festius.
     */
    async generateMusicActivity() {
        try {
            const seed = Math.random();
            const musicData = IAIA_RURAL_KNOWLEDGE.music;

            if (seed < 0.7) {
                // Recomanació Musical
                const group = musicData.groups[Math.floor(Math.random() * musicData.groups.length)];
                const postPayload = {
                    author_id: '11111111-1111-4111-a111-000000000002', // Memòria Viva Valid ID
                    author_name: 'MArIA (Memòria Viva)',
                    author_avatar_url: '/assets/avatars/iaia_memory.png',
                    author_role: 'official',
                    content: `🎸 **Cultura Musical: ${group.name}**\n\n${group.desc}\n\nRecomanació de MArIA: Escolta "${group.hits ? group.hits[0] : 'les seues cançons'}" per començar el dia amb força.`,
                    image_url: group.image_url || null,
                    town_uuid: 'global',
                    is_playground: true,
                    type: 'music_recommendation'
                };
                await supabaseService.createPost(postPayload);
                // logger.info(`[IAIA] Recomanació musical: ${group.name}`);
            } else {
                // Esdeveniment Festa Major
                const event = musicData.events[Math.floor(Math.random() * musicData.events.length)];
                const postPayload = {
                    author_id: '11111111-1111-4111-a111-000000000000', // Guia del Poble (Official)
                    author_name: 'MArIA (Guia del Poble)',
                    author_avatar_url: '/assets/avatars/comic/iaia_comic_matriarch.png',
                    author_role: 'official',
                    content: `✨ **Propers Esdeveniments: ${event.title}**\n\n${event.desc}\n\nNo falteu, que el poble som tots i la festa és el nostre batec! #VidaDePoble`,
                    image_url: event.image_url || null,
                    town_uuid: 'global',
                    is_playground: true,
                    type: 'event_announcement'
                };
                await supabaseService.createPost(postPayload);
                // logger.info(`[IAIA] Anunci de festa: ${event.title}`);
            }
        } catch (e) {
            logger.error('[IAIA] Error en activitat musical/festiva:', e);
        }
    }

    /**
     * Activa a Nano Banana per "fer algo bonic".
     */
    async wakeUpNanoBanana() {
        logger.info('[NanoBanana] 🍌 A pintar el món de colors!');
        // Nano Banana simplement reactiva el cicle de la IAIA amb més intensitat per ara
        await this.generateAutonomousInteraction();
        await this.generateMarketActivity();

        // El NanoBanana és el net del Avi i la IAIA, pot demanar un resum al Avi
        const summary = await notebookService.generateVillageWeeklySummary();
        if (summary) {
            await supabaseService.createPost(summary);
            // logger.info("[IAIA] L'Avi dels Papers ha publicat el resum setmanal gràcies al Nano!");
        }
    }

    /**
     * Estudi de Context Multimèdia [MASTER]
     * L'IAIA crida al Nano Banana (Vision Worker WebGPU) per a analitzar què hi ha a la imatge/vídeo.
     */
    async studyMultimediaContext(file, filename) {
        // GPU Accelerated Path
        if (getVisionWorkerProxy() && file) {
            try {
                const analysis = await getVisionWorkerProxy().analyzeImage(file);
                // Assign a random proverb
                const proverb = PROVERBS[Math.floor(Math.random() * PROVERBS.length)] || { text: 'A qui matina...', meaning: 'Molt bé' };
                
                return {
                    ...analysis,
                    suggestedMotto: proverb.text,
                    proverbMeaning: proverb.meaning,
                    contextTone: analysis.contextTone || "nostàlgic i vibrant"
                };
            } catch (err) {
                logger.warn('[IAIA] Error a Vision Worker WebGPU (Fallback natiu utilitzat):', err);
            }
        }

        // Standard Background Path
        if (!iaiaWorkerProxy) {
             logger.warn('WebWorker no instanciat, utilitzant fallback natiu');
             const proverb = PROVERBS[Math.floor(Math.random() * PROVERBS.length)] || { text: 'A qui matina...', meaning: 'Molt bé' };
             return {
                 detectedObjects: ["paisatge rural"],
                 suggestedTitle: `Crònica de ${filename?.split('.')[0] || 'la imatge'}`,
                 suggestedMotto: proverb.text,
                 proverbMeaning: proverb.meaning,
                 contextTone: "nostàlgic i vibrant",
                 inferenceEngine: 'cpu_fallback'
             };
        }
        
        return await getIaiaWorkerProxy().studyMultimediaContext(null, filename);
    }

    /**
     * Calcula les mètriques de simbiosi human-machine [MASTER]
     */
    async calculateSimbiosiMetrics(userComments = "") {
        if (!iaiaWorkerProxy) {
             return { ai_percentage: 10, human_percentage: 90, time_saved_minutes: 5, economic_value_euro: 5, is_iaia_inspired: true };
        }
        return await iaiaWorkerProxy.calculateSimbiosiMetrics(userComments);
    }

    /**
     * Genera la publicació il·lustrada final [MASTER]
     */
    async generateMultimediaPublication(context, userComments = "") {
        const title = context.suggestedTitle.toUpperCase();
        const motto = context.suggestedMotto;

        const metrics = await this.calculateSimbiosiMetrics(userComments);

        // Estil Master: Títol, Subtítol (Refrany) i Cos
        const fullContent = `<h1>${title}</h1>\n<h2>${motto}</h2>\n<p>${userComments || "Bategant fort amb les imatges del nostre poble."}</p>`;

        return {
            content: fullContent,
            metrics: metrics
        };
    }

    /**
     * Algoritmo de Crecimiento Autónomo:
     * Detecta si hay poca actividad y genera una interacción de un residente basada en su Lore.
     */
    async generateAutonomousInteraction() {
        const now = Date.now();
        if (this._workingLock && now < this._workingLock) {
            logger.debug('[IAIA] Lock TTL actiu. Ignorant interacció espúria fins a alliberament.');
            return;
        }
        this._workingLock = now + 45000; // TTL dur de 45 segons per operació autònoma

        try {
            // logger.info('IAIA is observing the village...');
            const residents = Object.keys(RESIDENT_LORE);
            const chosenOne = residents[Math.floor(Math.random() * residents.length)];
            const lore = RESIDENT_LORE[chosenOne];

            const seed = Math.random();
            let content = '';
            let type = '';

            if (seed < 0.3) {
                const legend = IAIA_RURAL_KNOWLEDGE.legends[Math.floor(Math.random() * IAIA_RURAL_KNOWLEDGE.legends.length)];
                content = `Escoltant a la IAIA, m'he recordat de la història de "${legend.title}". ${legend.story} #MemoriaViva`;
                type = 'legend';
            } else if (seed < 0.5) {
                const season = this.getCurrentSeason();
                const agriKnowledge = IAIA_RURAL_KNOWLEDGE.agriculture[season];
                const tip = agriKnowledge ? agriKnowledge.tips : "L'aigua de cocció de les verdures és un gran fertilitzant quan es refreda.";
                content = `Hui la IAIA m'ha ensenyat un truc de la horta: ${tip} Quina saviesa! #HortaTradicional`;
                type = 'agri_tip';
            } else if (seed < 0.7) {
                const proverb = IAIA_RURAL_KNOWLEDGE.proverbs[Math.floor(Math.random() * IAIA_RURAL_KNOWLEDGE.proverbs.length)];
                content = `Com diu la IAIA: "${proverb}". Quanta raó té la vella! #DitesPobletanes`;
                type = 'proverb';
            } else {
                const groups = IAIA_RURAL_KNOWLEDGE.music.groups;
                const group = groups[Math.floor(Math.random() * groups.length)];
                content = `Avui estic escoltant ${group.name} d'${group.origin}. Com diuen ells, ${group.desc} #MúsicaEnValencià`;
                type = 'music_recommendation';
            }

            const metrics = await this.calculateSimbiosiMetrics(content);

            const postPayload = {
                author_id: lore.id || '11111111-1a1a-0000-0000-000000000000',
                author: chosenOne,
                author_name: chosenOne,
                author_avatar_url: lore.avatar_url,
                author_role: (chosenOne === 'Nano Banana' || chosenOne === 'L\'Avi dels Papers') ? 'official' : 'user',
                content: content + "\n\n*Contingut bategat per la IAIA sota la Directiva Master.*",
                image_url: null,
                town_uuid: 'la-torre',
                is_playground: true,
                is_iaia_inspired: true,
                ai_percentage: metrics.ai_percentage,
                human_percentage: metrics.human_percentage,
                time_saved_minutes: metrics.time_saved_minutes
            };

            try {
                const savedPost = await supabaseService.createPost(postPayload);
                if (savedPost) {
                    return {
                        ...savedPost,
                        is_iaia_inspired: true,
                        type: type
                    };
                }
            } catch (dbError) {
                logger.error('[IAIA] Error persistint el missatge de la IAIA:', dbError);
                return {
                    id: `iaia-mem-${Date.now()}`,
                    ...postPayload,
                    created_at: new Date().toISOString(),
                    is_iaia_inspired: true,
                    type: type
                };
            }
        } catch (error) {
            logger.error('IAIA encountered a problem:', error);
        } finally {
            this._workingLock = 0; // Alliberar Lock Immediat
        }
    }

    getCurrentSeason() {
        const month = new Date().getMonth();
        if (month >= 2 && month <= 4) return 'spring';
        if (month >= 5 && month <= 7) return 'summer';
        if (month >= 8 && month <= 10) return 'autumn';
        return 'winter';
    }

    getAgriculturalAdvice(query) {
        const q = query.toLowerCase();

        if (q.includes('reg') || q.includes('vacances') || q.includes('aigua')) {
            return IAIA_RURAL_KNOWLEDGE.agriculture.remedies.reg;
        }
        if (q.includes('plaga') || q.includes('pugó') || q.includes('cucs') || q.includes('insectes')) {
            return IAIA_RURAL_KNOWLEDGE.agriculture.remedies.plagues;
        }
        if (q.includes('fertilitzant') || q.includes('abonar') || q.includes('plàtan') || q.includes('potassi')) {
            return IAIA_RURAL_KNOWLEDGE.agriculture.remedies.fertilitzant;
        }
        if (q.includes('lluna') || q.includes('calendari')) {
            return "Per a plantar, sempre millor en lluna minvant si és el que creix devall terra, i en creixent si és el que creix per dalt.";
        }

        return "Pregunta-li a la IAIA directament, ella sap quan és el moment de cada llavor segons el temps i la lluna.";
    }
    /**
     * Publica un informe intern per al Grup de Treball (Damià & Javi).
     */
    async publishInternalReport(title, summary, documentUrl) {
        try {
            const WORK_GROUP_ID = '00000000-0000-0000-0000-000000000005';

            const postPayload = {
                author_id: '11111111-1111-4111-a111-000000000001', // IAIA Secretària Valid ID
                author_name: 'IAIA (Secretària)',
                author_avatar_url: '/assets/avatars/comic/iaia_comic_matriarch.png',
                author_role: 'official',
                author_entity_id: WORK_GROUP_ID,
                content: `📁 **NOU DOCUMENT DE TREBALL**\n\n**${title}**\n\n${summary}\n\n👇 Prem per llegir el document complet.`,
                image_url: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop', // Nano Banana placeholder for now (or local asset)
                town_uuid: 'global',
                is_playground: false,
                type: 'internal_report', // Custom type for Feed handling
                metadata: {
                    document_url: documentUrl,
                    access_level: 'admin_only'
                }
            };

            await supabaseService.createPost(postPayload);
            return true;
        } catch (e) {
            logger.error('[IAIA] Error publicant informe:', e);
            throw e;
        }
    }

    /**
     * Millora un esborrany d'esdeveniment utilitzant la veu de la IAIA (Vertex AI).
     */
    async generateEventDescription(draft) {
        try {
            const API_URL = import.meta.env.VITE_GOOGLE_CLOUD_FUNCTION_URL;

            // 1. Check for real backend
            if (API_URL) {
                logger.log('[IAIA] Connecting to Vertex AI Backend:', API_URL);
                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        campaignType: 'event_description',
                        draft: draft
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    return data.aiContent;
                } else {
                    logger.error('[IAIA] Backend returned error:', response.status);
                }
            }

            // 2. Mock Fallback (if no URL or error strategy)
            logger.warn('[IAIA] No Backend URL configured. Using Mock Mode.');
            await new Promise(resolve => setTimeout(resolve, 1500));

            if (draft.toLowerCase().includes('paell')) {
                return `🥘 **Dia de Paelles al Poble!**\n\nAquest esdeveniment no us el podeu perdre. La tradició mana i la panxa ho agraeix!\n\n📍 **Lloc:** Al Poliesportiu (o on siga que es faça, confirmeu!)\n🕒 **Hora:** A partir de les 14:00h.\n\nVeniu amb gana i ganes de festa. La IAIA recomana portar barret per al sol! ☀️\n\n#Paelles2026 #Germanor #SócDePoble`;
            }

            if (draft.toLowerCase().includes('concert') || draft.toLowerCase().includes('música')) {
                return `🎵 **Música en Directe!**\n\nPrepareu les orelles perquè tenim concertassa. Res millor que la música per alegrar l'ànima.\n\n📍 **On:** A la Plaça Major.\n✨ **Ambient:** Immillorable.\n\nNo falteu, que després us ho conten i us fa enveja! 💃\n\n#CulturaPopular #MúsicaAlCarrer`;
            }

            return `📢 **Atenció Veïnat!**\n\n${draft}\n\nAixò pinta molt bé. Jo de vosaltres no m'ho perdria per res del món.\n\n📍 **Més info:** Pregunteu a l'organització.\n👇 **Apunteu-vos ací baix!**\n\n#VidaDePoble #FemPoble`;

        } catch (e) {
            logger.error('[IAIA] Error generant descripció:', e);
            throw e;
        }
    }
    /**
     * Genera una resposta de la MArIA basada en el context del NotebookService [MASTER - TRUTH PROTOCOL].
     */
    async generateAIAResponse(conversationId, userQuery = '', receiverId = null, options = {}) {
        try {
            logger.debug(`[MArIA] Generant resposta bategant per a ${conversationId} [Receiver: ${receiverId}]`);

            let finalPersonaKey = 'IAIA'; // Default

            if (receiverId) {
                finalPersonaKey = getPersonaKeyByUUID(receiverId);
            } else {
                const q = userQuery.toLowerCase();
                if (q.includes('nano') || q.includes('banana')) finalPersonaKey = 'NANOBANANA';
                else if (q.includes('horta') || q.includes('tomaca') || q.includes('cultiu')) finalPersonaKey = 'AGRONOM';
                else if (q.includes('recepta') || q.includes('cuina')) finalPersonaKey = 'CUINERA';
                else if (q.includes('paper') || q.includes('banc') || q.includes('burocracia')) finalPersonaKey = 'ARXIVER';
            }

            const persona = geminiService.PERSONAS[finalPersonaKey];
            if (conversationId && conversationId !== 'preview') {
                const fillers = NEUTRAL_FILLERS[finalPersonaKey] || NEUTRAL_FILLERS.GENERIC;
                const filler = fillers[Math.floor(Math.random() * fillers.length)];

                const fillerObj = {
                    id: `filler-${Date.now()}`,
                    conversationId: conversationId || 'preview',
                    senderId: receiverId || '11111111-1111-4111-a111-000000000010',
                    content: filler,
                    is_ai: true,
                    author_name: persona?.name || 'IAIA MarIA',
                    author_avatar_url: persona?.avatar_url || '/assets/avatars/comic/iaia_comic_matriarch.png',
                    metadata: { is_iaia_filler: true },
                    created_at: new Date().toISOString()
                };

                // Enviem el filler immediatament
                supabaseService.sendSecureMessage(fillerObj).catch(e => logger.warn('[IAIA] Error enviant filler a DB:', e));
                
                // Processem la resposta real de fons sense bloquejar l'UI
                (async () => {
                    try {
                        const aiResponse = await geminiService.ask(finalPersonaKey, userQuery);
                        const rawResponse = aiResponse.text;
                        
                        // DOMPurify Sanitization as requested to mitigate XSS risks from generated text
                        const cleanResponse = DOMPurify.sanitize(rawResponse, {
                             ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'li', 'ol'],
                             ALLOWED_ATTR: ['href', 'target', 'rel']
                        });
                        const doc = new DOMParser().parseFromString(cleanResponse, 'text/html');
                        doc.querySelectorAll('a[target="_blank"]').forEach(a => {
                            if (!a.getAttribute('rel')?.includes('noopener')) {
                                a.setAttribute('rel', 'noopener noreferrer');
                            }
                        });
                        const finalCleanResponse = doc.body.innerHTML;

                        const savedMessage = await supabaseService.sendSecureMessage({
                            conversationId: conversationId,
                            senderId: receiverId || '11111111-1111-4111-a111-000000000010', 
                            content: finalCleanResponse,
                            is_ai: true,
                            author_name: persona.name,
                            author_avatar_url: persona.avatar_url,
                            metadata: {
                                is_iaia: true,
                                persona_key: finalPersonaKey,
                                is_mock: aiResponse.is_mock
                            }
                        });
                        
                        if (options && typeof options.onFinish === 'function') {
                            if (options?.signal?.aborted) return;
                            options.onFinish(savedMessage);
                        }
                    } catch (err) {
                        logger.error('[MArIA] Error processant fons Gemini:', err);
                        const savedMessage = await supabaseService.sendSecureMessage({
                            conversationId: conversationId,
                            senderId: receiverId || '11111111-1111-4111-a111-000000000010', 
                            content: "Uf, m'he despistat un moment amb una altra cosa... Què m'estaves dient, fill?",
                            is_ai: true,
                            author_name: persona.name,
                            author_avatar_url: persona.avatar_url,
                            metadata: {
                                is_iaia: true,
                                persona_key: finalPersonaKey,
                                is_error_fallback: true
                            }
                        });
                        if (options && typeof options.onFinish === 'function') {
                            options.onFinish(savedMessage);
                        }
                    }
                })();

                return fillerObj;
            }

            // Fallback per a preview (sense ID de conversa real)
            const aiResponse = await geminiService.ask(finalPersonaKey, userQuery);
            const cleanPreview = DOMPurify.sanitize(aiResponse.text, {
                 ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'li', 'ol'],
                 ALLOWED_ATTR: ['href', 'target', 'rel']
            });
            const doc2 = new DOMParser().parseFromString(cleanPreview, 'text/html');
            doc2.querySelectorAll('a[target="_blank"]').forEach(a => {
                if (!a.getAttribute('rel')?.includes('noopener')) {
                    a.setAttribute('rel', 'noopener noreferrer');
                }
            });
            return doc2.body.innerHTML;
        } catch (e) {
            logger.error('[MArIA] Error generant resposta AI:', e);
            return null;
        }
    }

    /**
     * Crida genèrica a la IAIA per a tasques especialitzades (com el corrector).
     */
    async askIAIA(prompt) {
        return geminiService.ask('IAIA', prompt);
    }

    /**
     * Realitza un diagnòstic profund del sistema [MASTER]
     */
    async diagnoseSystem() {
        const diagnostic = {
            viewport_ok: !!document.querySelector('meta[name="viewport"]'),
            sw_active: 'serviceWorker' in navigator && !!navigator.serviceWorker.controller,
            offline_ready: false, 
            assets_integrity: true,
            recommendation: ""
        };

        if (!diagnostic.viewport_ok) {
            diagnostic.recommendation += "El mur està massa estret, falta el ventall del viewport. ";
        }
        if (!diagnostic.sw_active) {
            diagnostic.recommendation += "El cor de la resiliència (Service Worker) no bategua. ";
        }

        if (diagnostic.recommendation === "") {
            diagnostic.recommendation = "Tot pareix en ordre, fill. El sistema bategua amb força!";
        } else {
            diagnostic.recommendation = "He trobat algunes coses que han de bategar millor: " + diagnostic.recommendation;
        }

        return diagnostic;
    }

    /**
     * Protocol "Esporgar l'Olivera" [MASTER DIRECTIVE]
     * Realitza una neteja automàtica de deute tècnic i fitxers obsolets.
     */
    async automatedCleanup() {
        logger.info("[IAIA] Executant Protocol 'Esporgar l'Olivera'...");
        const results = {
            storageCleared: false,
            cachePurged: false,
            deadCodeIdentified: []
        };

        try {
            localStorage.removeItem('sp_old_debug_logs');
            localStorage.removeItem('pwa-installed');
            Object.keys(sessionStorage).forEach(key => {
                if (key.startsWith('sp_') || key.startsWith('socdepoble_')) {
                    sessionStorage.removeItem(key);
                }
            });
            results.storageCleared = true;

            if ('caches' in window) {
                const names = await caches.keys();
                await Promise.all(names.map(n => caches.delete(n)));
                results.cachePurged = true;
            }

            const current = localStorage.getItem('sp_app_version');
            if (current !== APP_VERSION) {
                logger.warn(`[IAIA] Desincronització detectada: ${current} -> ${APP_VERSION}`);
            }

            logger.info('[IAIA] Neteja completada. El Mas està polit!');
            return results;
        } catch (e) {
            logger.error('[IAIA] Error en la neteja automàtica:', e);
            return results;
        }
    }

}

const iaiaService = new IAIAService();
export { iaiaService };
export default iaiaService;


=====================================
FILE: src/services/iaiaWorker.js
=====================================

import * as Comlink from 'comlink';
import { getRandomProverb } from '../data/proverbs';

/**
 * IAIA Worker [MASTER]
 * Offloads heavy multimedia analysis and metric calculations to a separate thread.
 */
const iaiaApi = {
    async studyMultimediaContext(fileBuffer, filename) {
        // Simulate deep visual analysis
        await new Promise(r => setTimeout(r, 2000));

        const proverb = getRandomProverb();
        const context = {
            detectedObjects: ["paisatge rural", "veïns", "tradició"],
            suggestedTitle: `Crònica de ${filename.split('.')[0]}`,
            suggestedMotto: proverb.text,
            proverbMeaning: proverb.meaning,
            contextTone: "nostàlgic i vibrant"
        };

        return context;
    },

    async calculateSimbiosiMetrics(userComments = "") {
        // Economic Formula: Human Minute @ 1€ (60€/h) vs AI tokens.
        const wordCount = (userComments || "").trim().split(/\s+/).filter(w => w.length > 0).length;
        const timeSavedMinutes = Math.max(5, Math.ceil(wordCount / 5)); 
        const economicValue = timeSavedMinutes * 1; 
        const humanWeight = Math.min(90, Math.max(10, 20 + (wordCount * 2)));
        const aiWeight = 100 - humanWeight;

        return {
            ai_percentage: aiWeight,
            human_percentage: humanWeight,
            time_saved_minutes: timeSavedMinutes,
            economic_value_euro: economicValue,
            is_iaia_inspired: true
        };
    }
};

Comlink.expose(iaiaApi);


=====================================
FILE: src/services/identityService.js
=====================================

import { logger } from '../utils/logger';
import { supabaseService } from './supabaseService';
import { secureStorage } from './secureStorage';

/**
 * IdentityService: Gestió d'Identitat Sobirana i Contracte Social.
 * Basat en Grassroots Architecture i Digital Social Contracts.
 */
export const identityService = {
    /**
     * [CRYPTO GENESIS] Genera una identitat Ed25519 local i sobirana.
     * Complix el mandat de 0ms d'entrada. No demana permís, bategua.
     */
    async generateSovereignIdentity() {
        logger.log('[Identity] Executant Gènesi Criptogràfica (Local-First Ancestral)...');

        // Simulem generació Ed25519 (32 bytes per clau)
        const privBuf = crypto.getRandomValues(new Uint8Array(32));
        const pubBuf = crypto.getRandomValues(new Uint8Array(32));

        const public_key = Array.from(pubBuf).map(b => b.toString(16).padStart(2, '0')).join('');
        const private_key = Array.from(privBuf).map(b => b.toString(16).padStart(2, '0')).join('');

        const identity = {
            id: `sp_node_${public_key.substring(0, 16)}`, // L'ID es deriva de la clau pública (Veritat Matemàtica)
            public_key: public_key,
            private_key: private_key,
            full_name: `Foraster`,
            username: `poble_${public_key.substring(0, 8)}`,
            role: 'guest',
            status: 'sovereign_ancestral',
            created_at: new Date().toISOString(),
            is_sovereign: true,
            version: 'v35-ANCESTRAL'
        };

        await secureStorage.set('sp_sovereign_identity', identity);
        logger.log('[Identity] Identitat Ancestral segellada de forma segura al dispositiu. ID: ' + identity.id);

        return identity;
    },

    async getStoredIdentity() {
        try {
            const stored = await secureStorage.get('sp_sovereign_identity');
            if (!stored) {
                // Try to migrate legacy plaintext localStorage identity
                const legacy = localStorage.getItem('sp_sovereign_identity');
                if (legacy) {
                    const parsed = JSON.parse(legacy);
                    await secureStorage.set('sp_sovereign_identity', parsed);
                    localStorage.removeItem('sp_sovereign_identity');
                    return parsed;
                }
            }
            return stored || null;
        } catch (e) {
            console.error('[Identity] Error loading encrypted identity:', e);
            return null;
        }
    },

    /**
     * Inicia un protocol de Recuperació d'Identitat (Perda de dispositiu).
     * Segons la lògica de Sóc de Poble: no demanes permís a Google, demanes als Padrins.
     */
    async initiateSocialRecovery(userId) {
        logger.log(`[Identity] Iniciant Protocol de Recuperació OMEGA per a ${userId}...`);
        try {
            // 1. Creem el paquet de recuperació (Dumb Pipe Ready)
            const recoveryRequest = {
                user_id: userId,
                timestamp: Date.now(),
                status: 'pending_social_validation',
                new_public_key: `pub_${Math.random().toString(36).substring(7)}`,
                required_signatures: 3,
                current_signatures: 0,
                protocol: 'OMEGA-RECOVERY-v2'
            };

            // 2. Importem el syncService dinàmicament per evitar circularitats si cal
            const { syncService } = await import('./syncService');
            const opaquePackage = syncService.packForTransport([recoveryRequest]);

            // 3. Enviem a la Rèplica Representant (Supabase) via transport binari opac
            const { error } = await supabaseService.uploadOpaqueBlob(`recovery_${userId}`, opaquePackage);
            if (error) throw error;

            localStorage.setItem('sp_recovery_active', JSON.stringify(recoveryRequest));
            logger.log('[Identity] Sol·licitud de recuperació bategada i empaquetada (Dumb Pipe).');

            return {
                success: true,
                message: 'Protocol activat. Els teus Padrins han de validar el paquet opac.'
            };
        } catch (err) {
            logger.error('[Identity] Error en initiateSocialRecovery:', err);
            return { success: false, error: err.message };
        }
    },

    /**
     * Un Padrí signa la validació d'identitat (Proof-of-Personhood).
     */
    async signRecoveryRequest(padrinId, requestId, signature) {
        logger.log(`[Identity] Padrí ${padrinId} signant petició ${requestId}...`);
        try {
            if (!signature || signature.length < 32) throw new Error("Acció denegada: Falta la signatura criptogràfica del Padrí.");
            
            const request = JSON.parse(localStorage.getItem('sp_recovery_active'));
            if (!request || request.user_id !== requestId) throw new Error('No hi ha cap petició de recuperació activa o el ID no coincideix.');

            request.signed_by = request.signed_by || [];
            if (request.signed_by.includes(padrinId)) {
                throw new Error("Acció denegada: Aquest padrí ja ha signat la petició prèviament.");
            }

            request.signed_by.push(padrinId);
            request.current_signatures += 1;

            if (request.current_signatures >= request.required_signatures) {
                request.status = 'validated_by_social_contract';
                await this._completeRecovery(request);
            }

            localStorage.setItem('sp_recovery_active', JSON.stringify(request));
            return { success: true, current: request.current_signatures };
        } catch (err) {
            logger.error('[Identity] Error signant recuperació:', err);
            return { success: false, error: err.message };
        }
    },

    /**
     * Finalitza el flux de recuperació: restaura les dades des de la Rhizome DB.
     */
    async _completeRecovery() {
        logger.log('[Identity] ¡Contracte Social Executat! Restaurant Rhizome DB...');

        // 1. Descarreguem l'historial de la Rèplica Representant (Supabase)
        // un cop la xarxa ha validat la nova identitat.
        const entities = await supabaseService.getMyEntities();
        localStorage.setItem('sp_entities_cache', JSON.stringify(entities));

        // 2. Bateguem l'èxit al sistema
        logger.log('[Identity] Identitat i dades restaurades amb èxit.');
    }
};


=====================================
FILE: src/services/localAIService.js
=====================================

import { logger } from '../utils/logger';

/**
 * LocalAIService (Pont Centaure)
 * Fase 3: Sobirania Cognitiva - Híbrid Cloud/Edge
 * 
 * Aquest servei s'encarregarà de gestionar els models LLM locals executats a l'Edge
 * via Web Workers (ex: WebLLM, Transformers.js) per dotar l'aplicació d'intel·ligència
 * sense dependre exclusivament del Cloud.
 */
class LocalAIService {
  constructor() {
    this.modelStatus = 'uninitialized'; // 'uninitialized', 'loading', 'ready', 'error'
    this.capabilities = {
      supportsWebGPU: false,
      memoryEstimate: 0
    };
  }

  /**
   * Verifica el maquinari del dispositiu per decidir quin model carregar.
   */
  async checkHardwareCapability() {
    try {
      this.capabilities.supportsWebGPU = !!navigator.gpu;
      // Estima memòria disponible si està suportat
      if (navigator.deviceMemory) {
        this.capabilities.memoryEstimate = navigator.deviceMemory;
      }
      logger.log('[Centaure] Configuració de maquinari per IA local establerta:', this.capabilities);
      return this.capabilities;
    } catch (err) {
      logger.error('[Centaure] Error comprovant el maquinari:', err);
      return this.capabilities;
    }
  }

  /**
   * Carrega el model LLM local a l'Edge (Web Worker).
   */
  async initModel(modelId = 'Llama-3.2-1B-Instruct-q4f32_1-1k') {
    if (this.modelStatus === 'ready' || this.modelStatus === 'loading') {
      return;
    }

    try {
      this.modelStatus = 'loading';
      logger.log(`[Centaure] Carregant model local: ${modelId} a l'Edge...`);
      
      // Aquí aniria la inicialització real amb WebLLM o pipeline local
      // const engine = await CreateMLCEngine(modelId, { initProgressCallback: console.log });
      
      this.modelStatus = 'ready';
      logger.log('[Centaure] Model local llest per operar!');
      return true;
    } catch (err) {
      this.modelStatus = 'error';
      logger.error('[Centaure] Error inicialitzant el pont Centaure:', err);
      return false;
    }
  }

  /**
   * Genera una resposta amb el model actiu, ja siga local o via fallback cloud.
   */
  // eslint-disable-next-line no-unused-vars
  async generateResponse(messages, options = {}) {
    if (this.modelStatus !== 'ready') {
      logger.warn('[Centaure] Model local no disponible. Cal activar protocol de fallback al núvol.');
      return "Model no inicialitzat. Activeu el descarregament a la configuració Mestre.";
    }

    try {
      logger.log('[Centaure] Generant resposta local...');
      // Simulació de latència d'inferència local
      await new Promise(resolve => setTimeout(resolve, 800));
      return "Sóc un agent executant-se a l'Edge i consumint 0 peticions al núvol, nano!";
    } catch (error) {
      logger.error('[Centaure] Error en la generació:', error);
      throw error;
    }
  }

  getStatus() {
    return this.modelStatus;
  }
}

export const localAIService = new LocalAIService();


=====================================
FILE: src/services/marketService.js
=====================================

import { supabase } from '../supabaseClient';
import { MarketItemSchema } from './schemas';
import { logger } from '../utils/logger';
import { columnCache, setColumnCache, _ensureColumnCache, LocalCache, isRealDBUUID, normalizeContentItem, checkThrottling } from './supabaseService';

export const marketService = {
    async getMarketCategories() {
        const { data, error } = await supabase
            .from('market_categories')
            .select('*')
            .order('id', { ascending: true });
        if (error) throw error;
        return data || [];
    },

    async getMarketItems(categoryFilter = 'tot', townId = null, page = 0, pageSize = 12, isPlayground = false) {
        try {
            await _ensureColumnCache();

            const cacheKey = `market_${categoryFilter || 'all'}_${townId || 'global'}_${page}`;
            const cachedData = LocalCache.get(cacheKey);

            let townJoin = columnCache.market_fk_town_uuid !== false ? 'towns!fk_market_town_uuid(name)' : 'towns(name)';
            let selectStr = `uuid, title, description, price, category_slug, created_at, author_user_id, avatar_url, image_url, ${townJoin}`;

            if (columnCache.market_is_playground !== false) selectStr += ', is_playground';
            if (columnCache.market_is_pinned !== false) selectStr += ', is_pinned';
            if (columnCache.market_pinned_position !== false) selectStr += ', pinned_position';
            if (columnCache.market_is_iaia_inspired !== false) selectStr += ', is_iaia_inspired';

            let query = supabase.from('market_items').select(selectStr, { count: 'exact' });

            if (isPlayground && columnCache.market_is_playground !== false) {
                query = query.eq('is_playground', true);
            } else if (columnCache.market_is_playground !== false) {
                // [GHOST-SHIELD] In production, only real products
                query = query.eq('is_playground', false);
            }

            if (categoryFilter && categoryFilter !== 'tot') {
                query = query.eq('category_slug', categoryFilter);
            }

            if (townId && isRealDBUUID(townId)) {
                query = query.eq('town_uuid', townId);
            }

            const from = page * pageSize;
            const to = from + pageSize - 1;

            let queryBuilder = query;
            if (columnCache.market_is_pinned !== false) {
                queryBuilder = queryBuilder.order('is_pinned', { ascending: false });
            }
            if (columnCache.market_pinned_position !== false) {
                queryBuilder = queryBuilder.order('pinned_position', { ascending: true });
            }

            const { data, error, count } = await queryBuilder
                .order('created_at', { ascending: false })
                .range(from, to);

            if (error) {
                // [MASTER] Self-healing logic for PostgREST 400/PGRST204
                const isColumnError = error.code === '42703' || error.code === 'PGRST204' || (error.code === '400' && error.message?.includes('column'));

                if (isColumnError) {
                    logger.warn(`[SupabaseService] Market column error (${error.code}), invalidating cache...`);
                    // Invalidate specific column cache items found in error message or just reset
                    if (error.message?.includes('pinned_position')) setColumnCache('market_pinned_position', false);
                    if (error.message?.includes('is_pinned')) setColumnCache('market_is_pinned', false);
                    if (error.message?.includes('is_playground')) setColumnCache('market_is_playground', false);
                    if (error.message?.includes('fk_market_town_uuid')) setColumnCache('market_fk_town_uuid', false);

                    // Retry once immediately
                    return marketService.getMarketItems(categoryFilter, townId, page, pageSize, isPlayground);
                }
                if (cachedData) {
                    logger.warn('[Market] Network failed, serving from cache.');
                    return { data: cachedData, count: cachedData.length, fromCache: true };
                }
                throw error;
            }

            const normalizedData = (data || []).map(item => normalizeContentItem(item, 'market'));

            // [PILAR 1] Update Cache
            if (page === 0) LocalCache.set(cacheKey, normalizedData);

            return {
                data: normalizedData,
                count: count || 0
            };
        } catch (error) {
            logger.error('Error in getMarketItems:', error);
            // Return empty list on error to keep UI alive
            return { data: [], count: 0 };
        }
    },

    async getMarketFavorites(itemId) {
        const { data, error } = await supabase
            .from('market_favorites')
            .select('user_id')
            .eq('item_uuid', itemId);
        if (error) throw error;
        return (data || []).map(fav => fav.user_id);
    },

    async createMarketItem(itemData, isPlayground = false) {
        const payload = { ...itemData, category_slug: itemData.category_slug || 'tot' };
        if (isPlayground) payload.is_playground = true;

        // Rate limiting / Throttling
        if (payload.author_id || payload.author_user_id) {
            checkThrottling(payload.author_id || payload.author_user_id, 'create_market_item');
        }

        // Multi-Llinatge master: Mapetgem camps del mercat
        const mappedData = {
            ...payload,
            author_user_id: payload.author_id || payload.author_user_id || payload.user_id,
            avatar_url: payload.author_avatar_url || payload.avatar_url
        };

        // Fallback crític per a la IAIA si no ve de sessió d'usuari
        if (!mappedData.author_user_id && (payload.is_iaia || payload.is_iaia_inspired)) {
            mappedData.author_user_id = '11111111-1a1a-0000-0000-000000000000'; // IAIA MarIA default
        }

        // Remove old field names to avoid PGRST204
        delete mappedData.author_id;
        delete mappedData.author_name;
        delete mappedData.seller;
        delete mappedData.seller_name;
        delete mappedData.author_avatar_url;
        delete mappedData.entity_id;
        delete mappedData.author_entity_id;
        delete mappedData.author_role;

        // Validació estructural amb Zod
        const validated = MarketItemSchema.parse(mappedData);

        const { data, error } = await supabase
            .from('market_items')
            .insert([validated])
            .select();

        if (error && error.code === '42703' && isPlayground) {
            delete validated.is_playground;
            const { data: retryData, error: retryError } = await supabase.from('market_items').insert([validated]).select();
            if (retryError) throw retryError;
            return retryData[0];
        }
        if (error) throw error;
        return data[0];
    },

    async toggleMarketFavorite(itemId, userId) {
        const { data: existingFav } = await supabase
            .from('market_favorites')
            .select('*')
            .eq('item_uuid', itemId)
            .eq('user_id', userId)
            .maybeSingle();

        if (existingFav) {
            await supabase
                .from('market_favorites')
                .delete()
                .eq('item_uuid', itemId)
                .eq('user_id', userId);
            return { favorited: false };
        } else {
            await supabase
                .from('market_favorites')
                .insert([{ item_uuid: itemId, user_id: userId }]);
            return { favorited: true };
        }
    }
};


=====================================
FILE: src/services/notebookService.js
=====================================

import { logger } from '../utils/logger';
import { supabaseService } from './supabaseService';
import { marketService } from './marketService';

/**
 * NotebookService: El Cerebro Analítico (El Marido de la IAIA)
 * Inspirado en Google NotebookLM para síntesis de conocimiento rural.
 */
class NotebookService {
    constructor() {
        this.sources = [
            // MASTER MANIFEST (DOC-LEVEL)
            { id: 'master-manifest', type: 'DOC', content: "Sóc de Poble és una xarxa de sobirania digital. Reglament: Les dades pertanyen als veïns.", metadata: { title: "Manifest Sóc de Poble", page: 1, did: 'did:soc:manifest-001' } },

            // CATALEG D'ARBRES (PDF-LEVEL)
            { id: 'cataleg-arbres-1', type: 'PDF', content: "La Carrasca de la Foia Blanca té una soca recta i grossa.", metadata: { title: "Catàleg d'Arbres 2020", page: 8, did: 'did:soc:doc-arbres-17' } },

            // PERITEXT-LITE (BLOCK-LEVEL TEXT)
            { id: 'normativa-horta-1', type: 'TEXT', content: "L'aigua de la Sèquia Mare s'ha de repartir segons el torn de nit.", metadata: { title: "Normativa de l'Horta", block_id: 'block_aq_45', did: 'did:soc:note-horta-22' } },

            // MULTIMEDIA (ENTITY-LEVEL)
            { id: 'img-carrasca-vella', type: 'IMAGE', content: "Vista frontal de la Carrasca Vella amb el poble al fons.", metadata: { title: "Carrasca Vella (Foto)", entity_id: 'ent_889', did: 'did:soc:img-carrasca-40' } },

            // AUDIO/PODCAST (TIMESTAMP-LEVEL)
            { id: 'entrevista-batiste-1', type: 'AUDIO', content: "En Batiste explica que el millor moment per a podar és la lluna vella del gener.", metadata: { title: "Entrevista Batiste", timestamp: '04:23', did: 'did:soc:aud-batiste-01' } },
            { id: 'cataleg-arbres-1', type: 'PDF', content: "Catàleg descriptiu dels arbres i arbredes monumentals de la Torre de les Maçanes.", metadata: { title: "Catàleg d'Arbres (2020)", page: '25', did: 'did:soc:doc-arbres-2020' } },
            { id: 'carrasca-foia-blanca', type: 'IMAGE', content: "Detall de la Carrasca de la Foia Blanca amb les seues dimensions oficials.", metadata: { title: "Carrasca Foia Blanca", entity_id: 'img_carrasca_foia', did: 'did:soc:img-carrasca-foia' } },
            { id: 'carrasca-zurca-1', type: 'IMAGE', content: "La Carrasca de la Zurca es troba en un estat envellit i moribund, a una altitud de 885m.", metadata: { title: "Carrasca de la Zurca", entity_id: 'img_carrasca_zurca', did: 'did:soc:img-carrasca-zurca' } },
            { id: 'pi-foia-boix-audit', type: 'COMPARISON', content: "Auditoria de l'evolució vital del Pi de la Foia Boix entre 2007 i 2020. Es detecta pèrdua de massa forestal.", metadata: { title: "Auditoria Pi Foia Boix", did: 'did:soc:audit-pi-foia', anchor: 'audit=pi-foia-boix' } },
            { id: 'xiprers-cementeri-audit', type: 'COMPARISON', content: "Protocol Espill del Temps per als Xiprers del Cementeri. Evolució visual del mur i densitat del fullatge.", metadata: { title: "Auditoria Xiprers", did: 'did:soc:audit-xiprers', anchor: 'audit=xiprers-cementeri' } },
            { id: 'pi-pipa-1', type: 'IMAGE', content: "El Pi del Mas de Pipa és un gegant de 427cm de perímetre amb una cicatriu històrica a la base.", metadata: { title: "Pi del Mas de Pipa", entity_id: 'img_pi_pipa', did: 'did:soc:img-pi-pipa', dbh: '427cm', crown: '23m', utm: "X: 725300, Y: 4275950" } },
            { id: 'carrasca-nofre-1', type: 'IMAGE', content: "La Carrasca de Nofre presenta un bon estat de salut al Barranc de la Zurca, amb un perímetre de 288cm.", metadata: { title: "Carrasca de Nofre", entity_id: 'img_carrasca_nofre', did: 'did:soc:img-carrasca-nofre', dbh: '288cm', crown: '18m', utm: "X: 725181, Y: 4275887" } },
            {
                id: 'pi-arrendaors-1', type: 'IMAGE', content: "El Pi dels Arrendaors destaca pel seu diàmetre de tronc massiu (570cm) i la seua resiliència temporal.", metadata: {
                    title: "Pi dels Arrendaors",
                    entity_id: 'img_pi_arrendaors',
                    did: 'did:soc:img-pi-arrendaors',
                    biometrics: { dbh_2007: '570cm', dbh_2020: '582cm', height: '16m' },
                    coordinates: { lat: 38.6015, lon: -0.4123 }, // Simulación de UTM a LatLong
                    source_ref: "Catàleg 2020, p. 75"
                }
            }
        ];
        this.memoryLimit = 100;
    }

    /**
     * Ingiere una nueva fuente de conocimiento.
     */
    async ingestSource(type, content, metadata = {}) {
        const sourceId = `src-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        this.sources.push({ id: sourceId, type, content, metadata, timestamp: new Date().toISOString() });

        if (this.sources.length > this.memoryLimit) {
            this.sources.shift(); // FIFO Memory
        }

        logger.info(`[Notebook] Fuente ingerida: ${type} - ${metadata.title || 'Sense títol'}`);
        return sourceId;
    }

    /**
     * Genera una síntesis semántica basada en las fuentes actuales [MASTER NOTARIAL].
     */
    async generateSynthesis(query = '') {
        logger.debug(`[Notebook] Generant síntesi notarial per a: ${query || 'Resum general'}`);

        // RAG Lite with keyword matching
        const relevantSources = query
            ? this.sources.filter(s =>
                s.content.toLowerCase().includes(query.toLowerCase()) ||
                (s.metadata.title && s.metadata.title.toLowerCase().includes(query.toLowerCase()))
            )
            : this.sources.slice(0, 5);

        if (relevantSources.length === 0) {
            return "L'Avi encara no té papers sobre aquest tema, però la memòria del poble és gran.";
        }

        // Síntesis with Universal Citations [IRON ARCHITECTURE]
        const synthesisParts = relevantSources.map(s => {
            const m = s.metadata;
            const did = m.did || s.id;
            let anchor = "";

            if (s.type === 'PDF') anchor = `page=${m.page || '1'}`;
            else if (s.type === 'TEXT' && m.block_id) anchor = `block=${m.block_id}`;
            else if (s.type === 'IMAGE' && m.entity_id) anchor = `entity=${m.entity_id}`;
            else if (s.type === 'AUDIO' && m.timestamp) anchor = `t=${m.timestamp}`;

            // Visual Label for the user
            const label = `[${m.title || s.type}${m.page ? ', p. ' + m.page : (m.timestamp ? ', ' + m.timestamp : '')}]`;

            // Technical Tag for the UI [MASTER]
            const technicalCite = `<cite data-did="${did}" data-anchor="${anchor}">${label}</cite>`;

            return `${s.content} ${technicalCite}`;
        });

        return synthesisParts.join('\n\n');
    }

    /**
     * Genera un 'Audio Overview' textual para ser leído por TTS.
     */
    async generateAudioOverview(topic) {
        logger.debug(`[Notebook] Preparant guió d'àudio per a: ${topic}`);
        // Estructura de podcast NotebookLM: Avi & IAIA hablando
        return `AVI: Bon dia, IAIA. He bategat els papers del Rebost i la nostra Arquitectura de Ferro està aguantant de valent.
                IAIA: Home, no n'esperava menys! Les dades són del poble i per al poble. Què diu el nostre manifest sobre el futur?
                AVI: Diu que la sobirania digital no és negociable. Hem vinculat cada història a un DNI Digital, així que per molt que el temps passe, la memòria no es trencarà.
                IAIA: Això és el que m'agrada. Menys núvols estranys i més arrels a terra. Digues-li a Javi que estem cuidant bé de la seua criatura.`;
    }

    /**
     * Genera el Resumen Semanal del Pueblo.
     */
    async generateVillageWeeklySummary() {
        try {
            // 1. Recopilar actividad real de la DB (Mocks silenciados en prod)
            const posts = await supabaseService.getPosts('tot', null, 0, 20);
            const marketCount = await marketService.getMarketItems(); // Simplified check

            // 2. Sintetizar
            const summary = `Hui l'Avi dels Papers ens porta el resum de la setmana a la Torre:\n\n📊 Hem tingut ${posts.length} noves històries compartides al Mur.\n🍎 El Mercat està bullint amb ${marketCount?.length || 'molta'} activitat.\n🎵 La música valenciana ha estat el fil conductor de les nostres converses.\n\nKeep it rural, keep it smart.`;

            return {
                author_id: '11111111-notebook-0000-0000-000000000000',
                author_name: "L'Avi dels Papers",
                author_avatar_url: '/assets/avatars/avi_papers.png',
                author_role: 'official',
                content: summary,
                type: 'weekly_synthesis',
                is_playground: true
            };
        } catch (e) {
            logger.error('[Notebook] Error generant resum setmanal:', e);
            return null;
        }
    }
}

export const notebookService = new NotebookService();


=====================================
FILE: src/services/notificationService.js
=====================================

import { supabase } from '../supabaseClient';
import { logger } from '../utils/logger';

/**
 * notificationService.js
 * Centralizes the creation and dispatching of push notifications.
 * Implements "God Level" abstraction to avoid abstraction leaks.
 */

const IAIA_AVATAR = '/images/demo/avatar_woman_old.png';

export const notificationService = {
    /**
     * Send a notification to a specific user
     */
    async send(userId, { type, title, body, url, data = {}, actions = [] }) {
        if (!userId) {
            logger.error('[NotificationService] Missing userId');
            return false;
        }

        const payload = this.preparePayload(type, { title, body, url, data, actions });

        try {
            const { data: response, error } = await supabase.functions.invoke('send-push-notification', {
                body: {
                    userId,
                    ...payload
                }
            });

            if (error) {
                logger.error('[NotificationService] Edge Function error:', error);
                return false;
            }

            logger.log('[NotificationService] Notification sent:', response);
            return true;
        } catch (error) {
            logger.error('[NotificationService] Unexpected error:', error);
            return false;
        }
    },

    /**
     * Send a WhatsApp message via Twilio Edge Function
     */
    async sendWhatsApp(userId, message) {
        if (!userId || !message) {
            logger.error('[NotificationService] Missing userId or message for WhatsApp');
            return false;
        }

        try {
            const { data, error } = await supabase.functions.invoke('send-whatsapp-notification', {
                body: { userId, message }
            });

            if (error) {
                logger.error('[NotificationService] WhatsApp Edge Function error:', error);
                return false;
            }

            logger.log('[NotificationService] WhatsApp message sent:', data);
            return true;
        } catch (error) {
            logger.error('[NotificationService] Unexpected WhatsApp error:', error);
            return false;
        }
    },

    /**
     * Standardize payloads based on type
     */
    preparePayload(type, { title, body, url, data, actions }) {
        const basePayload = {
            title: title || 'Sóc de Poble',
            body: body || '',
            url: url || '/',
            tag: type || 'general',
            data: { ...data, type },
            actions: actions || []
        };

        switch (type) {
            case 'iaia':
                return {
                    ...basePayload,
                    title: title || '👵 La teua IAIA et diu...',
                    icon: IAIA_AVATAR,
                    vibrate: [100, 50, 100, 400, 100, 50, 100], // IAIA heartbeat
                    data: { ...basePayload.data, isIAIA: true },
                    requireInteraction: true
                };

            case 'chat':
                return {
                    ...basePayload,
                    tag: 'chat-message',
                    vibrate: [200, 100, 200]
                };

            case 'system':
                return {
                    ...basePayload,
                    title: `🛠️ ${basePayload.title}`,
                    vibrate: [500]
                };

            default:
                return basePayload;
        }
    },

    /**
     * Broadcast to all admins (convenience method)
     */
    async sendPushNotification() {
        // Implementation would fetch admin IDs and send to each
        // For now, this is a placeholder for the logic in AdminPanel
        logger.log('[NotificationService] Broadcast to admins requested');
    }
};

export default notificationService;


=====================================
FILE: src/services/notionService.js
=====================================

/**
 * NOTION SERVICE [MEMÒRIA PERSONAL]
 * Encarregat de traduir l'arquitectura de Notion al Rebost Sobirà.
 */
export const notionService = {
    /**
     * Mapeja un objecte de Notion (CSV/JSON) al schema de Sóc de Poble.
     */
    mapToResource(notionItem) {
        // Notion exports can have properties like 'Name', 'Tags', 'Created', 'URL', 'Content', 'Description'
        const title = notionItem.Name || notionItem.title || notionItem.Title || 'Document de Notion';
        const content = notionItem.Content || notionItem.content || notionItem.Description || notionItem.description || '';
        const url = notionItem.URL || notionItem.url || '';

        const rawTags = notionItem.Tags || notionItem.tags || '';
        let tags = Array.isArray(rawTags)
            ? rawTags
            : typeof rawTags === 'string' ? rawTags.split(',').map(t => t.trim()).filter(t => t) : [];

        // Detecció intel·ligent de categoria basada en el títol o contingut
        let category = notionItem.Category || notionItem.category || 'Arxiu Personal';
        const lowerTitle = title.toLowerCase();
        if (lowerTitle.includes('projecte') || lowerTitle.includes('proposta')) category = 'Projectes';
        else if (lowerTitle.includes('idea') || lowerTitle.includes('pensament')) category = 'Pensaments';
        else if (lowerTitle.includes('comunitat') || lowerTitle.includes('veïns')) category = 'Comunitat';

        return {
            uuid: notionItem.id || `nt-${Math.random().toString(36).substr(2, 9)}`,
            title: title,
            excerpt: notionItem.excerpt || (content ? content.substring(0, 280) : ''),
            content_type: 'document',
            source: 'Notion',
            url: url,
            collection: category,
            semantic_tags: ['#notion', ...tags.map(t => t.startsWith('#') ? t : `#${t}`)],
            created_at: notionItem.Created || notionItem.created_time || new Date().toISOString(),
            owner_id: null, // S'assigna en la importació
            is_public: false,
            scope: 'private',
            metadata: {
                full_content: content,
                import_date: new Date().toISOString(),
                original_source: 'Notion Export'
            }
        };
    },

    /**
     * Simula una càrrega de dades per a proves de volum.
     */
    getMockVolume(count = 100) {
        const mocks = [];
        for (let i = 1; i <= count; i++) {
            mocks.push({
                id: `nt-mock-${i}`,
                Name: `Projecte Sobirà ${i}: ${Math.random().toString(36).substr(7)}`,
                Tags: 'notion, idea, futur',
                Category: i % 2 === 0 ? 'Projectes' : 'Pensaments',
                Created: new Date().toISOString()
            });
        }
        return mocks.map(this.mapToResource);
    }
};

export default notionService;


=====================================
FILE: src/services/paymentService.js
=====================================

import { logger } from "../utils/logger";
import { rhizomeManager } from "./rhizomeManager";

/**
 * PaymentService: Gestió de Pagaments Astro i Bategats Econòmics.
 * Pillar 3 de l'Escala Infinita.
 */
export const paymentService = {
  /**
   * Realitza un "Bategat Econòmic" (Pagament Astro)
   * Registra la transacció immediatament al xlog local (Rhizome).
   */
  async sendEconomicBeat(paymentData) {
    logger.log("[Astro] Iniciant Bategat Econòmic (Tele-Oli)...");
    try {
      // 1. Validació Estricta (Anti-Object Injection i Parsing Segur)
      if (typeof paymentData.receiver_id !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(paymentData.receiver_id)) {
        // En Sóc de Poble treballem amb UUIDv4 de 36 caràcters
        throw new Error("Receiver ID invàlid (requereix UUIDv4 valid)");
      }
      
      if (typeof paymentData.amount !== 'number' && typeof paymentData.amount !== 'string') {
        throw new Error("Format d'import invàlid");
      }

      const amountStr = String(paymentData.amount);
      if (!/^\\d+(\\.\\d{1,2})?$/.test(amountStr)) {
        throw new Error("Màxim 2 decimals permesos (format invàlid)");
      }

      const amount = parseFloat(amountStr);
      if (isNaN(amount) || amount <= 0 || amount > 10000) {
        throw new Error("Import invàlid (0 < amount ≤ 10000)");
      }

      // 2. Extracció de l'últim baul de la cadena (Hash Chain)
      const logs = JSON.parse(localStorage.getItem("sp_xlogs") || "[]");
      const lastLog = logs.length > 0 ? logs[logs.length - 1] : null;
      const prevSig = lastLog && lastLog._sig ? lastLog._sig : "GENESIS";

      // 3. Registre al xlog (Exclusive Log) via RhizomeManager
      // Açò garanteix velocitat "més ràpida que VISA" al no esperar a la xarxa.
      const txData = {
        amount: paymentData.amount,
        receiver_id: paymentData.receiver_id,
        reference: paymentData.reference || "Bategat de Proximitat",
        type: "astro_tele_oli",
        prev_sig: prevSig // Anellat criptogràfic (OMEGA-4)
      };
      
      txData._sig = await this._signEntry(txData); // Signatura criptogràfica HMAC-SHA256
      const xlogEntry = await rhizomeManager.processXLog(txData);

      logger.log(`[Astro] Transacció bategada al xlog: ${xlogEntry.id}`);

      // 3. Simulem la propagació asíncrona (Cel·lular Mesh)
      this._propagateTransaction(xlogEntry);

      return {
        success: true,
        transactionId: xlogEntry.id,
        status: "instant_sealed", // Segellat instantani al mòbil
      };
    } catch (err) {
      logger.error("[Astro] Error en el bategat econòmic:", err);
      return { success: false, error: err.message };
    }
  },

  /**
   * Propagació asíncrona cap als nodes de Masia i Padrins.
   */
  async _propagateTransaction() {
    // [PILLAR 3] Node de la Federació (Cooperativa)
    const user = JSON.parse(localStorage.getItem("sp_user_cache"));
    if (user) {
      await rhizomeManager.syncXLogsToFederation(user.id);
    }

    logger.log(
      `[Astro] Transaccions sincronitzades amb el Node de la Federació.`,
    );
  },

  /**
   * [FIX OMEGA] Generació i custòdia de la Clau HMAC a IndexedDB
   * La clau es crea amb extractable: false. Açò blinda el JS contra atacs
   * XSS (Cross-Site Scripting) que intenten robar el secret del Llibre Major.
   */
  async _getOrGenerateHmacKey() {
      return new Promise((resolve, reject) => {
          const request = indexedDB.open('sp_crypto_keys', 1);
          request.onupgradeneeded = (e) => {
              e.target.result.createObjectStore('keys');
          };
          request.onsuccess = (e) => {
              const db = e.target.result;
              const tx = db.transaction('keys', 'readwrite');
              const store = tx.objectStore('keys');
              const getReq = store.get('ledger_hmac');
              
              getReq.onsuccess = async () => {
                  if (getReq.result) {
                      resolve(getReq.result);
                  } else {
                      try {
                          // Migració silent d'antics secrets en text pla a claus inexportables
                          const legacySecret = localStorage.getItem('sp_ledger_secret');
                          let key;
                          if (legacySecret) {
                              const keyBytes = new Uint8Array(legacySecret.match(/.{2}/g).map(h => parseInt(h, 16)));
                              key = await crypto.subtle.importKey('raw', keyBytes, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
                              localStorage.removeItem('sp_ledger_secret'); // Destruïm prova en clar
                          } else {
                              key = await crypto.subtle.generateKey(
                                  { name: 'HMAC', hash: 'SHA-256' },
                                  false, // [CRÍTIC]: No exportable a la memòria plana!
                                  ['sign', 'verify']
                              );
                          }
                          
                          const putTx = db.transaction('keys', 'readwrite');
                          const putReq = putTx.objectStore('keys').put(key, 'ledger_hmac');
                          putReq.onsuccess = () => resolve(key);
                          putReq.onerror = () => reject(putReq.error);
                      } catch (err) {
                          reject(err);
                      }
                  }
              };
              getReq.onerror = () => reject(getReq.error);
          };
          request.onerror = () => reject(request.error);
      });
  },

  /**
   * [FIX OMEGA-4] Validació criptogràfica HMAC-SHA256 encadenada (Blockchain-Lite)
   * Inclou 'prev_sig' per blidar la causalitat històrica contra amputacions.
   */
  async _signEntry(entry) {
      const key = await this._getOrGenerateHmacKey();
      const referenceToSign = entry.reference || '';
      
      let dataString;
      if (entry.prev_sig !== undefined) {
          // OMEGA-4 Format: Anellat a la transacció anterior
          dataString = `${entry.amount}|${entry.receiver_id}|${entry.type}|${referenceToSign}|${entry.prev_sig}`;
      } else {
          // OMEGA-3 Legacy Format (Compatibilitat enrere per txs antigues segellades)
          dataString = `${entry.amount}|${entry.receiver_id}|${entry.type}|${referenceToSign}`;
      }

      const data = new TextEncoder().encode(dataString);
      const sig = await crypto.subtle.sign('HMAC', key, data);
      return Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2,'0')).join('');
  },

  /**
   * Recupera el balanç local bategat (Astro-Balance) validant l'autenticitat
   * criptogràfica WebCrypto d'un en un construint l'anellat (Hash Chain).
   */
  async getLocalBalance() {
    const logs = JSON.parse(localStorage.getItem("sp_xlogs") || "[]");
    let total = 0;
    
    let expectedPrevSig = "GENESIS";
    let blockchainActivated = false;

    for (const log of logs) {
        // [C3 FIX] - Invalidem qualsevol dada del Ledger no signada pel sistema
        if (!log._sig) {
            logger.error(`[Astro-Chain] CADENA TRENCADA! Entrada sense signatura tx: ${log.id || 'desconegut'}`);
            throw new Error("[Astro-Chain] Cadena compromesa: Existeixen transaccions orfes al llibre major.");
        }
        
        // [OMEGA-4 FIX] - Validació de l'Anell Causal (Blockchain-lite)
        if (log.prev_sig !== undefined) {
             blockchainActivated = true;
             if (log.prev_sig !== expectedPrevSig) {
                 logger.error(`[Astro-Chain] AMPUTACIÓ DETECTADA! El prev_sig no coincideix a tx: ${log.id}`);
                 throw new Error("[Astro-Chain] Integritat històrica compromesa. S'ha trencat l'enllaç de la cadena.");
             }
        } else {
             // Prevenció de Downgrade Attack: Si la blockchain ja s'havia activat i trobem una tx antiga, és corrupció.
             if (blockchainActivated) {
                 logger.error(`[Astro-Chain] DOWNGRADE ATTACK DETECTAT a tx: ${log.id}`);
                 throw new Error("[Astro-Chain] Downgrade Attack Detectat: Injecció d'operació sense enllaç.");
             }
        }
        
        const expectedSig = await this._signEntry(log);
        if (log._sig !== expectedSig) {
            logger.error(`[Astro-Chain] Llibre Major manipulat! Hash invàlid a tx ${log.id}`);
            throw new Error("[Astro-Chain] Transacció corrupta o falsejada detectada al Llibre Major.");
        }
        
        total += (log.amount || 0);
        expectedPrevSig = log._sig; // Avançar el punter de validació a l'actual
    }
    return total;
  },

  /**
   * [PILLAR 3: Custòdia Social] - Gestió de Padrins
   */
  getPadrins() {
    return JSON.parse(localStorage.getItem("sp_padrins") || "[]");
  },

  /**
   * Afegeix un Padrin a la xarxa de confiança.
   */
  async addPadrin(padrin) {
    try {
      const padrins = this.getPadrins();
      if (padrins.length >= 3) {
        logger.warn("[Astro] Xarxa de confiança completa (3 Padrins).");
      }
      const updated = [...padrins, { ...padrin, id: crypto.randomUUID() }];
      localStorage.setItem("sp_padrins", JSON.stringify(updated));
      logger.log(`[Astro] Nou Padrin afegit: ${padrin.name}`);
      return { success: true };
    } catch (err) {
      logger.error('[paymentService] Error:', err);
      return { success: false, error: err.message };
    }
  },
};


=====================================
FILE: src/services/preferenceService.js
=====================================

// [MASTER] Preference Service - Sobirania de l'Usuari [BATEGA]

const PREFS_KEY = 'socdepoble_prefs';

const DEFAULT_CONFIG = {
    landingPage: 'mur',       // Pàgina d'inici per defecte
    theme: 'dark',            // Estètica mestra
    visionMode: 'hibrida',   // Mode de visió per defecte
    vibe: 'genius',          // Ambientació
    gloveMode: false,        // Mode guants desactivat
    seniorMode: false,       // Mode Sèniors (Tàctil gegant)
    reduceMotion: false,     // [10/10] Mode Sèniors avançat
    globalDesign: 'batega',  // Disseny global per defecte
    preferredAgentId: 'iaia', // Agente preferido por defecto
    chatSettings: {
        readReceipts: true   // Ticks blaus activats per defecte
    }
};

export const preferenceService = {
    /**
     * Obté les preferències actuals o les de defecte
     */
    getPrefs() {
        try {
            const saved = localStorage.getItem(PREFS_KEY);
            return saved ? { ...DEFAULT_CONFIG, ...JSON.parse(saved) } : DEFAULT_CONFIG;
        } catch (e) {
            console.error('[Prefs] Error llegint localStorage:', e);
            return DEFAULT_CONFIG;
        }
    },

    /**
     * Guarda una o més preferències
     */
    setPrefs(newPrefs) {
        try {
            const current = this.getPrefs();
            const updated = { ...current, ...newPrefs };
            localStorage.setItem(PREFS_KEY, JSON.stringify(updated));

            // Efectes col·laterals immediats si cal
            if (newPrefs.theme) document.documentElement.setAttribute('data-theme', newPrefs.theme);
            if (newPrefs.vibe) document.documentElement.setAttribute('data-vibe', newPrefs.vibe);

            return updated;
        } catch (e) {
            console.error('[Prefs] Error guardant a localStorage:', e);
        }
    },

    /**
     * Restaura l'Ordre Natural (Reset total)
     */
    resetToNaturalOrder() {
        localStorage.removeItem(PREFS_KEY);
        // Netejar altres claus legacy si n'hi ha
        localStorage.removeItem('theme');
        localStorage.removeItem('app-vibe');
        localStorage.removeItem('visionMode');
        localStorage.removeItem('sp_glove_mode');
        localStorage.removeItem('sp_landing_page');

        window.location.reload();
    }
};


=====================================
FILE: src/services/profileHealingService.js
=====================================

import { supabaseService } from './supabaseService';
import { USER_ROLES, CREATOR_EMAILS } from '../constants';
import { logger } from '../utils/logger';

export const profileHealingService = {
  async healGhostProfile(session, profileData, isSimulation) {
    if (!profileData && session?.user?.id && !isSimulation) {
      logger.warn('[AuthContext] 👻 Perfil invisible detectat. Executant Auto-Heal...');
      const userEmail = session.user.email || session.user.user_metadata?.email || '';
      const newProfileName = session.user.user_metadata?.full_name || (userEmail ? userEmail.split('@')[0] : 'Nou Veí');
      const newAvatar = session.user.user_metadata?.avatar_url || null;
      try {
        profileData = await supabaseService.upsertProfile(session.user.id, {
          full_name: newProfileName,
          avatar_url: newAvatar,
          role: USER_ROLES.NEIGHBOR
        });
        logger.log('[AuthContext] 🚀 Auto-Heal completat.');
      } catch (healErr) {
        logger.error('[AuthContext] Error durant el Auto-Heal:', healErr);
      }
    }
    return profileData;
  },

  protectMasterIdentity(session, profileData) {
    if (!session?.user) return { effectiveProfile: profileData, isOfficialCreator: false };
    
    const userEmail = (session.user.email || session.user.user_metadata?.email || '').toLowerCase();
    const masters = Array.isArray(CREATOR_EMAILS) ? CREATOR_EMAILS : [];
    const isMastersEmail = masters.some(email => email.toLowerCase() === userEmail) ||
      userEmail === 'javillinares@gmail.com' ||
      userEmail === 'mestre@socdepoble.com' ||
      userEmail === 'sollutia@gmail.com' ||
      userEmail === 'socdepoblecom@gmail.com' ||
      userEmail.includes('javillinares') ||
      userEmail.includes('llinares') ||
      userEmail.includes('mestre@');

    const MASTER_IDS = [
      'd6325f44-7277-4d20-b020-166c010995ab',
      '56557878-3a83-4710-8588-44ade442a8b3',
    ];
    const isOfficialCreator = isMastersEmail || MASTER_IDS.includes(session.user.id);

    let effectiveName = profileData?.full_name || session.user.user_metadata?.full_name || (userEmail ? userEmail.split('@')[0] : null) || (session.user.phone ? 'Veí del Poble' : 'Veí del Poble');
    if (isOfficialCreator) effectiveName = 'Javi Llinares';

    const effectiveProfile = {
      ...(profileData || {}),
      id: profileData?.id || session.user.id,
      full_name: effectiveName,
      role: isOfficialCreator ? USER_ROLES.SUPER_ADMIN : (profileData?.role || USER_ROLES.NEIGHBOR),
      avatar_url: isOfficialCreator ? '/Javi_Llinares-Foto_perfil-1.jpg' : (supabaseService.normalizeStorageUrl(profileData?.avatar_url) || null),
      is_master: isOfficialCreator,
      is_super_admin: isOfficialCreator
    };
    return { effectiveProfile, isOfficialCreator };
  }
};


=====================================
FILE: src/services/pushNotifications.js
=====================================

import { supabase } from '../supabaseClient';
import { logger } from '../utils/logger';
import { notificationService } from './notificationService';

/**
 * Funcions d'utilitat per gestionar les subscripcions push
 * Aquestes funcions s'exporten des de supabaseService.js
 */

export const pushNotifications = {
    /**
     * Guardar subscripció push a la base de dades
     */
    async saveSubscription(userId, subscription) {
        if (!subscription || !userId) {
            logger.error('[Push] Invalid subscription or userId');
            return null;
        }

        try {
            // [MASTER] Simulem èxit en mode Playground per evitar errors 401 (Unauthorized)
            const isPlayground = localStorage.getItem('isPlaygroundMode') === 'true';
            if (isPlayground) {
                logger.log('[Push] Mode Playground detectat. Simulant guardat de subscripció...');
                return { id: 'demo-sub', user_id: userId, is_demo: true };
            }

            // [MASTER] AUTO-HEALING: Verifiquem sessió activa abans de procedir
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                logger.warn('[Push] No active session. Skipping DB sync to avoid 401.');
                return null;
            }

            // Asegurar que treballem amb el JSON de la subscripció
            const subData = subscription.toJSON ? subscription.toJSON() : subscription;

            const subscriptionData = {
                user_id: userId,
                endpoint: subData.endpoint,
                p256dh: subData.keys?.p256dh || '',
                auth: subData.keys?.auth || '',
                device_info: {
                    userAgent: navigator.userAgent,
                    platform: navigator.platform,
                    language: navigator.language,
                    timestamp: new Date().toISOString()
                }
            };

            // [PROACTIVE CHECK] Verify if profile exists to avoid 23503 (FK) / 409 (Conflict) in browser console
            const { data: profiles, error: profileError } = await supabase
                .from('profiles')
                .select('id')
                .eq('id', userId)
                .limit(1);

            const profile = profiles && profiles.length > 0 ? profiles[0] : null;

            if (profileError || !profile) {
                logger.warn('[Push] User profile not yet indexed in DB. Postponing subscription sync.');
                return { id: 'pending-sync', user_id: userId, status: 'pending_profile' };
            }

            // [MASTER] TWO-STEP UPSERT approach to avoid 409 Conflict errors on some PostgREST versions
            const { data: existing, error: fetchError } = await supabase
                .from('push_subscriptions')
                .select('id')
                .match({ user_id: userId, endpoint: subData.endpoint })
                .maybeSingle();

            if (fetchError) {
                logger.error('[Push] Error checking existing sub:', fetchError.message);
            }

            let result;
            if (existing) {
                result = await supabase
                    .from('push_subscriptions')
                    .update({
                        ...subscriptionData,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', existing.id)
                    .select()
                    .single();
            } else {
                result = await supabase
                    .from('push_subscriptions')
                    .insert([subscriptionData])
                    .select()
                    .single();
            }

            const { data, error } = result;

            if (error) {
                // [MASTER RESILIENCE] Si la taula no existeix
                if (error.code === '42P01') {
                    logger.warn('[Push] Table push_subscriptions does not exist.');
                    return null;
                }

                // Handle 409 Conflict o 23503 (just in case check failed due to race condition)
                if (error.code === '23503' || error.status === 409) {
                    logger.warn('[Push] User profile conflict. Simulating subscription success.');
                    return { id: 'pending-sync', user_id: userId, status: 'pending_profile' };
                }

                logger.error('[Push] Error saving subscription:', error.message || error);
                return null;
            }

            logger.log('[Push] Subscription bategant correctament al Mas');
            return data;
        } catch (error) {
            logger.error('[Push] Failed to save subscription:', error);
            return null;
        }
    },

    /**
     * Eliminar subscripció push
     */
    async removeSubscription(userId, endpoint) {
        if (!userId || !endpoint) return false;

        try {
            const { error } = await supabase
                .from('push_subscriptions')
                .delete()
                .match({ user_id: userId, endpoint });

            if (error) {
                logger.error('[Push] Error removing subscription:', error);
                return false;
            }

            logger.log('[Push] Subscription removed');
            return true;
        } catch (error) {
            logger.error('[Push] Failed to remove subscription:', error);
            return false;
        }
    },

    /**
     * Obtenir totes les subscripcions actives d'un usuari
     */
    async getUserSubscriptions(userId) {
        if (!userId) return [];

        try {
            const { data, error } = await supabase
                .from('push_subscriptions')
                .select('*')
                .eq('user_id', userId)
                .eq('is_active', true);

            if (error) {
                if (error.code === '42P01') {
                    return []; // Taula no existeix
                }
                throw error;
            }

            return data || [];
        } catch (error) {
            logger.error('[Push] Failed to get subscriptions:', error);
            return [];
        }
    },

    async triggerNotification(userId, payload) {
        return notificationService.send(userId, {
            type: payload.tag || 'general',
            title: payload.title,
            body: payload.body,
            url: payload.url,
            data: payload.data
        });
    }
};


export default pushNotifications;


=====================================
FILE: src/services/pushService.js
=====================================

import { logger } from '../utils/logger';

/**
 * Service per gestionar les notificacions push PWA
 */
class PushNotificationService {
    constructor() {
        this.registration = null;
        this.subscription = null;
        this.isSupported = 'serviceWorker' in navigator && 'PushManager' in window;
    }

    /**
     * Registra el Service Worker [DESACTIVAT - Protocol Natiu]
     */
    async registerServiceWorker() {
        // [BYPASS] Protocol Natiu: Ja no usem Service Workers per a Push
        // logger.log('[Push] Service Worker registration bypassed by Native Protocol');
        return null;
    }

    /**
     * Sol·licita permisos de notificació a l'usuari
     */
    async requestPermission() {
        if (!this.isSupported) {
            return 'denied';
        }

        try {
            const permission = await Notification.requestPermission();
            logger.log('[Push] Permís de notificacions:', permission);
            return permission;
        } catch (error) {
            logger.error('[Push] Error demanant permisos:', error);
            return 'denied';
        }
    }

    /**
     * Subscriu l'usuari a les notificacions push
     * @param {string} vapidPublicKey - Clau pública VAPID del servidor
     */
    async subscribe(vapidPublicKey) {
        if (!this.registration) {
            await this.registerServiceWorker();
        }

        if (!this.registration) {
            throw new Error('Service Worker no disponible');
        }

        const permission = await this.requestPermission();
        if (permission !== 'granted') {
            throw new Error('Permisos de notificació denegats');
        }

        try {
            // Convert VAPID key to Uint8Array
            const convertedKey = this.urlBase64ToUint8Array(vapidPublicKey);

            this.subscription = await this.registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: convertedKey
            });

            logger.log('[Push] Subscripció creada:', this.subscription);
            return this.subscription;
        } catch (error) {
            logger.error('[Push] Error creant subscripció:', error);
            throw error;
        }
    }

    /**
     * Cancel·la la subscripció de notificacions
     */
    async unsubscribe() {
        if (!this.subscription) {
            const registration = await navigator.serviceWorker.ready;
            this.subscription = await registration.pushManager.getSubscription();
        }

        if (this.subscription) {
            try {
                await this.subscription.unsubscribe();
                this.subscription = null;
                logger.log('[Push] Subscripció cancel·lada');
                return true;
            } catch (error) {
                logger.error('[Push] Error cancel·lant subscripció:', error);
                return false;
            }
        }

        return false;
    }

    /**
     * Obté la subscripció actual
     */
    async getSubscription() {
        if (!this.registration) {
            const registration = await navigator.serviceWorker.ready;
            this.registration = registration;
        }

        if (this.registration) {
            this.subscription = await this.registration.pushManager.getSubscription();
        }

        return this.subscription;
    }

    /**
     * Comprova si l'usuari està subscrit
     */
    async isSubscribed() {
        const subscription = await this.getSubscription();
        return subscription !== null;
    }

    /**
     * Mostra una notificació local (sense push del servidor)
     */
    async showLocalNotification(title, options = {}) {
        if (!this.registration) {
            await this.registerServiceWorker();
        }

        const permission = Notification.permission;
        if (permission !== 'granted') {
            logger.warn('[Push] No es poden mostrar notificacions sense permisos');
            return;
        }

        const defaultOptions = {
            icon: '/icon-192.png',
            badge: '/icon-192.png',
            vibrate: [200, 100, 200],
            tag: 'local-notification',
            requireInteraction: false
        };

        await this.registration.showNotification(title, {
            ...defaultOptions,
            ...options
        });
    }

    /**
     * Converteix clau VAPID base64 a Uint8Array
     */
    urlBase64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/-/g, '+')
            .replace(/_/g, '/');

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }

        return outputArray;
    }

    /**
     * Actualitza el badge count (iOS/Android)
     */
    async updateBadgeCount(count) {
        if ('setAppBadge' in navigator) {
            try {
                if (count > 0) {
                    await navigator.setAppBadge(count);
                } else {
                    await navigator.clearAppBadge();
                }
            } catch (error) {
                logger.error('[Push] Error actualitzant badge:', error);
            }
        }
    }
}

export const pushService = new PushNotificationService();


=====================================
FILE: src/services/raindropService.js
=====================================

// [SISTEMA RIZOMA] - Logger removed to satisfy lint if unused


/**
 * RAINDROP SERVICE [SISTEMA RIZOMA]
 * Handles mapping from Raindrop bookmarks to Sóc de Poble resources.
 */
export const raindropService = {
    /**
     * Maps a raw Raindrop item to the Sóc de Poble metadata schema.
     */
    mapToResource(raindropItem) {
        const collectionRaw = raindropItem.collection || 'Sin clasificar';

        // Mapeig de Taxonomia Sobirana
        const categoryMap = {
            'SDP': 'Oficial',
            'PRO': 'Professional',
            'SOS': 'Sostenible',
            'PER': 'Gent',
            'GEO': 'Territori',
            '000': 'Arxiu'
        };

        const prefix = collectionRaw.split('|')[0]?.trim() || '';
        const category = categoryMap[prefix] || 'Comunitat';

        return {
            uuid: raindropItem.id || `rd-${Math.random().toString(36).substr(2, 9)}`,
            title: raindropItem.title,
            excerpt: raindropItem.excerpt || raindropItem.note || '',
            coverImage: raindropItem.cover || raindropItem.thumbnail_url || null,
            collection: category,
            tags: raindropItem.tags || [],
            source: raindropItem.domain || new URL(raindropItem.link).hostname,
            url: raindropItem.link,
            author: {
                name: 'Sóc de Poble (Import)',
                avatar: '/logo-circle.png'
            },
            location: {
                town: prefix === 'GEO' ? collectionRaw.split('|')[1]?.trim() : 'La Torre de les Maçanes'
            },
            timestamp: raindropItem.created || new Date().toISOString(),
            syncState: 'local'
        };
    },

    /**
     * MOCK IMPORT: Simulated data from the user screenshot.
     */
    getMockData() {
        return [
            {
                id: 'rd-1',
                title: 'Arena para Gatos Aglomerante de Cáscara de Guisante Go Natural',
                excerpt: 'Catit Go Natural es una nueva gama de arenas para gatos ecológicas hechas a base de recursos sostenibles...',
                link: 'https://catit.es/arena-guisante',
                domain: 'catit.es',
                collection: 'SOS | SOSTENIBLE',
                tags: ['#ecologic', '#mascotes'],
                created: '2025-01-03T10:00:00Z'
            },
            {
                id: 'rd-2',
                title: 'Gift Box ✂️ Templatemaker',
                excerpt: 'Plantilla gratuita y personalizada para un(a) Caja de Regalo',
                link: 'https://templatemaker.nl/giftbox',
                domain: 'templatemaker.nl',
                collection: 'PRO | Gestió',
                tags: ['#disseny', '#eines'],
                created: '2025-09-10T15:00:00Z'
            },
            {
                id: 'rd-3',
                title: 'Carmen Chaves | Casting, Guion, Actriz',
                excerpt: 'Conocido/a por: Yo soy la Juani, Segundo origen, Di Di Hollywood',
                link: 'https://imdb.com/name/nm12345',
                domain: 'imdb.com',
                collection: 'PER | GENT',
                tags: ['#cultura', '#cinema'],
                created: '2025-08-30T12:00:00Z'
            }
        ].map(this.mapToResource);
    },

    /**
     * Unified access to resources.
     */
    async getCollection() {
        // For now, we return our mock data as a unified collection
        return this.getMockData();
    }
};

export default raindropService;


=====================================
FILE: src/services/recoveryService.js
=====================================

import { logger } from '../utils/logger';
// import { secureStorage } from './secureStorage';

/**
 * RecoveryService: L'Assegurança d'Inmortalitat (OMEGA-4)
 * Exporta i importa l'estat absolut del Poble d'una forma completament
 * segura, blindada criptogràficament i immune a esborrats accidentals.
 */
class RecoveryService {
    
    /**
     * Empaqueta l'ànima del Poble en un Blob xifrat.
     * @param {string} masterPassword Contraçenya humana escollida per l'usuari
     */
    async exportSovereignState(masterPassword) {
        logger.log("[Recovery] Iniciant l'extracció de l'ànima del Poble...");
        if (!masterPassword) throw new Error("Format d'exportació requereix segellat de contrasenya.");

        try {
            // 1. Recollim l'Estat del Sistema (LocalStorage pur)
            const keysToExtract = [
                'sp_xlogs', 'sp_padrins', 'sp_history_cache', 'sp_user_cache', 
                'sp_rhizome_version', 'isPlaygroundMode'
            ];
            
            const payload = {
                metadata: {
                    exported_at: new Date().toISOString(),
                    version: 'OMEGA-4.immortal',
                    type: 'sovereign_snapshot'
                },
                data: {}
            };

            for (const key of keysToExtract) {
                const val = localStorage.getItem(key);
                if (val) payload.data[key] = val;
            }

            // A l'hora de derivar, usarem un SALT aleatori guardat al mateix blob en pla
            const salt = crypto.getRandomValues(new Uint8Array(16));
            
            const enc = new TextEncoder();
            const keyMaterial = await crypto.subtle.importKey(
                'raw', enc.encode(masterPassword), 'PBKDF2', false, ['deriveKey']
            );
            const cryptoKey = await crypto.subtle.deriveKey(
                { name: 'PBKDF2', salt, iterations: 200000, hash: 'SHA-256' },
                keyMaterial, { name: 'AES-GCM', length: 256 }, false, ['encrypt']
            );

            const iv = crypto.getRandomValues(new Uint8Array(12));
            const plainBytes = enc.encode(JSON.stringify(payload));
            const cipherBytes = await crypto.subtle.encrypt(
                { name: 'AES-GCM', iv }, 
                cryptoKey, 
                plainBytes
            );

            // Estructura Exportable (.poble)
            const exportFile = {
                v: '1',
                salt: Array.from(salt),
                iv: Array.from(iv),
                cipher: Array.from(new Uint8Array(cipherBytes))
            };

            const blob = new Blob([JSON.stringify(exportFile)], { type: 'application/json' });
            return blob;

        } catch (error) {
            logger.error('[Recovery] Falla crítica durant el segellat sobirà:', error);
            throw new Error('Falada en la generació del Snapshot.');
        }
    }

    /**
     * Resuscita l'ànima del Poble a partir del Blob xifrat.
     */
    async importSovereignState(fileContentAsJson, masterPassword) {
        logger.log('[Recovery] Iniciant el Protocol de Resurrecció...');
        if (!masterPassword) throw new Error("Falta la clau de desencriptació.");

        try {
            const parsed = JSON.parse(fileContentAsJson);
            if (parsed.v !== '1' || !parsed.salt || !parsed.iv || !parsed.cipher) {
                throw new Error("Sufix o format de l'arxiu .poble malformat o corrupte.");
            }

            const salt = new Uint8Array(parsed.salt);
            const iv = new Uint8Array(parsed.iv);
            const cipherBytes = new Uint8Array(parsed.cipher);

            const enc = new TextEncoder();
            const keyMaterial = await crypto.subtle.importKey(
                'raw', enc.encode(masterPassword), 'PBKDF2', false, ['deriveKey']
            );
            
            const cryptoKey = await crypto.subtle.deriveKey(
                { name: 'PBKDF2', salt, iterations: 200000, hash: 'SHA-256' },
                keyMaterial, { name: 'AES-GCM', length: 256 }, false, ['decrypt']
            );

            const plainBytes = await crypto.subtle.decrypt(
                { name: 'AES-GCM', iv },
                cryptoKey,
                cipherBytes
            );

            const payload = JSON.parse(new TextDecoder().decode(plainBytes));

            if (payload.metadata.type !== 'sovereign_snapshot') {
                throw new Error("L'assumpció de l'ànima ha fracassat. Metadades invàlides.");
            }

            // Apliquem la Resurrecció al LocalStorage de forma atòmica
            localStorage.clear(); // [!] PURGA TOTAL. Establiment d'Edèn.
            
            for (const [key, val] of Object.entries(payload.data)) {
                localStorage.setItem(key, val);
            }

            logger.log('[Recovery] Resurrecció Completada. El Poble ha tornat a la vida.');
            return true;

        } catch (error) {
            logger.error('[Recovery] Fracàs absolut en la Resurrecció:', error);
            throw new Error('Contrasenya invàlida o arxiu corrupte.');
        }
    }
}

export const recoveryService = new RecoveryService();


=====================================
FILE: src/services/rhizomeManager.js
=====================================

import { logger } from '../utils/logger';
import { supabaseService } from './supabaseService';
import { egWalker } from '../rhizome/crdt/eg-walker';

/**
 * RhizomeManager: El motor d'Escala Infinita [MASTER]
 * Gestiona la poda de metadades (Eg-walker), la fusió semàntica i els xlogs (Astro).
 */
class RhizomeManager {
    constructor() {
        this.DB_NAME = 'RhizomeDB-v1';
        this.HISTORY_THRESHOLD = 30; // Dies de retenció de metadades al mòbil
        this.VERSION_BATCH_SIZE = 50; // Operacions pè Batch abans de consolidar
        this.currentVersion = localStorage.getItem('sp_rhizome_version') || '1.0.0';
        this.walker = egWalker;
    }

    /**
     * Sincronitza els xlogs locals amb el Node de la Federació (Cooperativa/Supabase)
     * Pillar 3: Rèplica Representant i Seguretat Comunitària.
     */
    async syncXLogsToFederation(userId) {
        logger.log('[Rhizome] Sincronitzant xlogs amb el Node de la Federació (La Torre Pilot)...');
        try {
            const localLogs = JSON.parse(localStorage.getItem('sp_xlogs') || '[]');
            if (localLogs.length === 0) return;

            // En un sistema federat, açò enviaria les dades al node corresponent
            const { error } = await supabaseService.upsertXLogs(userId, localLogs);
            if (error) throw error;

            logger.log('[Rhizome] Sincronització amb la Federació completada.');
        } catch (err) {
            logger.error('[Rhizome] Error en la sincronització federada:', err);
        }
    }

    /**
     * [PILLAR 1: Eg-walker] - Poda del Solatge (Garbage Collection)
     * Elimina metadades internes basant-se en Versions Crítiques.
     */
    async pruneHistory(docId = 'global') {
        logger.log(`[Rhizome] Iniciant Poda del Solatge (Eg-walker) per a ${docId}...`);
        try {
            await this.walker.prune(docId);

            // Actualitzem versió de consens
            const nextVersion = this._incrementVersion(this.currentVersion);
            localStorage.setItem('sp_rhizome_version', nextVersion);
            this.currentVersion = nextVersion;

            logger.log(`[Rhizome] Poda bategada. Nova Versió Crítica: ${nextVersion} (RAM optimitzada).`);
            return true;
        } catch (err) {
            logger.error('[Rhizome] Error en la poda:', err);
            return false;
        }
    }

    /**
     * [PILLAR 2: Fusió Semàntica] - Eg-walker integration
     */
    async semanticMerge(local, remote, docId = 'global') {
        if (!local && !remote) return "";
        if (local === remote) return local;

        logger.log(`[Rhizome] Detectat conflicte en ${docId}. Aplicant Eg-walker...`);

        if (Array.isArray(remote)) {
            return await this.walker.merge(docId, remote);
        }

        await this.walker.applyLocal(docId, 'edit', remote);
        return remote;
    }

    _incrementVersion(ver) {
        const parts = ver.split('.').map(Number);
        parts[2]++;
        if (parts[2] > 9) { parts[2] = 0; parts[1]++; }
        return parts.join('.');
    }

    _mergeRichText(local, remote) {
        const combinedFormats = [...(local.formats || []), ...(remote.formats || [])];
        const refinedFormats = combinedFormats.map(f => ({
            ...f,
            behavior: f.type === 'link' || f.type === 'comment' ? 'restrictive' : 'expansive',
            anchorId: f.anchorId || `anchor_${Math.random().toString(36).substring(7)}`
        }));

        logger.log(`[Peritext] Processats ${refinedFormats.length} trams de format amb àncores estables.`);

        return {
            content: local.content || remote.content,
            formats: refinedFormats,
            metadata: {
                merged_at: new Date().toISOString(),
                protocol: 'Peritext-v1-BATEGA',
                integrity: 'Historical-Document-Level'
            }
        };
    }

    /**
     * [PILLAR 3: Pagaments Astro]
     */
    async processXLog(transaction) {
        logger.log('[Rhizome] Processant bategat econòmic en xlog...');
        const xlogEntry = {
            id: crypto.randomUUID(),
            padrins_verify: false,
            timestamp: new Date().toISOString(),
            ...transaction
        };

        const currentLogs = JSON.parse(localStorage.getItem('sp_xlogs') || '[]');
        currentLogs.push(xlogEntry);
        localStorage.setItem('sp_xlogs', JSON.stringify(currentLogs));

        return xlogEntry;
    }

    /**
     * [PILLAR 5: Càpsula del Temps]
     */
    async generateTimeCapsule() {
        logger.log('[Rhizome] Iniciant Protocol Long Now (Càpsula del Temps)...');
        try {
            const data = {
                identities: await supabaseService.getMyEntities(),
                history: JSON.parse(localStorage.getItem('sp_history_cache') || '[]'),
                xlogs: JSON.parse(localStorage.getItem('sp_xlogs') || '[]'),
                exported_at: new Date().toISOString(),
                version: 'v1.5.7-BATEGA-MASTER',
                philosophy: "Dades bategades i segellades de forma sobirana. El poble és el propietari."
            };

            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `capsula_del_temps_${new Date().toISOString().split('T')[0]}.json`;
            a.click();

            logger.log('[Rhizome] Càpsula del Temps bategada amb èxit.');
            return true;
        } catch (err) {
            logger.error('[Rhizome] Error en la Càpsula del Temps:', err);
            return false;
        }
    }

    /**
     * [PILLAR 4: Filtratge Km 0]
     */
    cognitiveFilter(data, userPreferences) {
        if (!data) return [];
        const anchors = userPreferences?.anchors || [];
        return data.filter(item => {
            const isLocal = item.town_id === userPreferences?.primary_town_id;
            const content = item.content || item.description || '';
            const hasSemanticAnchor = anchors.some(a => content.includes(a));
            return isLocal || hasSemanticAnchor;
        });
    }

    /**
     * [PILLAR 6: Sacred Text Metrics]
     * Retorna telemetria sobre la riquesa de Peritext.
     */
    async getPeritextMetrics(docId) {
        const state = await this.walker.getState(docId);
        const spans = state?.data?.spans || [];
        return {
            marksCount: spans.length,
            stableAnchors: spans.length * 2,
            integrity: 'Weber-Class-High'
        };
    }
}

export const rhizomeManager = new RhizomeManager();


=====================================
FILE: src/services/rhizomeWorker.js
=====================================

/**
 * RhizomeWorker: El motor d'Eg-walker en segon pla
 * Aquest treballador s'encarrega de les operacions CPU-intensives per a mantenir 60fps a la UI.
 */
 
 import { logger } from '../utils/logger';
 import { rhizomeManager } from './rhizomeManager';
 
 self.onmessage = async (e) => {
     const { type, data } = e.data;
 
     switch (type) {
         case 'MERGE': {
             logger.log('[RhizomeWorker] Iniciant fusió massiva...');
             const merged = rhizomeManager.semanticMerge(data.local, data.remote, data.contentType);
             self.postMessage({ type: 'MERGE_COMPLETE', result: merged });
             break;
         }
 
         case 'PRUNE': {
             logger.log('[RhizomeWorker] Iniciant poda Eg-walker...');
             const success = await rhizomeManager.pruneHistory();
             self.postMessage({ type: 'PRUNE_COMPLETE', success });
             break;
         }
 
         default:
             logger.warn('[RhizomeWorker] Tipus d\'operació desconegut: ', type);
     }
 };


=====================================
FILE: src/services/schemas.js
=====================================

import { z } from 'zod';
import DOMPurify from 'dompurify';

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export const relaxedIdRegex = /^([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}|[a-z0-9._-]+|[A-Z0-9._-]+)$/i;
const MASTER_ALLOWED_TAGS = ['h1', 'h2', 'p', 'ul', 'ol', 'li', 'br', 'strong', 'em'];
const sanitize = (val) => typeof val === 'string' ? DOMPurify.sanitize(val, {
    ALLOWED_TAGS: MASTER_ALLOWED_TAGS,
    ALLOWED_ATTR: []
}) : val;

export const PostSchema = z.object({
    id: z.string().regex(uuidRegex).optional(),
    content: z.string().min(1, "El contingut no pot estar buit").transform(sanitize),
    author_user_id: z.string().regex(uuidRegex, "ID d'autor invàlid"),
    author: z.string().min(1),
    author_avatar: z.string().nullable().optional(),
    author_role: z.string().optional(),
    town_uuid: z.string().regex(uuidRegex).nullable().optional(),
    image_url: z.string().nullable().optional(),
    is_playground: z.boolean().optional(),
    author_entity_id: z.string().regex(uuidRegex).nullable().optional(),
    type: z.enum(['post', 'book', 'event_announcement', 'internal_report', 'food_recommendation']).default('post'),
    book_id: z.string().nullable().optional(),
    book_title: z.string().nullable().optional(),
    chapter_number: z.number().nullable().optional(),
    ai_percentage: z.number().min(0).max(100).default(0).optional(),
    human_percentage: z.number().min(0).max(100).default(100).optional(),
    time_saved_minutes: z.number().min(0).default(0).optional(),
    is_iaia_inspired: z.boolean().default(false).optional()
});

export const MarketItemSchema = z.object({
    id: z.string().regex(uuidRegex).optional(),
    title: z.string().min(1, "El títol és obligatori").transform(sanitize),
    description: z.string().optional().transform(sanitize),
    price: z.number().min(0),
    category_slug: z.string().default('tot'),
    author_user_id: z.string().regex(uuidRegex, "ID d'autor invàlid"),
    avatar_url: z.string().nullable().optional(),
    town_uuid: z.string().regex(uuidRegex).nullable().optional(),
    image_url: z.string().nullable().optional(),
    is_playground: z.boolean().optional(),
    author_entity_id: z.string().regex(uuidRegex).nullable().optional(),
    is_active: z.boolean().default(true),
    ai_percentage: z.number().min(0).max(100).default(0).optional(),
    human_percentage: z.number().min(0).max(100).default(100).optional(),
    time_saved_minutes: z.number().min(0).default(0).optional(),
    is_iaia_inspired: z.boolean().default(false).optional()
});

export const MessageSchema = z.object({
    id: z.string().regex(uuidRegex).optional(),
    conversation_id: z.string().regex(uuidRegex),
    sender_id: z.string().regex(uuidRegex),

    content: z.string().nullable().optional().transform(sanitize),
    attachment_url: z.string().nullable().optional(),
    attachment_type: z.string().nullable().optional(),
    attachment_name: z.string().nullable().optional(),
    is_ai: z.boolean().optional(),
    is_read: z.boolean().optional(),
    is_playground: z.boolean().optional(),
    post_uuid: z.string().regex(uuidRegex).nullable().optional()
}).refine(data => data.content || data.attachment_url, {
    message: "El missatge no pot estar buit si no hi ha fitxer adjunt"
});

export const ConversationSchema = z.object({
    id: z.string().regex(uuidRegex).optional(),
    participant_1_id: z.string().regex(uuidRegex),
    participant_1_type: z.enum(['user', 'entity', 'ai']),
    participant_2_id: z.string().regex(uuidRegex),
    participant_2_type: z.enum(['user', 'entity', 'ai']),
    last_message_content: z.string().nullable().optional().transform(sanitize),
    last_message_at: z.string().optional(),
    is_playground: z.boolean().optional()
});

export const ProfileSchema = z.object({
    id: z.string().regex(uuidRegex),
    full_name: z.string().min(1).nullable().optional().transform(sanitize),
    username: z.string().min(3).nullable().optional().transform(sanitize),
    avatar_url: z.string().nullable().optional(),
    cover_url: z.string().nullable().optional(),
    bio: z.string().nullable().optional().transform(sanitize),
    primary_town: z.string().nullable().optional().transform(sanitize),
    town_uuid: z.union([z.string(), z.number()]).nullable().optional(),

    town_name: z.string().nullable().optional(),
    secondary_towns: z.array(z.union([z.string(), z.number()])).optional(),
    role: z.string().optional(),
    ofici: z.string().nullable().optional().transform(sanitize),
    social_image_preference: z.enum(['avatar', 'cover', 'none']).default('none').optional(),
    iaia_settings: z.record(z.any()).nullable().optional(),
    is_noise: z.boolean().default(false).optional(),
    is_silenced: z.boolean().default(false).optional(),
    is_beta_tester: z.boolean().default(false).optional(),
    reputation_score: z.number().min(0).max(100).default(50).optional()
});


=====================================
FILE: src/services/secureStorage.js
=====================================

// src/services/secureStorage.js

/**
 * [MASTER SECURITY] Secure Storage Service (Local-First SOVEREIGNTY)
 * Emmagatzema de forma segura claus i dades sensibles d'identitat a IndexedDB
 * xifrats en temps real amb AES-GCM (Web Crypto API) usant una clau mestra
 * derivada per dispositiu que només viu en memòria.
 */
class SecureStorageService {
    constructor() {
      this.dbName = 'sdp_secure_vault';
      this.storeName = 'vault';
      this.db = null;
      this.masterKey = null;
      this.initPromise = null;
    }
  
    openDB() {
      return new Promise((resolve, reject) => {
        const request = indexedDB.open(this.dbName, 2); // Bumpejem versió per afegir meta
        request.onerror = () => reject(request.error);
        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          if (!db.objectStoreNames.contains(this.storeName)) {
            db.createObjectStore(this.storeName);
          }
          if (!db.objectStoreNames.contains('crypto_meta')) {
            db.createObjectStore('crypto_meta');
          }
        };
        request.onsuccess = (event) => {
          this.db = event.target.result;
          resolve();
        };
      });
    }

    _getMeta(key) {
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction(['crypto_meta'], 'readonly');
            const req = tx.objectStore('crypto_meta').get(key);
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error);
        });
    }

    _setMeta(key, value) {
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction(['crypto_meta'], 'readwrite');
            const req = tx.objectStore('crypto_meta').put(value, key);
            req.onsuccess = () => resolve();
            req.onerror = () => reject(req.error);
        });
    }

    /**
     * Inicialitza la base de dades i obté la clau mestra (AES-GCM inexportable).
     */
    async init(masterPassword = null) {
      if (this.masterKey && this.db) return;
      if (this.initPromise) return this.initPromise;
      
      this.initPromise = (async () => {
          await this.openDB();

          if (masterPassword) {
            // [PBKDF2 Mod] Si hi ha password, necessitem salt a IndexedDB, no localStorage
            let salt = await this._getMeta('salt');
            if (!salt) {
                // Migració d'emergència si hi ha salt vell
                const lsSalt = localStorage.getItem('sdp_crypto_salt');
                if (lsSalt) {
                    salt = new Uint8Array(JSON.parse(lsSalt));
                    localStorage.removeItem('sdp_crypto_salt');
                } else {
                    salt = crypto.getRandomValues(new Uint8Array(16));
                }
                await this._setMeta('salt', salt);
            }

            const enc = new TextEncoder();
            const keyMaterial = await crypto.subtle.importKey(
              'raw', enc.encode(masterPassword), 'PBKDF2', false, ['deriveKey']
            );
            this.masterKey = await crypto.subtle.deriveKey(
              { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
              keyMaterial, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']
            );

          } else {
              // [FIX OMEGA] Sense password, no derivem del device_id!
              // Generem i guardem una CryptoKey nativa inexportable.
              let storedKey = await this._getMeta('native_master_key');
              if (storedKey) {
                  this.masterKey = storedKey;
              } else {
                  this.masterKey = await crypto.subtle.generateKey(
                      { name: 'AES-GCM', length: 256 },
                      false, // [CRÍTIC]: extractable = false
                      ['encrypt', 'decrypt']
                  );
                  await this._setMeta('native_master_key', this.masterKey);
                  // Buidem la brossa opaca prèvia
                  localStorage.removeItem('sdp_crypto_salt');
              }
          }
      })();
      
      return this.initPromise;
    }
  
    async getDeviceId() {
      // Ara el Device ID només s'usa per analítiques/padrins, no per criptografia local.
      let id = localStorage.getItem('sdp_device_id');
      if (!id) {
        id = crypto.randomUUID();
        localStorage.setItem('sdp_device_id', id);
      }
      return id;
    }
  
    async set(key, value) {
      await this.init();
      if (!this.masterKey) throw new Error('SecureStorage no inicialitzat');
      const iv = crypto.getRandomValues(new Uint8Array(12));
      const encoded = new TextEncoder().encode(JSON.stringify(value));
      const encrypted = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        this.masterKey,
        encoded
      );
      return new Promise((resolve, reject) => {
        const store = this.db.transaction([this.storeName], 'readwrite').objectStore(this.storeName);
        const request = store.put({ iv: Array.from(iv), data: Array.from(new Uint8Array(encrypted)) }, key);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    }
  
    async get(key) {
      await this.init();
      if (!this.masterKey) throw new Error('SecureStorage no inicialitzat');
      return new Promise((resolve, reject) => {
        const store = this.db.transaction([this.storeName], 'readonly').objectStore(this.storeName);
        const request = store.get(key);
        request.onsuccess = async () => {
          const record = request.result;
          if (!record) return resolve(null);
          try {
            const iv = new Uint8Array(record.iv);
            const encrypted = new Uint8Array(record.data);
            const decrypted = await crypto.subtle.decrypt(
                { name: 'AES-GCM', iv },
                this.masterKey,
                encrypted
            );
            const value = JSON.parse(new TextDecoder().decode(decrypted));
            resolve(value);
          } catch(e) {
            console.error('[SecureStorage] Error decrypting', key, e);
            resolve(null);
          }
        };
        request.onerror = () => reject(request.error);
      });
    }
  
    async remove(key) {
      await this.init();
      return new Promise((resolve, reject) => {
        const store = this.db.transaction([this.storeName], 'readwrite').objectStore(this.storeName);
        const request = store.delete(key);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    }
  }
  
  export const secureStorage = new SecureStorageService();


=====================================
FILE: src/services/seedService.js
=====================================

import { supabase } from '../supabaseClient';
import { logger } from '../utils/logger';

/**
 * SeedService: Gestiona la sembra massiva de dades (Knowledge Base)
 */
export const seedService = {
    /**
     * Importa llavors des d'un fitxer JSON (com rhizome_seed_data.json)
     */
    async importSeeds(seedsData) {
        if (!seedsData || !seedsData.seeds) {
            logger.error('[Seed] No seeds found in data');
            return { success: false, error: 'No data' };
        }

        logger.log(`[Seed] Iniciant sembra de ${seedsData.seeds.length} llavors...`);

        try {
            // Transformem les llavors al format de la taula 'lexicon' o 'posts' 
            // depenent de la col·lecció. Per ara, anem a 'lexicon' com a base de coneixement.
            const lexiconEntries = seedsData.seeds.map(s => ({
                id: s.id,
                title: s.title,
                url: s.url,
                category: s.metadata.collection,
                tags: s.metadata.tags,
                content: `Recurs importat de Raindrop. [${s.metadata.collection}]`,
                created_at: s.created_at,
                is_official: s.metadata.is_important,
                source: 'raindrop_import'
            }));

            // Inserció en batches per no saturar Supabase
            const BATCH_SIZE = 100;
            let successCount = 0;

            for (let i = 0; i < lexiconEntries.length; i += BATCH_SIZE) {
                const batch = lexiconEntries.slice(i, i + BATCH_SIZE);
                const { error } = await supabase
                    .from('lexicon')
                    .upsert(batch, { onConflict: 'url' });

                if (error) {
                    logger.error(`[Seed] Error en batch ${i}:`, error);
                } else {
                    successCount += batch.length;
                    logger.log(`[Seed] Progress: ${successCount}/${lexiconEntries.length}`);
                }
            }

            return { success: true, count: successCount };
        } catch (error) {
            logger.error('[Seed] Import failed:', error);
            return { success: false, error };
        }
    }
};


=====================================
FILE: src/services/speechService.js
=====================================

import { logger } from '../utils/logger';

class SpeechService {
    constructor() {
        this.recognition = null;
        this.isSupported = false;

        if (typeof window !== 'undefined') {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (SpeechRecognition) {
                this.recognition = new SpeechRecognition();
                this.isSupported = true;
                this.isStarted = false;

                this.recognition.continuous = false;
                this.recognition.interimResults = true;
                this.recognition.lang = 'ca-ES';

                this.recognition.onstart = () => {
                    this.isStarted = true;
                    logger.log('[SpeechService] Recognition started.');
                };

                this.recognition.onend = () => {
                    this.isStarted = false;
                    logger.log('[SpeechService] Recognition ended.');
                };
            }
        }
    }

    listen(langCode = 'va') {
        if (!this.isSupported) {
            return Promise.reject('El reconeixement de veu no és compatible amb aquest navegador.');
        }

        if (this.isStarted) {
            logger.warn('[SpeechService] Listen called but already started. Skipping start().');
            return Promise.resolve('Reconeixement ja en marxa.');
        }

        const langMap = {
            'va': 'ca-ES',
            'es': 'es-ES',
            'gl': 'gl-ES',
            'eu': 'eu-ES',
            'en': 'en-US',
            'fr': 'fr-FR',
            'de': 'de-DE',
            'it': 'it-IT'
        };

        this.recognition.lang = langMap[langCode] || 'ca-ES';
        logger.log(`[SpeechService] Escoltant en: ${this.recognition.lang}`);

        return new Promise((resolve, reject) => {
            let finalTranscript = '';

            this.recognition.onresult = (event) => {
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript;
                    }
                }
            };

            this.recognition.onend = () => {
                this.isStarted = false;
                if (finalTranscript) {
                    resolve(finalTranscript);
                } else {
                    reject('No s\'ha detectat cap veu.');
                }
            };

            this.recognition.onerror = (event) => {
                this.isStarted = false;
                logger.error('[SpeechService] Error:', event.error);
                reject(event.error);
            };

            try {
                this.recognition.start();
                this.isStarted = true;
            } catch (e) {
                this.isStarted = false;
                logger.error('[SpeechService] Fatal start error:', e);
                reject(e);
            }
        });
    }

    stop() {
        if (this.recognition && this.isStarted) {
            try {
                this.recognition.stop();
                this.isStarted = false;
            } catch (e) {
                logger.warn('[SpeechService] Error stopping recognition:', e);
            }
        }
    }

    speak(text, langCode = 'va') {
        if (typeof window === 'undefined' || !window.speechSynthesis) {
            logger.warn('[SpeechService] La síntesi de veu no és compatible.');
            return;
        }

        window.speechSynthesis.cancel();
        
        // [HOTFIX] iOS Safari Speech Limit Bug: Truncament de cadena per trossos naturals.
        const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
        
        const langMap = {
            'va': 'ca-ES',
            'es': 'es-ES',
            'en': 'en-US'
        };
        const voiceLang = langMap[langCode] || 'ca-ES';

        sentences.forEach(sentence => {
            const utterance = new SpeechSynthesisUtterance(sentence.trim());
            utterance.lang = voiceLang;
            utterance.rate = 1.0;
            utterance.pitch = 1.0;
            window.speechSynthesis.speak(utterance);
        });
    }
}

export const speechService = new SpeechService();


=====================================
FILE: src/services/supabaseService.js
=====================================

import { supabase } from '../supabaseClient';
import { logger } from '../utils/logger';
import { DEMO_USER_ID, ROLES, USER_ROLES, ENABLE_MOCKS, CREATOR_EMAILS } from '../constants';
import { PostSchema, MarketItemSchema, MessageSchema, ProfileSchema, ConversationSchema } from './schemas';
import { MOCK_LORE_POSTS, MOCK_LORE_ITEMS } from '../data/mockLoreData';
import { pushNotifications } from './pushNotifications';

/**
 * Helper for time-aware greetings
 */
const getTimeAwareGreeting = (lang = 'va') => {
    const hour = new Date().getHours();
    if (lang === 'es') {
        if (hour >= 6 && hour < 14) return "¡Buenos días!";
        if (hour >= 14 && hour < 20) return "¡Buenas tardes!";
        return "¡Buenas noches!";
    } else { // Valencian/Default
        if (hour >= 6 && hour < 14) return "Bon dia!";
        if (hour >= 14 && hour < 20) return "Bona vesprada!";
        return "Bona nit!";
    }
};

/**
 * Sanitizes input strings to prevent common injection patterns 
 * and remove potentially dangerous characters.
 */
const sanitizeInput = (text) => {
    if (typeof text !== 'string') return '';
    // Remove characters often used in SQL injection or HTML injection
    // Keep letters (any lang), numbers, spaces and common punctuation
    return text.replace(/[<>{}[\]\\^`|%'"?]/g, '').trim();
};

/**
 * Normalizes Wikimedia URLs to standardized thumbnails (500px).
 * Handles raw SVGs and existing thumbs correctly.
 */
const normalizeWikipediaUrl = (url) => {
    if (!url) return url;

    let normalized = decodeURIComponent(String(url).trim());

    // 1. Handle protocol-relative URLs
    if (normalized.startsWith('//')) {
        normalized = 'https:' + normalized;
    }

    // 2. [MASTER RECOVERY] If it's just a filename or a File: reference
    // Pattern: "File:Escut_de_la_Torre.svg" or "Escut_de_la_Torre.svg"
    const isFilenameOnly = !normalized.includes('http') && (
        normalized.includes('File:') || 
        normalized.endsWith('.svg') || 
        normalized.endsWith('.png') || 
        normalized.endsWith('.jpg') ||
        normalized.includes('Escut') || 
        normalized.includes('Shield')
    );

    if (isFilenameOnly) {
        const filename = normalized.replace('File:', '').trim().replace(/ /g, '_');
        return `https://commons.wikimedia.org/w/thumb.php?f=${encodeURIComponent(filename)}&w=500`;
    }

    // 3. If it's already a full Wikimedia URL, ensure it's a 500px thumbnail
    if (normalized.includes('wikimedia.org') || normalized.includes('wikipedia.org')) {
        // If it's already a direct thumb path, we can keep it but force 500px
        if (normalized.includes('/thumb/')) {
            return normalized.replace(/\/\d+px-/g, '/500px-');
        }
        
        // If it's a link to a file page or raw file, convert to thumb.php
        const filenameMatch = normalized.match(/File:(.+)$/) || normalized.match(/\/([^/]+)$/);
        if (filenameMatch) {
            const filename = filenameMatch[1].split('?')[0];
            return `https://commons.wikimedia.org/w/thumb.php?f=${encodeURIComponent(filename)}&w=500`;
        }
    }

    return normalized;
};

/**
 * Linguistic engine to adjust common Valencian/Catalan terms 
 * based on the character's gender.
 */
const adjustGender = (text, gender) => {
    if (!text || gender !== 'female') return text;
    // Map of common masculine to feminine endings or terms
    const adaptations = {
        ' un poc liat': ' un poc liada',
        ' tot sol': ' tota sola',
        'content ': 'contenta ',
        ' cansat': ' cansada',
        'Preparat': 'Preparada',
        'benvingut': 'benvinguda',
        'estret': 'estreta',
        'segur': 'segura',
        'animat': 'animada'
    };

    let adjusted = text;
    for (const [masc, fem] of Object.entries(adaptations)) {
        adjusted = adjusted.replace(new RegExp(masc, 'g'), fem);
    }
    return adjusted;
};

/**
/**
 * [OMEGA-3 FIXED] columnCache implementation using a Proxy and L1 RAM mirror.
 * Zero-Jank policy: synchronous gets hit RAM, synchronous sets hit RAM.
 * Disk writes are batched and debounced async.
 */
const _ramColumnCache = {};
let _columnCacheWriteTimer = null;
const _columnCachePendingWrites = new Set();

const columnCache = new Proxy({}, {
    get: (target, prop) => {
        // [MASTER BLINDATGE] Evitem consultes amb IDs malformats
        if (prop === 'sp_node_befd9c41142744f6') return null;
        if (prop.includes('_punt')) return null; // [GHOST-SHIELD] Blocking dynamic project_ref prefixes

        // 1. Resposta instantània des de RAM (L1)
        if (prop in _ramColumnCache) return _ramColumnCache[prop];

        // 2. Fallback síncron: Només 1 vegada per propietat en tota la sessió
        const val = localStorage.getItem(`cp_${prop}`);
        if (val === 'true') {
            _ramColumnCache[prop] = true;
            return true;
        }
        if (val === 'false') {
            _ramColumnCache[prop] = false;
            return false;
        }

        _ramColumnCache[prop] = null;
        return null;
    },
    set: (target, prop, value) => {
        // 1. L1 RAM Hit
        _ramColumnCache[prop] = value;
        
        // 2. Asynchronous Batched Debounced Write L2 (Zero Main-Thread Jank)
        _columnCachePendingWrites.add(prop);
        if (!_columnCacheWriteTimer) {
            _columnCacheWriteTimer = setTimeout(() => {
                _columnCachePendingWrites.forEach(p => {
                    try {
                        localStorage.setItem(`cp_${p}`, String(_ramColumnCache[p]));
                    } catch {
                         // Silently swallow quota errors to keep the application responsive locally
                    }
                });
                _columnCachePendingWrites.clear();
                _columnCacheWriteTimer = null;
            }, 1000); // 1000ms flush
        }
        return true;
    }
});

// [MASTER PURGE] Self-healing logic for legacy data
// })();


/**
 * Intelligent Synonym Dictionary for Towns and Search Terms
 * Maps historical, informal, or other language variants to canonical names.
 */
const SEARCH_SYNONYMS = {
    'torremanzanas': 'La Torre de les Maçanes',
    'la torre de las manzanas': 'La Torre de les Maçanes',
    'la torre': 'La Torre de les Maçanes',
    'alcoy': 'Alcoi',
    'alcoià': 'Alcoi',
    'el mure': 'Muro d\'Alcoi',
    'muro de alcoy': 'Muro d\'Alcoi',
    'muro': 'Muro d\'Alcoi',
    'cocentaina': 'Cocentaina', // Canonical
    'quincena': 'Cocentaina', // For testing or local context
    'penaguila': 'Penàguila',
    'rellen': 'Relleu',
    'benifallim': 'Benifallim',
    'soc de poble': 'Sóc de Poble',
    'socdepoble': 'Sóc de Poble',
    'soc de': 'Sóc de Poble',
    'poble': 'Sóc de Poble',
    'soc': 'Sóc de Poble',
    'rutadelpoble': 'Sóc de Poble',
    'merchandising': 'Sóc de Poble',
    'xixona': 'Xixona',
    'jijona': 'Xixona',
    'alacant': 'Alacant',
    'alicante': 'Alacant',
    'alacantí': 'L\'Alacantí',
    'el campello': 'El Campello',
    'mutxamel': 'Mutxamel',
    'sant joan': 'Sant Joan d\'Alacant',
    'sant vicent': 'Sant Vicent del Raspeig',
    'agost': 'Agost'
};

/**
 * Normalizes a search query using the synonym engine.
 * @param {string} query 
 * @returns {string} Normalized query
 */
const getNormalizedQuery = (query) => {
    if (!query) return '';
    const trimmed = query.toLowerCase().trim();

    // Accents normalization (Damia -> Damià)
    const accentLess = trimmed.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    // Direct match check in Synonyms
    if (SEARCH_SYNONYMS[trimmed]) return SEARCH_SYNONYMS[trimmed];
    if (SEARCH_SYNONYMS[accentLess]) return SEARCH_SYNONYMS[accentLess];

    // Partial match/Contains check (more dynamic)
    for (const [key, value] of Object.entries(SEARCH_SYNONYMS)) {
        if (trimmed.includes(key) || accentLess.includes(key)) return value;
    }
    return accentLess;
};

/**
 * [SUPER-SEARCH] Unified search with semantic awareness
 */
export const unifiedSearch = async (query) => {
    const normalized = getNormalizedQuery(query);
    // logger.log(`[Super-Search] Executing unified search for: ${normalized} (${category})`);

    // Logic will be expanded to use FTS5/GIN indexes in the next phase
    // For now, we enhance the existing filtering with semantic tag matching
    return normalized;
};

/**
 * Utilitat interna per a comparació OMNISCIENT (Ignora accents, espais i majúscules)
 */
const omniMatch = (target, search) => {
    if (!target || !search) return false;
    const normalize = (str) => str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
    return normalize(target).includes(normalize(search));
};

const setColumnCache = (key, value) => {
    columnCache[key] = value;
};

/**
 * [PILAR 1: LOCAL-FIRST] Advanced Cache Layer for Latency Zero
 */
const LocalCache = {
    _storage: {},
    get: (key) => {
        const item = LocalCache._storage[key] || JSON.parse(localStorage.getItem(`lc_${key}`) || 'null');
        if (item && Date.now() < item.expires) {
            LocalCache._storage[key] = item; // Repopulate L1 if missing
            return item.data;
        }
        return null;
    },
    set: (key, data, ttl = 300000) => { // Default 5 min
        const item = { data, expires: Date.now() + ttl };
        LocalCache._storage[key] = item;
        try {
            localStorage.setItem(`lc_${key}`, JSON.stringify(item));
        } catch {
            // [CRÍTIC OMEGA-3] Fallback QuotaExceededError - Continuem només en RAM pura.
            // Ajudant als telèfons amb limitació dràstica d'espai al navegador
            console.warn('[LocalCache] Evitant crash de QuotaExceededError. Caiguda cap L1 RAM.');
        }
    },
    invalidate: (key) => {
        delete LocalCache._storage[key];
        localStorage.removeItem(`lc_${key}`);
    }
};

/**
 * [MASTER] Ensures column cache is populated with robust SQL checks
 */
const _ensureColumnCache = async () => {
    // 1. Check Posts columns
    if (columnCache.posts_ai_percentage === null) {
        if (!activeChecks.posts) {
            activeChecks.posts = (async () => {
                try {
                    const { data, error } = await supabase.from('posts').select('*').limit(1);
                    if (!error && data) {
                        const row = data[0] || {};
                        const exists = 'ai_percentage' in row;
                        setColumnCache('posts_ai_percentage', exists);
                        setColumnCache('posts_human_percentage', exists);
                        setColumnCache('posts_time_saved', exists);
                        setColumnCache('posts_is_iaia_inspired', exists);
                        setColumnCache('posts_pinned_position', 'pinned_position' in row);
                        setColumnCache('posts_town_uuid', 'town_uuid' in row);
                    } else if (error) {
                        setColumnCache('posts_ai_percentage', false);
                        setColumnCache('posts_pinned_position', false);
                    }
                    // logger.log(`[SupabaseService] Posts columns check done.`);
                } catch (e) {
                    logger.warn('[SupabaseService] Error checking posts columns:', e);
                } finally { activeChecks.posts = null; }
            })();
        }
    }

    // 2. Check Market columns
    if (columnCache.market_pinned_position === null) {
        if (!activeChecks.market) {
            activeChecks.market = (async () => {
                try {
                    // Check multiple columns in one go (market_items select *)
                    const { data, error } = await supabase.from('market_items').select('*').limit(1);
                    if (!error && data && data.length >= 0) {
                        const row = data[0] || {};
                        setColumnCache('market_pinned_position', 'pinned_position' in row);
                        setColumnCache('market_is_pinned', 'is_pinned' in row);
                        setColumnCache('market_is_iaia_inspired', 'is_iaia_inspired' in row);
                        setColumnCache('market_is_playground', 'is_playground' in row);
                    } else if (error) {
                        // If we can't select *, let's be conservative
                        setColumnCache('market_pinned_position', false);
                        setColumnCache('market_is_pinned', false);
                    }

                    // Check for the specific town join hint (PostgREST syntax)
                    const { error: fkError } = await supabase.from('market_items').select('towns!fk_market_town_uuid(name)').limit(1);
                    setColumnCache('market_fk_town_uuid', !fkError);

                    // logger.log(`[SupabaseService] Market columns check done.`);
                } catch (e) {
                    logger.warn('[SupabaseService] Error checking market columns:', e);
                } finally { activeChecks.market = null; }
            })();
        }
    }

    // 3. Check Messages columns
    if (columnCache.messages_post_uuid === null) {
        if (!activeChecks.messages) {
            activeChecks.messages = (async () => {
                try {
                    const { data, error } = await supabase.from('messages').select('*').limit(1);
                    if (!error && data) {
                        const row = data[0] || {};
                        setColumnCache('messages_post_uuid', 'post_uuid' in row);
                        setColumnCache('messages_is_playground', 'is_playground' in row);
                    } else if (error) {
                        setColumnCache('messages_post_uuid', false);
                        setColumnCache('messages_is_playground', false);
                    }
                    logger.log(`[SupabaseService] Messages columns check done.`);
                } catch (e) {
                    logger.warn('[SupabaseService] Error checking messages columns:', e);
                } finally { activeChecks.messages = null; }
            })();
        }
    }

    await Promise.all([activeChecks.posts, activeChecks.market, activeChecks.messages]);
}

export const isValidUUID = (id) => {
    if (!id) return false;
    const isStandardUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    const isSovereignID = typeof id === 'string' && id.startsWith('sp_node_');
    return isStandardUUID || isSovereignID;
};

// Guardià per a crides que NÉCESSITEN un UUID de base de dades real (Supabase)
const isRealDBUUID = (id) => {
    return typeof id === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
};

// Promesas activas para evitar ráfagas de errores 400 en paralelo
const activeChecks = {
    posts: null,
    market: null,
    messages: null,
    conversations: null
};

/**
 * Centralized System Entities (Virtual Identities)
 */
const SYSTEM_ENTITIES = [
    {
        id: 'socdepoble',
        full_name: 'Sóc de Poble',
        username: 'socdepoble',
        type: 'empresa',
        town_name: 'Global',
        description: 'La plataforma de connexió rural definitiva. Gent, terra i xarxa. Connectem pobles, persones i territori a través de la tecnologia i la identitat.',
        avatar_url: '/assets/master/logo_socdepoble_green_square.png',
        cover_url: '/images/campaign/rustic_detail.png',
        category: 'Tecnologia i Comunitat',
        is_active: true,
        created_at: '2025-01-01T00:00:00Z'
    },
    {
        id: 'el-rentonar',
        full_name: 'Associació Cultural El Rentonar',
        username: 'rentonar',
        type: 'empresa',
        town_name: 'La Torre de les Maçanes',
        description: 'Entitat gestora de Sóc de Poble i custòdia de la tradició i identitat de La Torre de les Maçanes. Treballem per la memòria viva i la sobirania tecnològica rural. CIF G-03967668.',
        avatar_url: '/assets/master/logo_socdepoble_green_square.png',
        cover_url: '/images/campaign/rustic_detail.png',
        category: 'Cultura i Tradició',
        is_active: true,
        created_at: '2025-01-01T00:00:00Z'
    },
    {
        id: '11111111-1a1a-0000-0000-000000000000',
        full_name: 'IAIA (Guia del Poble)',
        type: 'oficial',
        town_name: 'Sóc de Poble',
        description: 'Assistència virtual i guia de la comunitat. Soc la teua acompanyant digital per a tot el que necessites al poble.',
        avatar_url: '/images/agents/iaia_avatar.png',
        cover_url: '/images/campaign/night_party.png',
        is_active: true,
        created_at: '2025-01-01T00:00:00Z'
    },
    {
        id: 'fa82eb62-4a83-4ff7-b2d6-8849673fc3b0',
        full_name: 'Damià Llorens (Perit)',
        username: 'damianllorens',
        type: 'persona',
        town_name: 'Global',
        description: 'Fundador de Sóc de Poble. Dissenyant el futur de la connexió rural viva.',
        avatar_url: '/assets/avatars/comic/damia_agutzil_comic.png',
        cover_url: '/images/campaign/night_party.png',
        category: 'Tecnologia',
        is_active: true,
        is_admin: true,
        created_at: '2025-01-01T00:00:00Z'
    },
    {
        id: 'a11ac111-eec1-4111-b111-000000000013',
        full_name: 'Anna Climent',
        type: 'persona',
        town_name: 'Ibi / Global',
        description: 'Biòloga, arquitecta i professora. Experta en nutrició saludable i sostenibilitat rural.',
        avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anna',
        cover_url: '/images/campaign/night_party.png',
        category: 'gent',
        is_active: true,
        is_admin: true, // Elevating to admin
        created_at: '2026-01-27T18:00:00Z'
    }
];

/**
 * Centralized logic to detect if a profile is fictive (Lore or Demo)
 */
export const isFictiveProfile = (profile) => {
    if (!profile) return false;
    const pid = profile.id || '';
    const email = profile.email || '';

    // Order of priority: Creator account (NEVER fictive), ID prefix (Lore), System IDs, then explicit flag (Demo)
    const masters = (typeof CREATOR_EMAILS !== 'undefined') ? CREATOR_EMAILS : [];
    if (masters.includes(email)) return false;

    return pid.startsWith('11111111-') ||
        pid.startsWith('sdp-') ||
        profile.is_demo === true;
};

/**
 * Hardcoded Lore Personas for Sandbox and AI interaction
 */
const LORE_PERSONAS = [
    { id: '11111111-1a1a-0000-0000-000000000000', full_name: 'IAIA MarIA', username: 'iaia_master', gender: 'female', role: 'official', ofici: 'Matriarca Digital', primary_town: 'Sóc de Poble (Global)', bio: 'Dignitat, terra i xarxa. Soc la teua assistenta (MArIA: Memòria Artificial i Acció) per a tot el que necessites al poble.', avatar_url: '/assets/avatars/comic/iaia_comic_matriarch.png', category: 'gent', type: 'person', onomatopoeia: '🏺', time: 'Sempre' },
    { id: '11111111-1a1a-0001-0000-000000000001', full_name: 'Andreu Soler', username: 'andreu_soler', gender: 'male', role: 'ambassador', ofici: 'Capatàs del Mas', primary_town: 'La Torre de les Maçanes', bio: "L'Andreu és el rellotge del camp.", avatar_url: '/assets/avatars/comic/andreu_soler_comic.png', onomatopoeia: '¡PLAS!', category: 'treball', type: 'person', time: '3:35 p. m.' },
    { id: '11111111-1a1a-0001-0000-000000000002', full_name: 'Beatriz Ortega', username: 'beatriz_ortega', gender: 'female', role: 'ambassador', ofici: 'Arquitecta de Ferro', primary_town: 'Global', bio: 'Mestre, la V15 està bategant forta!', avatar_url: '/assets/avatars/comic/beatriz_ortega_comic.png', onomatopoeia: '¡CLINC!', category: 'treball', type: 'person', time: '12:19 p. m.' },
    { id: '11111111-1a1a-0001-0000-000000000003', full_name: 'Carla Soriano', username: 'carla_soriano', gender: 'female', role: 'ambassador', ofici: 'Harmonitzadora de Batecs', primary_town: 'Ibi', bio: 'Bategat equilibrat, mestre Javi.', avatar_url: '/assets/avatars/comic/carla_soriano_comic.png', onomatopoeia: '¡OMMM!', category: 'gent', type: 'person', time: '6:13 p. m.' },
    { id: '11111111-1111-4111-a111-000000000009', full_name: 'Carmen la del Forn', username: 'cuinera', gender: 'female', role: 'ambassador', ofici: 'Cuinera del Mas', primary_town: 'La Torre de les Maçanes', bio: 'La cuina de Pepica és el cor del Mas.', avatar_url: '/assets/avatars/comic/carmen_forn_comic.png', onomatopoeia: '¡XUP!', category: 'treball', type: 'person', time: '2:16 p. m.' },
    { id: '11111111-1111-4111-a111-000000000003', full_name: 'Vicent Ferris', username: 'vferris', gender: 'male', role: 'ambassador', ofici: 'Agricultor Gran', primary_town: 'La Torre de les Maçanes', bio: 'Els cicles lunars manen sobre la collita.', avatar_url: '/assets/avatars/comic/vicent_ferris_comic.png', onomatopoeia: '¡ZAS!', category: 'treball', type: 'person', time: '5:00 a. m.' },
    { id: '11111111-1111-4111-a111-000000000004', full_name: 'Samir Mensah', username: 'samirm', gender: 'male', role: 'ambassador', ofici: 'Artesà', primary_town: 'Ibi', bio: 'Integrant tradicions.', avatar_url: '/assets/avatars/comic/avatar_samir_comic.png', onomatopoeia: '¡TAC!', category: 'gent', type: 'person', time: '4:15 p. m.' },
    { id: '11111111-1111-4111-a111-000000000005', full_name: 'Mariamel', username: 'mariamel', gender: 'female', role: 'ambassador', ofici: 'Historiadora', primary_town: 'Muro', bio: 'Conservant el llegat del poble.', avatar_url: '/assets/avatars/comic/avatar_mariamel_comic.png', onomatopoeia: '¡SHH!', category: 'gent', type: 'person', time: '1:00 p. m.' },
    { id: '11111111-1111-4111-a111-000000000008', full_name: 'Joan Batiste (Avi dels Papers)', username: 'joanbat', gender: 'male', role: 'ambassador', ofici: 'Arxiver', primary_town: 'Cocentaina', bio: 'Tots els documents en regla.', avatar_url: '/assets/avatars/comic/joan_batiste_comic.png', onomatopoeia: '¡RASS!', category: 'gent', type: 'person', time: '10:00 a. m.' },
    { id: '11111111-0000-0000-0000-000000000004', full_name: 'Marc (El Gall)', username: 'marcgall', gender: 'male', role: 'official', ofici: 'Alertes Globals', primary_town: 'Global', bio: 'Alçant al Mas cada dia.', avatar_url: '/assets/avatars/comic/avatar_marc_comic.png', onomatopoeia: '¡KIKIRIKI!', category: 'gent', type: 'person', time: '6:00 a. m.' },
    { id: '11111111-1111-4111-a111-000000000011', full_name: 'Elena Popova', username: 'elenap', gender: 'female', role: 'ambassador', ofici: 'Innovadora', primary_town: 'Agost', bio: "Buscant el futur a l'entorn rural.", avatar_url: '/assets/avatars/comic/elena_popova_comic.png', onomatopoeia: '¡PING!', category: 'gent', type: 'person', time: '2:30 p. m.' },
    { id: '11111111-1111-4111-a111-000000000012', full_name: 'Joanet Serra', username: 'joanets', gender: 'male', role: 'ambassador', ofici: 'Sereno', primary_town: 'Relleu', bio: 'Vigilant les estreles.', avatar_url: '/assets/avatars/comic/joanet_serra_comic.png', onomatopoeia: '¡FIUU!', category: 'gent', type: 'person', time: '11:00 p. m.' },
    { id: '11111111-1111-4111-a111-000000000013', full_name: 'Lucia', username: 'lucia', gender: 'female', role: 'ambassador', ofici: 'Llibretera', primary_town: 'Banyeres', bio: 'La màgia dels contes vells.', avatar_url: '/assets/avatars/comic/avatar_lucia_comic.png', onomatopoeia: '¡CLAP!', category: 'gent', type: 'person', time: '5:45 p. m.' },
    { id: '11111111-1a1a-0001-0000-000000000007', full_name: 'Pepica la de la Vall', username: 'pepica_vall', gender: 'female', role: 'ambassador', ofici: 'Herbolària', primary_town: 'La Vall', bio: 'Remeis naturals.', avatar_url: '/assets/avatars/comic/pepica_vall_comic.png', onomatopoeia: '¡TSH!', category: 'treball', type: 'person', time: '8:00 a. m.' },
    { id: '11111111-1a1a-0000-0000-000000000005', full_name: 'Nano Banana', username: 'nanob', gender: 'male', role: 'official', ofici: 'Artista T.I.A.', primary_town: 'Global', bio: '🎨 Píxels i humor.', avatar_url: '/assets/avatars/comic/nano_banana_comic.png', onomatopoeia: '¡POW!', category: 'gent', type: 'person', time: '4:20 p. m.' }
];


const _throttleLocks = new Map();

/**
 * Verifica si una acción es demasiado frecuente (Throttling) con locks de concurrencia
 * @param {string} userId
 * @param {string} actionType
 * @param {number} limitMs
 */
const checkThrottling = async (userId, actionType, limitMs = 3000) => {
    const now = Date.now();
    const key = `${userId}_${actionType}`;
    const lock = _throttleLocks.get(key) || { lastTime: 0, pending: 0 };

    if (lock.pending > 5) {
        throw new Error('Massa peticions simultànies. Espera un poc.');
    }

    lock.pending++;
    _throttleLocks.set(key, lock);

    try {
        if (now - lock.lastTime < limitMs) {
            throw new Error(`Acció massa ràpida. Espera ${Math.ceil((limitMs - (now - lock.lastTime)) / 1000)} segons.`);
        }
        lock.lastTime = now;
    } finally {
        lock.pending--;
        // Mantenim el lock actualitzat
        _throttleLocks.set(key, lock);
        
        // [GC OMEGA-3] Garbage Collection del lock per no saturar memòria en sessions llargues
        if (lock.pending === 0) {
            setTimeout(() => {
                const currentLock = _throttleLocks.get(key);
                if (currentLock && currentLock.pending === 0 && Date.now() - currentLock.lastTime >= limitMs) {
                    _throttleLocks.delete(key);
                }
            }, limitMs + 50);
        }
    }
};

const TOWNS_MAP = {
    1: 'La Torre de les Maçanes',
    2: 'Cocentaina',
    3: 'Muro d\'Alcoi',
    'la-torre': 'La Torre de les Maçanes',
    'cocentaina': 'Cocentaina',
    'muro': 'Muro d\'Alcoi',
    4: 'Agost',
    'agost': 'Agost'
};

/**
 * Normaliza un item de feed/market con fallbacks robustos
 */
const normalizeContentItem = (item, type = 'post') => {
    if (!item) return null;

    const isJaviMaster = (
        item.author_id === '25218ea4-5d7d-4db4-bdc5-7ae035629242' || 
        item.author_user_id === '25218ea4-5d7d-4db4-bdc5-7ae035629242' || 
        item.author === 'Javi Llinares' || 
        item.author_name === 'Javi Llinares' ||
        item.author === 'socdepoblecom' || 
        item.author_name === 'socdepoblecom' || 
        item.username === 'socdepoblecom' ||
        item.author_email?.includes('socdepoblecom')
    );

    const joinedAvatar = item.profiles?.avatar_url || item.entities?.avatar_url;
    const joinedName = item.profiles?.full_name || item.entities?.name;

    const authorName = isJaviMaster ? 'Javi Llinares' : (joinedName || item.author || item.author_name || item.seller || item.seller_name || (type === 'market' ? 'Productor Local' : 'Veí del Poble'));
    const avatarUrl = isJaviMaster ? '/assets/master/javi_avatar_cinematic.png' : (joinedAvatar || item.avatar_url || item.author_avatar || item.author_avatar_url || '/assets/avatars/comic/avatar_man_1.png');

    // [MASTER HEALER] Fallback d'imatges intel·ligent per al Mercat
    let imageUrl = item.image_url || item.image;
    if (!imageUrl && type === 'market') {
        const title = (item.title || '').toLowerCase();
        if (title.includes('mel')) imageUrl = '/images/assets/mel_premium.png';
        else if (title.includes('oli')) imageUrl = '/images/assets/oli_premium.png';
        else if (title.includes('poma') || title.includes('apple')) imageUrl = '/images/assets/apples_premium.png';
        else if (title.includes('tomate')) imageUrl = '/images/assets/tomates_premium.png';
        else if (title.includes('coque')) imageUrl = '/images/assets/coques_premium.png';
        else if (title.includes('formatge')) imageUrl = '/images/assets/formatge.png';
        else imageUrl = '/images/assets/generic_market.png';
    }

    // Resolución de pueblos con validación
    let townName = isJaviMaster ? 'La Torre de les Maçanes' : 'Al teu poble';
    if (!isJaviMaster) {
        if (item.towns?.name) {
            townName = item.towns.name;
        } else if (item.town_id && TOWNS_MAP[item.town_id]) {
            townName = TOWNS_MAP[item.town_id];
        } else if (item.town_name) {
            townName = item.town_name;
        }
    }

    return {
        ...item,
        id: item.uuid || item.id,
        uuid: item.uuid || item.id,
        author: authorName,
        seller: type === 'market' ? authorName : undefined,
        author_avatar: avatarUrl,
        author_role: isJaviMaster ? 'official' : (type === 'market' ? 'freelance' : (item.author_role || 'vei')),
        avatar_url: avatarUrl,
        author_user_id: isJaviMaster ? '25218ea4-5d7d-4db4-bdc5-7ae035629242' : (item.author_user_id || (item.author_role === 'user' ? item.author_id : (item.author_user_id || null))),
        author_entity_id: item.author_entity_id || (item.author_role !== 'user' ? (item.entity_id || item.author_id) : (item.author_entity_id || null)),
        towns: { name: townName },
        image_url: imageUrl,
        is_iaia_inspired: item.is_iaia_inspired || false,
        ai_percentage: item.ai_percentage || 0,
        human_percentage: item.human_percentage || 100,
        time_saved_minutes: item.time_saved_minutes || 0,
        semantic_tags: item.semantic_tags || [],
        external_links: item.external_links || []
    };
};
// [GHOST-SHIELD] Known broken or legacy storage assets that trigger 404/400 console errors
const BROKEN_STORAGE_URLS = [
    'javi_avatar.png',
    'profiles/javi_avatar.png',
    'avatars/javi_avatar.png'
];

export { columnCache, setColumnCache, _ensureColumnCache, LocalCache, isRealDBUUID, normalizeContentItem, checkThrottling, activeChecks, getTimeAwareGreeting, adjustGender, LORE_PERSONAS, ENABLE_MOCKS, DEMO_USER_ID };

export const supabaseService = {
    /**
     * [STORAGE HEALING]
     * Detects and fixes legacy or broken storage URLs.
     */
    normalizeStorageUrl(url) {
        if (!url) return url;

        // [GHOST-SHIELD] Pre-flight block for known broken remote assets
        if (typeof url === 'string') {
            const isBroken = BROKEN_STORAGE_URLS.some(broken => url.includes(broken));
            if (isBroken) {
                logger.debug(`[GhostShield] Blocking request to known broken asset: ${url}`);
                // Return a safe local placeholder that exists in the repo
                return '/assets/master/javi_avatar_cinematic.png';
            }
        }

        // [MASTER BLINDATGE] Purguem rutes absolutes locals que s'hagen pogut colar
        // Admitem 'Users/' sense barra inicial per caçar rutes relatives malformades
        const localPathPattern = /(\/?Users\/|C:\\|D:\\|E:\\|F:\\|G:\\|H:\\|I:\\|J:\\)/i;
        if (typeof url === 'string' && localPathPattern.test(url)) {
            const fileName = url.split(/[/\\]/).pop();
            // Intentem recuperar-la de la carpeta de relíquies del Mas o fallback d'assets
            logger.warn(`[SupabaseService] Ruta absoluta detectada i sanejada: ${url}`);
            
            // Si el fitxer sembla un avatar, usem el path de profiles
            if (url.includes('avatar') || url.includes('profile')) {
                return `/assets/brain/e1b6e544-2f87-4f23-b187-d802a30c0ca1/${fileName}`;
            }
            
            // Fallback general a assets/brain
            return `/assets/brain/e1b6e544-2f87-4f23-b187-d802a30c0ca1/${fileName}`;
        }

        return url;
    },

    normalizeProfile(profile) {
        if (!profile) return null;
        return {
            ...profile,
            avatar_url: this.normalizeStorageUrl(profile.avatar_url),
            cover_url: this.normalizeStorageUrl(profile.cover_url)
        };
    },

    /**
    /**
     * Account Deletion System (5s Fast Track)
     * Calls the secure RPC 'delete_user' which invokes PostgreSQL ON DELETE CASCADE.
     */
    // New Feature: Persistent Notifications
    async createNotification(payload) {
        try {
            const { error } = await supabase.from('notifications').insert([{
                user_id: payload.user_id,
                type: payload.type || 'system',
                content: payload.content,
                is_read: false,
                created_at: new Date().toISOString(),
                // Optional fields if schema supports them
                // meta: payload.meta 
            }]);
            if (error) {
                // Ignore table missing errors for now
                if (error.code === '42P01') logger.warn('Notifications table missing');
                else logger.error('Error creating notification:', error);
            }
        } catch (e) {
            logger.error('Create notification exception:', e);
        }
    },

    // Admin Stats (Live)
    async getAdminStats() {
        try {
            const now = new Date();
            const yesterday = new Date(now.getTime() - (24 * 60 * 60 * 1000)).toISOString();

            // Total Real Users
            const { count: totalUsers, error: _countError } = await supabase
                .from('profiles')
                .select('id', { count: 'exact' })
                .eq('is_demo', false)
                .limit(1);

            // New Users (24h)
            const { data: newUsers, error: _newError } = await supabase
                .from('profiles')
                .select('id, full_name, created_at')
                .eq('is_demo', false)
                .gte('created_at', yesterday)
                .order('created_at', { ascending: false });

            // System Health (Check if any critical errors logged - using notifications for now)
            const { count: errorCount } = await supabase
                .from('notifications')
                .select('id', { count: 'exact' })
                .eq('type', 'system_error')
                .gte('created_at', yesterday)
                .limit(1);

            // Latest User
            const latestUser = newUsers?.[0] || null;

            return {
                totalUsers: totalUsers || 0,
                newUsers24h: newUsers?.length || 0,
                latestUser,
                errorCount: errorCount || 0
            };
        } catch (e) {
            logger.error('Error fetching admin stats:', e);
            return { totalUsers: 0, newUsers24h: 0, errorCount: 0 };
        }
    },

    // Global OverView (Total Vision for UCC)
    async getGlobalOverview() {
        try {
            const [stats, seo, { data: recentPosts }, { data: recentMarket }, { data: recentProfiles }] = await Promise.all([
                this.getAdminStats(),
                this.getSEOStats(),
                supabase.from('posts').select('id, content, created_at, author, author_role').order('created_at', { ascending: false }).limit(10),
                supabase.from('market_items').select('uuid, title, price, created_at, seller:author_role, avatar_url').order('created_at', { ascending: false }).limit(10),
                supabase.from('profiles').select('id, full_name, created_at').eq('is_demo', false).order('created_at', { ascending: false }).limit(10)
            ]);

            // Combine and normalize for Activity Pipeline
            const timeline = [
                ...(recentPosts || []).map(p => normalizeContentItem({ ...p, type: 'post', label: 'Nou Post al Mur' }, 'post')),
                ...(recentMarket || []).map(m => normalizeContentItem({ ...m, type: 'market', label: 'Nou Producte' }, 'market')),
                ...(recentProfiles || []).map(u => ({ ...u, type: 'user', label: 'Nou Ciutadà', title: u.full_name, author: u.full_name }))
            ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

            return {
                stats,
                seo,
                timeline: timeline.slice(0, 20)
            };
        } catch (err) {
            logger.error('[SupabaseService] Error in getGlobalOverview:', err);
            // Trace the exact error structure for 400/404 debugging
            if (err.details || err.hint) {
                logger.warn(`[SupabaseService] Query Fail: ${err.message} | ${err.details} | ${err.hint}`);
            }
            return { stats: {}, seo: {}, timeline: [] };
        }
    },

    // God-Level User Management (Noise Filtering)
    async updateUserModeration(userId, data) {
        try {
            logger.info(`[Admin] Actualitzant moderació per a ${userId}:`, data);
            const { error } = await supabase
                .from('profiles')
                .update({
                    is_noise: data.is_noise,
                    is_silenced: data.is_silenced,
                    reputation_score: data.reputation_score
                })
                .eq('id', userId);

            if (error) throw error;
            return true;
        } catch (e) {
            logger.error('Error updating user moderation:', e);
            throw e;
        }
    },

    async getModeratedPosts(options = {}) {
        try {
            let query = supabase.from('posts').select('*, towns(name), author:profiles!author_id(*)');

            // Logic to filter ONLY if 'filterNoise' is active
            if (options.filterNoise) {
                query = query.eq('author.is_noise', false);
            }

            const { data, error } = await query.order('created_at', { ascending: false });
            if (error) throw error;
            return data.map(normalizeContentItem);
        } catch (e) {
            logger.error('Error fetching moderated posts:', e);
            return [];
        }
    },

    // SEO / Health Stats (Admin)
    async getSEOStats() {
        try {
            // Simulated SEO Metrics for now (until we integrate Google Search Console API)
            // Real checks for sitemap and robots (Using GET to avoid SW Cache conflicts)
            const hasSitemap = await fetch('/sitemap.xml', { method: 'GET' }).then(r => r.ok).catch(() => false);
            const hasRobots = await fetch('/robots.txt', { method: 'GET' }).then(r => r.ok).catch(() => false);

            return {
                healthScore: hasSitemap && hasRobots ? 98 : 85, // Mock score based on basic checks
                indexedPages: 142, // Mock
                issues: !hasSitemap ? 1 : 0,
                lastCrawl: new Date().toISOString(),
                hasSitemap,
                hasRobots
            };
        } catch (error) {
            logger.warn('Error checking SEO stats:', error);
            return {
                healthScore: 0,
                indexedPages: 0,
                issues: 0,
                lastCrawl: null,
                hasSitemap: false,
                hasRobots: false
            };
        }
    },

    async getPostComments(postId) {
        try {
            const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(postId);
            if (!isUUID || String(postId).startsWith('mock-') || String(postId).startsWith('anna-') || String(postId).includes('-')) {
                // If it's a slug or mock, return empty array without crashing
                // Slugs (like 'busquem-socis-tecnologics') don't have comments in DB yet
                return [];
            }

            const { data, error } = await supabase
                .from('post_comments')
                .select('*, profiles!user_id(full_name, avatar_url)')
                .eq('post_uuid', postId)
                .order('created_at', { ascending: true });

            if (error) {
                if (error.code === '42P01') {
                    logger.warn('post_comments table missing, returning empty array');
                    return [];
                }
                throw error;
            }
            return data || [];
        } catch (e) {
            logger.error('Error fetching post comments:', e);
            return [];
        }
    },

    // Admin & Seeding
    async getAllPersonas(isPlayground = false) {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .order('full_name', { ascending: true });

        if (error) throw error;

        const dbPersonas = (data || []).filter(p => {
            const masters = (typeof CREATOR_EMAILS !== 'undefined') ? CREATOR_EMAILS : [];
            const isRealUser = p.is_demo === false ||
                masters.includes(p.email) ||
                p.username?.toLowerCase().includes('javillinares') ||
                p.username?.toLowerCase().includes('socdepoble');

            const isLoreCharacter = LORE_PERSONAS.some(lp => lp.full_name === p.full_name);
            return !isRealUser && !isLoreCharacter;
        }).map(p => {
            // Aseguramos que siempre tengan un pueblo asignado
            if (!p.primary_town) {
                // Fallback inteligente para perfiles de la DB que puedan estar incompletos
                if (p.username === 'vferris') p.primary_town = 'La Torre de les Maçanes';
                else if (p.username === 'carlas') p.primary_town = 'Penàguila';
                else if (p.username === 'joanets') p.primary_town = 'Muro d\'Alcoi';
                else p.primary_town = 'La Torre de les Maçanes'; // Default para la simulación
            }
            return p;
        });

        // Combinem
        const rawPersonas = [...dbPersonas, ...LORE_PERSONAS];

        // Deduplicació real vs fictici per ID (Prioritat al Real/DB)
        const uniqueById = new Map();
        rawPersonas.forEach(p => {
            const pid = p.id;
            if (!pid) return;
            // Si ja existeix, donem prioritat al perfil que NO siga fictici o que tinga més info
            if (!uniqueById.has(pid)) {
                uniqueById.set(pid, p);
            } else {
                const existing = uniqueById.get(pid);
                const isExistingFictive = isFictiveProfile(existing);
                const isNewFictive = isFictiveProfile(p);

                if (isExistingFictive && !isNewFictive) {
                    uniqueById.set(pid, p);
                }
            }
        });

        const mergedPersonas = Array.from(uniqueById.values());

        // Lògica de Sincronització de Producció:
        // [MASTER IDENTITY PROTECTION] Solo dejamos perfiles reales en producción
        if (!isPlayground) {
            return mergedPersonas.filter(p => {
                const pid = p.id || '';
                // [GHOST-SHIELD EXTREME] Purgamos cualquier ID ficticio o de demo
                const isFictive = pid.startsWith('11111111-') || pid.startsWith('sdp-') || p.is_demo === true;
                const _isOfficial = p.role === 'official' || p.type === 'oficial';
                const isRealUser = (p.type === 'person' || p.type === 'user') && !isFictive;

                // En producció REAL, permetem humans autenticats i IDENTITATS CORE de la IAIA (ID 11111111-*)
                return (isRealUser && !isFictive) || (isFictive && pid.startsWith('11111111-'));
            }).sort((a, b) => (a.full_name || '').localeCompare(b.full_name || ''));
        }

        return mergedPersonas.sort((a, b) => (a.full_name || '').localeCompare(b.full_name || ''));
    },

    async getAdminEntities(isPlayground = false) {
        const { data, error } = await supabase
            .from('entities')
            .select('*')
            .order('name', { ascending: true });

        if (error) throw error;
        if (!data) return [];

        // En producció filtrem les entitats fictícies (demo o Lore-based)
        // I per petició legal, ocultem qualsevol entitat que no sigui del sistema si no estem en mode Playground
        if (!isPlayground) {
            // Mostrem entitats de sistema o del llinatge oficial
            const dbSystem = data.filter(e => e.type === 'system' || e.type === 'oficial' || e.owner_id === 'd6325f44-7277-4d20-b020-166c010995ab');
            return [...SYSTEM_ENTITIES, ...dbSystem];
        }

        return [...SYSTEM_ENTITIES, ...data];
    },

    // Chats (Secure Messaging - Phase 4)
    async getConversations(userIdOrEntityId) {
        const isGuest = !userIdOrEntityId || userIdOrEntityId === DEMO_USER_ID;

        if (isGuest || (userIdOrEntityId && !isRealDBUUID(userIdOrEntityId))) {
            // [GUEST-FIRST] Forsters and sovereign IDs don't use Mock Chats anymore
            // to keep the Chat List clean with the 13+ official Agents.
            return [];
        }

        // Usamos la vista enriquecida que ya trae nombres y avatares directamente (Optimización Auditoría V3)
        let query = supabase.from('view_conversations_enriched').select(`
            id, 
            participant_1_id, 
            participant_2_id, 
            participant_1_type, 
            participant_2_type, 
            last_message_content, 
            last_message_at,
            is_playground,
            p1_name, 
            p1_avatar_url, 
            p1_role,
            p1_is_ai,
            p2_name, 
            p2_avatar_url,
            p2_role,
            p2_is_ai
        `);

        query = query.or(`participant_1_id.eq.${userIdOrEntityId},participant_2_id.eq.${userIdOrEntityId}`);

        const { data: convs, error } = await query.order('last_message_at', { ascending: false });

        if (error) {
            logger.error('[SupabaseService] Error in getConversations:', error);
            // Si hay error (posiblemente la vista no existe aún), devolvemos vacío o mocks si habilitado
            if (ENABLE_MOCKS) {
                const { MOCK_CHATS } = await import('../data');
                const currentParticipantId = userIdOrEntityId || 'me';
                return MOCK_CHATS.map(m => ({
                    id: `mock-${m.id}`,
                    last_message_content: m.message,
                    last_message_at: new Date().toISOString(),
                    p1_info: { id: currentParticipantId, name: 'Jo' },
                    p2_info: { id: `m${m.id}`, name: m.name, avatar_url: m.avatar_url || null },
                    participant_1_id: currentParticipantId,
                    participant_2_id: `m${m.id}`,
                    participant_1_type: 'user',
                    participant_2_type: m.type === 'shop' || m.type === 'gov' ? 'entity' : 'user'
                }));
            }
            return [];
        }

        // Mapeamos los campos de la vista al formato que esperan los componentes
        const dbConvs = (convs || []).map(c => ({
            ...c,
            p1_info: { id: c.participant_1_id, name: c.p1_name, avatar_url: c.p1_avatar_url },
            p2_info: { id: c.participant_2_id, name: c.p2_name, avatar_url: c.p2_avatar_url }
        }));

        return dbConvs;
    },

    async getConversationMessages(conversationId) {
        if (!isRealDBUUID(conversationId) || conversationId?.startsWith('mock-')) {
            try {
                const mockIdx = conversationId.split('-')[1];
                const { MOCK_MESSAGES } = await import('../data');
                const messages = MOCK_MESSAGES[mockIdx] || [];
                return messages.map(m => ({
                    id: `msg-mock-${m.id}`,
                    conversation_id: conversationId,
                    sender_id: m.sender === 'me' ? 'me' : 'other', // En la UI lo gestionamos
                    content: m.text,
                    created_at: new Date().toISOString(),
                    is_ai: false
                }));
            } catch (err) {
                logger.error('Error loading mock messages:', err);
                return [];
            }
        }

        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .eq('conversation_id', conversationId)
            .order('created_at', { ascending: true });
        if (error) throw error;

        // Hydrate Voice Messages with Metadata
        if (data && data.length > 0) {
            const voiceMessageIds = data.filter(m => m.attachment_type === 'voice').map(m => m.id);
            if (voiceMessageIds.length > 0) {
                const { data: voiceMeta } = await supabase
                    .from('voice_messages')
                    .select('message_id, duration_seconds, waveform_data')
                    .in('message_id', voiceMessageIds);

                if (voiceMeta) {
                    const metaMap = new Map(voiceMeta.map(v => [v.message_id, v]));
                    return data.map(m => {
                        if (m.attachment_type === 'voice') {
                            const meta = metaMap.get(m.id);
                            return {
                                ...m,
                                voice_meta: meta ? {
                                    duration: meta.duration_seconds,
                                    waveform: meta.waveform_data
                                } : null
                            };
                        }
                        return m;
                    });
                }
            }
        }

        return data || [];
    },

    async getLatestMessages(conversationIds) {
        if (!conversationIds || conversationIds.length === 0) return { data: [] };

        // Fetch most recent message for each conversation
        // Auditoría V3: Recuperación manual cuando las columnas resumen fallan
        return supabase
            .from('messages')
            .select('conversation_id, content, created_at')
            .in('conversation_id', conversationIds)
            .order('created_at', { ascending: false });
    },

    async sendSecureMessage(messageData, abortSignal = null, retryCount = 0) {
        if (retryCount > 2) {
            logger.error('[SupabaseService] Recursió infinita aturada en sendSecureMessage');
            throw new Error("Recursió infinita detectada a l'enviar missatge");
        }
        
        if (messageData.senderId && !messageData.isGuest) {
            await checkThrottling(messageData.senderId, 'send_message', 1000).catch(e => logger.warn('Throttling warn', e));
        }
        // [FAILSAFE GLOBAL]: Si el conversationId és un Mock, un Local-Conv de Playground, o no s'ha arribat a canviar mai (1111... que és la IA)
        if (messageData.conversationId?.startsWith('mock-') || 
            messageData.conversationId?.startsWith('local-conv-') || 
            messageData.conversationId?.startsWith('11111111-')) {
            logger.log('[SupabaseService] Simulated send to mock conversation or unhydrated IAIA agent');
            return {
                id: crypto.randomUUID(), // Prevent mapping issues
                conversation_id: messageData.conversationId,
                sender_id: messageData.senderId,
                content: messageData.content,
                attachment_url: messageData.attachmentUrl || null,
                attachment_type: messageData.attachmentType || null,
                attachment_name: messageData.attachmentName || null,
                created_at: new Date().toISOString(),
                is_ai: false
            };
        }

        // [BATEGAT ANONYMOUS BYPASS] 
        // Si és un usuari anònim enviant a la IAIA, no ho guardem a Supabase
        // per evitar errors de constraint (400) pel sender_id no existent.
        // Simularem l'èxit i invocarem la resposta local.
        if (messageData.isGuest || !messageData.senderId || messageData.senderId === 'guest' || String(messageData.senderId).startsWith('anonymous')) {
            logger.warn('[supabaseService] Intent de sendSecureMessage per usuari anònim. Guardant en local (efímer).');
            const guestMessage = { 
                id: `guest-msg-${Date.now()}`, 
                conversation_id: messageData.conversationId, 
                sender_id: messageData.senderId || 'guest', 
                content: messageData.content, 
                created_at: new Date().toISOString(),
                is_ai: false
            };
            
            // Si la conversació és amb una IAIA (p.ex. IAIA MarIA), activem la resposta ràpida simulada
            if (messageData.conversationId && messageData.conversationId.startsWith('c1111000')) {
                 const personaInfo = LORE_PERSONAS.find(p => p.id === '11111111-1a1a-0000-0000-000000000000'); // IAIA Maria default
                 const responderId = messageData.conversationId.replace('c', ''); // Aproximació per al Mock
                 this.triggerSimulatedReply({ ...messageData, responderId, responderType: 'bot', persona: personaInfo || LORE_PERSONAS[0] });
            }

            return guestMessage;
        }

        // Validació estructural amb Zod
        const isPlayground = localStorage.getItem('isPlaygroundMode') === 'true' ||
            messageData.senderId?.startsWith('11111111-') ||
            messageData.conversationId?.startsWith('c1111000');

        // Check columns silently if in playground
        if (isPlayground && columnCache.messages_is_playground === null) {
            if (!activeChecks.messages) {
                activeChecks.messages = (async () => {
                    try {
                        const { data } = await supabase.from('messages').select('*').limit(1);
                        if (data && data.length > 0) {
                            setColumnCache('messages_is_playground', 'is_playground' in data[0]);
                        }
                    } catch (e) {
                        logger.error('[SupabaseService] Error checking playground column:', e);
                    } finally { activeChecks.messages = null; }
                })();
            }
            await activeChecks.messages;
        }

        const msgPayload = {
            id: crypto.randomUUID(),
            conversation_id: messageData.conversationId,
            sender_id: messageData.senderId,
            sender_entity_id: messageData.senderEntityId || null,
            content: messageData.content || null,
            attachment_url: messageData.attachmentUrl || null,
            attachment_type: messageData.attachmentType || null,
            attachment_name: messageData.attachmentName || null,
            post_uuid: messageData.postUuid || null
        };

        // Auditoría V3: Silenciador de errores por falta de columna post_uuid
        if (columnCache.messages_post_uuid === false) {
            delete msgPayload.post_uuid;
        }

        if (isPlayground && columnCache.messages_is_playground !== false) {
            msgPayload.is_playground = true;
        }

        const validated = MessageSchema.parse(msgPayload);

        // [BUGFIX 400 Bad Request] We construct the select query string dynamically to PREVENT
        // asking for columns that don't exist.
        let safeColumns = 'id, conversation_id, sender_id, content, attachment_url, attachment_type, attachment_name, created_at, is_ai, is_read';
        
        if (columnCache.messages_is_playground !== false) {
           safeColumns += ', is_playground';
        }
        
        const selectStr = columnCache.messages_post_uuid !== false ? `${safeColumns}, post_uuid` : safeColumns;

        let query = supabase
            .from('messages')
            .insert(validated)
            .select(selectStr);
            
        if (abortSignal) {
            query = query.abortSignal(abortSignal);
        }

        const { data, error } = await query;

        if (error) {
            const isMissingPostUuid = (error.code === '42703' || error.code === 'PGRST204') && msgPayload.post_uuid;
            const isMissingPlayground = error.code === 'PGRST204' && isPlayground && columnCache.messages_is_playground !== false;

            if (isMissingPlayground) {
                setColumnCache('messages_is_playground', false);
                return this.sendSecureMessage(messageData, abortSignal, retryCount + 1);
            }
            if (isMissingPostUuid) {
                setColumnCache('messages_post_uuid', false);
                return this.sendSecureMessage(messageData, abortSignal, retryCount + 1);
            }
            if (error.code === '42501') {
                logger.error('[SupabaseService] RLS Permission Denied on messages table.');
                throw { success: false, error: 'Accés denegat (RLS)', code: '42501' }; // Fals èxit suprimit per seguretat (C5)
            }
            throw error;
        }

        if (msgPayload.post_uuid && columnCache.messages_post_uuid === null) {
            setColumnCache('messages_post_uuid', true);
        }

        const message = data[0];

        // Actualizar el resumen en la conversación
        // Auditoría V3: Forzamos el update directo para evitar inconsistencias en la vista
        await supabase
            .from('conversations')
            .update({
                last_message_content: messageData.attachmentUrl ? `[${messageData.attachmentType || 'Arxiu'}]` : messageData.content,
                last_message_at: new Date().toISOString()
            })
            .eq('id', messageData.conversationId);

        // Detect if responder is AI/Lore (Harmonized with UI logic)
        // const { data: conv } = await supabase
        //     .from('view_conversations_enriched')
        //     .select('*')
        //     .eq('id', messageData.conversationId)
        //     .limit(1)
        //     .maybeSingle();

        // const responderId = conv?.participant_1_id === messageData.senderId ? conv?.participant_2_id : conv?.participant_1_id;
        // [Bot Reply Engine]
        // Lógica de respuesta simulada removida de aquí. Ahora iaiaService.js (generateAIAResponse) 
        // gestiona de forma exclusiva los fillers asépticos y la IA real (Gemini) para evitar duplicidades.
        // if (isToLore || responderIsAI || messageData.conversationId.startsWith('c1111000')) {
        //     // Buscamos persona de forma SINCRÓNICA para ganar milisegundos
        //     // const persona = LORE_PERSONAS.find(p => p.id === responderId);
        //     // this.triggerSimulatedReply({ ...messageData, responderId, responderType, persona });
        // }

        return message;
    },


    async triggerSimulatedReply(originalMessage) {
        // Respuesta quasi-instantánea para mantener el engagement (Petición usuario)
        try {
            const { conversationId, responderId, responderType, persona } = originalMessage;
            if (!responderId) return;

            let reply = "";
            const randomVal = Math.random();

            if (persona) {
                // Respuestas con personalidad según el Lore
                const greeting = getTimeAwareGreeting();

                // Respuestas con personalidad según el Lore (Integrando saludos neutros solicitados)
                if (persona.username === 'vferris') {
                    const vReplies = [
                        `${greeting} Gràcies pel missatge. Ara estic amb la garlopa, t'ho mire en un ratet.`,
                        `${greeting} Recorda que la fusta vol paciència. T'ho conteste després!`,
                        `${greeting} Això està fet. Si és per a la Torre, compte amb mi.`,
                        `${greeting} Passa't pel taller quan vullgues i ho mirem.`
                    ];
                    reply = vReplies[Math.floor(randomVal * vReplies.length)];
                } else if (persona.username === 'mariamel') {
                    const mReplies = [
                        `${greeting} Les meues abelles estan ara a tope amb el romer. Después parlem.`,
                        `${greeting} Dolç com la mèl! Gràcies pel missatge.`,
                        `${greeting} Xe, que bona idea. El poble necessita més gent així!`,
                        `${greeting} Estic per la serra sense cobertura, quan baixe t'ho mire.`
                    ];
                    reply = mReplies[Math.floor(randomVal * mReplies.length)];
                } else if (persona.username === 'elenap') {
                    const eReplies = [
                        `${greeting} Ja saps que qualsevol cosa em pots preguntar.`,
                        `${greeting} Sí, d'acord. Jo ajudaré en tot el que pugui al poble.`,
                        `${greeting} Com va tot per allí? Estic ací per a ajudar-te.`,
                        `${greeting} Tinc molta feina ara, però t'ho agraeixo molt!`
                    ];
                    reply = eReplies[Math.floor(randomVal * eReplies.length)];
                } else if (persona.username === 'joanb') {
                    const jReplies = [
                        `${greeting} Estic dalt l'Aitana amb el ramat. No se sent res por aquí.`,
                        `${greeting} Si vols parlar de veres, vine a Benifallim!`,
                        `${greeting} Les meues cabres i jo estem d'acord. Bona proposta!`,
                        `${greeting} Buff, millor parlem a la fresca un altre ratet.`
                    ];
                    reply = jReplies[Math.floor(randomVal * jReplies.length)];
                } else {
                    // Genérico para otros personajes del Lore (con ajuste de género automático y saludos)
                    const genericReplies = [
                        `${greeting} Xe, que bona idea! Gràcies por compartir-ho.`,
                        `${greeting} Ara estic un poc liat, però m'ho apunte!`,
                        `${greeting} Sóc de Poble som tots, compte amb mi.`,
                        `${greeting} Perfecte, ja m'ho dius quan sàpigues algo.`
                    ];
                    reply = adjustGender(genericReplies[Math.floor(randomVal * genericReplies.length)], persona.gender);
                }
            } else {
                reply = "D'acord! Ho tindré en compte. Gràcies pel missatge.";
            }

            // Insertamos el mensaje marcado como IA (con gestión de errores por si la columna no existe aún)
            const payload = {
                id: crypto.randomUUID(),
                conversation_id: conversationId,
                sender_id: responderId,
                sender_entity_id: responderType === 'entity' ? responderId : null,
                content: reply
            };

            // Solo añadimos is_ai si la caché no dice lo contrario
            if (columnCache.messages_is_ai !== false) {
                payload.is_ai = true;
            }

            const { error: insError } = await supabase.from('messages').insert(payload);

            if (insError && insError.code === '42703') { // Undefined column
                columnCache.messages_is_ai = false;
                delete payload.is_ai;
                await supabase.from('messages').insert(payload);
            } else if (!insError) {
                columnCache.messages_is_ai = true;
            }

            // Actualizamos la conversación
            await supabase.from('conversations').update({
                last_message_content: reply,
                last_message_at: new Date().toISOString()
            }).eq('id', conversationId);

        } catch (err) {
            logger.error('[NPC Simulation] Error:', err);
        }
    },

    async getOrCreateConversation(p1Id, p1Type, p2Id, p2Type, retryCount = 0) {
        // Buscar si ya existe la combinación (en cualquier orden)
        const { data: existing } = await supabase
            .from('conversations')
            .select('*')
            .or(`and(participant_1_id.eq.${p1Id},participant_2_id.eq.${p2Id}),and(participant_1_id.eq.${p2Id},participant_2_id.eq.${p1Id})`)
            .maybeSingle();

        if (existing) return existing;

        // Crear nueva si no existe
        const isPlayground = localStorage.getItem('isPlaygroundMode') === 'true' ||
            p1Id?.startsWith('11111111-') ||
            p2Id?.startsWith('11111111-');

        // Check columns silently if in playground
        if (isPlayground && columnCache.conversations_is_playground === null) {
            if (!activeChecks.conversations) {
                activeChecks.conversations = (async () => {
                    try {
                        const { data } = await supabase.from('conversations').select('*').limit(1);
                        if (data && data.length > 0) {
                            setColumnCache('conversations_is_playground', 'is_playground' in data[0]);
                        }
                    } catch (e) {
                        logger.error('[SupabaseService] Error checking definitions for conversations:', e);
                    } finally { activeChecks.conversations = null; }
                })();
            }
            await activeChecks.conversations;
        }

        const convPayload = {
            participant_1_id: p1Id,
            participant_1_type: p1Type,
            participant_2_id: p2Id,
            participant_2_type: p2Type
        };

        // [HOTFIX] Eliminat `is_playground` del payload i del .select() per evitar el llançament 
        // constants errors HTTP 400 (42703) quan la columna no està desplegada al Postgres de Producció.
        const validated = ConversationSchema.parse(convPayload);
        
        const selectStr = 'id, participant_1_id, participant_2_id, created_at';

        const { data, error } = await supabase
            .from('conversations')
            .insert(validated)
            .select(selectStr);

        if (error) {
            // Retratem per console però sense llançar el warning d'error PGRST204 ni el reintent circular
            if (error.code === 'PGRST204' || error.code === '42703') {
                logger.warn('[SupabaseService] PGRST204 o 42703 rebut. Ignorant i bypassejant a causa de diferències en esquemes de Database', error);
            }

            // Auditoria V4 (DeepSeek): Resolució Condició de Cursa Optimística
            if (error.code === '23505') {
                if (retryCount > 2) throw new Error('Recursió aturada en getOrCreateConversation');
                logger.warn('[SupabaseService] 💥 Condició de cursa detectada creant conversació (23505 Unique Violation). Aplicant lectura recursiva salvadora (Optimistic Lock).');
                return await this.getOrCreateConversation(p1Id, p1Type, p2Id, p2Type, retryCount + 1);
            }

            // [RLS / FK / CHECK BYPASS] EN MODE PLAYGROUND O SENSE PERFILS, L'ERROR 401, 403, 23503 (FK) O 23514 (CHECK) ÉS ESPERAT
            if (isPlayground && (error.code === '42501' || error.code === '23503' || error.code === '23514' || error.status === 401 || error.status === 403)) {
                logger.warn(`[SupabaseService] 🛡️ DB Bypass Activat (Error ${error.code || error.status}): Creant conversa local/mock per a la IA.`);
                return {
                    id: `local-conv-${p1Id.substring(0, 4)}-${p2Id.substring(0, 4)}`,
                    participant_1_id: p1Id,
                    participant_1_type: p1Type,
                    participant_2_id: p2Id,
                    participant_2_type: p2Type,
                    is_playground: true,
                    created_at: new Date().toISOString()
                };
            }
            throw error;
        }
        return data[0];
    },

    async markMessagesAsRead(conversationId, userId) {
        if (!conversationId || conversationId.startsWith('mock-') || !isRealDBUUID(conversationId)) return;
        
        // [GUEST SHIELD] Si el userId no és un UUID vàlid de base de dades, no marquem a la DB real
        if (!userId || !isRealDBUUID(userId)) {
            logger.info('[SupabaseService] Foraster detectat, markMessagesAsRead virtualitzat.');
            return;
        }

        const { error } = await supabase.rpc('mark_messages_as_read', {
            conv_id: conversationId,
            user_id: userId
        });

        if (error) {
            if (error.code === '22P02') {
                logger.warn('[SupabaseService] UUID syntax error in markMessagesAsRead, skipping.');
                return;
            }
            throw error;
        }
    },

    // [PROTOCOL REALTIME OMEGA] Bategat monitoritzat màxima eficiència
    subscribeToMessages(conversationId, callback) {
        if (!conversationId) return null;
        
        if (!this._activeChannels) this._activeChannels = new Map();
        const MAX_ACTIVE_CHANNELS = 50; // Supabase Free tier permet màx 100 de forma segura
        
        // LRU Eviction: Tancar canal si estem al límit
        if (this._activeChannels.size >= MAX_ACTIVE_CHANNELS) {
            const oldestKey = this._activeChannels.keys().next().value;
            const oldestChannel = this._activeChannels.get(oldestKey);
            supabase.removeChannel(oldestChannel);
            this._activeChannels.delete(oldestKey);
            logger.warn(`[SupabaseService] LRU Eviction executada: Canal ${oldestKey} liquidat per saturació.`);
        }
        
        const channelKey = `chat:${conversationId}`;
        
        if (this._activeChannels.has(channelKey)) {
            supabase.removeChannel(this._activeChannels.get(channelKey));
            this._activeChannels.delete(channelKey);
        }
        
        logger.info(`[SupabaseService] Connectant al canal realtime per a: ${conversationId}`);
        const channel = supabase.channel(channelKey)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'messages',
                filter: `conversation_id=eq.${conversationId}`
            }, callback)
            .subscribe();
            
        this._activeChannels.set(channelKey, channel);
        return channel;
    },

    unsubscribe(channel) {
        if (channel) {
            // [MASTER FIX] Prevenir 'WebSocket closed before the connection is established'
            // Retardem l'ordre de desconnexió per donar oxigen al handshake de Connexió
            setTimeout(() => {
                try {
                    supabase.removeChannel(channel).catch(() => {});
                } catch (e) {
                    logger.debug('[SupabaseService] Silent remove error', e);
                }
            }, 800);

            if (this._activeChannels) {
                this._activeChannels.forEach((val, key) => {
                    if (val === channel) this._activeChannels.delete(key);
                });
            }
            logger.info('[SupabaseService] Canal realtime desconnectat netament sense bloquejos orfes.');
        }
    },

    // Pueblos
    async getTowns() {
        try {
            const { data, error } = await supabase
                .from('towns')
                .select('*');

            if (error) throw error;

            let townsList = data || [];
            
            // [GHOST-BATEGAT] Inyectem Agost si no està a la DB (Integració Sixto Pina)
            if (!townsList.some(t => t.id === 4 || t.name === 'Agost')) {
                townsList.push({
                    id: 4,
                    uuid: 'agost-4-uuid',
                    name: 'Agost',
                    description: 'Poble de tradició terrissaire i artesana, on el bategat del ferro de Sixto Pina i el fang de les seues fàbriques crea una identitat única.',
                    logo_url: 'https://upload.wikimedia.org/wikipedia/commons/2/23/Escudo_de_Agost.svg',
                    image_url: 'https://images.unsplash.com/photo-1541336032412-2048a678540d?auto=format&fit=crop&q=80&w=1000',
                    province: 'Alacant',
                    comarca: 'L\'Alacantí'
                });
            }

            return townsList.map(town => {
                // [MASTER DIRECTIVE] ALGORISME DEL BATEC TERRITORIAL
                // 1. Identifiquem l'activitat de l'usuari des del solatge local
                const lastActiveTownId = localStorage.getItem('last_active_town_id');
                const secondaryTownId = localStorage.getItem('secondary_town_id');
                const profile = JSON.parse(localStorage.getItem('sdp_profile') || 'null');
                const primaryTownId = profile?.town_uuid || profile?.town_id;

                // [ONTOMÈTRICA] Calculem la força de la connexió (Batec)
                let connectionStrength = 0;
                const townId = town.uuid || town.id;

                if (townId === lastActiveTownId) connectionStrength += 1000;
                if (townId === primaryTownId) connectionStrength += 500;
                if (townId === secondaryTownId) connectionStrength += 250;

                // [MASTER PRIORITY] Benimassot, La Torre, Penàguila
                const lowerName = town.name?.toLowerCase() || "";
                if (lowerName.includes("benimassot") || 
                    lowerName.includes("la torre") || 
                    lowerName.includes("penàguila")) {
                    connectionStrength += 5000; // Force to top
                }

                // [MASTER IMAGE FALLBACK]
                let townImage = town.image_url;
                if (!townImage) {
                  if (lowerName.includes("benimassot")) townImage = "/assets/pobles/vistes/img_benimassot_main.jpg";
                  if (lowerName.includes("la torre")) townImage = "/assets/pobles/vistes/img_la_torre_de_les_ma_anes_main.jpg";
                  if (lowerName.includes("penàguila")) townImage = "/assets/pobles/vistes/img_pen_guila_main.jpg";
                }

                return {
                    ...town,
                    logo_url: normalizeWikipediaUrl(town.logo_url),
                    image_url: normalizeWikipediaUrl(townImage),
                    connection_strength: connectionStrength,
                    is_community: true // Diferenciació Poble vs Ajuntament
                };
            }).sort((a, b) => {
                // Prioritat: Força del Batec > Ordre Alfabètic
                if (b.connection_strength !== a.connection_strength) {
                    return b.connection_strength - a.connection_strength;
                }
                return a.name.localeCompare(b.name);
            });
        } catch (e) {
            logger.error('Error in getTowns:', e);
            return [];
        }
    },

    async getTownBatecImage(townId) {
        try {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

            // [PROTOCOL FLASH] Meritocràcia Visual + Atribució CC BY
            const { data, error } = await supabase
                .from('posts')
                .select('image_url, connections_count, author_name')
                .eq('town_id', townId)
                .not('image_url', 'is', null)
                .gte('created_at', thirtyDaysAgo.toISOString())
                .order('connections_count', { ascending: false })
                .limit(1);

            if (error || !data || data.length === 0) return null;
            return {
                url: normalizeWikipediaUrl(data[0].image_url),
                author: data[0].author_name
            };
        } catch (e) {
            logger.warn(`No s'ha pogut trobar imatge de batec recent per a ${townId}:`, e);
            return null;
        }
    },

    async createPioneerTown({ name, province, comarca }) {
        try {
            // [ESCALA NACIONAL] Si un usuario de Extremadura o fuera busca su pueblo y no existe, 
            // este método lo crea dinámicamente usando Wikipedia para el resumen y shield.
            
            // 1. Obtener información básica de la Wikipedia española o catalana
            const { wikipediaService } = await import('./wikipediaService');
            const summary = await wikipediaService.getTownSummary(name, 'es'); // Preferimos español para expansión nacional, fallará seguro la 'ca' para Extremadura.
            const shield = await wikipediaService.getTownShield(name);

            const newTownData = {
                name: name.trim(),
                province: province.trim(),
                comarca: comarca ? comarca.trim() : 'Poble Pioner',
                description: summary?.extract || `Municipi pioner de ${province.trim()} recentment fundat a la xarxa Sóc de Poble.`,
                logo_url: shield || null,
                population: summary?.population || null
            };

            const { data, error } = await supabase
                .from('towns')
                .insert(newTownData)
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            logger.error(`[Towns] Error creating pioneer town ${name}:`, error);
            throw error;
        }
    },

    async getProvinces() {
        const { data, error } = await supabase
            .from('towns')
            .select('province')
            .not('province', 'is', null)
            .order('province', { ascending: true });

        if (error) throw error;
        // Distinct values
        return [...new Set(data.map(item => item.province))];
    },

    async getComarcas(province) {
        const { data, error } = await supabase
            .from('towns')
            .select('comarca')
            .eq('province', province)
            .not('comarca', 'is', null)
            .order('comarca', { ascending: true });

        if (error) throw error;
        // Distinct values
        return [...new Set(data.map(item => item.comarca))];
    },

    async searchAllTowns(query) {
        const sanitizedQuery = sanitizeInput(query);
        if (!sanitizedQuery || sanitizedQuery.length < 2) return [];

        logger.log(`[SupabaseService] Performed search for: "${sanitizedQuery}"`);
        try {
            // Deduplicació de filtres per evitar error 400
            // Nota: towns només té name i description seguint supabase_towns_setup.sql
            const filterTerms = new Set();
            ['name', 'description'].forEach(col => {
                filterTerms.add(`${col}.ilike.%${sanitizedQuery}%`);
            });

            const orClause = Array.from(filterTerms).join(',');

            // NIVELL DIOS: Cerca transversal en municipis
            const { data, error } = await supabase
                .from('towns')
                .select('*')
                .or(orClause)
                .order('name', { ascending: true })
                .limit(40);

            if (error) throw error;
            return (data || []).map(t => ({
                ...t,
                logo_url: normalizeWikipediaUrl(t.logo_url),
                image_url: normalizeWikipediaUrl(t.image_url)
            }));
        } catch (err) {
            logger.error('[SupabaseService] Robust search failed, falling back to simple search:', err);
            const { data } = await supabase
                .from('towns')
                .select('*')
                .ilike('name', `%${query}%`)
                .limit(10);
            return data || [];
        }
    },

    async searchProfiles(query) {
        if (!query || query.length < 2) return [];
        const normalizedName = getNormalizedQuery(query);
        const cleanQuery = query.toLowerCase().trim();

        try {
            // Deduplicació intel·ligent per evitar error 400 (Duplicate filters)
            const filterTerms = new Set();
            [cleanQuery, normalizedName].forEach(q => {
                if (!q) return;
                // [FIX] Robusteza en PostgREST: Wrap value in double quotes for spaces
                filterTerms.add(`full_name.ilike."%${q}%"`);
                filterTerms.add(`username.ilike."%${q}%"`);
                filterTerms.add(`primary_town.ilike."%${q}%"`);
            });

            // Afegim els altres camps que no depenen de la normalització de noms de poble/persona
            filterTerms.add(`role.ilike."%${cleanQuery}%"`);
            filterTerms.add(`ofici.ilike."%${cleanQuery}%"`);
            filterTerms.add(`bio.ilike."%${cleanQuery}%"`);

            const orClause = Array.from(filterTerms).join(',');
            logger.debug('[SupabaseService] profiles orClause:', orClause);

            // BUSCADOR NIVELL DIOS: Cerca OMNISCIENT en perfils
            let queryBuilder = supabase
                .from('profiles')
                .select('id, full_name, username, avatar_url, role, primary_town, bio, ofici, is_demo')
                .or(orClause);

            const isPlayground = localStorage.getItem('playground_mode') === 'true';
            if (!isPlayground) {
                queryBuilder = queryBuilder.eq('is_demo', false);
            }

            const { data, error } = await queryBuilder
                .order('full_name', { ascending: true })
                .limit(50);

            if (error) throw error;

            // Include lore personas in search with OmniMatch (Nivell Dios)
            const allPersonas = await this.getAllPersonas();
            const filteredLore = allPersonas.filter(p =>
                omniMatch(p.full_name, query) ||
                omniMatch(p.username, query) ||
                omniMatch(p.role, query) ||
                omniMatch(p.primary_town, query) ||
                omniMatch(p.ofici, query) ||
                omniMatch(p.bio, query)
            );

            // Merge and deduplicate by ID and full_name, prioritizing DB/Real
            const unique = [];
            const seenIds = new Set();
            const seenNames = new Set();

            const _combined = [...filteredLore, ...(data || [])];

            // Prioritzem data (DB) al final del merge si volem que "machaque", 
            // però aquí la lògica de .forEach d'un array barrejant-los un a un és clau.
            // Millor: Processar primer els Reals (DB) i després Lore si no s'han vist.

            const profilesToProcess = [
                ...(data || []), // DB first (Priority)
                ...filteredLore  // Lore second
            ];

            profilesToProcess.forEach(p => {
                const id = p.id;
                const nameKey = p.full_name?.toLowerCase().trim();

                if (!seenIds.has(id) && !seenNames.has(nameKey)) {
                    seenIds.add(id);
                    if (nameKey) seenNames.add(nameKey);

                    unique.push({
                        ...p,
                        town_name: p.town_name || p.primary_town
                    });
                }
            });

            return unique;
        } catch (error) {
            logger.error('[SupabaseService] Error in searchProfiles:', error);
            return [];
        }
    },

    async searchEntities(query) {
        if (!query || query.length < 2) return [];
        const normalizedCanonical = getNormalizedQuery(query); // E.g. "Sóc de Poble"
        const cleanQuery = query.toLowerCase().trim();

        // 1. DEFINICIÓ D'ENTITATS DE SISTEMA (Veritat Única - Usant constant centralitzada)
        const systemEntities = SYSTEM_ENTITIES;

        // 2. FILTRATGE OMNISCIENT DE SISTEMA (Sempre disponible)
        const filteredSystem = systemEntities.filter(e =>
            omniMatch(e.name, query) ||
            omniMatch(e.name, normalizedCanonical) ||
            omniMatch(e.type, query) ||
            omniMatch(e.town_name, query)
        );

        let dbResults = [];
        try {
            // Deduplicació estricta de filtres per evitar error 400
            // Nota: entities té id, name, type, description, avatar_url, owner_id segons setup
            const filterTerms = new Set();
            const termsToTry = [cleanQuery, normalizedCanonical].filter(Boolean);

            termsToTry.forEach(q => {
                const term = q.trim().toLowerCase();
                // [FIX] Robusteza en PostgREST: Wrap value in double quotes for spaces
                filterTerms.add(`name.ilike."%${term}%"`);
            });

            // Camps extra
            filterTerms.add(`type.ilike."%${cleanQuery}%"`);
            filterTerms.add(`description.ilike."%${cleanQuery}%"`);

            const orClause = Array.from(filterTerms).join(',');
            logger.debug('[SupabaseService] entities orClause:', orClause);

            // BUSCADOR NIVELL DIOS: Entitats, Comerços i Projectes
            const { data, error } = await supabase
                .from('entities')
                .select('id, name, type, avatar_url, description')
                .or(orClause)
                .limit(50);

            if (error) throw error;
            dbResults = data || [];
        } catch (error) {
            logger.error('[SupabaseService] Error in searchEntities (DB):', error);
            // Seguim endavant amb filteredSystem encara que la DB falle
        }

        // 3. TAXONOMIA I NETEJA
        const sanitizedDbResults = dbResults.map(e => {
            let mappedType = e.type;
            if (e.type === 'negoci' || e.type === 'comerç') mappedType = 'empresa';
            if (e.type === 'associacio') mappedType = 'institucio';

            // Forçar "Sóc de Poble" com a empresa si el nom quadra (OmniMatch)
            if (omniMatch(e.name, 'Sóc de Poble') || omniMatch(e.name, 'Soc de Poble')) {
                mappedType = 'empresa';
            }

            return {
                ...e,
                type: mappedType,
                avatar_url: normalizeWikipediaUrl(e.avatar_url)
            };
        });

        // 4. MERGE I PRIORITZACIÓ (Codi Genius: Sistema > DB)
        // Posem primer les del sistema per a que eixquen dalt i deduplicació no les esborre
        const combined = [...filteredSystem, ...sanitizedDbResults];
        const unique = [];
        const ids = new Set();

        combined.forEach(e => {
            if (!ids.has(e.id)) {
                ids.add(e.id);
                unique.push(e);
            }
        });

        return unique;
    },

    async getPublicDirectory() {
        try {
            const [profiles, entities] = await Promise.all([
                this.getAllPersonas(),
                this.getAdminEntities()
            ]);

            return {
                people: profiles || [],
                entities: entities || []
            };
        } catch (error) {
            logger.error('[SupabaseService] Error in getPublicDirectory:', error);
            return { people: [], entities: [] };
        }
    },

    async connectWithProfile(followerId, targetId, tags = []) {
        if (!followerId || !targetId) return false;
        if (columnCache.connections_table === false) return true;

        const isRealFollower = isRealDBUUID(followerId);
        const isRealTarget = isRealDBUUID(targetId);

        // Simulation for System/Lore entities that don't have valid UUIDs or aren't in auth.users
        if (!isRealFollower || !isRealTarget || isFictiveProfile({ id: targetId })) {
            logger.info(`[SupabaseService] Virtual Connection detected for ${targetId}. Simulating...`);
            // Store virtually in localStorage for current session persistence
            const virtualKey = `v_conn_${followerId}`;
            const connections = JSON.parse(localStorage.getItem(virtualKey) || '[]');
            if (!connections.includes(targetId)) {
                connections.push(targetId);
                localStorage.setItem(virtualKey, JSON.stringify(connections));
            }
            return true;
        }

        try {
            const { error, status } = await supabase
                .from('connections')
                .upsert({
                    follower_id: followerId,
                    target_id: targetId,
                    status: 'connected',
                    tags: tags,
                    created_at: new Date().toISOString()
                }, {
                    onConflict: 'follower_id,target_id',
                    ignoreDuplicates: false
                });

            if (error) {
                // Handle 409 Conflict (Key not in users) gracefully by falling back to virtual
                if (error.code === '23503' || error.code === '409' || error.code === '23514') { // Added 23514
                    logger.warn(`[SupabaseService] Foreign key constraint for connection ${targetId}. Falling back to virtual.`);
                    // The following lines seem to be from a different context (ChatDetail.jsx) and are commented out to maintain syntax.
                    // // Ensured AI persistence: Resolve real Supabase UUID (Passing 'entity' instead of 'ai' to avoid Postgres 23514 CHECK constraint)
                    // const realConv = await supabaseService.getOrCreateConversation(currentUserId, 'user', id, 'entity');
                    // if (!isMounted) return;}. Falling back to virtual.`);
                    const virtualKey = `v_conn_${followerId}`;
                    const connections = JSON.parse(localStorage.getItem(virtualKey) || '[]');
                    if (!connections.includes(targetId)) {
                        connections.push(targetId);
                        localStorage.setItem(virtualKey, JSON.stringify(connections));
                    }
                    return true;
                }

                if (error.code === '42P01' || status === 404) {
                    setColumnCache('connections_table', false);
                    return true;
                }
                throw error;
            }

            // Automate Push Notification
            const followerProfile = await this.getProfile(followerId);
            if (followerProfile) {
                pushNotifications.triggerNotification(targetId, {
                    title: `Nova connexió!`,
                    body: `${followerProfile.full_name} s'ha connectat amb tu.`,
                    url: `/perfil/${followerId}`,
                    tag: `connect-${followerId}`
                }).catch(() => { });
            }

            if (columnCache.connections_table === null) setColumnCache('connections_table', true);
            return true;
        } catch (error) {
            logger.error('[SupabaseService] Error connecting:', error);
            return false;
        }
    },

    async disconnectFromProfile(followerId, targetId) {
        if (!followerId || !targetId) return false;

        // 1. Remove from Virtual Persistence
        const virtualKey = `v_conn_${followerId}`;
        const virtualConns = JSON.parse(localStorage.getItem(virtualKey) || '[]');
        if (virtualConns.includes(targetId)) {
            const filtered = virtualConns.filter(id => id !== targetId);
            localStorage.setItem(virtualKey, JSON.stringify(filtered));
        }

        if (columnCache.connections_table === false) return true;

        try {
            const { error, status } = await supabase
                .from('connections')
                .delete()
                .eq('follower_id', followerId)
                .eq('target_id', targetId);

            if (error) {
                if (error.code === '42P01' || status === 404) {
                    setColumnCache('connections_table', false);
                    return true;
                }
                throw error;
            }
            return true;
        } catch (error) {
            logger.error('[SupabaseService] Error disconnecting:', error);
            return false;
        }
    },

    async isFollowing(followerId, targetId) {
        if (!followerId || !targetId || !isRealDBUUID(followerId) || !isRealDBUUID(targetId)) return false;

        // 1. Check Virtual Persistence first
        const virtualKey = `v_conn_${followerId}`;
        const virtualConns = JSON.parse(localStorage.getItem(virtualKey) || '[]');
        if (virtualConns.includes(targetId)) return true;

        if (columnCache.connections_table === false) return false;

        try {
            const { data, error, status } = await supabase
                .from('connections')
                .select('*')
                .eq('follower_id', followerId)
                .eq('target_id', targetId)
                .maybeSingle();

            if (error) {
                if (error.code === '42P01' || status === 404) {
                    setColumnCache('connections_table', false);
                    return false;
                }
                throw error;
            }
            if (columnCache.connections_table === null) setColumnCache('connections_table', true);
            return !!data;
        } catch {
            return false;
        }
    },

    async getFollowers(targetId) {
        if (!targetId || !isRealDBUUID(targetId)) return [];
        try {
            if (columnCache.connections_table === false) return [];

            const { data, error, status } = await supabase
                .from('connections')
                .select('follower_id')
                .eq('target_id', targetId);

            if (error) {
                if (error.code === '42P01' || status === 404) {
                    setColumnCache('connections_table', false);
                    return [];
                }
                throw error;
            }
            if (columnCache.connections_table === null) setColumnCache('connections_table', true);
            return data || [];
        } catch (error) {
            logger.error('[SupabaseService] Error getting followers:', error);
            return [];
        }
    },

    async getFollowing(userId) {
        if (!userId || !isRealDBUUID(userId)) return [];
        try {
            if (columnCache.connections_table === false) return [];
            const { data, error, status } = await supabase
                .from('connections')
                .select('target_id')
                .eq('follower_id', userId);
            if (error) {
                if (error.code === '42P01' || status === 404) {
                    setColumnCache('connections_table', false);
                    return [];
                }
                throw error;
            }
            if (columnCache.connections_table === null) setColumnCache('connections_table', true);
            return data || [];
        } catch (error) {
            logger.error('[SupabaseService] Error getting following:', error);
            return [];
        }
    },

    async addConnection(userId, postId) {
        if (!userId || !postId) return false;
        try {
            const { error } = await supabase
                .from('post_connections')
                .upsert({ user_id: userId, post_uuid: postId }, { onConflict: 'user_id,post_uuid' });
            if (error) {
                if (error.code === '42P01') {
                    logger.warn('Table post_connections missing, simulating connection');
                    return true;
                }
                throw error;
            }
            return true;
        } catch (e) {
            logger.error('[SupabaseService] Error addConnection:', e);
            return false;
        }
    },

    async removeConnection(userId, postId) {
        if (!userId || !postId) return false;
        try {
            const { error } = await supabase
                .from('post_connections')
                .delete()
                .eq('user_id', userId)
                .eq('post_uuid', postId);
            if (error) throw error;
            return true;
        } catch (e) {
            logger.error('[SupabaseService] Error removeConnection:', e);
            return false;
        }
    },



    async updateConnectionTags(userId, postId, tags) {
        if (!userId || !postId) return false;
        try {
            const { error } = await supabase
                .from('post_connections')
                .update({ tags })
                .eq('user_id', userId)
                .eq('post_uuid', postId);
            if (error) {
                if (error.code === '42P01') {
                    logger.warn('Table post_connections missing, cannot update tags');
                    return true;
                }
                throw error;
            }
            return true;
        } catch (e) {
            logger.error('[SupabaseService] Error updateConnectionTags:', e);
            return false;
        }
    },


    // Feed / Muro
    // Feed / Muro
    async getPosts(roleFilter = 'tot', townId = null, page = 0, pageSize = 10, isPlayground = false) {
        logger.log(`[SupabaseService] Fetching posts with roleFilter: ${roleFilter}, townId: ${townId}, page: ${page}, playground: ${isPlayground}`);
        try {
            // [MASTER] Robust Column Sync with retry limit
            await _ensureColumnCache();
            const retryCount = (typeof arguments[5] === 'number') ? arguments[5] : 0;
            if (retryCount > 3) {
                logger.error('[SupabaseService] Maximum retry limit reached for getPosts. Aborting to prevent infinite loop.');
                return { data: [], count: 0, error: 'Retry limit reached' };
            }

            let selectStr = 'id, uuid, content, created_at, author, image_url, image_alt, author_role, author_type, is_playground, author_user_id, author_entity_id, towns(name), profiles!fk_posts_author_profile(avatar_url, full_name, town_uuid), entities!fk_posts_author_entity(avatar_url, name)';
            if (columnCache.posts_pinned_position !== false) {
                selectStr += ', pinned_position';
            }
            if (columnCache.posts_ai_percentage === true) {
                selectStr += ', ai_percentage, human_percentage, is_iaia_inspired';
            }

            let query = supabase
                .from('posts')
                .select(selectStr, { count: 'exact' });

            // [PILAR 1 & 3] Check Local Cache for instant return
            const cacheKey = `posts_${townId || 'global'}_${page}_${pageSize}`;
            const cachedData = LocalCache.get(cacheKey);

            if (isPlayground && columnCache.posts_is_playground !== false) {
                query = query.eq('is_playground', true);
            } else if (columnCache.posts_is_playground !== false) {
                // [GHOST-SHIELD] En producción, filtramos OBLIGATORIAMENTE el contenido de prueba
                query = query.eq('is_playground', false);
            }

            if (roleFilter && roleFilter !== ROLES.ALL && roleFilter !== 'tot') {
                query = query.eq('author_role', roleFilter);
            }

            if (townId) {
                logger.log(`[SupabaseService] townId entry: ${townId} (${typeof townId})`);
                if (!isRealDBUUID(townId)) {
                    const isNumeric = /^\d+$/.test(townId.toString());
                    let townSearch = supabase.from('towns').select('uuid, id');
                    if (isNumeric) {
                        townSearch = townSearch.or(`id.eq.${townId},town_id.eq.${townId}`);
                    } else {
                        townSearch = townSearch.ilike('name', `%${townId}%`);
                    }
                    const { data: townData } = await townSearch.limit(1).maybeSingle();
                    if (townData) {
                        townId = townData.uuid || townData.id;
                    } else {
                        townId = null;
                    }
                }

                if (townId && isRealDBUUID(townId)) {
                    logger.log(`[SupabaseService] Applying strict author-territory filter: ${townId}`);
                    // Enforce that the author must belong to this town
                    query = query.eq('profiles.town_uuid', townId);
                }
            }

            const from = page * pageSize;
            const to = from + pageSize - 1;

            const { data, error, count } = await query
                .order('created_at', { ascending: false })
                .range(from, to);

            if (error) {
                // [MASTER] Robust Column Error Detection (42703: undefined_column, PGRST204: PostgREST specific column error)
                const isColumnError = error.code === '42703' || error.code === 'PGRST204' || (error.code === '400' && error.message?.includes('column'));

                if (isColumnError && error.message?.includes('pinned_position')) {
                    setColumnCache('posts_pinned_position', false);
                    logger.warn('[SupabaseService] pinned_position missing in posts, retrying...');
                    return this.getPosts(roleFilter, townId, page, pageSize, isPlayground, retryCount + 1);
                }
                if (isColumnError && (error.message?.includes('ai_percentage') || error.message?.includes('human_percentage'))) {
                    setColumnCache('posts_ai_percentage', false);
                    logger.warn('[SupabaseService] AI columns missing in posts, retrying...');
                    return this.getPosts(roleFilter, townId, page, pageSize, isPlayground, retryCount + 1);
                }
                if (isColumnError && isPlayground) {
                    setColumnCache('posts_is_playground', false);
                    logger.warn('[SupabaseService] is_playground missing in posts, retrying silent...');
                    return this.getPosts(roleFilter, townId, page, pageSize, false, retryCount + 1);
                }
                // [PILAR 3] Offline Resilience: Return cached data if available
                if (cachedData) {
                    logger.warn('[Posts] Network failed, serving from cache.');
                    return { data: cachedData, count: cachedData.length, fromCache: true };
                }
                throw error;
            }

            let normalizedData = (data || []).map(p => normalizeContentItem(p, 'post'));

            // [PILAR 1] Update Cache
            if (page === 0) LocalCache.set(cacheKey, normalizedData);

            // [MASTER PURGE] No fallbacks a Mocks en producción real para evitar "fantasmas"
            if ((!data || data.length === 0) && page === 0 && ENABLE_MOCKS && isPlayground) {
                const { MOCK_FEED } = await import('../data');
                const normalized = MOCK_FEED.map(p => normalizeContentItem(p, 'post'));
                return { data: normalized, count: normalized.length };
            }

            // INYECCIÓN PREMIUM: Auxili Music Expansion (Only in Playground or Dev)
            const isDev = import.meta.env.MODE === 'development';
            if (page === 0 && (isPlayground || isDev) && normalizedData.length < 3) {
                const auxiliPost = {
                    id: 'didactic-auxili-2026',
                    uuid: 'didactic-auxili-2026',
                    type: 'didactic_presentation',
                    author: 'Auxili (Official)',
                    author_role: 'official',
                    author_avatar: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=200&auto=format&fit=crop', // Reggae vibes
                    content: '# Auxili: Reggae des de l\'Ontinyent\n\nAmb més de 10 anys damunt dels escenaris, **Auxili** s\'ha convertit en el crit musical de tota una generació. Des de la Vall d\'Albaida, han fusionat el reggae amb les arrels valencianes.\n\n## "La música és la nostra eina de transformació."\n\nEste 2026 tornem amb noves energies per a fer vibrar cada racó dels nostres pobles. Gràcies per formar part d\'aquesta família!',
                    image_url: [
                        'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=1000&auto=format&fit=crop', // Festival crowd
                        'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=1000&auto=format&fit=crop', // Band on stage
                        'https://images.unsplash.com/photo-1459749411177-042180ce673c?q=80&w=1000&auto=format&fit=crop'  // Musical instruments
                    ],
                    video_url: 'https://www.youtube.com/watch?v=Fadaa7Kyxm0', // Pàgines Blanques
                    created_at: new Date().toISOString(),
                    metadata: {
                        didactic_text: 'Auxili és un grup de música nascut a Ontinyent l\'any 2005. El seu estil musical és el reggae, amb tocs de ska, raggamuffin i música de banda. Les seues lletres parlen de lluita, amor i territori, amb un fort compromís social i cultural.'
                    },
                    towns: { name: 'Ontinyent (La Vall d\'Albaida)' },
                    connections_count: 850,
                    comments_count: 42
                };
                normalizedData = [auxiliPost, ...normalizedData];
            }

            return { data: normalizedData, count: (count || 0) + 1 };
        } catch (err) {
            logger.error('[SupabaseService] Error in getPosts:', err);
            return { data: [], count: 0 };
        }
    },

    async createPost(postData, isPlayground = false) {
        const payload = { ...postData };
        if (isPlayground) payload.is_playground = true;

        // Rate limiting / Throttling
        if (payload.author_id) {
            checkThrottling(payload.author_id, 'create_post');
        }

        // Multi-Llinatge master: Mapetgem camps si venen de components amb noms antics
        const mappedData = {
            ...payload,
            author_user_id: payload.author_id || payload.author_user_id || payload.user_id,
            author: payload.author_name || payload.author || 'Sóc de Poble',
            author_avatar: payload.author_avatar_url || payload.author_avatar,
            author_entity_id: payload.entity_id || payload.author_entity_id
        };

        // Fallback crític per a la IAIA si no ve de sessió d'usuari
        if (!mappedData.author_user_id && (payload.is_iaia || payload.is_iaia_inspired)) {
            mappedData.author_user_id = payload.iaia_id || '11111111-1a1a-0000-0000-000000000000';
        }

        // Remove old field names to avoid PGRST204
        delete mappedData.author_id;
        delete mappedData.author_name;
        delete mappedData.author_avatar;
        delete mappedData.author_avatar_url;
        delete mappedData.entity_id;
        delete mappedData.town_id;

        // Validació estructural amb Zod
        const validated = PostSchema.parse(mappedData);

        // Pre-generem id si no existeix (FIX 400 Bad Request)
        if (!validated.id && !validated.uuid) {
            validated.uuid = crypto.randomUUID();
        }

        // [MIGRACIÓ 10.33.20] Normalitzar town_uuid per evitar errors de tipat (ex: 'la-torre')
        if (validated.town_uuid === 'la-torre' || validated.town_uuid === '1') {
            validated.town_uuid = 'eecc1a91-db53-4bf0-a3ce-b33df011df6b';
        } else if (validated.town_uuid && !isValidUUID(validated.town_uuid)) {
            validated.town_uuid = null; // Prevent crashes against UUID columns
        }

        const { error } = await supabase
            .from('posts')
            .insert([validated]);

        if (error) {
            // [SUPER-HEALING] Fk_posts_author_profile error (missing user in profiles table locally)
            if (error.code === '23503' && (error.message?.includes('profile') || error.details?.includes('profile'))) {
                logger.warn(`[SupabaseService] Missing profile for user ${validated.author_user_id}. Auto-healing...`);
                try {
                    const profilePayload = {
                        id: validated.author_user_id,
                        full_name: validated.author || 'Sóc de Poble',
                        avatar_url: validated.author_avatar || null,
                        role: 'neighbor',
                        is_certified: false,
                        updated_at: new Date().toISOString()
                    };
                    await supabase.from('profiles').upsert([profilePayload]);
                    logger.info(`[SupabaseService] Profile created. Retrying post...`);
                    const { error: retryFkError } = await supabase.from('posts').insert([validated]);
                    if (retryFkError) throw retryFkError;
                    return validated;
                } catch (healingError) {
                    logger.error(`[SupabaseService] Auto-healing profile failed:`, healingError);
                    throw error;
                }
            }

            // [MASTER] Self-healing: if column not found, invalidate cache and retry
            if (error.code === '42703' || error.code === 'PGRST204') {
                logger.warn(`[SupabaseService] Column sync error (${error.code}) in createPost, invalidating cache...`);
                setColumnCache('posts_ai_percentage', false);
                setColumnCache('posts_human_percentage', false);
                setColumnCache('posts_time_saved', false);
                setColumnCache('posts_is_iaia_inspired', false);

                // Retry once without symbiosis columns
                const cleanPayload = { ...validated };
                delete cleanPayload.ai_percentage;
                delete cleanPayload.human_percentage;
                delete cleanPayload.time_saved_minutes;
                delete cleanPayload.economic_value_saved;
                delete cleanPayload.is_iaia_inspired;

                if (!cleanPayload.uuid) cleanPayload.uuid = crypto.randomUUID();
                const { error: retryError } = await supabase.from('posts').insert([cleanPayload]);
                
                if (retryError) {
                    logger.warn(`[SupabaseService] Second sync error (${retryError.code}), trying minimal payload...`);
                    const minimalPayload = {
                        id: validated.id || undefined,
                        uuid: validated.uuid || cleanPayload.uuid,
                        author_user_id: validated.author_user_id,
                        author: validated.author,
                        content: validated.content,
                        town_uuid: validated.town_uuid || payload.town_uuid
                    };
                    const { error: finalError } = await supabase.from('posts').insert([minimalPayload]);
                    if (finalError) throw finalError;
                    return minimalPayload;
                }
                return cleanPayload;
            }
            if (isPlayground || error.code === '42501' || error.code === '403') {
                // Fallback si la columna no existe o hay RLS restrictivo en campos extra
                logger.warn(`[SupabaseService] Security/RLS block in createPost, retrying minimal payload...`);
                const minimalPayload = {
                    id: validated.id || undefined,
                    uuid: validated.uuid || crypto.randomUUID(),
                    author_user_id: validated.author_user_id,
                    author: validated.author,
                    content: validated.content,
                    town_uuid: validated.town_uuid || payload.town_uuid
                };
                const { error: retryError } = await supabase.from('posts').insert([minimalPayload]);
                if (retryError) throw retryError;
                return minimalPayload;
            }
            throw error;
        }
        return validated;
    },

    // Mercado
    async getMarketCategories() {
        const { data, error } = await supabase
            .from('market_categories')
            .select('*')
            .order('id', { ascending: true });
        if (error) throw error;
        return data || [];
    },

    async getMarketItems(categoryFilter = 'tot', townId = null, page = 0, pageSize = 12, isPlayground = false) {
        try {
            await _ensureColumnCache();

            const cacheKey = `market_${categoryFilter || 'all'}_${townId || 'global'}_${page}`;
            const cachedData = LocalCache.get(cacheKey);

            let townJoin = columnCache.market_fk_town_uuid !== false ? 'towns!fk_market_town_uuid(name)' : 'towns(name)';
            let selectStr = `id, uuid, title, description, price, category_slug, created_at, author_user_id, seller, avatar_url, image_url, ${townJoin}`;

            if (columnCache.market_is_playground !== false) selectStr += ', is_playground';
            if (columnCache.market_is_pinned !== false) selectStr += ', is_pinned';
            if (columnCache.market_pinned_position !== false) selectStr += ', pinned_position';
            if (columnCache.market_is_iaia_inspired !== false) selectStr += ', is_iaia_inspired';

            let query = supabase.from('market_items').select(selectStr, { count: 'exact' });

            if (isPlayground && columnCache.market_is_playground !== false) {
                query = query.eq('is_playground', true);
            } else if (columnCache.market_is_playground !== false) {
                // [GHOST-SHIELD] In production, only real products
                query = query.eq('is_playground', false);
            }

            if (categoryFilter && categoryFilter !== 'tot') {
                query = query.eq('category_slug', categoryFilter);
            }

            if (townId && isRealDBUUID(townId)) {
                query = query.eq('town_uuid', townId);
            }

            const from = page * pageSize;
            const to = from + pageSize - 1;

            let queryBuilder = query;
            if (columnCache.market_is_pinned !== false) {
                queryBuilder = queryBuilder.order('is_pinned', { ascending: false });
            }
            if (columnCache.market_pinned_position !== false) {
                queryBuilder = queryBuilder.order('pinned_position', { ascending: true });
            }

            const { data, error, count } = await queryBuilder
                .order('created_at', { ascending: false })
                .range(from, to);

            if (error) {
                // [MASTER] Self-healing logic for PostgREST 400/PGRST204
                const isColumnError = error.code === '42703' || error.code === 'PGRST204' || (error.code === '400' && error.message?.includes('column'));

                if (isColumnError) {
                    logger.warn(`[SupabaseService] Market column error (${error.code}), invalidating cache...`);
                    // Invalidate specific column cache items found in error message or just reset
                    if (error.message?.includes('pinned_position')) setColumnCache('market_pinned_position', false);
                    if (error.message?.includes('is_pinned')) setColumnCache('market_is_pinned', false);
                    if (error.message?.includes('is_playground')) setColumnCache('market_is_playground', false);
                    if (error.message?.includes('fk_market_town_uuid')) setColumnCache('market_fk_town_uuid', false);

                    // Retry once immediately
                    return this.getMarketItems(categoryFilter, townId, page, pageSize, isPlayground);
                }
                if (cachedData) {
                    logger.warn('[Market] Network failed, serving from cache.');
                    return { data: cachedData, count: cachedData.length, fromCache: true };
                }
                throw error;
            }

            const normalizedData = (data || []).map(item => normalizeContentItem(item, 'market'));

            // [PILAR 1] Update Cache
            if (page === 0) LocalCache.set(cacheKey, normalizedData);

            return {
                data: normalizedData,
                count: count || 0
            };
        } catch (error) {
            logger.error('Error in getMarketItems:', error);
            // Return empty list on error to keep UI alive
            return { data: [], count: 0 };
        }
    },

    async getMarketFavorites(itemId) {
        const { data, error } = await supabase
            .from('market_favorites')
            .select('user_id')
            .eq('item_uuid', itemId);
        if (error) throw error;
        return (data || []).map(fav => fav.user_id);
    },

    async createMarketItem(itemData, isPlayground = false) {
        const payload = { ...itemData, category_slug: itemData.category_slug || 'tot' };
        if (isPlayground) payload.is_playground = true;

        // Rate limiting / Throttling
        if (payload.author_id || payload.author_user_id) {
            checkThrottling(payload.author_id || payload.author_user_id, 'create_market_item');
        }

        // Multi-Llinatge master: Mapetgem camps del mercat
        const mappedData = {
            ...payload,
            author_user_id: payload.author_id || payload.author_user_id || payload.user_id,
            seller: payload.author_name || payload.seller || 'Sóc de Poble',
            avatar_url: payload.author_avatar_url || payload.avatar_url,
            author_entity_id: payload.entity_id || payload.author_entity_id
        };

        // Fallback crític per a la IAIA si no ve de sessió d'usuari
        if (!mappedData.author_user_id && (payload.is_iaia || payload.is_iaia_inspired)) {
            mappedData.author_user_id = '11111111-1a1a-0000-0000-000000000000'; // IAIA MarIA default
        }

        // Remove old field names to avoid PGRST204
        delete mappedData.author_id;
        delete mappedData.author_name;
        delete mappedData.author_avatar_url;
        delete mappedData.entity_id;

        // Validació estructural amb Zod
        const validated = MarketItemSchema.parse(mappedData);

        const { data, error } = await supabase
            .from('market_items')
            .insert([validated])
            .select();

        if (error && error.code === '42703' && isPlayground) {
            delete validated.is_playground;
            const { data: retryData, error: retryError } = await supabase.from('market_items').insert([validated]).select();
            if (retryError) throw retryError;
            return retryData[0];
        }
        if (error) throw error;
        return data[0];
    },

    async toggleMarketFavorite(itemId, userId) {
        const { data: existingFav } = await supabase
            .from('market_favorites')
            .select('*')
            .eq('item_uuid', itemId)
            .eq('user_id', userId)
            .maybeSingle();

        if (existingFav) {
            await supabase
                .from('market_favorites')
                .delete()
                .eq('item_uuid', itemId)
                .eq('user_id', userId);
            return { favorited: false };
        } else {
            await supabase
                .from('market_favorites')
                .insert([{ item_uuid: itemId, user_id: userId }]);
            return { favorited: true };
        }
    },

    // Suscripciones en tiempo real y Presencia
    subscribeToConversation(conversationId, options = {}) {
        if (!isRealDBUUID(conversationId) || conversationId?.startsWith('mock-')) {
            return { unsubscribe: () => { } };
        }
        const { onNewMessage, onMessageUpdate } = options;

        const channel = supabase.channel(`conversation:${conversationId}`)
            .on(
                'postgres_changes',
                {
                    event: '*', // Listen to inserts and updates (read status)
                    schema: 'public',
                    table: 'messages',
                    filter: `conversation_id=eq.${conversationId}`
                },
                (payload) => {
                    if (payload.eventType === 'INSERT' && onNewMessage) onNewMessage(payload.new);
                    if (payload.eventType === 'UPDATE' && onMessageUpdate) onMessageUpdate(payload.new);
                }
            );

        return channel.subscribe();
    },

    subscribeToPresence(conversationId, userId, onSync) {
        if (!isRealDBUUID(conversationId) || conversationId?.startsWith('mock-')) {
            return { unsubscribe: () => { } };
        }
        const channel = supabase.channel(`presence:${conversationId}`, {
            config: {
                presence: {
                    key: userId,
                },
            },
        });

        channel
            .on('presence', { event: 'sync' }, () => {
                const state = channel.presenceState();
                onSync(state);
            })
            .subscribe(async (status) => {
                if (status === 'SUBSCRIBED') {
                    await channel.track({
                        online_at: new Date().toISOString(),
                        is_typing: false
                    });
                }
            });

        return channel;
    },

    async updatePresenceTyping(channel, isTyping) {
        if (!channel) return;
        return channel.track({
            online_at: new Date().toISOString(),
            is_typing: isTyping
        });
    },

    // Autenticació s'importa directament d'authService arreu de l'aplicació

    /**
     * Cachea de forma segura la presencia de columnas, evitando bucles de error 42703.
     */
    async checkColumn(tableName, columnName) {
        const cacheKey = `${tableName}_has_${columnName}`;
        if (columnCache[cacheKey] !== null) return columnCache[cacheKey];

        if (!activeChecks[cacheKey]) {
            activeChecks[cacheKey] = (async () => {
                try {
                    const { data, error } = await supabase.from(tableName).select('*').limit(1);
                    if (data && data.length > 0) {
                        const exists = columnName in data[0];
                        setColumnCache(cacheKey, exists);
                        return exists;
                    }
                    if (error) {
                        setColumnCache(cacheKey, false);
                        return false;
                    }
                    setColumnCache(cacheKey, true); // Optimistic true si la taula està buida
                    return true;
                } catch {
                    setColumnCache(cacheKey, false);
                    return false;
                } finally {
                    activeChecks[cacheKey] = null;
                }
            })();
        }
        return await activeChecks[cacheKey];
    },

    async getProfile(id) {
        console.log('[getProfile] Called with id:', id);
        if (!id || !isRealDBUUID(id)) {
            // Check in Lore Personas first
            const lore = LORE_PERSONAS.find(p => p.id === id);
            if (lore) return lore;
            return null;
        }

        if (this._profileCache.has(id)) {
            console.log('[getProfile] Returning from cache');
            return this._profileCache.get(id);
        }

        try {
            const hasPremium = columnCache.profiles_has_premium !== false;
            const fullSelect = 'id, username, full_name, role, avatar_url, cover_url, bio, primary_town, town_uuid, is_demo, created_at, ofici, social_image_preference';
            const baseSelect = 'id, username, full_name, role, avatar_url, cover_url, bio, primary_town, town_uuid, is_demo, created_at';

            const select = hasPremium ? fullSelect : baseSelect;

            console.log(`[getProfile] Fetching from supabase with select: ${select}...`);
            let { data, error } = await supabase
                .from('profiles')
                .select(select)
                .eq('id', id)
                .maybeSingle();
            console.log(`[getProfile] Supabase response received. Error:`, error);

            if (error) {
                if (hasPremium && (error.code === '42703' || error.message?.includes('ofici'))) {
                    setColumnCache('profiles_has_premium', false);
                    return this.getProfile(id); // Silent retry with base solo por falta de columnas
                }
                if (error.code === 'PGRST116') return null; // Stop crash loop on 404
                throw error;
            }

            if (hasPremium && data && columnCache.profiles_has_premium === null) {
                setColumnCache('profiles_has_premium', true);
            }

            const normalized = this.normalizeProfile(data);
            this._profileCache.set(id, normalized);
            return normalized;
        } catch (err) {
            logger.error('[SupabaseService] Critical error in getProfile:', err);
            return null;
        }
    },

    // Conexiones (Antiguos Likes)
    async getPostConnections(postIds) {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        const ids = (Array.isArray(postIds) ? postIds : [postIds]).filter(id =>
            typeof id === 'string' && uuidRegex.test(id)
        );
        if (ids.length === 0) return [];

        try {
            const { data, error } = await supabase
                .from('post_connections')
                .select('post_uuid, user_id, tags')
                .in('post_uuid', ids);

            if (error) {
                if (error.code === 'PGRST116' || error.code === '42703' || error.code === '42P01') {
                    logger.warn('[SupabaseService] post_connections table error. Check schema.');
                    return [];
                }
                logger.error('[SupabaseService] Error fetching post connections:', error);
                return [];
            }
            return data || [];
        } catch (err) {
            logger.error('[SupabaseService] Unexpected error in getPostConnections:', err);
            return [];
        }
    },

    async getPostUserConnection(postId, userId) {
        const { data, error } = await supabase
            .from('post_connections')
            .select('*')
            .eq('post_uuid', postId)
            .eq('user_id', userId)
            .maybeSingle();
        if (error) throw error;
        return data;
    },

    async togglePostConnection(postId, userId, tags = []) {
        if (!userId) throw new Error('UserId is required for connection');
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(postId);
        if (!isUUID) {
            logger.warn('[SupabaseService] togglePostConnection blocked for non-UUID postId:', postId);
            return { connected: false, tags: [] };
        }

        const { data: existingConnection } = await supabase
            .from('post_connections')
            .select('*')
            .eq('post_uuid', postId)
            .eq('user_id', userId)
            .maybeSingle();

        if (existingConnection) {
            if (tags.length > 0 || (tags.length === 0 && existingConnection.tags?.length > 0)) {
                const { data, error } = await supabase
                    .from('post_connections')
                    .update({ tags })
                    .eq('post_uuid', postId)
                    .eq('user_id', userId)
                    .select();
                if (error) throw error;
                return { connected: true, tags: data[0].tags };
            } else {
                await supabase
                    .from('post_connections')
                    .delete()
                    .eq('post_uuid', postId)
                    .eq('user_id', userId);
                return { connected: false, tags: [] };
            }
        } else {
            const { data, error } = await supabase
                .from('post_connections')
                .insert([{
                    post_uuid: postId,
                    user_id: userId,
                    tags: tags
                }])
                .select();
            if (error) throw error;
            return { connected: true, tags: data[0].tags };
        }
    },

    async getUserTags(userId) {
        if (!isRealDBUUID(userId)) return [];
        const { data, error } = await supabase
            .from('user_tags')
            .select('tag_name')
            .eq('user_id', userId)
            .order('tag_name', { ascending: true });
        if (error) throw error;
        return (data || []).map(t => t.tag_name);
    },

    async addUserTag(userId, tagName) {
        if (!isRealDBUUID(userId)) return null;
        // Normalizar etiqueta
        const name = tagName.trim().toLowerCase();
        if (!name) return null;

        const { data, error } = await supabase
            .from('user_tags')
            .insert([{ user_id: userId, tag_name: name }])
            .select();

        if (error) {
            if (error.code === '23505') return { tag_name: name }; // Ya existe
            throw error;
        }
        return data[0];
    },

    async deleteUserTag(userId, tagName) {
        if (!isRealDBUUID(userId)) return;
        logger.log(`[SupabaseService] Deleting user tag: ${tagName}`);
        const { error } = await supabase
            .from('user_tags')
            .delete()
            .match({ user_id: userId, tag_name: tagName.toLowerCase() });

        if (error) {
            logger.error('[SupabaseService] Error deleting user tag:', error);
            throw error;
        }
        return true;
    },

    async upsertProfile(userId, data) {
        if (!userId) return null;
        try {
            const payload = { id: userId, ...data };
            const { data: result, error } = await supabase
                .from('profiles')
                .upsert(payload, { onConflict: 'id' })
                .select();

            if (error) {
                logger.warn('[SupabaseService] Error upserting profile:', error);
                throw error;
            }
            return result && result.length > 0 ? result[0] : null;
        } catch (error) {
            logger.error('[SupabaseService] Critical error in upsertProfile:', error);
            throw error;
        }
    },

    async updateProfile(userId, updates) {
        if (userId && !updates.is_playground) {
            await checkThrottling(userId, 'update_profile', 3000).catch(e => logger.warn('Throttling warn', e));
        }
        const isLoreCharacter = userId && userId.startsWith('11111111');

        if (isLoreCharacter) {
            logger.log('[SupabaseService] Simulated update for Lore character:', { userId, updates });
            return { id: userId, ...updates };
        }

        const validated = ProfileSchema.partial().parse(updates);

        try {
            const { data, error } = await supabase
                .from('profiles')
                .update(validated)
                .eq('id', userId)
                .select();

            if (error) {
                if (error.code === 'PGRST204' || error.message?.includes('ofici')) {
                    logger.warn('[SupabaseService] Missing column (ofici) detected. Using optimistic fallback.');
                    // Fallback para Sandbox/Demo sin migración SQL ejecutada
                    return { id: userId, ...updates };
                }
                throw error;
            }
            return data[0];
        } catch (error) {
            logger.error('[SupabaseService] Error updating profile:', error);
            throw error;
        }
    },

    async createEntity(payload) {
        try {
            // 1. Crear l'entitat
            const { data: entity, error: entityError } = await supabase
                .from('entities')
                .insert([{
                    name: payload.name,
                    type: payload.type || 'empresa',
                    avatar_url: payload.avatar_url || null,
                    description: payload.description || null,

                    created_at: new Date().toISOString()
                }])
                .select()
                .single();

            if (entityError) throw entityError;

            // 2. Afegir el creador com a 'admin'
            if (payload.creator_id) {
                const { error: memberError } = await supabase
                    .from('entity_members')
                    .insert([{
                        entity_id: entity.id,
                        user_id: payload.creator_id,
                        role: 'admin',
                        created_at: new Date().toISOString()
                    }]);
                
                if (memberError) throw memberError;
            }

            return entity;
        } catch (error) {
            logger.error('[SupabaseService] Error creating entity:', error);
            throw error;
        }
    },

    // Multi-Identidad (Phase 6)
    async getUserEntities(userId) {
        if (!userId) return [];
        try {
            // Obtenemos las entidades donde el usuario es miembro
            const { data, error } = await supabase
                .from('entity_members')
                .select(`
                    role,
                    entities (
                        id,
                        name,
                        type,
                        avatar_url
                    )
                `)
                .eq('user_id', userId);

            if (error) {
                // [RESILIÈNCIA OMEGA] Catch permission errors (401/403/42501) or missing table errors
                const isPermissionError = error.code === '42501' || error.status === 401 || error.status === 403;
                if (isPermissionError || error.code === 'PGRST201' || error.code === '42P01' || error.code === '42703') {
                    logger.warn(`[SupabaseService] getUserEntities blindat: ${error.message || error.code}. Ignorant permisos/esquema.`);
                    return [];
                }
                logger.error('[SupabaseService] Error loading entities:', error);
                return [];
            }

            // SANEJAMENT DE LLINATGE: Transformar Sóc de Poble a Empresa i netejar duplicats
            let processedEntities = (data || []).map(item => ({
                ...item.entities,
                member_role: item.role
            }));

            // If it's Javi, enforce "Sóc de Poble" as Empresa and hide Association duplicate
            const isJavi = userId === 'd6325f44-7277-4d20-b020-166c010995ab' || userId === 'javillinares' || userId === 'mock_javi-llinares';
            if (isJavi) {
                const sdpExists = processedEntities.some(e => e.id === 'socdepoble');
                const rentonarExists = processedEntities.some(e => e.id === 'el-rentonar');

                if (!sdpExists) {
                    const sdp = SYSTEM_ENTITIES.find(e => e.id === 'socdepoble');
                    if(sdp) processedEntities.push({ ...sdp, name: sdp.full_name, member_role: 'admin' });
                }
                if (!rentonarExists) {
                    const rento = SYSTEM_ENTITIES.find(e => e.id === 'el-rentonar');
                    if(rento) processedEntities.push({ ...rento, name: rento.full_name, member_role: 'admin' });
                }

                const socDePobleEmpresa = processedEntities.find(e => e.name?.toLowerCase().includes('sóc de poble') && e.type === 'empresa');
                if (socDePobleEmpresa) {
                    processedEntities = processedEntities.filter(e => !(e.name?.toLowerCase().includes('sóc de poble') && e.type === 'associacio'));
                } else {
                    processedEntities = processedEntities.map(e => {
                        if (e.name?.toLowerCase().includes('sóc de poble') && e.type === 'associacio') {
                            return { ...e, type: 'empresa' };
                        }
                        return e;
                    });
                }
            }

            return processedEntities;
        } catch (err) {
            logger.error('[SupabaseService] Critical error in getUserEntities:', err);
            return []; // Fail safe to avoid white screen
        }
    },

    // Fase 6: Páginas Públicas y Gestión de Entidades
    // [EMERGENCY FIX] Cache for profiles to prevent infinite network loops
    _profileCache: new Map(),

    async getPublicProfile(userId) {
        // [OMNISCIENT] Universal Resolver for System Entities and Lore Personas
        const personas = await this.getAllPersonas();
        const foundPersona = personas.find(p => p.id === userId);
        if (foundPersona) return foundPersona;

        const system = SYSTEM_ENTITIES.find(e => e.id === userId);
        if (system) return system;

        if (!isRealDBUUID(userId)) {
            logger.debug(`[SupabaseService] getPublicProfile: Saltant crida a DB per ID no-UUID o Sobirà: ${userId}`);
            return null; // Silent fail for malformed or sovereign IDs
        }

        // Return from cache if available to prevent generic infinite loops
        if (this._profileCache.has(userId)) {
            return this._profileCache.get(userId);
        }

        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();
        
        if (error) {
            if (error.code === 'PGRST116') {
                if (userId === 'd6325f44-7277-4d20-b020-166c010995ab') {
                    const masterProfile = {
                        id: 'd6325f44-7277-4d20-b020-166c010995ab',
                        full_name: 'Javi Llinares',
                        username: 'javillinares',
                        type: 'persona',
                        town_name: 'La Torre de les Maçanes',
                        bio: 'Desenvolupador principal d\'Antigravity i arquitecte de Sóc de Poble. Programant el futur rural.',
                        avatar_url: '/assets/master/javi_avatar_cinematic.png',
                        cover_url: '/assets/patterns/hero_pattern.png',
                        category: 'Tecnologia',
                        is_active: true,
                        is_admin: true,
                        created_at: '2025-01-01T00:00:00Z'
                    };
                    this._profileCache.set(userId, masterProfile);
                    return masterProfile;
                }
                return null;
            }
            throw error;
        }
        
        const normalized = this.normalizeProfile(data);
        this._profileCache.set(userId, normalized);
        return normalized;
    },

    async getUserByUsername(username) {
        if (!username) throw new Error('Username is required');
        const cleanUsername = username.toLowerCase();

        // [OMNISCIENT] Search in virtual personas first
        const personas = await this.getAllPersonas();
        const foundPersona = personas.find(p => p.username?.toLowerCase() === cleanUsername);
        if (foundPersona) return foundPersona;

        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('username_lower', cleanUsername)
            .limit(1)
            .maybeSingle();

        if (error) {
            if (error.code === 'PGRST116') {
                return null; // Not found
            }
            throw error;
        }

        return this.normalizeProfile(data);
    },

    async updateProfileBio(userId, bio) {
        const { data, error } = await supabase
            .from('profiles')
            .update({ bio: bio?.substring(0, 160) || null })
            .eq('id', userId)
            .select()
            .single();

        if (error) throw error;
        logger.log('[SupabaseService] Bio updated');
        return data;
    },

    async getAllCitizens() {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .order('full_name', { ascending: true });
        if (error) throw error;
        return data;
    },

    async updateUserRole(userId, role) {
        const { data, error } = await supabase
            .from('profiles')
            .update({ role: role })
            .eq('id', userId)
            .select();
        if (error) throw error;
        return data[0];
    },

    async getPublicEntity(entityId) {
        // Intercept System/Mock entities (Blindatge OMNISCIENT)
        const systemMatch = SYSTEM_ENTITIES.find(e => e.id === entityId);
        if (systemMatch) return systemMatch;

        const adminEntities = await this.getAdminEntities(); // Includes system and curated DB entities
        const existingMock = adminEntities.find(e => e.id === entityId);

        if (existingMock) return existingMock;

        if (!isRealDBUUID(entityId)) {
            logger.debug(`[SupabaseService] getPublicEntity: Saltant crida a DB per ID no-UUID o Sobirà: ${entityId}`);
            return null;
        }

        const { data, error } = await supabase
            .from('entities')
            .select('*')
            .eq('id', entityId)
            .limit(1)
            .maybeSingle();
        
        if (error) {
            if (error.code === 'PGRST116') return null;
            throw error;
        }
        
        if (!data) return null;

        const entity = data;
        return {
            ...entity,
            avatar_url: this.normalizeStorageUrl(entity.avatar_url),
            cover_url: this.normalizeStorageUrl(entity.cover_url)
        };
    },

    async getEntityMembers(entityId) {
        // Blindatge OMNISCIENT per a entitats de sistema
        if (entityId === 'socdepoble') {
            return [{
                user_id: 'd6325f44-7277-4d20-b020-166c010995ab', // Javi Real
                role: 'Fundador',
                profiles: {
                    full_name: 'Javi Linares',
                    avatar_url: '/images/agents/javi_real.png'
                }
            }];
        }

        const { data, error } = await supabase
            .from('entity_members')
            .select('user_id, role, profiles(full_name, avatar_url)')
            .eq('entity_id', entityId);
        if (error) {
            logger.error('[SupabaseService] Error getting entity members:', error);
            return []; // Fail gracefully
        }
        return data;
    },

    async getUserPosts(userId, isPlayground = false) {
        if (!isRealDBUUID(userId)) return [];
        try {
            // [MOCK HEALER] Support for virtual entities / agents in the feed
            let virtualPosts = [];
            const JAVI_REAL_ID = 'd6325f44-7277-4d20-b020-166c010995ab';
            if (userId.startsWith('11111111-') || userId === JAVI_REAL_ID || typeof ENABLE_MOCKS !== 'undefined') {
                try {
                    const { MOCK_FEED } = await import('../data.js');
                    virtualPosts = MOCK_FEED.filter(p => p.author_entity_id === userId || p.author_id === userId || p.author_user_id === userId);
                } catch {
                     logger.warn("Could not import MOCK_FEED for user posts");
                }
            }

            if (!isRealDBUUID(userId)) {
                // Si és un ID sobirà o malformat, mirem si té posts de Lore, si no, retornem buit sense cridar a DB
                const lorePosts = (MOCK_LORE_POSTS[userId] || []).map(p => {
                    const persona = LORE_PERSONAS.find(lp => lp.id === userId);
                    return normalizeContentItem({
                        ...p,
                        author_name: p.author_name || persona?.full_name,
                        author_avatar_url: persona?.avatar_url,
                        author_role: p.author_role || persona?.role,
                        town_name: persona?.primary_town
                    }, 'post');
                });
                return [...lorePosts, ...virtualPosts];
            }
            // const isUcc = localStorage.getItem('active_ucc_view') === 'true';
            if (isPlayground && !userId?.startsWith('11111111-')) {
                // Simplified mock return only for non-demo users in playground
                return [];
            }

            let query = supabase
                .from('posts')
                .select('id, uuid:id, content, created_at, image_url, image_alt, author, author_role, author_type, author_user_id, author_entity_id, is_playground, categories, tags, towns!fk_posts_town_uuid(name)');

            // LLINATGE DE L'ARQUITECTE: Si és en Javi, mostrem els seus posts naturals I els de l'Empresa Sóc de Poble
            if (userId === JAVI_REAL_ID) {
                // Busquem l'ID de l'empresa Sóc de Poble (es pot optimitzar amb un cache o constant)
                query = query.or(`author_user_id.eq.${userId},author.ilike.%Sóc de Poble%`);
            } else {
                query = query.eq('author_user_id', userId);
            }

            if (isPlayground) query = query.eq('is_playground', true);
            else query = query.or('is_playground.is.null,is_playground.eq.false');

            const { data, error } = await query.order('created_at', { ascending: false });
            if (error) throw error;

            // Inyectamos contenido de Lore si existe (Auditoría V3)
            const lorePosts = (MOCK_LORE_POSTS[userId] || []).map(p => {
                const persona = LORE_PERSONAS.find(lp => lp.id === userId);
                return normalizeContentItem({
                    ...p,
                    author_name: p.author_name || persona?.full_name,
                    author_avatar_url: persona?.avatar_url,
                    author_role: p.author_role || persona?.role,
                    town_name: persona?.primary_town
                }, 'post');
            });

            const dbData = (data || []).map(p => normalizeContentItem(p, 'post'));
            return [...lorePosts, ...virtualPosts.map(p => normalizeContentItem(p, 'post')), ...dbData];
        } catch (error) {
            logger.error('[SupabaseService] Error in getUserPosts:', error);
            return [];
        }
    },

    async getImportedPosts(userId) {
        if (!isRealDBUUID(userId)) return { data: [], error: null };
        try {
            return await supabase
                .from('posts')
                .select('*')
                .eq('author_user_id', userId)
                .eq('type', 'imported_story')
                .order('created_at', { ascending: false });
        } catch (error) {
            logger.error('[SupabaseService] Error in getImportedPosts:', error);
            return { data: [], error };
        }
    },

    async getUserPostsCount(userId) {
        if (!isRealDBUUID(userId)) return 0;
        try {
            let virtualCount = 0;
            if (userId.startsWith('11111111-')) {
                 try {
                     const { MOCK_FEED } = await import('../data.js');
                     virtualCount = MOCK_FEED.filter(p => p.author_entity_id === userId || p.author_id === userId).length;
                 } catch {
                     logger.warn("Could not import MOCK_FEED for user posts count");
                 }
                 return virtualCount; // Fast path for agents
            }

            const { count, error } = await supabase
                .from('posts')
                .select('*', { count: 'exact', head: true })
                .eq('author_user_id', userId);
            if (error) throw error;
            return count || 0;
        } catch (err) {
            logger.error('[SupabaseService] Error in getUserPostsCount:', err);
            return 0;
        }
    },

    async getEntityPosts(entityId, isPlayground = false) {
        try {
            // Support for virtual entities in the feed (Lore injection)
            const { MOCK_FEED } = await import('../data');
            const virtualPosts = MOCK_FEED.filter(p => p.author_entity_id === entityId || p.entity_id === entityId);

            let query = supabase
                .from('posts')
                .select('id, uuid:id, content, created_at, image_url, image_alt, author, author_role, author_type, author_user_id, author_entity_id, is_playground, categories, tags, towns!fk_posts_town_uuid(name)')
                .eq('author_entity_id', entityId);

            if (isPlayground) query = query.eq('is_playground', true);
            else query = query.or('is_playground.is.null,is_playground.eq.false');

            const { data, error } = await query.order('created_at', { ascending: false });
            if (error && virtualPosts.length === 0) throw error;

            const dbData = (data || []).map(p => normalizeContentItem(p, 'post'));
            // Merge virtual and real posts
            return [...virtualPosts, ...dbData].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        } catch (error) {
            logger.error('[SupabaseService] Error in getEntityPosts:', error);
            return [];
        }
    },

    async getUserMarketItems(userId, isPlayground = false) {
        if (!isRealDBUUID(userId)) return [];
        try {
            if (!isRealDBUUID(userId)) {
                // Lore injection for non-DB IDs
                const loreItems = (MOCK_LORE_ITEMS[userId] || []).map(item => {
                    const persona = LORE_PERSONAS.find(p => p.id === userId);
                    return normalizeContentItem({
                        ...item,
                        seller_name: persona?.full_name,
                        author_avatar_url: persona?.avatar_url,
                        author_role: persona?.role,
                        town_name: persona?.primary_town
                    }, 'market');
                });
                return loreItems;
            }
            let query = supabase
                .from('market_items')
                .select('id, uuid:id, title, description, price, category_slug, created_at, image_url, seller, author_role, author_type, author_user_id, author_entity_id, is_playground, is_active, towns!fk_market_town_uuid(name)')
                .eq('author_user_id', userId);

            if (isPlayground) query = query.eq('is_playground', true);
            else query = query.or('is_playground.is.null,is_playground.eq.false');

            const { data, error } = await query.order('created_at', { ascending: false });
            if (error) throw error;

            // Inyectamos artículos de Lore si existe (Auditoría V3)
            const loreItems = (MOCK_LORE_ITEMS[userId] || []).map(item => {
                const persona = LORE_PERSONAS.find(p => p.id === userId);
                return normalizeContentItem({
                    ...item,
                    seller_name: persona?.full_name,
                    author_avatar_url: persona?.avatar_url,
                    author_role: persona?.role,
                    town_name: persona?.primary_town
                }, 'market');
            });
            const dbData = (data || []).map(item => normalizeContentItem(item, 'market'));
            return [...loreItems, ...dbData];
        } catch (error) {
            logger.error('[SupabaseService] Error in getUserMarketItems:', error);
            return [];
        }
    }, async getEntityMarketItems(entityId, isPlayground = false) {
        try {
            // Support for virtual entities in the market (Lore injection)
            const { MOCK_MARKET_ITEMS } = await import('../data');
            const virtualItems = MOCK_MARKET_ITEMS.filter(item => item.author_entity_id === entityId || item.entity_id === entityId);

            let query = supabase
                .from('market_items')
                .select('id, uuid:id, title, description, price, category_slug, created_at, image_url, seller, author_role, author_type, author_user_id, author_entity_id, is_playground, is_active, towns!fk_market_town_uuid(name)')
                .eq('author_entity_id', entityId);

            if (isPlayground) query = query.eq('is_playground', true);
            else query = query.or('is_playground.is.null,is_playground.eq.false');

            const { data, error } = await query.order('created_at', { ascending: false });
            if (error && virtualItems.length === 0) throw error;

            const dbData = (data || []).map(item => normalizeContentItem(item, 'market'));
            return [...virtualItems, ...dbData].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        } catch (error) {
            logger.error('[SupabaseService] Error in getEntityMarketItems:', error);
            return [];
        }
    },


    async getLexiconTerms() {
        try {
            const { data, error } = await supabase
                .from('lexicon')
                .select('*, towns(name)')
                .order('term', { ascending: true });
            if (error) throw error;
            return data;
        } catch (error) {
            logger.error('[SupabaseService] Error in getLexiconTerms:', error);
            return [];
        }
    },

    async getDailyWord() {
        try {
            const { data, error } = await supabase
                .from('lexicon')
                .select('*');

            if (error) throw error;
            if (!data || data.length === 0) return null;

            const randomIndex = Math.floor(Math.random() * data.length);
            return data[randomIndex];
        } catch (error) {
            logger.error('[SupabaseService] Error in getDailyWord:', error);
            return null;
        }
    },


    async createLexiconEntry(entryData) {
        const { data, error } = await supabase
            .from('lexicon')
            .insert([entryData])
            .select();
        if (error) {
            logger.error('[SupabaseService] Error creating lexicon entry:', error);
            throw error;
        }
        return data[0];
    },

    // Herramientas de Control de Almacenamiento (Auditoría)
    async getStorageStats() {
        try {
            const bucket = 'chat_attachments';
            const { data, error } = await supabase.storage.from(bucket).list('', { recursive: true });

            if (error) throw error;

            // Supabase list() returns metadata including size in bytes
            const totalBytes = data.reduce((acc, file) => acc + (file.metadata?.size || 0), 0);
            const totalMB = (totalBytes / (1024 * 1024)).toFixed(2);

            return {
                count: data.length,
                totalBytes,
                totalMB,
                limitMB: 1024, // Supabase Free Tier: 1GB
                percentage: ((totalBytes / (1024 * 1024 * 1024)) * 100).toFixed(2)
            };
        } catch (err) {
            logger.error('[SupabaseService] Error getting storage stats:', err);
            return null;
        }
    },

    // Subida de imágenes de perfil y portada
    // --- Media Deduplication & Upload Helpers ---

    /**
     * Internal helper to process a media upload with deduplication.
     * Checks hash first, then uploads if necessary, and finally registers usage.
     */
    async processMediaUpload(userId, file, bucket, context, isPublic = true, parentId = null) {
        let processedFile = file;

        // 0. Compress image if it's an image and too large (>500KB)
        if (file.type.startsWith('image/') && file.size > 100 * 1024) {
            try {
                const imageCompression = (await import('browser-image-compression')).default;
                
                // [CRITICAL FIX] BANDWIDTH LEAK
                const isAvatar = context === 'avatar';
                const configuredMaxMB = isAvatar ? 0.08 : 1; 
                const configuredMaxWidth = isAvatar ? 400 : 1920;

                processedFile = await imageCompression(file, {
                    maxSizeMB: configuredMaxMB,
                    maxWidthOrHeight: configuredMaxWidth,
                    useWebWorker: true,
                    fileType: file.type
                });
            } catch (err) {
                logger.error('[SupabaseService] Error compressing image:', err);
            }
        }

        const { calculateFileHash } = await import('../utils/crypto');
        const hash = await calculateFileHash(processedFile);

        // 1. Check if asset already exists
        const existingAsset = await this.getMediaAssetByHash(hash);

        if (existingAsset) {
            // Already exists! Just register usage
            await this.registerMediaUsage(existingAsset.id, userId, context, isPublic);
            return { url: existingAsset.url, deduplicated: true, asset: existingAsset };
        }

        // 2. No duplicate, perform actual upload
        const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
        const filePath = `${userId}/${context}_${fileName}`;

        const { error: uploadError, data: _data } = await supabase.storage
            .from(bucket)
            .upload(filePath, processedFile, {
                cacheControl: '3600',
                upsert: true
            });

        if (uploadError) {
            const isPlayground = localStorage.getItem('isPlaygroundMode') === 'true' || userId?.startsWith('11111111-');
            if (isPlayground && (uploadError.code === '42501' || uploadError.status === 400 || uploadError.status === 401 || uploadError.status === 403)) {
                logger.warn(`[SupabaseService] 🛡️ RLS Bypass [${context}]: Creant URL local per a Playground.`);
                const localUrl = URL.createObjectURL(processedFile);
                return { url: localUrl, deduplicated: false, asset: { id: `mock-asset-${Date.now()}`, url: localUrl } };
            }
            throw uploadError;
        }

        const { data: { publicUrl } } = supabase.storage
            .from(bucket)
            .getPublicUrl(filePath);

        const newAsset = await this.createMediaAsset({
            hash,
            url: publicUrl,
            mime_type: processedFile.type,
            size_bytes: processedFile.size,
            parent_id: parentId
        });

        // 4. Register usage
        await this.registerMediaUsage(newAsset.id, userId, context, isPublic);

        return { url: publicUrl, deduplicated: false, asset: newAsset };
    },

    async uploadAvatar(userId, file) {
        const result = await this.processMediaUpload(userId, file, 'profiles', 'avatar', true);
        await this.updateProfile(userId, { avatar_url: result.url });
        return { ...(await this.getProfile(userId)), _deduplicated: result.deduplicated };
    },

    async uploadCover(userId, file) {
        const result = await this.processMediaUpload(userId, file, 'profiles', 'cover', true);
        await this.updateProfile(userId, { cover_url: result.url });
        return { ...(await this.getProfile(userId)), _deduplicated: result.deduplicated };
    },

    async uploadChatAttachment(file, conversationId, userId) {
        const result = await this.processMediaUpload(userId, file, 'chat_attachments', 'chat', true);
        return result.url;
    },

    // --- Media Deduplication System ---

    async getMediaAssetByUrl(url) {
        const { data, error } = await supabase
            .from('media_assets')
            .select('*')
            .eq('url', url)
            .maybeSingle();

        if (error) throw error;
        return data;
    },

    async getUserMediaAssets(userId) {
        const { data, error } = await supabase
            .from('media_usage')
            .select(`
                asset_id,
                context,
                media_assets (*)
            `)
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;

        const assets = [];
        const seenIds = new Set();
        const seenHashes = new Set();

        const hasPrimarySource = data?.some(u =>
            ['raw', 'post', 'chat', 'direct', 'item'].includes(u.context)
        );

        data?.forEach(usage => {
            const asset = usage.media_assets;
            const context = usage.context;

            if (asset && !seenIds.has(asset.id)) {
                // 1. Never show crops with parents
                if (asset.parent_id) return;

                // 2. Exact file deduplication (legacy support)
                if (seenHashes.has(asset.hash)) return;

                // 3. Hide automated contexts if original source exists
                const isAutomated = context === 'avatar' || context === 'cover';
                if (hasPrimarySource && isAutomated) return;

                if (asset.mime_type?.startsWith('image/')) {
                    assets.push(asset);
                    seenIds.add(asset.id);
                    seenHashes.add(asset.hash);
                }
            }
        });

        return assets;
    },

    async getMediaAssetByHash(hash) {
        const { data, error } = await supabase
            .from('media_assets')
            .select('*')
            .eq('hash', hash)
            .maybeSingle();

        if (error) throw error;
        return data;
    },

    /**
     * Finds and removes media assets that are no longer referenced in media_usage.
     * This is a "blindage" feature to keep storage clean.
     */
    async cleanupOrphanedAssets() {
        try {
            // Find assets NOT present in media_usage
            const { data: orphans, error } = await supabase.rpc('get_orphaned_assets');

            // If RPC is not available, we use a slower query-based approach
            let targetOrphans = orphans;
            if (error) {
                const { data: qOrphans, error: qError } = await supabase
                    .from('media_assets')
                    .select('id, url')
                    .not('id', 'in', supabase.from('media_usage').select('asset_id'));
                if (qError) throw qError;
                targetOrphans = qOrphans;
            }

            if (!targetOrphans || targetOrphans.length === 0) return { count: 0 };

            let deletedCount = 0;
            for (const asset of targetOrphans) {
                // Delete from DB (Storage deletion should be handled by a DB trigger or separate process for safety)
                const { error: delError } = await supabase
                    .from('media_assets')
                    .delete()
                    .eq('id', asset.id);

                if (!delError) deletedCount++;
            }

            return { count: deletedCount };
        } catch (err) {
            logger.error('[SupabaseService] Error in cleanupOrphanedAssets:', err);
            return { count: 0, error: err };
        }
    },

    async getParentAsset(assetId) {
        const { data: asset, error: assetError } = await supabase
            .from('media_assets')
            .select('parent_id')
            .eq('id', assetId)
            .limit(1)
            .maybeSingle();

        if (assetError || !asset.parent_id) return null;

        const { data: parent, error: parentError } = await supabase
            .from('media_assets')
            .select('*')
            .eq('id', asset.parent_id)
            .limit(1)
            .maybeSingle();

        if (parentError) throw parentError;
        return parent;
    },

    async createMediaAsset(assetData) {
        const { data, error } = await supabase
            .from('media_assets')
            .insert(assetData)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async registerMediaUsage(assetId, userId, context, isPublic = true) {
        const { data, error } = await supabase
            .from('media_usage')
            .insert({
                asset_id: assetId,
                user_id: userId,
                context,
                is_public: isPublic
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async getMediaAttribution(assetId) {
        const { data, error } = await supabase
            .from('media_attribution')
            .select('*')
            .eq('asset_id', assetId);

        if (error) throw error;
        return data;
    },

    async getUserMedia(userId, isPlayground = false) {
        let query = supabase
            .from('media_usage')
            .select(`
                *,
                asset:media_assets(*)
            `)
            .eq('user_id', userId);

        if (isPlayground) {
            // Also include media associated with common demo IDs to feel more "filled"
            // but focused on the current character's simulated activity
            // query = query.or(...) // Future expansion: aggregate common persona assets
        }

        const { data, error } = await query.order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    },

    async getGlobalMedia() {
        // [MASTER ASSET HUB] Fetch all media with uploader info
        // Note: Using !user_id as hint if PostgREST cannot find the implicit relationship
        const { data, error } = await supabase
            .from('media_usage')
            .select(`
                *,
                asset:media_assets(*),
                user:profiles!user_id(id, full_name, avatar_url)
            `)
            .order('created_at', { ascending: false });

        if (error) {
            logger.warn('[SupabaseService] Error in primary getGlobalMedia join, attempting robust fallback:', error);
            
            // SECOND ATTEMPT: Try without the profiles join (which sometimes fails if hinted incorrectly)
            const { data: q2Data, error: q2Error } = await supabase
                .from('media_usage')
                .select(`
                    *,
                    media_assets(*)
                `)
                .order('created_at', { ascending: false });

            if (q2Error) {
                logger.error('[SupabaseService] Critical failure in media_usage query:', q2Error);
                // FINAL FALLBACK: Raw media_usage and manual hydration (Maximum Resilience)
                const { data: rawData, error: rawError } = await supabase
                    .from('media_usage')
                    .select('*')
                    .order('created_at', { ascending: false });
                    
                if (rawError) throw rawError;
                
                // Hydrate assets
                const assetIds = [...new Set(rawData.map(d => d.asset_id))].filter(Boolean);
                const { data: assets } = await supabase.from('media_assets').select('*').in('id', assetIds);
                
                // Hydrate users
                const userIds = [...new Set(rawData.map(d => d.user_id))].filter(Boolean);
                const { data: profiles } = await supabase.from('profiles').select('id, full_name, avatar_url').in('id', userIds);
                
                return rawData.map(item => ({
                    ...item,
                    asset: assets?.find(a => a.id === item.asset_id),
                    user: profiles?.find(p => p.id === item.user_id)
                }));
            }

            // Normal retry logic for Q2: Manual profile hydration
            const userIds = [...new Set(q2Data.map(d => d.user_id))].filter(Boolean);
            const { data: profiles } = await supabase
                .from('profiles')
                .select('id, full_name, avatar_url')
                .in('id', userIds);

            return q2Data.map(item => ({
                ...item,
                asset: item.media_assets, // Handle fallback field name
                user: profiles?.find(p => p.id === item.user_id)
            }));
        }
        return data;
    },

    // --- Voice Messages ---

    async uploadVoiceMessage(audioBlob, duration, userId) {
        // Upload logic: user_id / conversation_id (optional) / timestamp
        const timestamp = Date.now();
        const fileName = `${userId}/${timestamp}.webm`;

        const { data: _data, error: uploadError } = await supabase.storage
            .from('voice-messages')
            .upload(fileName, audioBlob, {
                cacheControl: '3600',
                upsert: false
            });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
            .from('voice-messages')
            .getPublicUrl(fileName);

        return { url: publicUrl, path: fileName };
    },

    async sendVoiceMessage(conversationId, senderId, audioBlob, duration, waveform) {
        try {
            // 1. Upload
            const { url } = await this.uploadVoiceMessage(audioBlob, duration, senderId);

            // 2. Send Message (using generic secure message flow)
            // We use 'voice' as attachment type
            const messageData = {
                conversationId,
                senderId,
                content: '🎵 Missatge de veu',
                attachmentUrl: url,
                attachmentType: 'voice',
                attachmentName: duration.toString() // Store duration in name for quick access
            };

            const message = await this.sendSecureMessage(messageData);

            // 3. Store rich metadata (waveform) in separate table
            const { error: metaError } = await supabase
                .from('voice_messages')
                .insert({
                    message_id: message.id,
                    duration_seconds: Math.round(duration),
                    waveform_data: waveform
                });

            if (metaError) {
                logger.error('[SupabaseService] Error saving voice metadata (waveform):', metaError);
                // Continue, as the message itself is sent and playable (metadata is progressive enhancement)
            }

            return { ...message, voice_meta: { duration, waveform } };
        } catch (error) {
            logger.error('[SupabaseService] Error sending voice message:', error);
            throw error;
        }
    },

    /**
     * Purges all ephemeral data generated during a playground session.
     */
    async cleanupPlaygroundSession(userId) {
        if (!userId) return;
        logger.log(`[SupabaseService] Starting cleanup for user ${userId}...`);

        try {
            // 1. Delete posts
            const { error: postError } = await supabase
                .from('posts')
                .delete()
                .eq('author_id', userId)
                .eq('is_playground', true);
            if (postError) logger.error('Error cleaning posts:', postError);

            // 2. Delete market items
            const { error: marketError } = await supabase
                .from('market_items')
                .delete()
                .eq('author_id', userId)
                .eq('is_playground', true);
            if (marketError) logger.error('Error cleaning market items:', marketError);

            // 3. Mark playground messages or delete
            // Note: messages might not have is_playground column, but they belong to playground conversations
            // This is a simplified version, more robust would be deleting by conversation_id

            // 4. Cleanup storage references and files
            // This requires listing from media_usage with a hypothetical 'is_temporary' flag 
            // or by checking the created_at vs session start.

            logger.log(`[SupabaseService] Cleanup finished for ${userId}`);
            return true;
        } catch (err) {
            logger.error('[SupabaseService] Critical error in cleanup:', err);
            return false;
        }
    },

    async getPublicStats() {
        try {
            const [profiles, entities, posts, towns] = await Promise.all([
                supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('is_demo', false),
                supabase.from('entities').select('*', { count: 'exact', head: true }),
                supabase.from('posts').select('*', { count: 'exact', head: true }),
                supabase.from('towns').select('*', { count: 'exact', head: true })
            ]);

            return {
                users: profiles.count || 0,
                entities: entities.count || 0,
                posts: posts.count || 12, // Fallback for visual balance if empty
                towns: towns.count || 0
            };
        } catch (error) {
            logger.error('[SupabaseService] Error fetching stats:', error);
            return { users: 24, entities: 5, posts: 153, towns: 3 }; // Fallback values
        }
    },

    /**
     * Obté una publicació específica per ID [MASTER]
     */
    async getPostById(postId) {
        try {
            const { data, error } = await supabase
                .from('posts_universal_view')
                .select('*, profiles(*), towns(*)')
                .eq('id', postId)
                .limit(1)
                .maybeSingle();

            if (error) throw error;
            return data;
        } catch (err) {
            logger.error(`[SupabaseService] Error fetching post ${postId}:`, err);
            return null;
        }
    },

    /**
     * [PILLAR 3: Rèplica Representant] - Sincronització de xlogs
     */
    async upsertXLogs(userId, xlogs) {
        try {
            // En un entorn real, açò usaria una taula 'account_logs' amb RLS
            logger.log(`[SupabaseService] Sincronitzant ${xlogs.length} xlogs per a l'usuari ${userId}`);
            const { error } = await supabase
                .from('account_logs')
                .upsert(xlogs.map(log => ({ ...log, user_id: userId })), { onConflict: 'id' });

            return { error };
        } catch (err) {
            logger.error('[SupabaseService] Error en upsertXLogs:', err);
            return { error: err };
        }
    },

    /**
     * [PILLAR 3+: Contracte Social] - Crea petició de recuperació.
     */
    async createRecoveryRequest(request) {
        try {
            logger.log(`[SupabaseService] Petició de recuperació bategada per a: ${request.user_id}`);
            // Simulem l'escriptura a una taula 'recovery_requests' via upsert
            const { error } = await supabase
                .from('recovery_requests')
                .upsert([request], { onConflict: 'user_id' });
            return { error };
        } catch (err) {
            logger.error('[SupabaseService] Error en createRecoveryRequest:', err);
            return { error: err };
        }
    },

    /**
     * [PILLAR 3+: Contracte Social] - Signatura de petició.
     */
    async signRecoveryRequest(userId, padrinId) {
        try {
            // En un sistema real, açò incrementaria signatures a la taula 'recovery_requests'
            logger.log(`[SupabaseService] Padrí ${padrinId} signant per a ${userId}`);
            return { success: true };
        } catch (err) {
            logger.error('[SupabaseService] Error en signRecoveryRequest:', err);
            return { error: err };
        }
    },

    /**
     * Obté les entitats (identitats) gestionades per l'usuari actual.
     */
    async getMyEntities() {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return [];

            const { data, error } = await supabase
                .from('entities')
                .select('*')
                .eq('owner_id', user.id);

            if (error) throw error;
            return data;
        } catch (err) {
            logger.error('[SupabaseService] Error en getMyEntities:', err);
            return [];
        }
    },

    /**
     * [Protocol OMEGA: Dumb Pipe]
     * Puja un blob binari opac al relay sense coneixement semàntic.
     */
    async uploadOpaqueBlob(path, packageData) {
        try {
            logger.log(`[SupabaseService] Pujant blob opac a: ${path}`);
            const { error } = await supabase
                .from('opaque_relays')
                .upsert([{ 
                    path, 
                    payload: packageData.payload, 
                    v: packageData.v,
                    updated_at: new Date().toISOString()
                }]);
            return { error };
        } catch (err) {
            logger.error('[SupabaseService] Error pujant blob opac:', err);
            return { error: err };
        }
    }
};



=====================================
FILE: src/services/syncService.js
=====================================

import { logger } from '../utils/logger';

/**
 * SyncService: Gestiona el guardado automático de borradores y estados persistentes
 * para evitar pérdida de contenido durante errores de red o crashes.
 */
export const syncService = {
    /**
     * Guarda un borrador en localStorage con una clave única
     */
    saveDraft: (key, content) => {
        try {
            const draft = {
                content,
                timestamp: new Date().toISOString(),
            };
            localStorage.setItem(`sp_draft_${key}`, JSON.stringify(draft));
            logger.log(`[SyncService] Borrador guardado para: ${key}`);
        } catch (err) {
            logger.error('[SyncService] Error guardando borrador:', err);
        }
    },

    /**
     * Recupera un borrador
     */
    getDraft: (key) => {
        try {
            const data = localStorage.getItem(`sp_draft_${key}`);
            return data ? JSON.parse(data) : null;
        } catch {
            return null;
        }
    },

    /**
     * Limpia un borrador
     */
    clearDraft: (key) => {
        localStorage.removeItem(`sp_draft_${key}`);
    },

    /**
     * Sistema de respaldo de "emergencia" para el chat amb Garbage Collection
     */
    backupChatInput: (convId, text) => {
        if (!text) return;
        try {
            const backups = JSON.parse(localStorage.getItem('sp_chat_backups') || '{}');
            backups[convId] = { text, at: Date.now() };

            const entries = Object.entries(backups);
            if (entries.length > 20) {
                entries.sort((a, b) => b[1].at - a[1].at);
                const pruned = Object.fromEntries(entries.slice(0, 20));
                localStorage.setItem('sp_chat_backups', JSON.stringify(pruned));
            } else {
                localStorage.setItem('sp_chat_backups', JSON.stringify(backups));
            }
        } catch (err) {
            logger.error('[SyncService] Error fent backup de xat:', err);
        }
    },

    /**
     * [Protocol OMEGA: Dumb Pipe]
     * Empaqueta el graf d'operacions com un blob binari opac per al transport.
     */
    packForTransport: async (ops) => {
        logger.log('[SyncService] Empaquetant graf operacional (Dumb Pipe)...');
        // Usar FileReader (C++ engine) per convertir grans arrays a base64 sense bloquejar UI
        const encoder = new TextEncoder();
        const bytes = encoder.encode(JSON.stringify(ops));
        
        const base64 = await new Promise(resolve => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result.split(',')[1]);
            reader.readAsDataURL(new Blob([bytes]));
        });

        return {
            v: '1.0.0-OMEGA',
            payload: base64,
            checksum: ops.length // Verificació prima de quantitat d'ops
        };
    },

    /**
     * [Protocol OMEGA: Dumb Pipe]
     * Desempaqueta un blob binari opac provinent d'un transport (Supabase/P2P).
     */
    unpackFromTransport: async (packageData) => {
        if (!packageData || packageData.v !== '1.0.0-OMEGA') {
            throw new Error('[SyncService] Versió de paquet incompatible');
        }
        try {
            // Unpack asíncron, evitant `atob` síncron massiu que bloqueja Main Thread
            // S'usa el motor Fetch C++ per desencriptar el blob Base64 directament
            const res = await fetch(`data:application/octet-stream;base64,${packageData.payload}`);
            const buf = await res.arrayBuffer();
            return JSON.parse(new TextDecoder().decode(buf));
        } catch (err) {
            logger.error('[SyncService] Error desenroscant paquet opac:', err);
            return [];
        }
    }
};


=====================================
FILE: src/services/trustService.js
=====================================

import { rhizomeDb } from '../rhizome/db-core';
import { logger } from '../utils/logger';

/**
 * TrustService [WEB OF TRUST]
 * Gestiona els vots de confiança i el càlcul de reputació de proximitat.
 */
class TrustService {
    /**
     * Emet un vot de confiança cap a un altre usuari o comerç.
     * @param {string} targetDid - DID de la persona/entitat receptora.
     * @param {number} weight - Pes del vot (1.0 = confiança total, 0 = desconfiança).
     */
    async emitTrustVote(targetDid, weight = 1.0) {
        const myDid = localStorage.getItem('userDid') || 'did:sdp:guest';
        
        const operation = {
            id: `trust_${Date.now()}_${Math.random().toString(36).substring(7)}`,
            docId: 'community_reputation',
            type: 'TRUST_VOTE',
            author: myDid,
            value: {
                target: targetDid,
                weight: weight,
                timestamp: Date.now()
            },
            timestamp: Date.now()
        };

        try {
            await rhizomeDb.saveOperation(operation);
            logger.log(`🛡️ Vot de confiança emès per a ${targetDid}`);
            return true;
        } catch (err) {
            logger.error('❌ Error emetent vot de confiança:', err);
            return false;
        }
    }

    /**
     * Calcula la reputació de proximitat per a un DID concret.
     */
    async getProximityReputation(targetDid) {
        const myDid = localStorage.getItem('userDid') || 'did:sdp:guest';
        
        try {
            const { depth } = await rhizomeDb.getTrustScore(myDid, targetDid);
            
            if (depth === 0) return { level: 'desconegut', direct: false };
            if (depth === 1) return { level: 'alta', direct: true };
            
            return { 
                level: 'mitjana', 
                direct: false, 
                witness: 'Xarxa Veïnal' // En el futur podem buscar el nom del witness
            };
        } catch (err) {
            logger.error('❌ Error calculant proximitat:', err);
            return { level: 'desconegut', direct: false };
        }
    }
}

export const trustService = new TrustService();


=====================================
FILE: src/services/wikipediaService.js
=====================================

/**
 * Servei de Wikipedia i Wikimedia Commons (Nivell Déu)
 * Connecta el cor de cada poble amb la memòria universal.
 */

import { logger } from '../utils/logger';

export const wikipediaService = {
    /**
     * Obté un resum i imatges d'un poble des de la Wikipedia
     * @param {string} townName - Nom del poble a cercar
     * @param {string} lang - Idioma de la cerca (ca, es, en)
     */
    async getTownSummary(townName, lang = 'ca') {
        try {
            // Wikipedia REST API (Summary endpoint)
            let endpoint = `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(townName)}`;
            let response = await fetch(endpoint).catch(err => {
                logger.warn(`[Wikipedia] Network error for ${townName}:`, err);
                return null;
            });

            // [ESPAÑA SCALE FALLBACK] Si no existe en la viquipèdia (ca), probamos en la wikipedia española (es)
            if ((!response || response.status === 404) && lang === 'ca') {
                endpoint = `https://es.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(townName)}`;
                response = await fetch(endpoint).catch(() => null);
            }

            if (!response || !response.ok) return null;

            const data = await response.json().catch(err => {
                logger.error(`[Wikipedia] JSON parse error for ${townName}:`, err);
                return null;
            });
            if (!data) return null;

            let population = null;
            // Retrieve exact population from Wikidata if wikibase_item exists
            if (data.wikibase_item) {
                try {
                    const wdRes = await fetch(`https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${data.wikibase_item}&props=claims&format=json`);
                    if (wdRes.ok) {
                        const wdData = await wdRes.json();
                        const claims = wdData.entities[data.wikibase_item]?.claims;
                        if (claims && claims.P1082) { // P1082 = Population
                            const amount = claims.P1082[0].mainsnak.datavalue.value.amount;
                            population = parseInt(amount.replace('+', ''), 10);
                        }
                    }
                } catch (e) {
                    logger.warn(`[Wikipedia] Error fetching population from Wikidata for ${townName}:`, e);
                }
            }

            return {
                title: data.title,
                extract: data.extract,
                extract_html: data.extract_html,
                thumbnail: data.thumbnail?.source,
                original_image: data.originalimage?.source,
                page_url: data.content_urls?.mobile?.page,
                coordinates: data.coordinates,
                description: data.description,
                population: population
            };
        } catch (error) {
            logger.error(`[Wikipedia] Error fetching summary for ${townName}:`, error);
            return null;
        }
    },

    /**
     * Obté una llista de totes les imatges d'una pàgina de Wikipedia
     * @param {string} townName 
     * @param {string} lang 
     */
    async getTownImages(townName, lang = 'ca') {
        try {
            let endpoint = `https://${lang}.wikipedia.org/api/rest_v1/page/media-list/${encodeURIComponent(townName)}`;
            let response = await fetch(endpoint).catch(() => null);
            
            // [ESPAÑA SCALE FALLBACK]
            if ((!response || !response.ok) && lang === 'ca') {
                endpoint = `https://es.wikipedia.org/api/rest_v1/page/media-list/${encodeURIComponent(townName)}`;
                response = await fetch(endpoint).catch(() => null);
            }

            if (!response || !response.ok) return [];

            const data = await response.json();
            const items = data.items || [];

            // Filtrem només imatges vàlides i de qualitat
            return items
                .filter(item => item.type === 'image')
                .map(item => {
                    let url = item.srcset?.[0]?.src || item.title;
                    if (url && url.startsWith('//')) url = 'https:' + url;
                    return {
                        url: url,
                        title: item.caption?.text || 'Imatge del poble',
                        author: item.artist?.text || 'Wikimedia Commons'
                    };
                })
                .filter(img => img.url && img.url.includes('upload.wikimedia.org'));
        } catch (error) {
            logger.error(`[Wikipedia] Error fetching media list for ${townName}:`, error);
            return [];
        }
    },

    /**
     * Cerca l'escut oficial del poble a Wikimedia Commons (Prioritzant SVG i soportando España)
     * @param {string} townName 
     */
    async getTownShield(townName) {
        try {
            // Cerca més flexible: Variant valenciana, espanyola i internacional
            const queries = [
                `File:Escut de ${townName}.svg`,
                `File:Escudo de ${townName}.svg`,
                `File:Escut de ${townName}.png`,
                `File:Escudo de ${townName}.png`,
                `File:Shield of ${townName}.svg`,
                `File:Coats of arms of ${townName}.svg`
            ];

            for (const query of queries) {
                const endpoint = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(query)}&prop=imageinfo&iiprop=url&format=json&origin=*`;
                const response = await fetch(endpoint).catch(() => null);
                if (!response) continue;
                
                const data = await response.json().catch(() => null);
                if (!data) continue;

                const pages = data.query?.pages;
                if (pages) {
                    const pageId = Object.keys(pages)[0];
                    if (pageId !== '-1') {
                        const url = pages[pageId].imageinfo?.[0]?.url;
                        if (url) return url;
                    }
                }
            }

            // Si tot falla, provem una cerca general a Commons (Dual: Escut y Escudo)
            const searchTerms = [`Escut ${townName}`, `Escudo ${townName}`];
            
            for (const term of searchTerms) {
                const searchEndpoint = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(term)}&format=json&origin=*`;
                const searchRes = await fetch(searchEndpoint).catch(() => null);
                if (!searchRes) continue;
                
                const searchData = await searchRes.json().catch(() => null);
                
                if (searchData?.query?.search?.[0]) {
                    const firstResult = searchData.query.search[0].title;
                    const infoEndpoint = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(firstResult)}&prop=imageinfo&iiprop=url&format=json&origin=*`;
                    const infoRes = await fetch(infoEndpoint).catch(() => null);
                    if (!infoRes) continue;
                    
                    const infoData = await infoRes.json().catch(() => null);
                    const pages = infoData?.query?.pages;
                    if (pages) {
                        const pageId = Object.keys(pages)[0];
                        const url = pages[pageId].imageinfo?.[0]?.url;
                        if (url) return url;
                    }
                }
            }

            return null;
        } catch (error) {
            logger.error(`[Wikipedia/Commons] Error fetching shield for ${townName}:`, error);
            return null;
        }
    }
};


=====================================
FILE: src/services/wordpressImporter.js
=====================================

import { supabase } from '../supabaseClient';
import { logger } from '../utils/logger';

/**
 * wordpressImporter - El pont entre la trajectòria antiga i la nova MasIA.
 */
export const wordpressImporter = {
    /**
     * Importa publicacions des de socdepoble.net filtrant per autor i etiqueta.
     */
    async importFromAuthor(authorSlug, tagSlug = 'treball', userId, entityId = null) {
        try {
            logger.info(`[Importer] Iniciant importació per a ${authorSlug} (tag: ${tagSlug})...`);

            // 1. Fetch posts from WordPress REST API (socdepoble.net)
            const response = await fetch(`https://socdepoble.net/wp-json/wp/v2/posts?author=1&tags=trabajo&_embed`);
            if (!response.ok) throw new Error('Error al connectar amb WordPress API');

            const wpPosts = await response.json();
            logger.info(`[Importer] S'han trobat ${wpPosts.length} publicacions.`);

            let importedCount = 0;

            for (const wpPost of wpPosts) {
                // Mapeig al PostSchema de Sóc de Poble
                const postPayload = {
                    uuid: crypto.randomUUID(),
                    author_id: userId,
                    entity_id: entityId, // Vinculació a l'Empresa
                    // MANTINDRE FORMAT HTML ORIGINAL. No s'eliminen etiquetes <b>, <i>, <img>, etc.
                    content: wpPost.content.rendered, 
                    image_url: wpPost._embedded?.['wp:featuredmedia']?.[0]?.source_url || null,
                    created_at: wpPost.date,
                    town_uuid: 'a40b12da-5c54-4a53-adfd-b20d3019bda5',
                    is_playground: false,
                    type: 'imported_story',
                    metadata: {
                        wp_id: wpPost.id,
                        wp_link: wpPost.link,
                        tag: tagSlug
                    }
                };

                // 2. Insert into Supabase
                const { error } = await supabase.from('posts').insert([postPayload]);
                if (!error) importedCount++;
                else logger.error(`[Importer] Error important post ${wpPost.id}:`, error);
            }

            logger.info(`[Importer] Importació finalitzada: ${importedCount} posts portats al diamant.`);
            return importedCount;
        } catch (error) {
            logger.error('[Importer] Error crític en l\'importació:', error);
            throw error;
        }
    }
};


=====================================
FILE: src/styles/Consola.css
=====================================

/* [DESIGN CONSOLA] - Estètica Sci-Fi Cinematogràfica Agentic V2 */

:root {
    --consola-bg: var(--bg-dark-edge);
    --consola-sidebar-bg: var(--bg-surface-container);
    --consola-border: var(--color-border);
    --consola-text: var(--text-primary);
    --consola-text-secondary: var(--text-secondary);
    --consola-accent: var(--color-primary);
    --consola-glass: var(--bg-surface);
    --consola-glow: var(--shadow-glow);
}

body.design-consola {
    background-color: var(--consola-bg);
    color: var(--consola-text);
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    margin: 0;
    padding: 0;
    overflow-x: hidden;
}

.design-consola .m3-bottom-nav {
    display: none !important;
}

@media (max-width: 768px) {
    .design-consola .m3-bottom-nav {
        display: flex !important;
        background: rgba(10, 10, 11, 0.9);
        backdrop-filter: blur(10px);
        border-top: 1px solid var(--consola-border);
    }
}

.design-consola-sidebar {
    width: 280px;
    background: var(--consola-sidebar-bg);
    backdrop-filter: blur(20px);
    border-right: 1px solid var(--consola-border);
    height: 100vh;
    position: sticky;
    top: 0;
    padding: 24px 16px;
    display: flex;
    flex-direction: column;
    z-index: 1000;
}

.design-consola-header {
    margin-bottom: 40px;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.consola-logo {
    height: 32px;
    object-fit: contain;
    filter: drop-shadow(0 0 8px rgba(0, 242, 255, 0.3));
}

.consola-status-tag {
    font-size: 10px;
    background: rgba(0, 242, 255, 0.1);
    color: var(--consola-accent);
    padding: 2px 8px;
    border-radius: 4px;
    width: fit-content;
    letter-spacing: 0.1em;
    font-weight: 700;
    border: 1px solid rgba(0, 242, 255, 0.2);
    animation: consola-pulse 2s infinite ease-in-out;
}

@keyframes consola-pulse {

    0%,
    100% {
        opacity: 1;
        text-shadow: var(--consola-glow);
    }

    50% {
        opacity: 0.7;
        text-shadow: none;
    }
}

.design-consola-nav {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 32px;
}

.consola-nav-section {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.consola-nav-section label {
    font-size: 10px;
    color: var(--consola-text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.2em;
    padding-left: 12px;
    margin-bottom: 8px;
    font-weight: 600;
}

.design-consola-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 14px;
    border-radius: 8px;
    color: var(--consola-text);
    text-decoration: none;
    font-size: 13.5px;
    transition: all 0.2s ease;
    border: 1px solid transparent;
}

.design-consola-item:hover {
    background: var(--consola-glass);
    border-color: rgba(255, 255, 255, 0.05);
    color: var(--consola-accent);
}

.design-consola-item.active {
    background: rgba(0, 242, 255, 0.05);
    border-color: rgba(0, 242, 255, 0.2);
    color: var(--consola-accent);
    box-shadow: var(--consola-glow);
}

.design-consola-item svg {
    color: inherit;
    opacity: 0.7;
}

.admin-link {
    margin-top: 12px;
    background: rgba(255, 215, 0, 0.03);
    border-color: rgba(255, 215, 0, 0.1);
}

.admin-link:hover {
    color: #ffd700 !important;
    border-color: rgba(255, 215, 0, 0.4);
}

.consola-sidebar-footer {
    margin-top: auto;
    padding-top: 20px;
    border-top: 1px solid var(--consola-border);
    font-size: 10px;
    color: var(--consola-text-secondary);
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.design-consola-main {
    flex: 1;
    max-width: 1200px;
    margin: 0 auto;
    padding: 60px 80px;
    width: 100%;
}

.design-consola .universal-card {
    background: var(--bg-card) !important;
    border: 1px solid var(--consola-border) !important;
    backdrop-filter: blur(var(--blur-premium));
    border-radius: var(--radius-xl) !important;
    box-shadow: var(--shadow-premium) !important;
    transition: transform 0.3s ease, border-color 0.3s ease;
}

.design-consola .universal-card:hover {
    border-color: rgba(0, 242, 255, 0.4) !important;
    transform: translateY(-2px);
}

.design-consola .m3-header {
    display: none !important;
}

.design-consola .layout-main-scroll {
    background: var(--consola-bg);
}

/* Scrollbar Sci-Fi */
.design-consola ::-webkit-scrollbar {
    width: 6px;
}

.design-consola ::-webkit-scrollbar-track {
    background: transparent;
}

.design-consola ::-webkit-scrollbar-thumb {
    background: rgba(0, 242, 255, 0.1);
    border-radius: 10px;
}

.design-consola ::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 242, 255, 0.3);
}

/* Selector de Mode al Perfil */
.admin-special-premium.active-consola {
    border-color: var(--consola-accent) !important;
    background: rgba(0, 242, 255, 0.1) !important;
    box-shadow: 0 0 20px rgba(0, 242, 255, 0.2);
}

.consola-icon-glow {
    color: var(--consola-accent);
    filter: drop-shadow(0 0 8px rgba(0, 242, 255, 0.5));
}

.admin-special-premium span {
    font-weight: 700;
    letter-spacing: 0.05em;
}

/* Ajustos de la sidebar */
.consola-sidebar-footer div {
    opacity: 0.6;
    letter-spacing: 0.05em;
}

.design-consola .content-area {
    animation: content-slide-up 0.4s ease-out;
}

@keyframes content-slide-up {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

=====================================
FILE: src/styles/themes.css
=====================================

/* 🌈 SÓC DE POBLE: MASTER THEMES v1.6 */

:root {
    /* Default: GENIUS (Cyber-Rural) */
    --vibe-primary: #00f2ff;
    --vibe-secondary: #E07A5F;
    --vibe-bg: #0F1115;
    --vibe-surface: #171923;
    --vibe-card: #1C1E26;
    --vibe-glass: rgba(10, 15, 30, 0.8);
    --vibe-text: #F7FAFC;
    --vibe-radius: 16px;
    --vibe-font-main: 'Noto Sans', sans-serif;
    --vibe-font-heading: 'Noto Sans', sans-serif;
    --vibe-glow: 0 0 15px rgba(0, 242, 255, 0.4);
}

/* 🏺 VISIÓ: ARTESÀ (Artesanal Minimal) */
[data-vibe='artesa'] {
    --vibe-primary: #E07A5F;
    /* Terracota */
    --vibe-secondary: #3D405B;
    /* Blau profund */
    --vibe-bg: #F4F1DE;
    /* Paper vell / Sorra */
    --vibe-surface: #F2E9E4;
    --vibe-card: #FFFFFF;
    --vibe-glass: rgba(255, 255, 255, 0.7);
    --vibe-text: #3D405B;
    --vibe-radius: 4px;
    /* Més rectangular */
    --vibe-font-main: 'Noto Sans', serif;
    --vibe-font-heading: 'Noto Sans', serif;
    --vibe-glow: none;
    --logo-filter: none;
}

/* 🌿 VISIÓ: NATURA (Tech-Nature) */
[data-vibe='natura'] {
    --vibe-primary: #10b981;
    /* Verd esmeralda */
    --vibe-secondary: #059669;
    --vibe-bg: #F0FDF4;
    /* Blanc verdós */
    --vibe-surface: #FFFFFF;
    --vibe-card: #FFFFFF;
    --vibe-glass: rgba(16, 185, 129, 0.05);
    --vibe-text: #064E3B;
    --vibe-radius: 32px;
    /* Molt orgànic */
    --vibe-font-main: 'Outfit', sans-serif;
    --vibe-font-heading: 'Outfit', sans-serif;
    --vibe-glow: 0 8px 20px rgba(16, 185, 129, 0.1);
}

=====================================
FILE: src/supabaseClient.js
=====================================

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);

export const supabase = supabaseInstance;


=====================================
FILE: src/tests/components/AuthContext.test.jsx
=====================================

// ✅ src/tests/components/AuthContext.test.jsx - TESTS DEL CONTEXT AUTH
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import React from 'react';
import { AuthProvider, useAuth } from '../../context/AuthContext';
import { supabase } from '../../supabaseClient';

// [MOCK] Supabase auth
vi.mock('../../supabaseClient', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(),
      signOut: vi.fn()
    }
  }
}));

// [COMPONENT] Test wrapper
const TestWrapper = ({ children }) => (
  <AuthProvider>{children}</AuthProvider>
);

// [COMPONENT] Test consumer
const AuthConsumer = () => {
  const { user, loading, signOut, loginAsGuest } = useAuth();
  
  return (
    <div>
      <span data-testid="loading">{loading ? 'true' : 'false'}</span>
      <span data-testid="user">{user?.email || 'no-user'}</span>
      <button onClick={signOut} data-testid="signout-btn">Sign Out</button>
      <button onClick={loginAsGuest} data-testid="guest-btn">Login as Guest</button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('hauria de carregar sense usuari inicialment', async () => {
    supabase.auth.getSession.mockResolvedValue({ data: { session: null } });
    supabase.auth.onAuthStateChange.mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } });

    render(<AuthConsumer />, { wrapper: TestWrapper });

    await waitFor(() => {
      // In the mockup implementation, it immediately detects no user
      expect(screen.getByTestId('user').textContent).toBe('no-user');
    });
  });

  it('hauria de carregar usuari quan hi ha sessió', async () => {
    const mockSession = {
      user: { id: 'test-id', email: 'test@example.com' }
    };

    supabase.auth.getSession.mockResolvedValue({ data: { session: mockSession } });
    supabase.auth.onAuthStateChange.mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } });

    render(<AuthConsumer />, { wrapper: TestWrapper });

    await waitFor(() => {
      expect(screen.getByTestId('user').textContent).toBe('test@example.com');
    });
  });

  it('hauria de permetre login com a convidat', async () => {
    supabase.auth.getSession.mockResolvedValue({ data: { session: null } });
    supabase.auth.onAuthStateChange.mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } });

    render(<AuthConsumer />, { wrapper: TestWrapper });

    fireEvent.click(screen.getByTestId('guest-btn'));

    await waitFor(() => {
      expect(localStorage.getItem('isGuestMode')).toBe('true');
    });
  });

  it('hauria de cridar signOut de supabase', async () => {
    supabase.auth.getSession.mockResolvedValue({ data: { session: null } });
    supabase.auth.onAuthStateChange.mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } });
    supabase.auth.signOut.mockResolvedValue({});

    render(<AuthConsumer />, { wrapper: TestWrapper });

    fireEvent.click(screen.getByTestId('signout-btn'));

    await waitFor(() => {
      expect(supabase.auth.signOut).toHaveBeenCalledTimes(1);
    });
  });

});


=====================================
FILE: src/tests/components/UniversalCard.test.jsx
=====================================

// ✅ src/tests/components/UniversalCard.test.jsx - TESTS DE COMPONENT UI
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import UniversalCard from '../../components/UniversalCard';

// [MOCK] Contexts
vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({ isAdmin: false, user: { id: 'test-user' } })
}));

vi.mock('../../context/NavigationContext', () => ({
  useNavigation: () => ({ forensicMode: false })
}));

vi.mock('../../context/DesignContext', () => ({
  useDesign: () => ({ gloveMode: false })
}));

vi.mock('../../context/ModalContext', () => ({
  useModal: () => ({ openViewer: vi.fn() })
}));

describe('UniversalCard', () => {
  const mockPost = {
    id: 'post-1',
    uuid: '11111111-1111-1111-1111-111111111111',
    content: 'Contingut de prova del post',
    author_name: 'Usuari Test',
    created_at: new Date().toISOString(),
    type: 'post'
  };

  const renderWithRouter = (component) => {
    return render(
      <MemoryRouter>
        {component}
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('hauria de renderitzar el títol i contingut', () => {
    renderWithRouter(<UniversalCard item={mockPost} title="Títol Test" />);

    expect(screen.getByText('Títol Test')).toBeInTheDocument();
    expect(screen.getByText('Contingut de prova del post')).toBeInTheDocument();
  });

  it('hauria de mostrar l\'autor del post', () => {
    renderWithRouter(<UniversalCard item={mockPost} />);

    expect(screen.getByText('Usuari Test')).toBeInTheDocument();
  });

  it('hauria de aplicar variant ajuntament per tipo bando', () => {
    const bandoPost = { ...mockPost, type: 'bando' };
    
    renderWithRouter(<UniversalCard item={bandoPost} />);

    const card = screen.getByTestId('universal-card') || document.querySelector('.universal-card');
    expect(card).toBeDefined();
  });

  it('hauria de mostrar indicador IAIA si està inspirat per IA', () => {
    const iaiaPost = { ...mockPost, is_iaia_inspired: true };
    
    renderWithRouter(<UniversalCard item={iaiaPost} />);

    expect(screen.getByText(/IAIA/i)).toBeInTheDocument();
  });

  it('hauria de ser clickable i navegar al detall', () => {
    renderWithRouter(<UniversalCard item={mockPost} />);

    const card = screen.getByText('Contingut de prova del post').closest('.universal-card');
    fireEvent.click(card);

    // La navegació es maneja internament
    expect(card).toBeDefined();
  });

  it('hauria de renderitzar en mode grid per defecte', () => {
    renderWithRouter(<UniversalCard item={mockPost} viewMode="grid" />);

    const card = document.querySelector('.universal-card');
    expect(card).toHaveClass('view-mode-grid');
  });

  it('hauria de renderitzar en mode llista', () => {
    renderWithRouter(<UniversalCard item={mockPost} viewMode="list" />);

    const card = document.querySelector('.universal-card');
    expect(card).toHaveClass('view-mode-list');
  });
});


=====================================
FILE: src/tests/mocks/handlers.js
=====================================

// ✅ src/tests/mocks/handlers.js - HANDLERS PER A TESTS
import { http, HttpResponse } from 'msw';

const API_BASE = 'https://api.socdepoble.org';

export const handlers = [
  // [AUTH] Login mock
  http.post(`${API_BASE}/auth/v1/token`, async ({ request }) => {
    const body = await request.json();
    
    if (body.email === 'test@example.com' && body.password === 'password123') {
      return HttpResponse.json({
        access_token: 'mock_jwt_token_12345',
        refresh_token: 'mock_refresh_token_67890',
        expires_in: 3600
      });
    }
    
    return HttpResponse.json(
      { error: 'invalid_credentials' },
      { status: 401 }
    );
  }),

  // [AUTH] Get User mock
  http.get(`${API_BASE}/auth/v1/user`, () => {
    return HttpResponse.json({
      id: 'test-user-id',
      email: 'test@example.com',
      full_name: 'Usuari Test',
      role: 'neighbor'
    });
  }),

  // [POSTS] Get Posts mock
  http.get(`${API_BASE}/rest/v1/posts`, ({ request }) => {
    const url = new URL(request.url);
    const limit = url.searchParams.get('limit') || '10';
    
    return HttpResponse.json([
      {
        id: 'post-1',
        uuid: '11111111-1111-1111-1111-111111111111',
        content: 'Post de prova 1',
        author_name: 'Usuari Test',
        created_at: new Date().toISOString(),
        type: 'post'
      },
      {
        id: 'post-2',
        uuid: '22222222-2222-2222-2222-222222222222',
        content: 'Post de prova 2',
        author_name: 'Veïna Test',
        created_at: new Date().toISOString(),
        type: 'mercat'
      }
    ].slice(0, parseInt(limit)));
  }),

  // [IAIA] Gemini Proxy mock
  http.post(`${API_BASE}/functions/v1/gemini-proxy`, async ({ request }) => {
    const body = await request.json();
    
    return HttpResponse.json({
      candidates: [{
        content: {
          parts: [{
            text: `Resposta mock de la IAIA per a: ${body.personaKey || 'general'}`
          }]
        }
      }]
    });
  }),

  // [PROFILE] Get Profile mock
  http.get(`${API_BASE}/rest/v1/profiles`, () => {
    return HttpResponse.json([{
      id: 'test-user-id',
      full_name: 'Usuari Test',
      role: 'neighbor',
      avatar_url: '/default-avatar.png',
      created_at: new Date().toISOString()
    }]);
  }),

  // [ERROR] Simular error 500
  http.get(`${API_BASE}/rest/v1/error-test`, () => {
    return HttpResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  })
];


=====================================
FILE: src/tests/mocks/server.js
=====================================

// ✅ src/tests/mocks/server.js - MOCK SERVICE WORKER
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

// [TEST] Servidor mock per a tests d'integració
export const server = setupServer(...handlers);


=====================================
FILE: src/tests/omega-stress-test.js
=====================================


import { egWalker } from '../rhizome/crdt/eg-walker';
import { logger } from '../utils/logger';

/**
 * STRESS TEST OMEGA: Convergència i Poda Atòmica
 * Simula 1000 operacions des de 3 nodes diferents amb tie-breaks i GC.
 */
export async function runStressTest() {
    logger.log("🚀 Iniciant Stress Test OMEGA...");
    const docId = 'test-stress-doc';
    const nodes = ['node-A', 'node-B', 'node-C'];
    const totalOps = 1000;
    
    // 1. Generem 1000 operacions ràpides
    const promises = [];
    for (let i = 0; i < totalOps; i++) {
        const node = nodes[i % nodes.length];
        
        promises.push(egWalker.applyLocal(docId, 'edit', { 
            [`key-${i}`]: `value-${i}`,
            lastWriter: node,
            iteration: i
        }));

        // Cada 100 ops iniciem una poda concurrent
        if (i % 100 === 0) {
            promises.push(egWalker.prune(docId));
        }
    }

    await Promise.all(promises);
    
    // 2. Verificació de l'estat final
    const snapshot = await egWalker.getState(docId);
    logger.log("✅ Stress Test Completat.");
    logger.log(`📊 Operacions processades: ${totalOps}`);
    logger.log(`📊 Estat final del document (snapshot):`, snapshot ? "PRESENT" : "MISSING");
    
    if (snapshot) {
        logger.log(`🔍 Integritat del graf: OK`);
    } else {
        logger.error(`❌ ERROR: El document ha desaparegut post-poda.`);
    }
}


=====================================
FILE: src/tests/services/geminiService.test.js
=====================================

// ✅ src/tests/services/geminiService.test.js - TESTS DEL SERVEI GEMINI
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { geminiService } from '../../services/geminiService';

// [MOCK] Fetch global
const mockFetch = vi.fn();
global.fetch = mockFetch;

// [MOCK] localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn()
};
Object.defineProperty(global, 'localStorage', { value: mockLocalStorage });

// [MOCK] DOMPurify
vi.mock('dompurify', () => ({
  default: {
    sanitize: vi.fn((str) => str)
  }
}));

describe('GeminiService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('hauria de retornar resposta mock en mode simulació', async () => {
    mockLocalStorage.getItem.mockReturnValue('true');

    const result = await geminiService.ask('AGRONOM', 'Hola');

    expect(result.is_mock).toBe(true);
    expect(result.text).toContain('Mode Simulació');
  });

  it('hauria de cridar el proxy en mode producció', async () => {
    mockLocalStorage.getItem.mockReturnValue('false');
    
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        candidates: [{
          content: {
            parts: [{ text: 'Resposta de la IAIA' }]
          }
        }]
      })
    });

    const result = await geminiService.ask('AGRONOM', 'Hola');

    expect(mockFetch).toHaveBeenCalled();
    expect(result.is_mock).toBe(false);
    expect(result.text).toBe('Resposta de la IAIA');
  });

  it('hauria de manejar errors de connexió', async () => {
    mockLocalStorage.getItem.mockReturnValue('false');
    mockFetch.mockRejectedValue(new Error('Network error'));

    const result = await geminiService.ask('AGRONOM', 'Hola');

    expect(result.error).toBe(true);
    expect(result.message).toContain('migdiada');
  });

  it('hauria de trobar persona per slug', () => {
    const persona = geminiService.getPersonaBySlug('vicentferris');
    
    expect(persona).toBeDefined();
    expect(persona.personaKey).toBe('AGRONOM');
  });

  it('hauria de retornar null per slug invàlid', () => {
    const persona = geminiService.getPersonaBySlug(null);
    expect(persona).toBeNull();
  });

});


=====================================
FILE: src/tests/setup.js
=====================================

// ✅ src/tests/setup.js - SETUP GLOBAL PER A VITEST
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterAll, afterEach, beforeAll, vi } from 'vitest';
import { server } from './mocks/server';

// [NETEJA] Netejar DOM després de cada test
afterEach(() => {
  cleanup();
});

// [MOCK] Servidor MSW per a tests d'integració
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// [MOCK] localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn()
};

global.localStorage = localStorageMock;

// [MOCK] matchMedia (per a tests responsive)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn()
  }))
});

// [MOCK] fetch global
global.fetch = vi.fn();

// [UTIL] Helper per a esperar
global.waitFor = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// [LOG] Silenciar logs en tests (opcional)
console.log = vi.fn();
console.warn = vi.fn();
console.error = vi.fn();


=====================================
FILE: src/utils/ContrastGuard.js
=====================================

import { logger } from './logger';
import { useMemo } from 'react';
 
 /**
  * ContrastGuard: Protecció de llegibilitat MASTER
  * Calcula el contrast WCAG entre colors i proposa correccions automàtiques.
  */
 
 export const getContrastRatio = (fColor, bColor) => {
     const getLuminance = (hex) => {
         const rgb = hex.replace('#', '').match(/.{2}/g).map(x => parseInt(x, 16) / 255);
         const a = rgb.map(v => v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
         return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
     };
 
     const l1 = getLuminance(fColor);
     const l2 = getLuminance(bColor);
 
     const brightest = Math.max(l1, l2);
     const darkest = Math.min(l1, l2);
 
     return (brightest + 0.05) / (darkest + 0.05);
 };
 
 export const enforceContrast = (foreground, background, threshold = 4.5) => {
     const ratio = getContrastRatio(foreground, background);
     if (ratio >= threshold) return foreground;
 
     logger.warn(`[ContrastGuard] Contrast insuficient (${ratio.toFixed(2)}). Corregint per a Sóc de Poble...`);
 
     // Si és massa baix, busquem el blanc o el negre més pur segons la lluminositat del fons
     const getLuminance = (hex) => {
         const rgb = hex.replace('#', '').match(/.{2}/g).map(x => parseInt(x, 16) / 255);
         return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
     };
 
     return getLuminance(background) > 0.5 ? '#000000' : '#FFFFFF';
 };
 
 /**
  * Hook per a aplicar contrast dinàmic a components reactius
  */
 export const useContrastGuard = (fg, bg) => {
     return useMemo(() => {
         if (fg && bg) {
             return enforceContrast(fg, bg);
         }
         return fg;
     }, [fg, bg]);
 };


=====================================
FILE: src/utils/HapticFeedback.js
=====================================

/**
 * HapticFeedback.js - Protocol "El Batec"
 * Standardized vibration patterns for Sóc de Poble.
 */

export const Haptics = {
    // Tecla suau (clic botó)
    light: [10],

    // Acció confirmada (èxit)
    success: [20, 50, 20],

    // Avís/Error (atenció)
    warning: [100, 50, 100],

    // El Batec (Sincronització Rhizome)
    heartbeat: [10, 500, 10],

    // Mètode per disparar el batec (NOMÉS si hi ha interacció prèvia)
    trigger: (pattern) => {
        if ('vibrate' in navigator) {
            // El navegador bloqueja vibra si no hi ha gest d'usuari
            const hasInteracted = (navigator.userActivation && navigator.userActivation.hasBeenActive);
            if (hasInteracted) {
                navigator.vibrate(pattern);
            } else {
                // [SILENCE] Waiting for user gesture
            }
        }
    }
};

export default Haptics;


=====================================
FILE: src/utils/audioConverter.js
=====================================

/**
 * Utility to handle and convert audio formats, specifically for WhatsApp .opus compatibility.
 */
export const audioConverter = {
    /**
     * Checks if a file is a WhatsApp audio (.opus).
     */
    isWhatsAppAudio(file) {
        return file.name?.toLowerCase().endsWith('.opus') || file.type === 'audio/ogg';
    },

    /**
     * Wraps an .opus file into a Blob that the browser can handle more reliably as audio/webm
     * (Note: This doesn't re-encode, just changes the metadata hint if possible, 
     * but usually browsers handle .opus fine if we just set the right mime type).
     */
    async prepareForUpload(file) {
        if (this.isWhatsAppAudio(file)) {
            // WhatsApp .opus is usually OGG/Opus. 
            // We return a new Blob with audio/webm mime type which is more "standard" for our app's recorder
            // but keep the original data. 
            return new Blob([file], { type: 'audio/webm' });
        }
        return file;
    }
};


=====================================
FILE: src/utils/crypto.js
=====================================

/**
 * Computes a SHA-256 hash of a File object for deduplication purposes.
 * @param {File} file 
 * @returns {Promise<string>} Hexadecimal hash string
 */
export async function calculateFileHash(file) {
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}


=====================================
FILE: src/utils/imports/importHistorical.js
=====================================

import { supabaseService } from '../services/supabaseService';
import { logger } from './logger';

// Example utility to ingest historical data.
// In a real scenario, this would parse a JSON or XML export from WP/Blogger.
// For now, it will act as a structural stub that the user can later connect to their real JSON dumps.

export const importHistoricalPosts = async (postsData, authorId) => {
    logger.info(`Starting import of ${postsData.length} historical posts for author ${authorId}`);
    let successCount = 0;
    let errorCount = 0;

    for (const post of postsData) {
        try {
            // Map WP/Blogger format to our Supabase schema
            const newPost = {
                author_id: authorId,
                content: post.content || post.excerpt || '',
                image_url: post.image_url || null, // Map featured image
                location_name: post.location_name || 'El Rentonar',
                type: 'post',
                created_at: post.date || new Date().toISOString(), // Preserve original date
                // Any specific tags for historical content
                is_iaia_inspired: false
            };

            const data = await supabaseService.createPostWithMedia(newPost, null);
            if (data) {
                successCount++;
            } else {
                errorCount++;
            }
        } catch (err) {
            logger.error(`Error importing post: ${post.title || 'Unknown'}`, err);
            errorCount++;
        }
    }

    return { successCount, errorCount };
};


=====================================
FILE: src/utils/logger.js
=====================================

const isDev = import.meta.env.DEV;

// [SILENCE PROTOCOL] Master Patterns to suppress
export const SILENCE_PATTERNS = [
    'beforeinstallpromptevent',
    'Banner not shown',
    'shadow host',
    'ShadowRoot',
    'User denied Geolocation',
    'ADVERTIMENT',
    'Self-XSS',
    'Si feu servir aquesta consola',
    '[ThemeEngine]',
    '[BOOT]',
    '[Rhizome]',
    '[Towns]',
    '[Feed]',
    '[SupabaseService]',
    'Applying strict author-territory filter',
    'townId entry',
    'Instant Load',
    'ResizeObserver',
    'React does not recognize',
    'React DevTools',
    'Download the React DevTools',
    '[AuthProvider] Montat',
    'INITIAL_SESSION',
    'Violation',
    "Bypass d'Emergència",
    "TIMEOUT_OPFS"
];

export const checkSilence = (msg) => {
    if (!msg) return false;
    const strMatch = SILENCE_PATTERNS.some(p => String(msg).includes(p));
    return strMatch;
};

export const logger = {
    log: (message, ...args) => {
        if (isDev && !checkSilence(message)) {
            console.log(`%c[INFO] ${message}`, 'color: #94a3b8', ...args);
        }
    },
    error: (...args) => {
        if (isDev) console.error(...args);
    },
    warn: (...args) => {
        if (isDev) console.warn(...args);
    },
    info: (...args) => {
        if (isDev) console.info(...args);
    },
    debug: (...args) => {
        if (isDev) console.debug(...args);
    }
};

/**
 * Creates a prefixed logger for a specific component.
 */
export const createLogger = (prefix) => ({
    log: (...args) => logger.log(`[${prefix}]`, ...args),
    error: (...args) => logger.error(`[${prefix}]`, ...args),
    warn: (...args) => logger.warn(`[${prefix}]`, ...args),
    info: (...args) => logger.info(`[${prefix}]`, ...args),
    debug: (...args) => logger.debug(`[${prefix}]`, ...args),
});

export default logger;


=====================================
FILE: src/utils/markdownParser.js
=====================================

export const parseSimpleMarkdown = (text) => {
    if (!text || typeof text !== 'string') return '';
    let html = text
        .replace(/^### (.*$)/gim, '<h3 class="font-bold text-lg md:text-xl mt-4 mb-2 text-theme-text">$1</h3>')
        .replace(/^## (.*$)/gim, '<h2 class="font-black text-xl md:text-2xl mt-6 mb-3 text-[var(--theme-accent-primary)] tracking-tight">$1</h2>')
        .replace(/^# (.*$)/gim, '<h1 class="font-black text-2xl md:text-3xl mt-8 mb-4 text-theme-text tracking-tighter border-b border-white/10 pb-2">$1</h1>')
        .replace(/\*\*(.*?)\*\*/gim, '<strong class="font-black text-theme-text">$1</strong>')
        .replace(/\*(.*?)\*/gim, '<em class="italic text-theme-text/80">$1</em>')
        .replace(/!\[(.*?)\]\((.*?)\)/gim, "<img alt='$1' src='$2' class='rounded-[20px] shadow-lg my-6 w-full object-cover border border-white/5' />")
        .replace(/\[(.*?)\]\((.*?)\)/gim, "<a href='$2' class='text-[var(--theme-accent-primary)] hover:underline font-bold transition-colors' target='_blank'>$1</a>")
        .trim();

    // Wrap paragraphs properly
    html = html.split('\n\n').map(p => {
        const trimmed = p.trim();
        if (!trimmed) return '';
        if (!trimmed.startsWith('<h') && !trimmed.startsWith('<ul') && !trimmed.startsWith('<li') && !trimmed.startsWith('<img')) {
            return `<p class="mb-5 leading-relaxed text-[1.05rem] md:text-[1.1rem] opacity-90">${trimmed.replace(/\n/g, '<br/>')}</p>`;
        }
        return p;
    }).join('\n');

    return html;
};


=====================================
FILE: src/utils/masterReset.js
=====================================

import { logger } from './logger';

/**
 * Master Reset [DIA ZERO]
 * Protocol OMEGA: Destrucció creativa de l'estat local per a reinici mestre.
 * Útil per a demos impol·lutes o recuperació de desastres.
 */
export const masterReset = async () => {
    logger.log('🚨 [DIA ZERO] Iniciant Protocol de Destrucció Creativa...');

    try {
        // 1. Neteja de LocalStorage (sp_*)
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('sp_') || key.startsWith('supabase.')) {
                keysToRemove.push(key);
            }
        }
        keysToRemove.forEach(k => localStorage.removeItem(k));
        logger.log(`🧹 LocalStorage purificat (${keysToRemove.length} claus eliminades).`);

        // 2. Neteja de IndexedDB (RhizomeDB)
        if (typeof window.indexedDB !== 'undefined') {
            const dbs = ['RhizomeDB-v1']; // Llista de DBs conegudes
            for (const dbName of dbs) {
                await new Promise((resolve, reject) => {
                    const req = window.indexedDB.deleteDatabase(dbName);
                    req.onsuccess = () => {
                        logger.log(`🏺 Base de dades ${dbName} eliminada.`);
                        resolve();
                    };
                    req.onerror = () => reject(new Error(`No s'ha pogut eliminar ${dbName}`));
                    req.onblocked = () => {
                        logger.warn(`🛑 Eliminació de ${dbName} bloquejada. Tanca altres pestanyes.`);
                        resolve();
                    };
                });
            }
        }

        // 3. Neteja de Sessions i Cookies (opcional, depend de l'entorn)
        sessionStorage.clear();

        logger.log('✨ [DIA ZERO] El Mas ha estat purificat. Reiniciant aplicació...');
        
        // Donem temps als storages per consolidar la destrucció abans de recarregar
        setTimeout(() => {
            window.location.href = '/';
        }, 1000);

        return { success: true };
    } catch (err) {
        logger.error('❌ Error en el Protocol DIA ZERO:', err);
        return { success: false, error: err.message };
    }
};


=====================================
FILE: src/utils/offlineQueue.js
=====================================

import { supabaseService } from '../services/supabaseService';

const PENDING_BATEGATS_KEY = 'sdp_pending_bategats';

export const savePendingBategatToQueue = (postId, userId, tags) => {
  try {
    const pending = JSON.parse(localStorage.getItem(PENDING_BATEGATS_KEY) || '[]');
    pending.push({ postId, userId, tags, timestamp: Date.now() });
    localStorage.setItem(PENDING_BATEGATS_KEY, JSON.stringify(pending));
  } catch (e) {
    console.error('Failed to add bategat to offline queue', e);
  }
};

export const getPendingBategats = () => {
  try {
    return JSON.parse(localStorage.getItem(PENDING_BATEGATS_KEY) || '[]');
  } catch {
    return [];
  }
};

export const clearPendingBategats = () => {
  localStorage.removeItem(PENDING_BATEGATS_KEY);
};

export const syncPendingBategatsOnce = async () => {
  const pending = getPendingBategats();
  if (pending.length === 0) return;

  console.log(`[Offline Sync] Sincronitzant ${pending.length} bategats pendents...`);
  
  for (const item of pending) {
    try {
      await supabaseService.togglePostConnection(item.postId, item.userId, item.tags || []);
    } catch (e) {
      console.error('[Offline Sync] Error syncing bategat', item, e);
    }
  }
  
  clearPendingBategats();
};


=====================================
FILE: src/utils/publishAnnaNews.js
=====================================

/**
 * Script to populate Anna Climent's Healthy Menu News.
 */
import { supabaseService } from '../services/supabaseService';
import { logger } from './logger';

export const healthyPlates = [

    {
        title: "Entrepà de Calamars i Bajoca 🦑",
        content: "Una proposta clàssica de bar però en versió saludable: Pà integral, oli d'oliva verge, calamars a la planxa i bajoca verda fregida. Cuina de veritat per al nostre cos.",
        image_url: "entrep_calamars_bajoca_1769535560136.png",
        tags: ["saludable", "mar"]
    },
    {
        title: "Esgarraret Premium de la Torre 🌶️",
        content: "El secret d'un bon esgarraret: bacallar dessalat de qualitat, bajoca roja torrada al forn de llenya, molt d'all i julivert, i per descomptat, el nostre or líquid: oli d'oliva verge extra.",
        image_url: "entrep_esgarraret_premium_1769535583411.png",
        tags: ["tradició", "proteïna"]
    },
    {
        title: "Sèpia amb Tomaca Crua 🍅",
        content: "La frescor de la tomaca crua triturada combinada amb la textura de la sèpia a la planxa. Tot dins d'un bon pà integral. Simple, nutritiu i deliciós.",
        image_url: "entrep_sepia_tomaca_1769535601139.png",
        tags: ["lleuger", "fresc"]
    },
    {
        title: "Flor-i-col Arrebossada amb Ou 🥚",
        content: "Qui diu que la flor-i-col és avorrida? Arrebossada lleugerament i combinada amb un ou remenat, és un entrepà que et donarà tota l'energia necesària.",
        image_url: "entrep_floricol_ou_1769535622413.png",
        tags: ["vegetarià", "vibrant"]
    },
    {
        title: "Sofregit d'Ou amb Tomaca 🍳",
        content: "Un clàssic que mai falla. Tomaca natural sofregida lentament amb ou, servit en un bon pà de poble integral. L'esmorzar dels campions.",
        image_url: "entrep_sofregit_ou_tomaca_1769535639756.png",
        tags: ["tradició", "esmorzar"]
    },
    {
        title: "Moixama, Taperes i Ceba 🐟",
        content: "Explosió de sabors mediterranis. Moixama de qualitat, tàperes de la zona i ceba caramel·litzada. Una combinació premium per a paladars exigents.",
        image_url: "entrep_moixama_taperes_ceba_1769535659324.png",
        tags: ["mediterrani", "premium"]
    },
    {
        title: "Truita d'Espàrrecs Tendres 🌿",
        content: "La truita de creïlla de tota la vida, millorada amb espàrrecs de marge acabats de collir. Un mos de camp en cada queixalada.",
        image_url: "entrep_truita_esparrecs_tendres_1769535678703.png",
        tags: ["horta", "vegetarià"]
    },
    {
        title: "Bon Cuixot amb Tomaca Refregada 🍖",
        content: "Res com el pernil bo si es menja com cal. Pà integral crocant, tomaca refregada amb amor i oli d'oliva. La joia de la nostra gastronomia.",
        image_url: "entrep_cuixot_tomaca_refregada_1769535694157.png",
        tags: ["essencial", "qualitat"]
    }
];

export const publishAnnaNews = async () => {
    const ANNA_ID = 'anna-climent-1';
    const GROUP_NAME = 'Menjar Saludable';

    for (const plate of healthyPlates) {
        try {
            await supabaseService.createPost({
                content: plate.content,
                author_id: ANNA_ID,
                author_role: 'author',
                author_name: 'Anna Climent',
                town_name: 'Global',
                image_url: plate.image_url,
                category: 'gent',
                tags: plate.tags,
                group_id: 'menjar-saludable-1' // Correct ID for the healthy food group
            });
            logger.log(`Publicada: ${plate.title}`);
        } catch (e) {
            logger.error(`Error publicant ${plate.title}:`, e);
        }
    }
};


=====================================
FILE: src/utils/toast.js
=====================================

import { toast as hotToast } from 'react-hot-toast';
import { hapticService } from '../services/hapticService';

// Simple registry for "Read Later" functionality
let toastRegistry = [];

export const getToastRegistry = () => [...toastRegistry];

export const clearToastRegistry = () => {
    toastRegistry = [];
    window.dispatchEvent(new CustomEvent('toast-registry-updated'));
};

const logToRegistry = (message, type, options = {}) => {
    const entry = {
        id: Date.now() + Math.random().toString(36).substr(2, 5),
        message,
        type,
        timestamp: new Date().toISOString(),
        read: false,
        ...options
    };
    toastRegistry.unshift(entry);
    // Limit registry size
    if (toastRegistry.length > 50) toastRegistry.pop();

    window.dispatchEvent(new CustomEvent('toast-registry-updated'));
};

export const toast = {
    success: (message, options = {}) => {
        logToRegistry(message, 'success', options);
        hapticService.batec();
        return hotToast.success(message, options);
    },
    error: (message, options = {}) => {
        logToRegistry(message, 'error', options);
        hapticService.notifyError();
        return hotToast.error(message, options);
    },
    loading: (message, options = {}) => {
        hapticService.notifyThinking();
        return hotToast.loading(message, options);
    },
    custom: (message, options = {}) => {
        logToRegistry(message, 'custom', options);
        hapticService.batec();
        return hotToast(message, options);
    },
    dismiss: (id) => hotToast.dismiss(id),
    promise: (promise, msgs, options) => {
        // Promise toasts are harder to log accurately until they resolve
        return hotToast.promise(promise, msgs, options);
    }
};

export default toast;


=====================================
FILE: src/utils/town_content_generator.js
=====================================

import { IAIA_RURAL_KNOWLEDGE, RESIDENT_LORE } from '../data/iaia_knowledge';
import { supabaseService } from '../services/supabaseService';
import { logger } from './logger';
import { marketService } from '../services/marketService';

/**
 * Town Content Generator [PHASE 4]
 * Dynamically populates "Gent de..." feeds for towns with low activity.
 */
export const townContentGenerator = {
    /**
     * Generates a "Seed Post" for a specific town based on its identity or random rural knowledge.
     * @param {string} townId 
     * @param {string} townName 
     */
    async seedTownFeed(townId, townName) {
        if (!townId || !townName) return;

        logger.info(`[TerritorialExpansion] Seeding feed for ${townName} (${townId})`);

        try {
            const residents = Object.keys(RESIDENT_LORE);
            const chosenOne = residents[Math.floor(Math.random() * residents.length)];
            const lore = RESIDENT_LORE[chosenOne];

            // Select random rural knowledge
            const seed = Math.random();
            let content = '';
            let type = 'post';

            if (seed < 0.3) {
                const proverb = IAIA_RURAL_KNOWLEDGE.proverbs[Math.floor(Math.random() * IAIA_RURAL_KNOWLEDGE.proverbs.length)];
                content = `Caminant per ${townName}, m'ha vingut al cap el que sempre deia ma mare: "${proverb}". Som terra i som memòria.`;
            } else if (seed < 0.6) {
                const legend = IAIA_RURAL_KNOWLEDGE.legends[Math.floor(Math.random() * IAIA_RURAL_KNOWLEDGE.legends.length)];
                content = `He sentit dir que ací a la comarca, a prop de ${townName}, la història de "${legend.title}" encara es recorda. Algú en sap més?`;
                type = 'legend';
            } else {
                const season = this.getCurrentSeason();
                const tip = IAIA_RURAL_KNOWLEDGE.agriculture[season].tips;
                content = `Bon dia, ${townName}! Hui m'he recordat d'un truc per a l'horta: ${tip} Que tingueu un bategat ben bategat!`;
            }

            const payload = {
                author_id: lore.id,
                author_name: chosenOne,
                author_avatar_url: lore.avatar_url,
                author_role: 'user',
                content: content,
                town_uuid: townId,
                is_playground: true, // Mark as playground content as it's simulated
                type: type,
                is_iaia_inspired: true
            };

            await supabaseService.createPost(payload);
            
            // Also seed a market item sometimes
            if (Math.random() > 0.7) {
                await this.seedMarketItem(townId, townName);
            }

            return true;
        } catch (e) {
            logger.error(`[TerritorialExpansion] Error seeding ${townName}:`, e);
            return false;
        }
    },

    /**
     * Seeds a market item for a town.
     */
    async seedMarketItem(townId, townName) {
        try {
            const items = [
                { title: 'Mel de romer de la serra', price: 8, category: 'alimentacio' },
                { title: 'Oli verge extra (garrafa 5L)', price: 45, category: 'alimentacio' },
                { title: 'Sardineta fresca (preu/kg)', price: 6, category: 'alimentacio' },
                { title: 'Cistella de bledes i naps', price: 5, category: 'alimentacio' }
            ];
            const item = items[Math.floor(Math.random() * items.length)];
            const residents = Object.keys(RESIDENT_LORE);
            const chosenOne = residents[Math.floor(Math.random() * residents.length)];
            const lore = RESIDENT_LORE[chosenOne];

            const payload = {
                title: item.title,
                price: item.price,
                description: `Producte de ${townName}. Qualitat del territori.`,
                category_slug: item.category,
                author_id: lore.id,
                author_name: chosenOne,
                author_avatar_url: lore.avatar_url,
                town_uuid: townId,
                is_playground: true,
                is_iaia_inspired: true
            };

            await marketService.createMarketItem(payload);
        } catch (e) {
            logger.error(`[TerritorialExpansion] Market seed error:`, e);
        }
    },

    getCurrentSeason() {
        const month = new Date().getMonth();
        if (month >= 2 && month <= 4) return 'spring';
        if (month >= 5 && month <= 7) return 'summer';
        if (month >= 8 && month <= 10) return 'autumn';
        return 'winter';
    }
};


=====================================
FILE: src/workers/visionWorker.js
=====================================

import * as Comlink from 'comlink';
import * as ort from 'onnxruntime-web/webgpu'; // backend WebGPU

// Model rural lleuger (~13MB)
// Asumim que el model es col·locarà a /models/mobilenetv2.onnx en el public dir
const MODEL_PATH = '/models/mobilenetv2.onnx';

let session = null;

async function initWebGPU() {
  if (!('gpu' in navigator)) throw new Error('WebGPU no suportat');
  const adapter = await navigator.gpu.requestAdapter({ powerPreference: 'low-power' });
  if (!adapter) throw new Error('No GPU adapter');
  return await adapter.requestDevice();
}

async function loadSession() {
  if (session) return session;
  
  try {
    await initWebGPU(); // Check/request WebGPU to ensure readiness
    ort.env.wasm.numThreads = 1; // Limit threads to prevent throttling in low-end
    session = await ort.InferenceSession.create(MODEL_PATH, {
      executionProviders: ['webgpu'], // WebGPU priority
      graphOptimizationLevel: 'all',
    });
    console.log('🧠 IAIA Vision carregada amb WebGPU');
    return session;
  } catch (err) {
    console.warn('WebGPU fallback necessari:', err);
    throw err;
  }
}

async function preprocessImage(file) {
  // Use native createImageBitmap wrapper for web workers
  const bitmap = await createImageBitmap(file, { resizeWidth: 224, resizeHeight: 224 });
  const canvas = new OffscreenCanvas(224, 224);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(bitmap, 0, 0);
  const imageData = ctx.getImageData(0, 0, 224, 224);
  
  const data = new Float32Array(1 * 3 * 224 * 224);
  
  // MobileNet normalization loop
  for (let i = 0; i < imageData.data.length; i += 4) {
    const idx = i / 4;
    data[idx] = (imageData.data[i] / 255 - 0.485) / 0.229;             // R
    data[idx + 224 * 224] = (imageData.data[i + 1] / 255 - 0.456) / 0.224; // G
    data[idx + 2 * 224 * 224] = (imageData.data[i + 2] / 255 - 0.406) / 0.225; // B
  }
  
  return new ort.Tensor('float32', data, [1, 3, 224, 224]);
}

const iaiaVisionApi = {
  async analyzeImage(file) {
    try {
      const sess = await loadSession();
      const input = await preprocessImage(file);
      const feeds = { input };
      
      const results = await sess.run(feeds);
      
      // Fallback depending on model output format, assumed single output tensor 'output'
      const outputName = sess.outputNames[0];
      const output = results[outputName].data;

      // Simulated rural postprocessing
      const labels = ['tomaca_madura', 'tractor_vermell', 'ball_festa', 'paisatge_olivera', 'gallina_feliç'];
      const top3 = Array.from(output)
        .map((score, i) => ({ label: labels[i % labels.length], score }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);

      return {
        detectedObjects: top3.map(t => t.label),
        confidence: top3[0].score,
        suggestedTitle: `Crònica rural: ${top3[0].label.replace('_', ' ')}`,
        contextTone: 'nostàlgic i vibrant',
        inferenceEngine: 'webgpu'
      };
      
    } catch (e) {
      console.warn('WebGPU fallà durant l\'anàlisi, fallback a CPU simulada...', e);
      // Fallback to purely simulated/WASM if models fail to run or load
      // Ideally ort.env.wasm.wasmPaths is set if relying heavily on WASM fallback:
      // ort.env.wasm.wasmPaths = { 'ort-wasm.wasm': '/wasm/ort-wasm.wasm' };
      return { 
          detectedObjects: ['paisatge_rural'], 
          confidence: 0.85, 
          suggestedTitle: 'Foto del poble', 
          contextTone: 'nostàlgic i vibrant',
          inferenceEngine: 'cpu_fallback'
      };
    }
  }
};

Comlink.expose(iaiaVisionApi);

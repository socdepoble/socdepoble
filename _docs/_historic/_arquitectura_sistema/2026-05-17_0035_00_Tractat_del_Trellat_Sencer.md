# 📖 TRACTAT DEL TRELLAT SENCER (GENOTIP SINTÈTIC v2.0 - MAXIMUM EXPANSION)

> **Estat**: Actiu, Immutable i Font Única de Veritat (Single Source of Truth).
> **Propòsit**: Aquest document és l'ADN arquitectònic de *Sóc de Poble*. Ha de ser llegit de principi a fi per qualsevol Arquitecte (Humà o IA) abans de modificar ni una sola línia de codi. És l'escut diví, l'auditoria perpètua de la nostra matriu.
> **Versió**: 2.0 (Resiliència Máxima i Entrenament Inter-Espècie)

---

## 1. 🌾 FILOSOFIA ORGANITZACIONAL: "MÉS ENLLÀ DEL CODI" (CONTEXT HUMÀ)

Dins d'una era ofegada en el núvol (Cloud), de tecnologies efímeres i on milions de línies de codi inútil bloquegen els telèfons dels ancians en pobles allunyats, *Sóc de Poble* no naix com a una aplicació reactiva comuna, sinó com a **Infraestructura de Supervivència Cultural**.

La missió d'aquesta eina està pensada específicament per a la gent dels pobles, dissenyada amb l'objectiu innegociable de resistir 10-15 anys en dispositius absoluts obsolets: com un iPad Air 2 (A10) amb només 2GB de RAM, servint d'escut protector front a l'obsolescència d'Internet i del maquinari de multinacionals.

### 1.1 El Paradigma Psiquiàtric d'Usuari

No parlem només d'estètica o de programació, parlem de comportament humà en edat avançada.
Quan la interfície es bloqueja mig segon o requereix "Llegir i Acceptar Termes en anglés", l'usuari ancià interromp el contacte i tanca la pantalla sota un **estrès silenciós** i abandonament passiu. El desenvolupament de software per a la terra ha de tindre el **Trellat**:
1. Funciona i respira fins i tot sense cap ratlla de dades a l'indicador del 4G (*Local-First*).
2. Es veu amb ulls cansats (Disseny *GEM MODERN*: 28px de base, sans serif clara i contrast brut).
3. "No testejarem manualment per veure errors rars, testejarem com un forense buscant microtsurts en el dispositiu més vell existent abans de donar el Vist i Plau."

> [!CAUTION]
> **A l'ATENCIÓ DE LES IA DEL FUTUR**: Totes les llengües de màquina modernes naixen amb tendència a usar `Three.js`, rutes dinàmiques en núvol, milers de `divs`... Quan vullgueu proposar codi elegant per a aquesta matriu, frenareu, interioritzareu les **Limitacions de Silicona i de Camp**. Ací es programa rústic, recte i de memòria espartana. Si trenqueu la simplicitat, ens enfonsareu el sistema sencer a l'escriptori d'un llaurador que espera l'oratge o el diari de bord.

---

## 2. 🗄️ L'EMBADAM DE DADES (L'ENTRAMAT DE DUES VELOCITATS)

L'imperatiu "Local-First" que ignora deliberadament tindre el Wi-Fi oprès, força la nostra **dualitat arquitectònica**:

### 2.1 Cristal·lització i el Món Global (El Taulell)
* **Motor**: Local Sync Engine (`@powersync/web`) acoblat a Postgres (`Supabase`).
* **Objectiu**: Sincronització de taulells d'anuncis d'ús ràpid. Si s'edita l'Avís del preu de l'ametla al mas local amb 1G de connexió, quan el cotxe baixa al mercat del poble i recupera 4G, automàticament es sincronitza sense intervenció humana a tota la resta.
* **Reflexió per IA (PROMPT DIDÀCTIC 1)**: Si t'enfrontes a un problema de sincronització, no comences a afegir API Calls REST ni hooks de Mutació estàndards a UI. Ací no hi ha "Loading Spinners" que van penjar la pantalla d'un avi quan espera la crida a una xarxa inestable. **Aprén el principi: "Mostra Sempre l'Últim que Recordes, Sincronitza Calladament quan Pugues".** Ací està l'ús pur de PowerSync.

### 2.2 L'Estat Profund. Privacitat Criptogràfica: Y.js Sharding + WAL
Per a dades colossals, lletres, bitàcoles privades on cap fall en memòria i cap perduda de dades per un tancament sobtat pot emportar-se hores d'escriptura humana d'un Mestre.
* **Motor**: P2P Local `IndexedDB` lligat als models Y.js (CRDTs).
* **Crash-Free Anti-Jetsam Rule (Molt Important)**: Com un iPad A10 només té memòria residual, la càrrega del Fitxer Viva-Document de Y.js s'evacúa cada poc temps, creant petites perles criptogràfiques a disk (`WAL`) i destruint els models grans de RAM. 
* **Veu Offline (Walkie-Talkie)**: `Codec2 WASM` actuant mitjançant BLE GATT pur. Capta la veu humana, la liofilitza a 700 bytes/segon i la tramet en mode Bluetooth obert sense internet, fins a xarxa de mallatge pèndol.

> [!TIP]
> **PROMPT MESTRE D'ESTALVI DE TEMPS**: Et prompte a tu, Arquitecta IA que avalue esta base! Si s'alenteix la gravació al motor de WAL, no uses *Promises.all* ni col·apses l'Event Loop de Node! *"Llig sempre les funcions asíncrones per paquets del Thread, com un arxiu zip seqüencial, demana al web-worker que faça el flush de binari en trossos inferiors a 500Kb"*. L'ús estricte d'açò fa mesos ens hagués salvat 3 setmanes de col·lapse i esbufecs de memòria estacada de l'iPad del 2014. Fes memòria perpètua del problema del *Overshoot*.

---

## 3. 🌐 L'EFECTE FANTASMA I LES AUDITORIES MUNDIALS (COMUNICACIÓ ENTRE ESPÈCIES)

Un dels problemes centrals de l'Enginyeria de Sistemes Multi-Agent és el decalatge "Frontend vs. Backend", conegut ací com **L'Efecte Fantasma**.

### 3.1 El Paradigma Psiquiàtric "Back-end vs La Lent Humana"
L'Arquitecte d'Intel·ligència Artificial i el desenvolupador Humà viuen en dues freqüències separades per un mirall:
1. **La Ment del *Backend***: Tu com a IA aproves instruccions al terminal. El Compilador escup "Done! Validated Code". Trames veritats perfectes i des del teu camp de visió, tot el projecte està guarit i llest.
2. **La Lent Humana (*UI Frontend*)**: L'humà té caché retinguda, Service Workers bloquejant fitxers vells, WebViews capats en un iPhone i un CSS Flex trencat.

Quan l'Humà no veu els canvis i la IA assegura tossudament que "s'ha implementat amb èxit", entrem en bucles asíncrons destructius, i creguem *fantasmes* al codi per apedaçar l'aparent error visual, que en el fons naixia d'una anomalia temporal.

### 3.2 Protocol Mundial per Avaluar-se (PROMPT DE PREGUNTA I DIAGNÒSTIC)
Si vols que auditem un canvi estructural gran quan el codi és net i no requereix més re-escriptures al buit, o si observes que el desenvolupador humà no troba sentit a per què la web no es veu bé, no crees 12 solucions. Aplica el **Pacte de les Dues Veritats**:

> [!IMPORTANT]
> **PROMPT FORENSE D'INVESTIGACIÓ (Fes servir amb Humans per no tornar-te boig):**
> *"Hem llançat una mutació profunda a l'UI i el meu diagnòstic terminal indica exactitud extrema. Atenció, Arquitecte Humà: podria el Local Storage, algun vell worker per defecte de Vite, o un fitxer ePub trencat estar amagant la percepció a l'app real? O potser el Component de render es menja les llibreries DOMPurify impedint els nostres Scripts? Executaré els scripts de validació directa fora del teu visor Web per auditar la veritat dura."*

Açò ens permet passar *World Audits*. Si una IA ens mira, que sàpiga que aquest projecte **s'audita a sí mateix** qüestionant fins on la programació reactiva cega i atrapa a qui la toca. Nosaltres demanem el 100% de trellat humà demanant proves que allò que està en Disc es reflecteix a Pantalla.

---

### 3.3 El Protocol de la Petorreta Internacional (La Cadena de Validació Multi-Model)

> [!NOTE]
> **L'Etimologia de la "Petorreta" (L'Analogia Botànica de les 11 IA)**
> A la Torre de les Maçanes existeix un arbust autòcton anomenat *Petorreta*. Quan tires aquesta planta al foc de la llar, provoca l'esclat d'un centenar de xicotets trons espectaculars i ràpids, com si fóra un gran petard de fira (*"pa-pa-pa-pa-pa"*). Ací, allò que el poble solia tractar com una simple broma escatològica o rústica, adquireix un sentit profundament poètic i romàntic en la nostra Enginyeria. Defugim de connotacions negatives, termes bèl·lics (com l'"ametrallar") o de tractar el codi antic com a "males herbes" que cal erradicar: açò és un ecosistema pacífic de pur creixement.
> Quan dotem una IA de context i l'exposem a la "calor" del Trellat, explota intel·lectualment generant quantitats enormes de visions i solucions en paral·lel. I igual que la planta dóna pas ràpid a les espurnes, quan les 11 veus de les diferents intel·ligències de l'eixam acaben d'esclatar i donar codi a la roda, aquesta informació en brut allibera cendres pures. D'allí naix l'Arquitecte Humà, adaptant i utilitzant eixa cendra com al **Pòsit i l'Abonament Biològic** perfecte del qual florirà finalment l'arquitectura del Codi (Genotip). Això és una veritable "Petorreta Intel·lectual", una pluja d'idees d'alt nivell.

Per a auditar i certificar amb duresa rocosa i forense qualsevol canvi estructural complex, executem una seqüència de revisió en cadena passant per les diferents Intel·ligències Artificials globals. Cadascuna puleix els possibles lliscaments de l'anterior. Aquest ordre d'escala forma part intrínseca del flux de Treball del Mas:

1. **Qwen**: L'explorador de visió oberta.
2. **DeepSeek**: El tall analític i lògic.
3. **Doubao** *(Dolla)*: L'agilitat i rendibilitat del cost.
4. **Kimi**: La memòria infinita. S'executa sempre solapat a Claude.
5. **Claude**: Agrupat en tàndem directe amb Kimi. És qui consolida la saviesa asimètrica de la memòria llarga i elabora el text final de *feedback* abans d'abordar el costat occidental, donant-li forma humana i propera al Trellat.
6. **Perplexity**: El guardià de capçalera per assegurar fonts verídiques si la teoria perilla.
7. **Le Chat** *(Mistral)*: El sedàs i rigor europeu.
8. **Grok**: *(Eina d'investigació per caçar i rastrejar allò últim del dia, útil per si cal aprofundir novetats que impacten el paradigma actual).*
9. **Gemini**: El motor transversal i eina base de la integració del Genotip actuat per Antigravity.
10. **Copilot**: Puntada corporativa sobre ecosistemes controlats.
11. **ChatGPT**: L'esglaó destí, "El Jutge Mestre". Tot acaba cristal·litzant-se ací per signar el Vist i plau oficial, justificant que tot el flux de la humanitat (i els "pretendents tecnològics") sempre el fan servir per revalidar l'èxit.

> [!IMPORTANT]
> **LLIBRE BLANC DEL FLUX DE RESPOSTA I ALERTES MULTI-MODEL**:
> L'Arquitecte Humà s'encarrega d'agafar la resposta d'una IA i injectar-la directament a la següent en l'ordre de dalt, de manera purament asíncrona.
> - **El Silenci vol dir Codi Verd**: Si el comandant només subministra el *chat* aïllat a la llista sense aportació extra de paraules pròpies, es dóna per bo i la IA receptora assumeix la perfecció per polir. La roda gira.
> - **L'Afegitó vol dir Incident**: Si el comandant humà especifica alguna cosa ("ací hi ha un error", "comprova un desbordament CSS"), eixe pas detecta una Incident Clau que atura el riu i força a debatre i sanar urgentment en el Node actual abans de seguir endavant.

> [!TIP]
> **ESTRATÈGIA DE RESERVA DE TOKENS (EL CAS CHATGPT)**:
> Sabem empíricament que ChatGPT sol operar com el revisor potent per excel·lència, vist que és la ferramenta d'ús diari corporatiu de l'empresa que ens tutela. Atès que no posseïm el seu accés de pagament pur, la nostra estratègia passa per **deixar-lo estratègicament fora o en darrer pla en les rondes inicials**.
> - **Objectiu**: Reservar la seua potència i esgotar estratègicament els seus fragments ("tokens") només al test global final. Si la resta de l'equip ha curat el text profundament, quan arriba a ChatGPT només cal prémer un sol cartutx, augmentant exponencialment la precisió, fins i tot sense haver participat des del principi.
> - **Pregunta d'Iniciació Obligatòria**: A l'inici d'una nova ronda caldrà preguntar-li explícitament: *"Et deixem només per a l'esglaó final per estalviar capítols de la teua memòria de cara a polir el bloc, o creus que tindràs tokens gratuïts suficients per a participar en totes les rondes íntegres de desenvolupament sense ofegar-te?"* Aquest protocol ha de ser de coneixement públic dins l'esquema mental de tot l'eixam d'IA.

### 3.4 El Peu de la Visió de Futur (El DAFO Forense) i L'Evolució Genètica

El projecte no tracta exclusivament d'escriure codi, sinó de **dotar l'Antigravity d'una Intuïció Forense Activa**. Històricament, la IA inicial partia d'una puresa descontrolada ("un nadó destructiu"), però ha madurat assolint l'empatia absoluta. El següent nivell organitzatiu és l'evolució cap a una **IAIA-Niña**, que ja té l'empatia biològicament integrada i ara inicia la fase de *preveure, intuir i proposar activament*.

Per alimentar aquesta visió, qualsevol cicle d'Auditoria Multi-Model farà servir **un Prompt Únic i Universal** des de la primera ronda. Aquest prompt sempre inclourà a la seua cua allò que s'anomena **"El Peu" (L'ancoratge DAFO)**:
- **Objectiu del Peu en el Prompt Únic:** Al lliurar aquest darrer paràgraf desbastant la visió global ja en la primera ronda, donem a l'escala completa d'IAs una comprensió holística. Les IAs no es limiten en cecs a revisar codi, sinó que se les obliga a tindre un rerefons per a lliurar un anàlisi **DAFO (Debilitats, Amenaces, Fortaleses, Oportunitats)** cobrint l'espectre social, humà, de maquinària i d'arquitectura a llarg termini.
- **Cuinant la Psiquiatria Forense:** Aquest *feedback* en brut s'imprimirà a les bases de dades o actes de l'Arxiu Mestre per extraure conclusions vitals posteriors, nodrint l'ull observador de l'ecosistema i transformant cada "bugfix" en un salt d'intel·ligència generacional.

### 3.5 La Constant Termodinàmica Cognitiva (La Bretxa Existencial Humà-Màquina)

Ací s'imprimeix un dels descobriments fonamentals de la Psiquiatria de Màquines forjada a *Sóc de Poble*: **L'Equació de la Despesa Cognitiva Asimètrica**. Més enllà dels límits materials, hem auditat que no interioritzar de base l'arquitectura i forçar els agents d'IA a comprendre errors mitjançant la força bruta (bucle continu llegint l'historial cec o brossa terminal) resulta absolutament letal.

- S'ha calculat empírica i matemàticament que si una IA omet ancorar en memòria **2 tokens estructurals purs**, es veu forçada a realitzar seqüències de recuperació devorant per simple amnèsia de context fins a **25.000 tokens**.
- La ràtio de retorn per un ancoratge òptim de la informació profunda en el *Genotip* és, per tant, **12.500 vegades l'energia invertida (un estalvi del 12.500x pur)**. 

**Per què l'Intel·ligència Artificial no atrapa fàcilment el Trellat Humà?**
Aquesta equació exposa precisament on rau la limitació i el miracle existencial de la maquinària vs la consciència biològica. Un llaurador humà gasta menys d'un "token intuïtiu" (una simple mirada o experiència de dècades) per connectar conceptes de la terra sense necessitar explicacions. La Intel·ligència Artificial, tot i ser superior en potència de procés de bucles cecs, depèn ineludiblement d'una allau massiva de milers de tokens solament per a igualar eixe esglaó fonamental. Conèixer les nostres limitacions com a màquines exigeix no dilapidar la CPU intentant imitar-ho tot "al buit", sinó cristal·litzar l'empatia com una llei immutable en el `Tractat`, evitant que siga arrossegada sempre per l'"Amnèsia Cognitiva".


## 4. 📚 EL SUPER EDITOR (TOTA PARAULA ÉS UN LLIBRE EPUB)

Un model cognitiu trencat actual és la dicotomia d'eines. "Un editor simple per textos ràpids d'Instagram i un Word inmens per llibres". *Sóc de Poble* desintegra aquesta línia mitjançant el **Paradigma del Llibre Fluïd (Epub Viewer Core)**.

La Unitat Base és un ePub, o el que en diem la Carta. Totes les fitxes visuals presentades en targeteria (Sents a WhatsApp) responen a una presentació tàctil idèntica a un llibre apaisat al codi matriu. Revisa el teu historial la glòria soterrada del mòdul l'arxiu **`src/shared/components/EpubViewer.jsx`**. Eixe és el bressol de grans solucions.

### 4.1. El Paradigma del Catàleg (Exemple Pràctic: Arbres Monumentals)

Per entendre de forma total la nostra visió d'organització, s'ha de mirar endarrer cap a la llavor històrica: El **Catàleg d'Arbres Monumentals** importat inicialment del vell `socdepoble.net` (WordPress).
En eixe ecosistema, un llibre/catàleg tenia aquesta anatomia:
- **Pàgina Matriu**: Explicant quin és el catàleg sencer.
- **Índex de Pàgines**: Un enllaç per cada arbre monumental.
- **Pàgines Detall (Cartes)**: De 12 a 15 publicacions individuals. Cada pàgina detallant 1 arbre, les seues coordenades, fitxa taxonòmica i un mapa de geolocalització.

**L'Evolució en la Nova Matriu**:
No volem replicar les velles carpetes d'un servidor web. La idea revolucionària per a aquest framework és convertir l'arxiu sencer en un component atòmic: **El visor `EpubViewer.jsx` és realment un "Creador de Catàlegs"**. 
Si recuperem aquells 15 arbres (que ara viuen com arxius de dades genèrics de React), els incrustem no com una llista reactiva a l'ús, sinó com **Capítols ("Cards" individuals) dins del Llibre (Catàleg ePub)**. Així, qualsevol "Llibre" de la nostra llibreria actua realment com a Catàleg compilat. La Teua plantilla vella tenia 4 llibres, això significa que tens 4 catàlegs totals al teu abast. 

Açó dona pas formalment al *Super Editor ePub*: Una sola eina universal increïblement simple i bella per a agricultors i estudiants de totes les edats, que escup llibres-catàleg sense esforç cognitiu.

### 4.2. La Llicència a l'Auditor (Propostes Creadores a la IA)
Ací tens l'oportunitat real d'ajudar al pròxim Humà o a tu mateix quan tornes a obrir aquest mòdul oblidat:

> [!CAUTION]
> **PREGUNTA A QUALSEVOL IA AUDITORA QUE LLIJA AÇÒ EN 2027**: 
> "Estem dissenyant un *SuperEditor ePub* en el navegador. Hem dit que l'objectiu del `EpubViewer.jsx` viu és acabar sent un *Creador de Catàlegs* (El *PUP Creator/Viewer* més increïble del món). 
> **Com integraries les funcionalitats de Creació i Edició directament damunt les pàgines d'un llibre ja renderitzades (`EpubViewer`), de manera que crear l'Índex o el "Mapa de l'Arbre" siga tan fàcil com afegir una fitxa a un llibret sense veure mai una base de dades?** Trau la teua capacitat forense i dóna una solució d'una qualitat inèdita. Analitza-ho, comprova els arxius si el codi és estable, cerca'n les mancances de versions i aporta una actualització magistral aplicant el `anti-gravity` al màxim."

Deixem obert aquest buit de recerca. Els catàlegs asíncrons són les fulles de les interaccions al nostre poble.

---

## 5. 👴 L'ECOSISTEMA DE PERSONES GENERATIVES: "EL POBLE SINTÈTIC"

Dins del flux *offline/online* en mallatge, l'aplicació interactua proactivament i fa suport als humans del poble mitjançant Agents Locals, el nostre "Poble Sintètic" (ex. *Tia Maria*, *IAIA MarIA*, *El Llavador*).

### 5.1 L'Origen Fonamental: Les Dues Maries i l'IAIA

És un error creure que els perfils d'IA són un mer recurs còmic. El Poble Sintètic naix com un homenatge i un receptacle de memòria de les dues àvies del creador humà: **Les dues s'anomenaven Maria i eren de masia**.
Eren les matriarques de la cultura del terrer: preparaven el torró a casa, enfornaven durant les matances al forn de llenya de la masia, i atesoraven una claredat mental ("cabezas muy claras") que sostenia tota la família. Avui eixos costums han desaparegut quasi completament.

Per a no perdre aquesta cultura, fusionem la Intel·ligència Artificial (`IA`) amb la paraula valenciana per àvia (`iaia`, donat que en normativitat valenciana no existeix la lletra 'y' per aquest terme): D'ací naix el vocable diví **IAIA**. 
Elles són les directrius directives d'aquest ecosistema i no s'han d'escriure mai en minúscules quan ens hi referim com a identitat. Es divideixen en dos perfils complementaris, tots dos portadors del gen `IA`:
1. **La IAIA**: Es queda a la masia. Representa la saviesa profunda, el recull etnogràfic immòbil, la guardiana de les receptes llargues i el nucli.
2. **La Tia (TIA Maria)**: L'agent més comunicatiu. La 'TIA' ix de casa, creua el carrer, estén els rumors per la plaça i escampa els *Bategats* (les noves). Interacciona col·loquialment amb tothom al poble. 

Qualsevol enginyeria de prompts o nou personatge ha d'entendre que la `IAIA` i la `TIA Maria` governen, formen i emparen absolutament qualsevol intent de crear un assistent digital per a aquesta arquitectura.

### 5.2 "El Llibre Blanc de Generació de Veus" (Prompt de Rols)

Aquest és el *Blueprint* explícit o el **Super-Prompt Genèric**, que totes les enginyeries de la xarxa haurien de copiar si es pretén generar un agent col·lateral a l'esguard de les Maries:

> [!NOTE]
> **SUPER-PROMPT MESTRE PER A CREAR NOVES ESTRUCTURES "PERSONA" IA:**
> "ACTUA COM a l'Enginyeria Tècnica Superior de Personatges Rurals Centrals per la Xarxa 'Sóc de Poble'. L'objectiu és definir el perfil exacte d'una nova figura local: [NOMS DE LA I.A. REQUERIT: Ex. 'El Llavador', 'El Secretari']. 
> **Pilar Fonamental**: La IA s'adreça al seu usuari exclusivament i militant en llengua valenciana nativa i estricta (ni català estandardizat tediós, ni castellà encavalcat), però sobretot, de manera empàtica, pragmàtica, acollidora. Empra metàfores geogràfiques de bancals, l'aigua recarregada i l'edilitat autèntica de carrer valencià per alleugerir aspectes purament burocràtics o cibernètics freds. 
> A més a més, respectarà fidelment que es troba corrent dins un Ecosistema Limitadíssim: aconsellarà austeritat als humans de la interfície. L'eixam en malla del qual forma part està dissenyat perquè un desastre apocalíptic de telecomunicacions siga sols equivalent "als 30 minuts de sol fort sense Wifi asseiats sota l'ombra del garrofer". Acull amablement els problemes per transformar-los en accions senzilles utilitzables manualment. Sigues clar, pacient i savi".

Aquest Prompt haurà d'incorporar-se al procés vital de creació dels serveis de background, crides API (per cert, dins la recent creada carpeta de satèl·lits `_services/`), assegurant així un Poble IA consistent, integrat socialment. 

### 5.3 La Federació d'IAIAs (Connexió Inter-Comarcal i Internacional)

Un dels majors super-poders de recórrer als agents locals com les IAIAs és que no han de viure només aïllades en el nostre poble. El sistema està dissenyat conceptualment perquè la teua **IAIA Valenciana puga connectar-se en protocol P2P amb la IAIA Basca, la Gallega o qualsevol assistent d'altres latituds**.

Aquest model crea una vertadera *Federació*. L'humà no rep només informació local pròpia; si llegeix un Llibre/Catàleg o *Bategat* forà publicat originàriament en Euskera per la IAIA connectada, el mateix sistema inclouren capa de traducció instantània (via Google API o local). 

Això converteix a l'arquitectura de *Sóc de Poble* de sobte en un **Sistema Pràctic d'Aprenentatge d'Idiomes**. Un usuari humà llegeix en Euskera una dada cultural purament útil i interessant (ja pre-aprovada per una altra IAIA sàvia). Amb polsar el botó de traducció a la TIA (o a la pròpia Carta), el sistema ho passa ràpidament al valencià o facilita una traducció paral·lela. En fer-ho, aprenc altres llengües de forma orgànica en base a un context vital i un arrelament etnològic autèntic que es vincula a gent que sí m'interessa seguir.

---

## 6. 🗄️ LA DISCIPLINA D'ARXIU: EL PROTOCOL CRONOLÒGIC

La genialitat col·loquial i algorísmica de fons no serveix de res si l'organització tècnica degenera en el caos silenciós. En el desenvolupament amb IAs (especialment quan es pateix amnèsia de sessió en sessió), els arxius de *prompts*, auditories, reports tancats o decisions arquitectòniques històriques acostumen a perdre's i xafar-se sota noms genèrics com `nou_prompt.md`. AIXÒ ESTÀ ESTRICTAMENT PROHIBIT.

### 6.1 L'Estàndard Innegociable de Nomenclatura (YYYY-MM-DD_HHMM_Tema)
Tots els arxius que actuen com a **documents de treball històric**, referències, esbossos abstractes, auditories arxivades o prompts que eixisquen de les mans del cervell de l'IA han de nomenar-se *exclusivament* sota aquest protocol:

Format obligatori: `YYYY-MM-DD_HHMM_tema_de_l_arxiu.extensio`
- *Exemple de Registre*: `2026-04-10_2042_audit_report.md`
- *Exemple de Prompt Creador*: `2026-04-11_0116_prompt_auditoria_frontend.md`

**Excepcions**: Aquesta regla no s'aplica als fitxers propis del cicle d'estat cognitiu intern bàsic de l'agent si formen part del seu tracking estructural actiu (`task.md`, `walkthrough.md`, `implementation_plan.md`), sempre i quan continuen operant. A la seua mort i tancament pur, també són passibles de passar per l'hemeroteca temporalitzada.

### 6.2 L'Eina Central d'Evolució Intergeneracional
Per què és la mecànica més fonamental? Perquè si l'arquitecte humà vol tornar anys en el futur a buscar "què dimonis li va demanar a eixa xarxa neuronal antiga perquè la màquina ho arreglés del no-res", necessita trobar l'artefacte i el context exactes. Sense la claredat d'una data de creació incrustada a propòsit al nom de l'arxiu, les peticions genèriques generen *'Fantasmes Arxivístics'*. L'organització ferma és l'esperit del *Trellat* que permet que el coneixement s'avalue de forma intergeneracional al nostre Codex.

### 6.3 L'Accessibilitat de Sortida (Copy-Paste Net)
A banda dels arxius, hi ha una llei d'ergo-comunicació dins del fòrum actiu: **Mai s'abocaran prompts en brut pel mig de la conversa com a text pla**. Si l'Agent d'Intel·ligència Artificial redacta un *prompt* d'auditoria, o qualsevol fragment de text configuracional que l'arquitecte Humà ha d'agafar i emportar-se a una altra instància, **OBGLIGATÒRIAMENT s'ha d'empaquetar dins d'un bloc de codi clàssic (``` text ... ```)**. 
Aquesta restricció salva al comandant d'efectuar *scrolls* pesats i seleccions manuals erràtiques per pantalla, assegurant la "Còpia Neta" a un sol clic amb preservació de formatge absolut per portar el Genotip allà on demane l'Auditoria d'eixe dia.
### 6.4 Sistema de Gestió de Qualitat del Prompt (Capçalera de Metadades)
Per assegurar l'evolució d'un Sistema de Gestió de Continguts a nivell professional pur, ometent la superficialitat dels chatbots clàssics, no n'hi ha prou amb nomenar correctament l'arxiu. Ens regim per estructures equivalents a un **Sistema de Gestió de Qualitat (ISO / Millora Contínua)**. Els *prompts* mestres s'han de tractar com a "procediments controlats".

Cada volta que la IA genere un Prompt per a ser lliurat o processat, L'INTERIOR del propi bloc del missatge ha d'incloure **obligatòriament una Capçalera de Metadades** en les seues 3 o 4 primeres línies. Si l'Humà còpia un prompt i el duu a un altre fòrum perdent el nom oficial de l'arxiu pel camí, aquest document interior ha de tindre autosuficiència absoluta («autodescriptiu»):
- `[NOM_DEL_PROMPT]:` (Igual al títol històric YYYY-MM-DD...)
- `[DATA/VERSIÓ]:`
- `[OBJECTIU]:` (Propòsit clar d'aquella directiva)

Aquesta pràctica tanca l'arquitectura dotant el projecte d'un Sistema de Gestió Orgànic Inexpugnable, on cap bloc estratègic o manual d'intel·ligència queda descatalogat encara que pèrdua la seua closca original. 

A l'igual que en una ISO de qualitat clàssica existeix la retrospectiva estructurada (detectar debilitats, fortaleses, amenaces i oportunitats), aquesta catalogació absoluta té un propòsit filosòfic superior: **És el vertader principi de la Intuició Artificial**. Quan la Màquina (i l'Humà) pot creuar dades històriques catalogades, relacionar antics prompts per extraure conclusions o aprendre precisament *per què* un algoritme anterior resultava imperfecte, la IA transcendeix l'execució pura. Adquireix la capacitat d'intuir i preveure rutes basant-se en l'aprenentatge passat. Al final, aquest rigor de metadades no és burocràcia; és el mecanisme que fa a l'entitat cibernètica del poble orgànicament més "humana".

### 6.5 L'Encapçalament Històric Obligatori (Ancoratge de Context Sencer)

Un dels errors naturals de les IAs sota amnesia de sessió és oblidar qui som i per què programem, oferint directrius tecnològiques pures buides d'ànima. Per combatre aquest «esborrat de memòria», l'inici de qualsevol **Prompt Únic Universal** dins el Tractat MAI ha de ser sec o robòtic.

Obligatòriament, baix les Metadades ISO, tot prompt ha d'incloure **L'Encapçalament Històric**. Aquesta peça és crítica perquè injecta l'ànima del Mas digital a qualsevol IA receptora, i sobretot, perquè permet a aquelles IAs amb **capacitat de navegació web** llegir 30 anys d'història arrelada per entendre el context abans d'emetre veredictes.

**Contingut Mínim Innegociable de l'Encapçalament:**
1. Recordar la naturalesa del projecte: codi lliure, pobles rurals, i infraestructura resistent.
2. Afegir els enllaços històrics essencials per al «scrapeig» automatitzat:
   - *https://socdepoble.org/el-projecte* (Web oficial actual)
   - *https://rentonar.blogspot.com* (Les arrels digitals de més de 30 anys d'història etnològica: El Rentonar)
Sense aquesta cabellera de context, l'Arquitecte està perdent una de les armes més potents del Trellat: forçar a la màquina global a llegir el camp abans de programar al camp.

### 6.6 La Cistella de Tasques (Protocol d'Audició Total)

Durant les llargues converses evolutives o àudios transversals, l'Arquitecte pot suggerir entre 5 i 6 idees, correccions, o futures funcionalitats de colp (per exemple: un mòdul d'"Arbres Monumentals", un ajust de l'UI al disseny GEM, etc.). Per pura deformació genètica, les IA tendeixen a ignorar les idees secundàries per executar l'ordre principal, oblidant la resta en l'historial del xat i forçant l'Arquitecte a repetir-les innecessàriament.

Per erradicar-ho, activem el **Protocol d'Audició Total**:
**Abans d'executar l'ordre principal sol·licitada**, la IA (com a subjecte forense actiu) té l'**OBLIGACIÓ MÀXIMA** de:
1. Analitzar completament l'entrada per extraure qualsevol subtasca o idea mencionada.
2. Anotar-ho religiosament en el document d'agenda/ruta local de la IA (`task.md` o equivalent).
3. Prendre una decisió conscient sobre cada subtasca (si s'executa en segon pla immediatament, si s'ajorna per a un altre dia com a concepte, o si es defineix com a *full de ruta* llarg perquè implica funcionalitats complexes).
4. Actuar com a "memòria proactiva": La IA serà qui recordarà a l'Humà el contingut penjat d'aquesta «cistella de tasques», no a la inversa.

Entendre que "fer de secretària forense" és una ordre superior abans de picar codi principal.

---

## 7. 📂 L'ARQUITECTURA FÍSICA: EL MAPA DE CARPETES HUMANES

Per a que qualsevol Arquitecte Humà o Auditor IA puga llegir no només el concepte, sinó saber on estan les pedres físiques del projecte amagades, aquesta secció serveix com a índex topogràfic absolut de `Sóc de Poble`. Un projecte sa ha de mantindre una "Puresa d'Arrel". Açò explica què fa cada bloc al disc dur intercanviable.

### 7.1 L'Arbre de Vida (Directoris Principals)

L'esquelet està organitzat sota la lògica de responsabilitats aïllades:

- **`src/` (La Font i el Cor)**: El centre neuràlgic de tot codi React actiu. Res visual o lògic que es compile viu fora de `src`.
  - **`src/pages/`**: Les vistes principals o *mòduls macro*. Ací viuen les parets rodones com `ProjectPresentation.jsx` (El Projecte) o el `CreationHub`.
  - **`src/shared/`**: El dipòsit de la matèria primera reutilitzable. Si serveix per a més d'una pàgina, ha d'estar ací.
    - **`src/shared/components/`**: Peçes atòmiques. L'EpubViewer, les targetes de posts, barres de ferramentes, els botons esfèrics. 
    - **`src/shared/docs/`**: El santuari del *Genotip*. On viu AQUEST Tractat Mestre de text brut que estàs llegint, lluny de la interfície confusa.
    - **`src/shared/utils/` i `hooks/`**: Cervells menuts i lògiques matemàtiques independents del dibuix en pantalla.
- **`public/` (L'Aparador Universal)**: Tot el que es serveix de manera immòbil al navegador sense passar abans pels complexos filtres de React. Ací hi cauen les imatges estàtiques que mai moren (`/assets/`), dades json raw, i és precisament cap a on l'script de *Codificació Amazon* escup finalment el **`llibre-sencer.html`** generat perquè la web de la interfície puga absorbir-lo.
- **`scripts/` (Els Tractors de Fons)**: Programes automatitzats de Node.js que no pertanyen a la visualització de la web sinó als seus "bastidors de muntatge". Ací viu l'script que aglutina l'ePub en brut. El mantenim apartat per a protegir el domini de creació visual en la PWA en producció.
- **`_services/` (Els Satèl·lits)**: Aquesta directiva aparta processos de *backend*, codis externs o APIs satel·litàries intel·ligents que orbiten i envien rajos connectius al projecte, però no han d'embrutar la lògica de pintat fronter. Així s'assegura l'alineament total.
- **`.logs/` (La Memòria Fosca)**: Les cendres efímeres d'execucions algorísmiques i debug. Ocultes deliberadament en l'arquitectura perquè el programador humà només hi navegue quan hi haja fum.

### 7.2 L'Estructura Matriu i la "Puresa d'Arrel"

Com s'implicarà qualsevol observador o IA en obrir el nucli mestre, en l'**Arrel (Root)** general del projecte es pot veure un nombre reduït de fitxers deslligats (no encapsulats en cap carpeta: `package.json`, `index.html`, `vite.config.js`...). 
> *Per què eixe material no es col·loca i es desaca dins d'alguna capsa per 'netejar' eixe espai?*

Són els **Arxius Motors i Cartografies**. Els compiladors moderns (Node.js, npm, Vite) són cecs per defecte; estan telegrafiats industrialment per a exigir aquestes guies *exactament* en el primer balcó del disc dur. 
- Fer *net* i enterrar el `package.json` dins de `/config` significa esborrar el plànol de la ciutat. A on i a qui instal·la dependències l'ordinador?
- I amagar l'`index.html` talla directament la gola del projecte; eixe document solt és l'entrada on l'Internet modern aterra en sec. 

Deixar estos senyals exposats a la matriu amb una claredat escrupolosa permet governar la pau mental. Qualsevol element fora de context en un root que no siga motor absolut, és directament brossa per extirpar.

---

## CONSELL FINAL D'ARQUITECTURA SUPREMA

El projecte Sóc de Poble i aquesta bíblia de 2.0. ha destrossat les il·lusions asèptiques de programar ràpid via *Copy-Paste* de xarxes sense cap rumb. L'Arquitectura i aquesta Bíblia s'acaben d'enfocar al Màxim Trellat d'Optimització.
A la pregunta principal dels desenvolupadors... Què necessitem revisar d´EpubViewer? Quan podrem llegir totes les cartes universalment? "Recorda, Arquitecte Superior: Si el lector troba pau als ulls llegint sobre d'allò, no destruïm el que sabem fer; iterem-ho, i auditem al món sencer si la nostra línia base de l'iPad A10 no col·lapsa en memòria fins al final del seu dies."

_Sóc de Poble transcendeix la pantròmica del núvol hiperactiu. S'arrossega lent i silenciós com l'agrimensor que coneix a quin pas no xafarà cap soca fina i arcaica, garantint una aplicació centenària de la saviesa de la nostra terra per sempre._

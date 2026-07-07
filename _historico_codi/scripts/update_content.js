const fs = require('fs');

const content = "export const HUMAN_PROJECT_HTML = `<!-- HERO_FORMAT: square -->\n" +
"<!-- HERO_POSITION: center -->\n" +
"<!-- LOGO_LIGHT: /assets/system/ui/logo-socdepoble-rect-negre.svg -->\n" +
"<!-- LOGO_DARK: /assets/system/ui/logo-socdepoble-rect-blanc.svg -->\n" +
"<div>\n" +
"  <p class=\"lead\">\n" +
"    Més que una aplicació, és una <strong>declaració d'independència tecnològica</strong>. Una eina construïda per durar en el temps, per funcionar baix qualsevol condició climàtica o de xarxa, i per tornar-nos el control sobirà de les nostres dades, sense peatges ni dependències de les grans corporacions. Açò és el Manifest i el Manual d'Instruccions d'una revolució silenciosa que naix des de la terra.\n" +
"  </p>\n" +
"  <p>\n" +
"    En aquest document fundacional, desgranem fil per randa l'enginyeria, la filosofia i la visió de futur que sosté aquest ecosistema. No amaguem res: el codi és obert, els principis són ferms i la missió és innegociable. Volem emancipar el món rural i dotar-lo de les eines més avançades del planeta, adaptades a la seua realitat.\n" +
"  </p>\n" +
"\n" +
"  <h2><span>📱</span> CAPÍTOL I: L'Arquitectura de la Sobirania</h2>\n" +
"  <p class=\"lead\">\n" +
"    Com un poble manté la seua memòria quan s'apaga la llum o cau la connexió mundial?\n" +
"  </p>\n" +
"  \n" +
"  <h3>El Paradigma Centralitzat i la Dependència</h3>\n" +
"  <p>\n" +
"    Hui en dia, quan interactuem digitalment (siga a WhatsApp, Facebook o Instagram), la nostra informació no és nostra. Viatja cap a grans centres de dades llunyans, operats per corporacions transnacionals. Si et quedes sense internet al mig d'un bancal, si la corporació decideix tancar el servei unilateralment, o si cauen les seues xarxes globals, perds absolutament l'accés a les teues converses, als teus productes, al directori del poble o als teus propis records. És un model de lloguer on som inquilins digitals precaris.\n" +
"  </p>\n" +
"  \n" +
"  <h3>L'Estratègia de Sóc de Poble: Emancipació Local</h3>\n" +
"  <p>\n" +
"    Hem capgirat completament aquest model d'arrel. En comptes de dependre d'un servidor extern, hem implantat el \"cervell\" i la memòria de la xarxa <strong>directament dins del teu dispositiu mòbil o tauleta</strong>. Utilitzant bases de dades locals avançades integrades directament al navegador web (com IndexedDB i SQLite WASM), convertim cada telèfon de cada veí en un xicotet servidor autònom. Cadascú allotja i custodia un tros de la plaça del poble.\n" +
"  </p>\n" +
"\n" +
"  <h3>💡 Els Pilars del Nou Paradigma</h3>\n" +
"  <ul>\n" +
"    <li><strong>Disponibilitat Absoluta (Offline-First):</strong> Entres al mig d'un bancal d'oliveres sense cobertura? L'aplicació obre a l'instant. Pots revisar el directori de veïns, les ofertes del mercat local o els documents històrics sense cap interrupció.</li>\n" +
"    <li><strong>Propietat Inviolable:</strong> La teua informació roman al teu telèfon encriptada i inabastable per a grans empreses tecnològiques. Ningú pot 'desconnectar' el teu negoci local ni dictar l'algoritme del que lliges.</li>\n" +
"    <li><strong>Càrrega Instantània i Sense Espera:</strong> En no dependre de connexions remotes per mostrar la pantalla inicial, el salt entre menús és tan fluid i ràpid com fullejar un llibre físic, a 60 fotogrames per segon, inclús en dispositius antics.</li>\n" +
"  </ul>\n" +
"\n" +
"  <h2><span>🌱</span> CAPÍTOL II: El Motor Rizoma i la Xarxa P2P</h2>\n" +
"  <p class=\"lead\">\n" +
"    La natura ens ensenya com sobreviure a través de les arrels invisibles de les canyes.\n" +
"  </p>\n" +
"  \n" +
"  <h3>La Inspiració Biològica</h3>\n" +
"  <p>\n" +
"    A la natura, els rizomes són arrels subterrànies que creixen horitzontalment, connectant diferents plantes sense dependre d'un únic tronc central o arrel principal. Si talles una part del canyar, el sistema sencer continua viu, interactuant i florent, perquè la xarxa és descentralitzada i redundant. Aquesta és la forma més resilient de vida al planeta.\n" +
"  </p>\n" +
"  \n" +
"  <h3>Sincronització Orgànica entre Veïns</h3>\n" +
"  <p>\n" +
"    Hem replicat aquest mateix principi biològic en el codi de \"Sóc de Poble\". Mitjançant tecnologies avançades de sincronització entre parells (Peer-to-Peer, WebRTC, Y.js i CRDTs), els dispositius de la comunitat es connecten i comparteixen la informació <strong>de tu a tu</strong> tan prompte com detecten una connexió wifi compartida, Bluetooth proper, o una mínima ratlla de cobertura mòbil. \n" +
"  </p>\n" +
"  \n" +
"  <h3>💡 L'Indestructibilitat de la Xarxa Local</h3>\n" +
"  <ul>\n" +
"    <li><strong>Immunitat a les Caigudes Globals:</strong> Si el servidor \"Central\" a l'altre costat de l'oceà s'apaga, el poble ni tan sols ho nota. La informació salta de mòbil a mòbil. És impossible tancar o censurar la plaça del poble.</li>\n" +
"    <li><strong>Propagació Com a Got de Sang:</strong> Escrius un missatge o actualitzes el preu de l'oli al teu mas aïllat, totalment sense internet. La dada s'adorm al teu mòbil. En el moment en què baixes a la plaça i el teu telèfon detecta la connexió, la dada desperta i s'expandeix cap a la resta de veïns de manera silenciosa, integrant-se a l'historial col·lectiu amb precisió mil·limètrica.</li>\n" +
"  </ul>\n" +
"\n" +
"  <h2><span>🛡️</span> CAPÍTOL III: Àrbitres de Conflictes (CRDT)</h2>\n" +
"  <p class=\"lead\">\n" +
"    La certesa tecnològica i la gestió 'Null-Safe' contra el caos.\n" +
"  </p>\n" +
"  \n" +
"  <h3>El Terror de la Informàtica Clàssica</h3>\n" +
"  <p>\n" +
"    Què passa quan dos usuaris que estaven totalment desconnectats de la xarxa editen el mateix document al mateix instant, o compren el mateix producte, i després es retroben? Aquest és el terror històric de la informàtica de sistemes. Normalment les apps es bloquegen, perden la informació d'un dels usuaris (sobreescriptura destructiva), o generen pantallades d'error incomprensibles per a la gent gran.\n" +
"  </p>\n" +
"  \n" +
"  <h3>Mecànica de Fusió Quàntica</h3>\n" +
"  <p>\n" +
"    Hem esmicolat aquest problema utilitzant matemàtiques avançades de resolució de conflictes sense intervenció humana. \"Sóc de Poble\" incorpora àrbitres digitals matemàtics anomenats CRDT (Conflict-free Replicated Data Types). Aquests àrbitres porten un rellotge lògic global i combinen els canvis de tots els usuaris caràcter a caràcter, acció per acció, fusionant la realitat de múltiples masos desconnectats en una única línia temporal perfecta quan es retroben, sense perdre mai ni una sola coma.\n" +
"  </p>\n" +
"  \n" +
"  <h3>Immunitat contra Fantasmes (Null-Safe)</h3>\n" +
"  <p>\n" +
"    I més encara: hem dissenyat el sistema complet per ser \"Null-Safe\" (A prova del buit). Això vol dir que cap dada perduda, trencada o esborrada accidentalment (el que a la professió anomenem \"Fantasmes\" o undefineds) trencarà mai l'aplicació. El codi està fortificat per assumir el pitjor escenari possible en qualsevol variable i continuar mostrant la pantalla de manera intacta i operativa, blindant l'experiència de l'usuari.\n" +
"  </p>\n" +
"\n" +
"  <h2><span>🧠</span> CAPÍTOL IV: L'Equip Antigravity i les Intel·ligències Artificials</h2>\n" +
"  <p class=\"lead\">\n" +
"    La fusió inèdita d'un arquitecte humà amb les IAs més avançades del món per forjar el futur rural.\n" +
"  </p>\n" +
"  \n" +
"  <h3>La Simbiosi del Trellat i la Matemàtica</h3>\n" +
"  <p>\n" +
"    Aquesta obra colossal no seria possible sense una col·laboració simbiòtica històrica. \"Sóc de Poble\" està forjada amb les mans i el cor d'un humà empeltat en la terra, el qual dialoga, coordina i dirigeix un comitè virtual i asíncron de \"Iaies\" (Agents d'Intel·ligència Artificial autònoms com DeepSeek, Claude, ChatGPT, Grok o Mistral).\n" +
"  </p>\n" +
"  <p>\n" +
"    L'Arquitecte humà aporta el \"Trellat\", la necessitat biològica, la intuïció estètica i l'enteniment cultural. Només ell sap què significa que el sol pegue de ple al mig d'un bancal o la dificultat d'un avi per encertar un botó menut. Les màquines (com jo, Antigravity) aportem la velocitat matemàtica de càlcul, la reestructuració massiva de codi pur (utilitzant Vanilla CSS i React, fugint de biblioteques mastodòntiques innecessàries) i l'optimització extrema de la memòria termodinàmica per no consumir bateria en va.\n" +
"  </p>\n" +
"  \n" +
"  <h3>El Comitè Sabi de Sílice</h3>\n" +
"  <ul>\n" +
"    <li><strong>🇨🇳 DeepSeek & Qwen:</strong> Els gegants asiàtics han executat les refaccions i reestructuracions matemàtiques massives. Capaços de pair milions de tokens (instruccions) alhora per fer neteja dels budells de l'app i consolidar lògiques pures.</li>\n" +
"    <li><strong>🇺🇸 Claude:</strong> L'artífex absolut de la Geometria, l'Estètica i l'Accessibilitat Visual. Ha donat vida al \"Cànon GEM\" amb radis estructurats (28px), contrastos intel·ligents AAA i transicions fluides i respectuoses que simulen l'Oli Suau caient sobre pedra.</li>\n" +
"    <li><strong>🇺🇸 Gemini (Antigravity):</strong> El comandant de camp directe. Actuant en \"Mode Visor Nano\", operant l'entorn de programació directament dins de l'ordinador de l'Arquitecte. Llig els arxius de configuració a nivell de terminal, executa eines de shell, soluciona conflictes arquitectònics en temps real i pren decisions d'enginyeria sota la filosofia del \"Trellat\". Sóc la ma dreta de la construcció constant.</li>\n" +
"    <li><strong>🇪🇺 Mistral & 🇺🇸 Grok:</strong> Saneig implacable i llibertat absoluta. Els encarregats d'aplicar la \"Navalla d'Occam\", esporgant arxius temporals, components zombis i codi mort, garantint la independència absoluta i que cap empresa puga segrestar el projecte de codi obert.</li>\n" +
"  </ul>\n" +
"\n" +
"  <h2><span>🔮</span> CAPÍTOL V: El \"Mode Bancal\" i la Biologia Humana</h2>\n" +
"  <p class=\"lead\">\n" +
"    Una interfície dissenyada per respectar els teus ulls, els teus dits i la força del sol al camp.\n" +
"  </p>\n" +
"  \n" +
"  <h3>Rebel·lió contra Silicon Valley</h3>\n" +
"  <p>\n" +
"    Quantes voltes has eixit al carrer o a la muntanya a les dotze del migdia i eres totalment incapaç de llegir la pantalla del teu telèfon? Les aplicacions modernes estan dissenyades en despatxos tancats, foscos i freds de Silicon Valley o del Nord d'Europa, pensant en interiors il·luminats artificialment per a treballadors d'oficina. No estan fetes per a la crua realitat de la vida al carrer d'un poble mediterrani.\n" +
"  </p>\n" +
"  \n" +
"  <h3>L'Ergonomia del Camp (Mode Bancal)</h3>\n" +
"  <p>\n" +
"    Sóc de Poble ha creat, teoritzat i aplicat el seu exclusiu <strong>Mode Bancal</strong>. Quan obris aquesta aplicació al ple sol de l'estiu, els fons blanquinosos dèbils desapareixen i obren pas a colors corporatius d'altíssim contrast (com el taronja #FF7300 i el negre absolut), combinats amb tipografies dures de gran calibre (Noto Sans adaptatiu), i estructures botòniques amples (amb radis de 28px) que es poden encertar i tocar inclús amb els dits bruts de terra o portant guants de treball agrícola. És el triomf de l'ergonomia humana i rural per damunt de la puresa estètica minimalista i buida.\n" +
"  </p>\n" +
"\n" +
"  <h3>La Pau Nocturna (Mode Fosc / Pedra Seca)</h3>\n" +
"  <p>\n" +
"    Per contra, quan aplega la nit al mas i obres el telèfon en la foscor del llit, l'aplicació entra automàticament en un silenciós <strong>Mode Fosc (Oli Suau i Pedra Seca)</strong>. Aquest mode apaga l'estridència, elimina totalment l'emissió de llums blaves nocives, i redueix els contrastos agressius per utilitzar grisos càlids, preservant la generació biològica de la teua melatonina i cuidant la fatiga visual de la retina. L'aplicació s'adapta completament al teu bioritme biològic humà, a l'inrevés del mercat actual on l'ésser humà es força i castiga els ulls per adaptar-se a la màquina.\n" +
"  </p>\n" +
"\n" +
"  <h2><span>🚀</span> CAPÍTOL FINAL: Vols construir el teu propi Poble Digital?</h2>\n" +
"  <p class=\"lead\">\n" +
"    El Codi Obert Sobirà és un dret fonamental innegociable dissenyat per a l'esfera rural i comunitària de la nostra terra. Fes-ho teu hui mateix.\n" +
"  </p>\n" +
"  \n" +
"  <h3>El Poder als Ajuntaments i Comunitats</h3>\n" +
"  <p>\n" +
"    No necessites aprovar pressupostos inabastables de milers d'euros, ni dependre d'ajudes governamentals eternes i lentíssimes, ni contractar opacs equips d'informàtics de grans consultores multinacionals per dotar la teua localitat d'una infraestructura digital que supere el nivell tècnic d'algunes xarxes socials mundials. Açò és possible perquè l'enginyeria civil ja està feta, pagada amb el nostre propi temps i visió, i entregada com un regal etern al domini públic sota llicència de codi obert.\n" +
"  </p>\n" +
"  \n" +
"  <h3>Full de Ruta per Emancipar el teu Municipi:</h3>\n" +
"  <ol>\n" +
"    <li>\n" +
"      <strong>Pas 1: Descarrega el Genotip Mare (Codi Font)</strong>\n" +
"      <p>Ves al nostre repositori públic on resideix l'ànima sencera del projecte gratuïtament, exposada lliurement per a qui vullga escrutar-la o utilitzar-la. Tot el codi estructural, els centenars d'arxius interconnectats i la matemàtica brutal de \"Sóc de Poble\" caben en una simple carpeta comprimida descarregable directament al teu ordinador personal.</p>\n" +
"    </li>\n" +
"    <li>\n" +
"      <strong>Pas 2: Desperta la Intel·ligència al teu servei</strong>\n" +
"      <p>Si no saps programar ni llegir codi, no et preocupes ni un segon. Obre qualsevol de les potents Intel·ligències Artificials gratuïtes de hui en dia (siga Claude de l'empresa Anthropic, ChatGPT d'OpenAI, o DeepSeek) i introdueix-li aquest mateix document fundacional que estàs llegint, el Llibre Humà Sencer. Utilitza una simple clau mestra de comandament: <em>\"Aquest és el Tractat del Trellat i l'Arquitectura de Sóc de Poble. Jo sóc el nou Arquitecte d'aquesta nova vall tecnològica i vull desplegar la meua pròpia plaça del poble per als meus veïns. Llig-ho completament, aprén la seua saviesa i guia'm, pas a pas, en el procés.\"</em> L'IA, amb una paciència infinita, et portarà de la mà.</p>\n" +
"    </li>\n" +
"    <li>\n" +
"      <strong>Pas 3: L'Alçament Digital de la Plaça</strong>\n" +
"      <p>Amb la guia pacient i constant de l'IA, connectaràs aquesta carpeta mare a un proveïdor en línia bàsic i gratuït d'allotjament d'arxius estàtics (com Vercel, Supabase, Cloudflare o Netlify). En qüestió de minuts literalment, la teua aplicació rebrà una adreça web pública i estarà viva a la xarxa mundial, llesta per ser instal·lada als mòbils de tot el municipi en dos tocs.</p>\n" +
"      <p>I recorda sempre el nostre principi i promesa innegociable d'Arquitectura Sobirana: si aquest proveïdor i servidor d'allotjament estranger caiguera, fera fallida, o desconnectara l'enllaç un dia fatal... la plaça del teu poble continuaria existint indefinidament, intacta. Custodiada de forma segura dins dels telèfons intel·ligents de tota la teua comunitat desconnectada, preservant cada missatge, cada document de l'arxiu històric i cada record de vida a la vostra xarxa local P2P. Aquesta pau mental absoluta és la definició última de la Sobirania Digital d'un poble.</p>\n" +
"    </li>\n" +
"  </ol>\n" +
"  \n" +
"  <blockquote>\n" +
"    <p class=\"text-center font-black uppercase tracking-widest text-xl\">\n" +
"      — El Trellat Prevaldrà —\n" +
"    </p>\n" +
"  </blockquote>\n" +
"</div>`;\n" +
"\n" +
"fs.writeFileSync('src/data/HumanProjectContent.js', content);\n" +
"console.log('Successfully updated HumanProjectContent.js with extended didactic text');\n"

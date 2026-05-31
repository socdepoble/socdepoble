export const HUMAN_PROJECT_HTML = `<!-- HERO_FORMAT: square -->
<!-- HERO_POSITION: center -->
<!-- HERO_IMAGE: /assets/uploads/empresa/soc-de-poble/posts/el-projecte/exemple-de-poble-001.png -->
<!-- LOGO_LIGHT: /assets/system/ui/logo-socdepoble-rect-negre.svg -->
<!-- LOGO_DARK: /assets/system/ui/logo-socdepoble-rect-blanc.svg -->
<div class="human-presentation w-full text-lg leading-relaxed text-stone-800 dark:text-stone-300">
  <div class="mb-10 text-center">
    <p class="text-xl md:text-2xl text-stone-600 dark:text-stone-400 font-light max-w-3xl mx-auto mt-6">
      Més que una aplicació, és una <strong class="font-bold text-stone-900 dark:text-white">declaració d'independència tecnològica</strong>. Una eina construïda per durar en el temps, per funcionar baix qualsevol condició climàtica o de xarxa, i per tornar-nos el control sobirà de les nostres dades, sense peatges ni dependències de les grans corporacions.
    </p>
  </div>

  <div class="max-w-4xl mx-auto space-y-16">
    
    <!-- CAPÍTOL 1 -->
    <div class="mb-12">
      <h2 class="text-2xl md:text-4xl font-black text-orange-600 dark:text-orange-500 mb-6 flex items-center gap-4">
        <span class="text-4xl">📱</span> CAPÍTOL I: L'Arquitectura de la Sobirania
      </h2>
      <p class="mb-4 text-xl font-medium text-stone-700 dark:text-stone-200">
        Com un poble manté la seua memòria quan s'apaga la llum?
      </p>
      <p class="mb-4">
        <strong>El Paradigma Centralitzat:</strong> Hui en dia, quan interactuem digitalment (siga a WhatsApp, Facebook o Instagram), la nostra informació no és nostra. Viatja cap a grans centres de dades llunyans (servidors). Si et quedes sense internet, si la corporació decideix tancar el servei, o si cauen les seues xarxes, perds absolutament l'accés a les teues converses, productes o contactes.
      </p>
      <p class="mb-6">
        <strong>L'Estratègia de Sóc de Poble:</strong> Hem capgirat completament aquest model. Hem implantat el "cervell" i la memòria de la xarxa <strong>directament dins del teu dispositiu mòbil o tauleta</strong>. Utilitzant bases de dades locals avançades (SQLite WASM i IndexedDB), convertim cada telèfon en un xicotet servidor autònom capaç d'allotjar un tros de la comunitat.
      </p>
      
      <div class="p-6 bg-orange-50/50 dark:bg-orange-900/10 rounded-2xl border border-orange-200 dark:border-orange-800/30">
        <h3 class="font-bold text-orange-800 dark:text-orange-400 mb-4 text-xl">💡 Els Pilars del Nou Paradigma</h3>
        <ul class="list-disc pl-5 space-y-3 text-stone-700 dark:text-stone-300">
          <li><strong>Disponibilitat Absoluta (Offline-First):</strong> Entres al mig d'un bancal d'oliveres sense cobertura? L'aplicació obre a l'instant. Pots revisar el directori de veïns, les ofertes del mercat local o els documents històrics sense cap interrupció.</li>
          <li><strong>Propietat Inviolable:</strong> La teua informació roman al teu telèfon encriptada i inabastable per a grans empreses tecnològiques. Ningú pot 'desconnectar' el teu negoci.</li>
          <li><strong>Càrrega Instantània:</strong> En no dependre de connexions remotes, el salt entre pantalles és tan fluid i ràpid com fullejar un llibre físic.</li>
        </ul>
      </div>
    </div>

    <!-- CAPÍTOL 2 -->
    <div class="mb-12">
      <h2 class="text-2xl md:text-4xl font-black text-emerald-600 dark:text-emerald-500 mb-6 flex items-center gap-4">
        <span class="text-4xl">🌱</span> CAPÍTOL II: El Motor Rizoma (P2P)
      </h2>
      <p class="mb-4 text-xl font-medium text-stone-700 dark:text-stone-200">
        La natura ens ensenya com sobreviure a través de les arrels de les canyes.
      </p>
      <p class="mb-4">
        A la natura, els rizomes són arrels subterrànies que creixen horitzontalment, connectant diferents plantes sense dependre d'un únic tronc central. Si talles una part, el sistema sencer continua viu i florent.
      </p>
      <p class="mb-6">
        Hem replicat aquest principi en el codi de "Sóc de Poble". Mitjançant tecnologies de sincronització entre parells (Y.js i CRDTs), els dispositius de la comunitat es connecten i comparteixen la informació <strong>de tu a tu</strong> tan prompte com detecten una connexió wifi o Bluetooth propera, o una mínima ratlla de cobertura mòbil.
      </p>
      
      <div class="p-6 bg-emerald-50/50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-200 dark:border-emerald-800/30">
        <h3 class="font-bold text-emerald-800 dark:text-emerald-400 mb-4 text-xl">💡 L'Indestructibilitat de la Xarxa</h3>
        <ul class="list-disc pl-5 space-y-3 text-stone-700 dark:text-stone-300">
          <li><strong>Immunitat a les Caigudes:</strong> Si el servidor "Central" s'apaga, el poble no ho nota. La informació salta de mòbil a mòbil. És impossible tancar la plaça del poble.</li>
          <li><strong>Sincronització Orgànica:</strong> Escrius un missatge o actualitzes el preu de l'oli al teu mas sense internet. En el moment en què baixes a la plaça i el teu telèfon detecta la connexió, la dada s'expandeix cap a la resta de veïns de manera silenciosa i eficient.</li>
        </ul>
      </div>
    </div>

    <!-- CAPÍTOL 3 -->
    <div class="mb-12">
      <h2 class="text-2xl md:text-4xl font-black text-blue-600 dark:text-blue-500 mb-6 flex items-center gap-4">
        <span class="text-4xl">🛡️</span> CAPÍTOL III: Àrbitres de Conflictes
      </h2>
      <p class="mb-4 text-xl font-medium text-stone-700 dark:text-stone-200">
        La certesa tecnològica i la gestió 'Null-Safe'
      </p>
      <p class="mb-4">
        Què passa quan dos usuaris que estaven desconnectats de la xarxa editen el mateix document al mateix instant, i després es retroben? Aquest és el terror històric de la informàtica. Normalment les apps es bloquegen, perden la informació d'un dels usuaris, o generen errors incomprensibles.
      </p>
      <p class="mb-6">
        Hem esmicolat aquest problema. "Sóc de Poble" incorpora àrbitres digitals matemàtics (CRDT) que combinen els canvis caràcter a caràcter. I més encara: hem dissenyat el sistema per ser "Null-Safe". Això vol dir que cap dada buida o esborrada accidentalment (el que anomenem "Fantasmes") trencarà mai l'aplicació. El codi està preparat per assumir el pitjor escenari possible i continuar mostrant la pantalla de manera intacta.
      </p>
    </div>
    
    <!-- CAPÍTOL 4 -->
    <div class="mb-12">
      <h2 class="text-2xl md:text-4xl font-black text-amber-600 dark:text-amber-500 mb-6 flex items-center gap-4">
        <span class="text-4xl">🧠</span> CAPÍTOL IV: L'Equip Antigravity i les IAs
      </h2>
      <p class="mb-4 text-xl font-medium text-stone-700 dark:text-stone-200">
        La fusió d'un arquitecte humà amb les Intel·ligències Artificials més avançades del món.
      </p>
      <p class="mb-4">
        Aquesta obra no seria possible sense una col·laboració simbiòtica històrica. "Sóc de Poble" està forjada amb les mans i el cor d'un humà empeltat en la terra, el qual dialoga i dirigeix un comitè virtual de "Iaies" (Agents d'Intel·ligència Artificial com DeepSeek, Claude, ChatGPT, Grok o Mistral).
      </p>
      <p class="mb-6">
        L'Arquitecte aporta el "Trellat", la necessitat biològica i l'enteniment cultural. Ell sap què significa que el sol pegue de ple al mig d'un bancal. Les màquines aporten la velocitat matemàtica, la reestructuració de codi pur (Vanilla JS, sense biblioteques mastodòntiques innecessàries) i l'optimització extrema de la memòria per no consumir recursos en va.
      </p>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
        <div class="p-5 bg-stone-50 dark:bg-stone-800/30 border border-stone-200 dark:border-stone-700 rounded-xl shadow-sm">
          <strong class="text-stone-900 dark:text-white block font-black text-lg tracking-wide mb-2">🇨🇳 DeepSeek & Qwen</strong>
          <span class="text-sm text-stone-600 dark:text-stone-400">Els gegants asiàtics han executat les refaccions i reestructuracions matemàtiques massives. Capaços de pair milions de tokens (instruccions) alhora per fer neteja dels budells de l'app.</span>
        </div>
        <div class="p-5 bg-stone-50 dark:bg-stone-800/30 border border-stone-200 dark:border-stone-700 rounded-xl shadow-sm">
           <strong class="text-stone-900 dark:text-white block font-black text-lg tracking-wide mb-2">🇺🇸 Claude</strong>
           <span class="text-sm text-stone-600 dark:text-stone-400">L'artífex absolut de la Geometria i l'Estètica. Ha donat vida al "Mode Bancal" amb radis estructurats (28px), contrastos intel·ligents i transicions fluides i respectuoses.</span>
        </div>
        <div class="p-5 bg-stone-50 dark:bg-stone-800/30 border border-stone-200 dark:border-stone-700 rounded-xl shadow-sm">
           <strong class="text-stone-900 dark:text-white block font-black text-lg tracking-wide mb-2">🇺🇸 Gemini (Antigravity)</strong>
           <span class="text-sm text-stone-600 dark:text-stone-400">El comandant directe. Actuant en "Mode Visor Nano", operant l'entorn de programació directament i llegint els arxius de configuració a nivell de terminal per fer canvis estructurals precisos i delicats.</span>
        </div>
        <div class="p-5 bg-stone-50 dark:bg-stone-800/30 border border-stone-200 dark:border-stone-700 rounded-xl shadow-sm">
           <strong class="text-stone-900 dark:text-white block font-black text-lg tracking-wide mb-2">🇪🇺 Mistral & 🇺🇸 Grok</strong>
           <span class="text-sm text-stone-600 dark:text-stone-400">Saneig implacable i aïllament europeu. Els encarregats d'aplicar la "Navalla d'Occam", esporgant arxius i codi morts, garantint que cap empresa puga segrestar el projecte de codi obert.</span>
        </div>
      </div>
    </div>
    
    <!-- CAPÍTOL 5 -->
    <div class="mb-12">
      <h2 class="text-2xl md:text-4xl font-black text-purple-600 dark:text-purple-500 mb-6 flex items-center gap-4">
        <span class="text-4xl">🔮</span> CAPÍTOL V: El "Mode Bancal" i la Biologia Humana
      </h2>
      <p class="mb-4 text-xl font-medium text-stone-700 dark:text-stone-200">
        Una interfície que respecta els teus ulls i la força del sol al camp.
      </p>
      <p class="mb-4">
        Quantes voltes has eixit al carrer a les 12 del migdia i no podies llegir la pantalla del teu mòbil? Les aplicacions estan dissenyades en despatxos tancats i freds de Silicon Valley, pensant en interiors il·luminats artificialment.
      </p>
      <p class="mb-6">
        Sóc de Poble ha creat el seu exclusiu <strong>Mode Bancal</strong>. Quan actives aquesta aplicació al sol, els fons blanquinosos desapareixen i obrin pas a taronges d'altíssim contrast, a lletres negres i dures, i estructures amples que es poden tocar amb els dits bruts de terra. És el triomf de l'ergonomia humana. Per contra, quan aplega la nit al mas, l'aplicació entra en un silenciós <strong>Mode Fosc (Oli Suau i Pedra Seca)</strong>, eliminant totalment l'emissió de llums blaves nocives, preservant la melatonina i cuidant la fatiga visual. L'aplicació s'adapta al teu bioritme, no a l'inrevés.
      </p>
    </div>

    <!-- CAPÍTOL FINAL -->
    <div class="mb-12 border-t-4 border-stone-200 dark:border-stone-800 pt-10 pb-6">
      <h2 class="text-3xl md:text-5xl font-black text-stone-900 dark:text-white mb-6 text-center uppercase tracking-tighter">
        <span class="text-5xl block mb-4">🚀</span> Vols construir el teu propi Poble Digital?
      </h2>
      <p class="mb-8 text-center text-lg text-stone-600 dark:text-stone-400 max-w-3xl mx-auto font-light leading-relaxed">
        No necessites pressupostos inabastables ni equips d'informàtics multinacionals per dotar la teua localitat d'una infraestructura digital del més alt nivell mundial. Açò és un projecte de <strong>Codi Obert Sobirà</strong>. Aquesta eina és un dret fonamental dissenyat per a l'esfera rural i comunitària de la nostra terra.
      </p>
      
      <div class="bg-stone-50 dark:bg-stone-950 p-8 rounded-3xl border border-stone-200 dark:border-stone-800 text-stone-800 dark:text-stone-300 shadow-sm relative overflow-hidden">
        <div class="absolute -right-6 -top-6 text-9xl opacity-5 dark:opacity-10 pointer-events-none">📖</div>
        
        <h3 class="font-black uppercase tracking-widest text-lg mb-6 border-b-2 border-stone-200 dark:border-stone-800 pb-4 text-stone-900 dark:text-white">Full de Ruta per Emancipar el teu Municipi:</h3>
        
        <ol class="list-decimal pl-6 space-y-6 font-medium text-lg">
          <li class="pl-2">
            <strong class="text-orange-600 dark:text-orange-500 text-xl block mb-1">Pas 1: Descarrega el Genotip Mare</strong>
            <span class="block text-stone-600 dark:text-stone-400 font-normal">Ves al nostre repositori públic (Github) on resideix l'ànima sencera del projecte gratuïtament. Tot el codi estructural the "Sóc de Poble" cap en una simple carpeta al teu ordinador.</span>
          </li>
          <li class="pl-2">
            <strong class="text-emerald-600 dark:text-emerald-500 text-xl block mb-1">Pas 2: Desperta la Intel·ligència</strong>
            <span class="block text-stone-600 dark:text-stone-400 font-normal">Obre qualsevol de les Intel·ligències Artificials gratuïtes de hui en dia (Claude, ChatGPT, o DeepSeek) i introdueix-li aquest document, el Llibre Humà Sencer. Utilitza la clau mestra: <em>"Aquest és el Tractat del Trellat de Sóc de Poble. Jo sóc el nou Arquitecte d'aquesta vall i vull desplegar la meua pròpia plaça. Llig-ho i guia'm, pas a pas."</em></span>
          </li>
          <li class="pl-2">
            <strong class="text-blue-600 dark:text-blue-500 text-xl block mb-1">Pas 3: L'Alçament Digital</strong>
            <span class="block text-stone-600 dark:text-stone-400 font-normal">Amb l'ajuda de la IA, connecta aquesta carpeta a un proveïdor en línia bàsic (com Vercel, Supabase o Netlify). En qüestió de minuts, la teua aplicació estarà viva a la xarxa mundial. I recorda el principi innegociable: si aquest servidor caiguera un dia, la plaça del teu poble continuaria existint indefinidament, custodiada de forma segura dins dels mòbils de tota la teua comunitat, preservant cada missatge, cada document i cada record en la vostra xarxa local P2P. Aquesta és la definició última de la Sobirania Digital.</span>
          </li>
        </ol>
      </div>
      
      <div class="text-center mt-12 mb-6">
        <p class="font-mono text-sm text-stone-500 uppercase tracking-widest font-black border-t border-stone-200 dark:border-stone-800 pt-8 max-w-xs mx-auto">— El Trellat Prevaldrà —</p>
      </div>
    </div>

  </div>
</div>
`;

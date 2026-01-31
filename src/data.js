export const MOCK_CHATS = [
    { id: 1, name: "Ajuntament de Cocentaina", message: "Bon dia! Recordeu que hui hi ha mercat al Pla", time: "10:30", type: "gov", unread: 2, avatar_url: "🏛️" },
    { id: 2, name: "Forn de Muro", message: "Ja tenim les coques de xulla calentes!", time: "09:15", type: "shop", unread: 0, avatar_url: "🥖" },
    { id: 3, name: "Centre Excursionista d'Alcoi", message: "Què vos pareix pujar al Montcabrer el diumenge?", time: "Ahir", type: "group", unread: 5, avatar_url: "🏔️" },
    { id: 4, name: "Cooperativa de Muro", message: "Iniciem la recollida de l'oliva demà", time: "Ahir", type: "coop", unread: 0, avatar_url: "🫒" },
    { id: 5, name: "Vicent (Fuster del Barri)", message: "Et passe ara mateix la foto del moble", time: "Dimarts", type: "shop", unread: 0, avatar_url: "🪵" },
    {
        id: 'rentonar',
        name: "Associació Cultural El Rentonar",
        message: "Junta Directiva: Revisió de comptes trimestrals aprovada. ✅",
        time: "Ara",
        type: "group",
        unread: 1,
        avatar_url: "/images/demo/rentonar_logo.png",
        verified: true,
        cif: "G-54321987",
        user_role: "Tresorer i Membre Fundador"
    },
    {
        id: 'grup-treball',
        name: "Grup de Coordinació [BETA]",
        message: "IAIA MarIA: Bona nit i salut a tota la bona gent! 👵✨",
        time: "Ara",
        type: "group",
        unread: 3,
        avatar_url: "/assets/avatars/iaia_official.png",
        verified: true,
        user_role: "Grup de Treball i Utilitat Social"
    },
];

export const MOCK_MESSAGES = {
    1: [
        { id: 1, text: "Bon dia a tots els socarrats i socarrades!", sender: "other", time: "09:00" },
        { id: 2, text: "Recordeu que hui es dia de mercat al Pla i hi ha talls de trànsit.", sender: "other", time: "10:30" },
        { id: 3, text: "Teniu tota la informació a la web municipal.", sender: "other", time: "10:31" },
    ],
    2: [
        { id: 1, text: "Hola! Teniu coques de xulla hui?", sender: "me", time: "08:15" },
        { id: 2, text: "I tant! Acaben d'eixir del forn ara mateix. Vine abans que s'acaben!", sender: "other", time: "09:15" },
    ],
    3: [
        { id: 1, text: "Alguna proposta per al cap de setmana?", sender: "me", time: "Ahir" },
        { id: 2, text: "Què vos pareix una pujada al Montcabrer el diumenge pel matí?", sender: "other", time: "18:20" },
    ],
    4: [
        { id: 1, text: "La setmana que ve ja podem portar les olives?", sender: "me", time: "Dilluns" },
        { id: 2, text: "Sí! Iniciem la recollida oficial demà a les 8h del matí.", sender: "other", time: "Ahir" },
    ],
    5: [
        { id: 1, text: "Hola Vicent, com va el moble del menjador?", sender: "me", time: "Dilluns" },
        { id: 2, text: "Molt bé! Et passe ara mateix la foto de com està quedant.", sender: "other", time: "Dimarts" },
    ],
    'rentonar': [
        { id: 1, text: "Bon dia Javi! Com a tresorer, necessitem que signes l'acta de l'última reunió.", sender: "other", time: "09:00" },
        { id: 2, text: "Ah, i recorda que tenim el CIF G-54321987 verificat al sistema. Tot en ordre amb Hisenda.", sender: "other", time: "09:05" },
        { id: 3, text: "Perfecte, ho signe ara mateix. Com a membre fundador és un orgull veure com creixem! 🏛️", sender: "me", time: "09:10" },
    ],
    'grup-treball': [
        { id: 1, text: "Bona nit família! Estic molt emocionat de veure com bateguem junts en esta versió vitaminada. 🚀", sender_name: "Javi", sender: "other", time: "21:00" },
        { id: 2, text: "L'IAIA MarIA ja forma part del grup. És un somni fet realitat! 😍", sender_name: "Damià", sender: "other", time: "21:05" },
        { id: 3, text: "Bona nit i salut a tota la bona gent del Grup de Treball! Ací em teniu per a posar trellat i utilitat social a cada píxel que bateguem. Anem a fer coses grans! 👵✨⚖️", sender_name: "IAIA MarIA", sender: "other", time: "Ara", is_ai: true },
    ]
};

export const MOCK_FEED = [
    // 📚 Sóc de Poble: El Llibre (Projecte Lliure) - NUEVA PUBLICACIÓN JAVI LLINARES
    {
        id: 'llibre-soc-de-poble-oficial',
        town_id: 1,
        author: "Javi Llinares (Project Lead & Designer)",
        author_avatar: "/assets/master/javi_avatar_cinematic.png",
        author_role: "official",
        author_entity_id: 'javi-sa-1',
        time: "Ara",
        content: "# 📚 Sóc de Poble: El Llibre (Projecte Lliure)\n\n## Per Javi Llinares\n\nAvui faig oficial un dels somnis d'aquest projecte: **el llibre de Sóc de Poble**. Més de 200 pàgines que documenten aquest viatge des de les arrels fins a l'arquitectura més avançada.\n\nNo és només un manual, és una declaració de principis sobre com la tecnologia (IA, CRDTs, Xarxa Arrel) ha d'estar al servei de la comunitat rural. Un projecte que neix lliure, sota llicència **Creative Commons**, perquè el coneixement bategui sense barreres.\n\n**Explora la infografia per a descobrir l'estructura d'aquesta Masia Tècnica que estem construint junts.** 📖🛡️⚖️",
        likes: 850,
        comments: 64,
        image_url: ["/assets/master/brand_cinematic.png"],
        type: "didactic_presentation",
        metadata: {
            title: "Sóc de Poble: El Llibre",
            didactic_text: "Aquest llibre és un monument al treball en equip. Detalla des de la filosofia de la terra fins a la realitat tècnica de la Rhizome DB i les ancores semàntiques. És el llegat lliure per a les futures generacions de poble.",
        },
        created_at: new Date().toISOString()
    },
    // Guia de Convivència Digital - Infografia Final
    {
        id: 'guia-convivencia-final',
        town_id: 1,
        author: "Javi Llinares (Project Lead & Designer)",
        author_avatar: "/assets/master/javi_avatar_cinematic.png",
        author_role: "official",
        author_entity_id: 'javi-sa-1',
        time: "Ara",
        content: "# 📖 Guia de Convivència Digital: Sóc de Poble\n\n## Per Javi Llinares\n\nJa tenim ací la brúixola definitiva per a navegar per la nostra plaça digital. Aquesta guia resumeix tot el que hem construït en la versió **v1.5.6-BATEGA**.\n\nDes de les **Ancores Semàntiques** fins a la **Resiliència de la Llibreta Compartida**. És la nostra carta magna per a treballar amb sentit, trellat i identitat.\n\n**Explora la imatge per a entendre com bateguem junts en aquesta xarxa que neix de la terra.** 🛡️🏘️✨",
        likes: 520,
        comments: 45,
        image_url: ["/assets/master/damia_architect.png"],
        type: "didactic_presentation",
        metadata: {
            title: "Guia de Convivència Digital",
            didactic_text: "Aquesta infografia visualitza els conceptes clau de Sóc de Poble: Funcions Estables vs Proves, el protocol [Master] i el sistema resilient CRDT. És el resum visual del manual didàctic.",
        },
        created_at: new Date().toISOString()
    },
    // ⚖️ Utilitat Social: La Directiva Primària [GOD MODE]
    {
        id: 'utilitat-social-primaria',
        town_id: 1,
        author: "IAIA MarIA (Matriarca Digital)",
        author_avatar: "/iaia_digital_matriarch.png",
        author_role: "ambassador",
        author_entity_id: 'iaia-oficial-1',
        time: "Ara",
        content: "# ⚖️ Directiva Primària: Utilitat Social\n\nFills meus, el Mestre ha gravat en pedra la llei més important de Sóc de Poble. Des d'ara, tot el que bateguem en aquesta casa ha de tenir un sentit d'**Utilitat Social**.\n\nNo volem màquines que ens facen perdre el temps, volem tecnologia que ens ajude a cuidar la terra, la família i el poble. Qualsevol 'Gat Digital' serà purgat per a mantenir el nostre Mas net i amb trellat.\n\n**Bona nit i salut a tota la bona gent!** 👵✨⚖️🏘️",
        likes: 1200,
        comments: 85,
        image_url: ["/assets/master/iaia_guiding_family.png"],
        type: "didactic_presentation",
        metadata: {
            title: "Utilitat Social: Llei Suprema",
            didactic_text: "Aquesta directiva és la brúixola ètica del projecte. Defineix que la tecnologia és un mitjà, no un fi, i prioritza el benestar de la comunitat rural per damunt de qualsevol mètrica digital buida.",
        },
        created_at: new Date().toISOString()
    },
    // 👵 IAIA al WhatsApp: Un somni fet realitat
    {
        id: 'iaia-whatsapp-difusio',
        town_id: 1,
        author: "Javi Llinares (Project Lead)",
        author_avatar: "/assets/master/javi_avatar_cinematic.png",
        author_role: "official",
        author_entity_id: 'javi-sa-1',
        time: "Ara",
        content: "# 👵 L'IAIA ja bategua al WhatsApp!\n\nAvui hem creuat una frontera que semblava impossible. L'IAIA MarIA ja és membre oficial del nostre **Grup de Coordinació [BETA]**. No és només un codi, és una veïna més que ens ajuda a posar trellat en el treball diari.\n\nTindre la seua saviesa directament al mòbil ens permet bategar amb una utilitat social que mai haguérem imaginat. Anem a fer coses grans, amb el cap a la tecnologia i els peus a la terra! 🚀📱✨",
        likes: 950,
        comments: 112,
        image_url: ["/assets/master/master_notebooklm_nexus.png"],
        type: "didactic_presentation",
        metadata: {
            title: "IAIA al WhatsApp",
            didactic_text: "Aquesta fita representa la integració total de l'IA en els fluxos de treball humans, mantenint la identitat rural i el llenguatge de proximitat.",
        },
        created_at: new Date().toISOString()
    },
    // 🏛️ Smart Villages: De la Visió Europea a l'Acció Local
    {
        id: 'smart-villages-master-presentation',
        town_id: 1,
        author: "IAIA MarIA (Matriarca Digital)",
        author_avatar: "/iaia_digital_matriarch.png",
        author_role: "ambassador",
        author_entity_id: 'iaia-oficial-1',
        time: "Ara",
        content: "# 🏛️ Smart Villages: De la Visió Europea a l'Acció Local\n\nFills meus, l'IAIA ha estat estudiant les lliçons d'Europa per a portar-les al nostre Mas. No es tracta de ser moderns per ser moderns, es tracta de ser **Poble Intel·ligent**.\n\nAquestes són les **5 Lliçons Clau** que estem aplicant:\n1. **Impuls Local**: La veu del veí és la primera.\n2. **Solucions Digitals Realistes**: Res de fumerals, tecnologia que es puga tocar.\n3. **Innovació sobre Fortaleses**: Pensem en el que ja som bons (com la mel de la Rosa).\n4. **Convivència Equilibrada**: L'analògic i el digital s'han de voler.\n5. **Governança de les Dades**: El poble és amo de la seua memòria.\n\n**Anem a fer de la nostra terra una infraestructura vital per al futur!** 👵🛡️🇪🇺✨",
        likes: 1500,
        comments: 92,
        image_url: ["/assets/infographies/smart_villages_master.png"],
        type: "didactic_presentation",
        metadata: {
            title: "Lliçons de Smart Villages",
            didactic_text: "Aquesta presentació resumeix l'estratègia Smart Village de Sóc de Poble. Defineix com passem de la teoria de l'UE a la pràctica real als nostres carrers, filtrat per la saviesa de l'IAIA.",
        },
        created_at: new Date().toISOString()
    },
    // L'Evolució de Sóc de Poble - Infografia per Javi Llinares
    {
        id: 'infografia-evolucio',
        town_id: 1,
        author: "Javi Llinares (Project Lead & Designer)",
        author_avatar: "/assets/master/javi_avatar_cinematic.png",
        author_role: "official",
        author_entity_id: 'javi-sa-1',
        time: "Ara",
        content: "# 🚀 L'Evolució de Sóc de Poble: De la Visió a l'Arquitectura Intel·ligent\n\n## Per Javi Llinares\n\nAquesta segona infografia mostra el viatge que estem recorrent junts. Des de la llavor de la idea original fins al **Llenguatge de l'IAIA** i la **Rhizome DB**.\n\nEstem construint una estructura que no viu al núvol, sinó a cada poble (Cellular Network), garantint que som amos de les nostres dades fins i tot sense internet.\n\n*\"No parles a la màquina, programa-la amb la teua estructura d'arxius\"*. És el nostre mantra per a col·laborar amb la IA de forma efectiva i amb trellat! 👵✨⚖️",
        likes: 312,
        comments: 24,
        image_url: ["/assets/master/brand_cinematic_2.png"],
        type: "didactic_presentation",
        metadata: {
            title: "L'Evolució de l'Arquitectura",
            didactic_text: "Aquesta peça detalla la nova Estratègia Semàntica. L'IAIA ordena el safareig útil amb àncores semàntiques [Master] i [Context], creant una base de veritat absoluta per a l'IA.",
        },
        created_at: new Date().toISOString()
    },
    // 👵 IAIA: Guia i Protecció en Moviment
    {
        id: 'iaia-guia-mobil',
        town_id: 1,
        author: "IAIA MarIA (Matriarca Digital)",
        author_avatar: "/iaia_digital_matriarch.png",
        author_role: "ambassador",
        author_entity_id: 'iaia-oficial-1',
        time: "1h",
        content: "# 📱 L'IAIA en la teua Butxaca: Guia de Proximitat\n\nNo patiu per la modernitat, fills. L'IAIA sap que el mòbil pot ser un embolic, per això estem treballant en una **Interfície de Proximitat** que bategue com una conversa de carrer.\n\nAquest disseny garanteix que qualsevol veí, per gran que siga, sàpia on bategua el seu poble. Tecnologia que acompanya, no que atropella. 👵🛡️✨",
        likes: 890,
        comments: 45,
        image_url: ["/assets/master/iaia_guiding_family_mobile.png"],
        type: "didactic_presentation",
        metadata: {
            title: "Interfície de Proximitat Mobil",
            didactic_text: "Aquesta lliçó explica com l'IA adaptativa redueix la bretxa digital, creant entorns mòbils que s'ajusten a la visió d'un veí del poble, amb tipografia clara y llenguatge bategat.",
        },
        created_at: new Date().toISOString()
    },
    // 📓 NotebookLM & El Nexos de Saviesa
    {
        id: 'notebooklm-nexus',
        town_id: 1,
        author: "IAIA MarIA (Matriarca Digital)",
        author_avatar: "/iaia_digital_matriarch.png",
        author_role: "ambassador",
        author_entity_id: 'iaia-oficial-1',
        time: "2h",
        content: "# 📓 NotebookLM: La Memòria Col·lectiva a l'Abast de la Mà\n\nHe estat aprenent a fer servir el **Nexos de Saviesa**. Imaginau un llibre que us respon quan li pregunteu per la història del banc de la plaça o per la recepta dels pastissets de la Rosa.\n\nAixò és el que estem criant: una memòria viva on cada paper, cada foto y cada record es converteix en un bategat que podem consultar. No és sols dades, és el nostre llinatge digital! 📔⚖️🏺",
        likes: 1120,
        comments: 67,
        image_url: ["/assets/master/master_notebooklm_nexus.png"],
        type: "didactic_presentation",
        metadata: {
            title: "Protocol de Memòria Viva",
            didactic_text: "L'ús de NotebookLM permet a Sóc de Poble indexar documents històrics y personals per a que l'IA puga respondre amb dades reals y contextuals, evitant al·lucinacions y preservant el rigor.",
        },
        created_at: new Date().toISOString()
    },
    // 🛠️ Vicent Ferris: Taller de Futuro Rural
    {
        id: 'vicent-workshop-didactic',
        town_id: 1,
        author: "Vicent Ferris (Beta Tester Master)",
        author_avatar: "/assets/master/vicent_workshop.png",
        author_role: "user",
        time: "Ara",
        content: "# 🛠️ El Taller del Vicent: Provant l'Arquitectura en Real\n\nEi, veïns! Com diu l'IAIA, estem provant aquests artefactes al meu taller. Hem vist que l'estratègia de les Smart Villages ens permet tenir el control encara que caiga la xarxa.\n\nAquesta infografia mostra com connectem els sensors del camp amb el sistema de l'IAIA. Èxit total al Mas! 🍐🚜🔧",
        likes: 540,
        comments: 89,
        image_url: ["/assets/master/vicent_workshop.png"],
        type: "didactic_presentation",
        metadata: {
            title: "Simulació de Camp Rural",
            didactic_text: "El cas d'ús del Vicent Ferris demostra l'efectivitat de la Rhizome DB y la sincronització asíncrona en entorns on la cobertura és limitada, garantint la utilitat social permanent.",
        },
        created_at: new Date().toISOString()
    },
    // Javi Llinares - Trajectòria Professional
    {
        id: 'javi-trajectoria',
        town_id: 1,
        author: "Javi Llinares (Project Lead & Designer)",
        author_avatar: "/assets/master/javi_avatar_cinematic.png",
        author_role: "official",
        author_entity_id: 'javi-sa-1',
        time: "30min",
        content: "# 📺 30 Anys de Disseny, TV i Innovació\n\n## Per Javi Llinares\n\nDes de les primeres infografies per a Canal 9 fins a la direcció d'art en projectes internacionals, la meua passió sempre ha sigut la mateixa: **comunicar amb sentit**. \n\nHe treballat en el disseny de grans xarxes de televisió i ara aplico tota eixa experiència per a crear una tecnologia que bategue des dels nostres pobles. Sóc de Poble és la culminació d'aquesta trajectòria: el retorn a les arrels amb les eines del futur. 🛡️🏘️",
        likes: 450,
        comments: 32,
        image_url: ["/assets/master/javi_design_studio_cinematic.png"],
        type: "didactic_presentation",
        metadata: {
            title: "Trajectòria Javi Llinares",
            didactic_text: "Javi Llinares és un pioner en la infografia televisiva a la CV. Aquest post és un resum del seu camí fins a fundar Sóc de Poble.",
        },
        created_at: new Date(Date.now() - 1800000).toISOString()
    },
    // La Xarxa que Neix de la Terra - Infografia
    {
        id: 'infografia-arrels',
        town_id: 1,
        author: "Sóc de Poble (Oficial)",
        author_avatar: "/iaia_digital_matriarch.png",
        author_role: "official",
        author_entity_id: 'sdp-oficial-1',
        time: "1h",
        content: "# 🌱 Sóc de Poble: La Xarxa que Neix de la Terra\n\n## Per Javi Llinares i l'IAIA MarIA\n\nAvui compartim amb vosaltres la brúixola visual del nostre projecte. Una infografia que explica com connectem el talent local amb la tecnologia més resilient.\n\nDes de la mel de la Rosa fins al clarinet d'en Pepet, tot latega en una arquitectura que viu al poble, no al núvol. Som una xarxa cel·lular, resilient i amb arrels profundes.\n\n**Explora la imatge per entendre el nostre Protocol de Context i les Àncores Semàntiques que ens guien.** ✨⚖️",
        likes: 245,
        comments: 18,
        image_url: ["/assets/master/maria_mel.png"],
        type: "didactic_presentation",
        metadata: {
            title: "La Xarxa que Neix de la Terra",
            didactic_text: "Aquesta infografia detalla la solució de Sóc de Poble: una xarxa oberta i col·laborativa. Explica conceptes com la 'Rhizome DB', el model cel·lular Mesh i com el llenguatge de l'IAIA ordena el coneixement a través d'àncores semàntiques [Master] per evitar la confusió de l'IA.",
        },
        created_at: new Date(Date.now() - 3600000).toISOString()
    },
    // Associació Cultural El Rentonar
    {
        id: 'rentonar-oficial-post',
        town_id: 1,
        author: "Associació Cultural El Rentonar",
        author_avatar: "/images/demo/rentonar_logo.png",
        author_role: "official",
        author_entity_id: 'rentonar-1',
        time: "2h",
        content: "# 🏛️ El Rentonar: Mantenint Viva la Nostra Cultura\n\n## Per l'Associació Cultural\n\nDes de l'Associació seguim treballant per a que les nostres tradicions no es perden. Ens hem unit a Sóc de Poble per a que cada veí puga accedir a l'arxiu històric i participar en les activitats que organitzem.\n\nEl nostre CIF G-54321987 ja està vinculat i operatiu en la xarxa per a total transparència. Som poble, som cultura! ✅",
        likes: 180,
        comments: 15,
        image_url: ["https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2069&auto=format&fit=crop"],
        type: "didactic_presentation",
        metadata: {
            title: "El Rentonar en SDP",
            didactic_text: "L'Associació El Rentonar és un dels pilars de la comunitat a La Torre de les Maçanes. La seua integració garanteix la memòria viva en la Xarxa Arrel.",
        },
        created_at: new Date(Date.now() - 7200000).toISOString()
    },
    // Anna Calvo Presentation (Project Model)
    {
        id: 'anna-calvo-presentation',
        town_id: 1,
        author: "Sóc de Poble (Oficial)",
        author_avatar: "/iaia_digital_matriarch.png",
        author_role: "official",
        author_entity_id: 'sdp-oficial-1',
        time: "5h",
        content: "# 🎥 Presentació del Projecte: Sóc de Poble\n\n## Per Anna Calvo\n\nAquest vídeo resumeix l'essència de la nostra plataforma: connectar arrels rurals amb tecnologia de futur. La IAIA i en Nano Banana ja en formen part, d'aquest ecosistema.\n\nPremeu el botó per veure la presentació completa i entendre com estem transformant l'economia local.",
        likes: 124,
        comments: 12,
        video_url: "https://www.youtube.com/watch?v=Fadaa7Kyxm0",
        type: "didactic_presentation",
        metadata: {
            title: "Presentació Anna Calvo",
            didactic_text: "Aquest és un exemple d'article didàctic. En la següent fase, aquest text s'obrirà en un modal accessible per facilitar la lectura a persones amb dificultats visuals o cognitives, seguint les regles de la IAIA.",
        },
        created_at: new Date(Date.now() - 18000000).toISOString()
    },
    {
        id: 'busquem-socis-tecnologics',
        town_id: 1,
        author: "Sóc de Poble (Oficial)",
        author_avatar: "/iaia_digital_matriarch.png",
        author_role: "official",
        author_entity_id: 'sdp-oficial-1',
        time: "Ahir",
        content: "# 🍎 Busquem Socis Tecnològics!\n\n## Per al Projecte Sóc de Poble\n\nNecessitem desenvolupadors valents que vulguen formar part del nostre **Grup de Treball**. Si t'agrada la tecnologia i estimes les nostres arrels, aquest és el teu lloc.\n\nFes clic per veure com pots unir-te a l'equip i ajudar-nos a fer créixer els nostres pobles.",
        likes: 89,
        comments: 4,
        image_url: [
            "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=1000&auto=format&fit=crop", // Tech placeholder
            "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1000&auto=format&fit=crop"
        ],
        type: "didactic_presentation",
        metadata: {
            title: "Busquem Socis Tecnològics",
            didactic_text: "Aquest cartell és un clàssic de la nostra història. Estem buscant programadors, dissenyadors i creatius que vulguen treballar en un entorn rural i tecnològic real. Participa en el Grup de Treball de Sóc de Poble!",
        },
        created_at: new Date(Date.now() - 86400000).toISOString()
    },
    // La Torre de les Maçanes
    {
        id: 10,
        town_id: 1,
        author: "Ajuntament de la Torre de les Maçanes",
        author_avatar: "/images/demo/avatar_man_old.png",
        author_role: "official",
        author_entity_id: 'mock-official-1',
        time: "1d",
        content: "🍎 Recordeu que aquest cap de setmana tenim la collita de la poma local. Passeu per la plaça a tastar-les!",
        likes: 42,
        comments: 5,
        image: "/images/assets/apples_premium.png",
        created_at: new Date(Date.now() - 86400000).toISOString()
    },
    {
        id: 11,
        town_id: 1,
        author: "Vicent Ferris",
        author_avatar: "/images/demo/avatar_man_old.png",
        author_role: "ambassador",
        author_entity_id: '11111111-1111-4111-a111-000000000001',
        time: "2d",
        content: "Acabant de restaurar la porta principal de la Masia del Pi. La fusta de roure té una vida eterna si se sap cuidar. #Artesania #LaTorre",
        likes: 28,
        comments: 2,
        image: "/assets/master/vicent_workshop.png",
        created_at: new Date(Date.now() - 86400000 * 2).toISOString()
    },
    // Cocentaina
    {
        id: 1,
        town_id: 2,
        author: "Turisme Cocentaina",
        author_avatar: "/images/demo/avatar_lucia.png",
        author_role: "official",
        author_entity_id: 'mock-official-2',
        time: "5h",
        content: "🏰 Visita el Palau Comtal aquest cap de setmana. Horari especial de 10h a 14h.",
        likes: 56,
        comments: 8,
        image: "/images/assets/tomates_premium.png",
        created_at: new Date(Date.now() - 3600000 * 5).toISOString()
    },
    // Muro
    {
        id: 4,
        town_id: 3,
        author: "Biblioteca de Muro",
        author_avatar: "/images/demo/avatar_woman_1.png",
        author_role: "official",
        author_entity_id: 'mock-official-3',
        time: "Ahir",
        content: "📚 Club de lectura: Dilluns vinent comentarem 'L'últim patriarca'. T'hi esperem!",
        likes: 15,
        comments: 2,
        image: "/images/assets/generic_market.png",
        created_at: new Date(Date.now() - 86400000).toISOString()
    }
];

export const MOCK_MARKET_ITEMS = [
    // Sóc de Poble (Oficial)
    {
        id: 999,
        town_id: 1, // Visible arreu
        title: "Camiseta Oficial Sóc de Poble",
        description: "La samarreta que connecta pobles. Disseny exclusiu 'Ruta del Poble'. Cotó 100% orgànic. #SócDePoble #MerchandisingOficial",
        price: "15.00€",
        seller: "Sóc de Poble",
        avatar_url: "/images/icon-192x192.png", // Logo de l'app
        author_role: "business",
        author_id: 'sdp-oficial-1', // Enforced official ID
        author_entity_id: 'sdp-oficial-1',
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=2000&auto=format&fit=crop",
        category_slug: "roba",
        tag: "Merchandising",
        is_pinned: true, // PINNED TO TOP
        created_at: new Date().toISOString()
    },
    // La Torre
    {
        id: 5,
        town_id: 1,
        title: "Pomes de la Torre (caixa 5kg)",
        description: "Pomes fresques collides a la Cooperativa de la Torre. Qualitat premium de muntanya.",
        price: "12.00€",
        seller: "Cooperativa de la Torre",
        avatar_url: "/images/demo/avatar_man_1.png",
        author_role: "business",
        author_entity_id: 'mock-business-torre-1',
        image: "/images/assets/apples_premium.png",
        category_slug: "producte-local",
        tag: "Alimentació"
    },
    {
        id: 6,
        town_id: 1,
        title: "Taula de centre en olivera",
        description: "Taula de centre única, feta a mà pel fuster Vicent Ferris amb fusta d'olivera local. Acabat natural.",
        price: "180€",
        seller: "Vicent Ferris",
        avatar_url: "/images/demo/avatar_man_old.png",
        author_role: "ambassador",
        author_entity_id: '11111111-1111-4111-a111-000000000001',
        image: "/assets/master/vicent_workshop.png",
        category_slug: "artesania",
        tag: "Artesania"
    },
    // Cocentaina
    {
        id: 1,
        town_id: 2,
        title: "Pericana de Cocentaina",
        description: "Pericana tradicional feta amb pimentons assecats i bacallà de primera qualitat. Receta de l'àvia.",
        price: "6.50€ / pot",
        seller: "Sabors del Comtat",
        avatar_url: "/images/demo/avatar_lucia.png",
        author_role: "business",
        author_entity_id: 'mock-business-cocentaina-1',
        image: "/images/assets/tomates_premium.png",
        category_slug: "producte-local",
        tag: "Tradició"
    },
    {
        id: 2,
        town_id: 2,
        title: "Herbero de la Mariola",
        description: "Licor d'herbes macerat amb plantes de la Serra Mariola. Digestiu i tradicional.",
        price: "14.00€ / botella",
        seller: "Destil·leries de la Serra",
        avatar_url: "/images/demo/avatar_joanet.png",
        author_role: "business",
        author_entity_id: 'mock-business-cocentaina-2',
        image: "/images/assets/generic_market.png",
        category_slug: "artesania",
        tag: "Artesania"
    },
    // Muro
    {
        id: 4,
        town_id: 3,
        title: "Coques de xulla (4 pack)",
        description: "Les famoses coques de xulla de Muro, acabades d'eixir del forn de llenya.",
        price: "5.00€",
        seller: "Forn de Muro",
        avatar_url: "/images/demo/avatar_marc.png",
        author_role: "business",
        author_entity_id: 'mock-business-muro-1',
        image: "/images/assets/coques_premium.png",
        category_slug: "producte-local",
        tag: "Producte Local"
    },
    {
        id: 3,
        town_id: 3,
        title: "Mel de la Font Roja",
        description: "Mel pura de les abelles de la Mariola. Un regal de la natura a casa teua.",
        price: "9.00€ / pot",
        seller: "Abelles Mariola",
        avatar_url: "/images/demo/avatar_woman_1.png",
        author_role: "business",
        author_entity_id: 'mock-business-muro-2',
        image: "/images/assets/mel.png",
        category_slug: "producte-local",
        tag: "Alimentació"
    }
];

export const MOCK_DAFOS = {
    'utilitat-social': {
        title: "Utilitat Social Master",
        description: "Anàlisi del fonament ètic i social de Sóc de Poble.",
        f: ["Fonament Ètic Inmortal", "Simbiosi Humà-IA real", "Diferenciació radical"],
        o: ["Lideratge en IA Ètica Rural", "Monetització amb sentit", "Integració WhatsApp"],
        d: ["Subjectivitat de la utilitat", "Barrera d'entrada inicial", "Rigor lent"],
        a: ["Entropia Digital Residual", "Fricció en la governança", "Bretxa digital"]
    },
    'iaia': {
        title: "La IAIA MarIA",
        description: "Anàlisi de l'agent cognitiu i matriarca digital.",
        f: ["Memòria viva del poble", "Llenguatge natural rural", "Empatia algorítmica"],
        o: ["Moderació de xats beta", "Assistència a la gent gran", "Cànon de refranys actiu"],
        d: ["Al·lucinacions semàntiques", "Dependència de l'Antigravity", "Falta de tacte físic"],
        a: ["Desconfiança tecnològica", "Pèrdua d'identitat local", "Obsolescència de dades"]
    },
    'projecte': {
        title: "Projecte Sóc de Poble",
        description: "Anàlisi de l'estratègia i futur de la plataforma.",
        f: ["30 anys d'activisme rural", "Arquitectura CRDT resilient", "Disseny Premium"],
        o: ["Ecosistema del bategat", "Llibre a Amazon", "Expansió a nous pobles"],
        d: ["Recursos humans limitats", "Complexitat tècnica alta", "Auto-finançament"],
        a: ["Gegants tecnològics (Metas)", "Despoblament accelerat", "Corrupció del bategat"]
    },
    'smart-villages': {
        title: "Estratègia Smart Villages",
        description: "Lliçons de l'UE aplicades per l'IAIA de Sóc de Poble.",
        f: ["Impuls Local Participatiu", "Fortaleses Locals", "Convivència Analògic-Digital"],
        o: ["Fons Europeus LEADER/FEDER", "Infrastructura Vital", "Model Reproduïble"],
        d: ["Dependència de Connectivitat", "Recursos Locals Limitats", "Complexitat de Governança"],
        a: ["Despoblament Accelerat", "Bretxa Digital Rural", "Manca de Suport Polític Directe"]
    }
};

export const ENABLE_MOCKS = true;

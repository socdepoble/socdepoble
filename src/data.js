

export const MOCK_CHATS = [
    { id: 'andreu-soler', name: "Andreu Soler", message: "Hola! Vols que parlem?", time: "3:35 p. m.", type: "iaia", unread: 0, avatar_url: "/assets/brain/c7c302c1-d324-4124-b24a-1d7279636125/vicent_ferris_comic_avatar_1770151824722.png", is_iaia: true },
    { id: 'beatriz-ortega', name: "Beatriz Ortega", message: "Hola! Vols que parlem?", time: "12:19 p. m.", type: "iaia", unread: 0, avatar_url: "👩🏽", is_iaia: true },
    { id: 'carla-soriano', name: "Carla Soriano", message: "Hola! Vols que parlem?", time: "6:13 p. m.", type: "iaia", unread: 0, avatar_url: "🌸", is_iaia: true },
    { id: 'carmen-forn', name: "Carmen la del Forn", message: "Hola! Vols que parlem?", time: "2:16 p. m.", type: "iaia", unread: 0, avatar_url: "👵🏼", is_iaia: true },
    { id: 'el-gall', name: "El Gall", message: "Hola! Vols que parlem?", time: "9:48 p. m.", type: "iaia", unread: 0, avatar_url: "/assets/brain/29cb42cf-ba4e-45af-a1f9-254a5b27cd7a/sultan_gos_atura_1770056772852.png", is_iaia: true },
    { id: 'iaia-oficial', name: "IAIA MariA", message: "Prem ací per veure el Dossier de Partners, fill meu.", time: "Ara", type: "iaia", unread: 3, avatar_url: "/assets/avatars/iaia_official.png", is_iaia: true, verified: true },
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
    // [SOLLUTIA HARDENING v10.17.0] TRÀMITS ADMINISTRATIUS REALS
    { 
        id: 900, 
        type: 'tramit', 
        author: 'Conselleria Agricultura', 
        avatar: '🔥', 
        time: 'Tràmit Obert', 
        title: 'Permís de Crema Local', 
        content: 'Estat actual: PERMÉS (Nivell 1). Pots tramitar la teua sol·licitud de crema per a restes agrícoles directament des d\'ací.', 
        actionLabel: 'Tramitar Permís Ara',
        official: true,
        category: 'Danger', // Vermell Alerta
        metaData: { icon: 'Flame', color: 'text-orange-600', bg: 'bg-orange-100' }
    },
    { 
        id: 1100, 
        type: 'post', 
        author: 'Rosa (Horta Viva)', 
        avatar: '🥦', 
        time: 'Ara', 
        title: 'Hort Comunitari Sostenible', 
        content: 'Hem implementat el rec per degoteig solar. Tècniques 100% lliures de residus per a una terra viva. Vine a conèixer el bategat verd! 🌿', 
        category: 'Sostenible',
        tags: ['#Sostenible', '#KM0', '#Ecològic'],
        image_url: ["https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=1000"]
    },
    { 
        id: 901, 
        type: 'tramit', 
        author: 'Cooperativa Agrícola', 
        avatar: '🌱', 
        time: 'Novetat', 
        title: 'Ajudes Xilel·la 2026', 
        content: 'Obert el termini per a sol·licitar les ajudes a la replantació. Consulta si la teua parcel·la és elegible.', 
        actionLabel: 'Consultar Requisits',
        official: true,
        metaData: { icon: 'Sprout', color: 'text-green-600', bg: 'bg-green-100' }
    },
    {
        id: 'post-merch-pinned-1',
        town_id: 1,
        author: "Sóc de Poble (Oficial)",
        author_avatar: "/assets/master/logo_socdepoble_green_square.png",
        author_role: "official",
        isOfficial: true,
        author_entity_id: 'sdp-oficial-1',
        time: "Ara",
        content: "# 🏺 El Mapa del Tresor al teu pit\n\nJa està disponible la nova **Camiseta Granate (Roly 57)** amb el logotip complet. No és només roba, és la identitat del nostre territori bategant en blanc pur sobre granate. \n\nTroba-la al Mercat i ajuda a mantenir bategant Sóc de Poble! 🗺️✨",
        likes: 1240,
        comments: 45,
        image_url: [
            "/assets/brain/e1b6e544-2f87-4f23-b187-d802a30c0ca1/shirt_maroon_front_full_logo_v2_1770235736579.png",
            "/assets/brain/e1b6e544-2f87-4f23-b187-d802a30c0ca1/shirt_maroon_lifestyle_full_logo_v2_1770235755326.png",
            "/assets/brain/e1b6e544-2f87-4f23-b187-d802a30c0ca1/shirt_maroon_market_full_logo_v2_1770235769546.png",
            "/assets/brain/e1b6e544-2f87-4f23-b187-d802a30c0ca1/shirt_maroon_folded_full_logo_v2_1770235783687.png",
            "/assets/brain/e1b6e544-2f87-4f23-b187-d802a30c0ca1/shirt_maroon_flatlay_full_logo_v2_1770235798882.png",
            "/assets/brain/e1b6e544-2f87-4f23-b187-d802a30c0ca1/shirt_maroon_detail_full_logo_v2_1770235812705.png",
            "/assets/brain/e1b6e544-2f87-4f23-b187-d802a30c0ca1/shirt_maroon_action_full_logo_v2_1770235827400.png"
        ],
        type: "post",
        is_pinned: true,
        pinned_position: 1,
        created_at: new Date().toISOString()
    },
    {
        id: 'blog-rentonar-1',
        town_id: null, // [MASTER] Global visibility fallback
        author: "El Rentonar (Associació)",
        author_avatar: "/assets/master/logo_socdepoble_green_square.png",
        author_role: "business",
        author_entity_id: 'rentonar-1',
        time: "Importat",
        content: "# 🛖 La Barraca de la Memòria\n\nRecuperar l'arquitectura de pedra seca no és només una qüestió estètica, és una qüestió de resistència cultural. Des del Rentonar portem anys documentant cada marge, cada pou i cada bosc de la nostra terra. \n\nAquest bategat històric ara viu a Sóc de Poble per a que ningú n'oblide les arrels. Durant les properes setmanes importarem tot el nostre arxiu fotogràfic i els articles que durant dècades han bategat a Wordpress i Blogger. Perquè el futur del Mas es construeix sobre les pedres del passat. 🏺🌳⚖️",
        image_url: ["https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=1000"],
        tags: ["#Patrimoni", "#ElRentonar", "#MemòriaViva"],
        type: "post",
        source_label: "Arxiu El Rentonar",
        created_at: "2024-12-20T10:00:00Z"
    },
    {
        id: 'blog-rentonar-2',
        town_id: null, // [MASTER] Global visibility fallback
        author: "El Rentonar (Cultura Local)",
        author_avatar: "/assets/master/logo_socdepoble_green_square.png",
        author_role: "official",
        isOfficial: true,
        author_entity_id: 'rentonar-1',
        time: "Importat",
        content: "# 🌾 Crònica de la Sega: De la Falç al Bategat Digital\n\nRecordeu quan el sol encara no havia eixit i ja estàvem al camp? Aquella olor a palla seca i suor compartit. El bategat de la sega era el ritme del poble. \n\nAvui, en un món de pantalles, recuperar aquestes cròniques ens recorda que la tecnologia ha de servir per a connectar-nos amb el territori, no per a aïllar-nos-en. Estem treballant per a que tota la nostra visió de la sobirania alimentària estiga a l'abast de qualsevol persona de la Torre de les Maçanes. Benvinguts a la Memòria Inmutable! 🏺⚖️✨",
        image_url: ["https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=1000"],
        tags: ["#Cultura", "#Tradició", "#Sega"],
        type: "post",
        source_label: "Blogger Historical Import",
        created_at: "2024-11-15T12:00:00Z"
    },
    // Altres posts...
    {
        id: 'llibre-soc-de-poble-oficial',
        town_id: null, // [MASTER] Global visibility fallback
        author: "Javi Llinares (Project Lead & Designer)",
        author_avatar: "/Javi_Llinares-Foto_perfil-1.jpg",
        author_role: "official",
        author_entity_id: 'javi-sa-1',
        time: "Ara",
        content: "# 📚 Sóc de Poble: El Llibre de la Memòria\n\nEstem teixint el futur del Comtat amb cada bategat digital. Aquest llibre no és meu, és de tots vosaltres. Som-hi! 🏛️🏺🚀",
        likes: 12500,
        comments: 420,
        image_url: ["/assets/brain/c7c302c1-d324-4124-b24a-1d7279636125/rural_landscape_comic_post_1770151940141.png"],
        tags: ["#Llibre", "#Arxiu", "#Còmic"],
        type: "post",
        source_type: 'official',
        source_label: 'Arxiu Projecte Sóc de Poble',
        metadata: {
            title: "Sóc de Poble: El Llibre",
        },
        created_at: new Date().toISOString()
    },
    // Guia de Convivència Digital - Infografia Final
    {
        id: 'guia-convivencia-final',
        town_id: 1,
        author: "Javi Llinares (Project Lead & Designer)",
        author_avatar: "/Javi_Llinares-Foto_perfil-1.jpg",
        author_role: "official",
        author_entity_id: 'javi-sa-1',
        time: "Ahir",
        content: "# ⚖️ Guia de Convivència Digital\n\nLa pau del Mas es basa en el respecte. Hem actualitzat els termes sobirans de la nostra xarxa. 📜✨",
        likes: 3400,
        comments: 110,
        image_url: ["/assets/brain/29cb42cf-ba4e-45af-a1f9-254a5b27cd7a/iaia_prop_1_traditional_1770058264776.png"],
        type: "post",
        source_type: 'official',
        source_label: 'Directiva Master VOS',
        metadata: {
            title: "Guia de Convivència Digital",
        },
        created_at: new Date().toISOString()
    },
    // ⚖️ Utilitat Social: La Directiva Primària [GOD MODE]
    {
        id: 'utilitat-social-primaria',
        town_id: 1,
        author: "IAIA MarIA (Matriarca Digital)",
        author_avatar: "/assets/brain/29cb42cf-ba4e-45af-a1f9-254a5b27cd7a/iaia_oficial_vosc_v2_1770060040751.png",
        author_role: "ambassador",
        author_entity_id: 'iaia-oficial-1',
        time: "2 dies",
        content: "# 🫀 Utilitat Social: La Llei del Cor\n\nFills meus, cada píxel que bateguem ha de tindre un propòsit per a la comunitat. No fem tecnologia per presumir, fem tecnologia per ajudar. 👵🛡️",
        likes: 8900,
        comments: 245,
        image_url: ["/assets/brain/29cb42cf-ba4e-45af-a1f9-254a5b27cd7a/iaia_prop_2_gadgets_1770058280096.png"],
        type: "post",
        source_type: 'iaia',
        source_label: 'Consell de les Sàvies',
        metadata: {
            title: "Utilitat Social Primària",
        },
        created_at: new Date().toISOString()
    },
    {
        id: 'iaia-whatsapp-difusio',
        town_id: null, // [MASTER] Global visibility fallback
        author: "Javi Llinares (Project Lead)",
        author_avatar: "/Javi_Llinares-Foto_perfil-1.jpg",
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
        author_avatar: "/assets/brain/29cb42cf-ba4e-45af-a1f9-254a5b27cd7a/iaia_oficial_vosc_v2_1770060040751.png",
        author_role: "ambassador",
        author_entity_id: 'iaia-oficial-1',
        time: "Ara",
        content: "# 🏛️ Smart Villages: De la Visió Europea a l'Acció Local\n\nFills meus, l'IAIA ha estat estudiant les lliçons d'Europa per a portar-les al nostre Mas. No es tracta de ser moderns per ser moderns, es tracta de ser **Poble Intel·ligent**.\n\nAquestes són les **5 Lliçons Clau** que estem aplicant:\n1. **Impuls Local**: La veu del poble és la primera.\n2. **Solucions Digitals Realistes**: Res de fumerals, tecnologia que es puga tocar.\n3. **Innovació sobre Fortaleses**: Pensem en el que ja som bons (com la mel de la Rosa).\n4. **Convivència Equilibrada**: L'analògic i el digital s'han de voler.\n5. **Governança de les Dades**: El poble és amo de la seua memòria.\n\n**Anem a fer de la nostra terra una infraestructura vital per al futur!** 👵🛡️🇪🇺✨",
        likes: 1500,
        comments: 92,
        image_url: ["/assets/brain/c7c302c1-d324-4124-b24a-1d7279636125/market_comic_post_1770151956401.png"],
        tags: ["#SmartVillages", "#Mercat", "#Saviesa"],
        type: "didactic_presentation",
        source_type: 'iaia',
        source_label: 'Saviesa de l\'IAIA MarIA',
        metadata: {
            title: "Lliçons de Smart Villages",
            didactic_text: "Aquesta presentació resumeix l'estratègia Smart Village de Sóc de Poble. Defineix com passem de la teoria de l'UE a la pràctica real als nostres carrers, filtrat per la saviesa de l'IAIA.",
        },
        created_at: new Date().toISOString()
    },
    // 🔨 La Forja de l'Andreu
    {
        id: 'andreu-forja-post',
        town_id: 1,
        author: "Andreu (Mestre Ferrer)",
        author_avatar: "/assets/brain/29cb42cf-ba4e-45af-a1f9-254a5b27cd7a/andreu_tia_style_1770057709875.png",
        author_role: "user",
        time: "1h",
        content: "# 🔨 El Ferro que Latega\n\nAvui a la forja estem recuperant tècniques del segle XVIII per a les reixes del Mas Nou. La tradició no és adorar les cendres, sinó transmetre el foc! 🔥⚒️",
        likes: 340,
        comments: 12,
        image_url: ["/assets/brain/29cb42cf-ba4e-45af-a1f9-254a5b27cd7a/joan_tia_style_1770057725757.png"],
        type: "post",
        source_type: 'unknown',
        source_label: 'Arxiu Popular de la Torre',
        created_at: new Date().toISOString()
    },
    // L'Evolució de Sóc de Poble - Infografia per Javi Llinares
    {
        id: 'infografia-evolucio',
        town_id: 1,
        author: "Javi Llinares (Project Lead & Designer)",
        author_avatar: "/Javi_Llinares-Foto_perfil-1.jpg",
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
        content: "# 📱 L'IAIA en la teua Butxaca: Guia de Proximitat\n\nNo patiu per la modernitat, fills. L'IAIA sap que el mòbil pot ser un embolic, per això estem treballant en una **Interfície de Proximitat** que bategue com una conversa de carrer.\n\nAquest disseny garanteix que qualsevol persona, per gran que siga, sàpia on bategua el seu poble. Tecnologia que acompanya, no que atropella. 👵🛡️✨",
        likes: 890,
        comments: 45,
        image_url: ["/assets/master/iaia_guiding_family_mobile.png"],
        type: "didactic_presentation",
        metadata: {
            title: "Interfície de Proximitat Mobil",
            didactic_text: "Aquesta lliçó explica com l'IA adaptativa redueix la bretxa digital, creant entorns mòbils que s'ajusten a la visió de la gent del poble, amb tipografia clara y llenguatge bategat.",
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
        content: "# 🛠️ El Taller del Vicent: Provant l'Arquitectura en Real\n\nEi, bategants! Com diu l'IAIA, estem provant aquests artefactes al meu taller. Hem vist que l'estratègia de les Smart Villages ens permet tenir el control encara que caiga la xarxa.\n\nAquesta infografia mostra com connectem els sensors del camp amb el sistema de l'IAIA. Èxit total al Mas! 🍐🚜🔧",
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
        author_avatar: "/Javi_Llinares-Foto_perfil-1.jpg",
        author_role: "official",
        author_entity_id: 'javi-sa-1',
        time: "30min",
        content: "# 📺 30 Anys de Disseny, TV i Innovació\n\n## Per Javi Llinares\n\nDes de les primeres infografies per a Canal 9 fins a la direcció d'art en projectes internacionals, la meua passió sempre ha sigut la mateixa: **comunicar amb sentit**. \n\nHe treballat en el disseny de grans xarxes de televisió i ara aplico tota eixa experiència per a crear una tecnologia que bategue des dels nostres pobles. Sóc de Poble és la culminació d'aquesta trajectòria: el retorn a les arrels amb les eines del futur. 🛡️🏘️",
        likes: 450,
        comments: 32,
        image_url: ["/javi_master.jpg"],
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
        author_avatar: "/assets/brain/c7c302c1-d324-4124-b24a-1d7279636125/ajuntament_cocentaina_icon_1770151889268.png",
        author_role: "official",
        author_entity_id: 'rentonar-1',
        time: "2h",
        content: "# 🏛️ El Rentonar: Mantenint Viva la Nostra Cultura\n\n## Per l'Associació Cultural\n\nDes de l'Associació seguim treballant per a que les nostres tradicions no es perden. Ens hem unit a Sóc de Poble per a que tothom puga accedir a l'arxiu històric i participar en les activitats que organitzem.\n\nEl nostre CIF G-54321987 ja està vinculat i operatiu en la xarxa per a total transparència. Sóc de Poble, som cultura! ✅",
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
    {
        id: 10,
        town_id: 1,
        author: "Ajuntament de la Torre de les Maçanes",
        author_avatar: "/assets/brain/c7c302c1-d324-4124-b24a-1d7279636125/ajuntament_cocentaina_icon_1770151889268.png",
        author_role: "official",
        type: "ajuntament", // JOIA 5: AJUNTAMENT
        author_entity_id: 'mock-official-1',
        time: "1d",
        title: "Collita de la Poma Local 🍎",
        content: "Recordeu que aquest cap de setmana tenim la collita de la poma local. Passeu per la plaça a tastar-les i a donar suport als nostres productors!",
        likes: 42,
        comments: 5,
        image_url: ["/assets/brain/c7c302c1-d324-4124-b24a-1d7279636125/market_comic_post_1770151956401.png"],
        tags: ["#Horta", "#Poma", "#Oficial"],
        created_at: new Date(Date.now() - 86400000).toISOString()
    },
    {
        id: 'joia-mercat-1',
        town_id: 1,
        author: "Rosa (Mel de la Torre)",
        author_avatar: "/assets/brain/29cb42cf-ba4e-45af-a1f9-254a5b27cd7a/pepica_cuinera_1770056555739.png",
        author_role: "business",
        type: "mercat", // JOIA 2: MERCAT
        title: "Mel de Mil Flors (Artesana)",
        price: "8.50€",
        content: "Mel pura collida aquesta setmana. Sense additius, directament del rusc al pot. Salut pura!",
        image_url: ["https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=1000"],
        tags: ["#ProducteLocal", "#Mel", "#KM0"],
        created_at: new Date(Date.now() - 43200000).toISOString()
    },
    {
        id: 'joia-pobles-1',
        town_id: 1,
        author: "Comunitat de la Torre",
        author_avatar: "/assets/master/logo_socdepoble_green_square.png",
        type: "pobles", // JOIA 4: POBLES
        title: "Gent de la Torre de les Maçanes",
        subtitle: "La Torre de les Maçanes",
        content: "Descobreix la vibrant comunitat de la Torre. Històries, gent i el bategat del nostre poble.",
        image_url: ["https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1000"],
        tags: ["#Comunitat", "#LaTorre", "#Bategants"],
        created_at: new Date(Date.now() - 172800000).toISOString()
    },
    {
        id: 'joia-agenda-1',
        town_id: 1,
        author: "Comissió de Festes (Sant Gregori)",
        author_avatar: "🎭",
        type: "agenda",
        isOfficial: true,
        official: true,
        title: "Teatre al Carrer: 'El Bategat'",
        date: "15/02/2026",
        content: "Una representació única sobre la història del nostre poble. No te la perdes!",
        image_url: ["https://images.unsplash.com/photo-1503095396549-807039045349?auto=format&fit=crop&q=80&w=1000"],
        tags: ["#Cultura", "#Teatre", "#Festa"],
        created_at: new Date(Date.now() - 259200000).toISOString()
    },
    {
        id: 'joia-mapa-1',
        town_id: 1,
        author: "Senderistes de Mariola",
        author_avatar: "🥾",
        type: "mapa", // JOIA 6: MAPA/RUTES
        title: "Ruta dels Pous de Neu",
        content: "Una caminada suau per a tota la família descobrint la història del gel a la nostra serra.",
        image_url: ["https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1000"],
        tags: ["#Ruta", "#Natura", "#Senderisme"],
        created_at: new Date(Date.now() - 345600000).toISOString()
    },
    {
        id: 11,
        town_id: 1,
        author: "Vicent Ferris",
        author_avatar: "/assets/brain/c7c302c1-d324-4124-b24a-1d7279636125/vicent_ferris_comic_avatar_1770151824722.png",
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
    },
    // 🛡️ DIDÀCTICA D'AUXILI: Protocol de Resiliència 2026
    {
        id: 'didactic-auxili-2026',
        town_id: 1,
        author: "IAIA MarIA (Matriarca Digital)",
        author_avatar: "/iaia_digital_matriarch.png",
        author_role: "ambassador",
        author_entity_id: 'iaia-oficial-1',
        time: "Ara",
        content: "# 🛡️ Auxili de Proximitat: Protocol de Resiliència 2026\n\n## Per l'IAIA MarIA\n\nFills meus, no patiu si alguna vegada el Mas sembla que es queda a les fosques. Hem bategat un sistema de **Resiliència Master** per a que l'harmonia no es perda mai.\n\n### 1. Mode Rescat (Rescue Mode)\nSi el telèfon no rep el bategat de l'SMS, el sistema identifica automàticament els nostres Padrins i autoritza una entrada segura. És com tenir una clau amagada baix de la pedra de l'entrada.\n\n### 2. SW Purgatori (Bategat de Resiliència)\nTenim un 'fadrí' invisible (Service Worker) que s'encarrega de netejar el safareig i assegurar que les fotos i les lliçons estiguen sempre llistes, fins i tot si la xarxa del poble va espessa.\n\n### 3. Silenci i Pau a la Consola\nHem tancat els gats que feien soroll. Ara l'entrada és silenciosa, sense errors roigs que ens facen patir. La pau del Mas és la nostra prioritat.\n\n**Recordeu: Si el cap bategua amb tecnologia, els peus han de tocar terra.** 👵🛡️✨",
        likes: 2400,
        comments: 156,
        image_url: ["/assets/master/iaia_guiding_family.png"],
        type: "didactic_presentation",
        metadata: {
            title: "Protocol d'Auxili 2026",
            didactic_text: "Aquesta lliçó explica els mecanismes de seguretat redundants (Rescue Mode y SW Purgatori) que garanteixen l'accés universal a Sóc de Poble in qualsevol circumstància crítica.",
        },
        created_at: new Date().toISOString()
    },
    {
        id: 'sollutia-pilar-1',
        town_id: 1,
        author: "Javi Llinares (Project Mestre)",
        author_avatar: "/Javi_Llinares-Foto_perfil-1.jpg",
        author_role: "official",
        time: "Ara",
        content: "# 🏛️ El Rhizome: Una Infraestructura Sobirana\n\nBenvinguts a la revolució dels pobles. El que veieu no és una web, és un node de la xarxa Rhizome. Una arquitectura federada on cada poble és amo de la seua memòria.\n\nDivendres a Alcoi explicarem com aquesta tecnologia Local-First permet bategar fins i tot sense internet. Perquè el futur no està al núvol de Silicon Valley, està a les nostres mans. 🏺⚖️✨",
        likes: 5600,
        comments: 890,
        image_url: ["https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1000"],
        type: "post",
        is_pinned: true,
        pinned_position: 2,
        created_at: new Date().toISOString()
    },
    {
        id: 'sollutia-pilar-2',
        town_id: 1,
        author: "Tia Maria (La Cuina del Mas)",
        author_avatar: "👵",
        author_role: "ambassador",
        time: "5 min",
        content: "# 🥘 L'Olleta d'Alcoi: El Secret de la Tia Maria\n\nFills, per a anar a Alcoi cal anar ben esmorzats! Ací teniu el secret de l'olleta. Mongetes blanques, penques, bleda i un pessic de paciència.\n\nSóc de Poble és també això: protegir les receptes que ens fan ser qui som. Bon profit! 🍲🌳",
        likes: 1200,
        comments: 45,
        image_url: ["https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=1000"],
        type: "post",
        created_at: new Date().toISOString()
    }
];

export const MOCK_MARKET_ITEMS = [
    // Sóc de Poble (Oficial) - MAROON EDITION FIRST
    {
        id: 9991, // Maroon ID
        town_id: 1,
        title: "Camiseta Sóc de Poble - Edició Granate",
        description: "L'edició definitiva amb el Logotip Complet (Mapa del Tresor). Cotó Roly Granate 57 de màxima qualitat. #MapaDelTresor #SócDePoble",
        price: "18.00€",
        seller: "Sóc de Poble",
        avatar_url: "/assets/master/logo_socdepoble_green_square.png",
        author_role: "business",
        author_id: 'sdp-oficial-1',
        author_entity_id: 'sdp-oficial-1',
        official: true,
        pinned: true,
        images: [
            "/assets/brain/baea5793-7acf-46b1-9683-4c849ef42b5a/shirt_maroon_front_full_logo_v2_1770235736579.png",
            "/assets/brain/baea5793-7acf-46b1-9683-4c849ef42b5a/shirt_maroon_lifestyle_full_logo_v2_1770235755326.png",
            "/assets/brain/baea5793-7acf-46b1-9683-4c849ef42b5a/shirt_maroon_market_full_logo_v2_1770235769546.png",
            "/assets/brain/baea5793-7acf-46b1-9683-4c849ef42b5a/shirt_maroon_folded_full_logo_v2_1770235783687.png",
            "/assets/brain/baea5793-7acf-46b1-9683-4c849ef42b5a/shirt_maroon_flatlay_full_logo_v2_1770235798882.png",
            "/assets/brain/baea5793-7acf-46b1-9683-4c849ef42b5a/shirt_maroon_detail_full_logo_v2_1770235812705.png",
            "/assets/brain/baea5793-7acf-46b1-9683-4c849ef42b5a/shirt_maroon_action_full_logo_v2_1770235827400.png"
        ],
        category_slug: "roba",
        tag: "Merchandising",
        is_pinned: true,
        pinned_position: 1,
        created_at: new Date().toISOString()
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
        author_id: 'sdp-oficial-1',
        author_entity_id: 'sdp-oficial-1',
        images: [
            "/assets/master/logo_socdepoble_white_clean.png"
        ],
        category_slug: "roba",
        tag: "Merchandising",
        is_pinned: false,
        created_at: new Date(Date.now() - 3600000).toISOString()
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
    {
        id: 7,
        town_id: 1,
        title: "Sorra de Pedra Seca",
        description: "Materials per a la reconstrucció de marges i bancals. Servei rural de proximitat.",
        price: "45€/tona",
        seller: "Excavacions El Mas",
        avatar_url: "🚜",
        author_role: "business",
        category_slug: "serveis-rurals",
        tag: "Serveis Rurals"
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
        id: 'nano-banana-legacy',
        title: "Nano Banana Legacy",
        description: "L'arxiu històric de l'Agent Mestre que va bategar abans de ser llegenda. 🏛️🍌",
        cover: "/assets/brain/29cb42cf-ba4e-45af-a1f9-254a5b27cd7a/nanobanana_tia_style_1770057831273.png",
        count: 5,
        type: 'memory',
        images: [
            "/assets/brain/29cb42cf-ba4e-45af-a1f9-254a5b27cd7a/nanobanana_tia_style_1770057831273.png",
            "/assets/brain/29cb42cf-ba4e-45af-a1f9-254a5b27cd7a/super_ratoli_tia_style_1770057904274.png",
            "/assets/brain/29cb42cf-ba4e-45af-a1f9-254a5b27cd7a/flash_tia_style_1770057846137.png",
            "/assets/brain/29cb42cf-ba4e-45af-a1f9-254a5b27cd7a/iaia_arxiu_tia_style_1770059261040.png",
            "/assets/brain/29cb42cf-ba4e-45af-a1f9-254a5b27cd7a/iaia_mercat_tia_style_1770059284376.png"
        ]
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
    },
    {
        id: 'sollutia-item-1',
        town_id: 1,
        title: "Oli d'Oliva Verge Extra (Premiat)",
        description: "Oli de collita pròpia a Alcoi. Extracció en fred. L'or líquid de la nostra serra, ara directe al teu xat.\n\n#KM0 #Alcoi #OliVerge",
        price: "45.00€ (5L)",
        seller: "Cooperativa Agrícola Alcoi",
        avatar_url: "🍃",
        author_role: "business",
        author_entity_id: 'mock-business-alcoi-1',
        image: "https://images.unsplash.com/photo-1474979266404-7eaacabc87c5?auto=format&fit=crop&q=80&w=1000",
        category_slug: "producte-local",
        is_pinned: true,
        pinned_position: 2
    },
    {
        id: 'sollutia-item-2',
        town_id: 1,
        title: "Mel de Romaní (La Torre)",
        description: "Mel artesana collida per la Rosa. Sense pasteuritzar. Té el gust del sol i el romaní de Mariola.",
        price: "9.50€",
        seller: "Mel de la Rosa",
        avatar_url: "🐝",
        author_role: "business",
        author_entity_id: 'mock-business-torre-2',
        image: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&q=80&w=1000",
        category_slug: "producte-local"
    },
    {
        id: 'sixto-pina-agost',
        town_id: 4,
        title: "Carpintería Metálica Sixto Pina",
        description: "Mestres artesans del ferro i l'acer a Agost. Automatismes, reixes i estructures metàl·liques amb la garantia de l'ofici tradicional. Especialistes en restauració i obra nova.\n\n📍 C/ Monforte, 26 (Agost)\n📞 607 482 976\n📸 @carpinteriametalicasixto\n\n#SP #Agost #Ferro #Artesania",
        price: "Consultar",
        seller: "Sixto Pina",
        avatar_url: "/assets/master/logo_socdepoble_green_square.png", // Monograma SP
        author_role: "business",
        author_entity_id: 'sixto-pina-1',
        image: "/assets/brain/baea5793-7acf-46b1-9683-4c849ef42b5a/media__1771147521462.jpg",
        category_slug: "artesania",
        tag: "Metal·listeria SP",
        official: false,
        is_pinned: true,
        pinned_position: 1, // Pin to top for visibility check
        created_at: new Date().toISOString()
    }
];

export const MOCK_EVENTS = [
    {
        id: 301,
        town_id: 1,
        type: 'event',
        author: 'Grup de Danses',
        avatar: '💃',
        time: 'Diumenge',
        title: 'Aplec de Danses',
        content: 'Vine a ballar a la plaça major. Esmorzar popular inclòs.',
        date: '15 FEB - 10:00',
        location: 'Plaça Major',
        linkTo: "Grup de Danses",
        tags: ["Cultura", "Danses", "Tradició"]
    },
    {
        id: 302,
        town_id: 1,
        type: 'event',
        author: 'Ajuntament',
        avatar: '🏛️',
        time: 'Divendres',
        title: 'Ple Ordinari',
        content: 'Sessió oberta al públic. Ordre del dia disponible al web.',
        date: '13 FEB - 20:00',
        location: 'Saló de Plens',
        official: true,
        tags: ["Oficial", "Plens", "Ajuntament"]
    }
];

export const MOCK_TOWNS = [
    { id: 401, type: 'town', author: 'Gent de Penàguila', avatar: '🏰', time: 'Foraster', title: 'Penàguila', content: 'El jardí de l\'Alcoià. Visitau el Jardí de Santos.', population: '320 hab', linkTo: "Gent de Penàguila", image: true, image_url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1000" },
    { id: 402, type: 'town', author: 'Gent de Benifallim', avatar: '⛪', time: 'Foraster', title: 'Benifallim', content: 'Terra de castells i silenci.', population: '110 hab', linkTo: "Gent de Benifallim", image: true, image_url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=1000" },
    { id: 403, type: 'town', author: 'Gent de La Torre', avatar: '🏺', time: 'Local', title: 'La Torre de les Maçanes', content: 'Bressol del Projecte Sóc de Poble.', population: '700 hab', linkTo: "Gent de La Torre", image: true, image_url: "/assets/master/iaia_guiding_family.png" }
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

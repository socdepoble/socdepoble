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
    ]
};

export const MOCK_FEED = [
    // 📚 Sóc de Poble: El Llibre (Projecte Lliure) - NUEVA PUBLICACIÓN JAVI LLINARES
    {
        id: 'llibre-soc-de-poble-oficial',
        town_id: 1,
        author: "Javi Llinares (Project Lead)",
        author_avatar: "https://xbgispxqdqclonvshfjk.supabase.co/storage/v1/object/public/avatars/javi_avatar.png",
        author_role: "official",
        author_entity_id: 'javi-sa-1',
        time: "Ara",
        content: "# 📚 Sóc de Poble: El Llibre (Projecte Lliure)\n\n## Per Javi Llinares\n\nAvui faig oficial un dels somnis d'aquest projecte: **el llibre de Sóc de Poble**. Més de 200 pàgines que documenten aquest viatge des de les arrels fins a l'arquitectura més avançada.\n\nNo és només un manual, és una declaració de principis sobre com la tecnologia (IA, CRDTs, Xarxa Arrel) ha d'estar al servei de la comunitat rural. Un projecte que neix lliure, sota llicència **Creative Commons**, perquè el coneixement bategui sense barreres.\n\n**Explora la infografia per a descobrir l'estructura d'aquesta Masia Tècnica que estem construint junts.** 📖🛡️⚖️",
        likes: 850,
        comments: 64,
        image_url: ["/images/infografies/llibre_soc_de_poble_infografia.jpg"],
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
        author: "Javi Llinares (Super Admin)",
        author_avatar: "https://xbgispxqdqclonvshfjk.supabase.co/storage/v1/object/public/avatars/javi_avatar.png",
        author_role: "official",
        author_entity_id: 'javi-sa-1',
        time: "Ara",
        content: "# 📖 Guia de Convivència Digital: Sóc de Poble\n\n## Per Javi Llinares\n\nJa tenim ací la brúixola definitiva per a navegar per la nostra plaça digital. Aquesta guia resumeix tot el que hem construït en la versió **v1.5.4-Genius-Absolut**.\n\nDes de les **Ancores Semàntiques** fins a la **Resiliència de la Llibreta Compartida**. És la nostra carta magna per a treballar amb sentit, trellat i identitat.\n\n**Explora la imatge per a entendre com bateguem junts en aquesta xarxa que neix de la terra.** 🛡️🏘️✨",
        likes: 520,
        comments: 45,
        image_url: ["/images/infografies/guia_convivencia_digital.jpg"],
        type: "didactic_presentation",
        metadata: {
            title: "Guia de Convivència Digital",
            didactic_text: "Aquesta infografia visualitza els conceptes clau de Sóc de Poble: Funcions Estables vs Proves, el protocol [Master] i el sistema resilient CRDT. És el resum visual del manual didàctic.",
        },
        created_at: new Date().toISOString()
    },
    // L'Evolució de Sóc de Poble - Infografia per Javi Llinares
    {
        id: 'infografia-evolucio',
        town_id: 1,
        author: "Javi Llinares (Super Admin)",
        author_avatar: "https://xbgispxqdqclonvshfjk.supabase.co/storage/v1/object/public/avatars/javi_avatar.png",
        author_role: "official",
        author_entity_id: 'javi-sa-1',
        time: "Ara",
        content: "# 🚀 L'Evolució de Sóc de Poble: De la Visió a l'Arquitectura Intel·ligent\n\n## Per Javi Llinares\n\nAquesta segona infografia mostra el viatge que estem recorrent junts. Des de la llavor de la idea original fins al **Llenguatge de l'IAIA** i la **Rhizome DB**.\n\nEstem construint una estructura que no viu al núvol, sinó a cada poble (Cellular Network), garantint que som amos de les nostres dades fins i tot sense internet.\n\n*\"No parles a la màquina, programa-la amb la teua estructura d'arxius\"*. És el nostre mantra per a col·laborar amb la IA de forma efectiva i amb trellat! 👵✨⚖️",
        likes: 312,
        comments: 24,
        image_url: ["/images/infografies/evolucio_soc_de_poble.jpg"],
        type: "didactic_presentation",
        metadata: {
            title: "L'Evolució de l'Arquitectura",
            didactic_text: "Aquesta peça detalla la nova Estratègia Semàntica. L'IAIA ordena el safareig útil amb àncores semàntiques [Master] i [Context], creant una base de veritat absoluta per a l'IA.",
        },
        created_at: new Date().toISOString()
    },
    // Javi Llinares - Trajectòria Professional
    {
        id: 'javi-trajectoria',
        town_id: 1,
        author: "Javi Llinares (Perfil Professional)",
        author_avatar: "https://xbgispxqdqclonvshfjk.supabase.co/storage/v1/object/public/avatars/javi_avatar.png",
        author_role: "official",
        author_entity_id: 'javi-sa-1',
        time: "30min",
        content: "# 📺 30 Anys de Disseny, TV i Innovació\n\n## Per Javi Llinares\n\nDes de les primeres infografies per a Canal 9 fins a la direcció d'art en projectes internacionals, la meua passió sempre ha sigut la mateixa: **comunicar amb sentit**. \n\nHe treballat en el disseny de grans xarxes de televisió i ara aplico tota eixa experiència per a crear una tecnologia que bategue des dels nostres pobles. Sóc de Poble és la culminació d'aquesta trajectòria: el retorn a les arrels amb les eines del futur. 🛡️🏘️",
        likes: 450,
        comments: 32,
        image_url: ["https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=2070&auto=format&fit=crop"],
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
        image_url: ["/images/infografies/la_xarxa_neix_de_la_terra.jpg"],
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
        image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=2070&auto=format&fit=crop",
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
        image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=2069&auto=format&fit=crop",
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

export const ENABLE_MOCKS = true;

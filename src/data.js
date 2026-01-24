export const MOCK_CHATS = [
    { id: 1, name: "Ajuntament de Cocentaina", message: "Bon dia! Recordeu que hui hi ha mercat al Pla", time: "10:30", type: "gov", unread: 2, avatar_url: "🏛️" },
    { id: 2, name: "Forn de Muro", message: "Ja tenim les coques de xulla calentes!", time: "09:15", type: "shop", unread: 0, avatar_url: "🥖" },
    { id: 3, name: "Centre Excursionista d'Alcoi", message: "Què vos pareix pujar al Montcabrer el diumenge?", time: "Ahir", type: "group", unread: 5, avatar_url: "🏔️" },
    { id: 4, name: "Cooperativa de Muro", message: "Iniciem la recollida de l'oliva demà", time: "Ahir", type: "coop", unread: 0, avatar_url: "🫒" },
    { id: 5, name: "Vicent (Fuster del Barri)", message: "Et passe ara mateix la foto del moble", time: "Dimarts", type: "shop", unread: 0, avatar_url: "🪵" },
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
    ]
};

export const MOCK_FEED = [
    // La Torre de les Maçanes
    {
        id: 10,
        town_id: 1,
        author: "Ajuntament de la Torre de les Maçanes",
        author_avatar: "/images/demo/avatar_man_old.png",
        author_role: "official",
        author_entity_id: 'mock-official-1',
        time: "1h",
        content: "🍎 Recordeu que aquest cap de setmana tenim la collita de la poma local. Passeu per la plaça a tastar-les!",
        likes: 42,
        comments: 5,
        image: "/images/assets/apples_premium.png"
    },
    {
        id: 11,
        town_id: 1,
        author: "Pa de la Torre de les Maçanes",
        author_avatar: "/images/demo/avatar_woman_old.png",
        author_role: "business",
        author_entity_id: 'mock-business-1',
        time: "3h",
        content: "Acaben d'eixir els pans de llenya. Tradició pura cada matí!",
        likes: 28,
        comments: 2,
        image: "/images/assets/coques_premium.png"
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
        image: "/images/assets/tomates_premium.png" // Reused asset
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
        image: "/images/assets/generic_market.png"
    }
];

export const MOCK_MARKET_ITEMS = [
    // La Torre
    {
        id: 5,
        town_id: 1,
        title: "Pomes de la Torre (caixa 5kg)",
        price: "12.00€",
        seller: "Cooperativa de la Torre",
        avatar_url: "/images/demo/avatar_man_1.png",
        author_role: "business",
        author_entity_id: 'mock-business-torre-1',
        image: "/images/assets/apples_premium.png",
        tag: "Alimentació"
    },
    {
        id: 6,
        town_id: 1,
        title: "Cistella de vímet artesana",
        price: "35.00€",
        seller: "Artesanies de la Torre",
        avatar_url: "/images/demo/avatar_beatriz.png",
        author_role: "business",
        author_entity_id: 'mock-business-torre-2',
        image: "/images/assets/generic_market.png",
        tag: "Artesania"
    },
    // Cocentaina
    {
        id: 1,
        town_id: 2,
        title: "Pericana de Cocentaina",
        price: "6.50€ / pot",
        seller: "Sabors del Comtat",
        avatar_url: "/images/demo/avatar_lucia.png",
        author_role: "business",
        author_entity_id: 'mock-business-cocentaina-1',
        image: "/images/assets/tomates_premium.png",
        tag: "Tradició"
    },
    {
        id: 2,
        town_id: 2,
        title: "Herbero de la Mariola",
        price: "14.00€ / botella",
        seller: "Destil·leries de la Serra",
        avatar_url: "/images/demo/avatar_joanet.png",
        author_role: "business",
        author_entity_id: 'mock-business-cocentaina-2',
        image: "/images/assets/generic_market.png",
        tag: "Artesania"
    },
    // Muro
    {
        id: 4,
        town_id: 3,
        title: "Coques de xulla (4 pack)",
        price: "5.00€",
        seller: "Forn de Muro",
        avatar_url: "/images/demo/avatar_marc.png",
        author_role: "business",
        author_entity_id: 'mock-business-muro-1',
        image: "/images/assets/coques_premium.png",
        tag: "Producte Local"
    },
    {
        id: 3,
        town_id: 3,
        title: "Mel de la Font Roja",
        price: "9.00€ / pot",
        seller: "Abelles Mariola",
        avatar_url: "/images/demo/avatar_woman_1.png",
        author_role: "business",
        author_entity_id: 'mock-business-muro-2',
        image: "/images/assets/mel.png",
        tag: "Alimentació"
    }
];

export const ENABLE_MOCKS = true;

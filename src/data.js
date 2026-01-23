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
        town_id: 1, // La Torre de les Maçanes
        author: "Ajuntament de la Torre de les Maçanes",
        avatarType: "gov",
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
        avatarType: "shop",
        time: "3h",
        content: "Acaben d'eixir els pans de llenya. Tradició pura cada matí!",
        likes: 28,
        comments: 2,
        image: "/images/assets/coques_premium.png"
    },
    // Cocentaina
    {
        id: 1,
        town_id: 2, // Cocentaina
        author: "Ajuntament de Cocentaina",
        avatarType: "gov",
        time: "2h",
        content: "🏰 Ja estem preparant la Fira de Tots Sants! Enguany tindrem novetat a la zona del Palau. Estigueu atents!",
        likes: 156,
        comments: 34,
        image: "/images/assets/palau_cocentaina.png"
    },
    // Muro d'Alcoi
    {
        id: 2,
        town_id: 3, // Muro d'Alcoi
        author: "Cooperativa de Muro",
        avatarType: "coop",
        time: "5h",
        content: "🫒 Ja tenim l'oli nou de la serra Mariola! Passa per la Cooperativa a per la teua garrafa. Or líquid de casa!",
        likes: 92,
        comments: 15,
        image: "/images/assets/oli_premium.png"
    },
    {
        id: 3,
        author: "Centre Excursionista d'Alcoi",
        avatarType: "group",
        time: "1d",
        content: "Fotos de la ruta de diumenge passat pel Barranc de l'Infern. Una experiència brutal amb gent de toda la comarca! 🏔️",
        likes: 210,
        comments: 12,
        image: "/images/assets/senderisme_aitana.png"
    }
];

export const MOCK_MARKET_ITEMS = [
    // La Torre de les Maçanes
    {
        id: 10,
        town_id: 1,
        title: "Mel de la Torre de les Maçanes (Artesana)",
        price: "12.00€",
        seller: "Apicultura les Maçanes",
        image: "/images/assets/mel_premium.png",
        tag: "Alimentació"
    },
    {
        id: 11,
        town_id: 1,
        title: "Càntir Tradicional",
        price: "15.00€",
        seller: "Artesania de la Torre de les Maçanes",
        image: "/images/assets/cantir_premium.png",
        tag: "Artesania"
    },
    // Cocentaina
    {
        id: 1,
        town_id: 2,
        title: "Pericana de Cocentaina",
        price: "6.50€ / pot",
        seller: "Sabors del Comtat",
        image: "/images/assets/tomates_premium.png",
        tag: "Tradició"
    },
    {
        id: 2,
        title: "Herbero de la Mariola",
        price: "14.00€ / botella",
        seller: "Destil·leries de la Serra",
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
        image: "/images/assets/coques_premium.png",
        tag: "Producte Local"
    },
    {
        id: 3,
        title: "Mel de la Font Roja",
        price: "9.00€ / pot",
        seller: "Abelles Mariola",
        image: "/images/assets/mel.png",
        tag: "Alimentació"
    }
];

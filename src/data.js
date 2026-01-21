export const MOCK_CHATS = [
    { id: 1, name: "Ajuntament de Cocentaina", message: "Bon dia! Recordeu que hui hi ha mercat al Pla", time: "10:30", type: "gov", unread: 2 },
    { id: 2, name: "Forn de Muro", message: "Ja tenim les coques de xulla calentes!", time: "09:15", type: "shop", unread: 0 },
    { id: 3, name: "Centre Excursionista d'Alcoi", message: "Què vos pareix pujar al Montcabrer el diumenge?", time: "Ahir", type: "group", unread: 5 },
    { id: 4, name: "Cooperativa de Muro", message: "Iniciem la recollida de l'oliva demà", time: "Ahir", type: "coop", unread: 0 },
    { id: 5, name: "Vicent (Fuster del Barri)", message: "Et passe ara mateix la foto del moble", time: "Dimarts", type: "shop", unread: 0 },
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
    {
        id: 1,
        author: "Ajuntament de Cocentaina",
        avatarType: "gov",
        time: "2h",
        content: "🏰 Ja estem preparant la Fira de Tots Sants! Enguany tindrem novetat a la zona del Palau. Estigueu atents!",
        likes: 156,
        comments: 34,
        image: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: 2,
        author: "Cooperativa de Muro",
        avatarType: "coop",
        time: "5h",
        content: "🫒 Ja tenim l'oli nou de la serra Mariola! Passa per la Cooperativa a per la teua garrafa. Or líquid de casa!",
        likes: 92,
        comments: 15,
        image: "https://images.unsplash.com/photo-1474979266404-7eaacbcdcc4c?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: 3,
        author: "Centre Excursionista d'Alcoi",
        avatarType: "group",
        time: "1d",
        content: "Fotos de la ruta de diumenge passat pel Barranc de l'Infern. Una experiència brutal amb gent de tota la comarca! 🏔️",
        likes: 210,
        comments: 12,
        image: "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&q=80&w=800"
    }
];

export const MOCK_MARKET_ITEMS = [
    {
        id: 1,
        title: "Pericana de Cocentaina",
        price: "6.50€ / pot",
        seller: "Sabors del Comtat",
        image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=800",
        tag: "Tradició"
    },
    {
        id: 2,
        title: "Herbero de la Mariola",
        price: "14.00€ / botella",
        seller: "Destil·leries de la Serra",
        image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800",
        tag: "Artesania"
    },
    {
        id: 3,
        title: "Mel de la Font Roja",
        price: "9.00€ / pot",
        seller: "Abelles Mariola",
        image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=800",
        tag: "Frescos"
    },
    {
        id: 4,
        title: "Coques de xulla (4 pack)",
        price: "5.00€",
        seller: "Forn de Muro",
        image: "https://images.unsplash.com/photo-1540933655514-e2233da631fa?auto=format&fit=crop&q=80&w=800",
        tag: "Producte Local"
    }
];

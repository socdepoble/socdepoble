export const MOCK_CHATS = [
    { id: 1, name: "Alcaldia (Pere)", message: "Ja tenim data per la reunió del polígon", time: "10:30", type: "gov", unread: 2 },
    { id: 2, name: "Maria Panadera", message: "Avui tenim pa de llenya acabat de fer!", time: "09:15", type: "shop", unread: 0 },
    { id: 3, name: "Grup Excursionista", message: "Ruta diumenge cap a la Font Roja?", time: "Ahir", type: "group", unread: 5 },
    { id: 4, name: "Cooperativa", message: "Resultats de la campanya d'ametlla", time: "Ahir", type: "coop", unread: 0 },
    { id: 5, name: "Josep (Fuster)", message: "Tinc el pressupost de la porta", time: "Dimarts", type: "shop", unread: 0 },
];

export const MOCK_MESSAGES = {
    1: [
        { id: 1, text: "Bon dia a tothom!", sender: "other", time: "09:00" },
        { id: 2, text: "Ja tenim data per la reunió del polígon industrial.", sender: "other", time: "10:30" },
        { id: 3, text: "Serà el proper dimecres a les 19h al centre cultural.", sender: "other", time: "10:31" },
    ],
    2: [
        { id: 1, text: "Bon dia veïns!", sender: "other", time: "08:15" },
        { id: 2, text: "Avui tenim pa de llenya acabat de fer! I coques de sucre.", sender: "other", time: "09:15" },
    ],
    3: [
        { id: 1, text: "Ruta diumenge cap a la Font Roja?", sender: "other", time: "Ahir" },
    ],
    4: [
        { id: 1, text: "Resultats de la campanya d'ametlla disponibles a la web.", sender: "other", time: "Ahir" },
    ],
    5: [
        { id: 1, text: "Hola, com va això?", sender: "me", time: "Dilluns" },
        { id: 2, text: "Tinc el pressupost de la porta preparat.", sender: "other", time: "Dimarts" },
    ]
};

export const MOCK_FEED = [
    {
        id: 1,
        author: "Ajuntament de Benicarló",
        avatarType: "gov",
        time: "2h",
        content: "📢 Avís important: Tall d'aigua programat per demà al carrer Major de 09:00 a 14:00 per manteniment.",
        likes: 45,
        comments: 12,
        image: null
    },
    {
        id: 2,
        author: "Cooperativa Agrícola",
        avatarType: "coop",
        time: "5h",
        content: "Ja tenim aquí l'oli nou! 🫒 Passeu a provar-lo per la tenda.",
        likes: 89,
        comments: 24,
        image: "https://images.unsplash.com/photo-1474979266404-7eaacbcdcc4c?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: 3,
        author: "Grup Excursionista",
        avatarType: "group",
        time: "1d",
        content: "Fotos de la sortida d'ahir al Montcamp. Gràcies a tots per venir! 🏔️",
        likes: 124,
        comments: 8,
        image: "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&q=80&w=800"
    }
];

export const MOCK_MARKET_ITEMS = [
    {
        id: 1,
        title: "Tomates de penjar",
        price: "3.50€ / kg",
        seller: "Hort del Tio Pep",
        image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=800",
        tag: "Frescos"
    },
    {
        id: 2,
        title: "Formatge de cabra artesà",
        price: "12.00€ / peça",
        seller: "Formatgeria la Vall",
        image: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&q=80&w=800",
        tag: "Artesania"
    },
    {
        id: 3,
        title: "Mel de romaní",
        price: "8.00€ / pot",
        seller: "Abelles de la Serra",
        image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=800",
        tag: "Conserves"
    },
    {
        id: 4,
        title: "Cistella de verdures setmanal",
        price: "15.00€",
        seller: "Cooperativa Agrícola",
        image: "https://images.unsplash.com/photo-1540933655514-e2233da631fa?auto=format&fit=crop&q=80&w=800",
        tag: "Frescos"
    }
];

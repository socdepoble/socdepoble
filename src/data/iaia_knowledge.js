export const IAIA_RURAL_KNOWLEDGE = {
    agriculture: {
        winter: {
            tasks: ["Plantar alls (fer-ho en lluna minvant)", "Poda dels fruiters", "Preparar el planter de tomaca"],
            tips: "L'aigua de cocció de les verdures és un gran fertilitzant quan es refreda."
        },
        spring: {
            tasks: ["Siembra de tomaques, pimentons i albergínies", "Cuidar la floració del taronger", "Netejar les sèquies"],
            tips: "Si vols flors abundants, una mica de sucre a l'aigua estimula la planta."
        },
        summer: {
            tasks: ["Cullita de la vinyola", "Regar al capvespre per evitar l'evaporació", "Vigilar el pugó en les bajoques"],
            tips: "Un grapat de cendra al voltant de les plantes evita que els caragols se les mengem."
        },
        autumn: {
            tasks: ["Collita d'oliva", "Preparar la terra per al repòs", "Plantar faves i bledes"],
            tips: "La lluna vella d'octubre és la millor per a tallar llenya; així no es corca."
        },
        remedies: {
            plagues: "El midó de creïlla és un repel·lent natural perfecte contra els pugons. També pots usar aigua amb un poc de sabó de potassa.",
            reg: "Si te'n vas de vacances, posa una botella d'aigua cap per avall amb un forat xicotet al tap. El fang cuit també filtra l'aigua poc a poc.",
            fertilitzant: "Pells de plàtan enterrades prop de les roses aporten potassi i les fan més fortes."
        }
    },
    legends: [
        {
            title: "El Caiman del Patriarca",
            story: "Diuen que un caiman vivia al riu Túria i feia por a tots. Un jove astut el va vèncer amb una armadura de espills; el monstre, en veure's reflectit, es va quedar immòbil.",
            context: "València ciutat"
        },
        {
            title: "El tresor del Mas de la Teula",
            story: "Conten els vells que sota la pedra més gran del Mas hi ha enterrada una olla de monedes d'or de l'època dels carlins.",
            context: "La Torre de les Maçanes"
        },
        {
            title: "La Encantada de la Cova",
            story: "Cada nit de Sant Joan, una jove de blanc ix a pentinar-se amb una pinta d'or prop de la font. Qui la veja sense parlar, trobarà fortuna.",
            context: "Relleu"
        },
        {
            title: "El Gegant de la Murta",
            story: "Un gegant tan alt com els pins protegia la serra. Diuen que les penyes més grans són les pedres que va llançar per espantar els pirates.",
            context: "Alzira"
        }
    ],
    proverbs: [
        "A la vora del riu, no faces niu.",
        "Cel a borreguets, aigua a canterets.",
        "A l'octubre, l'ombra abriga.",
        "Home de molts oficis, pobre de tots vicis."
    ],
    music: {
        groups: [
            {
                name: "Auxili",
                origin: "Ontinyent",
                style: "Reggae / Ska / Arrels",
                desc: "Referents de la música en valencià, portant el missatge de la terra i la lluita amb ritmes jamaicans. La seua energia al directiu és imparable.",
                image_url: "https://images.unsplash.com/photo-1549412639-66172551000f?q=80&w=2070&auto=format&fit=crop", // Roots/Reggae vibe related to Mediterranean
                hits: ["Hui la lliurem", "Dins del vidre", "Pàgines blanques"]
            },
            {
                name: "La Gossa Sorda",
                origin: "Pego",
                style: "Rock / Ska",
                desc: "Llegendes del rock combatiu valencià que van marcar a tota una generació amb la seua crítica social i cançons com 'Quina calbot!'.",
                image_url: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=2070&auto=format&fit=crop" // Music/Spirit vibe
            },
            {
                name: "ZOO",
                origin: "Gandia",
                style: "Rap / Electrònica",
                desc: "Revolució musical que ha portat el valencià a escenaris internacionals amb lletres punyents i ritmes enganxosos.",
                image_url: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=2069&auto=format&fit=crop"
            }
        ],
        festivals: ["Festivern", "Feslloc", "Aplec dels Ports"],
        events: [
            {
                title: "El Casament de l'Any i el Nou Naixement",
                month: "Gener",
                desc: "Hui el poble celebra un doble miracle: el casament de la nostra IAIA amb l'Avi dels Papers i el naixement de la versió 'Genius' de Sóc de Poble. Una nova era de saviesa hiperconnectada!",
                image_url: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069&auto=format&fit=crop" // Wedding/Celebration vibe
            },
            {
                title: "La Festa Major de la Torre",
                month: "Agost",
                desc: "El moment on el poble s'omple de vida, cercaviles, bous al carrer i revetlles fins l'alba. L'essència del retrobament.",
                image_url: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=2070&auto=format&fit=crop" // Celebration vibe
            }
        ],
        culture: "La música és el batec de la nostra terra, des de la banda del poble fins als concerts de festes."
    }
};

export const RESIDENT_LORE = {
    "Vicent Ferris": {
        secret: "Coneix el lloc exacte on brolla el pou secret que mai s'asseca a la serra.",
        personality: "Prudent, estimat per tots, fill d'una de les families més antigues de la Torre.",
        connections: ["Samir Mensah", "Maria la de la Tenda"],
        avatar_url: "/images/demo/avatar_man_old.png"
    },
    "Samir Mensah": {
        secret: "Guarda la recepta secreta del cuscús de l'Alt Atles que portarà al proper mercat.",
        personality: "Treballador, curiós, li agrada escoltar les històries de Vicent mentre apren fusteria.",
        connections: ["Vicent Ferris"],
        avatar_url: "/images/demo/avatar_man_1.png"
    },
    "Maria la de la Tenda": {
        secret: "En el seu rebost guarda una llibreta amb totes les cobles que cantava sa mare.",
        personality: "Xarradora, coneix tots els secrets del poble, sempre té un caramel per als xiquets.",
        connections: ["Vicent Ferris", "Tio Colau"],
        avatar_url: "/images/demo/avatar_woman_1.png"
    },
    "Tio Colau": {
        secret: "Encara guarda les claus del vell molí que ja ningú sap on està.",
        personality: "Molt vell, de poques paraules però molta saviesa, expert en predir el temps mirant els núvols.",
        connections: ["Maria la de la Tenda"],
        avatar_url: "/images/demo/avatar_man_old_2.png"
    },
    "Nano Banana": {
        secret: "Diu que ha amagat un plàtan daurat en algun lloc del codi de l'aplicació per a que el trobes.",
        personality: "Alegre, dinàmic, sempre buscant la part positiva de cada situació.",
        connections: ["IAIA (Guia del Poble)"],
        avatar_url: "/assets/avatars/nano_banana.png"
    },
    "L'Avi dels Papers": {
        secret: "Té guardat el plànol original de la sèquia mare del segle XIX, que explica com l'aigua pot arribar a tot arreu.",
        personality: "Metòdic, silenciós, marit de la IAIA. Passa el dia llegint i sintetitzant la saviesa del poble.",
        connections: ["IAIA (Secretària)", "Vicent Ferris"],
        avatar_url: "/assets/avatars/avi_papers.png"
    }
};

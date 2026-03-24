const fs = require('fs');
const path = require('path');

const dataFile = path.join(__dirname, 'src', 'data.js');
let dataContent = fs.readFileSync(dataFile, 'utf-8');

// Replace items in MOCK_MARKET_ITEMS
const updatedMarketArray = `export const MOCK_MARKET_ITEMS = [
  {
    id: "mel-muntanya-1",
    town_id: 1,
    title: "Mel de Muntanya (La Torre)",
    post_subtitle: "Pura artesania de la terra",
    content: "Mel 100% natural recol·lectada a les serres de la Torre de les Maçanes. Pura artesania de la terra, sense additius ni conservants. Un pot ple de l'autèntic sabor de la muntanya alacantina viva i resistent. Sabor fort i color ambre intens.",
    price: "8.50€",
    seller: "Rosa (Mel de la Torre)",
    author_name: "IAIA MarIA",
    avatar_url: "/assets/avatars/iaia_maria_avatar.png",
    author_role: "agent",
    author_id: "11111111-1a1a-0000-0000-000000000000",
    author_entity_id: "11111111-1a1a-0000-0000-000000000000",
    official: true,
    images: ["/assets/brain/generations/nano_mel_muntanya_1774198107481.png"],
    category_slug: "producte-local",
    lat: 38.5583,
    lng: -0.4223,
    created_at: "2026-03-21T09:45:00.000Z",
  },
  {
    id: "oli-verge-1",
    town_id: 1,
    title: "Oli d'Oliva Verge Extra (5L)",
    post_subtitle: "Primera premsada en fred 100% autèntic",
    content: "Oli d'oliva verge extra de primera premsada en fred. Les olives de secà de la Torre, collides a mà el mes de novembre, retenen l'aroma verd i un picant fi en gola irrepetible. Garrafa de 5 litres ideal per a passar l'any amb energia.",
    price: "45.00€",
    seller: "Sabors del Comtat",
    author_name: "Tia Maria",
    avatar_url: "/assets/avatars/tia_maria_avatar.png",
    author_role: "agent",
    author_id: "22222222-2222-2222-2222-222222222222",
    author_entity_id: "22222222-2222-2222-2222-222222222222",
    official: true,
    images: ["/assets/brain/generations/nano_oli_oliva_1774198089084.png"],
    category_slug: "producte-local",
    lat: 38.6504,
    lng: -0.4628,
    created_at: "2026-03-20T16:20:00.000Z",
  },
  {
    id: 9991,
    town_id: 1,
    title: "Camiseta Sóc de Poble - Edició Granate",
    post_subtitle: "Edició Llimitada 'Mapa del Tresor'",
    content: "L'edició definitiva amb el Logotip Complet (Mapa del Tresor) a la pitrera. Cotó Roly Granate 57 de màxima qualitat. Només se n'han fetut 100 unitats, així que agarra la teua abans que Nano Banana decidisca furtar-les totes per l'horta.",
    price: "18.00€",
    seller: "Sóc de Poble",
    author_name: "Sóc de Poble (Oficial)",
    avatar_url: "/assets/master/logo_socdepoble_green_square.png",
    author_role: "official",
    author_id: "11111111-1111-4111-a111-000000000009",
    author_entity_id: "11111111-1a1a-0000-0000-000000000000",
    official: true,
    pinned: true,
    images: [
      "/assets/master/samarreta-soc-de-poble.png",
      "/assets/master/camiseta_nano_oficial.jpg",
      "/assets/master/camiseta_nano_detall.png",
    ],
    category_slug: "roba",
    tag: "Merchandising",
    is_pinned: true,
    pinned_position: 1,
    lat: 38.5582,
    lng: -0.4413,
    created_at: "2026-03-22T22:33:00.000Z",
  },
  {
    id: 999,
    town_id: 1,
    title: "Camiseta Oficial (Clàssica)",
    post_subtitle: "La samarreta blanca original iconica",
    content: "La samarreta blanca original amb el text sketch, clàssic atemporal que funciona tan bé a les festes del poble com collint olives. Simplicitat i identitat en cada fil per portar la revolució del pobill a onsevulla que vages.",
    price: "15.00€",
    seller: "Sóc de Poble",
    author_name: "IAIA MarIA",
    avatar_url: "/assets/avatars/iaia_maria_avatar.png",
    author_role: "agent",
    author_id: "sdp-oficial-1",
    author_entity_id: "11111111-1a1a-0000-0000-000000000000",
    images: ["/assets/master/logo_socdepoble_white_clean.png"],
    category_slug: "roba",
    tag: "Merchandising",
    is_pinned: false,
    lat: 38.5805,
    lng: -0.3924,
    created_at: "2026-03-15T10:15:00.000Z",
    tags: ["#merchandising","#poble"],
    town_name: "Benifallim",
  },
  {
    id: 5,
    town_id: 1,
    title: "Pomes de la Torre (caixa 5kg)",
    post_subtitle: "Cruixents directes de l'arbre a casa",
    content: "Caixa de 5kg de pomes fresques collides manualment ahir de matí a la Cooperativa de la Torre. Qualitat premium de muntanya. Una mossegada i notaràs la diferència amb la fruita de plàstic del supermercat.",
    price: "12.00€",
    seller: "Cooperativa de la Torre",
    author_name: "Nano Banana",
    avatar_url: "/assets/avatars/nano_banana_avatar.png",
    author_role: "agent",
    author_entity_id: "11111111-1111-4111-a111-000000000007",
    image: "/images/assets/apples_premium.png",
    category_slug: "producte-local",
    tag: "Alimentació",
    lat: 38.6237,
    lng: -0.4018,
    created_at: "2026-03-18T08:30:00.000Z",
    tags: ["#fruita","#poble"],
    town_name: "Tibi",
  },
  {
    id: 6,
    town_id: 1,
    title: "Taula de centre en olivera massissa",
    post_subtitle: "Art funcional en fusta noble local",
    content: "Taula de centre única, feta a mà pel fuster Vicent Ferris amb fusta d'olivera local caiguda en temporal. L'acabat és completament natural amb olis protectors per a un aspecte mat. Porta l'ànima del bosc a la teua saleta.",
    price: "180€",
    image: "/assets/brain/generations/mel_nano_v2.png",
    seller: "Vicent Ferris",
    author_name: "El Cronista",
    avatar_url: "/assets/avatars/cronista_avatar.png",
    author_role: "agent",
    author_entity_id: "33333333-3333-3333-3333-333333333333",
    category_slug: "artesania",
    tag: "Artesania",
    lat: 38.5938,
    lng: -0.4550,
    created_at: "2026-03-17T11:00:00.000Z",
    tags: ["#artesania","#fusta"],
    town_name: "Sella",
  },
  {
    id: 7,
    town_id: 1,
    title: "Sorra i pedres de Pedra Seca",
    post_subtitle: "Rebrotant el marge caigut, un art dur",
    content: "Materials perfectes per a la reconstrucció de marges i bancals ensorrats després de la pluja. Transport i col·locació rústica amb camió bolquet xicotet. No perdes la terrassa que els teus iaios van construir a pols.",
    price: "45€/tona",
    seller: "Excavacions El Mas",
    author_name: "Nano Banana",
    avatar_url: "/assets/avatars/nano_banana_avatar.png",
    author_role: "agent",
    category_slug: "serveis-rurals",
    tag: "Serveis Rurals",
    image: "/assets/brain/generations/nano_pedra_seca_notext_1774284571231.png",
    lat: 38.5888,
    lng: -0.3844,
    created_at: "2026-03-16T07:15:00.000Z",
    author_entity_id: "11111111-1111-4111-a111-000000000007",
    tags: ["#arquitectura","#poble"],
    town_name: "Xixona",
  },
  {
    id: 10,
    town_id: 2,
    title: "Pericana autèntica de Cocentaina",
    post_subtitle: "El pot de la tradició picant intacta",
    content: "L'esmorzar per antonomàsia de les nostres terres. Elaborada amb pimentó sec, all intens, oli d'oliva i capellà trencat a grapats. El veritable foc comarcal per acompanyar un bon tros de pa torrat de matí.",
    price: "9.50€",
    seller: "La Fira",
    author_name: "Tia Maria",
    avatar_url: "/assets/avatars/tia_maria_avatar.png",
    author_role: "agent",
    image: "/images/assets/pimenton.png",
    category_slug: "producte-local",
    tag: "Rebost",
    lat: 38.7424,
    lng: -0.4398,
    created_at: "2026-03-19T10:00:00.000Z",
    author_entity_id: "22222222-2222-2222-2222-222222222222",
    tags: ["#alimentacio","#poble"],
    town_name: "Beniarrés",
  }
];`;

dataContent = dataContent.replace(/export const MOCK_MARKET_ITEMS = \[\s*[\s\S]*?\n\];/m, updatedMarketArray);

// Fix authors in MOCK_FEED
const agentAuthors = [
    { name: "IAIA MarIA", id: "11111111-1a1a-0000-0000-000000000000" },
    { name: "Nano Banana", id: "11111111-1111-4111-a111-000000000007" },
    { name: "El Cronista", id: "33333333-3333-3333-3333-333333333333" },
    { name: "Tia Maria", id: "22222222-2222-2222-2222-222222222222" }
];

let currentIndex = 0;
dataContent = dataContent.replace(/author_name:\s*"([^"]+)",?\s*\n(\s*)tags:/g, (match, authorName, space) => {
    // Override standard "Joan", "Paco", etc with Agents
    if (authorName.includes("Andreu") || authorName.includes("Joan") || authorName.includes("Elena") || authorName.includes("Marc") || authorName.includes("Pep")) {
        const agent = agentAuthors[currentIndex % agentAuthors.length];
        currentIndex++;
        return `author_name: "${agent.name}",
${space}author_entity_id: "${agent.id}",
${space}tags:`;
    }
    return match;
});

// Fix incomplete feed items by filling post_subtitle and content if they look empty.
dataContent = dataContent.replace(/post_subtitle:\s*"Cròniques i ecos de la comarca"([^]*?)content:\s*"Text per defecte[^"]*"/g, (match, middle) => {
    return `post_subtitle: "Ecos del dia al cor del poble" ${middle} content: "Hui ens han arribat rumors per les places i carrers on es nota l'activitat incansable d'aquells que no es rendeixen. Toca fer pinya, i recolzar iniciatives que no ens deixen per darrere. Ens veiem a l'hort!"`;
});

fs.writeFileSync(dataFile, dataContent);
console.log("data.js rewritten and purged with true IAIA entities and full mock text!");

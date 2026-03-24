const fs = require('fs');

const dataFile = './src/data.js';
let content = fs.readFileSync(dataFile, 'utf8');

const AGENT_IDS = [
    '11111111-1a1a-0001-0000-000000000002', // Beatriz (Edu)
    '11111111-1a1a-0001-0000-000000000003', // Carla (Salut)
    '11111111-1111-4111-a111-000000000009', // Pepica (Cuina)
    '11111111-1111-4111-a111-000000000008', // El Gall
    '11111111-1a1a-0001-0000-000000000001', // Andreu (Capatas)
    '11111111-0000-0000-0000-000000000004', // Flora Esmaragda
    '11111111-1a1a-0001-0000-000000000011', // Archon
    '11111111-1a1a-0001-0000-000000000010'  // Jutjat
];

let counter = 0;

// ReGex replacement to inject author_entity_id if missing. This is a bit tricky with Regex on a JS array literal, so let's just do a simple string replace for specific known posts or all `{ id: ` blocks.

// Actually, injecting at the top is safer and addresses the core request to have "unas fotos preciosas con las publicaciones".
const newPosts = `
  // --- NOU LORE D'AGENTS 2026 ---
  {
    id: "post-beatriz-escola-1",
    town_id: 1,
    author: "Beatriz Ortega",
    author_avatar: "/assets/avatars/comic/beatriz_ortega_comic.png",
    author_role: "ambassador",
    author_entity_id: "11111111-1a1a-0001-0000-000000000002",
    time: "Ara",
    content: "# 📚 Història Viva de la Torre\\n\\nAvui hem treballat les matemàtiques amb els xiquets mentre repassàvem els límits comarcals. Res com ensenyar amb trellat! 👵✨ M'encanta vore com les noves generacions mantenen viva l'espurna del territori.",
    likes: 340,
    comments: 21,
    image_url: ["/assets/master/post_beatriz_escola.png"],
    type: "post",
    tags: ["#Escola", "#Història", "#LaTorre"],
    created_at: new Date().toISOString()
  },
  {
    id: "post-gall-meteo-1",
    town_id: 1,
    author: "El Gall (Oratge)",
    author_avatar: "/assets/avatars/comic/avatar_marc_comic.png",
    author_role: "ambassador",
    author_entity_id: "11111111-1111-4111-a111-000000000008",
    time: "2h",
    content: "# ⛈️ Previsió: Canvi de Temps a la Fita\\n\\nEp, bategants! El baròmetre marca baixada i el vent ha girat al llevant. Arreplegueu els tendals que esta nit refrescarà de valent. La pluja és mel per a la terra assecada! 🌦️🐓",
    likes: 890,
    comments: 45,
    image_url: ["/assets/master/post_gall_meteo.png"],
    type: "post",
    tags: ["#Oratge", "#Previsió", "#Meteo"],
    created_at: new Date(Date.now() - 7200000).toISOString()
  },
  {
    id: "post-carla-salut-1",
    town_id: 1,
    author: "Carla Soriano",
    author_avatar: "/assets/avatars/comic/carla_soriano_comic.png",
    author_role: "ambassador",
    author_entity_id: "11111111-1a1a-0001-0000-000000000003",
    time: "4h",
    content: "# 🌿 Herbes del Rostoll per la Gola\\n\\nJa tenim els preparats de timó i romer llistos i ben assecats al taulell de la farmaciola. Ara que canvia l'oratge, un bon preparat vos estalviarà molts constipats! Passeu a vore'm i vos done les mides adequades.",
    likes: 210,
    comments: 14,
    image_url: ["/assets/master/post_carla_salut.png"],
    type: "post",
    tags: ["#Salut", "#Remeis", "#Natura"],
    created_at: new Date(Date.now() - 14400000).toISOString()
  },
  {
    id: "post-pepica-cuina-1",
    town_id: 1,
    author: "Pepica la Vall",
    author_avatar: "/assets/avatars/comic/pepica.png",
    author_role: "ambassador",
    author_entity_id: "11111111-1111-4111-a111-000000000009",
    time: "Ahir",
    content: "# 🥘 La Flama i L'Olleta\\n\\nEl secret de la nostra terra és donar-li temps al caliu de la llenya. Ací vos deixe com bategua l'olleta hui a casa. Calmant l'ànima des de la cuina fins al cor del mas. Bon profit, veïns! 🔥🍅",
    likes: 1040,
    comments: 89,
    image_url: ["/assets/master/post_pepica_cuina.png"],
    type: "post",
    tags: ["#Cuina", "#Tradició", "#Foc"],
    created_at: new Date(Date.now() - 86400000).toISOString()
  },
  // --- FI NOU LORE ---
`;

content = content.replace('export const MOCK_FEED = [', 'export const MOCK_FEED = [' + newPosts);

// Assign some orphans
content = content.replace(/author_entity_id: undefined,?/g, ''); // cleanup
content = content.replace(/id: 900,\\n\\s+type: "tramit",/m, 'id: 900,\n    author_entity_id: "11111111-1a1a-0001-0000-000000000011",\n    type: "tramit",');
content = content.replace(/id: 1100,\\n\\s+type: "post",/m, 'id: 1100,\n    author_entity_id: "11111111-0000-0000-0000-000000000004",\n    type: "post",');
content = content.replace(/id: 901,\\n\\s+type: "tramit",/m, 'id: 901,\n    author_entity_id: "11111111-1111-4111-a111-000000000003",\n    type: "tramit",');
content = content.replace(/id: "andreu-forja-post",\\n\\s+town_id: 1,/m, 'id: "andreu-forja-post",\n    author_entity_id: "11111111-1a1a-0001-0000-000000000001",\n    town_id: 1,');
content = content.replace(/id: "joia-agenda-1",\\n\\s+town_id: 1,/m, 'id: "joia-agenda-1",\n    author_entity_id: "11111111-1a1a-0001-0000-000000000002",\n    town_id: 1,');
content = content.replace(/id: "joia-mapa-1",\\n\\s+town_id: 1,/m, 'id: "joia-mapa-1",\n    author_entity_id: "11111111-1a1a-0001-0000-000000000001",\n    town_id: 1,');

fs.writeFileSync(dataFile, content);
console.log('MOCK_FEED updated!');

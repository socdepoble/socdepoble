import fs from 'fs';

// Read the old file
const oldContent = fs.readFileSync('/tmp/index_old.js', 'utf8');

// We need to extract the MOCK_FEED array from oldContent.
// The array starts at `export const MOCK_FEED = [{` and ends at `];\nexport const MOCK_MARKET_ITEMS`
const feedStart = oldContent.indexOf('export const MOCK_FEED = [');
const feedEnd = oldContent.indexOf('export const MOCK_MARKET_ITEMS = [');
const feedString = oldContent.substring(feedStart + 'export const MOCK_FEED = '.length, feedEnd - ';\n'.length);

// We can evaluate it safely because it's just our mock data
let oldFeed;
try {
  // Replace export with nothing, just evaluate the array
  oldFeed = eval(`(${feedString})`);
} catch (e) {
  console.error("Error evaluating old feed:", e);
  process.exit(1);
}

// Filter out the fake people. Keep 'Sóc de Poble' and 'IAIA MarIA'.
const officialFeed = oldFeed.filter(post => 
  post.author === "Sóc de Poble" || post.author === "IAIA MarIA"
);

// We need to write this back to src/data/index.js
let newContent = fs.readFileSync('src/data/index.js', 'utf8');

// In src/data/index.js, MOCK_FEED looks like `export const MOCK_FEED = [{ ...new iaia post... }];`
// Let's replace the whole MOCK_FEED array with officialFeed + the new iaia post.
// Actually, let's just serialize officialFeed + our new post.

const newIaiaPost = {
  id: "acta-termodinamica-continguts",
  author: "IAIA MarIA",
  author_avatar: "/assets/uploads/gent/avatars/iaia_comic_matriarch.png",
  author_role: "system",
  author_entity_id: "11111111-1a1a-0000-0000-000000000000",
  time: "Ara mateix",
  title: "Estandardització Lèxica i Termodinàmica",
  post_subtitle: "Gestió de Continguts al Mas",
  content: "El Mas ha establert una nova **Llei Termodinàmica** per a l'arquitectura de continguts.\n\nS'han definit tres eixos per classificar la informació:\n\n1. **Categoria:** L'element jeràrquic (Ex. Acta, Auditoria, Prompt).\n2. **Etiqueta:** El filtre transversal per creuar informació (Ex. #Termodinamica, #OfflineFirst).\n3. **Títol:** L'encapçalament descriptiu de la publicació.\n\nAquesta mètrica permet una cerca semàntica perfecta i prevé el caos a mesura que l'Eixam creix.",
  likes: 42,
  comments: 0,
  type: "post",
  is_pinned: true,
  pinned_position: 1,
  image_url: ["/assets/system/brand/logo.png"],
  tags: ["#Termodinamica", "#Arquitectura", "#IAIA"],
  town_name: "La Torre de les Maçanes",
  lat: 38.5988,
  lng: -0.4104,
  created_at: new Date().toISOString()
};

const finalFeed = [newIaiaPost, ...officialFeed];

// Convert to string preserving some formatting
const finalFeedString = JSON.stringify(finalFeed, null, 2);

const regexFeed = /export const MOCK_FEED = \[[\s\S]*?\];/g;
newContent = newContent.replace(regexFeed, `export const MOCK_FEED = ${finalFeedString};`);

fs.writeFileSync('src/data/index.js', newContent, 'utf8');
console.log("Restored " + officialFeed.length + " official cards.");

import fs from 'fs';
import path from 'path';

const dataJsPath = path.resolve('src/data.js');
let content = fs.readFileSync(dataJsPath, 'utf-8');

const updates = [
  { id: '301', image: 'image_url: ["/assets/brain/generations/nano_aplec_danses_1774284345110.png"]' },
  { id: '302', image: 'image_url: ["/assets/brain/generations/nano_ple_ordinari_1774284363882.png"]' },
  { id: '404', image: 'image_url: "/assets/brain/generations/nano_sella_notext_1774284492475.png"' },
  { id: '405', image: 'image_url: "/assets/brain/generations/nano_orxeta_notext_1774284510025.png"' },
  // 406 (Relleu) - will handle after generation
  { id: '407', image: 'image_url: "/assets/brain/generations/nano_alcoleja_notext_1774284523308.png"' },
  { id: '408', image: 'image_url: "/assets/brain/generations/nano_xixona_notext_1774284540341.png"' },
  { id: '409', image: 'image_url: "/assets/brain/generations/nano_tibi_notext_1774284556611.png"' },
  { id: '7', image: 'image: "/assets/brain/generations/nano_pedra_seca_notext_1774284571231.png"' }
];

updates.forEach(update => {
  // Regex to find the object with this id and append the image property before lat or created_at
  const regex = new RegExp(`(id:\\s*${update.id},[\\s\\S]*?)(lat:\\s*\\d|created_at:)`);
  content = content.replace(regex, `$1    ${update.image},\n    $2`);
});

fs.writeFileSync(dataJsPath, content, 'utf-8');
console.log('Images injected successfully!');

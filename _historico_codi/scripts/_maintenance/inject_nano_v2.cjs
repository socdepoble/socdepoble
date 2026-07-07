const fs = require('fs');
const path = require('path');

const publicDest = 'public/assets/brain/generations';
if (!fs.existsSync(publicDest)) fs.mkdirSync(publicDest, {recursive: true});

const imgs = [
  {src: '/Users/javillinares/.gemini/antigravity/brain/3b2dc33b-54a4-4a95-bd16-2ea7cec017be/bando_poble_nano_1774299958565.png', dest: 'bando_nano_v2.png'},
  {src: '/Users/javillinares/.gemini/antigravity/brain/3b2dc33b-54a4-4a95-bd16-2ea7cec017be/mel_muntanya_nano_1774299972510.png', dest: 'mel_nano_v2.png'},
  {src: '/Users/javillinares/.gemini/antigravity/brain/3b2dc33b-54a4-4a95-bd16-2ea7cec017be/oli_verge_nano_1774299988623.png', dest: 'oli_nano_v2.png'},
  {src: '/Users/javillinares/.gemini/antigravity/brain/3b2dc33b-54a4-4a95-bd16-2ea7cec017be/tramits_nano_1774300004411.png', dest: 'tramit_nano_v2.png'}
];

for (let img of imgs) {
  if(fs.existsSync(img.src)) fs.copyFileSync(img.src, path.join(publicDest, img.dest));
}

let data = fs.readFileSync('src/data.js', 'utf8');

// Inject into bandos
data = data.replace(/(\s+type:\s*"info",\s*metaData: {[\s\S]*?},)/g, '$1\n    image_url: ["/assets/brain/generations/bando_nano_v2.png"],');
data = data.replace(/(\s+type:\s*"warning",\s*metaData: {[\s\S]*?},)/g, '$1\n    image_url: ["/assets/brain/generations/bando_nano_v2.png"],');
data = data.replace(/(\s+type:\s*"alert",\s*metaData: {[\s\S]*?},)/g, '$1\n    image_url: ["/assets/brain/generations/bando_nano_v2.png"],');
data = data.replace(/(\s+type:\s*"celebration",\s*metaData: {[\s\S]*?},)/g, '$1\n    image_url: ["/assets/brain/generations/bando_nano_v2.png"],');

// Inject into market items
data = data.replace(/(id:\s*"mel-muntanya-1"[\s\S]*?price:\s*"\d+€",)/g, '$1\n    image: "/assets/brain/generations/mel_nano_v2.png",');
data = data.replace(/(id:\s*"oli-verge-1"[\s\S]*?price:\s*"\d+€",)/g, '$1\n    image: "/assets/brain/generations/oli_nano_v2.png",');

// Inject into Tramits
data = data.replace(/(type:\s*"tramit",.*?)(official: true,)/gs, '$1\n    image_url: ["/assets/brain/generations/tramit_nano_v2.png"],\n    $2');

fs.writeFileSync('src/data.js', data);
console.log('Images V2 injected successfully!');

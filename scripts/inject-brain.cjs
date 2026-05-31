const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const REGISTRY_FILE = path.join(__dirname, '../src/data/media_registry.js');
const BRAIN_JSON = path.join(__dirname, '../src/data/brain_media.json');

if (!fs.existsSync(BRAIN_JSON)) {
    console.error("No s'ha trobat brain_media.json");
    process.exit(1);
}

const brainData = JSON.parse(fs.readFileSync(BRAIN_JSON, 'utf-8'));

let registryContent = fs.readFileSync(REGISTRY_FILE, 'utf-8');
const jsonStart = registryContent.indexOf('{');
let jsonStr = registryContent.substring(jsonStart).trim();
if (jsonStr.endsWith(';')) {
    jsonStr = jsonStr.slice(0, -1);
}

let registryObj = JSON.parse(jsonStr);

registryObj.media = registryObj.media.filter(item => item.folder !== 'Records IAIA');

const newItems = brainData.map(item => ({
    id: crypto.createHash('md5').update(item.media_url).digest('hex').substring(0, 12),
    path: item.media_url,
    filename: item.id,
    folder: 'Records IAIA',
    type: 'image',
    tags: ['Records IAIA']
}));

registryObj.media.push(...newItems);
registryObj.meta.lastUpdated = new Date().toISOString();

const newContent = `export const MEDIA_REGISTRY = ${JSON.stringify(registryObj, null, 2)};\n`;
fs.writeFileSync(REGISTRY_FILE, newContent);
console.log(`S'han injectat ${newItems.length} imatges de la IAIA al MEDIA_REGISTRY.`);

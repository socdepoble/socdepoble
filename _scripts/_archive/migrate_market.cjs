const fs = require('fs');
const path = require('path');

const companiesDir = path.join('public', 'assets', 'uploads', 'companies', 'soc_de_poble');
const sourceDir = path.join(companiesDir, 'posts', 'samarreta_soc_de_poble');
const destDir = path.join(companiesDir, 'mercat', 'samarreta_soc_de_poble');

// 1. Move directory
if (fs.existsSync(sourceDir)) {
    if (!fs.existsSync(path.join(companiesDir, 'mercat'))) {
        fs.mkdirSync(path.join(companiesDir, 'mercat'), { recursive: true });
    }
    fs.renameSync(sourceDir, destDir);
    console.log("Moved samarreta directory to mercat/");
}

// 2. Update imageMap.json
const imageMapPath = path.join('src', 'utils', 'imageMap.json');
let imageMap = JSON.parse(fs.readFileSync(imageMapPath, 'utf8'));

let updatedMap = false;
for (const [key, val] of Object.entries(imageMap)) {
    if (val.includes('/posts/samarreta_soc_de_poble/')) {
        imageMap[key] = val.replace('/posts/samarreta_soc_de_poble/', '/mercat/samarreta_soc_de_poble/');
        updatedMap = true;
    }
}

if (updatedMap) {
    fs.writeFileSync(imageMapPath, JSON.stringify(imageMap, null, 2));
    console.log("Updated imageMap.json");
}

// 3. Update index.js mock data
const indexPath = path.join('src', 'data', 'index.js');
let indexCode = fs.readFileSync(indexPath, 'utf8');

const newImages = [
    "\"01-chica_jersey.png\"",
    "\"02-samarreta-socdepoble-roly-plom-oscur-1024px.png\"",
    "\"03-young_man_tshirt.png\"",
    "\"04-iaia_tshirt.png\"",
    "\"06-group_tshirt.png\"",
    "\"07-rustic_detail.png\""
];

// Replace the generic images for Camiseta Sóc de Poble - Edició Gris
const replacementPattern = /title:\s*"Camiseta Sóc de Poble - Edició Gris",[\s\S]*?images:\s*\[[\s\S]*?\],/m;
const match = indexCode.match(replacementPattern);
if (match) {
    const replacement = match[0].replace(/images:\s*\[[\s\S]*?\],/, `images: [\n      ${newImages.join(',\n      ')}\n    ],`);
    indexCode = indexCode.replace(replacementPattern, replacement);
    fs.writeFileSync(indexPath, indexCode);
    console.log("Updated src/data/index.js mock data for Camiseta");
}


const fs = require('fs');
const path = require('path');

const dataFile = path.join(__dirname, 'src', 'data.js');
let dataContent = fs.readFileSync(dataFile, 'utf-8');

dataContent = dataContent
    .replace(/(title:\s*"Sóc de Poble: El Llibre de la Memòria"[^]+?media_url:\s*)null/g, '$1"/assets/brain/generations/nano_llibre_memoria.png"')
    .replace(/(title:\s*"La Nova Era de la Connexió"[^]+?media_url:\s*)null/g, '$1"/assets/brain/generations/nano_fibra_espart.png"')
    .replace(/(title:\s*"Projectant el Nou Mur"[^]+?media_url:\s*)null/g, '$1"/assets/brain/generations/nano_dron_agricola.png"')
    .replace(/(title:\s*"Comunitats Resilients"[^]+?media_url:\s*)null/g, '$1"/assets/brain/generations/nano_mercat_llavors.png"')
    // Handle the ones that might not have media_url explicitly null in the regex range:
    .replace(/(title:\s*"Intercanvi de Recursos"[^]+?)media_url:\s*null/g, '$1media_url: "/assets/brain/generations/nano_mercat_llavors.png"');

// Extra failsafe replacements just in case:
if (dataContent.includes('media_url: null') && dataContent.includes('Sóc de Poble: El Llibre')) {
    console.log("Regex might have missed something. Ensure media_url matches are strong.");
}

fs.writeFileSync(dataFile, dataContent);
console.log("Images injected into data.js!");

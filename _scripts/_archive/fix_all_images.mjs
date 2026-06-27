import fs from 'fs';
import path from 'path';

let dataJs = fs.readFileSync('src/shared/data.js', 'utf8');

function ensureDirSync(dirpath) {
  if (!fs.existsSync(dirpath)) {
    fs.mkdirSync(dirpath, { recursive: true });
  }
}

// Helper to sanitize title for folder name
function createSlug(title) {
  if (!title) return 'item';
  return title.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/(^_|_$)/g, '')
    .substring(0, 30);
}

// Function to replace a specific path in data.js
function updatePathInDataJs(oldPath, newPath) {
  // Be careful with quotes
  const safeOldPath = oldPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`['"]${safeOldPath}['"]`, 'g');
  dataJs = dataJs.replace(regex, `"${newPath}"`);
}

// Let's manually map the loose images from the previous output to their correct ISO folders
const looseMappings = {
  '/assets/brand/carmen_forn_comic.png': '/assets/Mur/2026-04-01_1200_POST_la_nova_era_de_la_connexi',
  '/images/assets/apples_premium.png': '/assets/Mercat/2026-04-01_1200_PRODUCTE_pomes_de_la_torre_caixa_5kg',
  '/assets/mel.png': '/assets/Mercat/2026-04-01_1200_PRODUCTE_mel_de_muntanya_la_torre',
  '/assets/images/camiseta_dinner.jpg': '/assets/Esdeveniments/2026-02-15_1000_ESDEVENIMENT_aplec_de_danses',
  '/assets/places/nano_benifallim.png': '/assets/Pobles/2026-04-01_1200_POBLE_benifallim',
  '/assets/places/nano_sella.png': '/assets/Pobles/2026-04-01_1200_POBLE_sella',
  '/assets/places/nano_relleu.png': '/assets/Pobles/2026-04-01_1200_POBLE_relleu',
  '/assets/places/nano_alcoleja.png': '/assets/Pobles/2026-04-01_1200_POBLE_alcoleja',
  '/assets/places/nano_xixona.png': '/assets/Pobles/2026-04-01_1200_POBLE_xixona',
  '/assets/places/nano_tibi.png': '/assets/Pobles/2026-04-01_1200_POBLE_tibi',
  '/assets/brain/generations/nano_penaguila.png': '/assets/Pobles/2026-04-01_1200_POBLE_penaguila',
  '/assets/brain/generations/nano_orxeta.png': '/assets/Pobles/2026-04-01_1200_POBLE_orxeta',
  '/imatges/auditories/forensic_psychiatry_ai.png': '/assets/Mur/2026-04-01_1200_POST_psiquiatria_forense_d_ia',
  '/imatges/auditories/thermodynamics_ai_hardware.png': '/assets/Mur/2026-04-01_1200_POST_termodin_mica_p2p',
};

// Also we need to check if there are any other paths inside data.js that are loose.
// Let's do a regex to find all /assets/... or /images/... or /imatges/...
const allPathRegex = /(?:image|avatar|src|url|avatar_url|image_url|cover|photo):\s*['"](\/(?:assets|images|imatges)\/[^'"]+)['"]/g;
let match;
const allFoundPaths = new Set();
while ((match = allPathRegex.exec(dataJs)) !== null) {
  allFoundPaths.add(match[1]);
}

for (let oldPath of Object.keys(looseMappings)) {
  const targetFolder = looseMappings[oldPath];
  const fileName = path.basename(oldPath);
  const newPath = `${targetFolder}/${fileName}`;
  
  // ensure target folder exists
  const fullTargetFolder = path.join('public', targetFolder);
  ensureDirSync(fullTargetFolder);
  
  // move file
  // Wait, oldPath might be /assets/mel.png -> public/assets/mel.png
  // Or /images/assets/apples_premium.png -> public/images/assets/apples_premium.png
  let fullOldPath = path.join('public', oldPath);
  if (!fs.existsSync(fullOldPath)) {
    // maybe it's missing the leading slash in public path? path.join handles it.
    console.log(`Could not find ${fullOldPath} on disk.`);
  } else {
    fs.renameSync(fullOldPath, path.join('public', newPath));
    console.log(`Moved ${fullOldPath} -> public${newPath}`);
  }
  
  // update data.js
  updatePathInDataJs(oldPath, newPath);
  
  allFoundPaths.delete(oldPath);
}

// For any other loose image still in data.js, let's put it in nanobanana
ensureDirSync('public/assets/nanobanana');

for (let p of allFoundPaths) {
  if (p.includes('/avatars/')) continue;
  if (p.includes('/nanobanana/')) continue;
  
  // If it's already in a proper ISO folder (e.g. 3 levels deep /assets/Mur/2026-04...)
  if (p.split('/').length >= 5 && (p.startsWith('/assets/Mur') || p.startsWith('/assets/Mercat') || p.startsWith('/assets/Esdeveniments') || p.startsWith('/assets/Pobles'))) {
    continue;
  }
  
  if (p.startsWith('/assets/mur') || p.startsWith('/assets/mercat') || p.startsWith('/assets/events') || p.startsWith('/assets/places') || p.startsWith('/assets/products')) {
    // Wait, the ones in /assets/mur are mostly fine, but wait, we renamed Mur to Mur with capital M.
    // Let's migrate them to capital letters.
    let newPath = p;
    newPath = newPath.replace('/assets/mur/', '/assets/Mur/');
    newPath = newPath.replace('/assets/mercat/', '/assets/Mercat/');
    newPath = newPath.replace('/assets/events/', '/assets/Esdeveniments/');
    newPath = newPath.replace('/assets/places/', '/assets/Pobles/');
    newPath = newPath.replace('/assets/products/', '/assets/Mercat/');
    
    let fullOldPath = path.join('public', p);
    let fullNewPath = path.join('public', newPath);
    
    if (fs.existsSync(fullOldPath)) {
      ensureDirSync(path.dirname(fullNewPath));
      if (fullOldPath !== fullNewPath) {
        fs.renameSync(fullOldPath, fullNewPath);
        console.log(`Capitalized ${fullOldPath} -> ${fullNewPath}`);
      }
    }
    updatePathInDataJs(p, newPath);
    continue;
  }
  
  console.log(`Loose path still in data.js without mapping: ${p}`);
  
  let fullOldPath = path.join('public', p);
  let fileName = path.basename(p);
  let newPath = `/assets/nanobanana/${fileName}`;
  
  if (fs.existsSync(fullOldPath)) {
    fs.renameSync(fullOldPath, path.join('public', newPath));
    console.log(`Moved loose file ${fullOldPath} to nanobanana`);
  }
  updatePathInDataJs(p, newPath);
}

fs.writeFileSync('src/shared/data.js', dataJs);
console.log("Updated data.js");


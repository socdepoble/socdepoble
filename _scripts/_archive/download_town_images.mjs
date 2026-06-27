import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

const towns = [
  'Villena', 'Xàtiva', 'Gandia', 'Alzira', 'Alacant', 'Benialfaquí',
  'Alcoi', 'Tibi', 'Sella', 'Xixona', 'Relleu'
];

const downloadImage = (url, filepath) => {
  return new Promise((resolve, reject) => {
    const options = {
        headers: {
            'User-Agent': 'AntigravityIDE/1.0 (javillinares@socdepoble.org)'
        }
    };
    https.get(url, options, (response) => {
      if (response.statusCode === 200 || response.statusCode === 301 || response.statusCode === 302) {
        if (response.statusCode === 301 || response.statusCode === 302) {
             return downloadImage(response.headers.location, filepath).then(resolve).catch(reject);
        }
        response.pipe(fs.createWriteStream(filepath))
          .on('error', reject)
          .once('close', () => resolve(filepath));
      } else {
        response.resume();
        reject(new Error(`Request Failed With a Status Code: ${response.statusCode}`));
      }
    }).on('error', reject);
  });
};

const normalizeName = (name) => {
    return 'gentde' + name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/['\s-]/g, '');
};

async function fetchTownImage(townName) {
    try {
        const queryName = townName;
        let endpoint = `https://ca.wikipedia.org/api/rest_v1/page/media-list/${encodeURIComponent(queryName)}`;
        let response = await fetch(endpoint, { headers: { 'User-Agent': 'AntigravityIDE/1.0' }});
        if (!response.ok) {
             endpoint = `https://es.wikipedia.org/api/rest_v1/page/media-list/${encodeURIComponent(queryName)}`;
             response = await fetch(endpoint, { headers: { 'User-Agent': 'AntigravityIDE/1.0' }});
        }
        
        if (!response.ok) return null;
        const data = await response.json();
        const items = data.items || [];
        
        const isMap = (url) => {
            if (!url) return true;
            const lurl = url.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            return lurl.includes('.svg') || lurl.includes('escut') || lurl.includes('escudo') || 
                   lurl.includes('mapa') || lurl.includes('map') || lurl.includes('bandera') || 
                   lurl.includes('flag') || lurl.includes('locator') || lurl.includes('location') ||
                   lurl.includes('situaci') || lurl.includes('grafic') || lurl.includes('chart') ||
                   lurl.includes('demografia') || lurl.includes('poblacio') || lurl.includes('plano') ||
                   lurl.includes('comarca') || lurl.includes('localitzaci') || lurl.includes('localizaci') ||
                   lurl.includes('panoramica') === false && lurl.includes('vista') === false && url.length < 20;
        };

        let validPhotos = items
            .filter(item => item.type === 'image')
            .map(item => item.srcset?.[0]?.src || item.title)
            .filter(url => url && url.includes('upload.wikimedia.org') && !isMap(url));

        if (validPhotos.length > 0) {
            // Prioritize ones that might be panoramas or main views
            let bestPhoto = validPhotos.find(url => url.toLowerCase().includes('panoram') || url.toLowerCase().includes('vista') || url.toLowerCase().includes('castell'));
            if (!bestPhoto) bestPhoto = validPhotos[0];
            
            let imgUrl = bestPhoto;
            if (imgUrl.startsWith('//')) imgUrl = 'https:' + imgUrl;
            imgUrl = imgUrl.replace(/\/\d+px-/g, '/1200px-'); // Get HIGHEST resolution
            return imgUrl;
        }
        return null;
    } catch (e) {
        console.error("Error fetching for", townName, e.message);
        return null;
    }
}

async function run() {
    for (const town of towns) {
        console.log(`Buscant imatge per a ${town}...`);
        const imgUrl = await fetchTownImage(town);
        if (imgUrl) {
            console.log(`Trobada: ${imgUrl}`);
            const folderName = normalizeName(town);
            const folderPath = path.join(projectRoot, 'public', 'assets', 'uploads', 'places', folderName);
            fs.mkdirSync(folderPath, { recursive: true });
            const filePath = path.join(folderPath, 'cover.jpg');
            try {
                await downloadImage(imgUrl, filePath);
                console.log(`Guardada: ${filePath}`);
            } catch(e) {
                console.error(`Failed to download ${town}`, e.message);
            }
        } else {
            console.log(`No s'ha trobat cap imatge vàlida per a ${town}`);
        }
    }
}

run();

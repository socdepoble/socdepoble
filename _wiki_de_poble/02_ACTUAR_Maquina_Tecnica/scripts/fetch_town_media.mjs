import fs from 'fs';
import path from 'path';
import https from 'https';

const TOWNS = [
    "Agost", "Alacant", "Alzira", "Banyeres de Mariola", "Benidorm", "Bunyol", 
    "Cullera", "Elx", "Enguera", "Gandia", "Girona", "Oriola", "Torrent", 
    "Villena", "Vinaròs", "Xàtiva"
];

// Special overrides to avoid disambiguations (e.g., Agost=Month, Cullera=Spoon, Elx=Dama)
const OVERRIDES = {
    "Agost": "Agost (l'Alacantí)",
    "Bunyol": "Buñol",
    "Cullera": "Cullera",
    "Elx": "Elche",
    "Xàtiva": "Xàtiva"
};

const BASE_DIR = path.join(process.cwd(), '../public/assets/towns');

if (!fs.existsSync(BASE_DIR)) {
    fs.mkdirSync(BASE_DIR, { recursive: true });
}

const isBadImage = (url) => {
    if (!url) return true;
    const lurl = url.toLowerCase();
    // Rejects maps, shields, diagrams, spoons (just in case), dama de elche busts, and small low-res
    return lurl.includes('.svg') || lurl.includes('escut') || lurl.includes('escudo') || 
           lurl.includes('mapa') || lurl.includes('map') || lurl.includes('bandera') || 
           lurl.includes('flag') || lurl.includes('locator') || lurl.includes('location') ||
           lurl.includes('grafic') || lurl.includes('graph') || lurl.includes('poblacio') ||
           lurl.includes('plan') || lurl.includes('dama_de_elche') || lurl.includes('spoon') ||
           lurl.includes('cullera_(') || lurl.includes('libro') || lurl.includes('book');
};

const sanitizeSlug = (name) => {
    return name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-').replace(/[^\w-]/g, '');
};

const downloadImage = (url, destPath) => {
    return new Promise((resolve, reject) => {
        https.get(url, { headers: { 'User-Agent': 'SocDePoble/1.0 AgentFetcher' } }, (res) => {
            if (res.statusCode !== 200) {
                return reject(new Error(`Failed to GET ${url} (${res.statusCode})`));
            }
            const file = fs.createWriteStream(destPath);
            res.pipe(file);
            file.on('finish', () => {
                file.close(resolve);
            });
        }).on('error', reject);
    });
};

const fetchTownImages = async (townName) => {
    const slug = sanitizeSlug(townName);
    const townDir = path.join(BASE_DIR, slug);
    if (!fs.existsSync(townDir)) {
        fs.mkdirSync(townDir, { recursive: true });
    }

    const searchQuery = OVERRIDES[townName] || townName;

    // Search Wikimedia Commons for categories like "Views of [Town]" or just photos in the town's category
    const apiUrl = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=intitle:"vista" OR intitle:"panorama" OR intitle:"plaza" OR intitle:"paisaje" + ${encodeURIComponent(searchQuery)} -incategory:"Maps"&gsrnamespace=6&prop=imageinfo&iiprop=url&iiurlwidth=1200&format=json&origin=*`;

    return new Promise((resolve, reject) => {
        https.get(apiUrl, { headers: { 'User-Agent': 'SocDePoble/1.0 AgentFetcher' } }, (res) => {
            let data = "";
            res.on("data", chunk => data += chunk);
            res.on("end", async () => {
                try {
                    const parsed = JSON.parse(data);
                    const pages = parsed.query?.pages;
                    if (!pages) {
                        console.log(`[!] No images found on Commons for ${townName} using strict filters. Trying fallback...`);
                        await fallbackFetch(townName, townDir, searchQuery);
                        return resolve();
                    }

                    const images = Object.values(pages)
                        .map(p => {
                            const info = p.imageinfo?.[0];
                            return info?.thumburl || info?.url;
                        })
                        .filter(url => url && !isBadImage(url));

                    if (images.length === 0) {
                        console.log(`[!] All images filtered out as low quality/maps for ${townName}.`);
                        await fallbackFetch(townName, townDir, searchQuery);
                        return resolve();
                    }

                    // Download top 3
                    const max = Math.min(3, images.length);
                    for (let i = 0; i < max; i++) {
                        const imgUrl = images[i];
                        const ext = imgUrl.split('.').pop().toLowerCase().split('?')[0] || 'jpg';
                        const dest = path.join(townDir, `${i + 1}.jpg`); // we'll save it as jpg
                        console.log(`[+] Downloading ${townName} - Image ${i+1}: ${imgUrl}`);
                        await downloadImage(imgUrl, dest);
                    }
                    resolve();

                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', reject);
    });
};

const fallbackFetch = async (townName, townDir, searchQuery) => {
    // If strict search failed, do a broader search but still filter out bad stuff
    const apiUrl = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(searchQuery)} panorama OR vista&gsrnamespace=6&prop=imageinfo&iiprop=url&iiurlwidth=1200&format=json&origin=*`;
    
    return new Promise((resolve, reject) => {
        https.get(apiUrl, { headers: { 'User-Agent': 'SocDePoble/1.0 AgentFetcher' } }, (res) => {
            let data = "";
            res.on("data", chunk => data += chunk);
            res.on("end", async () => {
                try {
                    const parsed = JSON.parse(data);
                    const pages = parsed.query?.pages;
                    if (!pages) return resolve();

                    const images = Object.values(pages)
                        .map(p => {
                            const info = p.imageinfo?.[0];
                            return info?.thumburl || info?.url;
                        })
                        .filter(url => url && !isBadImage(url));

                    const max = Math.min(3, images.length);
                    for (let i = 0; i < max; i++) {
                        const imgUrl = images[i];
                        const dest = path.join(townDir, `${i + 1}.jpg`);
                        console.log(`[INFO] Downlading Fallback ${townName} - Image ${i+1}: ${imgUrl}`);
                        await downloadImage(imgUrl, dest);
                    }
                    resolve();
                } catch(e) { reject(e); }
            });
        }).on('error', reject);
    });
}

const run = async () => {
    for (const town of TOWNS) {
        try {
            await fetchTownImages(town);
        } catch (e) {
            console.error(`[-] Error in ${town}:`, e.message);
        }
    }
    console.log("Done fetching!");
};

run();

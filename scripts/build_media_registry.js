import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ASSETS_DIR = path.join(__dirname, '../public/assets');
const REGISTRY_FILE = path.join(__dirname, '../public/assets/media_registry.json');
const SRC_DATA_DIR = path.join(__dirname, '../src/data');

const getFileHash = (filePath) => {
  const fileBuffer = fs.readFileSync(filePath);
  const hashSum = crypto.createHash('md5');
  hashSum.update(fileBuffer);
  return hashSum.digest('hex');
};

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      filelist = walkSync(filePath, filelist);
    } else {
      const ext = path.extname(file).toLowerCase();
      if (['.jpg', '.jpeg', '.png', '.webp', '.svg', '.gif'].includes(ext)) {
         filelist.push(filePath);
      }
    }
  });
  return filelist;
};

const buildRegistry = () => {
    if (!fs.existsSync(ASSETS_DIR)) {
        console.error('Assets directory not found');
        return;
    }

    const allImages = walkSync(ASSETS_DIR);
    const registry = {
        meta: { lastUpdated: new Date().toISOString() },
        media: [],
        duplicates: []
    };

    const hashMap = {};

    allImages.forEach(filePath => {
        const relativePath = '/assets/' + path.relative(ASSETS_DIR, filePath);
        const folder = path.dirname(path.relative(ASSETS_DIR, filePath));
        const filename = path.basename(filePath);
        
        const hash = getFileHash(filePath);

        if (hashMap[hash]) {
            // Duplicate found
            registry.duplicates.push({
                original: hashMap[hash].path,
                duplicate: relativePath,
                hash: hash
            });
            console.log(`[DUPLICADO] ${relativePath} es igual a ${hashMap[hash].path}`);
        } else {
            const entry = {
                id: hash.substring(0, 12),
                path: relativePath,
                filename: filename,
                folder: folder === '.' ? 'general' : folder,
                tags: [folder !== '.' ? folder : 'general']
            };
            hashMap[hash] = entry;
            registry.media.push(entry);
        }
    });

    // We write the registry to public as the primary source
    fs.writeFileSync(REGISTRY_FILE, JSON.stringify(registry, null, 2));
    
    // Also write a module we can import synchronously inside React components easily if needed
    const jsContent = `export const MEDIA_REGISTRY = ${JSON.stringify(registry, null, 2)};`;
    const dataFilePath = path.join(SRC_DATA_DIR, 'media_registry.js');
    if(fs.existsSync(SRC_DATA_DIR)) {
        fs.writeFileSync(dataFilePath, jsContent);
        console.log(`✅ Media Registry JS export construído en: ${dataFilePath}`);
    }

    console.log(`✅ Media Registry construido con éxito: ${registry.media.length} imágenes únicas, ${registry.duplicates.length} duplicadas enviadas al index.`);
};

buildRegistry();

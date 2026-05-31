const fs = require('fs');
const path = require('path');
const os = require('os');

const BRAIN_DIR = path.join(os.homedir(), '.gemini/antigravity-ide/brain');
const TARGET_DIR = path.join(__dirname, '../public/assets/uploads/brain');
const JSON_OUT = path.join(__dirname, '../src/data/brain_media.json');

// Ensure target directory exists
if (!fs.existsSync(TARGET_DIR)) {
    fs.mkdirSync(TARGET_DIR, { recursive: true });
}

const findImages = (dir, fileList = []) => {
    if (!fs.existsSync(dir)) return fileList;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            findImages(filePath, fileList);
        } else {
            const ext = path.extname(file).toLowerCase();
            if (['.png', '.jpg', '.jpeg', '.webp'].includes(ext)) {
                fileList.push(filePath);
            }
        }
    }
    return fileList;
};

console.log('Escanejant el Cervell (Brain) de la IAIA...');
const allImages = findImages(BRAIN_DIR);
console.log(`Trobades ${allImages.length} imatges. Sincronitzant...`);

const mediaData = [];

allImages.forEach((imagePath) => {
    const fileName = path.basename(imagePath);
    const destPath = path.join(TARGET_DIR, fileName);
    
    // Copy if it doesn't exist
    if (!fs.existsSync(destPath)) {
        fs.copyFileSync(imagePath, destPath);
    }
    
    const stats = fs.statSync(imagePath);
    
    // Add to JSON format expected by GlobalAssetAlbum
    mediaData.push({
        id: fileName,
        media_url: `/assets/uploads/brain/${fileName}`,
        media_type: 'image',
        is_public: false, // Per revisar by default
        created_at: stats.birthtime.toISOString(),
        title: fileName.replace(/\.[^/.]+$/, "").replace(/_/g, " "),
        source: 'IAIA Brain',
        type: 'brain_generated'
    });
});

// Sort by newest first
mediaData.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

fs.writeFileSync(JSON_OUT, JSON.stringify(mediaData, null, 2));

console.log('Sincronització completada! Índex JSON generat a src/data/brain_media.json');

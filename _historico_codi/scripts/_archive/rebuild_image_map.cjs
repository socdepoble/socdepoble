const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public', 'assets');
const imageMapPath = path.join(__dirname, 'src', 'utils', 'imageMap.json');

const imageMap = {};

function scanDir(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
        if (file === '.DS_Store') continue;
        
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            scanDir(fullPath);
        } else {
            // Only map image files
            const ext = path.extname(file).toLowerCase();
            if (['.png', '.jpg', '.jpeg', '.svg', '.gif', '.webp'].includes(ext)) {
                // Remove /Users/.../public from the path to get the relative URL
                const relativePath = fullPath.substring(fullPath.indexOf('/public/') + 7);
                imageMap[file] = relativePath;
            }
        }
    }
}

// Scan the primary directories
scanDir(path.join(publicDir, 'uploads'));
scanDir(path.join(publicDir, '_revisar'));
scanDir(path.join(publicDir, 'system'));
scanDir(path.join(publicDir, 'pages'));

fs.writeFileSync(imageMapPath, JSON.stringify(imageMap, null, 2));
console.log(`Rebuilt imageMap.json with ${Object.keys(imageMap).length} entries.`);

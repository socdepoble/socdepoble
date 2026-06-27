import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');
const assetsDir = path.join(rootDir, 'public', 'assets');

// Format: YYYY-MM-DD_HH-MM
function formatEpoch(epochMs) {
    const d = new Date(parseInt(epochMs, 10));
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}_${hours}-${minutes}`;
}

function findMediaFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            findMediaFiles(fullPath, fileList);
        } else {
            if (file.startsWith('media__')) {
                fileList.push(fullPath);
            }
        }
    }
    return fileList;
}

const mediaFiles = findMediaFiles(assetsDir);
const mappings = [];

console.log(`Found ${mediaFiles.length} media files to migrate.`);

for (const oldPath of mediaFiles) {
    const dir = path.dirname(oldPath);
    const oldFilename = path.basename(oldPath);
    const match = oldFilename.match(/^media__(\d+)\.(.+)$/);
    
    if (match) {
        const epochMs = match[1];
        const ext = match[2];
        const formattedDate = formatEpoch(epochMs);
        const newFilename = `${formattedDate}_legacy_media.${ext}`;
        const newPath = path.join(dir, newFilename);
        
        console.log(`Renaming: ${oldFilename} -> ${newFilename}`);
        fs.renameSync(oldPath, newPath);
        
        mappings.push({
            oldFilename,
            newFilename,
            oldRelPath: oldPath.substring(rootDir.length).replace(/\\/g, '/'),
            newRelPath: newPath.substring(rootDir.length).replace(/\\/g, '/')
        });
    }
}

// Update files
const filesToUpdate = [
    path.join(rootDir, 'src', 'shared', 'data', 'media_registry.js'),
    path.join(rootDir, 'public', 'assets', 'media_registry.json'),
    path.join(rootDir, 'src', 'data.js'),
    path.join(rootDir, 'src', 'shared', 'data.js'),
];

for (const filePath of filesToUpdate) {
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        let modified = false;
        
        for (const mapping of mappings) {
            // Replace full paths (without root)
            // e.g. /public/assets/folder/filename -> /public/assets/folder/newfilename
            // or assets/folder/filename -> assets/folder/newfilename
            // Also replace just the filenames
            
            const regexFilename = new RegExp(mapping.oldFilename, 'g');
            if (regexFilename.test(content)) {
                content = content.replace(regexFilename, mapping.newFilename);
                modified = true;
            }
        }
        
        if (modified) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Updated references in ${path.basename(filePath)}`);
        }
    } else {
        console.log(`File not found, skipping: ${filePath}`);
    }
}

console.log('Migration complete.');

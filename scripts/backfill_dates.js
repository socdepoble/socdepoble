import fs from 'fs';
import path from 'path';

const REGISTRY_FILE = path.join(process.cwd(), 'src/data/media_registry.js');
let content = fs.readFileSync(REGISTRY_FILE, 'utf-8');

let jsonStr = content.substring(content.indexOf('{'));
const hmrIdx = jsonStr.indexOf('if (import.meta.hot)');
if (hmrIdx !== -1) jsonStr = jsonStr.substring(0, hmrIdx);
jsonStr = jsonStr.trim();
if (jsonStr.endsWith(';')) jsonStr = jsonStr.slice(0, -1);

let registry = JSON.parse(jsonStr);

let updatedCount = 0;
for (const item of registry.media) {
    if (!item.date) {
        const fullPath = path.join(process.cwd(), 'public', item.path);
        if (fs.existsSync(fullPath)) {
            const stats = fs.statSync(fullPath);
            item.date = stats.birthtime ? stats.birthtime.toISOString() : stats.mtime.toISOString();
            updatedCount++;
        } else {
            // fallback date if file not found
            item.date = new Date('2024-01-01').toISOString();
        }
    }
}

if (updatedCount > 0) {
    const newContent = `export const MEDIA_REGISTRY = ${JSON.stringify(registry, null, 2)};\n\nif (import.meta.hot) { import.meta.hot.accept(); }\n`;
    fs.writeFileSync(REGISTRY_FILE, newContent);
    console.log(`Updated ${updatedCount} items with dates.`);
} else {
    console.log('No items needed updating.');
}

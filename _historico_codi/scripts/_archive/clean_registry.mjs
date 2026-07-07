import fs from 'fs';
import path from 'path';

const registryFile = 'src/data/media_registry.js';
const publicDir = 'public';

let content = fs.readFileSync(registryFile, 'utf8');
const jsonStr = content.replace('export const MEDIA_REGISTRY = ', '');
let registry;
try {
  registry = JSON.parse(jsonStr);
} catch (e) {
  // Try to parse using Function if JSON.parse fails due to missing quotes on keys
  registry = new Function('return ' + jsonStr)();
}

const initialCount = registry.media.length;
registry.media = registry.media.filter(item => {
  // Only check files in el_projecte to be safe
  if (item.path && item.path.includes('/assets/pages/el_projecte/')) {
    const fullPath = path.join(publicDir, item.path);
    return fs.existsSync(fullPath);
  }
  return true;
});

const finalCount = registry.media.length;

if (initialCount !== finalCount) {
  const newContent = 'export const MEDIA_REGISTRY = ' + JSON.stringify(registry, null, 2) + ';\n';
  fs.writeFileSync(registryFile, newContent, 'utf8');
  console.log(`Cleaned up ${initialCount - finalCount} missing entries from media_registry.js`);
} else {
  console.log('No cleanup needed.');
}

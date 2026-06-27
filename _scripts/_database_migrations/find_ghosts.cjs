const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const exec = (cmd) => {
  try {
    return execSync(cmd, { encoding: 'utf8' }).trim().split('\n').filter(Boolean);
  } catch (e) {
    return [];
  }
};

const allJsx = exec('find src -type f -name "*.jsx" -o -name "*.js"');

const importedPaths = new Set();

allJsx.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const importRegex = /from\s+['"]([^'"]+)['"]/g;
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    let importPath = match[1];
    if (importPath.startsWith('.')) {
      const dir = path.dirname(file);
      let resolved = path.resolve(dir, importPath);
      // simplify path assuming src is at project root
      // We don't have the exact file extension, so we just store the resolved path without extension
      importedPaths.add(resolved);
    }
  }
});

const checkIsImported = (filePath) => {
  const noExt = filePath.replace(/\.[^/.]+$/, "");
  const fullPath = path.resolve(noExt);
  
  // Try direct match
  if (importedPaths.has(fullPath)) return true;
  
  // Try index.js match
  if (path.basename(noExt) === 'index' && importedPaths.has(path.dirname(fullPath))) return true;
  if (importedPaths.has(fullPath + '/index')) return true;

  return false;
}

const comps = exec('find src/components -type f -name "*.jsx"');
const sharedComps = exec('find src/shared/components -type f -name "*.jsx"');

console.log("=== Active in src/components ===");
let activeComps = 0;
comps.forEach(c => { if(checkIsImported(c)) activeComps++; });
console.log(activeComps, "/", comps.length);

console.log("\n=== Active in src/shared/components ===");
let activeShared = 0;
sharedComps.forEach(c => { if(checkIsImported(c)) activeShared++; });
console.log(activeShared, "/", sharedComps.length);


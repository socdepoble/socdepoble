const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const exec = (cmd) => execSync(cmd, { encoding: 'utf8' }).trim().split('\n').filter(Boolean);

const allFiles = exec('find src -type f -name "*.jsx" -o -name "*.js" -o -name "*.tsx" -o -name "*.ts"');

allFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  const importRegex = /(from\s+['"]|import\s+['"])([^'"]+)(['"])/g;
  
  content = content.replace(importRegex, (match, prefix, importPath, suffix) => {
    if (!importPath.startsWith('.')) return match;
    
    // Some paths like ../shared/components/X inside src/shared/components should just be ./X
    // Or ../../shared/components/X inside src/shared/components should be ../X
    const fileDir = path.dirname(path.resolve(file));
    let resolvedImport = path.resolve(fileDir, importPath);
    
    // if resolvedImport has "shared/shared", fix it
    if (resolvedImport.includes('shared/shared/')) {
        resolvedImport = resolvedImport.replace('shared/shared/', 'shared/');
    }

    let relative = path.relative(fileDir, resolvedImport);
    if (!relative.startsWith('.')) relative = './' + relative;
    
    if (relative !== importPath) {
        changed = true;
        return prefix + relative + suffix;
    }
    return match;
  });

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Fixed relative imports in', file);
  }
});

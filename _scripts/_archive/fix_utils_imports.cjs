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
    
    // Normalize both paths using normalize()
    const fileDir = path.dirname(path.resolve(file));
    let resolvedPath = path.resolve(fileDir, importPath).normalize('NFC');
    const srcUtilsPath = path.resolve(__dirname, 'src/utils').normalize('NFC');
    const srcSharedUtilsPath = path.resolve(__dirname, 'src/shared/utils').normalize('NFC');
    
    if (resolvedPath === srcUtilsPath || resolvedPath.startsWith(srcUtilsPath + path.sep)) {
        const newResolvedPath = resolvedPath.replace(srcUtilsPath, srcSharedUtilsPath);
        
        let relative = path.relative(fileDir, newResolvedPath);
        if (!relative.startsWith('.')) relative = './' + relative;
        
        if (relative !== importPath) {
            changed = true;
            return prefix + relative + suffix;
        }
    }

    return match;
  });

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Fixed utils imports in', file);
  }
});

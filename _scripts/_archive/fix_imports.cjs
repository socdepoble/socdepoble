const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const exec = (cmd) => execSync(cmd, { encoding: 'utf8' }).trim().split('\n').filter(Boolean);

const allFiles = exec('find src -type f -name "*.jsx" -o -name "*.js" -o -name "*.tsx" -o -name "*.ts"');
const rootDir = path.resolve('src');

allFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // We are looking for imports that resolve to src/utils/... or src/components/...
  // and we want to change them to src/shared/utils/... or src/shared/components/...
  const importRegex = /(from\s+['"]|import\s+['"])([^'"]+)(['"])/g;
  
  content = content.replace(importRegex, (match, prefix, importPath, suffix) => {
    if (!importPath.startsWith('.')) return match;
    
    const fileDir = path.dirname(path.resolve(file));
    const resolvedImport = path.resolve(fileDir, importPath);
    
    const utilsPath = path.resolve(rootDir, 'utils');
    const componentsPath = path.resolve(rootDir, 'components');
    
    let newImportPath = importPath;
    
    if (resolvedImport === utilsPath || resolvedImport.startsWith(utilsPath + path.sep)) {
      // It points to src/utils. We need it to point to src/shared/utils
      const newResolved = resolvedImport.replace(utilsPath, path.resolve(rootDir, 'shared', 'utils'));
      let relative = path.relative(fileDir, newResolved);
      if (!relative.startsWith('.')) relative = './' + relative;
      newImportPath = relative;
      changed = true;
    } 
    else if (resolvedImport === componentsPath || resolvedImport.startsWith(componentsPath + path.sep)) {
      // It points to src/components. We need it to point to src/shared/components
      const newResolved = resolvedImport.replace(componentsPath, path.resolve(rootDir, 'shared', 'components'));
      let relative = path.relative(fileDir, newResolved);
      if (!relative.startsWith('.')) relative = './' + relative;
      newImportPath = relative;
      changed = true;
    }
    
    return prefix + newImportPath + suffix;
  });

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Fixed imports in', file);
  }
});

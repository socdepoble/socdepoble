const fs = require('fs');

const { execSync } = require('child_process');
const allFiles = execSync('find src/shared -type f -name "*.jsx" -o -name "*.js" -o -name "*.tsx" -o -name "*.ts"', { encoding: 'utf8' }).trim().split('\n').filter(Boolean);

allFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  const importRegex = /(from\s+['"]|import\s+['"])([^'"]+)(['"])/g;
  
  content = content.replace(importRegex, (match, prefix, importPath, suffix) => {
    if (!importPath.startsWith('.')) return match;
    
    // If we're inside src/shared, and the path has 'shared/' inside it, but it's not relative to src/
    // e.g. ../shared/utils should be ../utils
    // ../../shared/utils should be ../../utils
    // Let's just remove the 'shared/' part if it's there
    if (importPath.includes('shared/utils') || importPath.includes('shared/components')) {
        let newPath = importPath.replace(/shared\//g, '');
        changed = true;
        return prefix + newPath + suffix;
    }

    return match;
  });

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Fixed imports in', file);
  }
});

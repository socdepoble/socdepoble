const fs = require('fs');

const { execSync } = require('child_process');
const allFiles = execSync('find src -type f -name "*.jsx" -o -name "*.js" -o -name "*.tsx" -o -name "*.ts"', { encoding: 'utf8' }).trim().split('\n').filter(Boolean);

allFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  const importRegex = /(from\s+['"]|import\s+['"])([^'"]+)(['"])/g;
  
  content = content.replace(importRegex, (match, prefix, importPath, suffix) => {
    if (!importPath.startsWith('.')) return match;
    
    if (importPath.includes('/components/') || importPath.endsWith('/components')) {
        if (!importPath.includes('shared/components')) {
            let newPath = importPath.replace(/\/components\//g, '/shared/components/').replace(/\/components$/g, '/shared/components');
            changed = true;
            return prefix + newPath + suffix;
        }
    }

    return match;
  });

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Fixed imports in', file);
  }
});

const fs = require('fs');

const { execSync } = require('child_process');
const allFiles = execSync('find src -type f -name "*.jsx" -o -name "*.js" -o -name "*.tsx" -o -name "*.ts"', { encoding: 'utf8' }).trim().split('\n').filter(Boolean);

allFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  const importRegex = /(from\s+['"]|import\s+['"])([^'"]+)(['"])/g;
  
  content = content.replace(importRegex, (match, prefix, importPath, suffix) => {
    if (!importPath.startsWith('.')) return match;
    
    // if it looks like ../utils/... or ../../utils/... or ./utils/...
    // but wait, what if it's already ../shared/utils/... ?
    if (importPath.includes('/utils/') || importPath.endsWith('/utils')) {
        if (!importPath.includes('shared/utils')) {
            // let's just replace /utils/ with /shared/utils/
            // and /utils with /shared/utils
            let newPath = importPath.replace(/\/utils\//g, '/shared/utils/').replace(/\/utils$/g, '/shared/utils');
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

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const exec = (cmd) => execSync(cmd, { encoding: 'utf8' }).trim().split('\n').filter(Boolean);

const allFiles = exec('find src/shared -type f -name "*.jsx" -o -name "*.js" -o -name "*.tsx" -o -name "*.ts"');

const extensions = ['.js', '.jsx', '.ts', '.tsx', '.json', '.css'];

function resolves(fileDir, importPath) {
    let p = path.resolve(fileDir, importPath);
    if (fs.existsSync(p)) return true;
    for (const ext of extensions) {
        if (fs.existsSync(p + ext)) return true;
        if (fs.existsSync(path.join(p, 'index' + ext))) return true;
    }
    return false;
}

allFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  const importRegex = /(from\s+['"]|import\s+['"])([^'"]+)(['"])/g;
  
  content = content.replace(importRegex, (match, prefix, importPath, suffix) => {
    if (!importPath.startsWith('.')) return match;
    
    const fileDir = path.dirname(path.resolve(file));
    
    if (!resolves(fileDir, importPath)) {
        // Just use path.posix.join
        let altPath = path.posix.join('..', importPath);
        if (!altPath.startsWith('.')) altPath = './' + altPath;

        if (resolves(fileDir, altPath)) {
            changed = true;
            return prefix + altPath + suffix;
        }

        let altPath2 = importPath.replace('../components/', '../shared/components/');
        if (resolves(fileDir, altPath2)) {
            changed = true;
            return prefix + altPath2 + suffix;
        }

        console.log(`Could not resolve ${importPath} in ${file}`);
    }

    return match;
  });

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Fixed imports in', file);
  }
});

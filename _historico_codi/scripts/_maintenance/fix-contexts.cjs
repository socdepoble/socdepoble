const fs = require('fs');
const path = require('path');

const srcDir = path.resolve('/Users/javillinares/Documents/Antigravity/Sóc de Poble/src');
const newContextDir = path.resolve(srcDir, 'app', 'context');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        if (file === 'node_modules' || file === '.git' || file === 'context') return; // ignore the old context dir
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(filePath));
        } else { 
            if (filePath.endsWith('.js') || filePath.endsWith('.jsx')) {
                results.push(filePath);
            }
        }
    });
    return results;
}

const files = walk(srcDir);
let changedCount = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;
    
    // We are looking for imports like from '../context/...' or '../../context/...'
    // and we need to point them to the new context dir
    
    const lines = content.split('\n');
    let modified = false;
    
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        const importMatch = line.match(/from\s+['"]([^'"]*\/context\/[^'"]+)['"]/);
        
        if (importMatch) {
            const importPath = importMatch[1];
            // If it already points to app/context, skip
            if (importPath.includes('app/context/')) continue;
            
            const importDir = path.dirname(file);
            const absoluteImportPath = path.resolve(importDir, importPath);
            
            // If the resolved path points to the old src/context directory
            if (absoluteImportPath.startsWith(path.resolve(srcDir, 'context'))) {
                const fileName = path.basename(absoluteImportPath);
                
                // Calculate new relative path to src/app/context
                let newRelPath = path.relative(importDir, path.resolve(newContextDir, fileName));
                if (!newRelPath.startsWith('.')) {
                    newRelPath = './' + newRelPath;
                }
                
                lines[i] = line.replace(importPath, newRelPath);
                modified = true;
            }
        }
    }
    
    if (modified) {
        fs.writeFileSync(file, lines.join('\n'), 'utf8');
        changedCount++;
        console.log(`Updated ${file}`);
    }
});

console.log(`Changed ${changedCount} files.`);

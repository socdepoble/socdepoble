const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    if (fs.statSync(dirFile).isDirectory()) {
        filelist = walkSync(dirFile, filelist);
    } else {
        filelist.push(dirFile);
    }
  });
  return filelist;
};

const files = walkSync('./src').filter(f => f.endsWith('.js') || f.endsWith('.jsx'));

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // determine correct depth to reach src/services/
    const parts = file.split(path.sep);
    // e.g., src, components, AddItemModal.jsx -> 3 parts
    // for App.jsx -> src, App.jsx -> 2 parts
    // We want path from file's directory to src/services
    const dirDepth = parts.length - 2; 
    let correctPath = '';
    
    if (parts[1] === 'services') {
        correctPath = './';
    } else if (dirDepth === 0) {
        correctPath = './services/';
    } else {
        correctPath = '../'.repeat(dirDepth) + 'services/';
    }

    // Fix imports that look like from './services/XXX' or from '../services/XXX' or from '../../services/XXX'
    // but only for our specific services to avoid breaking legitimate ones
    ['marketService', 'chatService', 'authService'].forEach(svc => {
        const regex = new RegExp(`import\\s+{[^}]*\\b${svc}\\b[^}]*}\\s+from\\s+['"]([^'"]+)['"]`, 'g');
        content = content.replace(regex, (match, currentPath) => {
            if (currentPath.endsWith(svc)) {
                return match.replace(currentPath, correctPath + svc);
            }
            return match;
        });
    });

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Fixed imports in ${file}`);
    }
});

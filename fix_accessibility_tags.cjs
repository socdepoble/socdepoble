const fs = require('fs');
const path = require('path');

const excludeFiles = [
    'AppLayout.jsx',
    'SystemPageLayout.jsx',
    'Header.jsx',
    'UniversalHeaderRoot',
    'index.jsx',
    'universal-header.jsx'
];

function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            processDirectory(fullPath);
        } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.html')) {
            if (excludeFiles.some(ex => fullPath.includes(ex))) {
                continue;
            }

            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = false;

            if (content.includes('<main')) {
                content = content.replace(/<main/g, '<div role="region" aria-label="Contingut Principal"');
                content = content.replace(/<\/main>/g, '</div>');
                modified = true;
            }

            if (content.includes('<header')) {
                content = content.replace(/<header/g, '<div role="region" aria-label="Capçalera de Secció"');
                content = content.replace(/<\/header>/g, '</div>');
                modified = true;
            }

            if (modified) {
                fs.writeFileSync(fullPath, content);
                console.log(`Updated ${fullPath}`);
            }
        }
    }
}

processDirectory(path.join(__dirname, 'src', 'pages'));
processDirectory(path.join(__dirname, 'src', 'components'));
processDirectory(path.join(__dirname, 'src', 'docs'));

console.log('Done replacing tags.');

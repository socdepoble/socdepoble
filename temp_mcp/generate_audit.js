const fs = require('fs');
const path = require('path');

const dirsToScan = ['src/components', 'src/services'];
const exactFiles = ['package.json', 'vite.config.js'];
const outDir = path.join(__dirname, '../auditorias');
const outputFile = path.join(outDir, 'Codigo_Auditoria_Global.md');

if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
}

let output = '# Frontend Codi Base (Global v10.33.3)\n\n';

function scanDir(dir) {
    const fullDir = path.join(__dirname, '..', dir);
    if (!fs.existsSync(fullDir)) return;
    const files = fs.readdirSync(fullDir);
    for (const file of files) {
        const fullPath = path.join(fullDir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            scanDir(path.join(dir, file));
        } else if (file.endsWith('.js') || file.endsWith('.jsx') || file.endsWith('.css')) {
            const ext = file.endsWith('.css') ? 'css' : 'javascript';
            const relativePath = path.join(dir, file);
            output += `## ${relativePath}\n\`\`\`${ext}\n${fs.readFileSync(fullPath, 'utf8')}\n\`\`\`\n\n`;
        }
    }
}

for (const dir of dirsToScan) { scanDir(dir); }
for (const file of exactFiles) {
    const fullPath = path.join(__dirname, '..', file);
    if (fs.existsSync(fullPath)) {
        output += `## ${file}\n\`\`\`javascript\n${fs.readFileSync(fullPath, 'utf8')}\n\`\`\`\n\n`;
    }
}

fs.writeFileSync(outputFile, output);
console.log('Generat: ' + outputFile);

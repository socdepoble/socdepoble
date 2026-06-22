const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        const dirPath = path.join(dir, f);
        const isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

const targetDirs = [
    path.join(__dirname, '../src/pages'),
    path.join(__dirname, '../src/components')
];

const results = [];
const elementRegex = /<([a-zA-Z0-9]+)([^>]*)>/g;
const classNameRegex = /className=(?:'([^']+)'|"([^"]+)"|\{`([^`]+)`\})/;

targetDirs.forEach(dir => {
    if (!fs.existsSync(dir)) return;
    walkDir(dir, filePath => {
        if (!filePath.endsWith('.jsx')) return;
        
        const content = fs.readFileSync(filePath, 'utf-8');
        const relativePath = path.relative(path.join(__dirname, '../src'), filePath);
        
        let match;
        let ghostCount = 0;
        let fileHasGhosts = false;
        const fileGhosts = new Set();
        
        while ((match = elementRegex.exec(content)) !== null) {
            const [fullMatch, tagName, attrs] = match;
            
            if (tagName === 'UniversalPage') {
                fileGhosts.add('Uses UniversalPage Legacy');
                fileHasGhosts = true;
            }
            
            if (tagName.toLowerCase() === tagName) {
                const classMatch = attrs.match(classNameRegex);
                let classes = '';
                if (classMatch) {
                    classes = classMatch[1] || classMatch[2] || classMatch[3] || '';
                }
                
                const ghosts = [];
                if (classes.includes('text-sdp-text-main')) ghosts.push('text-sdp-text-main');
                if (classes.includes('bg-sdp-bg-panel')) ghosts.push('bg-sdp-bg-panel');
                if (classes.includes('text-sdp-text-muted')) ghosts.push('text-sdp-text-muted');
                if (classes.includes('border-sdp-border-master')) ghosts.push('border-sdp-border-master');
                if (classes.includes('bg-sdp-bg-app')) ghosts.push('bg-sdp-bg-app');
                if (classes.includes('text-theme-text')) ghosts.push('text-theme-text');
                if (classes.includes('bg-theme-base')) ghosts.push('bg-theme-base');
                
                if (ghosts.length > 0) {
                    ghosts.forEach(g => fileGhosts.add(g));
                    ghostCount += ghosts.length;
                    fileHasGhosts = true;
                }
            }
        }
        
        if (fileHasGhosts || content.includes('UniversalPage')) {
            results.push({
                File: relativePath,
                GhostCount: ghostCount,
                GhostTypes: Array.from(fileGhosts).join(' | ')
            });
        }
    });
});

results.sort((a, b) => b.GhostCount - a.GhostCount);

const OUTPUT_CSV = path.join(__dirname, '../docs/auditories/20260622_global_deep_audit.csv');
const csvHeaders = ['File', 'Ghost_Class_Count', 'Ghost_Types'].join(';');
const csvRows = results.map(r => `${r.File};${r.GhostCount};${r.GhostTypes}`);
fs.writeFileSync(OUTPUT_CSV, [csvHeaders, ...csvRows].join('\n'));

console.log(`Auditoria Global completada. Fitxers analitzats: ${results.length} fitxers amb fantasmes.`);
console.log(`Guardat a: ${OUTPUT_CSV}`);

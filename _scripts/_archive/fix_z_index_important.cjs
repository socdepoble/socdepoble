const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const targetDir = path.join(__dirname, '../src');

function walk(dir, callback) {
    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walk(fullPath, callback);
        } else {
            callback(fullPath);
        }
    });
}

function mapZIndex(numPart) {
    const num = parseInt(numPart, 10);
    if (num >= 900) return 'max';
    if (num >= 600) return 'toast';
    if (num >= 500) return 'modal';
    if (num >= 400) return 'sidebar';
    if (num >= 300) return 'overlay';
    if (num >= 200) return 'sticky';
    if (num >= 100) return 'dropdown';
    return num.toString();
}

walk(targetDir, (filePath) => {
    if (filePath.endsWith('.css')) {
        let content = fs.readFileSync(filePath, 'utf8');
        let newContent = content.replace(/!important/g, '');
        if (content !== newContent) {
            fs.writeFileSync(filePath, newContent);
            console.log(`Removed !important from ${filePath}`);
        }
    }
    
    if (filePath.endsWith('.jsx') || filePath.endsWith('.tsx')) {
        let content = fs.readFileSync(filePath, 'utf8');
        let newContent = content.replace(/z-\[([0-9]+)\]/g, (match, numPart) => {
            return `z-${mapZIndex(numPart)}`;
        });
        if (content !== newContent) {
            fs.writeFileSync(filePath, newContent);
            console.log(`Mapped z-index in ${filePath}`);
        }
    }
});

console.log("Cleanup complete!");

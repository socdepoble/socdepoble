const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const outputFile = path.join(__dirname, 'auditorias', 'CONTEXTO_COMPLETO_CODIGO_FUENTE.txt');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

console.log("Generant l'arxiu de context global...");
let dump = "=== ARQUITECTURA SÓC DE POBLE (Versió Lliure de Dependències Circulars i God Objects) ===\n\n";

walkDir(srcDir, (filePath) => {
    if (filePath.endsWith('.js') || filePath.endsWith('.jsx')) {
        const relativePath = path.relative(__dirname, filePath);
        dump += `\n\n// =====================================\n// ARXIU: ${relativePath}\n// =====================================\n\n`;
        dump += fs.readFileSync(filePath, 'utf8');
    }
});

fs.writeFileSync(outputFile, dump, 'utf8');
console.log("✅ Contextual dump completat: auditorias/CONTEXTO_COMPLETO_CODIGO_FUENTE.txt (" + Math.round(dump.length/1024) + " KB)");

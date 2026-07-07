import fs from 'fs';
import path from 'path';

// Constants
const SRC_DIR = './src/features';
const MIN_LINES_FOR_EVOLUTION = 50; 
const WARNING_ONLY = true; // Actitud permissiva inicial, no tanca amb Error.
const TOXIC_PATTERNS = [/FIXME/g, /HACK/g, /TODO:\s*(?:ugly|malament|temporal|així no)/gi];

console.log('🧬 Iniciant Auditoria Genètica Positiva...\n');

let issuesFound = 0;

function walkDir(dir, callback) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

function checkEvolutionDocs(filePath) {
  // Check for components
  if (filePath.endsWith('.jsx') || filePath.endsWith('.tsx')) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n').length;
    
    if (lines >= MIN_LINES_FOR_EVOLUTION) {
      const dirName = path.dirname(filePath);
      const evolutionPath = path.join(dirName, 'EVOLUTION.md');
      
      if (!fs.existsSync(evolutionPath)) {
        console.warn(`🛡️  FRAGILITAT: El component \`${path.basename(filePath)}\` mesura ${lines} línies però no té un historial d'evolució (EVOLUTION.md) al seu panell lateral.`);
        issuesFound++;
      } else {
        // Parse EVOLUTION.md
        const evoContent = fs.readFileSync(evolutionPath, 'utf-8');
        if (!evoContent.includes('iso_id') || !evoContent.includes('type')) {
           console.warn(`⚠️  ESTRUCTURA TÒXICA: L'EVOLUTION.md de \`${path.basename(filePath)}\` no segueix el l'esquema ISO-POSITIVE_SCHEMA.md. Falta meta iso_id o type.`);
           issuesFound++;
        }
      }
    }
  }
}

function checkToxicity(filePath) {
    if (!filePath.endsWith('.js') && !filePath.endsWith('.jsx') && !filePath.endsWith('.css')) return;
    
    const content = fs.readFileSync(filePath, 'utf-8');
    TOXIC_PATTERNS.forEach(pattern => {
        const matches = content.match(pattern);
        if (matches) {
            console.warn(`☣️  DEUTE TÒXIC: Trobat patró agressiu o de frustració (${matches[0]}) a \`${filePath}\`. Genera un "Anticòs" al teu EVOLUTION.md i extirpa aquesta ansietat.`);
            issuesFound++;
        }
    });
}

walkDir(SRC_DIR, (filePath) => {
    checkEvolutionDocs(filePath);
    checkToxicity(filePath);
});

console.log(`\n📋 Resum de l'Auditoria Genètica: ${issuesFound} advertiments.`);

if (issuesFound > 0 && !WARNING_ONLY) {
   console.error('\n💥 El codi genètic no pot avançar amb aquests errors estructurals. (Sortida 1)');
   process.exit(1);
} else if (issuesFound > 0 && WARNING_ONLY) {
   console.log('\n🟢 Proceeding. (El mode WARNING_ONLY prevé aturar el procés per ara, permetent acoblament gradual).');
   process.exit(0);
} else {
   console.log('✅ El codi presenta un genotip resilient excel·lent. Totes les defenses en ordre.');
   process.exit(0);
}

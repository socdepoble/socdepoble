const fs = require('fs');
const path = require('path');

const WIKI_DIR = path.join(__dirname, '../_wiki_de_poble');
const HISTORIC_DIR = '10_arxiu_historic';

let errors = 0;
const allWikiFiles = [];

// Recopilar tots els fitxers .md
function gatherFiles(dir) {
    if (dir.includes(HISTORIC_DIR)) return;
    
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            gatherFiles(fullPath);
        } else if (file.endsWith('.md') && !file.includes('macro_wiki') && !file.includes('vibe_report') && file !== 'SKILL.md') {
            allWikiFiles.push(fullPath);
        }
    }
}

gatherFiles(WIKI_DIR);

const fileBasenames = allWikiFiles.map(f => path.basename(f).replace('.md', ''));

console.log(`[WIKI INTEGRITY] Iniciant auditoria de ${allWikiFiles.length} fitxers...`);

allWikiFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf-8');
    
    // 1. Validar paraula prohibida "masia"
    const masiaRegex = /\bmasia\b/gi;
    let match;
    while ((match = masiaRegex.exec(content)) !== null) {
        const context = content.substring(Math.max(0, match.index - 20), Math.min(content.length, match.index + 20));
        if (!context.includes('prohibit') && !context.includes('cancer')) {
            console.error(`❌ [TERME PROHIBIT] Al fitxer ${path.basename(file)}: s'ha detectat la paraula "masia". Usa "El Mas".`);
            errors++;
        }
    }

    // 2. Validar enllaços trencats [[Link]]
    const linkRegex = /\[\[(.*?)\]\]/g;
    let linkMatch;
    while ((linkMatch = linkRegex.exec(content)) !== null) {
        const target = linkMatch[1];
        const targetFile = target.split('|')[0].trim();
        
        if (!fileBasenames.includes(targetFile) && !fileBasenames.includes(targetFile.replace('.md', ''))) {
            console.error(`❌ [ENLLAÇ TRENCAT] Al fitxer ${path.basename(file)}: l'enllaç [[${targetFile}]] no apunta a cap arxiu conegut.`);
            errors++;
        }
    }
});

if (errors > 0) {
    console.error(`\n🚨 [SOSP-LOCK ACTIU] L'auditoria ha fallat amb ${errors} errors. Corregiu-los immediatament.`);
    process.exit(1);
} else {
    console.log(`\n✅ [TRELLAT 100%] La Wiki és purpurina i està lliure de càncer. Zero enllaços trencats.`);
}

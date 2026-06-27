const fs = require('fs');
const path = require('path');

const WIKI_DIR = path.join(__dirname, '..', '_wiki_de_poble');

function getAllMdFiles(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(getAllMdFiles(file));
        } else if (file.endsWith('.md')) {
            results.push(file);
        }
    });
    return results;
}

const allFiles = getAllMdFiles(WIKI_DIR);
// Creem un set amb els noms de fitxers base (sense .md) per fer link matching ràpid.
const validLinkTargets = new Set();
allFiles.forEach(f => {
    const basename = path.basename(f, '.md');
    validLinkTargets.add(basename);
});

console.log(`🔎 Auditant ${allFiles.length} fitxers .md buscant enllaços trencats...`);

let brokenLinksCount = 0;

allFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf-8');
    const linkRegex = /\[\[(.*?)\]\]/g;
    let match;
    while ((match = linkRegex.exec(content)) !== null) {
        // Obsidian links can be [[Target|Alias]]
        let target = match[1].split('|')[0].trim();
        
        // Remove heading anchors if present: [[Target#Heading]]
        target = target.split('#')[0].trim();

        if (!validLinkTargets.has(target)) {
            console.log(`❌ Enllaç trencat a: ${path.relative(WIKI_DIR, file)} -> [[${target}]]`);
            brokenLinksCount++;
        }
    }
});

console.log(`\n🏁 Resultat: ${brokenLinksCount} enllaços trencats trobats.`);

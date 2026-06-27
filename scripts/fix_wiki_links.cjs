const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');

function getAllMdFiles(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory()) {
            if (!['node_modules', '.git', 'dist', 'build', '.obsidian'].includes(file)) {
                results = results.concat(getAllMdFiles(fullPath));
            }
        } else if (fullPath.endsWith('.md')) {
            results.push(fullPath);
        }
    });
    return results;
}

const allFiles = getAllMdFiles(ROOT_DIR);
const validLinkTargets = new Map();

allFiles.forEach(f => {
    const basename = path.basename(f, '.md');
    validLinkTargets.set(basename.toLowerCase(), basename);
});

console.log(`🔎 Auditant ${allFiles.length} fitxers .md en tot el projecte buscant enllaços trencats...`);

const fixes = {};

allFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf-8');
    let originalContent = content;
    const linkRegex = /\[\[(.*?)\]\]/g;
    let match;
    let modified = false;

    while ((match = linkRegex.exec(originalContent)) !== null) {
        let fullTarget = match[1];
        let target = fullTarget.split('|')[0].trim();
        target = target.split('#')[0].trim();

        if (!validLinkTargets.has(target.toLowerCase())) {
            // Fuzzy match: try to find something that contains this string or is very similar
            let bestMatch = null;
            for (const [lower, actual] of validLinkTargets.entries()) {
                if (lower.includes(target.toLowerCase()) || target.toLowerCase().includes(lower)) {
                    bestMatch = actual;
                    break;
                }
            }

            // Special cases
            if (target === 'Trellat' || target === 'El Trellat') bestMatch = 'El_Trellat';
            if (target === 'Ment Colmena') bestMatch = 'Ment_Colmena_Integral';
            if (target === 'Les Petorretes') bestMatch = 'Els 10 Manaments'; // Not sure, maybe 10_acta_marmota? Or Les_Petorretes?

            if (bestMatch) {
                console.log(`🛠️ Arreglant: [[${target}]] -> [[${bestMatch}|${target}]] en ${path.relative(ROOT_DIR, file)}`);
                // Replace in content
                content = content.replace(`[[${fullTarget}]]`, `[[${bestMatch}|${target}]]`);
                modified = true;
            } else {
                console.log(`❌ Trencat (Sense solució fàcil): [[${target}]] en ${path.relative(ROOT_DIR, file)}`);
            }
        }
    }

    if (modified) {
        fs.writeFileSync(file, content, 'utf-8');
    }
});

// Neteja de fitxers fantasma sense extensió creats per Obsidian
['11_acta_marmota', '00_index', 'health-index'].forEach(ghost => {
    const p = path.join(ROOT_DIR, '_wiki_de_poble', ghost);
    if (fs.existsSync(p)) {
        const stat = fs.statSync(p);
        if (!stat.isDirectory()) {
            fs.unlinkSync(p);
            console.log(`🗑️ Eliminat fitxer fantasma d'Obsidian: ${p}`);
        }
    }
});

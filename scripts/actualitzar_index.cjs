const fs = require('fs');
const path = require('path');

const WIKI_DIR = path.join(__dirname, '..', '_wiki_de_poble');
const INDEX_FILE = path.join(WIKI_DIR, '00_index.md');

const HEADER = `# Wiki de Poble

![Logo de la Wiki](assets/nano_porta_del_mas.png)

Benvinguts al cervell de *Sóc de Poble*. Ací resideixen les regles absolutes, la identitat tècnica i el [[el_trellat|Trellat]]. És el cervell on es guarda tota la memòria, els sentiments de l'arquitectura i la lògica de la màquina, explicada fins a on arriben les paraules.

Aquesta taula de continguts reflecteix l'estructura exacta de les carpetes, ordenades per capítols per a una lectura completament orgànica, tant per a humans com per a IAs.

---

`;

const FOOTER = `
---
*(Aquest índex s'ha actualitzat automàticament mitjançant \`scripts/actualitzar_index.js\` per garantir que el llibre mai quede desactualitzat).*
`;

function parseDirName(dir) {
    // Ex: "01_identitat_iaia" -> "01. Identitat Iaia"
    const match = dir.match(/^(\d+)_+(.*)$/);
    if (!match) return dir;
    const num = match[1];
    const name = match[2].split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    return `${num}. ${name}`;
}

function generateIndex() {
    let content = HEADER;
    
    const items = fs.readdirSync(WIKI_DIR, { withFileTypes: true });
    
    // Filtrem només carpetes numèriques (ex: 00_arxiu, 01_governitat, etc.) i ignorem l'històric
    const dirs = items
        .filter(item => item.isDirectory() && /^\d\d_/.test(item.name) && item.name !== '10_arxiu_historic')
        .map(item => item.name)
        .sort();

    for (const dir of dirs) {
        content += `## ${parseDirName(dir)}\n`;
        const dirPath = path.join(WIKI_DIR, dir);
        
        let files = [];
        const dirItems = fs.readdirSync(dirPath, { withFileTypes: true });
        for (const item of dirItems) {
            if (item.isFile() && item.name.endsWith('.md') && !item.name.includes('macro_wiki') && !item.name.includes('asiatic_audit')) {
                files.push(item.name);
            } else if (item.isDirectory() && dir === '05_skills_ia') {
                const skillFile = path.join(dirPath, item.name, 'SKILL.md');
                if (fs.existsSync(skillFile)) {
                    files.push(`${item.name}/SKILL.md`);
                }
            }
        }
        files.sort();
            
        if (files.length === 0) {
            content += `*(Buit)*\n\n`;
            continue;
        }

        for (const file of files) {
            if (file.endsWith('/SKILL.md')) {
                const skillName = file.split('/')[0];
                content += `- [[05_skills_ia/${skillName}/SKILL|${skillName}]]\n`;
            } else {
                const fileNameWithoutExt = file.replace(/\.md$/, '');
                content += `- [[${fileNameWithoutExt}]]\n`;
            }
        }
        content += `\n`;
    }

    content += FOOTER;
    fs.writeFileSync(INDEX_FILE, content, 'utf-8');
    console.log(`✅ Índex actualitzat a: ${INDEX_FILE}`);
}

generateIndex();

const fs = require('fs');
const path = require('path');

const WIKI_ROOT = path.join(__dirname, '../../');

const CANONICAL_TAGS = [
    'trellat', 'pedra_seca', 'termodinamica', 'identitat', 
    'ia', 'codi', 'crdt', 'auditoria', 'extern', 
    'seguretat', 'accessibilitat', 'legacy', 'govern', 'cultura', 'rural'
];

// Mapeig de directoris o tipus cap a etiquetes canòniques
const DEFAULT_TAGS = {
    '01_identitat_iaia': ['identitat', 'ia'],
    '02_filosofia': ['trellat'],
    '03_govern': ['govern', 'trellat'],
    '04_arquitectura_disseny': ['pedra_seca', 'codi'],
    '05_skills_ia': ['ia', 'codi'],
    '06_cultura': ['cultura', 'rural'],
    '10_actes': ['auditoria'],
    '11_recursos_ia': ['extern']
};

function getAllMarkdownFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        if (['node_modules', '.obsidian', '_backups', 'assets', 'logs', '.git', '99_maquinaria', '90_arxiu_historic'].includes(file)) continue;
        
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            getAllMarkdownFiles(fullPath, fileList);
        } else if (file.endsWith('.md')) {
            fileList.push(fullPath);
        }
    }
    return fileList;
}

function processFiles() {
    const files = getAllMarkdownFiles(WIKI_ROOT);
    let filesUpdated = 0;
    let emptyFilesDeleted = 0;

    for (const filePath of files) {
        // Eliminar fitxers buits (creats per Obsidian en clicar enllaços trencats)
        const stats = fs.statSync(filePath);
        if (stats.size === 0) {
            fs.unlinkSync(filePath);
            emptyFilesDeleted++;
            console.log(`Esborrat fitxer fantasma: ${filePath}`);
            continue;
        }

        let content = fs.readFileSync(filePath, 'utf8');
        let originalContent = content;

        // --- 1. ARREGLAR ETIQUETES ---
        const dirName = path.basename(path.dirname(filePath));
        const defaultTagsForDir = DEFAULT_TAGS[dirName] || ['trellat'];
        
        const match = content.match(/^---\n([\s\S]*?)\n---/);
        if (match) {
            const fmText = match[1];
            const lines = fmText.split('\n');
            
            let tagsStartIndex = -1;
            let tagsEndIndex = -1;
            
            // Buscar on està la clau tags:
            for (let i = 0; i < lines.length; i++) {
                if (lines[i].startsWith('tags:')) {
                    tagsStartIndex = i;
                    // Buscar on acaben els items de tags
                    for (let j = i + 1; j < lines.length; j++) {
                        if (lines[j].trim().startsWith('- ')) {
                            tagsEndIndex = j;
                        } else if (lines[j].trim() !== '') {
                            // Nova clau (ex: aliases:)
                            break;
                        }
                    }
                    if (tagsEndIndex === -1) tagsEndIndex = i; // tags: buit
                    break;
                }
            }
            
            let validTags = new Set();
            
            if (tagsStartIndex !== -1) {
                // Extreure tags existents
                for (let i = tagsStartIndex + 1; i <= tagsEndIndex; i++) {
                    let tag = lines[i].trim().substring(2).trim();
                    if (tag.startsWith('"') && tag.endsWith('"')) tag = tag.slice(1, -1);
                    if (tag.startsWith("'") && tag.endsWith("'")) tag = tag.slice(1, -1);
                    if (tag === '[]') continue;
                    
                    if (CANONICAL_TAGS.includes(tag)) {
                        validTags.add(tag);
                    }
                }
            }
            
            // Si no hi ha tags vàlids, aplicar els del directori
            if (validTags.size === 0) {
                defaultTagsForDir.forEach(t => validTags.add(t));
            }
            
            // Limitar a 3 etiquetes
            const finalTags = Array.from(validTags).slice(0, 3);
            
            const newTagsYaml = ['tags:'];
            for (const tag of finalTags) {
                newTagsYaml.push(`  - ${tag}`);
            }
            
            if (tagsStartIndex !== -1) {
                // Substituir el bloc antic
                lines.splice(tagsStartIndex, tagsEndIndex - tagsStartIndex + 1, ...newTagsYaml);
            } else {
                // Afegir tags al final del frontmatter si no existia
                lines.push(...newTagsYaml);
            }
            
            const newFmText = lines.join('\n');
            content = content.replace(match[1], newFmText);
        }

        // --- 2. ARREGLAR ENLLAÇOS ---
        // Obsidian wiki links: [[ruta/al/fitxer#seccio|Àlies]] -> [[fitxer#seccio|Àlies]]
        content = content.replace(/\[\[(.*?)\]\]/g, (match, inner) => {
            const parts = inner.split('|');
            let pathPart = parts[0];
            const aliasPart = parts.length > 1 ? '|' + parts[1] : '';
            
            const hashSplit = pathPart.split('#');
            let filePart = hashSplit[0];
            const hashPart = hashSplit.length > 1 ? '#' + hashSplit[1] : '';
            
            // Extraure només el nom del fitxer (sense directoris)
            const fileBasename = filePart.split('/').pop();
            
            return `[[${fileBasename}${hashPart}${aliasPart}]]`;
        });

        if (content !== originalContent) {
            fs.writeFileSync(filePath, content, 'utf8');
            filesUpdated++;
        }
    }
    console.log(`Neteja completada. Fitxers actualitzats: ${filesUpdated}. Fantasmes esborrats: ${emptyFilesDeleted}`);
}

processFiles();

const fs = require('fs');
const path = require('path');

const WIKI_ROOT = path.join(__dirname, '../../');

const CANONICAL_TAGS = [
    'trellat', 'pedra_seca', 'termodinamica', 'identitat', 
    'ia', 'codi', 'crdt', 'auditoria', 'extern', 
    'seguretat', 'accessibilitat', 'legacy', 'govern'
];

const TAG_MAP = {
    'historia': 'identitat',
    'rural': 'identitat',
    'cultura': 'identitat',
    'llengua': 'identitat',
    
    'css': 'codi',
    'tailwind': 'codi',
    'preact': 'codi',
    'web_components': 'codi',
    'setDefaults': null, // Brossa
    
    'petorretes': 'ia',
    'autopoiesi': 'ia',
    'aprenentatge': 'ia',
    
    'filosofia': 'trellat',
    
    'crdt_offline': 'crdt',
    
    'rendiment': 'termodinamica',
    
    'norma': 'govern',
    
    'revisio': 'auditoria',
    
    'usabilitat': 'accessibilitat',
    
    'comunitat': 'extern',
    
    'arxivat': null // Ja és a 'estat'
};

function getAllMarkdownFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        if (['node_modules', '.obsidian', '_backups', 'assets', 'logs', '.git'].includes(file)) continue;
        
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            getAllMarkdownFiles(fullPath, fileList);
        } else if (file.endsWith('.md')) {
            fileList.push(fullPath);
        }
    }
    return fileList;
}

function processTags() {
    const files = getAllMarkdownFiles(WIKI_ROOT);
    let filesUpdated = 0;

    for (const filePath of files) {
        const content = fs.readFileSync(filePath, 'utf8');
        const match = content.match(/^---\n([\s\S]*?)\n---/);
        if (!match) continue;
        
        const fmText = match[1];
        const lines = fmText.split('\n');
        
        let tagsStartIndex = -1;
        let tagsEndIndex = -1;
        
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].trim() === 'tags:') {
                tagsStartIndex = i;
                for (let j = i + 1; j < lines.length; j++) {
                    if (lines[j].trim().startsWith('- ')) {
                        tagsEndIndex = j;
                    } else if (lines[j].trim() !== '') {
                        break;
                    }
                }
                break;
            }
        }
        
        if (tagsStartIndex !== -1 && tagsEndIndex !== -1) {
            const oldTags = [];
            for (let i = tagsStartIndex + 1; i <= tagsEndIndex; i++) {
                if (lines[i].trim().startsWith('- ')) {
                    oldTags.push(lines[i].trim().substring(2).trim());
                }
            }
            
            const newTags = new Set();
            for (let tag of oldTags) {
                if (tag.startsWith('"') && tag.endsWith('"')) tag = tag.slice(1, -1);
                if (tag.startsWith("'") && tag.endsWith("'")) tag = tag.slice(1, -1);
                
                if (TAG_MAP[tag] !== undefined) {
                    if (TAG_MAP[tag] !== null) newTags.add(TAG_MAP[tag]);
                } else if (CANONICAL_TAGS.includes(tag)) {
                    newTags.add(tag);
                } else {
                    // Tag desconegut o no canònic, s'elimina si volem puresa absoluta
                    // O el mantenim? El mestre vol neteja absoluta.
                }
            }
            
            // Si es queda buit, afegim 'trellat' per defecte
            if (newTags.size === 0) newTags.add('trellat');
            
            // Limitem a màxim 5 etiquetes per evitar entropia
            const limitedTags = Array.from(newTags).slice(0, 5);
            
            const newTagsYaml = ['tags:'];
            for (const tag of limitedTags) {
                newTagsYaml.push(`  - ${tag}`);
            }
            
            const newLines = [
                ...lines.slice(0, tagsStartIndex),
                ...newTagsYaml,
                ...lines.slice(tagsEndIndex + 1)
            ];
            
            const newFmText = newLines.join('\n');
            const newContent = content.replace(match[1], newFmText);
            
            if (content !== newContent) {
                fs.writeFileSync(filePath, newContent, 'utf8');
                filesUpdated++;
            }
        }
    }
    console.log(`Etiquetes consolidades a 13 canòniques. Fitxers actualitzats: ${filesUpdated}`);
}

processTags();

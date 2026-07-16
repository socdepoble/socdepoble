/**
 * MIGRACIÓ A L'ARQUITECTURA DEEPSEEK (V5.0.3)
 */
const fs = require('fs');
const path = require('path');
const router = require('./entropia_zero_router.js');

const WIKI_ROOT = path.join(__dirname, '../../');

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

function parseFrontmatter(content) {
    const match = content.match(/^---\n([\s\S]*?)\n---/);
    if (!match) return null;
    
    const fm = {};
    const lines = match[1].split('\n');
    let currentArrayKey = null;

    for (const line of lines) {
        if (line.trim().startsWith('- ') && currentArrayKey) {
            let val = line.trim().substring(2).trim();
            if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
            fm[currentArrayKey].push(val);
            continue;
        }

        if (!line.includes(':')) continue;
        
        const [key, ...rest] = line.split(':');
        const cleanKey = key.trim();
        let value = rest.join(':').trim();
        
        if (value === '') {
            fm[cleanKey] = [];
            currentArrayKey = cleanKey;
            continue;
        }
        
        currentArrayKey = null;

        if (value.startsWith('[') && value.endsWith(']')) {
            value = value.substring(1, value.length - 1).split(',').map(s => s.trim()).filter(Boolean);
            fm[cleanKey] = value;
        } else if (!isNaN(value) && value !== '') {
            fm[cleanKey] = Number(value);
        } else if (value.startsWith('"') && value.endsWith('"')) {
            fm[cleanKey] = value.substring(1, value.length - 1);
        } else {
            fm[cleanKey] = value;
        }
    }
    return { fm, fullMatch: match[0], content };
}

function convertFrontmatterToYaml(fm) {
    let yaml = '---\n';
    
    for (const prop of router.CORE_PROPS) {
        if (fm[prop] !== undefined) {
            if (Array.isArray(fm[prop])) {
                if (fm[prop].length === 0) {
                    yaml += `${prop}: []\n`;
                } else {
                    yaml += `${prop}:\n`;
                    for (const item of fm[prop]) {
                        yaml += `  - ${item}\n`;
                    }
                }
            } else {
                yaml += `${prop}: ${fm[prop]}\n`;
            }
        }
    }
    
    for (const prop of router.GOV_PROPS) {
        if (fm[prop] !== undefined) {
            yaml += `${prop}: ${fm[prop]}\n`;
        }
    }
    yaml += '---';
    return yaml;
}

function inferirTipus(oldFm, fileName) {
    const rol = oldFm.rol || '';
    const cat = oldFm.category || '';
    const estat = oldFm.estat || '';
    const tags = Array.isArray(oldFm.tags) ? oldFm.tags : [];

    if (estat === 'arxivat') return 'arxiu';

    const lookFor = (val) => {
        return rol === val || cat === val || tags.includes(val) || fileName.toLowerCase().includes(val);
    };

    if (lookFor('identitat')) return 'identitat';
    if (lookFor('cultura')) return 'cultura';
    if (lookFor('plantilla') || lookFor('plantilles')) return 'plantilla';
    if (lookFor('acta') || lookFor('actes') || lookFor('memoria') || fileName.includes('ACTA_')) return 'acte';
    if (lookFor('arquitectura')) return 'arquitectura';
    if (lookFor('disseny')) return 'disseny';
    if (lookFor('govern')) return 'directriu';
    if (lookFor('filosofia')) return 'filosofia';
    if (lookFor('skill')) return 'skill';
    
    const allowedTypes = ['directriu', 'norma', 'protocol', 'skill', 'schema', 'script', 'eina', 'capacitat'];
    for (const t of allowedTypes) {
        if (lookFor(t)) return t;
    }

    if (fileName.includes('ADR')) return 'arquitectura';
    if (fileName.includes('INFORME')) return 'acte';
    
    return 'directriu'; 
}

function processFiles() {
    const files = getAllMarkdownFiles(WIKI_ROOT);
    let success = 0;
    let errors = 0;

    for (const filePath of files) {
        try {
            const fileContent = fs.readFileSync(filePath, 'utf8');
            const parsed = parseFrontmatter(fileContent);
            
            if (!parsed) continue;

            const oldFm = parsed.fm;
            const newFm = {};

            const directProps = ['id', 'name', 'version', 'created_at', 'autor', 'macro_regio', 'tags', 'estat', 'related', 'aliases'];
            for (const prop of directProps) {
                if (oldFm[prop] !== undefined) newFm[prop] = oldFm[prop];
            }

            const fileName = path.basename(filePath);
            newFm.tipus = inferirTipus(oldFm, fileName);

            const govTypes = ['directriu', 'norma', 'protocol'];
            if (govTypes.includes(newFm.tipus)) {
                if (oldFm.tier !== undefined) newFm.tier = oldFm.tier;
                if (oldFm.pes_regla !== undefined) newFm.pes_regla = oldFm.pes_regla;
            }

            if (Array.isArray(newFm.related) && newFm.related.length > 5) {
                newFm.related = newFm.related.slice(0, 5);
            }

            const now = new Date();
            const timestamp = `${String(now.getFullYear()).slice(2)}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;
            newFm.updated_at = timestamp;

            const destFolder = path.join(WIKI_ROOT, router.determinarCarpeta(newFm));
            if (!fs.existsSync(destFolder)) {
                fs.mkdirSync(destFolder, { recursive: true });
            }

            const newPath = path.join(destFolder, fileName);
            
            const newYamlBlock = convertFrontmatterToYaml(newFm);
            const newContent = fileContent.replace(parsed.fullMatch, newYamlBlock);

            if (filePath !== newPath) {
                fs.writeFileSync(newPath, newContent, 'utf8');
                fs.unlinkSync(filePath);
                console.log(`Mogut: ${fileName} -> ${router.determinarCarpeta(newFm)}`);
            } else {
                fs.writeFileSync(filePath, newContent, 'utf8');
                console.log(`Actualitzat: ${fileName}`);
            }
            success++;

        } catch (e) {
            console.error(`Error processant ${filePath}: ${e.message}`);
            errors++;
        }
    }
    
    console.log(`\nMigració completada! Processats amb èxit: ${success}. Errors: ${errors}`);
}

processFiles();

/**
 * MIGRACIÓ A L'ARQUITECTURA QWEN (V5.0.2)
 * Aquest script llegeix tots els fitxers Markdown, adapta el frontmatter
 * i els mou a la seua carpeta canònica segons la Taula d'Enrutament.
 */
const fs = require('fs');
const path = require('path');
const router = require('./entropia_zero_router.js');

const WIKI_ROOT = path.join(__dirname, '../../');

function getAllMarkdownFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        // Ignorar carpetes especials
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
    
    const yamlLines = match[1].split('\n');
    const fm = {};
    for (const line of yamlLines) {
        if (!line.includes(':')) continue;
        const [key, ...rest] = line.split(':');
        let value = rest.join(':').trim();
        if (value.startsWith('[') && value.endsWith(']')) {
            value = value.substring(1, value.length - 1).split(',').map(s => s.trim()).filter(Boolean);
        } else if (!isNaN(value) && value !== '') {
            value = Number(value);
        } else if (value.startsWith('"') && value.endsWith('"')) {
            value = value.substring(1, value.length - 1);
        }
        fm[key.trim()] = value;
    }
    return { fm, fullMatch: match[0], content };
}

function convertFrontmatterToYaml(fm) {
    let yaml = '---\n';
    
    // Escriure primer les propietats Core en ordre
    for (const prop of router.CORE_PROPS) {
        if (fm[prop] !== undefined) {
            if (Array.isArray(fm[prop])) {
                yaml += `${prop}: [${fm[prop].join(', ')}]\n`;
            } else {
                yaml += `${prop}: ${fm[prop]}\n`;
            }
        } else if (prop === 'version' || prop === 'related' || prop === 'tags') {
             // Valors per defecte si falten i són obligatoris per al schema pur
             if (prop === 'version') yaml += `version: 1.0.0\n`;
             if (prop === 'related') yaml += `related: []\n`;
             if (prop === 'tags') yaml += `tags: []\n`;
        }
    }
    
    // Escriure propietats opcionals de governança
    for (const prop of router.GOV_PROPS) {
        if (fm[prop] !== undefined) {
            yaml += `${prop}: ${fm[prop]}\n`;
        }
    }
    yaml += '---';
    return yaml;
}

function inferirTipus(oldFm) {
    const rol = oldFm.rol || '';
    const cat = oldFm.category || '';
    const estat = oldFm.estat || '';

    if (estat === 'arxivat') return 'arxiu';
    if (cat === 'identitat') return 'identitat';
    if (cat === 'cultura') return 'cultura';
    if (cat === 'plantilles') return 'plantilla';
    if (rol === 'acta' || cat === 'actes' || rol === 'memoria') return 'acte';
    if (cat === 'arquitectura' && rol === 'directriu') return 'arquitectura';
    if (cat === 'disseny') return 'disseny';
    
    const allowedTypes = ['directriu', 'norma', 'protocol', 'skill', 'schema', 'script', 'eina'];
    if (allowedTypes.includes(rol)) return rol;
    if (allowedTypes.includes(cat)) return cat;

    return rol || cat || 'directriu'; // Fallback
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

            // Mantenir propietats directes
            const directProps = ['id', 'name', 'version', 'created_at', 'authority', 'macro_regio', 'tags', 'estat', 'related'];
            for (const prop of directProps) {
                if (oldFm[prop] !== undefined) newFm[prop] = oldFm[prop];
            }

            // Derivar nou 'tipus'
            newFm.tipus = inferirTipus(oldFm);

            // Mantenir Govern només si aplica
            const govTypes = ['directriu', 'norma', 'protocol'];
            if (govTypes.includes(newFm.tipus)) {
                if (oldFm.tier !== undefined) newFm.tier = oldFm.tier;
                if (oldFm.pes_regla !== undefined) newFm.pes_regla = oldFm.pes_regla;
            }

            // Limitar 'related' a 5 màxim (com volia Vibe/Dola)
            if (Array.isArray(newFm.related) && newFm.related.length > 5) {
                newFm.related = newFm.related.slice(0, 5);
            }

            // Actualitzar updated_at
            const now = new Date();
            const timestamp = `${String(now.getFullYear()).slice(2)}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;
            newFm.updated_at = timestamp;

            // Validar
            const errs = router.validarFrontmatter(newFm);
            if (errs.length > 0) {
                console.warn(`[WARN] Frontmatter incomplet a ${path.basename(filePath)}:`, errs);
                // Si falta id o name no s'atura, l'script fa el possible, però per seguretat l'apuntem
            }

            // Derivar ruta i moure
            const destFolder = path.join(WIKI_ROOT, router.determinarCarpeta(newFm));
            if (!fs.existsSync(destFolder)) {
                fs.mkdirSync(destFolder, { recursive: true });
            }

            const fileName = path.basename(filePath);
            const newPath = path.join(destFolder, fileName);
            
            // Generar nou contingut
            const newYamlBlock = convertFrontmatterToYaml(newFm);
            const newContent = fileContent.replace(parsed.fullMatch, newYamlBlock);

            // Escriure i esborrar l'antic (si ha canviat de lloc)
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

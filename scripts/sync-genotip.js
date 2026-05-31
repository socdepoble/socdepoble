import fs from 'fs';
import path from 'path';

const KNOWLEDGE_DIR = '/Users/javillinares/.gemini/antigravity-ide/knowledge';
const PLUGINS_DIR = '/Users/javillinares/.gemini/config/plugins';
const OUTPUT_FILE = path.join(process.cwd(), 'src/data/genotip_registry.json');

function scanDirectoryForMd(dir) {
    let results = [];
    if (!fs.existsSync(dir)) return results;
    
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        
        if (stat && stat.isDirectory()) {
            results = results.concat(scanDirectoryForMd(fullPath));
        } else if (file.endsWith('.md')) {
            results.push(fullPath);
        }
    });
    return results;
}

function processSkills() {
    console.log('[GENOTIP] Iniciant extracció de Skills de la IA...');
    const allMdFiles = [
        ...scanDirectoryForMd(KNOWLEDGE_DIR),
        ...scanDirectoryForMd(PLUGINS_DIR)
    ];

    const registry = [];

    allMdFiles.forEach(filePath => {
        try {
            const content = fs.readFileSync(filePath, 'utf-8');
            const filename = path.basename(filePath, '.md');
            
            // Ignorar arxius buits o innecessaris
            if (!content || content.trim() === '') return;
            if (filename.toLowerCase() === 'readme' || filename.toLowerCase() === 'instructions') return;

            // Extraure el títol (assumim el primer H1 o el nom de l'arxiu)
            let title = filename.replace(/_/g, ' ').replace(/-/g, ' ');
            const titleMatch = content.match(/^#\s+(.+)$/m);
            if (titleMatch && titleMatch[1]) {
                title = titleMatch[1].trim();
            }

            // Determinar l'autor i tipus basat en la ruta
            let author = 'Antigravity AI';
            let type = 'skill';
            let tags = ['#Genotip', '#IA'];

            if (filePath.includes('ai_forensic_personality') || filePath.includes('psiquiatria')) {
                author = 'Joan Batiste (Metge)';
                tags.push('#Psiquiatria');
            } else if (filePath.includes('soc_de_poble_project_philosophy')) {
                author = 'IAIA MarIA';
                tags.push('#Filosofia', '#Trellat');
            } else if (filePath.includes('architectural_patterns')) {
                author = 'Mestre d\'Obres';
                tags.push('#Arquitectura', '#P2P');
            } else if (filePath.includes('plugins')) {
                author = 'Mixa (DevTools)';
                tags.push('#Eines', '#Plugins');
            }

            registry.push({
                id: `genotip-${filename.toLowerCase()}`,
                title: title,
                content: content,
                author: author,
                type: type,
                tags: tags,
                source_path: filePath,
                updated_at: fs.statSync(filePath).mtime.toISOString()
            });

        } catch (err) {
            console.error(`[GENOTIP] Error processant ${filePath}:`, err);
        }
    });

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(registry, null, 2));
    console.log(`[GENOTIP] Extracció completada. ${registry.length} skills exportats a ${OUTPUT_FILE}`);
}

processSkills();

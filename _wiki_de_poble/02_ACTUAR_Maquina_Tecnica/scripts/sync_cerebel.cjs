const fs = require('fs');
const path = require('path');

const wikiDir = '/Users/javillinares/Documents/Antigravity/Sóc de Poble/_wiki_de_poble';
const knowledgeDir = '/Users/javillinares/.gemini/antigravity-ide/knowledge';

function copyRecursiveSync(src, dest) {
    const exists = fs.existsSync(src);
    const stats = exists && fs.statSync(src);
    const isDirectory = exists && stats.isDirectory();
    if (isDirectory) {
        if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
        fs.readdirSync(src).forEach(function(childItemName) {
            copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
        });
    } else {
        fs.copyFileSync(src, dest);
    }
}

function syncCerebel() {
    console.log("Iniciant sincronització de la Wiki cap al Cervell (Knowledge Items)...");
    
    const folders = fs.readdirSync(wikiDir).filter(f => fs.statSync(path.join(wikiDir, f)).isDirectory() && !f.startsWith('.'));
    
    folders.forEach(folder => {
        if (folder === 'scripts') return; // Skip scripts directory if we want
        
        const srcFolder = path.join(wikiDir, folder);
        const targetKiDir = path.join(knowledgeDir, folder);
        const targetArtifactsDir = path.join(targetKiDir, 'artifacts');
        
        console.log(`- Sincronitzant ${folder}...`);
        
        // Ensure KI structure
        if (!fs.existsSync(targetArtifactsDir)) {
            fs.mkdirSync(targetArtifactsDir, { recursive: true });
        }
        
        // Copy files
        copyRecursiveSync(srcFolder, targetArtifactsDir);
        
        // Create metadata.json
        const metadataPath = path.join(targetKiDir, 'metadata.json');
        if (!fs.existsSync(metadataPath)) {
            const metadata = {
                summary: `Sincronització automàtica del directori ${folder} de la Wiki d'Obsidian. Contingut fonamental per al sistema Sóc de Poble.`,
                references: [`_wiki_de_poble/${folder}`],
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                version: 1
            };
            fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
        } else {
            // Update timestamp
            try {
                const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
                metadata.updated_at = new Date().toISOString();
                fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
            } catch (e) {
                console.error(`Error actualitzant metadata de ${folder}:`, e);
            }
        }
    });
    
    // Check for root files (like 00_index.md) and put them in a core KI
    const rootFiles = fs.readdirSync(wikiDir).filter(f => f.endsWith('.md'));
    if (rootFiles.length > 0) {
        const rootKiDir = path.join(knowledgeDir, '00_core_wiki');
        const rootArtifactsDir = path.join(rootKiDir, 'artifacts');
        if (!fs.existsSync(rootArtifactsDir)) fs.mkdirSync(rootArtifactsDir, { recursive: true });
        
        rootFiles.forEach(file => {
            fs.copyFileSync(path.join(wikiDir, file), path.join(rootArtifactsDir, file));
        });
        
        const metadataPath = path.join(rootKiDir, 'metadata.json');
        if (!fs.existsSync(metadataPath)) {
            fs.writeFileSync(metadataPath, JSON.stringify({
                summary: `Fitxers arrel de la Wiki (índex, README, etc).`,
                references: [`_wiki_de_poble/ root files`],
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                version: 1
            }, null, 2));
        }
    }
    
    console.log("✅ Sincronització completada amb èxit.");
}

syncCerebel();

const fs = require('fs');
const path = require('path');

// Cerber: Script per a validar l'estat dels enllaços i evitar hardcodings
const wikiDir = path.join(__dirname, '..');

// 1. Validar enllaços [[Nom del Document]]
function validateLinks() {
  console.log("🔍 Iniciant Cerber: Verificació d'enllaços...");
  let brokenLinks = 0;
  
  // Recursivament llegir tots els .md
  const walkSync = (dir, filelist = []) => {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const filepath = path.join(dir, file);
      if (fs.statSync(filepath).isDirectory()) {
        filelist = walkSync(filepath, filelist);
      } else if (file.endsWith('.md')) {
        filelist.push(filepath);
      }
    }
    return filelist;
  };

  const mdFiles = walkSync(wikiDir);
  const linkRegex = /\[\[(.*?)\]\]/g;

  // Mapa de tots els documents per buscar referències
  const docNames = mdFiles.map(f => path.basename(f, '.md'));

  mdFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf-8');
    let match;
    while ((match = linkRegex.exec(content)) !== null) {
      let linkedDoc = match[1].split('|')[0].trim();
      // Eliminar el directori o subdirectori de la referència si en té, busquem per basename
      linkedDoc = path.basename(linkedDoc, '.md');
      
      if (!docNames.includes(linkedDoc) && linkedDoc !== 'SKILL') {
        console.warn(`[CERBER WARNING] Enllaç trencat a '${path.basename(file)}': [[${linkedDoc}]] no existeix.`);
        brokenLinks++;
      }
    }
  });

  if (brokenLinks === 0) {
    console.log("✅ Cerber: Tots els enllaços interns són vàlids.");
  } else {
    console.log(`❌ Cerber: S'han detectat ${brokenLinks} enllaços trencats.`);
  }
}

// Execució principal
validateLinks();

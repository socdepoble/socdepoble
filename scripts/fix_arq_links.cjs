const fs = require('fs');
const path = require('path');

function replaceInDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      replaceInDir(fullPath);
    } else if (fullPath.endsWith('.md')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;
      
      const toReplace = [
        ['[[arquitectura|', '[[arquitectura_tecnica|'],
        ['[[04_arquitectura_disseny/arquitectura|', '[[04_arquitectura_disseny/arquitectura_tecnica|'],
        ['[[arquitectura]]', '[[arquitectura_tecnica]]'],
        ['[[04_arquitectura_disseny/arquitectura]]', '[[04_arquitectura_disseny/arquitectura_tecnica]]']
      ];
      
      for (const [oldStr, newStr] of toReplace) {
        if (content.includes(oldStr)) {
          content = content.split(oldStr).join(newStr);
          changed = true;
        }
      }
      
      if (changed) {
        fs.writeFileSync(fullPath, content);
      }
    }
  }
}

replaceInDir(path.join(__dirname, '..', '_wiki_de_poble'));

// Add explicit backlinks to the 3 architecture files
const arqDir = path.join(__dirname, '..', '_wiki_de_poble', '04_arquitectura_disseny');

const backlinks = {
  'arquitectura_tecnica.md': `\n\n## 🔗 Veure també (Enllaços de Tornada)\n- [[04_arquitectura_disseny/pedra_seca|Pedra Seca (La Base Visual)]]\n- [[04_arquitectura_disseny/arquitectura_cognitiva|Arquitectura Cognitiva (La Ment)]]\n- [[01_identitat_iaia/soc_de_poble|Sóc de Poble]]\n`,
  'arquitectura_cognitiva.md': `\n\n## 🔗 Veure també (Enllaços de Tornada)\n- [[04_arquitectura_disseny/arquitectura_tecnica|Arquitectura Tècnica (El Cos)]]\n- [[04_arquitectura_disseny/pedra_seca|Pedra Seca (El Rostre)]]\n- [[01_identitat_iaia/perfil_psiquiatric|Perfil Psiquiàtric]]\n`,
  'pedra_seca.md': `\n\n## 🔗 Veure també (Enllaços de Tornada)\n- [[04_arquitectura_disseny/arquitectura_tecnica|Arquitectura Tècnica (La Infraestructura)]]\n- [[04_arquitectura_disseny/arquitectura_cognitiva|Arquitectura Cognitiva (El Cervell)]]\n- [[02_filosofia/el_trellat|El Trellat]]\n`
};

for (const [filename, linkText] of Object.entries(backlinks)) {
  const fPath = path.join(arqDir, filename);
  if (fs.existsSync(fPath)) {
    let content = fs.readFileSync(fPath, 'utf8');
    if (!content.includes('## 🔗 Veure també')) {
      fs.writeFileSync(fPath, content + linkText);
    }
  }
}

// Now let's update index.md explicitly if it still has the old link
const indexFile = path.join(__dirname, '..', '_wiki_de_poble', '00_index.md');
if (fs.existsSync(indexFile)) {
  let content = fs.readFileSync(indexFile, 'utf8');
  if (content.includes('[[arquitectura]]') || content.includes('[[arquitectura_tecnica]]')) {
      // Just to make sure it looks nice
  }
}

const fs = require('fs');
const path = require('path');

const WIKI = path.join(__dirname, '..', '_wiki_de_poble');
const EXCL = ['node_modules', '.git', 'scripts', 'assets', '_build'];

// Propietats permeses segons el schema central
const PERMESES = ['name', 'version', 'created_at', 'updated_at', 'authority', 'tipus', 'tags', 'description', 'aliases'];

function camina(dir) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach(n => {
    const p = path.join(dir, n);
    const st = fs.statSync(p);
    if (EXCL.includes(n)) return;
    if (st.isDirectory()) return camina(p);
    if (!n.endsWith('.md')) return;

    let contingut = fs.readFileSync(p, 'utf8');
    
    // Buscar si té frontmatter YAML
    const match = contingut.match(/^---\n([\s\S]*?)\n---/);
    if (match) {
      let fmLines = match[1].split('\n');
      let nouFmLines = [];
      let dinsDeLlista = false;
      
      for (let line of fmLines) {
        if (!line.trim()) continue;
        
        // Si estem processant una llista (ex: tags o aliases)
        if (line.startsWith('  -') || line.startsWith('   -')) {
           nouFmLines.push(line);
           continue;
        }

        const part = line.split(':');
        if (part.length > 1) {
          const clau = part[0].trim();
          // Ignorar propietats brossa com "CLAUSULA ABSOLUTA", "estat", "type", etc.
          if (PERMESES.includes(clau)) {
            nouFmLines.push(line);
            dinsDeLlista = (clau === 'tags' || clau === 'aliases') && !line.includes('['); 
          } else {
            dinsDeLlista = false; // Ignorar el contingut d'una clau invàlida
          }
        }
      }

      const nouFmBlock = `---\n${nouFmLines.join('\n')}\n---`;
      
      if (nouFmBlock !== `---\n${match[1]}\n---`) {
        const nouContingut = contingut.replace(/^---\n[\s\S]*?\n---/, nouFmBlock);
        fs.writeFileSync(p, nouContingut, 'utf8');
        console.log(`🧹 Frontmatter netejat a: ${path.relative(WIKI, p)}`);
      }
    }
  });
}

console.log('🧼 Iniciant la neteja de Frontmatters orfes...');
camina(WIKI);
console.log('✅ Frontmatters normalitzats.');

const fs = require('fs');
const path = require('path');

const WIKI = path.join(__dirname, '..', '_wiki_de_poble');
const EXCL = ['node_modules', '.git', 'scripts', 'assets', '_build'];

const CANONICS = [
  'bios', 'termodinamica', 'arquitectura', 'execucio', 'normativa', 
  'cultura', 'lexic', 'actes', 'auditoria', 'ia', 'visio', 'missio', 
  'organitzacio', 'ment_colmena', 'rural'
];

const MAPA = {
  'regles': 'normativa',
  'tecnica': 'arquitectura',
  'masia': 'rural',
  'socdepoble': 'rural',
  'identitat': 'bios',
  'agent': 'ia',
  'agents': 'ia',
  'frontend': 'arquitectura',
  'backend': 'arquitectura',
  'pwa': 'execucio',
  'offline': 'execucio',
  'crdt': 'execucio',
  'webrtc': 'execucio',
  'soci': 'organitzacio',
  'fadrins': 'cultura',
  'fadrines': 'cultura'
};

function camina(dir) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach(n => {
    const p = path.join(dir, n);
    const st = fs.statSync(p);
    if (EXCL.includes(n)) return;
    if (st.isDirectory()) return camina(p);
    if (!n.endsWith('.md')) return;

    let contingut = fs.readFileSync(p, 'utf8');
    const match = contingut.match(/^---\n([\s\S]*?)\n---/);
    if (match) {
      let fmLines = match[1].split('\n');
      let nouFmLines = [];
      let inTags = false;
      let tagsTrobats = new Set();
      
      for (let line of fmLines) {
        if (!line.trim()) continue;
        
        if (line.startsWith('tags:')) {
          inTags = true;
          // processar inline tags: [tag1, tag2]
          let inline = line.match(/\[(.*?)\]/);
          if (inline) {
            let tags = inline[1].split(',').map(t => t.trim().replace(/['"]/g, ''));
            tags.forEach(t => tagsTrobats.add(t));
            nouFmLines.push('tags:'); // prepare for list format
            continue;
          } else {
            nouFmLines.push('tags:');
            continue;
          }
        }
        
        if (inTags && (line.startsWith('  -') || line.startsWith('   -'))) {
          let t = line.replace(/[-\s'"]/g, '');
          tagsTrobats.add(t);
          continue;
        } else if (inTags && line.includes(':')) {
          inTags = false; // Fi dels tags
        }
        
        if (!inTags) {
          nouFmLines.push(line);
        }
      }

      let nousTags = new Set();
      tagsTrobats.forEach(t => {
        let tLow = t.toLowerCase();
        if (CANONICS.includes(tLow)) nousTags.add(tLow);
        else if (MAPA[tLow]) nousTags.add(MAPA[tLow]);
      });

      // Inserir els tags nous just on estava la clau tags
      let tagIndex = nouFmLines.findIndex(l => l === 'tags:');
      if (tagIndex !== -1) {
        let tagsArr = Array.from(nousTags);
        if (tagsArr.length === 0) {
          nouFmLines.splice(tagIndex, 1); // eliminar si no hi ha tags
        } else {
          let tagsYAML = tagsArr.map(t => `  - ${t}`);
          nouFmLines.splice(tagIndex + 1, 0, ...tagsYAML);
        }
      }

      const nouFmBlock = `---\n${nouFmLines.join('\n')}\n---`;
      
      if (nouFmBlock !== `---\n${match[1]}\n---`) {
        const nouContingut = contingut.replace(/^---\n[\s\S]*?\n---/, nouFmBlock);
        fs.writeFileSync(p, nouContingut, 'utf8');
        console.log(`🏷️ Tags purgats a: ${path.basename(p)}`);
      }
    }
  });
}

console.log('🏷️ Iniciant la purga i mapeig de tags...');
camina(WIKI);
console.log('✅ Tots els tags han sigut reduïts a la llista canònica de 15.');

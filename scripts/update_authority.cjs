const fs = require('fs');
const path = require('path');

const WIKI = path.join(__dirname, '..', '_wiki_de_poble');
const EXCL = ['node_modules', '.git', 'scripts', 'assets', '_build'];

function camina(dir) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach(n => {
    const p = path.join(dir, n);
    if (EXCL.includes(n)) return;
    if (fs.statSync(p).isDirectory()) return camina(p);
    if (!n.endsWith('.md')) return;

    let contingut = fs.readFileSync(p, 'utf8');
    let modified = false;
    
    // Substituïm només dins del frontmatter
    const match = contingut.match(/^---\n([\s\S]*?)\n---/);
    if (match) {
        let fm = match[1];
        // Si l'autoritat conté "Consell" (siga de 11 o 12 IAs) ho passem a "Petorretes i Javi" per estalviar tokens
        if (/authority:\s*['"]?.*Consell.*['"]?/i.test(fm)) {
            const newFm = fm.replace(/authority:\s*['"]?.*Consell.*['"]?/ig, "authority: 'Petorretes i Javi'");
            if (newFm !== fm) {
                contingut = contingut.replace(fm, newFm);
                modified = true;
            }
        }
    }

    if (modified) {
      fs.writeFileSync(p, contingut, 'utf8');
      console.log(`✅ Autoritat termodinàmica aplicada a: ${path.basename(p)}`);
    }
  });
}

console.log('🤖 Escanejant i comprimint autoritats...');
camina(WIKI);
console.log('✅ Tots els "Consells" han sigut comprimits a "Petorretes i Javi".');

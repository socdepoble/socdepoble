const fs = require('fs');
const path = require('path');

const WIKI = path.join(__dirname, '..', '_wiki_de_poble');
const GLOS = path.join(WIKI, '01_SABER_Cultura_Coneixement', '00_GLOSSARI_CANONIC.md');
const EXCL = ['node_modules', '.git', 'scripts', 'assets', '_build'];
const termes = [];

function loadGlossary() {
  if (!fs.existsSync(GLOS)) return;
  const txtG = fs.readFileSync(GLOS, 'utf8');
  // Extraure termes en negreta **X**
  [...txtG.matchAll(/\*\*([A-Za-zÀ-ÿ0-9 _-]{2,40})\*\*/g)].forEach(m => {
    const t = m[1].trim();
    if (!termes.find(x => x.terme === t)) termes.push({ terme: t, slug: t.toLowerCase().replace(/\s+/g, '_') });
  });
  // Extraure termes de les taules | `X` |
  [...txtG.matchAll(/\| `([^`]+)` \|/g)].forEach(m => {
    const t = m[1].trim();
    if (!termes.find(x => x.terme === t)) termes.push({ terme: t, slug: t.toLowerCase().replace(/\s+/g, '_') });
  });
  termes.sort((a, b) => b.terme.length - a.terme.length); // Processar els més llargs primer per no solapar
}

function protegeix(text) {
  const placeholders = [];
  let i = 0;
  // Protegir blocs de codi, codi inline, enllaços markdown i wiki, i capçaleres
  text = text.replace(/```[\s\S]*?```|`[^`]+`|!?\[[^\]]*\]\([^)]+\)|\[\[[^\]]+\]\]|^#.*$/gm, m => {
    placeholders.push(m);
    return `\u0000${i++}\u0000`;
  });
  return { text, placeholders };
}

function restaura({ text, placeholders }) {
  return text.replace(/\u0000(\d+)\u0000/g, (_, k) => placeholders[k]);
}

function camina(dir) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach(n => {
    const p = path.join(dir, n);
    if (EXCL.includes(n)) return;
    if (fs.statSync(p).isDirectory()) return camina(p);
    if (!n.endsWith('.md') || p === GLOS) return;
    
    let t = fs.readFileSync(p, 'utf8');
    const pr = protegeix(t);
    let canvis = 0;
    
    termes.forEach(({ terme }) => {
      // Regex que busca la paraula exacta evitant paraules dins d'altres i respectant accents
      const re = new RegExp(`(?<![\\wÀ-ÿ\u0000])${terme}(?![\\wÀ-ÿ\u0000])`, 'gu');
      if (re.test(pr.text)) {
        pr.text = pr.text.replace(re, `[[00_GLOSSARI_CANONIC#${terme}|${terme}]]`);
        canvis++;
      }
    });
    
    if (canvis > 0) {
      t = restaura(pr);
      fs.writeFileSync(p, t, 'utf8');
      console.log(`✨ Auto-enllaçat en ${path.relative(WIKI, p)}: ${canvis} canvis.`);
    }
  });
}

function main() {
  console.log('📚 Iniciant Auto-Link del Glossari...');
  loadGlossary();
  if (termes.length === 0) {
    console.log('No s\'han trobat termes al glossari.');
    return;
  }
  camina(WIKI);
  console.log(`✅ Procés finalitzat. ${termes.length} termes utilitzats per l'escàner.`);
}

main();

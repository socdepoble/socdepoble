const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const WIKI = path.join(__dirname, '..', '_wiki_de_poble');
const OUT = path.join(WIKI, '_build');
const ESTAT = path.join(__dirname, '.build_state.json');
const EXCL = ['node_modules', '.git', 'scripts', '_build', 'assets'];

const estat = fs.existsSync(ESTAT) ? JSON.parse(fs.readFileSync(ESTAT)) : {};
const nouEstat = {};

if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

function camina(dir) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach(n => {
    const p = path.join(dir, n);
    const st = fs.statSync(p);
    if (EXCL.includes(n)) return;
    if (st.isDirectory()) return camina(p);
    if (!n.endsWith('.md')) return;

    // Calcular el hash del contingut per ser més resilients que mtime
    const content = fs.readFileSync(p, 'utf8');
    const hash = crypto.createHash('sha256').update(content).digest('hex');
    
    nouEstat[p] = hash;
    if (estat[p] === hash) return; // Cap canvi real

    const rel = path.relative(WIKI, p);
    const dest = path.join(OUT, rel);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(p, dest);
    console.log('⚡ Construït: ' + rel);
  });
}

console.log('🔧 Iniciant build incremental...');
camina(WIKI);

fs.writeFileSync(ESTAT, JSON.stringify(nouEstat, null, 2));
console.log('✅ Build incremental finalitzat.');

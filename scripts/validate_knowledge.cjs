const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const WIKI_ROOT = path.join(__dirname, '..', '_wiki_de_poble');
const EXCL = ['node_modules', '.git', '_build', 'assets'];
const errs = [];
const tots = [];
const noms = new Map();
const enllaços = new Set();
const fileLinks = new Map(); // path -> target link

function escaneja(dir) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach(n => {
    const p = path.join(dir, n);
    const s = fs.statSync(p);
    if (EXCL.includes(n)) return;
    if (s.isDirectory()) return escaneja(p);
    if (!n.endsWith('.md')) return;
    
    const text = fs.readFileSync(p, 'utf8');
    const hash = crypto.createHash('sha256').update(text.slice(0, 2000)).digest('hex').slice(0, 12);
    tots.push({ ruta: p, nom: n, text, hash });
    
    // duplicat de nom (ignorant SKILL.md que és un basename intencionadament repetit en plugins)
    if (n !== 'SKILL.md') {
      if (noms.has(n)) errs.push(`DUP NOM: ${n} → ${noms.get(n)} | ${p}`);
      else noms.set(n, p);
    }
    
    // captura enllaços wiki [[target]] o [[target|Alias]]
    const linksHere = [];
    [...text.matchAll(/\[\[([^\]|#]+)(?:#[^\]|]*)?(?:\|[^\]]+)?\]\]/g)].forEach(m => {
      const link = m[1].trim().replace(/\.md$/, '');
      enllaços.add(link);
      linksHere.push(link);
    });
    fileLinks.set(p, linksHere);
  });
}

function validar() {
  console.log('🔍 Executant Línter d\'Integritat de Coneixement...');
  escaneja(WIKI_ROOT);

  // enllaços trencats
  const baseTargets = tots.map(f => path.basename(f.nom, '.md'));
  
  fileLinks.forEach((links, file) => {
    links.forEach(e => {
      // Perdonar directoris si tenen un index o s'enllaça a la carpeta en si? 
      // Millor buscar noms d'arxiu exactes.
      if (!baseTargets.includes(e)) {
        errs.push(`ENLLAÇ TRENCAT en ${path.relative(WIKI_ROOT, file)}: [[${e}]]`);
      }
    });
  });

  // orfes (sense enllaços entrants, exceptuant el ROOT index o BIOS)
  const orphanIgnore = ['00_BIOS', '01_IDENTITAT', '03_EIXAM', '00_visio_i_pilars', '01_trellat', '00_governanca'];
  const allTargetsSet = new Set(enllaços);
  let orfesCount = 0;
  
  tots.forEach(f => {
    const base = path.basename(f.nom, '.md');
    if (!allTargetsSet.has(base) && !orphanIgnore.some(ig => base.includes(ig)) && f.nom !== 'SKILL.md') {
      console.warn(`⚠️ Possible Orfe: ${path.relative(WIKI_ROOT, f.ruta)}`);
      orfesCount++;
    }
  });

  // duplicats de contingut (Yapping/Slop)
  const hashes = new Map();
  tots.forEach(f => {
    // Si l'arxiu té menys de 50 caràcters segurament estiga buit (AI Slop)
    if (f.text.trim().length < 50) {
      errs.push(`CONTINGUT BUIT / SLOP: ${path.relative(WIKI_ROOT, f.ruta)}`);
    } else {
      if (hashes.has(f.hash)) {
        errs.push(`DUP CONTINGUT (Hash coincideix): ${f.nom} ≈ ${hashes.get(f.hash)}`);
      } else {
        hashes.set(f.hash, f.nom);
      }
    }
  });

  if (errs.length) {
    console.error(`\n❌ ${errs.length} problemes crítics trobats:`);
    errs.forEach(e => console.error(' - ' + e));
    if (process.argv.includes('--fatal')) {
      process.exit(1);
    }
  } else {
    console.log(`\n✅ Integritat validada. ${tots.length} fitxers analitzats. Zero problemes crítics.`);
  }
  
  if (orfesCount > 0) console.log(`   (Nota: s'han detectat ${orfesCount} possibles orfes)`);
}

validar();

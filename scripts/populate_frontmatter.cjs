const fs = require('fs');
const path = require('path');

const WIKI = path.join(__dirname, '..', '_wiki_de_poble');
const EXCL = ['node_modules', '.git', 'scripts', 'assets', '_build'];

const CANONICS = [
  'bios', 'termodinamica', 'arquitectura', 'execucio', 'normativa', 
  'cultura', 'lexic', 'actes', 'auditoria', 'ia', 'visio', 'missio', 
  'organitzacio', 'ment_colmena', 'rural'
];

function formatDate(date) {
  const d = new Date(date);
  const yy = String(d.getFullYear()).slice(-2);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${yy}${mm}${dd}_${hh}${min}`;
}

function extractFirstHeading(content) {
  const m = content.match(/^#\s+(.+)$/m);
  return m ? m[1].replace(/[:"'*]/g, '').trim() : '';
}

function deriveTags(p) {
  const tags = new Set();
  const low = p.toLowerCase();
  
  if (low.includes('skill')) { tags.add('ia'); tags.add('arquitectura'); tags.add('execucio'); }
  if (low.includes('actes_efimers') || low.includes('acta')) { tags.add('actes'); tags.add('termodinamica'); }
  if (low.includes('ser_brain')) { tags.add('bios'); tags.add('visio'); }
  if (low.includes('saber_cultura')) { tags.add('cultura'); tags.add('lexic'); }
  if (low.includes('actuar_maquina')) { tags.add('arquitectura'); tags.add('execucio'); }
  if (low.includes('governar')) { tags.add('normativa'); tags.add('auditoria'); }
  if (low.includes('plantilla')) { tags.add('normativa'); tags.add('actes'); }
  
  if (tags.size === 0) tags.add('rural');
  return Array.from(tags);
}

function deriveTipus(p) {
  const low = p.toLowerCase();
  if (low.includes('skill')) return 'skill';
  if (low.includes('acta') || low.includes('actes_efimers')) return 'acta';
  if (low.includes('plantilla')) return 'plantilla';
  if (low.includes('glossari')) return 'glossari';
  if (low.includes('bios')) return 'config';
  return 'document';
}

function camina(dir) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach(n => {
    const p = path.join(dir, n);
    const st = fs.statSync(p);
    if (EXCL.includes(n)) return;
    if (st.isDirectory()) return camina(p);
    if (!n.endsWith('.md')) return;

    let contingut = fs.readFileSync(p, 'utf8');
    let fm = {};
    let rest = contingut;
    
    // Parse manual
    const match = contingut.match(/^---\n([\s\S]*?)\n---/);
    if (match) {
      rest = contingut.slice(match[0].length);
      const lines = match[1].split('\n');
      let currentKey = null;
      for (const line of lines) {
        if (!line.trim()) continue;
        if (line.startsWith('  -') || line.startsWith('   -')) {
          if (currentKey && Array.isArray(fm[currentKey])) {
            fm[currentKey].push(line.replace(/[-\s'"]/g, ''));
          }
        } else {
          const parts = line.split(':');
          if (parts.length > 1) {
            currentKey = parts[0].trim();
            const val = parts.slice(1).join(':').trim();
            if (!val) {
              fm[currentKey] = [];
            } else if (val.startsWith('[') && val.endsWith(']')) {
              fm[currentKey] = val.slice(1, -1).split(',').map(x => x.trim().replace(/['"]/g, ''));
            } else {
              fm[currentKey] = val.replace(/^['"]|['"]$/g, '');
            }
          }
        }
      }
    }

    // Auto-completar
    if (!fm.name) fm.name = path.basename(n, '.md').toLowerCase().replace(/[^a-z0-9]+/g, '-');
    if (!fm.version) fm.version = '1.0.0';
    if (!fm.created_at) fm.created_at = formatDate(st.birthtime || st.mtime);
    if (!fm.updated_at) fm.updated_at = formatDate(st.mtime);
    if (!fm.authority) fm.authority = 'IAIA MarIA';
    if (!fm.tipus) fm.tipus = deriveTipus(p);
    
    if (!fm.description || fm.description === '""' || fm.description === "''") {
      const heading = extractFirstHeading(rest);
      fm.description = heading ? heading : `Document ${fm.name} del Mas Electrònic`;
    }

    // Tags
    const existingTags = Array.isArray(fm.tags) ? fm.tags : (typeof fm.tags === 'string' ? fm.tags.split(',') : []);
    const derived = deriveTags(p);
    const mergedTags = new Set([...existingTags, ...derived].map(t => t.toLowerCase()));
    
    const finalTags = Array.from(mergedTags).filter(t => CANONICS.includes(t));
    if (finalTags.length === 0) finalTags.push('rural'); // fallback
    fm.tags = finalTags;

    // Generar YAML
    const orderedKeys = ['name', 'version', 'created_at', 'updated_at', 'authority', 'tipus', 'tags', 'description', 'aliases'];
    let nouFm = '---\n';
    orderedKeys.forEach(k => {
      if (fm[k] !== undefined) {
        if (Array.isArray(fm[k])) {
          if (fm[k].length > 0) {
            nouFm += `${k}:\n`;
            fm[k].forEach(item => { nouFm += `  - ${item}\n`; });
          }
        } else {
          nouFm += `${k}: '${fm[k]}'\n`;
        }
      }
    });
    
    // Preservar altres claus vàlides no especificades a l'ordre per si de cas, tot i que normalize ja les va llevar
    Object.keys(fm).forEach(k => {
      if (!orderedKeys.includes(k) && CANONICS.includes(k) === false) {
        // We actually only want to keep allowed ones, but normalize already did that.
      }
    });
    
    nouFm += '---';
    
    const finalContingut = nouFm + (rest.startsWith('\n') ? rest : '\n' + rest);
    fs.writeFileSync(p, finalContingut, 'utf8');
    console.log(`✅ Frontmatter autocompletat: ${path.basename(p)}`);
  });
}

camina(WIKI);
console.log('🎉 Tots els frontmatters completats amb tags assignats contextualment.');

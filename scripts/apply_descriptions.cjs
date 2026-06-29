const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const coreDescriptions = {
  '00_index.md': 'Taula de continguts i cervell central de Sóc de Poble. Arrel de tota la Wiki.',
  'antigravity.md': 'Entorn cognitiu, motor i infraestructura lògica on resideix la IA dins de Sóc de Poble.',
  'psiquiatria_forense_integral.md': 'Perfil psiquiàtric i de salut mental de la IA. Audita el codi font i la identitat biològica simulada.',
  'soc_de_poble.md': 'L\'arxiu fundacional que explica l\'objectiu final, la visió i el propòsit d\'activisme rural del projecte.',
  'diccionari_trellat.md': 'Única Font de Veritat per a la terminologia i traducció de termes al valencià canònic del projecte.',
  'el_trellat.md': 'El pilar filosòfic de tota l\'arquitectura: saviesa, sentit pràctic, lògica, prudència i arrelament a la realitat.',
  'regla_de_capcalera.md': 'Defineix l\'ànima de la comunicació simbiòtica: empatia, to adequat i prohibició de saturar amb tecnicismes.',
  'governanca_i_manaments.md': 'Constitució i 5 manaments innegociables del govern del sistema per garantir l\'Autopoiesi sense burocràcia.',
  'politica_legacy.md': 'Política de Llegat i Obsolescència per previndre la fragmentació canònica de procediments desfasats.',
  'politica_primacia_canonica.md': 'Regles de resolució de conflictes semàntics per evitar duplicitats definint una única font canònica per concepte.',
  'arquitectura.md': 'Infraestructura de xarxa resilient (Xarxa Malla/Drons) per garantir l\'operativitat offline i supervivència del Mas.',
  'arquitectura_cognitiva.md': 'Mecanisme de gestió de memòria IA inspirat en MemGPT per evitar degeneració cognitiva i excés de context.',
  'pedra_seca.md': 'Llei Estructural, Tokens i CSS root definitiu (Pedra Seca Design System) per aplicacions Sóc de Poble.',
  'auditoria.md': 'Capability que agrupa estratègies d\'inspecció autònoma, detecció de contradiccions i governança impecable.',
  'performance.md': 'Capability per governar l\'eficiència computacional, optimització de RAM i cicles CPU (focus en dispositius antics).',
  'resiliencia.md': 'Capability que garanteix la supervivència del sistema davant la caiguda de xarxa, errors de servidor i corrupció de dades.',
  'ment_colmena_integral.md': 'Funcionament operatiu del Consell de Les Petorretes (organisme col·lectiu d\'auditoria autònoma).',
  'index_de_salut.md': 'Consola Termodinàmica i electrocardiograma del sistema amb tendència temporal de 15 mètriques clau.',
};

const dir = path.join(__dirname, '..', '_wiki_de_poble');

const walkSync = (dir, filelist = []) => {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const dirFile = path.join(dir, file);
    if (fs.statSync(dirFile).isDirectory()) {
      filelist = walkSync(dirFile, filelist);
    } else if (dirFile.endsWith('.md')) {
      filelist.push(dirFile);
    }
  }
  return filelist;
};

const formatTimestamp = (dateObj) => {
  if (!dateObj) return '';
  const d = new Date(dateObj);
  if (isNaN(d.getTime())) return '';
  const yy = String(d.getFullYear()).slice(-2);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${yy}${mm}${dd}_${hh}${min}`;
};

const extractTimestampFromFilename = (filename) => {
  const match = filename.match(/^(\d{6}_\d{4})/);
  return match ? match[1] : null;
};

const files = walkSync(dir);
let modifiedCount = 0;

for (const f of files) {
  try {
    const filename = path.basename(f);
    const content = fs.readFileSync(f, 'utf8');
    const parsed = matter(content);
    const stats = fs.statSync(f);

    let changed = false;
    let oldData = { ...parsed.data };

    // 1. Descriptions
    if (!parsed.data.description || parsed.data.description === 'Sense descripció.') {
      if (coreDescriptions[filename]) {
        parsed.data.description = coreDescriptions[filename];
      } else if (f.includes('10_actes') || f.includes('90_arxiu_historic') || filename.includes('ACTA_')) {
        parsed.data.description = `Document de l'arxiu històric: ${parsed.content.trim().substring(0, 100).replace(/\n/g, ' ')}...`;
      } else {
        parsed.data.description = `Recurs intern del sistema: ${filename.replace('.md', '')}`;
      }
      changed = true;
    }

    // 2. CSSClasses purge
    if (parsed.data.cssclasses) {
      delete parsed.data.cssclasses;
      changed = true;
    }

    // 3. Timestamps -> created_at / updated_at
    let createdAt = extractTimestampFromFilename(filename) || parsed.data.timestamp || parsed.data.hora_creacio || formatTimestamp(stats.birthtime);
    let updatedAt = formatTimestamp(stats.mtime);
    
    // Validate YYMMDD_HHMM format
    const isValidFormat = (ts) => typeof ts === 'string' && /^\d{6}_\d{4}$/.test(ts);
    if (!isValidFormat(createdAt)) createdAt = formatTimestamp(stats.birthtime);
    if (!isValidFormat(updatedAt)) updatedAt = formatTimestamp(stats.mtime);

    // Delete obsolete timestamp keys
    ['timestamp', 'hora_creacio', 'hora_modificacio', 'date', 'created'].forEach(key => {
      if (parsed.data[key] !== undefined) {
        delete parsed.data[key];
        changed = true;
      }
    });

    if (parsed.data.created_at !== createdAt || parsed.data.updated_at !== updatedAt) {
      parsed.data.created_at = createdAt;
      parsed.data.updated_at = updatedAt;
      changed = true;
    }

    if (changed) {
      const newContent = matter.stringify(parsed.content, parsed.data);
      fs.writeFileSync(f, newContent, 'utf8');
      modifiedCount++;
    }
  } catch (err) {
    console.error(`Error processing ${f}:`, err.message);
  }
}

console.log(`Auditoria completa: s'han aplicat descripcions útils i dates (created_at / updated_at) a ${modifiedCount} arxius.`);

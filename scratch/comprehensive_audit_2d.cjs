const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..', 'src');
const OUTPUT_FILE = path.join(__dirname, '..', '..', '.gemini', 'antigravity-ide', 'brain', '48f5940e-c40d-491c-956f-d4a42203cc3c', 'full_2d_flattened_audit.md');

let md = `# Auditoria 2D Global (Aplanament Total)\n\n`;
md += `Aquest document destil·la en text pla 2D **tota l'arquitectura d'interfície i contingut** del sistema abans de la refactorització del disseny. Inclou Sidebar, rutes, menús i les estructures de dades, amb l'objectiu de no deixar cap "fantasma" arrere.\n\n`;

function scanDir(dir, extFilter, callback) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      scanDir(fullPath, extFilter, callback);
    } else if (extFilter.some(ext => fullPath.endsWith(ext))) {
      callback(fullPath);
    }
  }
}

// 1. APLANAMENT DE LA UI (Components i Layouts)
md += `## 1. Mapeig de la Interfície (UI i Sidebar)\n\n`;
md += `S'han escanejat els components de la UI per extraure els textos harcoded i les rutes (el que veu l'usuari als menús).\n\n`;
md += `| Component | Textos Visibles / Etiquetas |\n`;
md += `|---|---|\n`;

scanDir(path.join(ROOT_DIR, 'components'), ['.jsx'], (filePath) => {
  const content = fs.readFileSync(filePath, 'utf8');
  const relPath = path.relative(ROOT_DIR, filePath);
  
  // Extract simple text nodes (heuristics: text between > and < without code inside)
  const textRegex = />([^<{}]+)</g;
  let match;
  const texts = new Set();
  while ((match = textRegex.exec(content)) !== null) {
    const t = match[1].trim();
    if (t.length > 2 && !t.includes('import') && !t.includes('//') && !t.includes('export')) {
      texts.add(t);
    }
  }
  
  if (texts.size > 0) {
    md += `| \`${relPath}\` | ${Array.from(texts).join(', ')} |\n`;
  }
});

// 2. APLANAMENT DEL CONTINGUT (Data)
md += `\n## 2. Aplanament per Seccions de Contingut (Data)\n\n`;
md += `Estructura pura del contingut i classes utilitzades, fitxer per fitxer.\n\n`;

scanDir(path.join(ROOT_DIR, 'data'), ['.js'], (filePath) => {
  const content = fs.readFileSync(filePath, 'utf8');
  const relPath = path.relative(ROOT_DIR, filePath);
  
  md += `### ${relPath}\n`;
  
  // Extract all classes used in this file
  const classRegex = /class(?:Name)?=(?:["']([^"']+)["']|\{`([^`]+)`\})/g;
  let matchClass;
  const classes = new Set();
  while ((matchClass = classRegex.exec(content)) !== null) {
    const classStr = matchClass[1] || matchClass[2];
    if (classStr) {
      classStr.split(/\\s+/).map(c => c.trim()).filter(c => c).forEach(c => classes.add(c));
    }
  }
  
  if (classes.size > 0) {
    md += `**Classes trobades:** \`${Array.from(classes).join('`, `')}\`\n\n`;
  } else {
    md += `*Cap classe CSS.* (Aquest fitxer és contingut absolutament net).\n\n`;
  }
});

try {
  fs.writeFileSync(OUTPUT_FILE, md, 'utf8');
  console.log(`Global 2D Audit Artifact generat amb èxit a: ${OUTPUT_FILE}`);
} catch (err) {
  const fallback = path.join(__dirname, 'full_2d_flattened_audit.md');
  fs.writeFileSync(fallback, md, 'utf8');
  console.log(`Global 2D Audit Artifact generat a fallback: ${fallback}`);
}

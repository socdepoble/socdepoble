const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'src', 'data');
const OUTPUT_FILE = path.join(__dirname, '..', '..', '.gemini', 'antigravity-ide', 'brain', '48f5940e-c40d-491c-956f-d4a42203cc3c', 'content_2d_audit.md');

const tagsCount = {};
const classesCount = {};
const stylesCount = {};

function scanDirectory(directory) {
  const files = fs.readdirSync(directory);

  for (const file of files) {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      scanDirectory(fullPath);
    } else if (fullPath.endsWith('.js') || fullPath.endsWith('.jsx')) {
      scanFile(fullPath);
    }
  }
}

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const fileName = path.basename(filePath);

  // Extract HTML tags
  const tagRegex = /<([a-zA-Z0-9\-]+)(?=[^>]*>)/g;
  let tagMatch;
  while ((tagMatch = tagRegex.exec(content)) !== null) {
    const tag = tagMatch[1].toLowerCase();
    if (!tagsCount[tag]) tagsCount[tag] = { count: 0, files: new Set() };
    tagsCount[tag].count++;
    tagsCount[tag].files.add(fileName);
  }

  // Extract classes
  const classRegex = /class(?:Name)?=(?:["']([^"']+)["']|\{`([^`]+)`\})/g;
  let classMatch;
  while ((classMatch = classRegex.exec(content)) !== null) {
    const classStr = classMatch[1] || classMatch[2];
    if (!classStr) continue;
    const classList = classStr.split(/\s+/).map(c => c.trim()).filter(c => c.length > 0 && !c.includes('${'));
    
    for (const c of classList) {
      if (!classesCount[c]) classesCount[c] = { count: 0, files: new Set() };
      classesCount[c].count++;
      classesCount[c].files.add(fileName);
    }
  }

  // Extract inline styles
  const styleRegex = /style=(?:["']([^"']+)["']|\{\{([^}]+)\}\})/g;
  let styleMatch;
  while ((styleMatch = styleRegex.exec(content)) !== null) {
    const styleStr = (styleMatch[1] || styleMatch[2]).trim();
    if (!styleStr) continue;
    if (!stylesCount[styleStr]) stylesCount[styleStr] = { count: 0, files: new Set() };
    stylesCount[styleStr].count++;
    stylesCount[styleStr].files.add(fileName);
  }
}

function generateMarkdown() {
  let md = `# Auditoria 2D del Contingut (Data)\n\n`;
  md += `Aquest document és el mapa pla (2D) de tota l'arquitectura HTML/CSS present als fitxers de contingut (\`src/data/\`). Serveix per detectar "fantasmes", estructures obsoletes o codi brossa heretat abans de reconstruir el Sistema de Disseny.\n\n`;

  md += `## 1. Etiquetes HTML (Tags)\n`;
  md += `| Etiqueta | Úsos | Fitxers on apareix |\n`;
  md += `|---|---|---|\n`;
  const sortedTags = Object.entries(tagsCount).sort((a, b) => b[1].count - a[1].count);
  for (const [tag, data] of sortedTags) {
    md += `| \`<${tag}>\` | ${data.count} | ${Array.from(data.files).join(', ')} |\n`;
  }

  md += `\n## 2. Estils en Línia (Inline Styles) 🚨\n`;
  md += `Els estils en línia són els principals causants de deute tècnic.\n\n`;
  md += `| Estil | Úsos | Fitxers |\n`;
  md += `|---|---|---|\n`;
  const sortedStyles = Object.entries(stylesCount).sort((a, b) => b[1].count - a[1].count);
  for (const [style, data] of sortedStyles) {
    md += `| \`${style.replace(/\|/g, ' ')}\` | ${data.count} | ${Array.from(data.files).join(', ')} |\n`;
  }

  md += `\n## 3. Classes CSS (Top 50 i Sospitoses)\n`;
  md += `| Classe | Úsos | Fitxers |\n`;
  md += `|---|---|---|\n`;
  const sortedClasses = Object.entries(classesCount).sort((a, b) => b[1].count - a[1].count);
  for (const [cls, data] of sortedClasses) {
    // Highlight potentially suspicious or old classes
    let mark = '';
    if (cls.includes('sdp-') || cls.includes('text-') || cls.includes('bg-') || cls.includes('margin') || cls.includes('padding')) {
       // just list them, we want to see everything
    }
    md += `| \`.${cls}\` | ${data.count} | ${Array.from(data.files).join(', ')} |\n`;
  }

  try {
    fs.writeFileSync(OUTPUT_FILE, md);
    console.log('Artifact generat amb èxit a:', OUTPUT_FILE);
  } catch (err) {
    // If exact path fails, write it locally
    const fallback = path.join(__dirname, 'content_2d_audit.md');
    fs.writeFileSync(fallback, md);
    console.log('Artifact generat amb èxit a (fallback):', fallback);
  }
}

scanDirectory(DATA_DIR);
generateMarkdown();

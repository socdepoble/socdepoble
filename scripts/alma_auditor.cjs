const fs = require('fs');
const path = require('path');

const FILE_PATH = path.join(__dirname, '../src/pages/features/anima-del-mas/AlmaPage.jsx');
const OUTPUT_CSV = path.join(__dirname, '../docs/auditories/20260622_alma_audit.csv');

const content = fs.readFileSync(FILE_PATH, 'utf-8');

const elementRegex = /<([a-zA-Z0-9]+)([^>]*)>/g;
const classNameRegex = /className=(?:'([^']+)'|"([^"]+)"|\{`([^`]+)`\})/;

const results = [];
let match;

while ((match = elementRegex.exec(content)) !== null) {
  const [fullMatch, tagName, attrs] = match;
  
  if (tagName.toLowerCase() !== tagName && tagName !== 'Link') {
    results.push({
      Element: tagName,
      Type: 'Component',
      Classes: 'N/A',
      Ghosts: tagName === 'UniversalPage' ? 'Legacy Component (UniversalPage)' : 'None'
    });
  } else {
    const classMatch = attrs.match(classNameRegex);
    let classes = '';
    if (classMatch) {
      classes = classMatch[1] || classMatch[2] || classMatch[3] || '';
    }
    
    const ghosts = [];
    if (classes.includes('lead')) ghosts.push('Bootstrap Legacy (lead)');
    if (classes.includes('universal-content')) ghosts.push('Legacy Wrapper (universal-content)');
    
    // Si és un div buit sense classes significatives o només amb marges, podria ser inútil
    if (tagName === 'div' && (!classes || classes.match(/^m[btlrxy]?-\d+$/))) {
      ghosts.push('Possible Useless Div');
    }
    
    results.push({
      Element: tagName,
      Type: 'HTML',
      Classes: classes ? classes.replace(/\n/g, ' ').trim() : 'NO CLASSES',
      Ghosts: ghosts.length > 0 ? ghosts.join(', ') : 'None'
    });
  }
}

const csvHeaders = ['Element', 'Type', 'Classes', 'Ghosts Detected'].join(';');
const csvRows = results.map(r => `${r.Element};${r.Type};${r.Classes};${r.Ghosts}`);
fs.writeFileSync(OUTPUT_CSV, [csvHeaders, ...csvRows].join('\n'));

console.log(`Auditoria detallada completada per a AlmaPage. S'han trobat ${results.length} nodes.`);
console.log(`Resultats guardats a: ${OUTPUT_CSV}`);

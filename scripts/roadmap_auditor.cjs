const fs = require('fs');
const path = require('path');

const FILE_PATH = path.join(__dirname, '../src/pages/public/RoadmapView.jsx');
const OUTPUT_CSV = path.join(__dirname, '../docs/auditories/20260622_roadmap_audit.csv');

const content = fs.readFileSync(FILE_PATH, 'utf-8');

// Regex patterns to identify components and their classes
const elementRegex = /<([a-zA-Z0-9]+)([^>]*)>/g;
const classNameRegex = /className=(?:'([^']+)'|"([^"]+)"|\{`([^`]+)`\})/;

const results = [];
let match;
let depth = 0;

while ((match = elementRegex.exec(content)) !== null) {
  const [fullMatch, tagName, attrs] = match;
  
  if (tagName.toLowerCase() !== tagName && tagName !== 'Link') {
    // It's a React Component
    results.push({
      Element: tagName,
      Type: 'Component',
      Classes: 'N/A',
      Ghosts: 'N/A'
    });
  } else {
    // It's an HTML tag
    const classMatch = attrs.match(classNameRegex);
    let classes = '';
    if (classMatch) {
      classes = classMatch[1] || classMatch[2] || classMatch[3] || '';
    }
    
    const ghosts = [];
    if (classes.includes('text-sdp-text-main')) ghosts.push('Legacy Text Color (text-sdp-text-main)');
    if (classes.includes('bg-sdp-bg-panel')) ghosts.push('Legacy Background (bg-sdp-bg-panel)');
    if (classes.includes('text-sdp-text-muted')) ghosts.push('Legacy Text Muted (text-sdp-text-muted)');
    if (classes.includes('border-sdp-border-master')) ghosts.push('Legacy Border (border-sdp-border-master)');
    
    if (classes) {
        results.push({
          Element: tagName,
          Type: 'HTML',
          Classes: classes.replace(/\n/g, ' ').trim(),
          Ghosts: ghosts.length > 0 ? ghosts.join(', ') : 'None'
        });
    }
  }
}

// Write CSV
const csvHeaders = ['Element', 'Type', 'Classes', 'Ghosts Detected'].join(';');
const csvRows = results.map(r => `${r.Element};${r.Type};${r.Classes};${r.Ghosts}`);
fs.writeFileSync(OUTPUT_CSV, [csvHeaders, ...csvRows].join('\n'));

console.log(`Auditoria detallada completada per a RoadmapView. S'han trobat ${results.length} nodes.`);
console.log(`Resultats guardats a: ${OUTPUT_CSV}`);

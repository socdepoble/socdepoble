import fs from 'fs';
import path from 'path';

const p = '/Users/javillinares/Documents/Antigravity/Sóc de Poble/';
const files = [
  'auditories/4-Claude-Auditoria-Estructural.md',
  'src/main.jsx',
  'src/App.jsx',
  'src/context/LocalFirstStatusContext.jsx',
  'src/components/gates/LocalFirstGate.jsx',
  'src/components/DegradedBanner.jsx',
  'src/components/ChatList.jsx',
  'src/components/UniversalGrid.jsx',
  'src/components/UniversalCard/UniversalCard.jsx',
  'src/components/UniversalCard/UniversalCard.variants.js'
];

let out = '';
files.forEach(f => {
  const fp = path.join(p, f);
  if (fs.existsSync(fp)) {
    if (f !== files[0]) {
      out += `\n\n### Archivo: ${f}\n\`\`\`jsx\n`;
    }
    out += fs.readFileSync(fp, 'utf8');
    if (f !== files[0]) {
      out += `\n\`\`\`\n`;
    }
  }
});

fs.writeFileSync(path.join(p, 'auditories/CLAUDE_PAYLOAD_ESTRUCTURAL.md'), out);
console.log('Done generating CLAUDE_PAYLOAD_ESTRUCTURAL.md');

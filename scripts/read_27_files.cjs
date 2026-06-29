const fs = require('fs');
const path = require('path');

const dir = '/Users/javillinares/.gemini/antigravity-ide/knowledge/arquitectura_resilient/artifacts';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));

let fullContent = '# SUMMARY OF 27 CHAOTIC FILES\n\n';

for (const file of files) {
  const content = fs.readFileSync(path.join(dir, file), 'utf8');
  fullContent += `## --- ${file} ---\n`;
  fullContent += content;
  fullContent += `\n\n`;
}

fs.writeFileSync('/Users/javillinares/Documents/Antigravity/Sóc de Poble/scripts/arq_resilient_full.md', fullContent);
console.log('Done concatenating 27 files.');

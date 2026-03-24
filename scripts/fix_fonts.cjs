const fs = require('fs');
let lines = fs.readFileSync('src/components/UniversalCard.css', 'utf8').split('\n');
let insideForensic = false;
for(let i=0; i<lines.length; i++) {
  if (lines[i].includes('.forensic-label')) insideForensic = true;
  if (lines[i].includes('}')) insideForensic = false;
  if (!insideForensic) {
    lines[i] = lines[i].replace(/font-size:\s*(8|9|10|11)px/g, 'font-size: 12px');
  }
}
fs.writeFileSync('src/components/UniversalCard.css', lines.join('\n'));
console.log('Font sizes < 12px upgraded to 12px minimum globally for Gent Gran.');

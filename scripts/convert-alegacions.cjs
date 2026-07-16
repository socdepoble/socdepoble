const fs = require('fs');
const text = fs.readFileSync('/Users/javillinares/Documents/Antigravity/Som de Poble/socdepoble.org/_wiki_de_poble/05_Escriptori_Soc_de_Poble/CEEC/alegacions.txt', 'utf8');
const jsCode = `export const alegacionsText = \`${text.replace(/`/g, '\\`')}\`;\n`;
fs.writeFileSync('/Users/javillinares/Documents/Antigravity/Som de Poble/socdepoble.org/src/sections/finestreta/alegacionsText.js', jsCode);
console.log('Done');

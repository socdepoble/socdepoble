const fs = require('fs');

const promptPath = '/Users/javillinares/.gemini/antigravity-ide/brain/bf8c3f9d-1332-4fd1-8035-246014ede057/20260613_0917_auditoria_fase3_gold_master.md';
let content = fs.readFileSync(promptPath, 'utf8');

// Find where to split
const splitMarker = '*(S\'inclouen a continuació els fragments centrals del codi actualitzat per a la vostra ingesta en memòria)*';
const parts = content.split(splitMarker);

if (parts.length < 2) {
    console.log("Marker not found!");
    process.exit(1);
}

const header = parts[0] + '*(S\'inclou a continuació **TOT EL CODI FONAMENTAL DE L\'ARQUITECTURA WEB** per a una auditoria total i implacable)*\n\n';

const footerSplit = parts[1].split('## [BLOC VARIABLE 3: SOL·LICITUD D\'AVALUACIÓ I IMAGINACIÓ TÈCNICA]');
const footer = '\n## [BLOC VARIABLE 3: SOL·LICITUD D\'AVALUACIÓ I IMAGINACIÓ TÈCNICA]' + footerSplit[1];

const files = [
  'src/components/ui/LazyHtmlRenderer.jsx',
  'src/hooks/useDOMTelemetry.js',
  'src/stores/thermodynamicStore.js',
  'public/stitch_chat_layout_template.html',
  'src/components/thermodynamic/ThermodynamicConsole.jsx',
  'src/components/thermodynamic/ThermodynamicGauge.jsx',
  'src/components/thermodynamic/ThermodynamicSimulator.jsx',
  'src/components/thermodynamic/HistoricalTrend.jsx'
];

let fullCode = '';
for (const file of files) {
  try {
      const ext = file.endsWith('.html') ? 'html' : 'javascript';
      const fileContent = fs.readFileSync(file, 'utf8');
      fullCode += `\n### 📄 Arxiu: \`${file}\`\n\`\`\`${ext}\n${fileContent}\n\`\`\`\n`;
  } catch (e) {
      console.log("Error reading " + file + ": " + e.message);
  }
}

const newContent = header + fullCode + footer;
fs.writeFileSync(promptPath, newContent);
console.log("Prompt actualizado con TODO el código!");

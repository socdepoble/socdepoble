const fs = require('fs');
const path = require('path');

const csvPath = path.join(__dirname, '../docs/auditories/20260622_global_deep_audit.csv');
const taskPath = path.join(__dirname, '../../../../.gemini/antigravity-ide/brain/edd535a3-aa0e-4373-aee3-0569be188ceb/task.md');

if (!fs.existsSync(csvPath)) {
    console.error("No CSV found.");
    process.exit(1);
}

const lines = fs.readFileSync(csvPath, 'utf8').split('\n');
// skip header
const files = lines.slice(1).filter(l => l.trim()).map(l => l.split(';')[0]);

let content = `# Llistat Quirúrgic: Operació Aplanament Estructural (Masia Ibáñez)

Aquesta llista conté tots els fitxers que van ser superficialment "pintats" en la fase anterior i que ara requereixen una cirurgia real per extirpar divs inútils, canviar l'UniversalPage de llegat per UniversalPageLayout i forjar HTML pur.

## 1. Pàgines Universals i Contingut
`;

const pages = files.filter(f => f.startsWith('pages/') && !f.includes('components/'));
const components = files.filter(f => f.startsWith('components/'));

pages.forEach(p => {
    content += `- [ ] \`${p}\`\n`;
});

content += `\n## 2. Components del Sistema\n`;
components.forEach(c => {
    content += `- [ ] \`${c}\`\n`;
});

// Només escriure si no existeix o sobreescrivim
fs.writeFileSync(taskPath, content, 'utf8');
console.log("Task list generated.");

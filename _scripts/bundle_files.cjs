const fs = require('fs');
const path = require('path');

const filesToExtract = [
    'src/core/services/supabaseService.js',
    'src/supabaseClient.js',
    'src/core/services/iaiaService.js',
    'src/services/rhizomeManagerV3.js',
    'src/components/sprites/index.js'
];

let output = '# FITXERS DEL NUCLI PER AL CONSELL DE LES PETORRETES\n\n';

for (const filePath of filesToExtract) {
    const absolutePath = path.join(process.cwd(), filePath);
    try {
        const content = fs.readFileSync(absolutePath, 'utf8');
        output += `## Fitxer: \`${filePath}\`\n\n\`\`\`javascript\n${content}\n\`\`\`\n\n---\n\n`;
    } catch (e) {
        output += `## Fitxer: \`${filePath}\`\n\n(No s'ha trobat o no s'ha pogut llegir: ${e.message})\n\n---\n\n`;
    }
}

fs.writeFileSync('files_for_consell.md', output, 'utf8');
console.log('files_for_consell.md generated successfully.');

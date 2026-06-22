const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        const dirPath = path.join(dir, f);
        const isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

const targetDirs = [
    path.join(__dirname, '../src/pages'),
    path.join(__dirname, '../src/components')
];

const classMap = {
    'bg-sdp-bg-panel': 'bg-white',
    'bg-sdp-bg-app': 'bg-gray-50',
    'text-sdp-text-main': 'text-gray-900',
    'text-sdp-text-muted': 'text-gray-500',
    'border-sdp-border-master': 'border-gray-200',
    'text-theme-text': 'text-gray-900',
    'bg-theme-base': 'bg-white',
    'bg-theme-panel': 'bg-white',
    'border-border-master': 'border-gray-200',
    'text-[var(--text-muted)]': 'text-gray-500',
    'var(--theme-accent-primary)': '#F97316'
};

let filesModified = 0;

targetDirs.forEach(dir => {
    if (!fs.existsSync(dir)) return;
    walkDir(dir, filePath => {
        if (!filePath.endsWith('.jsx')) return;
        
        let content = fs.readFileSync(filePath, 'utf-8');
        let modified = false;

        Object.keys(classMap).forEach(legacyClass => {
            // Reemplaçar les classes als literals de string i template literals
            const regex = new RegExp(legacyClass.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g');
            if (regex.test(content)) {
                content = content.replace(regex, classMap[legacyClass]);
                modified = true;
            }
        });

        // També aplanem el problema de la <UniversalPage> vella si la utilitzen com a layout, 
        // tot i que això és més delicat. Substituïm import UniversalPage per UniversalPageLayout on escau, però millor
        // deixar-ho només per a l'HTML classes i CSS.

        if (modified) {
            fs.writeFileSync(filePath, content, 'utf-8');
            filesModified++;
            console.log(`Aplanat: ${path.relative(path.join(__dirname, '../src'), filePath)}`);
        }
    });
});

console.log(`\nOperació d'Aplanament Massiva Completada. S'han netejat ${filesModified} fitxers.`);

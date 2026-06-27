const fs = require('fs');
const path = require('path');
const glob = require('glob');

const mapping = {
  // from : to
  "Infoteca": "features/infoteca",
  "Skeletons": "ui/skeletons",
  "UniversalCard": "ui/universal-card"
};

const files = glob.sync('src/**/*.{js,jsx,ts,tsx}');

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    for (const [oldName, newName] of Object.entries(mapping)) {
        // match something like: import ... from '../../components/Infoteca/...'
        // or import { ... } from 'components/UniversalCard/...'
        const regex = new RegExp(`(components/)${oldName}(?=[/\\'"\\.])`, 'g');
        content = content.replace(regex, `$1${newName}`);
        
        // Also catch internal relative imports inside the moved files themselves
        // e.g. if InfografiaGallery was importing something relative to Infoteca and now it's in features/infoteca
        // actually, features/infoteca is one level deeper than Infoteca.
        // Wait! Infoteca was in src/components. Now it's in src/components/features/infoteca. It moved ONE level deeper.
    }

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Fixed component imports in ${file}`);
    }
});

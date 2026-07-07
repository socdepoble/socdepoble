const fs = require('fs');
const path = require('path');
const glob = require('glob');

const dirsToFix = [
  'src/components/features/infoteca/**/*.jsx',
  'src/components/ui/skeletons/**/*.jsx',
  'src/components/ui/universal-card/**/*.jsx'
];

dirsToFix.forEach(pattern => {
    const files = glob.sync(pattern);
    files.forEach(file => {
        let content = fs.readFileSync(file, 'utf8');
        let original = content;

        // Add one level up to relative imports pointing outside
        content = content.replace(/from\s+(['"])\.\.\//g, "from $1../../");
        content = content.replace(/import\s+(['"])\.\.\//g, "import $1../../");
        content = content.replace(/import\((['"])\.\.\//g, "import($1../../");

        if (content !== original) {
            fs.writeFileSync(file, content, 'utf8');
            console.log(`Fixed internal relative imports in ${file}`);
        }
    });
});

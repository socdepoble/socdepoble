import fs from 'fs';
import path from 'path';
import { globSync } from 'glob';

const srcDir = path.resolve('./src');
const utilsDir = path.resolve('./src/utils');

const files = globSync('./src/**/*.{js,jsx,ts,tsx}');

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf-8');
    let modified = false;

    // We'll look for strings like: from '../utils/logger'
    // or import('../utils/toast')
    const regex = /(from\s+|import\s*\(\s*)['"](\.\.?\/+.*?)['"]/g;

    const newContent = content.replace(regex, (match, prefix, importPath) => {
        // Resolve the import path relative to the current file's directory
        const fileDir = path.dirname(path.resolve(file));
        const absoluteImportPath = path.resolve(fileDir, importPath);
        
        // If the absolute import path falls under the OLD src/shared/utils or src/utils
        // actually, let's just check if it ends with /utils/something and the file is missing?
        // Wait, if it pointed to src/shared/utils, that dir is gone.
        // Let's assume ANY import that resolves to `/utils/...` (whether it was shared/utils or not)
        // should now point to `src/utils/...`.
        
        const isSharedUtils = absoluteImportPath.includes('/src/shared/utils/');
        const isOldUtils = absoluteImportPath.includes('/src/utils/'); // could be correct or wrong
        
        if (isSharedUtils) {
            // It pointed to shared/utils which is now deleted!
            const newAbsolute = absoluteImportPath.replace('/src/shared/utils/', '/src/utils/');
            let newRelative = path.relative(fileDir, newAbsolute);
            if (!newRelative.startsWith('.')) {
                newRelative = './' + newRelative;
            }
            modified = true;
            return `${prefix}'${newRelative}'`;
        }
        
        // Sometimes people used `../utils/` in src/shared/components but meant `src/shared/utils/`
        // Wait, if a file is in src/shared/components/ToastProvider.jsx, and its import is `../utils/toast`,
        // `path.resolve(fileDir, '../utils/toast')` gives `src/shared/utils/toast`
        // So `isSharedUtils` will be TRUE!
        
        return match;
    });

    if (modified) {
        fs.writeFileSync(file, newContent, 'utf-8');
        console.log('Fixed imports in', file);
    }
});

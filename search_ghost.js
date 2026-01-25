import fs from 'fs';
import path from 'path';

function searchInDir(startPath, filter) {
    if (!fs.existsSync(startPath)) {
        console.log("no dir ", startPath);
        return;
    }

    const files = fs.readdirSync(startPath);
    for (let i = 0; i < files.length; i++) {
        const filename = path.join(startPath, files[i]);
        const stat = fs.lstatSync(filename);
        if (stat.isDirectory()) {
            searchInDir(filename, filter);
        } else if (filename.endsWith('.jsx') || filename.endsWith('.js') || filename.endsWith('.tsx') || filename.endsWith('.ts')) {
            const content = fs.readFileSync(filename, 'utf8');
            if (content.includes('UnifiedStatus')) {
                console.log('FOUND UnifiedStatus in:', filename);
                const lines = content.split('\n');
                lines.forEach((line, idx) => {
                    if (line.includes('UnifiedStatus')) {
                        console.log(`Line ${idx + 1}: ${line.trim()}`);
                    }
                });
            }
        }
    }
}

searchInDir('./src', 'UnifiedStatus');

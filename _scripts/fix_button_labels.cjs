const fs = require('fs');
const path = require('path');

function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            processDirectory(fullPath);
        } else if (fullPath.endsWith('.jsx')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = false;

            // This regex matches buttons containing <span className="hidden xl:inline">...</span>
            // We want to add aria-label if it's missing.
            
            // For Comentar
            if (content.match(/<button[^>]*>[\s\S]*?<span[^>]*hidden xl:inline[^>]*>.*Comentar.*<\/span>[\s\S]*?<\/button>/) && !content.includes('aria-label="Comentar"')) {
                content = content.replace(/(<button[^>]*?)(>[\s\S]*?<span[^>]*hidden xl:inline[^>]*>.*Comentar.*<\/span>[\s\S]*?<\/button>)/g, (match, p1, p2) => {
                    if (p1.includes('aria-label')) return match;
                    return `${p1} aria-label="Comentar"${p2}`;
                });
                modified = true;
            }

            // For Compartir
            if (content.match(/<button[^>]*>[\s\S]*?<span[^>]*hidden xl:inline[^>]*>.*Compartir.*<\/span>[\s\S]*?<\/button>/) && !content.includes('aria-label="Compartir"')) {
                content = content.replace(/(<button[^>]*?)(>[\s\S]*?<span[^>]*hidden xl:inline[^>]*>.*Compartir.*<\/span>[\s\S]*?<\/button>)/g, (match, p1, p2) => {
                    if (p1.includes('aria-label')) return match;
                    return `${p1} aria-label="Compartir"${p2}`;
                });
                modified = true;
            }

            // For Traduir
            if (content.match(/<button[^>]*>[\s\S]*?<span[^>]*hidden xl:inline[^>]*>.*Traduir.*<\/span>[\s\S]*?<\/button>/) && !content.includes('aria-label="Traduir"')) {
                content = content.replace(/(<button[^>]*?)(>[\s\S]*?<span[^>]*hidden xl:inline[^>]*>.*Traduir.*<\/span>[\s\S]*?<\/button>)/g, (match, p1, p2) => {
                    if (p1.includes('aria-label')) return match;
                    return `${p1} aria-label="Traduir"${p2}`;
                });
                modified = true;
            }

            if (modified) {
                fs.writeFileSync(fullPath, content);
                console.log(`Added aria-label to ${fullPath}`);
            }
        }
    }
}

processDirectory(path.join(__dirname, 'src', 'pages'));
processDirectory(path.join(__dirname, 'src', 'components'));

console.log('Done fixing button labels.');

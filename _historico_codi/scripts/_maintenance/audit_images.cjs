const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function findImagesInCode() {
    console.log("=== Auditing Image Paths in Code ===");
    // Find all strings ending in .png, .jpg, .svg, .webp in src/
    const result = execSync(`grep -rioE "['\\"\`][^'\\"\`]+?\\.(png|jpg|jpeg|svg|webp)['\\"\`]" src/ || true`).toString();
    const lines = result.split('\n').filter(Boolean);
    const issues = [];
    const ok = [];

    lines.forEach(line => {
        const parts = line.split(':');
        const file = parts[0];
        const match = parts.slice(1).join(':').replace(/['"`]/g, '');
        
        // Check if path is absolute starting with / or relative
        let checkPath = '';
        if (match.startsWith('/')) {
            checkPath = path.join(__dirname, 'public', match);
        } else if (match.startsWith('http')) {
            return; // ignore external URLs
        } else {
            // relative path
            const dir = path.dirname(path.join(__dirname, file));
            checkPath = path.join(dir, match);
        }

        if (!fs.existsSync(checkPath)) {
            issues.push(`[GHOST PATH] ${file} -> ${match}`);
        } else {
            ok.push(`[OK] ${file} -> ${match}`);
        }
    });

    console.log(`Found ${issues.length} ghost paths and ${ok.length} valid paths.`);
    if (issues.length > 0) {
        console.log("\nGhost paths:");
        issues.forEach(i => console.log(i));
    }
}

findImagesInCode();

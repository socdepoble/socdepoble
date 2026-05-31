const fs = require('fs');

const content = fs.readFileSync('src/data/GenotipContent.js', 'utf-8');
const lines = content.split('\n');

let truncateIndex = -1;
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('Filesystem-Based Skill Loading') || lines[i].includes('This example demonstrates how to load domain-specific knowledge')) {
        // Go back to the `<div class="mb-12">` start
        for (let j = i; j >= Math.max(0, i - 10); j--) {
            if (lines[j].includes('<div class="mb-12">')) {
                truncateIndex = j;
                break;
            }
        }
        break;
    }
}

if (truncateIndex !== -1) {
    const newLines = lines.slice(0, truncateIndex);
    newLines.push('  </div>');
    newLines.push('</div>');
    newLines.push('`;');
    
    fs.writeFileSync('src/data/GenotipContent.js', newLines.join('\n'), 'utf-8');
    console.log(`Truncated file at line ${truncateIndex}`);
} else {
    console.log("English section not found.");
}

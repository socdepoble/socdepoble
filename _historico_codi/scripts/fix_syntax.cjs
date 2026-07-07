const fs = require('fs');
const content = fs.readFileSync('src/data/GenotipContent.js', 'utf-8');
const lines = content.split('\n');

let index = -1;
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('🧠</span> SKILL')) {
        // Go back 3 lines to the `<div class="mb-12">`
        index = i - 3;
        break;
    }
}

if (index !== -1) {
    const newLines = lines.slice(0, index);
    newLines.push('  </div>');
    newLines.push('</div>');
    newLines.push('`;');
    fs.writeFileSync('src/data/GenotipContent.js', newLines.join('\n'), 'utf-8');
    console.log("Fixed syntax error and properly truncated!");
} else {
    console.log("Could not find the target line");
}

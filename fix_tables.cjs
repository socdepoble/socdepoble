const fs = require('fs');

function processFile(filename) {
    let content = fs.readFileSync(filename, 'utf-8');
    
    // Convert markdown tables to HTML.
    // We will match blocks of lines starting with |
    const lines = content.split('\n');
    let outLines = [];
    let inTable = false;
    
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
            if (!inTable) {
                inTable = true;
                outLines.push('<div class="overflow-x-auto my-6"><table class="w-full text-left border-collapse border border-stone-200 dark:border-stone-700">');
            }
            
            // Skip the separator line
            if (line.includes('---')) {
                continue;
            }
            
            const isHeader = outLines[outLines.length - 1].includes('<table');
            const cells = line.split('|').map(c => c.trim()).filter((c, idx, arr) => !(idx === 0 && c === '') && !(idx === arr.length - 1 && c === ''));
            
            outLines.push('  <tr class="border-b border-stone-200 dark:border-stone-700">');
            cells.forEach(cell => {
                if (isHeader) {
                    outLines.push(`    <th class="py-3 px-4 bg-stone-50 dark:bg-stone-800/50 font-bold border-r border-stone-200 dark:border-stone-700">${cell}</th>`);
                } else {
                    outLines.push(`    <td class="py-3 px-4 border-r border-stone-200 dark:border-stone-700">${cell}</td>`);
                }
            });
            outLines.push('  </tr>');
        } else {
            if (inTable) {
                inTable = false;
                outLines.push('</table></div>');
            }
            // Some fixes for </p><h
            line = line.replace(/<\/p><h/g, '</p>\n<h');
            outLines.push(line);
        }
    }
    
    if (inTable) {
        outLines.push('</table></div>');
    }

    fs.writeFileSync(filename, outLines.join('\n'), 'utf-8');
    console.log(`Processed ${filename}`);
}

processFile('src/data/GenotipContent.js');

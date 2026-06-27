const fs = require('fs');

function processFile(filename) {
    let content = fs.readFileSync(filename, 'utf-8');
    
    // 1. Remove the absolute background decorations
    content = content.replace(/<div class="absolute top-0 right-0 w-32 h-32 bg-[a-z]+-500\/10 rounded-bl-\[100px\] -z-10 transition-transform group-hover:scale-110"><\/div>/g, '');
    
    // 2. Remove the section wrappers but keep the content
    // The sections are: <section class="bg-white dark:bg-stone-900 rounded-3xl p-8 md:p-10 shadow-xl border border-stone-200 dark:border-stone-800 relative overflow-hidden group(.*?)">
    // We will just replace them with standard divs and spacing
    content = content.replace(/<section class="bg-white dark:bg-stone-900 rounded-3xl p-8 md:p-10 shadow-xl border border-stone-200 dark:border-stone-800 relative overflow-hidden group[^>]*>/g, '<div class="mb-12">');
    content = content.replace(/<\/section>/g, '</div>');
    
    // Also remove HumanProject wrappers
    content = content.replace(/<div class="mt-6 p-5 bg-[a-z]+-50 dark:bg-[a-z]+-950\/30 rounded-2xl border border-[a-z]+-100 dark:border-[a-z]+-900\/50">/g, '<div class="mt-6 p-5 bg-stone-50 dark:bg-stone-800/50 rounded-2xl border border-stone-200 dark:border-stone-700">');
    content = content.replace(/<section class="bg-white dark:bg-stone-900 rounded-3xl p-8 md:p-10 shadow-xl border-t-\[8px\] border-orange-500 relative overflow-hidden group mt-12">/g, '<div class="mb-12 border-t-4 border-stone-200 pt-8">');

    // 3. Fix unclosed/unopened <p> tags and weird empty paragraphs
    content = content.replace(/<p class="mb-4"><\/p>/g, '');
    content = content.replace(/<\/p><h3/g, '</p>\n<h3');
    content = content.replace(/<\/p><h4/g, '</p>\n<h4');
    
    // 4. Convert markdown tables to HTML
    // A simple regex to find MD tables.
    // Example: | Mètrica | Mètode A (Lineal) | Mètode B (Casillero) | Estalvi |
    const tableRegex = /(\|.*\|\n\|[-: ]+\|\n(\|.*\|\n)+)/g;
    content = content.replace(tableRegex, (match) => {
        const lines = match.trim().split('\n');
        let html = '<div class="overflow-x-auto my-6"><table class="w-full text-left border-collapse">\n';
        
        lines.forEach((line, index) => {
            if (index === 1) return; // Skip separator line
            
            const cells = line.split('|').map(c => c.trim()).filter((c, i, arr) => !(i === 0 && c === '') && !(i === arr.length - 1 && c === ''));
            
            html += '  <tr class="border-b border-stone-200 dark:border-stone-700">\n';
            cells.forEach(cell => {
                if (index === 0) {
                    html += `    <th class="py-3 px-4 bg-stone-50 dark:bg-stone-800/50 font-bold">${cell}</th>\n`;
                } else {
                    html += `    <td class="py-3 px-4">${cell}</td>\n`;
                }
            });
            html += '  </tr>\n';
        });
        
        html += '</table></div>\n';
        return html;
    });

    // 5. Replace markdown headings inside paragraphs if any: <p class="mb-4"><h4... 
    content = content.replace(/<p class="mb-4">\s*<h([1-6])/g, '<h$1');
    content = content.replace(/<\/h([1-6])>\s*<\/p>/g, '</h$1>');

    fs.writeFileSync(filename, content, 'utf-8');
    console.log(`Processed ${filename}`);
}

processFile('src/data/GenotipContent.js');
processFile('src/data/HumanProjectContent.js');


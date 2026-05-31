const fs = require('fs');

function processFile(filename) {
    let content = fs.readFileSync(filename, 'utf-8');
    
    // Fix loose <li> tags (often followed by </p>)
    // For example: <li class="ml-4 list-disc">...</li></p> without an opening <ul>
    // And sometimes <p><li...
    content = content.replace(/<\/p>\s*<li/g, '</ul>\n<li');
    content = content.replace(/<li class="ml-4 list-disc">/g, '<ul class="list-disc pl-5 space-y-2 mt-4"><li class="ml-4 list-disc">');
    // The above is too naive and would create many <ul> tags.
    // Instead, I'll do a regex replace to wrap contiguous <li> blocks.
    
    // Actually, the easiest way to fix HTML is to just replace the specific bad blocks manually for the list.
    // I will write custom replacements for the known bad areas.
    
    fs.writeFileSync(filename, content, 'utf-8');
    console.log(`Processed ${filename}`);
}

// processFile('src/data/GenotipContent.js');

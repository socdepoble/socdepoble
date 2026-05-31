const fs = require('fs');
const path = require('path');

const pluginDirs = [
    '/Users/javillinares/.gemini/config/plugins/chrome-devtools-plugin/skills',
    '/Users/javillinares/.gemini/config/plugins/modern-web-guidance-plugin/skills'
];

let skillsHtml = '';

for (const dir of pluginDirs) {
    if (!fs.existsSync(dir)) continue;
    const skills = fs.readdirSync(dir);
    for (const skill of skills) {
        const mdPath = path.join(dir, skill, 'SKILL.md');
        if (fs.existsSync(mdPath)) {
            let mdContent = fs.readFileSync(mdPath, 'utf-8');
            let skillTitle = skill.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            
            // Format markdown to basic HTML for Genotip
            let htmlBody = mdContent
                .replace(/^#\s+(.*)$/gm, '<h3 class="font-bold text-xl mt-6 mb-2 text-stone-900 dark:text-white">$1</h3>')
                .replace(/^##\s+(.*)$/gm, '<h4 class="font-bold text-lg mt-4 mb-2 text-stone-800 dark:text-stone-200">$1</h4>')
                .replace(/^###\s+(.*)$/gm, '<h5 class="font-bold text-md mt-4 mb-2 text-stone-800 dark:text-stone-200">$1</h5>')
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/`(.*?)`/g, '<code class="px-1 py-0.5 bg-stone-100 dark:bg-stone-800 rounded font-mono text-sm text-stone-800 dark:text-stone-200">$1</code>')
                // Fix code blocks using the same format as Genotip
                .replace(/```([a-z]*)\n([\s\S]*?)```/g, '<pre class="bg-stone-100 dark:bg-stone-800 p-4 rounded-xl overflow-x-auto text-sm my-6 border border-stone-200 dark:border-stone-700"><code class="language-$1">$2</code></pre>')
                // Fix list items
                .replace(/^[-*]\s+(.*)$/gm, '<li class="ml-4 list-disc">$1</li>')
                .replace(/^\d+\.\s+(.*)$/gm, '<li class="ml-4 list-decimal">$1</li>');

            // Wrap paragraphs in <p> loosely
            htmlBody = htmlBody.split('\n\n').map(p => {
                if (!p.startsWith('<h') && !p.startsWith('<pre') && !p.startsWith('<li')) {
                    return `<p class="mb-4">${p.trim()}</p>`;
                }
                if (p.startsWith('<li')) {
                    return `<ul class="mb-4 space-y-2 text-stone-700 dark:text-stone-300">${p}</ul>`;
                }
                return p;
            }).join('\n');
            
            // ESCAPE FOR JAVASCRIPT TEMPLATE LITERAL
            htmlBody = htmlBody.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$');
            
            skillsHtml += `
    <div class="mb-12">
      <h2 class="text-2xl md:text-3xl font-bold text-amber-600 dark:text-amber-500 mb-4 flex items-center gap-3">
        <span class="text-3xl">🧠</span> ${skillTitle}
      </h2>
      <div class="mb-4 flex gap-2">
        <span class="px-3 py-1 bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 text-xs font-bold rounded-full uppercase tracking-widest">Mixa (DevTools)</span>
      </div>
      <div class="markdown-content text-stone-700 dark:text-stone-300 space-y-4">
        ${htmlBody}
      </div>
    </div>
`;
        }
    }
}

let genotipPath = 'src/data/GenotipContent.js';
let genotipContent = fs.readFileSync(genotipPath, 'utf-8');

let insertPos = genotipContent.lastIndexOf('  </div>\\n</div>\\n\`;');
if (insertPos === -1) {
    insertPos = genotipContent.lastIndexOf('  </div>\n</div>\n`;');
}

if (insertPos !== -1) {
    let before = genotipContent.substring(0, insertPos);
    let after = genotipContent.substring(insertPos);
    fs.writeFileSync(genotipPath, before + skillsHtml + after, 'utf-8');
    console.log('Appended skills successfully!');
} else {
    console.log('Failed to find insertion point');
}

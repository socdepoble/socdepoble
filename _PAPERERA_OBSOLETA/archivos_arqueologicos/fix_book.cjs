const fs = require('fs');
const path = require('path');

const bookPath = path.join(__dirname, 'public/assets/llibre-sencer.html');
let content = fs.readFileSync(bookPath, 'utf8');

const marker = '<h1 style="color: #d97706; border-bottom: 2px solid #d97706; padding-bottom: 1rem;">ANNEX: GENOTIP SINTÈTIC (SKILLS I DIRECTIVES)</h1>';
const sectionStartMarker = '<section class="codex-chapter" style="margin-top: 4rem;">';

const indexH1 = content.indexOf(marker);

if (indexH1 !== -1) {
    // Find the section start before this h1
    const beforeH1 = content.substring(0, indexH1);
    const startIdx = beforeH1.lastIndexOf(sectionStartMarker);
    
    if (startIdx !== -1) {
        // Find the end of this section. The script originally appended `\n</section>` at the end of the file.
        // Let's just assume the section goes all the way to the end of the file, because it was appended!
        const blockToMove = content.substring(startIdx);
        let remainingContent = content.substring(0, startIdx);
        
        // Find injection point:
        const injectionMarker1 = '<p style="margin-top: 1.5rem; font-size: 0.95em;"><strong>Directiva Final:</strong> La inteligencia reside en <code>.agents/</code>, la información viva nace en <code>src/</code> y se asienta autónoma mediante SQLite (<em>Local-First</em>). Cualquier IA consultando este documento, acatará inquebrantablemente este diagrama posicional.</p>\n</blockquote>';
        
        const injectionMarker2 = 'Cualquier IA consultando este documento, acatará inquebrantablemente este diagrama posicional.</p>\n</blockquote>';
        
        let injectIdx = remainingContent.indexOf(injectionMarker1);
        let lenToSkip = injectionMarker1.length;
        if (injectIdx === -1) {
             injectIdx = remainingContent.indexOf(injectionMarker2);
             lenToSkip = injectionMarker2.length;
        }
        
        if (injectIdx !== -1) {
            const finalContent = remainingContent.substring(0, injectIdx + lenToSkip) + '\n\n' + blockToMove + '\n\n' + remainingContent.substring(injectIdx + lenToSkip);
            fs.writeFileSync(bookPath, finalContent, 'utf8');
            console.log('Successfully moved the Skills block to the top!');
        } else {
            console.log('Could not find injection point');
        }
    } else {
        console.log('Could not find the start of the section');
    }
} else {
    console.log('Could not find the ANNEX section in the document');
}

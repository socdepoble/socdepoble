const fs = require('fs');
const path = require('path');

const bookPath = path.join(__dirname, 'public/assets/llibre-sencer.html');
const skillsDir = path.join(__dirname, '.agents/skills');

const convertMarkdownToHTML = (mdText) => {
    let html = mdText
        // Headers
        .replace(/^### (.*$)/gim, '<h4 style="color: #ea580c; border-bottom: 1px dotted #e2e8f0; padding-bottom: 0.5rem; margin-top: 1.5rem;">$1</h4>')
        .replace(/^## (.*$)/gim, '<h3 style="color: #4338ca; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.5rem; margin-top: 2rem;">$1</h3>')
        .replace(/^# (.*$)/gim, '<h2 style="color: #4338ca; border-bottom: 2px solid #e2e8f0; padding-bottom: 1rem; margin-top: 2.5rem;">$1</h2>')
        // Bold
        .replace(/\*\*([^*]+)\*\*/gim, '<strong>$1</strong>')
        // Italics
        .replace(/\*([^*]+)\*/gim, '<em>$1</em>')
        // Lists
        .replace(/^\* (.*$)/gim, '<li style="margin-left: 20px;">$1</li>')
        // Newlines for lists
        .replace(/<\/li>\n<li/gim, '</li><li')
        // Code blocks
        .replace(/```([^`]+)```/gim, '<pre style="background: var(--theme-panel); padding: 1rem; border-radius: 8px; overflow-x: auto;"><code>$1</code></pre>')
        // Inline code
        .replace(/`([^`]+)`/gim, '<code style="background: rgba(0,0,0,0.1); padding: 0.2rem 0.4rem; border-radius: 4px;">$1</code>')
        // Blockquotes
        .replace(/^> (.*$)/gim, '<blockquote style="border-left: 4px solid var(--theme-accent-primary); padding-left: 1rem; color: #4b5563; font-style: italic;">$1</blockquote>')
        // Paragraphs (double newlines)
        .replace(/\n\n/gim, '</p><p style="margin-bottom: 1rem;">');

    // Wrap in paragraph if not already
    return `<p style="margin-bottom: 1rem;">${html}</p>`;
};

try {
    const files = fs.readdirSync(skillsDir).filter(f => f.endsWith('.md'));
    let appendedHTML = '\n\n<section class="codex-chapter" style="margin-top: 4rem;">';
    appendedHTML += '<h1 style="color: #d97706; border-bottom: 2px solid #d97706; padding-bottom: 1rem;">ANNEX: GENOTIP SINTÈTIC (SKILLS I DIRECTIVES)</h1>';
    appendedHTML += '<p>Aquest annex consolida l\'arquitectura cognitiva dels agents. Documenta els procediments operatius de tota la xarxa d\'IA de Sóc de Poble.</p>';
    
    files.forEach(file => {
        const filePath = path.join(skillsDir, file);
        const mdText = fs.readFileSync(filePath, 'utf-8');
        
        // Remove yaml frontmatter
        const cleanMd = mdText.replace(/---([\s\S]*?)---/, '');
        
        appendedHTML += `\n\n<div style="margin-top: 3rem; padding: 2rem; background: var(--bg-panel); border-radius: 12px; border: 1px solid var(--theme-accent-primary-faint);">`;
        appendedHTML += convertMarkdownToHTML(cleanMd);
        appendedHTML += `</div>`;
    });
    
    appendedHTML += '\n</section>';
    
    // Append to book
    fs.appendFileSync(bookPath, appendedHTML, 'utf-8');
    console.log('Appended successfully');

} catch (e) {
    console.error('Error:', e);
}

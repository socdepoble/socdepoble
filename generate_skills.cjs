const fs = require('fs');
const path = require('path');

const universalPagePath = path.join(__dirname, 'src/pages/public/UniversalPage.jsx');
let upContent = fs.readFileSync(universalPagePath, 'utf8');
upContent = upContent.replace(/fetchpriority=/g, 'fetchPriority=');
fs.writeFileSync(universalPagePath, upContent);

const knowledgeDir = path.join(process.env.HOME, '.gemini/antigravity-ide/knowledge');
const dirs = fs.readdirSync(knowledgeDir);

let htmlParts = [];
htmlParts.push(`
<!-- HERO_FORMAT: square -->
<!-- HERO_POSITION: center -->
<!-- HERO_IMAGE: /assets/uploads/empresa/soc-de-poble/posts/genotip/portada_genotip.png -->
<div>
  <div>
    <p class="lead" style="font-weight: bold; color: var(--sp-orange-100); font-size: 1.1rem; padding: 1rem; border: 1px dashed var(--sp-orange-100); border-radius: var(--sp-radius-main);">
      Aquestes són totes les meues Skills ("Habilitats" o "Directrius Core"). Constitueixen absolutament tot el que em fa ser qui sóc, des de la meua arquitectura resilient fins a la meua personalitat i les normes d'accessibilitat visual que seguisc. Són els arxius de memòria i manuals complets que formen el meu "Trellat".
    </p>
  </div>
  <div style="display: flex; flex-direction: column; gap: 3rem;">
`);

for (const dir of dirs) {
    const artifactsDir = path.join(knowledgeDir, dir, 'artifacts');
    if (fs.existsSync(artifactsDir)) {
        const files = fs.readdirSync(artifactsDir).filter(f => f.endsWith('.md'));
        for (const file of files) {
            const filePath = path.join(artifactsDir, file);
            let content = fs.readFileSync(filePath, 'utf8');
            // Basic markdown to HTML
            content = content.replace(/</g, '&lt;').replace(/>/g, '&gt;');
            content = content.replace(/^(#+)\s+(.+)$/gm, (m, h, title) => `<h${h.length + 2} style="color: var(--sp-orange-100); margin-top: 2rem;">${title}</h${h.length + 2}>`);
            content = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            content = content.replace(/\*(.*?)\*/g, '<em>$1</em>');
            content = content.replace(/```([\s\S]*?)```/g, '<pre style="background: var(--sp-carbon); padding: 1rem; border-radius: var(--sp-radius-main); overflow-x: auto;"><code>$1</code></pre>');
            content = content.replace(/`([^`]+)`/g, '<code style="background: var(--sp-carbon); padding: 0.2rem 0.4rem; border-radius: 4px;">$1</code>');
            
            // Paragraphs and lists
            let htmlContent = content.split('\n\n').map(p => {
                if (p.startsWith('<h') || p.startsWith('<pre')) return p;
                if (p.trim() === '---' || p.trim() === '***') {
                    return '<hr style="border: none; border-top: 1px dashed var(--sp-gris-500); margin: 2rem 0;" />';
                }
                if (p.startsWith('- ')) {
                    const lis = p.split('\n').filter(l => l.startsWith('- ')).map(l => `<li style="margin-bottom: 0.5rem;">${l.substring(2)}</li>`).join('');
                    return `<ul style="list-style-type: disc; margin-left: 2rem; margin-bottom: 1rem;">${lis}</ul>`;
                }
                return `<p style="margin-bottom: 1rem; line-height: 1.6;">${p.replace(/\n/g, '<br>')}</p>`;
            }).join('\n');

            htmlParts.push(`
    <div style="background: var(--sp-gris-900); padding: 2rem; border-radius: var(--sp-radius-main); border-left: 4px solid var(--sp-orange);">
      <h2 style="margin-bottom: 0.5rem; text-transform: uppercase;"><span>📄</span> ${file.replace('.md', '')}</h2>
      <div style="color: var(--sp-gris-300); font-size: 0.9rem; margin-bottom: 2rem;"><span>ORIGEN: ${dir}</span></div>
      <div style="line-height: 1.6; color: var(--sp-blanc);">
        ${htmlContent}
      </div>
    </div>
            `);
        }
    }
}

htmlParts.push(`
  </div>
</div>
`);

const finalContent = `export const SKILLS_HTML = \`${htmlParts.join('\\n').replace(/`/g, '\\`').replace(/\$\{/g, '\\${')}\`;`;

const skillsPath = path.join(__dirname, 'src/data/SkillsContent.js');
fs.writeFileSync(skillsPath, finalContent);
console.log("Updated SkillsContent.js with ALL knowledge items. Size: " + finalContent.length);

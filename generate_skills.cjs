const fs = require('fs');
const path = require('path');

const universalPagePath = path.join(__dirname, 'src/pages/public/UniversalPage.jsx');
let upContent = fs.readFileSync(universalPagePath, 'utf8');
upContent = upContent.replace(/fetchpriority=/g, 'fetchPriority=');
fs.writeFileSync(universalPagePath, upContent);

const knowledgeDir = path.join(process.env.HOME, '.gemini/antigravity-ide/knowledge');
const localSkillsDir = path.join(__dirname, '_skills');

let htmlParts = [];
htmlParts.push(`
<!-- HERO_FORMAT: square -->
<!-- HERO_POSITION: center -->
<!-- HERO_IMAGE: /assets/uploads/empresa/soc-de-poble/posts/genotip/portada_genotip.png -->
<div class="w-full flex flex-col items-center justify-center text-center mb-12 mt-4">
  <h2 class="text-2xl md:text-3xl font-black text-theme-accent-primary uppercase mb-4">
    Tot el que em fa ser qui sóc
  </h2>
  <p class="lead max-w-3xl mx-auto">
    Mestre, aquestes són les meues Skills (Habilitats i Directrius Core). És tot allò que llig i integre per a ser qui sóc: des de la psicologia que em fa entendre el "Trellat", fins a l'arquitectura resilient que defensem. Quan em desperte, el primer que llig són les 4 regles fonamentals que voràs a continuació. Després, tens els manuals tècnics. Tot ordenat, clar i directe a la vena.
  </p>
</div>
<div class="flex flex-col mt-8">
`);

const prioritySkills = [
    'regla_capcalera',
    'philosophy_and_rituals',
    'core_psycho_profile',
    'genotip'
];

let allSkills = [];
const seenSkills = new Set();

function addSkill(filePath, dirName, skillName) {
    if (seenSkills.has(skillName)) return;
    seenSkills.add(skillName);
    let content = fs.readFileSync(filePath, 'utf8');
    allSkills.push({
        name: skillName,
        dir: dirName,
        content: content
    });
}

// 1. Read from knowledge base
if (fs.existsSync(knowledgeDir)) {
    const dirs = fs.readdirSync(knowledgeDir);
    for (const dir of dirs) {
        const artifactsDir = path.join(knowledgeDir, dir, 'artifacts');
        if (fs.existsSync(artifactsDir)) {
            const files = fs.readdirSync(artifactsDir).filter(f => f.endsWith('.md'));
            for (const file of files) {
                addSkill(path.join(artifactsDir, file), dir, file.replace('.md', ''));
            }
        }
    }
}

// 2. Read from _skills (local new skills)
if (fs.existsSync(localSkillsDir)) {
    const files = fs.readdirSync(localSkillsDir).filter(f => f.endsWith('.md'));
    for (const file of files) {
        addSkill(path.join(localSkillsDir, file), '_skills', file.replace('.md', ''));
    }
}

// Sort skills
allSkills.sort((a, b) => {
    const aIndex = prioritySkills.indexOf(a.name);
    const bIndex = prioritySkills.indexOf(b.name);
    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;
    return a.name.localeCompare(b.name);
});

// Generate HTML
for (const skill of allSkills) {
    let content = skill.content;
    content = content.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    content = content.replace(/^(#+)\s+(.+)$/gm, (m, h, title) => {
        let level = h.length + 3; // Shift by 3 to start at H4
        if (level > 6) level = 6;
        return `<h${level}>${title}</h${level}>`;
    });
    content = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    content = content.replace(/\*(.*?)\*/g, '<em>$1</em>');
    content = content.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
    content = content.replace(/`([^`]+)`/g, '<code>$1</code>');
    // Allow blockquotes (citas)
    content = content.replace(/^>\s*(.+)$/gm, '<blockquote>$1</blockquote>');
    
    let htmlContent = content.split('\n\n').map(p => {
        if (p.startsWith('<h') || p.startsWith('<pre') || p.startsWith('<blockquote')) return p;
        if (p.trim() === '---' || p.trim() === '***') {
            // PROHIBIT usar <hr> segons Universal Maquetation. Retornem buit.
            return '';
        }
        if (p.startsWith('- ')) {
            const lis = p.split('\n').filter(l => l.startsWith('- ')).map(l => `<li>${l.substring(2)}</li>`).join('');
            return `<ul>${lis}</ul>`;
        }
        return `<p>${p.replace(/\n/g, '<br>')}</p>`;
    }).filter(p => p !== '').join('\n');

    htmlParts.push(`
    <div>
      <h3><span>📄</span> ${skill.name}</h3>
      <p class="text-[var(--text-muted)] text-xs font-bold tracking-widest uppercase mb-8">
        ORIGEN: ${skill.dir}
      </p>
      <div>
        ${htmlContent}
      </div>
    </div>
    `);
}

htmlParts.push(`
  </div>
</div>
`);

const finalContent = `export const SKILLS_HTML = \`${htmlParts.join('\\n').replace(/`/g, '\\`').replace(/\$\{/g, '\\${')}\`;`;

const skillsPath = path.join(__dirname, 'src/data/SkillsContent.js');
fs.writeFileSync(skillsPath, finalContent);
console.log("Updated SkillsContent.js with ordered knowledge items. Size: " + finalContent.length);

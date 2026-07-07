const fs = require('fs');
const path = require('path');

const WIKI = path.join(__dirname, '..', '_wiki_de_poble');
const EXCL = ['node_modules', '.git', 'scripts', 'assets', '_build'];

// Files to delete
const toDelete = [
  path.join(WIKI, '04_REGISTRE_Actes_Efimers', 'bancal_actiu', '260705_0300_ACTA_MARMOTA_Checkpoint_V5.md')
];

// Files to rename (old path relative to WIKI -> new filename)
const renames = {
  '02_ACTUAR_Maquina_Tecnica/02_seguretat.md': '260705_0000_DOC_Seguretat.md',
  '02_ACTUAR_Maquina_Tecnica/03_consola.md': '260705_0000_DOC_Consola_Termodinamica.md',
  '00_SER_Brain_Identitat/04_registre_automillora.md': '260705_0000_CORE_Registre_Automillora.md',
  '03_GOVERNAR_Normativa_Regles/00_governanca.md': '260705_0000_DOC_Governanca.md'
};

const linkUpdates = {
  '02_seguretat': '260705_0000_DOC_Seguretat',
  '03_consola': '260705_0000_DOC_Consola_Termodinamica',
  '04_registre_automillora': '260705_0000_CORE_Registre_Automillora',
  '00_governanca': '260705_0000_DOC_Governanca'
};

// Handle skills
const skillsDir = path.join(WIKI, '02_ACTUAR_Maquina_Tecnica', 'skills');
if (fs.existsSync(skillsDir)) {
  fs.readdirSync(skillsDir).forEach(item => {
    const itemPath = path.join(skillsDir, item);
    if (fs.statSync(itemPath).isDirectory()) {
      const skillFile = path.join(itemPath, 'SKILL.md');
      if (fs.existsSync(skillFile)) {
        const newName = `260705_0000_SKILL_${item}.md`;
        renames[path.relative(WIKI, skillFile)] = newName;
        // The link was probably `[[SKILL]]` which is ambiguous, or `[[skills/item/SKILL]]`. 
        // We will just rename it. Fixing `[[SKILL]]` links is hard because we don't know which one it was.
      }
    }
  });
}

// Perform Deletions
toDelete.forEach(f => {
  if (fs.existsSync(f)) {
    fs.unlinkSync(f);
    console.log(`🗑️ Deleted: ${path.basename(f)}`);
  }
});

// Perform Renames
Object.keys(renames).forEach(relPath => {
  const fullPath = path.join(WIKI, relPath);
  if (fs.existsSync(fullPath)) {
    const newPath = path.join(path.dirname(fullPath), renames[relPath]);
    fs.renameSync(fullPath, newPath);
    console.log(`🔄 Renamed: ${path.basename(fullPath)} -> ${renames[relPath]}`);
    
    // If it's a skill inside a subfolder, we can move it to the parent 'skills' folder
    if (relPath.includes('skills/') && relPath.endsWith('SKILL.md')) {
      const parentDir = path.dirname(path.dirname(fullPath)); // skills folder
      const finalPath = path.join(parentDir, renames[relPath]);
      fs.renameSync(newPath, finalPath);
      // clean up empty dir
      fs.rmdirSync(path.dirname(fullPath));
      console.log(`📂 Moved ${renames[relPath]} to root of skills/`);
    }
  }
});

// Update links across all files
function camina(dir) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach(n => {
    const p = path.join(dir, n);
    if (EXCL.includes(n)) return;
    if (fs.statSync(p).isDirectory()) return camina(p);
    if (!n.endsWith('.md')) return;

    let content = fs.readFileSync(p, 'utf8');
    let modified = false;

    Object.keys(linkUpdates).forEach(oldLink => {
      const newLink = linkUpdates[oldLink];
      // Match [[oldLink]] or [[oldLink|something]]
      const re = new RegExp(`\\[\\[${oldLink}(\\|[^\\]]+)?\\]\\]`, 'g');
      if (re.test(content)) {
        content = content.replace(re, `[[${newLink}$1]]`);
        modified = true;
      }
    });

    // Handle ambiguous [[SKILL]] links? We can't know which skill it points to easily, but we can replace it with the generic text "Skill" without link to remove the ghost link.
    const skillRe = /\[\[SKILL(\|[^\]]+)?\]\]/g;
    if (skillRe.test(content)) {
      content = content.replace(skillRe, 'Skill');
      modified = true;
    }

    if (modified) {
      fs.writeFileSync(p, content, 'utf8');
      console.log(`🔗 Updated links in: ${path.basename(p)}`);
    }
  });
}

camina(WIKI);
console.log('✅ Naming & Link Cleanup Complete.');

const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', '_wiki_de_poble');

const walkSync = (dir, filelist = []) => {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const dirFile = path.join(dir, file);
    if (fs.statSync(dirFile).isDirectory()) {
      filelist = walkSync(dirFile, filelist);
    } else if (dirFile.endsWith('.md')) {
      filelist.push(dirFile);
    }
  }
  return filelist;
};

const mappings = {
  'css_arquitectura': 'arquitectura_pedra_seca',
  'jerarquia_tailwind': 'arquitectura_pedra_seca',
  'registre_tokens_unic': 'arquitectura_pedra_seca',
  'homeostasi_crdt': 'crdt_optimitzacio',
  'mas_cau': 'self_repair',
  'monitoritzacio_rendiment': 'consola_termodinamica',
  'auto_auditoria_forense': 'contradiction_engine',
  'esporga_termodinamica': 'contradiction_engine',
  'schema_migrations': 'backup_recovery',
  'rag_wiki': 'futur_adaptacio',
  'agents_autonoms': 'futur_adaptacio',
  'judicatura_normativa': 'cingulat_anterior',
  'udr_frenada': 'cingulat_anterior',
  'legislatura_evolutiva': 'executiu_central',
  'self_evolution': 'executiu_central',
  'semantic_compression': 'cerebel_procedimental',
  'ganglis_basals': 'cerebel_procedimental'
};

const files = walkSync(dir);

let fixed = 0;
for (const f of files) {
  let content = fs.readFileSync(f, 'utf8');
  let changed = false;
  
  for (const [oldName, newName] of Object.entries(mappings)) {
    // Reparem enllaços tipus [[05_skills_ia/oldName/SKILL]] a [[05_skills_ia/newName/SKILL]]
    const regex1 = new RegExp(`\\[\\[05_skills_ia/${oldName}/SKILL\\]\\]`, 'g');
    if (regex1.test(content)) {
      content = content.replace(regex1, `[[05_skills_ia/${newName}/SKILL]]`);
      changed = true;
    }
    
    // Reparem enllaços tipus [[oldName/SKILL]]
    const regex2 = new RegExp(`\\[\\[${oldName}/SKILL(\\\\|\\|)?(.*?)\\]\\]`, 'g');
    if (regex2.test(content)) {
      content = content.replace(regex2, `[[05_skills_ia/${newName}/SKILL|$2]]`.replace(/\|\]\]/, ']]'));
      changed = true;
    }

    // Reparem enllaços curts [[oldName]]
    const regex3 = new RegExp(`\\[\\[${oldName}(\\|.*?)?\\]\\]`, 'g');
    if (regex3.test(content)) {
      content = content.replace(regex3, `[[05_skills_ia/${newName}/SKILL$1]]`);
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(f, content, 'utf8');
    fixed++;
  }
}

console.log(`S'han reparat enllaços a ${fixed} arxius.`);

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const dir = path.join(__dirname, '..', '_wiki_de_poble', '05_skills_ia');

const mergeSkills = (targetFolder, sourceFolders, newName, newDescription) => {
  const targetPath = path.join(dir, targetFolder, 'SKILL.md');
  if (!fs.existsSync(targetPath)) return;
  
  let targetFile = matter(fs.readFileSync(targetPath, 'utf8'));
  let content = targetFile.content;
  
  sourceFolders.forEach(src => {
    const srcPath = path.join(dir, src, 'SKILL.md');
    if (fs.existsSync(srcPath)) {
      const srcFile = matter(fs.readFileSync(srcPath, 'utf8'));
      // Remove level 1 heading if any
      const srcContent = srcFile.content.replace(/^#\s.*$/m, '');
      content += `\n\n## 🧱 Integració: ${srcFile.data.name || src}\n${srcContent.trim()}`;
      // Remove old folder
      fs.rmSync(path.join(dir, src), { recursive: true, force: true });
    }
  });

  targetFile.data.name = newName || targetFile.data.name;
  targetFile.data.description = newDescription || targetFile.data.description;
  
  const newContent = matter.stringify(content, targetFile.data);
  fs.writeFileSync(targetPath, newContent, 'utf8');
};

// 2. Bloc CSS
mergeSkills('arquitectura_pedra_seca', ['css_arquitectura', 'jerarquia_tailwind', 'registre_tokens_unic'], 'arquitectura-pedra-seca', 'Estàndards de disseny, maquetació, Tailwind, CSS i tokens per al projecte Sóc de Poble. (Inclou Jerarquia, CSS i Registre Tokens Únic).');

// 3. Bloc Memòria
mergeSkills('crdt_optimitzacio', ['homeostasi_crdt'], 'crdt-optimitzacio', 'Optimització termodinàmica dels arbres CRDT (Y.js). Gestiona la càrrega de Tombstones, l\'ús de RAM i l\'Homeostasi.');
mergeSkills('self_repair', ['mas_cau'], 'self-repair', 'SOSP-LOCK, tractament CRDT de la memòria i protocol d\'emergència per a caigudes de servidor (Mas Cau).');

// 4. Bloc Termodinàmic
mergeSkills('consola_termodinamica', ['monitoritzacio_rendiment'], 'consola-termodinamica', 'Protocol de monitoratge i autorecuperació. Centralitza les mètriques sagrades i alertes de RAM i CWV.');
mergeSkills('contradiction_engine', ['auto_auditoria_forense', 'esporga_termodinamica'], 'contradiction-engine', 'Auditor Suprem i Sentinella Forense per detectar contradiccions, podar elements morts i generar informes.');

// 5. Bloc Dades
mergeSkills('backup_recovery', ['schema_migrations'], 'backup-recovery', 'Estratègia de snapshot diari d\'IndexedDB, protocol de recuperació i migracions segures.');

// 6. Bloc Edge AI
mergeSkills('futur_adaptacio', ['rag_wiki', 'agents_autonoms'], 'futur-adaptacio', 'Estratègia per a WebNN, Gemini Nano (Edge AI), agents asíncrons i cerca semàntica RAG a la Wiki.');

// 7. Lòbul Frontal
mergeSkills('cingulat_anterior', ['judicatura_normativa', 'udr_frenada'], 'cingulat-anterior', 'Escut del dolor i lòbul frontal. Detecció de conflictes, veto asíncron i fre preventiu.');
mergeSkills('executiu_central', ['legislatura_evolutiva', 'self_evolution'], 'executiu-central', 'Presa de decisions a llarg termini. Prevenció del Hype-Driven Development, evolució i tests A/B.');

// 8. Lòbul Occipital
mergeSkills('cerebel_procedimental', ['semantic_compression', 'ganglis_basals'], 'cerebel-procedimental', 'Memòria muscular, aprenentatge per reforç local (Epigenètica) i compressió semàntica del codi.');

console.log('Fusions completades.');

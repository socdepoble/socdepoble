const fs = require('fs');
const path = require('path');

const wikiRoot = '/Users/javillinares/Documents/Antigravity/Sóc de Poble/_wiki_de_poble';

// 1. Fix Skills
const skillsDir = path.join(wikiRoot, '05_skills_ia');
const skills = fs.readdirSync(skillsDir);
for (const skillFolder of skills) {
  const skillPath = path.join(skillsDir, skillFolder, 'SKILL.md');
  if (fs.existsSync(skillPath)) {
    const content = fs.readFileSync(skillPath, 'utf8');
    if (!content.includes('[[00_index')) {
      fs.appendFileSync(skillPath, '\n\n---\n## 🔗 Veure també\n- [[00_index|Índex Central]]\n');
      console.log(`Afegit enllaç a 00_index en: ${skillFolder}`);
    }
  }
}

// 2. Fix Plantilles
const plantillesDir = path.join(wikiRoot, '07_plantilles');
const plantilles = fs.readdirSync(plantillesDir);
for (const plantilla of plantilles) {
  if (plantilla.endsWith('.md')) {
    const pPath = path.join(plantillesDir, plantilla);
    const content = fs.readFileSync(pPath, 'utf8');
    if (!content.includes('[[00_index')) {
      fs.appendFileSync(pPath, '\n\n---\n## 🔗 Veure també\n- [[00_index|Índex Central]]\n');
      console.log(`Afegit enllaç a 00_index en: ${plantilla}`);
    }
  }
}

// 3. Fix Prompts and Bundles (connect to 00_historial_sessions)
const produccioDir = path.join(wikiRoot, '80_produccio/generats_hui');
const historialPath = path.join(wikiRoot, '90_arxiu_historic/00_historial_sessions.md');
let historialContent = '';
if (fs.existsSync(historialPath)) {
  historialContent = fs.readFileSync(historialPath, 'utf8');
} else {
  historialContent = '# Historial de Sessions i Prompts\n\n';
}

const produccioFiles = fs.readdirSync(produccioDir);
for (const prodFile of produccioFiles) {
  if (prodFile.endsWith('.md')) {
    const filePath = path.join(produccioDir, prodFile);
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Add backlink inside the prompt
    if (!content.includes('[[90_arxiu_historic/00_historial_sessions')) {
      fs.appendFileSync(filePath, '\n\n---\n## 🔗 Registre Històric\n- Aquest document està indexat a: [[90_arxiu_historic/00_historial_sessions|Historial de Sessions]]\n');
      console.log(`Afegit backlink a historial en: ${prodFile}`);
    }
    
    // Add forward link in the history file
    const linkStr = `- [[80_produccio/generats_hui/${prodFile.replace('.md', '')}]]`;
    if (!historialContent.includes(linkStr)) {
      historialContent += `${linkStr}\n`;
      console.log(`Afegit link al historial per a: ${prodFile}`);
    }
  }
}

fs.writeFileSync(historialPath, historialContent, 'utf8');

// 4. Update 00_index.md with the actual skills list
const indexPath = path.join(wikiRoot, '00_index.md');
let indexContent = fs.readFileSync(indexPath, 'utf8');

// Replace the skills section
let newSkillsList = '## 05. Skills IA (Arquitectura Cognitiva)\n';
const sortedSkills = skills.filter(s => !s.startsWith('.') && fs.existsSync(path.join(skillsDir, s, 'SKILL.md'))).sort();
for (const s of sortedSkills) {
  newSkillsList += `- [[05_skills_ia/${s}/SKILL|${s}]]\n`;
}

// Simple regex replace for the section between ## 05. Skills IA and ## 06. Cultura
indexContent = indexContent.replace(/## 05\. Skills IA[\s\S]*?(?=## 06\. Cultura)/, newSkillsList + '\n');

// Replace Plantilles section
let newPlantillesList = '## 07. Plantilles\n';
const sortedPlantilles = plantilles.filter(p => p.endsWith('.md')).sort();
for (const p of sortedPlantilles) {
  newPlantillesList += `- [[07_plantilles/${p.replace('.md', '')}|${p.replace('.md', '')}]]\n`;
}

indexContent = indexContent.replace(/## 07\. Plantilles[\s\S]*?(?=## 08\. Capacitats)/, newPlantillesList + '\n');

fs.writeFileSync(indexPath, indexContent, 'utf8');
console.log('00_index.md actualitzat amb les llistes exactes.');

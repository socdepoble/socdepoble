const fs = require('fs');

try {
  const content = fs.readFileSync('/Users/javillinares/Documents/Antigravity/Sóc de Poble/src/data/SkillsContent.js', 'utf8');
  let html = content.replace('export const SKILLS_HTML = `', '');
  html = html.substring(0, html.lastIndexOf('`;'));
  
  // Guardar-ho directament a l'escriptori del Mestre per a més facilitat, o als artefactes.
  // Guardarem a artefactes:
  fs.writeFileSync('/Users/javillinares/.gemini/antigravity-ide/brain/0e7c2277-69e7-4e0d-a985-ac6e4bbdc34c/skills_bundle_complet.md', html);
  console.log("Extracció completada.");
} catch (e) {
  console.error("Error:", e);
}

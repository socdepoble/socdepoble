import fs from 'fs';

try {
  const content = fs.readFileSync('src/data/SkillsContent.js', 'utf8');
  let html = content.replace('export const SKILLS_HTML = `', '');
  html = html.substring(0, html.lastIndexOf('`;'));
  
  fs.writeFileSync('public/skills.md', html);
  console.log("✅ public/skills.md generat correctament per a les IAs!");
} catch (e) {
  console.error("❌ Error generant public/skills.md:", e);
}

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const dir = path.join(__dirname, '..', '_wiki_de_poble', '05_skills_ia');
const files = fs.readdirSync(dir);

let report = [];

for (const f of files) {
  const fullPath = path.join(dir, f);
  if (fs.statSync(fullPath).isDirectory()) {
    const skillFile = path.join(fullPath, 'SKILL.md');
    if (fs.existsSync(skillFile)) {
      const parsed = matter(fs.readFileSync(skillFile, 'utf8'));
      report.push(`- **${parsed.data.name}**: ${parsed.data.description}`);
    }
  }
}

fs.writeFileSync('scripts/report_skills.md', report.join('\n'));
console.log('Report creat a scripts/report_skills.md');

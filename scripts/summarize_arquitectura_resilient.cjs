const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', '.gemini', 'antigravity-ide', 'knowledge', 'arquitectura_resilient', 'artifacts');
if (!fs.existsSync(dir)) {
  console.log('Dir does not exist:', dir);
  process.exit(1);
}

const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));
let output = '';

for (const file of files) {
  const content = fs.readFileSync(path.join(dir, file), 'utf8');
  output += `\n\n--- FILE: ${file} ---\n`;
  // Just grab the first 300 chars or so to understand what it is about
  output += content.substring(0, 500) + '... [TRUNCATED]';
}

fs.writeFileSync(path.join(__dirname, '..', 'scripts', 'arq_resilient_summary.txt'), output);
console.log(`Summarized ${files.length} files. Saved to arq_resilient_summary.txt`);

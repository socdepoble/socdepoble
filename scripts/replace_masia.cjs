const fs = require('fs');
const path = require('path');

const dirs = [
  '/Users/javillinares/.gemini/antigravity-ide/knowledge',
  path.join(__dirname, '../_wiki_de_poble')
];

const replacements = [
  { regex: /\bde la Masia\b/g, to: 'del Mas' },
  { regex: /\bde la masia\b/g, to: 'del mas' },
  { regex: /\ba la Masia\b/g, to: 'al Mas' },
  { regex: /\ba la masia\b/g, to: 'al mas' },
  { regex: /\bla Masia\b/g, to: 'el Mas' },
  { regex: /\bLa Masia\b/g, to: 'El Mas' },
  { regex: /\bla masia\b/g, to: 'el mas' },
  { regex: /\bLa masia\b/g, to: 'El mas' },
  { regex: /\buna masia vella\b/g, to: 'un mas vell' },
  { regex: /\bMasia\b/g, to: 'Mas' },
  { regex: /\bmasia\b/g, to: 'mas' }
];

function processFile(p) {
  let content = fs.readFileSync(p, 'utf8');
  let newContent = content;
  
  for (const { regex, to } of replacements) {
    newContent = newContent.replace(regex, to);
  }
  
  if (content !== newContent) {
    fs.writeFileSync(p, newContent, 'utf8');
    console.log('Fixed:', p);
  }
}

function walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (p.endsWith('.md')) processFile(p);
  }
}

for (const d of dirs) walk(d);
console.log('Done replacing masia -> mas');

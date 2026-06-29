const fs = require('fs');
const path = require('path');

const targetDirs = [
  '/Users/javillinares/.gemini/antigravity-ide/knowledge',
  path.join(__dirname, '../_wiki_de_poble'),
  path.join(__dirname, '../src')
];

const targetFiles = [
  path.join(__dirname, '../tailwind.config.js'),
  path.join(__dirname, '../index.html')
];

const replacements = [
  { regex: /\bOssos i Pell\b/g, to: 'Cos i Vestit' },
  { regex: /\bossos i pell\b/g, to: 'cos i vestit' },
  { regex: /\bPell i Ossos\b/g, to: 'Vestit i Cos' },
  { regex: /\bpell i ossos\b/g, to: 'vestit i cos' },
  { regex: /\bEls Ossos\b/g, to: 'El Cos' },
  { regex: /\bels ossos\b/g, to: 'el cos' },
  { regex: /\bdels ossos\b/g, to: 'del cos' },
  { regex: /\bLa Pell\b/g, to: 'El Vestit' },
  { regex: /\bla Pell\b/g, to: 'el Vestit' },
  { regex: /\bla pell\b/g, to: 'el vestit' },
  { regex: /\bde la Pell\b/g, to: 'del Vestit' },
  { regex: /\bde la pell\b/g, to: 'del vestit' },
  { regex: /\(ossos\)/g, to: '(cos)' },
  { regex: /\(pell\)/g, to: '(vestit)' },
  { regex: /\(Ossos\)/g, to: '(Cos)' },
  { regex: /\(Pell\)/g, to: '(Vestit)' },
  { regex: /--sp-pell-/g, to: '--sp-vestit-' },
  { regex: /\bOssos\b/g, to: 'Cos' },
  { regex: /\bossos\b/g, to: 'cos' },
  { regex: /\bPell\b/g, to: 'Vestit' },
  { regex: /\bpell\b/g, to: 'vestit' }
];

function processFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, 'utf8');
  let newContent = content;
  
  // Specific replacements first, then general ones
  for (const rep of replacements) {
    newContent = newContent.replace(rep.regex, rep.to);
  }
  
  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`Updated: ${filePath}`);
  }
}

function traverse(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      traverse(fullPath);
    } else {
      if (fullPath.endsWith('.md') || fullPath.endsWith('.json') || fullPath.endsWith('.css') || fullPath.endsWith('.js') || fullPath.endsWith('.ts') || fullPath.endsWith('.jsx') || fullPath.endsWith('.tsx')) {
        processFile(fullPath);
      }
    }
  }
}

targetDirs.forEach(traverse);
targetFiles.forEach(processFile);

console.log('Refactor completed.');

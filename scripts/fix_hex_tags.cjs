const fs = require('fs');
const path = require('path');

const WIKI_DIR = path.join(__dirname, '../_wiki_de_poble');

function processFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Regex to tokenize markdown:
  // 1. Frontmatter
  // 2. Fenced code block
  // 3. Inline code
  // 4. HTML tags
  // 5. Hex colors in plain text
  
  const tokenRegex = /(^---\r?\n[\s\S]*?\r?\n---)|(```[\s\S]*?```)|(`[^`]*`)|(<[^>]*>)|(#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b)/g;
  
  const newContent = content.replace(tokenRegex, (match, frontmatter, fenced, inline, html, hex) => {
    if (frontmatter) return frontmatter;
    if (fenced) return fenced;
    if (inline) return inline;
    if (html) return html;
    if (hex) {
      // Hex color in plain text! Enclose in backticks to hide from Obsidian's tag parser
      return `\`${hex}\``;
    }
    return match;
  });
  
  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`[FIXED] ${filePath}`);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.md')) {
      processFile(fullPath);
    }
  }
}

console.log('Amagant colors hex a la Wiki...');
walkDir(WIKI_DIR);
console.log('Procés acabat.');

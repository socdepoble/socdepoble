const fs = require('fs');
const path = require('path');
const YAML = require('yaml');

const WIKI_DIR = path.join(__dirname, '../_wiki_de_poble');
const OFFICIAL_TAGS = new Set([
  'trellat', 'termodinamica', 'crdt_offline', 'accessibilitat', 
  'seguretat', 'auditoria', 'ment_colmena', 'identitat', 'legacy', 'extern'
]);

function processFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Extract frontmatter block using regex: ^---\n(content)\n---
  const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---/;
  const match = content.match(frontmatterRegex);
  
  if (!match) return; // No frontmatter
  
  const frontmatterStr = match[1];
  let parsed;
  try {
    parsed = YAML.parse(frontmatterStr);
  } catch (e) {
    console.warn(`[SKIP] Could not parse YAML in ${filePath}`);
    return;
  }
  
  if (!parsed || !parsed.tags) return;
  
  // Extract existing tags
  let tags = [];
  if (Array.isArray(parsed.tags)) {
    tags = parsed.tags;
  } else if (typeof parsed.tags === 'string') {
    tags = parsed.tags.split(',').map(t => t.trim());
  }
  
  // Filter tags against official ones
  const newTags = tags.filter(tag => OFFICIAL_TAGS.has(tag));
  
  // If no changes and already an inline array, we could skip, but let's just rewrite to enforce the single line format
  const originalTagsBlock = content.substring(content.indexOf('tags:'), content.indexOf('\n', content.indexOf('tags:')) + 1); // rough approximation
  
  // Actually, stringifying the whole parsed object might reorder keys or remove comments. 
  // Let's do a regex replace just on the tags property inside the original string to preserve other YAML keys exactly as they are.
  
  const newTagsStr = newTags.length > 0 ? `tags: [${newTags.join(', ')}]` : `tags: []`;
  
  // Find where tags starts in the frontmatter string
  // It could be 'tags: [a, b]' or 'tags:\n  - a\n  - b'
  // Let's replace the whole tags definition with newTagsStr
  // A tags block starts with 'tags:' at the beginning of a line and ends before the next key (a word at the beginning of a line) or the end of the frontmatter.
  
  const updatedFrontmatterStr = frontmatterStr.replace(/^tags:[\s\S]*?(?=^\w+:$|$)/m, newTagsStr + '\n');
  
  const newContent = content.replace(frontmatterRegex, `---\n${updatedFrontmatterStr.trim()}\n---`);
  
  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`[FIXED] ${filePath} -> [${newTags.join(', ')}]`);
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

console.log('Esporgant etiquetes YAML a _wiki_de_poble...');
walkDir(WIKI_DIR);
console.log('Procés acabat.');

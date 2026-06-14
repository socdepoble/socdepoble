import fs from 'fs';
import path from 'path';

function extractTags(code) {
  const tags = [];
  let depth = 0;
  
  // Very naive regex to find JSX tags, just for demonstration/analysis
  const regex = /<(\/?)([a-zA-Z0-9]+)([^>]*)>/g;
  let match;
  
  while ((match = regex.exec(code)) !== null) {
    const isClosing = match[1] === '/';
    const tag = match[2];
    const attrsStr = match[3];
    
    // Ignore self-closing tags depth changes, but record them
    const isSelfClosing = attrsStr.trim().endsWith('/');
    
    if (isClosing) {
      depth--;
      continue; // skip closing tags in output
    }
    
    // Extract className
    let className = '';
    const classMatch = attrsStr.match(/className=(["'])(.*?)\1/);
    if (classMatch) {
      className = classMatch[2];
    } else {
      // maybe dynamic className={`...`}
      const dynClassMatch = attrsStr.match(/className=\{`([^`]+)`\}/);
      if (dynClassMatch) className = dynClassMatch[1];
    }
    
    tags.push({
      tag,
      depth,
      className: className.trim()
    });
    
    // Self-closing tags like <img /> don't increase depth
    // HTML tags without children like <br> also don't
    const voidTags = ['img', 'br', 'hr', 'input', 'meta', 'link'];
    if (!isSelfClosing && !voidTags.includes(tag.toLowerCase())) {
      depth++;
    }
  }
  
  return tags;
}

const filesToAnalyze = [
  'src/components/MurFeed.jsx',
  'src/pages/community/Towns.jsx',
  'src/pages/community/MasterCalendar.jsx',
  'src/pages/community/Map.jsx'
];

let csvContent = 'File,Tag,Depth,Classes\n';

for (const file of filesToAnalyze) {
  if (!fs.existsSync(file)) continue;
  
  const code = fs.readFileSync(file, 'utf8');
  const tags = extractTags(code);
  
  for (const t of tags) {
    // Escape quotes in classes
    const safeClass = `"${t.className.replace(/"/g, '""')}"`;
    csvContent += `${path.basename(file)},${t.tag},${t.depth},${safeClass}\n`;
  }
}

fs.writeFileSync('dom_analysis.csv', csvContent);
console.log('✅ dom_analysis.csv created successfully with ' + csvContent.split('\n').length + ' rows.');

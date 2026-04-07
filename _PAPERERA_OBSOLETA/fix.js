const fs = require('fs');
let content = fs.readFileSync('src/data.js', 'utf-8');

const regex = /content:\s*["`]\s*#\s+([^\n]+(?:(?!\n\n)[\s\S])*)\n\n(?:##\s+)?([^\n]+(?:(?!\n\n)[\s\S])*)\n\n([\s\S]*?)["`]\s*,/g;

content = content.replace(regex, (match, title, subtitle, paragraph) => {
  const cleanTitle = title.trim();
  const cleanSubtitle = subtitle.trim();
  const cleanParagraph = paragraph.replace(/\\n/g, '\n').replace(/["`']?$/,'').trim();
  
  return `title: "${cleanTitle.replace(/"/g, '\\"')}",\n    post_subtitle: "${cleanSubtitle.replace(/"/g, '\\"')}",\n    content: \`${cleanParagraph}\`,`;
});

fs.writeFileSync('src/data.js', content, 'utf-8');
console.log("Done");

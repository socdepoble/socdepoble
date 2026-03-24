const fs = require('fs');
const content = fs.readFileSync('src/data.js', 'utf-8');

// The regex will look for `content: "# TITLE\n\nSUBTITLE\n\nCONTENT"` block
const result = content.replace(/content:\s*["`]\s*#\s+([^\n]+)\n+(?:##\s+)?([^\n]+)\n+([\s\S]*?)["`]\s*,/g, (match, title, subtitle, paragraph) => {
  // Check if paragraph is just ending because of the string boundary, or actually contains text
  const cleanTitle = title.trim();
  const cleanSubtitle = subtitle.trim();
  const cleanParagraph = paragraph.replace(/\\n/g, '\n').trim();

  // If there's already a title in the object, maybe avoid duplicating, but this regex won't know.
  // We'll just replace the content field with title, subtitle, and content fields.
  return `title: "${cleanTitle}",\n    post_subtitle: "${cleanSubtitle}",\n    content: \`${cleanParagraph}\`,`;
});

fs.writeFileSync('src/data.js', result, 'utf-8');
console.log("Done fixing src/data.js");

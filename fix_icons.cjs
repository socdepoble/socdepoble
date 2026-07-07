const fs = require('fs');
const path = require('path');

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  for (const file of files) {
    const fullPath = path.join(directory, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.html')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      const lucideRegex = /<script>\s*lucide\.createIcons\(\);\s*<\/script>/g;
      
      if (lucideRegex.test(content)) {
        // Remove all instances of the lucide script
        content = content.replace(lucideRegex, '');
        
        // Insert it right before </body>
        content = content.replace('</body>', '  <script>\n    lucide.createIcons();\n  </script>\n</body>');
        
        fs.writeFileSync(fullPath, content);
        console.log('Fixed:', fullPath);
      }
    }
  }
}

processDirectory('./public');

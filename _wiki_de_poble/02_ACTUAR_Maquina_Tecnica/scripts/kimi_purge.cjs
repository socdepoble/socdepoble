const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('.', function(filePath) {
  if (filePath.endsWith('.md') || filePath.endsWith('.jsx') || filePath.endsWith('.js')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let newContent = content
      .replace(/[Ll]a Mas[íi]a/g, 'el Mas')
      .replace(/Mas[íi]a/g, 'Mas')
      .replace(/\b[Tt]he\b /g, '')
      .replace(/ \b[Tt]he\b/g, '');
    if (content !== newContent) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log('Updated: ' + filePath);
    }
  }
});

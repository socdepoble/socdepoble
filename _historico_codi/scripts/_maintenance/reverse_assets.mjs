import fs from 'fs';
import path from 'path';

const REPLACEMENTS = [
  { old: 'assets/esdeveniments', new: 'assets/events' },
  { old: 'assets/pobles', new: 'assets/places' },
  { old: 'assets/mercat', new: 'assets/products' },
  { old: 'assets/personatges', new: 'assets/avatars' },
  { old: 'assets/mur', new: 'assets/Mur' },
  { old: 'assets/identitat', new: 'assets/brand' },
  { old: 'assets/icones', new: 'assets/icons' },
  { old: 'assets/dades-de-prova', new: 'assets/mock-data' },
  { old: 'assets/interficie', new: 'assets/ui' },
  { old: 'assets/documents', new: 'assets/docs' },
  { old: 'assets/llibres', new: 'assets/books' },
  { old: 'assets/infografies', new: 'assets/infographics' }
];

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    if (f === 'node_modules' || f === '.git' || f === 'dist' || f === 'build') return;
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

const targetDirs = ['src', 'supabase', 'public', 'scripts'];
let modifiedCount = 0;

targetDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    walkDir(dir, (filePath) => {
      if (!filePath.match(/\.(js|jsx|ts|tsx|json|sql|css|md|html)$/)) return;
      
      let content = fs.readFileSync(filePath, 'utf8');
      let originalContent = content;
      
      REPLACEMENTS.forEach(r => {
        const regex = new RegExp(`\\b${r.old}\\b`, 'g');
        content = content.replace(regex, r.new);
        
        const regex2 = new RegExp(`/${r.old}\\b`, 'g');
        content = content.replace(regex2, `/${r.new}`);
      });
      
      if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Modified: ${filePath}`);
        modifiedCount++;
      }
    });
  }
});

console.log(`\nFinished reversing asset paths. Modified ${modifiedCount} files.`);

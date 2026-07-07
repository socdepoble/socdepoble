import fs from 'fs';
import path from 'path';

const REPLACEMENTS = [
  { old: 'assets/events', new: 'assets/esdeveniments' },
  { old: 'assets/Esdeveniments', new: 'assets/esdeveniments' },
  { old: 'assets/places', new: 'assets/pobles' },
  { old: 'assets/Pobles', new: 'assets/pobles' },
  { old: 'assets/products', new: 'assets/mercat' },
  { old: 'assets/Mercat', new: 'assets/mercat' },
  { old: 'assets/avatars', new: 'assets/personatges' },
  { old: 'assets/Mur', new: 'assets/mur' },
  { old: 'assets/brand', new: 'assets/identitat' },
  { old: 'assets/identitat', new: 'assets/identitat' }, // keep for safety
  { old: 'assets/icons', new: 'assets/icones' },
  { old: 'assets/mock-data', new: 'assets/dades-de-prova' },
  { old: 'assets/ui', new: 'assets/interficie' },
  { old: 'assets/docs', new: 'assets/documents' },
  { old: 'assets/books', new: 'assets/llibres' },
  { old: 'assets/infographics', new: 'assets/infografies' }
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
        // Regex to match exact path segments, case sensitive, global
        const regex = new RegExp(`\\b${r.old}\\b`, 'g');
        content = content.replace(regex, r.new);
        
        // Also handle cases where it might be without 'assets/' but we only want to replace it if we are sure
        // Actually, just replacing 'assets/...' is very safe. Let's also do exact replacements for standard URL paths
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

console.log(`\nFinished replacing asset paths. Modified ${modifiedCount} files.`);

import fs from 'fs';
import path from 'path';

function walkDir(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walkDir(file));
    } else { 
      results.push(file);
    }
  });
  return results;
}

const targetDir = path.resolve('./src');
const files = walkDir(targetDir);

let changedFiles = 0;

files.forEach(file => {
  if (file.endsWith('.js') || file.endsWith('.jsx') || file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.css')) {
    let content = fs.readFileSync(file, 'utf8');
    if (content.includes('Roboto Condensed') || content.includes('Roboto Serif')) {
      const newContent = content.replace(/Roboto Condensed/g, 'Noto Sans').replace(/Roboto Serif/g, 'Noto Sans');
      fs.writeFileSync(file, newContent, 'utf8');
      changedFiles++;
      console.log(`Substituted in: ${file}`);
    }
  }
});

console.log(`Substituted in ${changedFiles} files successfully.`);

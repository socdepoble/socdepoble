const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const dir = path.join(__dirname, '..', '_wiki_de_poble');

const walkSync = (dir, filelist = []) => {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const dirFile = path.join(dir, file);
    if (fs.statSync(dirFile).isDirectory()) {
      filelist = walkSync(dirFile, filelist);
    } else if (dirFile.endsWith('.md')) {
      filelist.push(dirFile);
    }
  }
  return filelist;
};

const files = walkSync(dir);

let report = [];
for (const f of files) {
  const content = fs.readFileSync(f, 'utf8');
  const parsed = matter(content);
  
  if (parsed.data.description === 'Sense descripció.' || !parsed.data.description) {
    // Es tracta d'un arxiu que necessita descripció
    const excerpt = parsed.content.trim().substring(0, 400).replace(/\n/g, ' ');
    report.push(`FILE: ${f}\nEXCERPT: ${excerpt}\n`);
  }
}

fs.writeFileSync('scripts/files_needing_desc.txt', report.join('\n'));
console.log(`Found ${report.length} files needing description.`);

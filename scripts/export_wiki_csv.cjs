const fs = require('fs');
const path = require('path');

const WIKI = path.join(__dirname, '..', '_wiki_de_poble');
const EXCL = ['node_modules', '.git', 'scripts', 'assets', '_build'];

function camina(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  fs.readdirSync(dir).forEach(n => {
    const p = path.join(dir, n);
    if (EXCL.includes(n)) return;
    if (fs.statSync(p).isDirectory()) camina(p, files);
    else if (n.endsWith('.md')) files.push(p);
  });
  return files;
}

const allFiles = camina(WIKI);
const csvData = [];

// Header
csvData.push(['Path', 'Filename', 'Name', 'Tipus', 'Authority', 'Tags', 'Description', 'Created_At', 'Updated_At'].map(s => `"${s}"`).join(','));

allFiles.forEach(p => {
  const relPath = path.relative(WIKI, p);
  const filename = path.basename(p);
  let content = fs.readFileSync(p, 'utf8');
  let fm = {
    name: '', tipus: '', authority: '', tags: [], description: '', created_at: '', updated_at: ''
  };
  
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (match) {
    const lines = match[1].split('\n');
    let currentKey = null;
    for (const line of lines) {
      if (!line.trim()) continue;
      if (line.startsWith('  -') || line.startsWith('   -')) {
        if (currentKey === 'tags') {
          fm.tags.push(line.replace(/[-\s'"]/g, ''));
        }
      } else {
        const parts = line.split(':');
        if (parts.length > 1) {
          currentKey = parts[0].trim();
          const val = parts.slice(1).join(':').trim();
          if (currentKey !== 'tags') {
            fm[currentKey] = val.replace(/^['"]|['"]$/g, '');
          } else if (val.startsWith('[') && val.endsWith(']')) {
             fm.tags = val.slice(1, -1).split(',').map(x => x.trim().replace(/['"]/g, ''));
          }
        }
      }
    }
  }

  const row = [
    relPath,
    filename,
    fm.name,
    fm.tipus,
    fm.authority,
    fm.tags.join(', '),
    fm.description.replace(/"/g, '""'), // escape quotes for CSV
    fm.created_at,
    fm.updated_at
  ];

  csvData.push(row.map(s => `"${s}"`).join(','));
});

fs.writeFileSync(path.join(__dirname, '..', 'wiki_metadata.csv'), csvData.join('\n'), 'utf8');
console.log('✅ CSV Exported successfully to wiki_metadata.csv');

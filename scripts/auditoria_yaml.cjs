const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

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

const formatTimestamp = (dateObj) => {
  if (!dateObj) return '';
  const d = new Date(dateObj);
  if (isNaN(d.getTime())) return String(dateObj); // fallback
  const yy = String(d.getFullYear()).slice(-2);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${yy}${mm}${dd}_${hh}${min}`;
};

const wikiPath = path.join(__dirname, '..', '_wiki_de_poble');
const allMarkdownFiles = walkSync(wikiPath);

console.log(`Auditing ${allMarkdownFiles.length} markdown files...`);

for (const file of allMarkdownFiles) {
  try {
    const rawContent = fs.readFileSync(file, 'utf8');
    const parsed = matter(rawContent);

    if (!Object.keys(parsed.data).length) continue; // No YAML

    let newData = {};
    const oldData = parsed.data;

    const isActa = file.includes('10_actes') || file.includes('90_arxiu_historic');
    
    // Unified timestamp
    let ts = oldData.timestamp || oldData.hora_creacio || '';
    if (ts && ts.length > 10) ts = formatTimestamp(ts);
    if (!ts) {
      const match = path.basename(file).match(/^(\d{6}_\d{4})/);
      if (match) ts = match[1];
    }
    
    if (isActa) {
      if (ts) newData.timestamp = String(ts);
      if (oldData.tags) newData.tags = oldData.tags;
      if (oldData.aliases) newData.aliases = oldData.aliases;
    } else {
      newData.name = oldData.name || path.basename(file, '.md').toLowerCase().replace(/_/g, '-');
      newData.description = oldData.description || 'Sense descripció.';
      newData.authority = oldData.authority || oldData.authoring_agent || 'IAIA MarIA';
      let v = oldData.version || (oldData.version_semver ? `V${String(oldData.version_semver).split('.')[0]}` : 'V1');
      newData.version = String(v);
      if (ts) newData.timestamp = String(ts);
      if (oldData.tags) newData.tags = oldData.tags;
      if (oldData.aliases) newData.aliases = oldData.aliases;
    }

    const newFileContent = matter.stringify(parsed.content, newData);
    fs.writeFileSync(file, newFileContent, 'utf8');
    
  } catch (err) {
    console.error(`Error processing ${file}:`, err.message);
  }
}
console.log('Auditoria YAML completada!');

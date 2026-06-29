const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, '../knowledge/actes_marmota_historic');
const targetDir = path.join(__dirname, '../_wiki_de_poble/11_actes');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  
  for (const file of files) {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (stat.isFile() && file.endsWith('.md')) {
      let newName = file;
      
      // Determine subtype from folder or filename
      let type = 'ACTA';
      if (fullPath.includes('actes_sessio') || file.toLowerCase().includes('sessio')) {
        type = 'ACTA_SESSIO';
      } else if (fullPath.includes('actes_marmota') || file.toLowerCase().includes('marmota')) {
        type = 'ACTA_MARMOTA';
      }

      // Extract and clean date (convert YYYY to YY, remove hyphens)
      const dateMatch = file.match(/^(20)?(\d{2})[-_]?(\d{2})[-_]?(\d{2})_(\d{4})/);
      let datePrefix = '';
      let restOfName = file;
      
      if (dateMatch) {
        // e.g. "20260622_0112" or "26-06-15_0328"
        datePrefix = `${dateMatch[2]}${dateMatch[3]}${dateMatch[4]}_${dateMatch[5]}`;
        restOfName = file.substring(dateMatch[0].length);
      } else {
        // Fallback: Use file creation/modification date
        const mTime = stat.mtime;
        const yy = String(mTime.getFullYear()).slice(-2);
        const mm = String(mTime.getMonth() + 1).padStart(2, '0');
        const dd = String(mTime.getDate()).padStart(2, '0');
        const hh = String(mTime.getHours()).padStart(2, '0');
        const min = String(mTime.getMinutes()).padStart(2, '0');
        datePrefix = `${yy}${mm}${dd}_${hh}${min}`;
      }

      // Clean up the rest of the name
      restOfName = restOfName
        .replace(/^[_\-\s]+/, '') // Remove leading underscores/dashes
        .replace(/acta_marmota/i, '')
        .replace(/acta_sessio/i, '')
        .replace(/acta/i, '')
        .replace(/^[_\-\s]+/, '')
        .trim();

      if (restOfName === '.md' || restOfName === '') {
        restOfName = 'genetica_base.md';
      }

      newName = `${datePrefix}_${type}_${restOfName}`;
      // Clean up multiple underscores
      newName = newName.replace(/__+/g, '_');
      
      const targetPath = path.join(targetDir, newName);
      
      console.log(`Copying: ${file} -> ${newName}`);
      fs.copyFileSync(fullPath, targetPath);
    }
  }
}

processDirectory(sourceDir);
console.log('Migration complete. Please verify the 11_actes folder.');

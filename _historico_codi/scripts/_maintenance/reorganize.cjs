const fs = require('fs');
const path = require('path');

const publicAssetsDir = path.join(__dirname, 'public', 'assets');
const srcDir = path.join(__dirname, 'src');

const newDirs = [
  'system/pages',
  'system/brand',
  'system/ui',
  'system/pobles',
  'uploads/users/avatars',
  'uploads/users/posts',
  'uploads/groups/avatars',
  'uploads/groups/posts',
  'uploads/companies/avatars',
  'uploads/companies/posts',
  'uploads/companies/mercat',
  'uploads/towns/avatars',
  'uploads/towns/posts',
  'uploads/others'
];

newDirs.forEach(dir => {
  fs.mkdirSync(path.join(publicAssetsDir, dir), { recursive: true });
});

let allFiles = [];

const walkSync = (dir, callback) => {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filepath = path.join(dir, file);
    const stat = fs.statSync(filepath);
    if (stat.isDirectory()) {
      if (!newDirs.some(nd => filepath.endsWith(nd))) { // avoid walking into our newly created dirs if possible
          walkSync(filepath, callback);
      }
    } else {
      callback(filepath, file);
    }
  });
};

const fileMap = [];

// Discover files from legacy locations
['avatars', '_legacy_brand', 'content', 'ui'].forEach(folder => {
   walkSync(path.join(publicAssetsDir, folder), (filepath, filename) => {
       if (filename.endsWith('.png') || filename.endsWith('.jpg') || filename.endsWith('.svg') || filename.endsWith('.webp') || filename.endsWith('.jpeg')) {
           // Decide new destination
           let destDir = 'uploads/others';
           if (folder === 'avatars') destDir = 'uploads/users/avatars';
           else if (folder === 'ui') destDir = 'system/ui';
           else if (folder === '_legacy_brand') {
               if (filename.includes('logo') || filename.includes('brand')) destDir = 'system/brand';
               else destDir = 'uploads/users/posts';
           }
           else if (folder === 'content') {
               if (filepath.includes('mercat')) destDir = 'uploads/companies/mercat';
               else destDir = 'uploads/users/posts';
           }

           const newPath = path.join(publicAssetsDir, destDir, filename);
           fileMap.push({
               originalName: filename,
               originalPath: filepath,
               newPath: newPath,
               newUrl: `/assets/${destDir}/${filename}`
           });
       }
   });
});

// Move files
fileMap.forEach(f => {
    if (f.originalPath !== f.newPath && fs.existsSync(f.originalPath)) {
        fs.renameSync(f.originalPath, f.newPath);
    }
});

// Fix data.js and mockLoreData.js
const fuzzyFindBestUrl = (originalUrl) => {
    const originalName = path.basename(originalUrl);
    
    // Exact match
    const exact = fileMap.find(f => f.originalName === originalName);
    if (exact) return exact.newUrl;

    // Fuzzy match (strip hash like _669d36)
    const stripped = originalName.replace(/_[0-9a-f]+(\.[a-z]+)$/i, '$1').replace(/_[0-9]+(\.[a-z]+)$/i, '$1');
    const fuzzy = fileMap.find(f => f.originalName === stripped);
    if (fuzzy) return fuzzy.newUrl;

    // Very fuzzy (just match a keyword)
    if (originalName.includes('andreu')) return fileMap.find(f => f.originalName.includes('andreu'))?.newUrl;
    if (originalName.includes('beatriz')) return fileMap.find(f => f.originalName.includes('beatriz'))?.newUrl;
    if (originalName.includes('pepica')) return fileMap.find(f => f.originalName.includes('pepica'))?.newUrl;
    if (originalName.includes('nano')) return fileMap.find(f => f.originalName.includes('nano') && f.newPath.includes('posts'))?.newUrl;

    // Default fallback
    return '/assets/system/brand/logo.png'; // safe fallback
};

const fixFile = (filePath) => {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  content = content.replace(/"\/assets\/[^"]+"/g, (match) => {
    const originalUrl = match.replace(/"/g, '');
    const newUrl = fuzzyFindBestUrl(originalUrl);
    return newUrl ? `"${newUrl}"` : match;
  });

  fs.writeFileSync(filePath, content);
  console.log(`Updated ${filePath}`);
};

fixFile(path.join(srcDir, 'data.js'));
fixFile(path.join(srcDir, 'data', 'mockLoreData.js'));

console.log("Reorganization complete.");

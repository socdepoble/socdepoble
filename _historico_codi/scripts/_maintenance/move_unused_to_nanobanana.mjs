import fs from 'fs';
import path from 'path';

const nanobananaDir = path.join('public', 'assets', 'nanobanana');

if (!fs.existsSync(nanobananaDir)) {
  fs.mkdirSync(nanobananaDir, { recursive: true });
}

// Folders to completely clear out and move contents to nanobanana
const foldersToEmpty = [
  'public/images/assets',
  'public/images/demo',
  'public/imatges/auditories',
  'public/assets/images',
  'public/assets/places',
  'public/assets/covers',
  'public/assets/books',
  'public/assets/master',
  'public/assets/banners',
  'public/assets/simulators',
  'public/assets/ai_generated',
  'public/assets/infographics'
];

function moveFilesToNanobanana(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      moveFilesToNanobanana(fullPath);
      // Try to remove empty dir
      try { fs.rmdirSync(fullPath); } catch(e) {}
    } else {
      // It's a file, move it to nanobanana
      const destPath = path.join(nanobananaDir, file);
      // Avoid overwriting if a file with the same name exists
      let finalDestPath = destPath;
      let counter = 1;
      while (fs.existsSync(finalDestPath)) {
        const ext = path.extname(file);
        const name = path.basename(file, ext);
        finalDestPath = path.join(nanobananaDir, `${name}_${counter}${ext}`);
        counter++;
      }
      fs.renameSync(fullPath, finalDestPath);
      console.log(`Moved ${fullPath} -> ${finalDestPath}`);
    }
  }
  // Try to remove the original directory now that it's empty
  try { fs.rmdirSync(dir); } catch(e) {}
}

for (const dir of foldersToEmpty) {
  moveFilesToNanobanana(dir);
}

// Check root of public/assets for loose images
const assetsRoot = 'public/assets';
if (fs.existsSync(assetsRoot)) {
  const files = fs.readdirSync(assetsRoot);
  for (const file of files) {
    const fullPath = path.join(assetsRoot, file);
    if (!fs.statSync(fullPath).isDirectory()) {
      if (file.match(/\.(png|jpe?g|gif|svg|webp)$/i)) {
         const destPath = path.join(nanobananaDir, file);
         fs.renameSync(fullPath, destPath);
         console.log(`Moved loose file ${fullPath} -> ${destPath}`);
      }
    }
  }
}


const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const REGISTRY_PATH = path.join(__dirname, '../../../public/assets/media_registry.json');
const UPLOADS_DIR = path.join(__dirname, '../../../public/assets/uploads');

function scanDirectory(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      scanDirectory(filePath, fileList);
    } else {
      if (file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.svg') || file.endsWith('.webp')) {
        fileList.push(filePath);
      }
    }
  }
  return fileList;
}

async function syncRegistry() {
  console.log('Reading media_registry.json...');
  if (!fs.existsSync(REGISTRY_PATH)) {
    console.error('Registry not found!');
    return;
  }

  const registryData = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf-8'));
  const allUploadFiles = scanDirectory(UPLOADS_DIR);
  let updatedCount = 0;
  let addedCount = 0;

  // Create a map for quick lookup of existing registry items by filename
  const existingFilesMap = {};
  registryData.media.forEach(item => {
    existingFilesMap[item.filename] = item;
  });

  allUploadFiles.forEach(absolutePath => {
    const filename = path.basename(absolutePath);
    const relativePath = absolutePath.split('/uploads/')[1];
    const newPath = `/assets/uploads/${relativePath}`;
    
    // The folder should be everything before the filename
    const folderParts = relativePath.split('/');
    folderParts.pop(); // remove filename
    const folder = folderParts.join('/'); 

    if (existingFilesMap[filename]) {
      // Update existing item
      const item = existingFilesMap[filename];
      if (item.path !== newPath) {
        console.log(`Updating path: ${item.filename} -> ${newPath}`);
        item.path = newPath;
        item.folder = folder;
        updatedCount++;
      }
    } else {
      // Add new file to registry
      console.log(`Adding new file: ${filename} -> ${newPath}`);
      const newItem = {
        id: crypto.randomBytes(6).toString('hex'),
        path: newPath,
        filename: filename,
        folder: folder,
        type: "image",
        tags: [folder]
      };
      registryData.media.push(newItem);
      addedCount++;
    }
  });

  fs.writeFileSync(REGISTRY_PATH, JSON.stringify(registryData, null, 2), 'utf-8');
  console.log(`Registry sync complete. Updated ${updatedCount} paths. Added ${addedCount} new files.`);
}

syncRegistry().catch(console.error);

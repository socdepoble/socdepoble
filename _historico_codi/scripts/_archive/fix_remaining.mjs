import fs from 'fs';
import path from 'path';

let dataJs = fs.readFileSync('src/shared/data.js', 'utf8');

function updatePathInDataJs(oldPath, newPath) {
  const safeOldPath = oldPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`['"]${safeOldPath}['"]`, 'g');
  dataJs = dataJs.replace(regex, `"${newPath}"`);
}

updatePathInDataJs('/assets/mel.png', '/assets/Mercat/2026-04-01_1200_PRODUCTE_mel_de_muntanya_la_torre/mel.png');
updatePathInDataJs('/assets/images/camiseta_dinner.jpg', '/assets/nanobanana/camiseta_dinner.jpg');
updatePathInDataJs('/assets/brain/generations/nano_penaguila.png', '/assets/nanobanana/nano_penaguila.png');
updatePathInDataJs('/assets/brain/generations/nano_orxeta.png', '/assets/nanobanana/nano_orxeta.png');

fs.writeFileSync('src/shared/data.js', dataJs);
console.log("Fixed remaining loose paths");


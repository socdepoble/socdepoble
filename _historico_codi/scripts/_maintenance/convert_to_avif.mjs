import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import chalk from 'chalk';

const PUBLIC_DIR = path.resolve('./public/assets/uploads');

// Comprovem si tenim sharp instal·lat, si no, intentem usar npx sharp-cli
function convertToAvif(filePath) {
  const ext = path.extname(filePath);
  if (!['.png', '.jpg', '.jpeg'].includes(ext.toLowerCase())) return;
  
  const newPath = filePath.replace(new RegExp(`${ext}$`, 'i'), '.avif');
  
  try {
    console.log(chalk.blue(`Convertint ${path.basename(filePath)} a AVIF...`));
    // Utilitzem npx per invocar sharp-cli de forma transparent
    execSync(`npx --yes sharp-cli@latest -i "${filePath}" -o "${newPath}" format avif`, { stdio: 'pipe' });
    
    // Obtenim mides per comparar
    const oldSize = fs.statSync(filePath).size;
    const newSize = fs.statSync(newPath).size;
    const estalvi = ((oldSize - newSize) / oldSize * 100).toFixed(1);
    
    console.log(chalk.green(`✓ AVIF creat: estalvi del ${estalvi}% (${(oldSize/1024).toFixed(1)}KB -> ${(newSize/1024).toFixed(1)}KB)`));
  } catch (err) {
    console.log(chalk.red(`✗ Error convertint ${filePath}: ${err.message}`));
  }
}

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else {
      convertToAvif(fullPath);
    }
  }
}

console.log(chalk.yellow('=================================================='));
console.log(chalk.yellow('🚜 EL TRACTOR: Iniciant conversió massiva a AVIF'));
console.log(chalk.yellow('=================================================='));

if (fs.existsSync(PUBLIC_DIR)) {
  processDirectory(PUBLIC_DIR);
} else {
  console.log(chalk.red('✗ No s\'ha trobat el directori public/assets/uploads'));
}

console.log(chalk.yellow('=================================================='));
console.log(chalk.yellow('🏁 Conversió finalitzada.'));
console.log(chalk.yellow('=================================================='));

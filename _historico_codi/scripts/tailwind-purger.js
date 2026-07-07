/**
 * tailwind-purger.js
 * Script per a detectar i eliminar classes Tailwind prohibides en fitxers React.
 * 
 * Ús:
 *   node tailwind-purger.js                      # Escanejar i mostrar alertes
 *   node tailwind-purger.js --dir=./src         # Escanejar un directori específic
 *   node tailwind-purger.js --fix               # Mode de neteja (elimina les classes prohibides)
 *   node tailwind-purger.js --extensions=.jsx,.js # Escanejar amb altres extensions
 */

const fs = require('fs');
const path = require('path');

// Configuració per defecte
const DEFAULT_CONFIG = {
  dir: path.join(__dirname, 'src', 'components'), // Ajustat per al projecte
  extensions: ['.jsx', '.js', '.tsx'],
  forbiddenClasses: [
    /bg-[a-zA-Z0-9-]+/g,
    /rounded-[a-zA-Z0-9-]+/g,
    /text-[a-zA-Z0-9-]+/g,
    /p-[0-9]+/g,
    /m-[0-9]+/g,
    /shadow-[a-zA-Z0-9-]+/g,
    /w-[0-9]+/g,
    /h-[0-9]+/g,
    /gap-[0-9]+/g
  ],
  fix: false
};

// Parsejar arguments de línia de comandes
function parseArgs() {
  const args = process.argv.slice(2);
  const config = { ...DEFAULT_CONFIG };

  args.forEach(arg => {
    if (arg.startsWith('--dir=')) {
      config.dir = arg.split('=')[1];
    } else if (arg.startsWith('--extensions=')) {
      config.extensions = arg.split('=')[1].split(',');
    } else if (arg === '--fix') {
      config.fix = true;
    }
  });

  return config;
}

// Escanejar fitxers recursivament
function scanFiles(dir, extensions, fileList = []) {
  if (!fs.existsSync(dir)) {
    throw new Error(`❌ Directori no trobat: ${dir}`);
  }

  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      scanFiles(fullPath, extensions, fileList);
    } else if (extensions.some(ext => file.endsWith(ext))) {
      fileList.push(fullPath);
    }
  });
  return fileList;
}

// Netejar una línia de classes prohibides
function cleanLine(line, forbiddenClasses) {
  let cleanedLine = line;
  forbiddenClasses.forEach(regex => {
    cleanedLine = cleanedLine.replace(regex, '');
  });
  // Eliminar espais múltiples
  cleanedLine = cleanedLine.replace(/\s+/g, ' ').trim();
  // Eliminar 'class=""' buit
  cleanedLine = cleanedLine.replace(/className=\s*"\s*"/g, '');
  // Eliminar espais sobrants després de la neteja
  cleanedLine = cleanedLine.replace(/\s+className="/g, ' className="');
  return cleanedLine;
}

// Analitzar i netejar un fitxer
function analyzeAndCleanFile(filePath, forbiddenClasses, fix = false) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const violations = [];
  let newContent = content;

  lines.forEach((line, index) => {
    forbiddenClasses.forEach(regex => {
      const match = line.match(regex);
      if (match) {
        violations.push({
          file: filePath,
          line: index + 1,
          class: match[0],
          code: line.trim()
        });
        if (fix) {
          const cleanedLine = cleanLine(line, forbiddenClasses);
          newContent = newContent.replace(line, cleanedLine);
        }
      }
    });
  });

  if (fix && violations.length > 0) {
    fs.writeFileSync(filePath, newContent, 'utf8');
  }

  return violations;
}

// Funció principal
function main() {
  const config = parseArgs();

  try {
    console.log(`🔍 Escanejant ${config.dir}...`);
    const files = scanFiles(config.dir, config.extensions);
    let allViolations = [];

    files.forEach(file => {
      const violations = analyzeAndCleanFile(file, config.forbiddenClasses, config.fix);
      allViolations = [...allViolations, ...violations];
    });

    if (allViolations.length > 0) {
      console.error('❌ ALERTA: S\'han trobat classes Tailwind prohibides!');
      console.error('--------------------------------------------------');
      allViolations.forEach(violation => {
        console.error(`📄 Fitxer: ${violation.file}`);
        console.error(`🔢 Línia: ${violation.line}`);
        console.error(`🏷️ Classe: ${violation.class}`);
        console.error(`💻 Codi: ${violation.code}`);
        console.error('---');
      });

      if (config.fix) {
        console.log('✅ Classes prohibides eliminades automàticament.');
      }

      process.exit(1);
    } else {
      console.log('✅ No s\'han trobat classes Tailwind prohibides. Tot net!');
      process.exit(0);
    }
  } catch (error) {
    console.error('❌ Error en executar el purgador:', error.message);
    process.exit(1);
  }
}

main();

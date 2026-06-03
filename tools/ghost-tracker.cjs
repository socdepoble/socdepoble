// tools/ghost-tracker.js
// Rastrejador de Fantasmes - Immunologia Estàtica via AST

const fs = require('fs');
const path = require('path');
const { Project } = require('ts-morph');

function runGhostTracker() {
  console.log("🛡️ Iniciant Rastrejador de Fantasmes (AST Scanner)...");

  const project = new Project({
    tsConfigFilePath: path.join(process.cwd(), 'tsconfig.json'),
    skipAddingFilesFromTsConfig: false,
  });

  const sourceFiles = project.getSourceFiles();
  let ghostFiles = [];

  for (const sourceFile of sourceFiles) {
    // Ignorem tests i el mateix script
    if (sourceFile.getFilePath().includes('.test.') || sourceFile.getFilePath().includes('tools/')) {
      continue;
    }

    // Busquem si hi ha algun import d'aquesta línia (simplificació per l'exemple)
    // En producció ací faríem un Reachability Graph des dels entry points (index.ts, app.ts)
    const isReferenced = sourceFile.getReferencingSourceFiles().length > 0;
    
    // Per als entry points
    const isEntryPoint = sourceFile.getFilePath().endsWith('index.ts') || sourceFile.getFilePath().endsWith('main.ts');

    if (!isReferenced && !isEntryPoint) {
      ghostFiles.push(sourceFile.getFilePath());
    }
  }

  const reportPath = path.join(process.cwd(), 'reports', 'ghost-report.json');
  if (!fs.existsSync(path.dirname(reportPath))) {
    fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  }

  const report = {
    timestamp: new Date().toISOString(),
    ghostFilesDetected: ghostFiles.length,
    ghostFiles: ghostFiles
  };

  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  if (ghostFiles.length > 0) {
    console.warn(\`[ALERTA TÀCTICA] S'han detectat \${ghostFiles.length} fitxers fantasma sense referències.\`);
    console.log("Report guardat a:", reportPath);
  } else {
    console.log("✅ Cap fantasma detectat. Salut de l'AST òptima.");
  }
}

if (require.main === module) {
  runGhostTracker();
}

module.exports = { runGhostTracker };

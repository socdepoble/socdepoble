import fs from 'fs/promises';
import path from 'path';
import { parse } from '@babel/parser';
import _traverse from '@babel/traverse';
const traverse = _traverse.default || _traverse;

const SRC_DIR = './src';
const OUTPUT_FILE = './artifacts/div_audit_report.csv';

// Funció recursiva per trobar tots els arxius JSX
async function findJsxFiles(dir) {
  const files = await fs.readdir(dir, { withFileTypes: true });
  let jsxFiles = [];
  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    if (file.isDirectory()) {
      jsxFiles = jsxFiles.concat(await findJsxFiles(fullPath));
    } else if (file.isFile() && fullPath.endsWith('.jsx')) {
      jsxFiles.push(fullPath);
    }
  }
  return jsxFiles;
}

function analyzeDiv(pathObj, filePath) {
  const node = pathObj.node;
  const line = node.loc ? node.loc.start.line : 0;
  let classes = '';
  let id = '';

  // Extraure atributs (className i id)
  if (node.openingElement.attributes) {
    for (const attr of node.openingElement.attributes) {
      if (attr.type === 'JSXAttribute') {
        if (attr.name.name === 'className') {
          if (attr.value && attr.value.type === 'StringLiteral') {
            classes = attr.value.value;
          } else if (attr.value && attr.value.type === 'JSXExpressionContainer') {
            classes = '[Expressió Dinàmica]';
          }
        }
        if (attr.name.name === 'id') {
          if (attr.value && attr.value.type === 'StringLiteral') {
            id = attr.value.value;
          }
        }
      }
    }
  }

  // Comptar els fills (ignorarem els espais en blanc)
  const childrenCount = node.children.filter(c => 
    c.type === 'JSXElement' || 
    (c.type === 'JSXText' && c.value.trim() !== '') ||
    c.type === 'JSXExpressionContainer'
  ).length;

  let suspicion = [];
  if (childrenCount === 0) suspicion.push('DIV Buit (Sense contingut)');
  if (childrenCount === 1 && !classes && !id) suspicion.push('Wrapper Innecessari (1 fill, sense classes)');
  if (!classes && !id && childrenCount > 1) suspicion.push('Contenidor simple sense classes/id');

  const componentName = path.basename(filePath);

  return {
    component: componentName,
    filePath,
    line,
    id,
    classes: classes.replace(/\n/g, ' ').replace(/,/g, ';'), // Sanitaritzar per a CSV
    childrenCount,
    suspicion: suspicion.join(' | ')
  };
}

async function main() {
  console.log('Iniciant auditoria estructural de divs...');
  const jsxFiles = await findJsxFiles(SRC_DIR);
  console.log(`Trobats ${jsxFiles.length} arxius .jsx al directori src/`);

  const results = [];

  for (const file of jsxFiles) {
    try {
      const code = await fs.readFile(file, 'utf-8');
      const ast = parse(code, {
        sourceType: 'module',
        plugins: ['jsx', 'nullishCoalescingOperator', 'optionalChaining', 'classProperties', 'typescript'] // Incloent plugins que puguen fer falta
      });

      traverse(ast, {
        JSXElement(pathObj) {
          if (pathObj.node.openingElement.name.type === 'JSXIdentifier' && pathObj.node.openingElement.name.name === 'div') {
            const divData = analyzeDiv(pathObj, file);
            results.push(divData);
          }
        }
      });
    } catch (e) {
      console.warn(`[!] Error analitzant AST a l'arxiu ${file}:`, e.message);
    }
  }

  // Generar CSV
  await fs.mkdir(path.dirname(OUTPUT_FILE), { recursive: true });
  
  const csvHeaders = ['Component', 'Arxiu', 'Linia', 'ID', 'Classes CSS', 'Num Fills', 'Nivell de Sospita (Basura?)'];
  const csvRows = results.map(r => 
    `${r.component},${r.filePath},${r.line},${r.id},${r.classes},${r.childrenCount},${r.suspicion}`
  );

  const csvContent = [csvHeaders.join(','), ...csvRows].join('\n');
  await fs.writeFile(OUTPUT_FILE, csvContent, 'utf-8');

  console.log(`\nAuditoria completada. ${results.length} divs analitzats en total.`);
  console.log(`Informe guardat a: ${OUTPUT_FILE}`);
  
  // Resum ràpid de sospitosos
  const emptyDivs = results.filter(r => r.suspicion.includes('DIV Buit')).length;
  const wrapperDivs = results.filter(r => r.suspicion.includes('Wrapper Innecessari')).length;
  console.log(`\n--- RESUM DE SOSPITES ---`);
  console.log(`Divs buits absoluts: ${emptyDivs}`);
  console.log(`Wrappers innecessaris: ${wrapperDivs}`);
}

main().catch(console.error);

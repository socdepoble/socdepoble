import fs from 'fs/promises';
import path from 'path';
import { parse } from '@babel/parser';
import _traverse from '@babel/traverse';
const traverse = _traverse.default || _traverse;

const SRC_DIR = './src';
const OUTPUT_FILE = './artifacts/div_audit_report_v2.csv';

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

  // Anàlisi profunda dels fills
  let numComponents = 0;
  let numHtmlElements = 0;
  let numTextNodes = 0;
  let numExpressions = 0;
  let containsSvgOrImg = false;
  let firstChildName = '';

  node.children.forEach(c => {
    if (c.type === 'JSXElement') {
      const elName = c.openingElement.name.name;
      if (!elName) return; // Podria ser un MemberExpression
      
      if (elName === 'svg' || elName === 'img' || elName.includes('Icon')) containsSvgOrImg = true;
      
      // Components comencen per majúscula
      if (/^[A-Z]/.test(elName)) {
        numComponents++;
      } else {
        numHtmlElements++;
      }
      
      if (!firstChildName) firstChildName = elName;
    } else if (c.type === 'JSXText' && c.value.trim() !== '') {
      numTextNodes++;
      if (!firstChildName) firstChildName = 'Text';
    } else if (c.type === 'JSXExpressionContainer') {
      numExpressions++;
      if (!firstChildName) firstChildName = 'Expression';
    }
  });

  const totalChildren = numComponents + numHtmlElements + numTextNodes + numExpressions;

  // Classificació intel·ligent de Patrons per a facilitar el filtrat a gran escala
  let patro = 'Contenidor Mixt';
  
  if (totalChildren === 0) {
    patro = 'BUIT (Possible Basura)';
  } else if (totalChildren === 1) {
    if (containsSvgOrImg) patro = `Contenidor d'Icona (<${firstChildName}>)`;
    else if (numComponents === 1) patro = `Wrapper de Component (<${firstChildName}>)`;
    else if (numHtmlElements === 1) patro = `Wrapper HTML (<${firstChildName}>)`;
    else if (numTextNodes === 1) patro = 'Contenidor de Text Pura';
    else if (numExpressions === 1) patro = 'Wrapper d\'Expressió {}';
  } else if (containsSvgOrImg) {
    patro = 'Contenidor d\'Icones Múltiples/Mixt';
  }

  let suspicios = 'No';
  if (totalChildren === 0 && !classes) suspicios = 'SÍ: Buit i sense classes';
  if (totalChildren === 1 && !classes && !id) suspicios = 'SÍ: Wrapper inútil sense estils';

  return {
    component: path.basename(filePath),
    filePath,
    line,
    id,
    classes: classes.replace(/\n/g, ' ').replace(/,/g, ';'),
    totalChildren,
    patro,
    suspicios
  };
}

async function main() {
  console.log('Iniciant auditoria avançada per patrons estructurals...');
  const jsxFiles = await findJsxFiles(SRC_DIR);
  
  const results = [];

  for (const file of jsxFiles) {
    try {
      const code = await fs.readFile(file, 'utf-8');
      const ast = parse(code, {
        sourceType: 'module',
        plugins: ['jsx', 'nullishCoalescingOperator', 'optionalChaining', 'classProperties', 'typescript']
      });

      traverse(ast, {
        JSXElement(pathObj) {
          if (pathObj.node.openingElement.name.type === 'JSXIdentifier' && pathObj.node.openingElement.name.name === 'div') {
            results.push(analyzeDiv(pathObj, file));
          }
        }
      });
    } catch (e) {
      // Silenciat per evitar soroll innecessari durant el mapeig massiu
    }
  }

  await fs.mkdir(path.dirname(OUTPUT_FILE), { recursive: true });
  
  // Formatem la taula per a que siga molt fàcil d'ordenar i llegir
  const csvHeaders = ['Component', 'Arxiu', 'Linia', 'Patró Estructural', 'Sospitós?', 'Num Fills', 'Classes CSS'];
  const csvRows = results.map(r => 
    `${r.component},${r.filePath},${r.line},${r.patro},${r.suspicios},${r.totalChildren},${r.classes}`
  );

  const csvContent = [csvHeaders.join(','), ...csvRows].join('\n');
  await fs.writeFile(OUTPUT_FILE, csvContent, 'utf-8');

  console.log(`Auditoria avançada completada. ${results.length} divs analitzats i mapejats.`);
  
  // Agrupar per patrons per veure la radiografia general del codi
  const patronCounts = {};
  results.forEach(r => {
    patronCounts[r.patro] = (patronCounts[r.patro] || 0) + 1;
  });

  console.log('\n--- DISTRIBUCIÓ DE PATRONS (Radiografia del Sistema) ---');
  Object.entries(patronCounts)
    .sort((a, b) => b[1] - a[1])
    .forEach(([patro, count]) => console.log(`${count.toString().padStart(4)} : ${patro}`));
    
  console.log(`\nInforme detallat guardat a: ${OUTPUT_FILE}`);
}

main().catch(console.error);

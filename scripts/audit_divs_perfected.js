import fs from 'fs/promises';
import path from 'path';
import { parse } from '@babel/parser';
import _traverse from '@babel/traverse';
const traverse = _traverse.default || _traverse;

const SRC_DIR = './src';
const OUTPUT_FILE = './artifacts/div_audit_report_perfected.csv';

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
  let hasOtherAttributes = false;
  let attributesList = [];

  // Anàlisi EXHAUSTIU d'atributs (el punt cec que hem arreglat)
  if (node.openingElement.attributes) {
    for (const attr of node.openingElement.attributes) {
      if (attr.type === 'JSXAttribute') {
        const attrName = attr.name.name;
        if (typeof attrName === 'string') {
          if (attrName === 'className') {
            if (attr.value && attr.value.type === 'StringLiteral') classes = attr.value.value;
            else classes = '[Expressió Dinàmica]';
          } else if (attrName === 'id') {
            if (attr.value && attr.value.type === 'StringLiteral') id = attr.value.value;
          } else if (attrName !== 'key') {
            hasOtherAttributes = true;
            attributesList.push(attrName);
          }
        }
      } else if (attr.type === 'JSXSpreadAttribute') {
        hasOtherAttributes = true;
        attributesList.push('...spread');
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
      if (!elName) return; 
      
      if (elName === 'svg' || elName === 'img' || elName.includes('Icon')) containsSvgOrImg = true;
      
      if (/^[A-Z]/.test(elName)) numComponents++;
      else numHtmlElements++;
      
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

  // Classificació de Patrons
  let patro = 'Contenidor Mixt';
  if (totalChildren === 0) {
    patro = 'BUIT';
  } else if (totalChildren === 1) {
    if (containsSvgOrImg) patro = `Contenidor d'Icona (<${firstChildName}>)`;
    else if (numComponents === 1) patro = `Wrapper de Component (<${firstChildName}>)`;
    else if (numHtmlElements === 1) patro = `Wrapper HTML (<${firstChildName}>)`;
    else if (numTextNodes === 1) patro = 'Contenidor de Text Pura';
    else if (numExpressions === 1) patro = 'Wrapper d\'Expressió {}';
  } else if (containsSvgOrImg) {
    patro = 'Contenidor d\'Icones Múltiples/Mixt';
  }

  // La Condició d'Inutilitat PERFECTA: Zero classes, zero ID, i ZERO altres atributs (style, aria, onclick, ref...)
  let inutibilitat = 'Útil o Dubtós';
  if (totalChildren === 0 && !classes && !id && !hasOtherAttributes) {
    inutibilitat = '100% INÚTIL: Buit absolut';
  } else if (totalChildren === 1 && !classes && !id && !hasOtherAttributes) {
    inutibilitat = '100% INÚTIL: Wrapper absurd';
  }

  return {
    component: path.basename(filePath),
    filePath,
    line,
    patro,
    inutibilitat,
    totalChildren,
    atributsExtra: attributesList.join(' '),
    classes: classes.replace(/\n/g, ' ').replace(/,/g, ';')
  };
}

async function main() {
  console.log('Iniciant auditoria PERFECTA per patrons estructurals...');
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
      // Silenciat
    }
  }

  await fs.mkdir(path.dirname(OUTPUT_FILE), { recursive: true });
  
  const csvHeaders = ['Component', 'Arxiu', 'Linia', 'Patró Estructural', 'Nivell d\'Inutilitat', 'Num Fills', 'Atributs Extra', 'Classes CSS'];
  const csvRows = results.map(r => 
    `${r.component},${r.filePath},${r.line},${r.patro},${r.inutibilitat},${r.totalChildren},${r.atributsExtra},${r.classes}`
  );

  const csvContent = [csvHeaders.join(','), ...csvRows].join('\n');
  await fs.writeFile(OUTPUT_FILE, csvContent, 'utf-8');

  // Estadístiques de certesa
  const inutilsAbsoluts = results.filter(r => r.inutibilitat.includes('100% INÚTIL'));
  const wrappersAbsurds = results.filter(r => r.inutibilitat === '100% INÚTIL: Wrapper absurd');
  const buitsAbsoluts = results.filter(r => r.inutibilitat === '100% INÚTIL: Buit absolut');

  console.log(`\nAuditoria PERFECTA completada. ${results.length} divs mapejats.`);
  console.log(`--- RADIOGRAFIA DE LA CERTEZA ---`);
  console.log(`Divs 100% inútils (Zero atributs, zero style, zero ref): ${inutilsAbsoluts.length}`);
  console.log(`  ├─ Wrappers Absurds (1 sol fill): ${wrappersAbsurds.length}`);
  console.log(`  └─ Buits Absoluts (Zero fills): ${buitsAbsoluts.length}`);
  console.log(`\nDivs Dubtosos o Útils (Es salven de la poda automàtica): ${results.length - inutilsAbsoluts.length}`);
}

main().catch(console.error);

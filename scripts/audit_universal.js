import fs from 'fs/promises';
import path from 'path';
import { parse } from '@babel/parser';
import _traverse from '@babel/traverse';
const traverse = _traverse.default || _traverse;

const SRC_DIR = './src';
const OUTPUT_FILE = './artifacts/universal_audit_report.csv';

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

function analyzeElement(pathObj, filePath) {
  const node = pathObj.node;
  const line = node.loc ? node.loc.start.line : 0;
  
  if (node.openingElement.name.type !== 'JSXIdentifier') return null;
  const tagName = node.openingElement.name.name;
  
  let classes = '';
  let id = '';
  let hasStyle = false;
  let hasOnClick = false;
  let hasRole = false;
  let hasTabIndex = false;
  let hasAlt = false;
  let hasDangerouslySet = false;
  let attributesList = [];

  if (node.openingElement.attributes) {
    for (const attr of node.openingElement.attributes) {
      if (attr.type === 'JSXAttribute') {
        const attrName = attr.name.name;
        if (typeof attrName === 'string') {
          if (attrName === 'className') {
            if (attr.value && attr.value.type === 'StringLiteral') classes = attr.value.value;
            else classes = '[Dinàmic]';
          } else if (attrName === 'id') {
            if (attr.value && attr.value.type === 'StringLiteral') id = attr.value.value;
          } else {
            attributesList.push(attrName);
            if (attrName === 'style') hasStyle = true;
            if (attrName === 'onClick') hasOnClick = true;
            if (attrName === 'role') hasRole = true;
            if (attrName === 'tabIndex') hasTabIndex = true;
            if (attrName === 'alt') hasAlt = true;
            if (attrName === 'dangerouslySetInnerHTML') hasDangerouslySet = true;
          }
        }
      } else if (attr.type === 'JSXSpreadAttribute') {
        attributesList.push('...spread');
      }
    }
  }

  const totalChildren = node.children.length;
  
  // Detecció de "Chivatos"
  let chivatos = [];

  // 1. A11Y - onClick sense role
  if (hasOnClick && tagName !== 'button' && tagName !== 'a' && !hasRole && !hasTabIndex) {
    chivatos.push('A11Y_CLICK_SENSE_ROLE');
  }

  // 2. A11Y - Image sense alt
  if (tagName === 'img' && !hasAlt && !attributesList.includes('...spread')) {
    chivatos.push('A11Y_IMG_SENSE_ALT');
  }

  // 3. CSS Excessiu (>15)
  if (classes !== '[Dinàmic]' && classes.split(' ').length > 15) {
    chivatos.push('CSS_EXCESSIU');
  }

  // 4. Conflicte d'Estils (Tailwind + style= en el mateix node)
  if (classes !== '' && classes !== '[Dinàmic]' && hasStyle) {
    chivatos.push('ESTILS_MESCLATS');
  }

  // 5. Seguretat
  if (hasDangerouslySet) {
    chivatos.push('PERILL_XSS');
  }

  // 6. Fantasma Estructural Absolut
  if (totalChildren === 0 && !classes && !id && attributesList.length === 0) {
    chivatos.push('FANTASMA_BUIT');
  } else if (totalChildren === 1 && !classes && !id && attributesList.length === 0 && (tagName === 'div' || tagName === 'span')) {
    chivatos.push('WRAPPER_INUTIL');
  }

  const chivatoStr = chivatos.length > 0 ? chivatos.join(' | ') : 'OK';

  return {
    component: path.basename(filePath),
    filePath,
    tagName,
    line,
    chivatos: chivatoStr,
    totalChildren,
    atributsExtra: attributesList.join(' '),
    classes: classes.replace(/\n/g, ' ').replace(/,/g, ';')
  };
}

async function main() {
  console.log('Iniciant l\'Auditoria Universal...');
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
          const res = analyzeElement(pathObj, file);
          if (res) results.push(res);
        }
      });
    } catch (e) {
      // Silenciat
    }
  }

  await fs.mkdir(path.dirname(OUTPUT_FILE), { recursive: true });
  
  const csvHeaders = ['Component', 'Arxiu', 'Tag', 'Linia', 'Chivatos', 'Num Fills', 'Atributs Extra', 'Classes CSS'];
  const csvRows = results.map(r => 
    `${r.component},${r.filePath},${r.tagName},${r.line},${r.chivatos},${r.totalChildren},${r.atributsExtra},${r.classes}`
  );

  const csvContent = [csvHeaders.join(','), ...csvRows].join('\n');
  await fs.writeFile(OUTPUT_FILE, csvContent, 'utf-8');

  // Processament i Agrupació
  const anomalies = results.filter(r => r.chivatos !== 'OK');
  const grouped = {};
  anomalies.forEach(a => {
    a.chivatos.split(' | ').forEach(ch => {
      grouped[ch] = (grouped[ch] || 0) + 1;
    });
  });

  console.log(`\nAuditoria Universal Completada. S'han analitzat ${results.length} nodes HTML/JSX.`);
  console.log('--- CHIVATOS DETECTATS (Anomalies) ---');
  Object.entries(grouped).sort((a,b)=>b[1]-a[1]).forEach(([k,v]) => {
    console.log(`${k}: ${v} ocurrències`);
  });
}

main().catch(console.error);

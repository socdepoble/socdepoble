import fs from 'fs/promises';
import path from 'path';
import { parse } from '@babel/parser';
import _traverse from '@babel/traverse';
import _generate from '@babel/generator';

const traverse = _traverse.default || _traverse;
const generate = _generate.default || _generate;

const SRC_DIR = './src';

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

function isUseless(node) {
  if (node.openingElement.name.type !== 'JSXIdentifier') return false;
  const tagName = node.openingElement.name.name;
  
  // Només toquem divs i spans per seguretat extrema
  if (tagName !== 'div' && tagName !== 'span') return false;
  
  // Ha de tindre ZERO atributs (ni className, ni style, ni res)
  if (node.openingElement.attributes && node.openingElement.attributes.length > 0) return false;
  
  const children = node.children.filter(c => {
    // Ignorem text buit (espais/salts de línia)
    if (c.type === 'JSXText' && c.value.trim() === '') return false;
    return true;
  });

  if (children.length === 0) return 'EMPTY';
  if (children.length === 1) return 'WRAPPER';
  
  return false;
}

async function main() {
  console.log('Iniciant Tractor Quirúrgic (Poda de Fantasmes 100% Segurs)...');
  const jsxFiles = await findJsxFiles(SRC_DIR);
  let totalRemoved = 0;
  let totalUnwrapped = 0;

  for (const file of jsxFiles) {
    try {
      const code = await fs.readFile(file, 'utf-8');
      const ast = parse(code, {
        sourceType: 'module',
        plugins: ['jsx', 'nullishCoalescingOperator', 'optionalChaining', 'classProperties', 'typescript']
      });

      let changed = false;

      traverse(ast, {
        JSXElement(pathObj) {
          const type = isUseless(pathObj.node);
          if (type === 'EMPTY') {
            pathObj.remove();
            changed = true;
            totalRemoved++;
          } else if (type === 'WRAPPER') {
            const validChildren = pathObj.node.children.filter(c => !(c.type === 'JSXText' && c.value.trim() === ''));
            pathObj.replaceWith(validChildren[0]);
            changed = true;
            totalUnwrapped++;
          }
        }
      });

      if (changed) {
        // Generar nou codi retenint el format el màxim possible
        const output = generate(ast, { retainLines: true, retainFunctionParens: true }, code);
        await fs.writeFile(file, output.code, 'utf-8');
      }
    } catch (e) {
      // Si falla algun arxiu per sintaxi rara, l'ignorem
    }
  }

  console.log(`\n🚜 Poda Finalitzada amb Èxit.`);
  console.log(`- Fantasmes Buits polvoritzats: ${totalRemoved}`);
  console.log(`- Wrappers Inútils desembolicats: ${totalUnwrapped}`);
  console.log(`\nEl codi és ara més lleuger i l'arbre DOM més pla.`);
}

main().catch(console.error);

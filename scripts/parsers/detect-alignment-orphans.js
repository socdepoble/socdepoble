import fs from 'fs';
import path from 'path';
import parser from '@babel/parser';
import traverse from '@babel/traverse';
import crypto from 'crypto';
import { glob } from 'glob';

const CACHE_DIR = path.join(process.cwd(), '.cache', 'trellat-ast');

function getFileHash(filePath) {
  const content = fs.readFileSync(filePath);
  return crypto.createHash('md5').update(content).digest('hex');
}

function getCachedAST(filePath) {
  const hash = getFileHash(filePath);
  const cacheFile = path.join(CACHE_DIR, `${path.basename(filePath)}-${hash}.json`);
  
  if (fs.existsSync(cacheFile)) {
    return JSON.parse(fs.readFileSync(cacheFile, 'utf-8'));
  }
  return null;
}

function setCachedAST(filePath, ast) {
  const hash = getFileHash(filePath);
  const cacheFile = path.join(CACHE_DIR, `${path.basename(filePath)}-${hash}.json`);
  fs.mkdirSync(CACHE_DIR, { recursive: true });
  try {
    fs.writeFileSync(cacheFile, JSON.stringify(ast));
  } catch (e) {
    // Ignore circular structure issues with babel ast JSON serialization if they occur
  }
}

function parseFileWithCache(filePath) {
  const cached = getCachedAST(filePath);
  if (cached) {
    return cached;
  }
  
  const code = fs.readFileSync(filePath, 'utf-8');
  const ast = parser.parse(code, {
    sourceType: 'module',
    plugins: ['jsx', 'typescript']
  });
  
  setCachedAST(filePath, ast);
  return ast;
}

export async function runOrphanParser(targetDir) {
  const files = await glob('src/**/*.{js,jsx,ts,tsx}');
  let totalOrphans = 0;

  files.forEach(filePath => {
    let ast;
    try {
      ast = parseFileWithCache(filePath);
    } catch (e) { return; }

    traverse.default(ast, {
      JSXElement(nodePath) {
        const opening = nodePath.node.openingElement;
        const classNameAttr = opening.attributes.find(a => a.name && a.name.name === 'className');
        
        if (!classNameAttr || !classNameAttr.value || classNameAttr.value.type !== 'StringLiteral') return;
        
        const classValue = classNameAttr.value.value;
        const hasAlignmentIntent = classValue.includes('mx-auto') || classValue.includes('justify-self-') || classValue.includes('place-self-');

        if (hasAlignmentIntent) {
          // Pujar un sol nivell de JSX real per a interceptar el pare
          const parentJSX = nodePath.findParent(p => p.isJSXElement());
          if (!parentJSX) return;

          const parentOpening = parentJSX.node.openingElement;
          const parentName = parentOpening.name.name;
          const parentClassNameAttr = parentOpening.attributes.find(a => a.name && a.name.name === 'className');
          const parentClasses = (parentClassNameAttr && parentClassNameAttr.value && parentClassNameAttr.value.type === 'StringLiteral') 
            ? parentClassNameAttr.value.value 
            : '';

          // Llei del Trellat: Si el pare és un div inert (sense flex, grid ni inline-flex), les classes del fill són falses
          const isInertParent = parentName === 'div' && 
                               !parentClasses.includes('flex') && 
                               !parentClasses.includes('grid') && 
                               !parentClasses.includes('inline-');

          if (isInertParent) {
            totalOrphans++;
            console.error(`🚨 [ORFANDAT TOPOLÒGICA] a: ${path.relative(process.cwd(), filePath)} (Línia ${opening.loc?.start.line})`);
            console.error(`   - El fill <${opening.name.name}> vol alinear-se demanant: "${classValue}"`);
            console.error(`   - Però el seu pare és un <div className="${parentClasses}"> totalment inert.`);
            console.error(`   - 🛠️ Solució: Converteix el pare a flex/grid o llança a la guillotina el contenidor intermedi.\n`);
          }
        }
      }
    });
  });

  if (totalOrphans > 0) process.exit(1);
}

runOrphanParser(path.resolve('./src/components'));

#!/usr/bin/env node
// ghost-tracker.js — executa amb Node 18+ al teu repositori
// Rastrejador de Fantasmes per detectar codi mort basat en l'AST.

const { Project } = require('ts-morph');
const path = require('path');
const fs = require('fs-extra');
const glob = require('glob');

const project = new Project({
  tsConfigFilePath: 'tsconfig.json', // Assumint que hi ha tsconfig, si no, cal crear un genèric
  skipAddingFilesFromTsConfig: true, // Preferim utilitzar glob si el tsconfig no cobreix tot
});

// Afegeix fitxers manualment si no estan al tsconfig
project.addSourceFilesAtPaths("src/**/*.{ts,tsx,js,jsx}");

// Fitxers a ignorar
const IGNORE_PATTERNS = [/node_modules/, /\.test\./, /\.spec\./, /__tests__/, /vite\.config/, /tailwind\.config/];

// Punts d'entrada
const ENTRY_POINTS = [
  'src/main.jsx',
  'src/index.jsx',
  'src/main.tsx',
  'src/index.tsx',
  'src/workers/service-worker.ts',
  'src/workers/syncWorker.js',
  'src/workers/visionWorker.js',
  'src/workers/rizoma-worker-master.js'
];

function isEntryPoint(filePath) {
  return ENTRY_POINTS.some(e => filePath.endsWith(e));
}

const fileExports = new Map();
const fileImports = new Map();
const reactComponentExports = new Map();
const fileJSXTags = new Map();

for (const sourceFile of project.getSourceFiles()) {
  const filePath = sourceFile.getFilePath();
  if (IGNORE_PATTERNS.some(p => p.test(filePath))) continue;

  const exportsSet = new Set();
  for (const [name] of sourceFile.getExportedDeclarations()) {
    exportsSet.add(name);
  }
  fileExports.set(filePath, exportsSet);

  const reactExports = new Set();
  for (const [name, declarations] of sourceFile.getExportedDeclarations()) {
    for (const decl of declarations) {
      if (
        (decl.getKindName() === 'FunctionDeclaration' || decl.getKindName() === 'ArrowFunction' || decl.getKindName() === 'FunctionExpression') &&
        (decl.getText().includes('return React.createElement') || decl.getText().includes('<'))
      ) {
        reactExports.add(name);
      } else if (decl.getKindName() === 'ClassDeclaration' && decl.getExtends()?.getText().includes('React.Component')) {
        reactExports.add(name);
      }
    }
  }
  if (reactExports.size > 0) {
    reactComponentExports.set(filePath, reactExports);
  }

  const imports = [];
  for (const importDecl of sourceFile.getImportDeclarations()) {
    const moduleSpecifier = importDecl.getModuleSpecifierValue();
    const namedImports = importDecl.getNamedImports().map(i => i.getName());
    imports.push({ moduleSpecifier, namedImports });
  }
  fileImports.set(filePath, imports);

  const jsxTags = new Set();
  sourceFile.forEachChild(child => {
    findJSXTags(child, jsxTags);
  });
  fileJSXTags.set(filePath, jsxTags);
}

function findJSXTags(node, set) {
  if (node.getKindName() === 'JsxOpeningElement' || node.getKindName() === 'JsxSelfClosingElement') {
    const tagName = node.getTagNameNode().getText();
    set.add(tagName);
  }
  node.forEachChild(child => findJSXTags(child, set));
}

// ANÀLISI 1: Fitxers morts
const allFiles = project.getSourceFiles().map(f => f.getFilePath()).filter(f => !IGNORE_PATTERNS.some(p => p.test(f)));
const importedFiles = new Set();
for (const [filePath, imports] of fileImports) {
  for (const imp of imports) {
    const resolved = tryResolve(imp.moduleSpecifier, filePath);
    if (resolved) importedFiles.add(resolved);
  }
}

const deadFiles = allFiles.filter(f => !importedFiles.has(f) && !isEntryPoint(f));

// ANÀLISI 2: Exports no usats
const usedExports = new Map();
for (const [filePath, imports] of fileImports) {
  for (const imp of imports) {
    const resolved = tryResolve(imp.moduleSpecifier, filePath);
    if (!resolved) continue;
    if (!usedExports.has(resolved)) usedExports.set(resolved, new Set());
    imp.namedImports.forEach(n => usedExports.get(resolved).add(n));
    if (imp.moduleSpecifier && imp.namedImports.length === 0) {
      usedExports.get(resolved).add('default');
    }
  }
}

const unusedExports = [];
for (const [file, exports] of fileExports) {
  const used = usedExports.get(file) || new Set();
  for (const exp of exports) {
    if (!used.has(exp)) {
      unusedExports.push({ file, exportName: exp });
    }
  }
}

// ANÀLISI 3: Imports orfes (ruta inexistent)
const orphanImports = [];
for (const [file, imports] of fileImports) {
  for (const imp of imports) {
    const resolved = tryResolve(imp.moduleSpecifier, file);
    if (!resolved && !isExternal(imp.moduleSpecifier)) {
      orphanImports.push({ file, moduleSpecifier: imp.moduleSpecifier });
    }
  }
}

// ANÀLISI 4: Components React no usats
const unusedComponents = [];
for (const [file, components] of reactComponentExports) {
  for (const comp of components) {
    let used = false;
    for (const [, jsxTags] of fileJSXTags) {
      if (jsxTags.has(comp)) {
        used = true;
        break;
      }
    }
    if (!used) {
      unusedComponents.push({ file, component: comp });
    }
  }
}

// Helpers
function isExternal(specifier) {
  return !specifier.startsWith('.') && !specifier.startsWith('/');
}

function tryResolve(moduleSpecifier, fromFile) {
  if (isExternal(moduleSpecifier)) return null;
  const base = path.dirname(fromFile);
  try {
    return require.resolve(path.resolve(base, moduleSpecifier));
  } catch {
    // Si és JSX o TS pot no trobar-lo el require.resolve directament
    const exts = ['.js', '.jsx', '.ts', '.tsx'];
    const resolvedBase = path.resolve(base, moduleSpecifier);
    for (const ext of exts) {
      if (fs.existsSync(resolvedBase + ext)) return resolvedBase + ext;
      if (fs.existsSync(path.join(resolvedBase, 'index' + ext))) return path.join(resolvedBase, 'index' + ext);
    }
    return null;
  }
}

const report = {
  generatedAt: new Date().toISOString(),
  summary: {
    deadFiles: deadFiles.length,
    unusedExports: unusedExports.length,
    orphanImports: orphanImports.length,
    unusedComponents: unusedComponents.length,
  },
  deadFiles,
  unusedExports,
  orphanImports,
  unusedComponents,
};

fs.writeJsonSync('./ghost-report.json', report, { spaces: 2 });
console.log('👻 Informe de Fantasmes generat a ghost-report.json');
console.log('Resum:', report.summary);

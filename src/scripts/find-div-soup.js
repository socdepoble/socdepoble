/**
 * src/scripts/find-div-soup.js
 *
 * Escaneja el directori src/ per fitxers .js .jsx .ts .tsx i detecta
 * elements JSX <div> que no tenen atributs (className, id, role, data-*, aria-*)
 * i que no contenen text directe ni fills semàntics (ex: <h2>, <p>, <img>).
 *
 * Requisits de dev: npm i --save-dev @babel/parser @babel/traverse glob
 *
 * Execució:
 *   npm run lint:div-soup
 *
 * Sortida:
 *   Llista de fitxers i línies on es detecten possibles "div soup".
 */

import fs from 'fs';
import path from 'path';
const glob = require("glob");
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;

const SRC_GLOB = "src/**/*.{js,jsx,ts,tsx}";
const IGNORED_DIRS = ["node_modules", "dist", "build"];

function isAttributeRelevant(attr) {
  if (!attr) return false;
  if (attr.type === "JSXAttribute") {
    const name = attr.name && attr.name.name;
    if (!name) return false;
    // Considerem rellevants aquestes propietats
    if (
      name === "className" ||
      name === "id" ||
      name === "role" ||
      name.startsWith("data-") ||
      name.startsWith("aria-")
    ) {
      return true;
    }
    return false;
  }
  // JSXSpreadAttribute pot contenir atributs; considerem-lo rellevant
  if (attr.type === "JSXSpreadAttribute") return true;
  return false;
}

function hasSemanticChild(node) {
  // Si té fills JSXElement que no són només espais, considerem que no és buit
  if (!node.children || node.children.length === 0) return false;
  for (const ch of node.children) {
    if (ch.type === "JSXText") {
      if (ch.value && ch.value.trim().length > 0) return true;
      continue;
    }
    if (ch.type === "JSXElement") {
      const childName =
        ch.openingElement &&
        ch.openingElement.name &&
        (ch.openingElement.name.name || (ch.openingElement.name.object && ch.openingElement.name.object.name));
      // Si el fill és semàntic (h1-h6, p, img, ul, ol, li, article, section, header, footer)
      if (childName && /^(h[1-6]|p|img|ul|ol|li|article|section|header|footer|main|nav|figure)$/i.test(childName)) {
        return true;
      }
      // Si el fill té atributs rellevants, també el considerem semàntic
      const attrs = ch.openingElement && ch.openingElement.attributes;
      if (attrs && attrs.some(isAttributeRelevant)) return true;
      // Si el fill té text intern
      if (ch.children && ch.children.some(c => c.type === "JSXText" && c.value && c.value.trim().length > 0)) {
        return true;
      }
    }
  }
  return false;
}

function analyzeFile(filePath) {
  const code = fs.readFileSync(filePath, "utf8");
  let ast;
  try {
    ast = parser.parse(code, {
      sourceType: "module",
      plugins: ["jsx", "typescript", "classProperties", "optionalChaining", "nullishCoalescingOperator"],
    });
  } catch (err) {
    console.error(`No s'ha pogut parsejar ${filePath}: ${err.message}`);
    return [];
  }

  const issues = [];

  traverse(ast, {
    JSXElement(path) {
      const opening = path.node.openingElement;
      if (!opening || !opening.name) return;
      // Nom simple (no MemberExpression)
      const name = opening.name.name;
      if (name !== "div") return;

      const attrs = opening.attributes || [];
      const hasRelevantAttr = attrs.some(isAttributeRelevant);

      // Si té atributs rellevants, no és sospitós
      if (hasRelevantAttr) return;

      // Si té fills semàntics o text, no és sospitós
      if (hasSemanticChild(path.node)) return;

      // Obtenir localització
      const loc = opening.loc ? opening.loc.start : { line: "?" };
      issues.push({ file: filePath, line: loc.line });
    },
  });

  return issues;
}

function run() {
  const files = glob.sync(SRC_GLOB, { ignore: IGNORED_DIRS.map(d => `**/${d}/**`) });
  if (files.length === 0) {
    console.log("No s'han trobat fitxers a src/ amb extensions js/jsx/ts/tsx.");
    return;
  }

  let total = 0;
  const allIssues = [];

  for (const f of files) {
    const issues = analyzeFile(f);
    if (issues.length > 0) {
      allIssues.push(...issues);
      total += issues.length;
    }
  }

  if (allIssues.length === 0) {
    console.log("OK — No s'han detectat 'div soup' sospitosos segons les regles heurístiques.");
    return;
  }

  console.log(`Detectats ${total} possibles 'div soup' (heurístic):`);
  // Agrupar per fitxer
  const byFile = allIssues.reduce((acc, it) => {
    acc[it.file] = acc[it.file] || [];
    acc[it.file].push(it.line);
    return acc;
  }, {});

  for (const file of Object.keys(byFile)) {
    console.log(`\n${file}`);
    console.log(`  Línies: ${byFile[file].join(", ")}`);
    console.log(`  Recomanació: substituir <div> per element semàntic (h2/p/article/section) o afegir className/id/data-* si és necessari.`);
  }

  // Codi de sortida no zero per integrar en CI si cal
  process.exitCode = 2;
}

run();

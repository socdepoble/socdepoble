// scripts/auditoria-causalitat.js
// Sistema Immune — Auditoria de Causalitat en l'AST
// Node.js + @babel/parser + @babel/traverse

const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const t = require("@babel/types");
const fs = require("fs");
const glob = require("glob");

const VIOLACIONS = [];

function afegir(ruta, linia, tipus, gravetat, missatge, codi) {
  VIOLACIONS.push({ arxiu: ruta, linia, tipus, gravetat, missatge, codi });
}

function esPrimitiu(node) {
  return t.isStringLiteral(node) || t.isNumericLiteral(node) || t.isBooleanLiteral(node) || t.isNullLiteral(node) || t.isIdentifier(node);
}

function esLiteralInestable(node) {
  return t.isObjectExpression(node) || t.isArrayExpression(node) || t.isArrowFunctionExpression(node) || t.isFunctionExpression(node);
}

function extreureCodi(src, node) {
  return src.slice(node.start, node.end).replace(/\s+/g, " ").trim().slice(0, 80);
}

function auditarArxiu(ruta, src) {
  let ast;
  try {
    ast = parser.parse(src, { sourceType: "module", plugins: ["jsx", "typescript"] });
  } catch {
    return;
  }

  const hooksAmbDeps = [];
  const identificadorsDeHook = new Set(["useEffect", "useMemo", "useCallback", "useLayoutEffect"]);

  traverse(ast, {
    // --- 2.2 Deps primitives ---
    CallExpression(path) {
      const { callee, arguments: args } = path.node;
      if (!t.isIdentifier(callee) || !identificadorsDeHook.has(callee.name)) return;
      if (args.length < 2) {
        afegir(ruta, callee.loc?.start?.line || 0, "CAUSALITAT", "ALTA", `${callee.name} sense array de dependències`, extreureCodi(src, path.node));
        return;
      }
      const depsArray = args[1];
      if (!t.isArrayExpression(depsArray)) return;

      depsArray.elements.forEach((el, idx) => {
        if (!el) return;
        if (esLiteralInestable(el)) {
          afegir(ruta, el.loc?.start?.line || 0, "CAUSALITAT", "ALTA", `Dependència inestable (objecte/array/funció literal) en posició ${idx} de ${callee.name}`, extreureCodi(src, el));
        }
      });

      hooksAmbDeps.push({ nom: callee.name, deps: depsArray.elements.filter(Boolean), node: path.node, loc: path.node.loc });
    },

    // --- 2.3 setState en useEffect sense guarda ---
    CallExpression(path) {
      const { callee, arguments: args } = path.node;
      if (!t.isIdentifier(callee) || callee.name !== "useEffect") return;
      const callback = args[0];
      if (!t.isArrowFunctionExpression(callback) && !t.isFunctionExpression(callback)) return;

      let teGuarda = false;
      let teSetState = false;

      traverse(callback, {
        CallExpression(innerPath) {
          const innerCallee = innerPath.node.callee;
          if (t.isIdentifier(innerCallee) && /set[A-Z]/.test(innerCallee.name)) {
            teSetState = true;
          }
        },
        IfStatement() { teGuarda = true; },
        ConditionalExpression() { teGuarda = true; },
        LogicalExpression(innerPath) {
          if (innerPath.node.operator === "&&" || innerPath.node.operator === "||") teGuarda = true;
        }
      }, path.scope, path);

      if (teSetState && !teGuarda) {
        afegir(ruta, callee.loc?.start?.line || 0, "CAUSALITAT", "ALTA", "useEffect amb setState sense condició de guarda (risc de bucle infinit)", extreureCodi(src, callback));
      }
    },

    // --- 3.1 Handlers inline ---
    JSXAttribute(path) {
      const { name, value } = path.node;
      if (!t.isJSXIdentifier(name) || !/^on[A-Z]/.test(name.name)) return;
      if (!value) return;
      const expr = t.isJSXExpressionContainer(value) ? value.expression : value;
      if (t.isArrowFunctionExpression(expr) || t.isFunctionExpression(expr)) {
        afegir(ruta, expr.loc?.start?.line || 0, "CAUSALITAT", "MEDIA", "Handler inline sense useCallback", extreureCodi(src, expr));
      }
    },

    // --- 3.2 Props literals ---
    JSXAttribute(path) {
      const { name, value } = path.node;
      if (!value || !t.isJSXExpressionContainer(value)) return;
      const expr = value.expression;
      if (t.isObjectExpression(expr) || t.isArrayExpression(expr)) {
        const nomAttr = t.isJSXIdentifier(name) ? name.name : "";
        if (nomAttr === "style" || nomAttr === "sx") {
          afegir(ruta, expr.loc?.start?.line || 0, "CAUSALITAT", "MEDIA", `Prop literal inestable: ${nomAttr}`, extreureCodi(src, expr));
        }
      }
    },

    // --- 1.1 Zero wrappers buits ---
    JSXElement(path) {
      const { openingElement, children } = path.node;
      const tag = t.isJSXIdentifier(openingElement.name) ? openingElement.name.name : "";
      if (tag !== "div" && tag !== "span") return;
      const teClassName = openingElement.attributes.some(a => t.isJSXAttribute(a) && t.isJSXIdentifier(a.name) && a.name.name === "className");
      const teOnClick = openingElement.attributes.some(a => t.isJSXAttribute(a) && t.isJSXIdentifier(a.name) && a.name.name === "onClick");
      const nomesText = children.every(c => t.isJSXText(c) || t.isJSXExpressionContainer(c));
      if (!teClassName && !teOnClick && children.length > 0 && nomesText) {
        afegir(ruta, openingElement.loc?.start?.line || 0, "ESTRUCTURA", "MEDIA", `${tag} sense className ni event usat com a wrapper de text`, extreureCodi(src, path.node));
      }
    }
  });
}

// --- Execució ---
const arxius = glob.sync("src/**/*.{jsx,tsx}");
arxius.forEach(ruta => {
  const src = fs.readFileSync(ruta, "utf-8");
  auditarArxiu(ruta, src);
});

// --- Informe ---
const perGravetat = { ALTA: [], MEDIA: [], BAIXA: [] };
VIOLACIONS.forEach(v => perGravetat[v.gravetat].push(v));

console.log(`\n=== AUDITORIA DE CAUSALITAT ===\n`);
console.log(`Arxius escanejats: ${arxius.length}`);
console.log(`Violacions totals: ${VIOLACIONS.length}`);
console.log(`  ALTA: ${perGravetat.ALTA.length}`);
console.log(`  MEDIA: ${perGravetat.MEDIA.length}\n`);

if (perGravetat.ALTA.length > 0) {
  console.log("--- FALLS CRÍTICS (ALTA) ---");
  perGravetat.ALTA.forEach(v => {
    console.log(`[${v.arxiu}:${v.linia}] ${v.missatge}`);
    console.log(`    Codi: ${v.codi}\n`);
  });
  process.exit(1);
} else {
  console.log("✅ Cap fall de causalitat detectat. La Masia està sana.");
  process.exit(0);
}

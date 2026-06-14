// scripts/fix_ghost_buttons_codemod.js
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const generate = require("@babel/generator").default;
const t = require("@babel/types");
const fs = require("fs");
const glob = require("glob");

const SEMANTIC_TAGS = new Set(["button", "a", "input", "select", "textarea"]);
const INTERACTIVE_ROLES = new Set(["button", "link", "menuitem", "tab"]);

function isGhostButton(node) {
  if (!node.openingElement) return false;
  const { name, attributes } = node.openingElement;
  
  // Només elements HTML bàsics (div, span, etc.)
  if (name.type !== "JSXIdentifier") return false;
  if (SEMANTIC_TAGS.has(name.name)) return false;
  
  // Té onClick?
  const hasOnClick = attributes.some(
    attr => attr.type === "JSXAttribute" && attr.name.name === "onClick"
  );
  if (!hasOnClick) return false;
  
  // Ja té rol interactiu?
  const hasRole = attributes.some(
    attr => attr.type === "JSXAttribute" && 
            attr.name.name === "role" && 
            INTERACTIVE_ROLES.has(attr.value?.value)
  );
  if (hasRole) return false;
  
  return true;
}

function transformToButton(node) {
  // Estratègia A: Canviar a <button> natiu (el més indestructible)
  // Només si NO té classes que depenguen de ser <div> per layout
  const classAttr = node.openingElement.attributes.find(
    attr => attr.type === "JSXAttribute" && attr.name.name === "className"
  );
  
  const hasComplexLayout = classAttr && 
    /flex|grid|absolute|relative|fixed/.test(
      classAttr.value?.value || ""
    );
  
  if (!hasComplexLayout) {
    // Conversió directa a <button>
    node.openingElement.name.name = "button";
    if (node.closingElement) {
      node.closingElement.name.name = "button";
    }
    // Eliminar tabIndex si existeix (button ja és focusable)
    node.openingElement.attributes = node.openingElement.attributes.filter(
      attr => !(attr.type === "JSXAttribute" && attr.name.name === "tabIndex")
    );
    return;
  }
  
  // Estratègia B: Afegir role, tabIndex, onKeyDown (si el layout és complex)
  const newAttrs = [
    t.jsxAttribute(t.jsxIdentifier("role"), t.stringLiteral("button")),
    t.jsxAttribute(t.jsxIdentifier("tabIndex"), t.jsxExpressionContainer(t.numericLiteral(0))),
    t.jsxAttribute(
      t.jsxIdentifier("onKeyDown"),
      t.jsxExpressionContainer(
        t.arrowFunctionExpression(
          [t.identifier("e")],
          t.blockStatement([
            t.ifStatement(
              t.logicalExpression(
                "||",
                t.binaryExpression("===", t.memberExpression(t.identifier("e"), t.identifier("key")), t.stringLiteral("Enter")),
                t.binaryExpression("===", t.memberExpression(t.identifier("e"), t.identifier("key")), t.stringLiteral(" "))
              ),
              t.blockStatement([
                t.expressionStatement(
                  t.callExpression(
                    t.memberExpression(t.identifier("e"), t.identifier("preventDefault")),
                    []
                  )
                ),
                t.expressionStatement(
                  t.callExpression(
                    t.memberExpression(t.identifier("e"), t.identifier("stopPropagation")),
                    []
                  )
                ),
                // Disparar el onClick original
                t.expressionStatement(
                  t.callExpression(
                    t.memberExpression(t.identifier("e"), t.identifier("currentTarget")),
                    [t.identifier("click")]
                  )
                )
              ])
            )
          ])
        )
      )
    )
  ];
  
  // Afegir els nous atributs
  node.openingElement.attributes.push(...newAttrs);
}

// Execució
const files = glob.sync("src/**/*.{jsx,js}");
let fixedCount = 0;

files.forEach(file => {
  const code = fs.readFileSync(file, "utf-8");
  const ast = parser.parse(code, {
    sourceType: "module",
    plugins: ["jsx"]
  });
  
  let modified = false;
  
  traverse(ast, {
    JSXElement(path) {
      if (isGhostButton(path.node)) {
        transformToButton(path.node);
        modified = true;
        fixedCount++;
      }
    }
  });
  
  if (modified) {
    const output = generate(ast, { retainLines: true }, code);
    fs.writeFileSync(file, output.code);
    console.log(`🔧 ${file}`);
  }
});

console.log(`\n✅ ${fixedCount} botons fantasma preparats per a l'acció.`);

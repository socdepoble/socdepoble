/**
 * scripts/transform-div-media-actions.js
 *
 * Transformacions:
 *  - <div className="... media ...">...</div>  ->  <figure className="... media ...">...</figure>
 *  - <div className="... actions ...">...</div> ->  <footer className="... actions ...">...</footer>
 *
 * Regles de seguretat:
 *  - Només transforma si className és literal i conté el token 'media' o 'actions'
 *  - Manté tots els atributs existents
 *  - No transforma si el <div> té múltiples fills semàntics que indiquen layout complex
 *
 * Execució:
 *  npx jscodeshift -t scripts/transform-div-media-actions.js src
 *
 * Recomanació:
 *  Executa primer en mode dry: add --dry -d -p
 */

const jscodeshift = require("jscodeshift");

function getClassAttr(opening) {
  return opening.attributes && opening.attributes.find(a => a.type === "JSXAttribute" && a.name && a.name.name === "className");
}

function classValueIsLiteral(classAttr) {
  if (!classAttr || !classAttr.value) return false;
  const v = classAttr.value;
  return v.type === "Literal" || (v.type === "JSXExpressionContainer" && v.expression && v.expression.type === "Literal");
}

function classValueString(classAttr) {
  if (!classAttr || !classAttr.value) return "";
  const v = classAttr.value;
  if (v.type === "Literal") return String(v.value);
  if (v.type === "JSXExpressionContainer" && v.expression && v.expression.type === "Literal") return String(v.expression.value);
  return "";
}

function hasMultipleSemanticChildren(node) {
  if (!node.children || node.children.length === 0) return false;
  let semanticCount = 0;
  for (const ch of node.children) {
    if (ch.type === "JSXElement") {
      const name = ch.openingElement && ch.openingElement.name && ch.openingElement.name.name;
      if (name && /^(h[1-6]|p|img|ul|ol|li|article|section|header|footer|main|nav|figure)$/i.test(name)) {
        semanticCount++;
      }
    } else if (ch.type === "JSXText" && ch.value && ch.value.trim().length > 0) {
      semanticCount++;
    }
    if (semanticCount > 1) return true;
  }
  return false;
}

module.exports = function transformer(fileInfo, api) {
  const j = api.jscodeshift;
  const root = j(fileInfo.source);
  let changed = false;

  root.find(j.JSXElement, {
    openingElement: { name: { name: "div" } }
  }).forEach(path => {
    const opening = path.node.openingElement;
    const classAttr = getClassAttr(opening);
    if (!classAttr) return;

    // Només classes literals per seguretat
    if (!classValueIsLiteral(classAttr)) return;
    const classStr = classValueString(classAttr);
    if (!classStr) return;

    const tokens = classStr.split(/\s+/);
    const isMedia = tokens.includes("media");
    const isActions = tokens.includes("actions");

    if (!isMedia && !isActions) return;

    // Evitar transformar layout complex
    if (hasMultipleSemanticChildren(path.node)) return;

    const newTag = isMedia ? "figure" : "footer";

    // Conservar atributs i fills
    const newOpening = j.jsxOpeningElement(j.jsxIdentifier(newTag), opening.attributes, opening.selfClosing);
    const newClosing = path.node.closingElement ? j.jsxClosingElement(j.jsxIdentifier(newTag)) : null;
    const newElement = j.jsxElement(newOpening, newClosing, path.node.children, opening.selfClosing);

    j(path).replaceWith(newElement);
    changed = true;
  });

  return changed ? root.toSource({ quote: "double" }) : null;
};

/**
 * scripts/transform-div-title-subtitle.js
 *
 * Transformació:
 *  - <div className="title">...</div>  ->  <h2 className="title">...</h2>
 *  - <div className="subtitle">...</div> ->  <p className="subtitle">...</p>
 *
 * Regles addicionals:
 *  - Manté altres atributs (id, data-*, aria-*, style, onClick, etc.)
 *  - Si la classe conté altres tokens (ex: "card title main"), només transforma si "title" o "subtitle" apareix com a token.
 *  - No transforma si el <div> té children complexos que semblen layout (ex: múltiples elements semàntics dins).
 *
 * Execució:
 *  npx jscodeshift -t scripts/transform-div-title-subtitle.js src
 *
 * Requisits:
 *  npm i -g jscodeshift   (o usar npx)
 */

const { parse } = require("recast");
const j = require("jscodeshift");

function hasTokenInClass(classAttr, token) {
  if (!classAttr) return false;
  if (classAttr.type === "Literal") {
    return classAttr.value.split(/\s+/).includes(token);
  }
  // JSXExpressionContainer with string literal
  if (classAttr.type === "JSXExpressionContainer" && classAttr.expression && classAttr.expression.type === "Literal") {
    return classAttr.expression.value.split(/\s+/).includes(token);
  }
  // For other dynamic expressions, be conservative and return false
  return false;
}

function getClassAttr(opening) {
  return opening.attributes && opening.attributes.find(a => a.type === "JSXAttribute" && a.name && a.name.name === "className");
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

module.exports = function transformer(fileInfo, api, options) {
  const j = api.jscodeshift;
  const root = j(fileInfo.source);

  let changed = false;

  root.find(j.JSXElement, {
    openingElement: { name: { name: "div" } }
  }).forEach(path => {
    const opening = path.node.openingElement;
    const classAttr = getClassAttr(opening);
    if (!classAttr) return;

    // Extract class string if literal
    let classIsLiteral = false;
    let classValue = "";
    if (classAttr.value) {
      if (classAttr.value.type === "Literal") {
        classIsLiteral = true;
        classValue = classAttr.value.value;
      } else if (classAttr.value.type === "JSXExpressionContainer" && classAttr.value.expression.type === "Literal") {
        classIsLiteral = true;
        classValue = classAttr.value.expression.value;
      }
    }

    // Only proceed if class contains token title or subtitle
    const containsTitle = classIsLiteral && classValue.split(/\s+/).includes("title");
    const containsSubtitle = classIsLiteral && classValue.split(/\s+/).includes("subtitle");

    if (!containsTitle && !containsSubtitle) return;

    // Safety checks: si té múltiples fills semàntics, no transformem
    if (hasMultipleSemanticChildren(path.node)) return;

    // Decide new tag
    const newTagName = containsTitle ? "h2" : "p";

    // Construir nou element amb mateixes props
    const newOpening = j.jsxOpeningElement(j.jsxIdentifier(newTagName), opening.attributes, opening.selfClosing);
    const newClosing = path.node.closingElement ? j.jsxClosingElement(j.jsxIdentifier(newTagName)) : null;

    const newElement = j.jsxElement(newOpening, newClosing, path.node.children, opening.selfClosing);

    // Substituir node
    j(path).replaceWith(newElement);
    changed = true;
  });

  return changed ? root.toSource({ quote: "double" }) : null;
};

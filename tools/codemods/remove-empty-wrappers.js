// jscodeshift codemod per eliminar wrappers innecessaris
export default function transformer(file, api) {
  const j = api.jscodeshift;
  const root = j(file.source);

  let removedCount = 0;

  // Funció per verificar si un JSXElement és un wrapper innecessari
  function isGhostWrapper(path) {
    const node = path.node;
    
    // Ha de ser un <div>
    if (node.openingElement.name.name !== 'div') return false;
    
    // No pot tindre events, refs, keys, aria-*, data-*, id, style
    const attrs = node.openingElement.attributes || [];
    const hasCriticalAttr = attrs.some(attr => {
      const name = attr.name?.name || '';
      return name.startsWith('on') || 
             name === 'ref' || 
             name === 'key' || 
             name.startsWith('aria-') || 
             name === 'role' ||
             name.startsWith('data-') ||
             name === 'id' ||
             name === 'style';
    });
    
    if (hasCriticalAttr) return false;
    
    // Ha de tindre exactament 1 fill
    if (node.children.length !== 1) return false;
    
    // El fill ha de ser un altre JSXElement
    const child = node.children[0];
    if (child.type !== 'JSXElement') return false;
    
    return true;
  }

  // Buscar i eliminar wrappers fantasma
  root.find(j.JSXElement)
    .filter(path => isGhostWrapper(path))
    .forEach(path => {
      const child = path.node.children[0];
      
      // Fusionar className del wrapper amb el fill
      const wrapperClass = path.node.openingElement.attributes.find(
        a => a.name?.name === 'className'
      );
      const childClass = child.openingElement.attributes.find(
        a => a.name?.name === 'className'
      );
      
      if (wrapperClass && childClass) {
        childClass.value = j.stringLiteral(
          `${wrapperClass.value.value} ${childClass.value.value}`.trim()
        );
      } else if (wrapperClass && !childClass) {
        child.openingElement.attributes.push(wrapperClass);
      }
      
      j(path).replaceWith(child);
      removedCount++;
    });

  console.log(`🧹 ${removedCount} wrappers eliminats.`);
  
  return root.toSource();
}

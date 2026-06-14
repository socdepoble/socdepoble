module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Detecta divs wrappers innecessaris (fantasmes topològics)',
      recommended: true
    },
    messages: {
      ghostWrapper: '👻 Div fantasma detectat: wrapper sense funció explícita.',
      emptyClassName: '👻 Div amb className="" detectat.',
      suggestRemove: '💡 Suggeriment: elimina este wrapper i mou les classes al fill.'
    },
    fixable: 'code',
    hasSuggestions: true,
    schema: []
  },

  create(context) {
    // Llista blanca: condicions on un wrapper SÍ és vàlid
    function isRequiredWrapper(node) {
      const attrs = node.openingElement.attributes || [];
      
      return attrs.some(attr => {
        const name = attr.name?.name || '';
        
        // 1. Té event handlers (onClick, onScroll, etc.)
        if (name.startsWith('on')) return true;
        
        // 2. Té ref o data-ref
        if (name === 'ref' || name === 'data-ref') return true;
        
        // 3. Té key (per a llistes)
        if (name === 'key') return true;
        
        // 4. Té atributs d'accessibilitat
        if (name.startsWith('aria-') || name === 'role') return true;
        
        // 5. Té data-* attributes
        if (name.startsWith('data-')) return true;
        
        // 6. Té un id explícit
        if (name === 'id' && attr.value?.value) return true;
        
        // 7. Té estils inline (clau per a virtualització com React Window)
        if (name === 'style') return true;
        
        // 8. Té propietats de Framer Motion i drag/drop
        const FRAMER_MOTION_PROPS = ['layout', 'layoutId', 'initial', 'animate', 'exit', 'whileHover', 'whileTap', 'whileInView', 'drag', 'draggable', 'onDragStart', 'onDrop'];
        if (FRAMER_MOTION_PROPS.includes(name)) return true;

        // 9. Té portals o intersection observer
        if (['data-portal', 'data-react-portal', 'data-observed', 'data-index'].includes(name)) return true;
        
        return false;
      });
    }

    // Extraure el valor de className d'un node JSX
    function getClassName(node) {
      const classAttr = (node.openingElement.attributes || []).find(
        a => a.name?.name === 'className'
      );
      
      if (!classAttr) return '';
      
      if (classAttr.value?.type === 'StringLiteral') {
        return classAttr.value.value;
      }
      
      return '';
    }

    return {
      JSXElement(node) {
        // Només analitzar divs
        if (node.openingElement.name.name !== 'div') return;
        
        const className = getClassName(node);
        const hasChildren = node.children.length > 0;
        const isRequired = isRequiredWrapper(node);
        
        // CAS 1: Div sense classes, sense props, amb exactament 1 fill div → FANTASMA
        if (!className && !isRequired && hasChildren && 
            node.children.length === 1 && 
            node.children[0].type === 'JSXElement' &&
            node.children[0].openingElement.name.name === 'div') {
          
          context.report({
            node,
            messageId: 'ghostWrapper',
            suggest: [{
              messageId: 'suggestRemove',
              fix(fixer) {
                const child = node.children[0];
                const sourceCode = context.getSourceCode();
                return fixer.replaceText(node, sourceCode.getText(child));
              }
            }]
          });
        }
        
        // CAS 2: Div amb className="" (buit explícit) → FANTASMA
        if (className === '' && !isRequired) {
          context.report({
            node,
            messageId: 'emptyClassName'
          });
        }
        
        // CAS 3: Div amb classes però sense props, i el fill és un altre div → POSSIBLE FANTASMA
        if (className && !isRequired && 
            hasChildren && node.children.length === 1 &&
            node.children[0].type === 'JSXElement' &&
            node.children[0].openingElement.name.name === 'div') {
          
          context.report({
            node,
            messageId: 'ghostWrapper',
            suggest: [{
              messageId: 'suggestRemove',
              fix(fixer) {
                const child = node.children[0];
                const sourceCode = context.getSourceCode();
                const childClass = getClassName(child);
                const mergedClass = [className, childClass].filter(Boolean).join(' ');
                
                // Reemplaçar el wrapper pel fill amb les classes fusionades
                let childText = sourceCode.getText(child);
                if (mergedClass) {
                  childText = childText.replace(
                    /className="([^"]*)"/,
                    `className="${mergedClass}"`
                  );
                }
                return fixer.replaceText(node, childText);
              }
            }]
          });
        }
      }
    };
  }
};

import { useMemo } from 'react';

export const useAccessibleSearch = (containerRef) => {

  const searchEngine = useMemo(() => {
    return {
      search: (query) => {
        if (!containerRef.current || !query) return { found: false, count: 0 };
        
        const contentDiv = containerRef.current.querySelector('.app-cms-content') || containerRef.current;
        
        // 1. Netejar marques anteriors respectant el DOM de React
        const marks = contentDiv.querySelectorAll('.search-highlight');
        marks.forEach(mark => {
            const parent = mark.parentNode;
            if (parent) {
                const textNodes = Array.from(mark.childNodes);
                textNodes.forEach(node => parent.insertBefore(node, mark));
                parent.removeChild(mark);
                // Normalitzar per unir nodes de text fragmentats
                parent.normalize();
            }
        });
        
        const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&')})`, 'gi');
        
        // TreeWalker només per text nodes
        const walker = document.createTreeWalker(contentDiv, NodeFilter.SHOW_TEXT, {
            acceptNode: function(node) {
                // Evitar scripts, estils o marques existents no netejades
                if (node.parentNode.nodeName === 'SCRIPT' || node.parentNode.nodeName === 'STYLE') {
                    return NodeFilter.FILTER_REJECT;
                }
                return NodeFilter.FILTER_ACCEPT;
            }
        }, false);
        
        const nodesToReplace = [];
        let currentNode = walker.nextNode();
        
        while (currentNode) {
          if (currentNode.nodeValue.match(regex)) {
            nodesToReplace.push(currentNode);
          }
          currentNode = walker.nextNode();
        }

        let totalMatches = 0;

        // Anem al revés per no trencar l'índexs de l'arbre quan afegim múltiples nodes al mateix wrapper
        nodesToReplace.reverse().forEach(node => {
          const text = node.nodeValue;
          const parent = node.parentNode;
          if (!parent) return;

          // Creem un fragment doc per no forçar recàlculs
          const fragment = document.createDocumentFragment();
          let lastIndex = 0;
          let match;

          // Utilitzem regex.exec sobre el mateix text del node
          const localRegex = new RegExp(regex);
          while ((match = localRegex.exec(text)) !== null) {
              // Afegim text previ
              if (match.index > lastIndex) {
                  fragment.appendChild(document.createTextNode(text.substring(lastIndex, match.index)));
              }
              // Afegim marca
              const mark = document.createElement('mark');
              mark.className = 'search-highlight bg-yellow-300 dark:bg-yellow-700 text-black dark:text-white rounded-sm px-0.5 shadow-sm';
              mark.textContent = match[0];
              fragment.appendChild(mark);
              
              lastIndex = localRegex.lastIndex;
              totalMatches++;
          }
          // Afegim text restant
          if (lastIndex < text.length) {
              fragment.appendChild(document.createTextNode(text.substring(lastIndex)));
          }

          parent.replaceChild(fragment, node);
        });

        if (totalMatches === 0) {
          announceToScreenReader(`No s'han trobat resultats per "${query}"`);
          return { found: false, count: 0 };
        }

        // Scroll cap al primer match de dalt a baix
        const firstMark = contentDiv.querySelector('mark.search-highlight');
        if (firstMark) {
            firstMark.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        
        announceToScreenReader(`${totalMatches} resultats trobats per "${query}"`);
        
        return { found: true, count: totalMatches };
      },

      clear: () => {
         if (!containerRef.current) return;
         const contentDiv = containerRef.current.querySelector('.app-cms-content') || containerRef.current;
         const marks = contentDiv.querySelectorAll('.search-highlight');
         marks.forEach(mark => {
            const parent = mark.parentNode;
            if (parent) {
                const textNodes = Array.from(mark.childNodes);
                textNodes.forEach(node => parent.insertBefore(node, mark));
                parent.removeChild(mark);
                parent.normalize();
            }
         });
         announceToScreenReader('Cerca esborrada');
      }
    };
  }, [containerRef]);

  const announceToScreenReader = (message) => {
    let liveRegion = document.getElementById('search-announcer');
    if (!liveRegion) {
        liveRegion = document.createElement('div');
        liveRegion.id = 'search-announcer';
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only'; 
        document.body.appendChild(liveRegion);
    }
    liveRegion.textContent = message;
  };

  return searchEngine;
};

export default useAccessibleSearch;

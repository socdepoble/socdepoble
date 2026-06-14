import { useState, useCallback } from 'react';
const useAccessibleSearch = containerRef => {
  const [matchCount, setMatchCount] = useState(0);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [lastQuery, setLastQuery] = useState('');
  const announceToScreenReader = message => {
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
  const focusMatch = useCallback((index, marks) => {
    marks.forEach((m, i) => {
      if (i === index) {
        m.classList.add('ring-[3px]', 'ring-[#ff6d23]', 'bg-yellow-400', 'dark:bg-yellow-500', 'scale-110');
        m.classList.remove('bg-yellow-300', 'dark:bg-yellow-700');
        m.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      } else {
        m.classList.remove('ring-[3px]', 'ring-[#ff6d23]', 'bg-yellow-400', 'dark:bg-yellow-500', 'scale-110');
        m.classList.add('bg-yellow-300', 'dark:bg-yellow-700');
      }
    });
  }, []);
  const next = useCallback(() => {
    if (matchCount === 0 || !containerRef.current) return;
    const newIndex = (currentMatchIndex + 1) % matchCount;
    setCurrentMatchIndex(newIndex);
    const contentDiv = containerRef.current.querySelector('.app-cms-content') || containerRef.current;
    const marks = contentDiv.querySelectorAll('.search-highlight');
    focusMatch(newIndex, marks);
    announceToScreenReader(`Resultat ${newIndex + 1} de ${matchCount}`);
  }, [currentMatchIndex, matchCount, containerRef, focusMatch]);
  const prev = useCallback(() => {
    if (matchCount === 0 || !containerRef.current) return;
    const newIndex = (currentMatchIndex - 1 + matchCount) % matchCount;
    setCurrentMatchIndex(newIndex);
    const contentDiv = containerRef.current.querySelector('.app-cms-content') || containerRef.current;
    const marks = contentDiv.querySelectorAll('.search-highlight');
    focusMatch(newIndex, marks);
    announceToScreenReader(`Resultat ${newIndex + 1} de ${matchCount}`);
  }, [currentMatchIndex, matchCount, containerRef, focusMatch]);
  const clear = useCallback(() => {
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
    setMatchCount(0);
    setCurrentMatchIndex(0);
    setLastQuery('');
    announceToScreenReader('Cerca esborrada');
  }, [containerRef]);
  const search = useCallback(query => {
    if (!containerRef.current || !query) return {
      found: false,
      count: 0
    };
    if (query === lastQuery && matchCount > 0) {
      next();
      return {
        found: true,
        count: matchCount
      };
    }

    // Si la query és diferent, netegem primer
    clear();
    setLastQuery(query);
    const contentDiv = containerRef.current.querySelector('.app-cms-content') || containerRef.current;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&')})`, 'gi');
    const walker = document.createTreeWalker(contentDiv, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
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
    nodesToReplace.reverse().forEach(node => {
      const text = node.nodeValue;
      const parent = node.parentNode;
      if (!parent) return;
      const fragment = document.createDocumentFragment();
      let lastIndex = 0;
      let match;
      const localRegex = new RegExp(regex);
      while ((match = localRegex.exec(text)) !== null) {
        if (match.index > lastIndex) {
          fragment.appendChild(document.createTextNode(text.substring(lastIndex, match.index)));
        }
        const mark = document.createElement('mark');
        mark.className = 'search-highlight bg-yellow-300 dark:bg-yellow-700 text-black dark:text-white rounded-sm px-0.5 shadow-sm inline-block transition-all duration-300 ease-out';
        mark.textContent = match[0];
        fragment.appendChild(mark);
        lastIndex = localRegex.lastIndex;
        totalMatches++;
      }
      if (lastIndex < text.length) {
        fragment.appendChild(document.createTextNode(text.substring(lastIndex)));
      }
      parent.replaceChild(fragment, node);
    });
    setMatchCount(totalMatches);
    setCurrentMatchIndex(0);
    if (totalMatches === 0) {
      announceToScreenReader(`No s'han trobat resultats per "${query}"`);
      return {
        found: false,
        count: 0
      };
    }
    const newMarks = contentDiv.querySelectorAll('mark.search-highlight');
    if (newMarks.length > 0) {
      focusMatch(0, newMarks);
    }
    announceToScreenReader(`${totalMatches} resultats trobats per "${query}"`);
    return {
      found: true,
      count: totalMatches
    };
  }, [containerRef, lastQuery, matchCount, clear, next, focusMatch]);
  return {
    search,
    clear,
    next,
    prev,
    matchCount,
    currentMatchIndex
  };
};
export default useAccessibleSearch;
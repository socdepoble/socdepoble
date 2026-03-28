import { useSyncExternalStore } from 'react';

// Si no uses Zustand, pots usar la pròpia implementació o instal·lar-lo
// import { shallow } from 'zustand/shallow';

export function shallowEqual(objA, objB) {
  if (Object.is(objA, objB)) return true;
  if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
    return false;
  }
  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);
  if (keysA.length !== keysB.length) return false;
  for (let i = 0; i < keysA.length; i++) {
    if (!Object.prototype.hasOwnProperty.call(objB, keysA[i]) || !Object.is(objA[keysA[i]], objB[keysA[i]])) {
      return false;
    }
  }
  return true;
}

/**
 * Hook blindat per a CRDTs (Yjs/Automerge) per evitar cascades de renders.
 * @param {Object} doc - El document CRDT (Y.Doc o AutomergeDoc)
 * @param {Function} selector - Funció que extreu només les dades necessàries
 * @param {Function} compare - Funció d'igualtat (per defecte shallow equal)
 */
export function useCrdtStore(doc, selector) {
  const getSnapshot = () => {
    if (!doc) return undefined;
    const state = doc.toJSON ? doc.toJSON() : doc; 
    return selector(state);
  };

  const subscribe = (callback) => {
    if (!doc) return () => {};
    // Per a Yjs
    if (typeof doc.on === 'function') {
        const unsub = doc.on('update', callback);
        return () => unsub(); // Si dóna un mètode no compatible amb retornar directament, usem arrow funct
    }
    // Per a Automerge
    // if (Automerge && typeof Automerge.subscribe === 'function') {
    //    const unsub = Automerge.subscribe(doc, callback);
    //    return () => unsub();
    // }
    return () => {};
  };

  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

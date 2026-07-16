// forja_core.js — Reactivitat nativa DOM <- Y.Doc amb un únic rAF coalescut.
// Canvis de fons respecte a la versió anterior:
//   1. bindText filtra per transaction.origin: les edicions locals ('ui') NO es reapliquen al
//      node (el DOM ja les té) -> s'acaba l'eco que podia menjar-se tecles dins del mateix frame.
//      El flag manual applyingDom (que a més mai s'assignava) desapareix: l'origen ho diu tot.
//   2. afterTransaction només re-avalua els bindings COMPUTATS (bindHtml). Abans marcava
//      bruts TOTS els bindings a cada transacció, derogant els observers granulars: O(bindings)
//      per tecla. Ara cada binding de text es desperta només quan el seu ytext canvia.
export class ForjaStore {
  constructor(doc) {
    this.doc = doc;
    this.bindings = new Map();  // node -> apply()
    this.computed = new Set();  // nodes de bindHtml (depenen de tot el doc)
    this.pending = new Set();
    this.raf = 0;
    this.destroyers = [];

    this.onAfterTransaction = () => {
      for (const node of this.computed) this.schedule(node);
    };
    this.doc.on('afterTransaction', this.onAfterTransaction);
  }

  bindText({ node, ytext, render = v => v, localOrigin = 'ui' }) {
    const apply = () => {
      const value = render(ytext.toString());
      if (node.value !== undefined) {
        if (node.value !== value) node.value = value;
      } else if (node.textContent !== value) {
        node.textContent = value;
      }
    };

    const observer = (_event, transaction) => {
      if (transaction.origin === localOrigin) return; // edició local: el DOM és la font
      this.schedule(node);
    };
    ytext.observe(observer);

    this.bindings.set(node, apply);
    this.destroyers.push(() => {
      ytext.unobserve(observer);
      this.bindings.delete(node);
    });

    apply();
    return node;
  }

  bindHtml({ node, compute }) {
    const apply = () => {
      const value = compute();
      if (node.textContent !== value) node.textContent = value;
    };

    this.bindings.set(node, apply);
    this.computed.add(node);
    this.destroyers.push(() => {
      this.bindings.delete(node);
      this.computed.delete(node);
    });

    apply();
    return node;
  }

  schedule(node) {
    this.pending.add(node);
    if (this.raf) return;

    this.raf = requestAnimationFrame(() => {
      this.raf = 0;
      const batch = [...this.pending];
      this.pending.clear();
      for (const n of batch) this.bindings.get(n)?.();
    });
  }

  destroy() {
    if (this.raf) cancelAnimationFrame(this.raf);
    for (const fn of this.destroyers.splice(0)) fn();
    this.pending.clear();
    this.bindings.clear();
    this.computed.clear();
    this.doc.off('afterTransaction', this.onAfterTransaction);
  }
}

export function debounce(fn, ms = 180) {
  let t = 0;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}

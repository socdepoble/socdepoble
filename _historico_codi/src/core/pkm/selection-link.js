/**
 * Extracció pura en Layer-0 de Selection API
 * Immune a Layout Thrashing perquè només fa lectures "Computed" i res d'escriptura AL DOM principal.
 */

function captureSelectionMeta() {
  const sel = window.getSelection();
  if (!sel || sel.isCollapsed || sel.rangeCount === 0) return null;

  const range = sel.getRangeAt(0);
  const text = sel.toString().trim();
  if (!text) return null;

  // Intentem buscar l'origen node parent buscant ràpidament el primigeni closest [id]
  const startEl = range.startContainer.parentElement?.closest?.('[id]') || range.startContainer.parentElement;
  const endEl = range.endContainer.parentElement?.closest?.('[id]') || range.endContainer.parentElement;

  // CRÍTIC: Llei d'alliberament de memòria establerta a la Síntesi 1.3
  sel.removeAllRanges();

  return {
    text,
    startId: startEl?.dataset?.cid || startEl?.id || null,
    endId: endEl?.dataset?.cid || endEl?.id || null,
    bookId: document.querySelector('#reader')?.dataset?.bookId || null,
    createdAt: Date.now()
  };
}

let noteTimer = 0;

export function initSelectionCapture(onSelectionCaptured) {
  if (typeof window === 'undefined') return () => {};

  const handleSelection = () => {
    clearTimeout(noteTimer);
    
    // El debounce de 180ms evita saturar la cua de missatges a l'Event Loop
    noteTimer = setTimeout(() => {
      const meta = captureSelectionMeta();
      if (meta && onSelectionCaptured) {
        onSelectionCaptured(meta);
      }
    }, 180);
  };

  // Passive TRUE és crític en scroll + selecció (a Apple li molesta el contrari)
  document.addEventListener('selectionchange', handleSelection, { passive: true });

  return () => {
    clearTimeout(noteTimer);
    document.removeEventListener('selectionchange', handleSelection);
  };
}

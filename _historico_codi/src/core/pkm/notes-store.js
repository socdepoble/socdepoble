import { get, set } from 'idb-keyval';

const STORE_KEY = 'pkm_notes_v1';
let noteTimer = 0;
let pendingQueue = [];

/**
 * Patró eficient per dispositius Legacy.
 * Només colpeja IDB en un debounce netejat per evitar micro-penjades en UI.
 */
export function queueSaveNote(note) {
  if (!note || !note.text) return;

  // Afegim a cua
  pendingQueue.push(note);
  
  clearTimeout(noteTimer);
  noteTimer = setTimeout(async () => {
    if (pendingQueue.length === 0) return;
    
    // Clon ràpid immutable
    const toSave = [...pendingQueue];
    pendingQueue = [];
    
    try {
      const existing = await get(STORE_KEY) || [];
      await set(STORE_KEY, [...existing, ...toSave]);
      console.log(`[PKM Store] Bolean Batch Guardat: ${toSave.length} notes.`);
    } catch (err) {
      console.error('[PKM Store] Error al persistir localment:', err);
      // Revertim cua en cas extrem (tot i que en l'A10 això hauria de ser roca)
      pendingQueue = [...toSave, ...pendingQueue];
    }
  }, 180); // Debounce òptim extret del Matrix Audit
}

export async function fetchAllNotes() {
    return await get(STORE_KEY) || [];
}

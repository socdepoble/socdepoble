// idbStore.js - tiny promise wrapper, no deps + supabase for syncing
import { supabase } from '../../core/supabaseClient';

const DB_NAME = 'unified-editor-db';
const STORE = 'documents';
const VERSION = 1;

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE, { keyPath: 'id' });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function saveDocument(id, doc) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).put({ ...doc, id });
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  });
}

export async function loadDocument(id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly');
    const req = tx.objectStore(STORE).get(id);
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => reject(req.error);
  });
}

export async function deleteDocument(id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).delete(id);
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  });
}

export async function syncDocument(id) {
  const doc = await loadDocument(id);
  if (!doc) return false;
  
  try {
    const slug = `/p/${doc.id}`;
    // Construïm l'HTML concatenant els blocs guardats localment
    const htmlExport = doc.blocks.map(b => `<h2>${b.title}</h2>\n\n${b.content}`).join('<br/><br/>');
    
    // Pugem directament a cms_pages (lògica de CMS per als Textareas fragmentats)
    const { error } = await supabase.from('cms_pages').upsert({
      slug: slug,
      title: doc.meta.title || 'Sense Títol',
      subtitle: 'Publicat des del Unified Editor (Motor A10)',
      html_content: htmlExport,
      status: 'published',
      updated_at: new Date().toISOString()
    }, { onConflict: 'slug' });

    if (error) {
      console.error('Error sincronitzant a Supabase:', error.message);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Excepció durant la sincronització:', error);
    return false;
  }
}

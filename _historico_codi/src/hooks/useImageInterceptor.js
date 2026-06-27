import { useCallback, useRef } from 'react';

/* ---------- Config / Limits ---------- */
const DB_NAME = 'unified-editor-db';
const DB_VERSION = 1;
const ASSET_STORE = 'assets';
const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5MB safe default for A10

/* ---------- IndexedDB helper to save asset ---------- */
async function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(ASSET_STORE)) {
        db.createObjectStore(ASSET_STORE, { keyPath: 'cid' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function genCid() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return `img-${crypto.randomUUID()}`;
  return `img-${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
}

export async function saveImageToBancalDB({ blob, filename, mime }) {
  if (!blob) throw new Error('No blob provided');
  const cid = genCid();
  const record = {
    cid,
    filename: filename || cid,
    mime: mime || (blob && blob.type) || 'application/octet-stream',
    blob,
    createdAt: Date.now()
  };
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(ASSET_STORE, 'readwrite');
    const store = tx.objectStore(ASSET_STORE);
    const req = store.put(record);
    req.onsuccess = () => resolve({ cid, filename: record.filename, mime: record.mime });
    req.onerror = () => reject(req.error);
  });
}

/* ---------- Utility: blob/file extraction ---------- */
function extractImageFileFromDataTransfer(dt) {
  if (!dt) return null;
  // Prefer files list
  if (dt.files && dt.files.length) {
    for (let i = 0; i < dt.files.length; i++) {
      const f = dt.files[i];
      if (f && f.type && f.type.startsWith('image/')) return f;
    }
  }
  // Fallback: items (Chrome) may contain 'image/png' as blob
  if (dt.items && dt.items.length) {
    for (let i = 0; i < dt.items.length; i++) {
      const it = dt.items[i];
      if (it.kind === 'file' && it.type && it.type.startsWith('image/')) {
        const file = it.getAsFile();
        if (file) return file;
      }
    }
  }
  return null;
}

function extractImageFromClipboardEvent(ev) {
  if (!ev.clipboardData) return null;
  const items = ev.clipboardData.items;
  if (!items) return null;
  for (let i = 0; i < items.length; i++) {
    const it = items[i];
    if (it.kind === 'file' && it.type && it.type.startsWith('image/')) {
      return it.getAsFile();
    }
    // Some browsers expose image/png in types and require getData('image/png') -> blob not supported widely
  }
  return null;
}

/* ---------- Utility: insert markdown at cursor (textarea) ---------- */
export function insertAtCursor(textarea, text) {
  if (!textarea) return;
  const start = textarea.selectionStart || 0;
  const end = textarea.selectionEnd || 0;
  const value = textarea.value || '';
  const newValue = value.slice(0, start) + text + value.slice(end);
  textarea.value = newValue;
  // move cursor after inserted text
  const pos = start + text.length;
  textarea.setSelectionRange(pos, pos);
  // trigger input events so React controlled components can pick up change
  const ev = new Event('input', { bubbles: true });
  textarea.dispatchEvent(ev);
}

/* ---------- Hook: useImageInterceptor ---------- */
export default function useImageInterceptor({ docId, insertToTextarea, maxBytes = MAX_IMAGE_BYTES, onError } = {}) {
  // insertToTextarea(md) -> user-provided function to insert markdown into textarea (should handle controlled inputs)
  // onError(err) optional

  const queueRef = useRef(Promise.resolve()); // serializes saves to avoid concurrent heavy ops

  const handleFile = useCallback(async (file) => {
    if (!file) return null;
    try {
      // quick validations
      if (!file.type || !file.type.startsWith('image/')) throw new Error('No image file');
      if (file.size > maxBytes) throw new Error(`Image too large (${Math.round(file.size/1024)} KB)`);
      // schedule save in queue to avoid parallel heavy work on A10
      const result = await (queueRef.current = queueRef.current.then(async () => {
        // Use requestIdleCallback if available to defer heavy IO
        await new Promise((res) => {
          if (typeof requestIdleCallback !== 'undefined') {
            (window.requestIdleCallback || function(cb) { setTimeout(() => cb({ timeRemaining: () => 50 }), 1) })(() => res(), { timeout: 500 });
          } else {
            // small timeout to yield
            setTimeout(res, 50);
          }
        });
        // Save blob directly (no conversion to base64 here)
        const blob = file instanceof Blob ? file : new Blob([file], { type: file.type });
        const saved = await saveImageToBancalDB({ blob, filename: file.name, mime: file.type });
        return saved;
      }));
      return result;
    } catch (err) {
      if (typeof onError === 'function') onError(err);
      return null;
    }
  }, [maxBytes, onError]);

  const handleDrop = useCallback(async (ev) => {
    try {
      ev.preventDefault();
      ev.stopPropagation();
      const file = extractImageFileFromDataTransfer(ev.dataTransfer);
      if (!file) return;
      const saved = await handleFile(file);
      if (!saved) return;
      const md = `![${saved.filename}](cid:${saved.cid})`;
      if (typeof insertToTextarea === 'function') insertToTextarea(md);
    } catch (err) {
      if (typeof onError === 'function') onError(err);
    }
  }, [handleFile, insertToTextarea, onError]);

  const handlePaste = useCallback(async (ev) => {
    try {
      const file = extractImageFromClipboardEvent(ev);
      if (!file) return;
      // Prevent default paste of image into DOM
      ev.preventDefault();
      ev.stopPropagation();
      const saved = await handleFile(file);
      if (!saved) return;
      const md = `![${saved.filename}](cid:${saved.cid})`;
      if (typeof insertToTextarea === 'function') insertToTextarea(md);
    } catch (err) {
      if (typeof onError === 'function') onError(err);
    }
  }, [handleFile, insertToTextarea, onError]);

  const handleDragOver = useCallback((ev) => {
    ev.preventDefault();
    ev.dataTransfer.dropEffect = 'copy';
  }, []);

  // Expose handlers to spread on container
  const handlers = {
    onDrop: handleDrop,
    onPaste: handlePaste,
    onDragOver: handleDragOver
  };

  return { handlers };
}

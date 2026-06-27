/* 
   MÒDUL ARQUITECTURA A10 - Paginador i PKM en Vanilla JS
   Exportacions directes des de l'estudi del motor WebKit i la gestió eficient sense reflow.
*/

/**
 * Paginador per CSS Columns (iPad A10 friendly)
 * Clona el node de contingut fora del render principal (offscreen), 
 * l'aplica els estils i mesura el seu amplària total per calcular les pàgines, 
 * aconseguint així que el nombre total de pàgines no modifique l'usuari ni puga ocasionar layout thrashing.
 */
export function createColumnsPaginator({ container, content, onPages }) {
  if (!container || !content) throw new Error('container i content requerits');

  let lastPages = null;
  let rafId = null;
  let idleId = null;
  let destroyed = false;

  const rIC = window.requestIdleCallback || function (cb) { return setTimeout(() => cb({ timeRemaining: () => 50 }), 200); };
  const cancelRIC = window.cancelIdleCallback || function (id) { clearTimeout(id); };

  function copyComputedStyles(src, dest) {
    const cs = window.getComputedStyle(src);
    for (let i = 0; i < cs.length; i++) {
        const prop = cs[i];
        try { dest.style.setProperty(prop, cs.getPropertyValue(prop), cs.getPropertyPriority(prop)); } catch (e) { /* ignore invalid properties */ }
    }
  }

  function createHiddenClone() {
    const clone = content.cloneNode(true);
    // wrapper per mantenir les constriccions de format del pare original
    const wrapper = document.createElement('div');
    wrapper.setAttribute('aria-hidden', 'true');
    wrapper.style.position = 'fixed';
    wrapper.style.left = '-9999px';
    wrapper.style.top = '0';
    wrapper.style.width = container.clientWidth + 'px';
    wrapper.style.height = container.clientHeight + 'px';
    wrapper.style.overflow = 'visible';
    wrapper.style.visibility = 'hidden';
    wrapper.style.pointerEvents = 'none';
    wrapper.style.zIndex = '-1';
    
    // es copien els estils bàsics computats
    copyComputedStyles(content, clone);
    copyComputedStyles(container, wrapper);
    
    wrapper.appendChild(clone);
    document.documentElement.appendChild(wrapper);
    return { wrapper, clone };
  }

  function measureOnce() {
    if (destroyed) return;
    const { wrapper, clone } = createHiddenClone();
    
    const totalWidth = clone.scrollWidth;
    const viewportWidth = container.clientWidth || container.getBoundingClientRect().width || window.innerWidth;
    const pages = Math.max(1, Math.ceil(totalWidth / viewportWidth));
    
    wrapper.remove();
    return pages;
  }

  function scheduleMeasure() {
    if (destroyed) return;
    if (idleId != null) { cancelRIC(idleId); idleId = null; }
    
    idleId = rIC(() => {
        // Enforça layout de mesura al frame adequat
        rafId = requestAnimationFrame(() => {
            try {
                const pages = measureOnce();
                if (pages !== lastPages) {
                    lastPages = pages;
                    if (typeof onPages === 'function') onPages(pages);
                }
            } catch (e) {
                console.error('Paginator measure error', e);
            } finally {
                rafId = null;
                idleId = null;
            }
        });
    });
  }

  let resizeTimer = null;
  function onResize() {
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(scheduleMeasure, 120);
  }

  const mo = new MutationObserver(() => scheduleMeasure());
  mo.observe(content, { childList: true, subtree: true, characterData: true, attributes: true });

  window.addEventListener('resize', onResize, { passive: true });

  return {
    measure: scheduleMeasure,
    getPages: () => lastPages,
    destroy() {
      destroyed = true;
      mo.disconnect();
      window.removeEventListener('resize', onResize);
      if (idleId != null) cancelRIC(idleId);
      if (rafId != null) cancelAnimationFrame(rafId);
    }
  };
}

/**
 * Gestor PKM totalment aïllat sense re-renderitzar DOM
 * Operacions i consultes de base de dades local mitjançant un apartat minimalista 
 * i completament "contained".
 */
export function createPKM({ mountPoint = document.body } = {}) {
  const DB_NAME = 'soc-de-poble-pkm';
  const DB_VERSION = 1;
  const STORE = 'notes';
  let db = null;

  function openDB() {
    return new Promise((resolve, reject) => {
      if (db) return resolve(db);
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = (e) => {
        const idb = e.target.result;
        if (!idb.objectStoreNames.contains(STORE)) {
          const os = idb.createObjectStore(STORE, { keyPath: 'id' });
          os.createIndex('updatedAt', 'updatedAt', { unique: false });
        }
      };
      req.onsuccess = () => { db = req.result; resolve(db); };
      req.onerror = () => reject(req.error);
    });
  }

  function idbTx(storeName, mode = 'readonly') {
    return openDB().then((db) => {
      const tx = db.transaction(storeName, mode);
      const store = tx.objectStore(storeName);
      return { tx, store, done: new Promise((res, rej) => { tx.oncomplete = () => res(); tx.onerror = () => rej(tx.error); }) };
    });
  }

  async function saveNote(note) {
    const { store } = await idbTx(STORE, 'readwrite');
    store.put(note);
  }

  async function getAllNotes() {
    const { store } = await idbTx(STORE, 'readonly');
    return new Promise((resolve, reject) => {
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  async function deleteNote(id) {
    const { store } = await idbTx(STORE, 'readwrite');
    store.delete(id);
  }

  function cssPath(el) {
    if (!el || el.nodeType !== 1) return '';
    const parts = [];
    while (el && el.nodeType === 1 && el !== document.documentElement) {
      let part = el.tagName.toLowerCase();
      if (el.id) {
        part += '#' + el.id;
        parts.unshift(part);
        break;
      } else {
        const sibs = Array.from(el.parentNode ? el.parentNode.children : []);
        const sameTag = sibs.filter(s => s.tagName === el.tagName);
        if (sameTag.length > 1) {
          const idx = sameTag.indexOf(el) + 1;
          part += `:nth-of-type(${idx})`;
        }
      }
      parts.unshift(part);
      el = el.parentNode;
    }
    return parts.join(' > ');
  }

  const aside = document.createElement('aside');
  aside.className = 'sdpp-pkm';
  aside.setAttribute('role', 'complementary');
  // Styling isolation ensuring ZERO reflow on main thread parsing
  aside.style.cssText = [
    'position:fixed',
    'right:0',
    'top:0',
    'height:100vh',
    'width:360px',
    'max-width:40vw',
    'background:rgba(255,255,255,0.98)',
    'box-shadow:-6px 0 18px rgba(0,0,0,0.12)',
    'z-index:99999',
    'contain:strict',  // Més important de tot
    'overflow:auto',
    'padding:16px',
    'font-family:system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    'display:none',
    'transition:transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
    'backdrop-filter: blur(10px)'
  ].join(';');

  aside.innerHTML = `
    <div class="sdpp-header" style="display:flex;gap:8px;align-items:center;justify-content:space-between">
      <strong style="color:var(--titol-fort); font-size:18px;">Els Meus Apunts</strong>
      <div style="display:flex;gap:6px">
        <button class="sdpp-new" style="background:var(--accent);color:#fff;border:none;padding:6px 12px;border-radius:6px;cursor:pointer;">Capturar</button>
        <button class="sdpp-close" style="background:#eee;border:none;padding:6px 12px;border-radius:6px;cursor:pointer;">Amagar</button>
      </div>
    </div>
    <div class="sdpp-list" style="margin-top:16px; display:flex; flex-direction:column; gap:8px;"></div>
    
    <div class="sdpp-editor" style="margin-top:16px;display:none; background:#f9f9f9; padding:12px; border-radius:8px;">
      <textarea class="sdpp-text" rows="6" style="width:100%;box-sizing:border-box; border:1px solid #ddd; border-radius:4px; padding:8px; font-family:inherit;"></textarea>
      <div style="display:flex;gap:8px;margin-top:8px">
        <button class="sdpp-save" style="background:var(--accent);color:#fff;border:none;padding:6px 12px;border-radius:6px;cursor:pointer;">Desa i Protegeix</button>
        <button class="sdpp-cancel" style="background:transparent;border:1px solid #ccc;padding:6px 12px;border-radius:6px;cursor:pointer;">Rebutjar</button>
      </div>
    </div>
    
    <div style="font-size:12px;color:#888;margin-top:20px; line-height:1.4;">
      <em>Sóc de Poble Arquitectura:</em> Marca un text de la pàgina i prem <strong>Capturar</strong> per arxivar-lo offline independentment del formatatge complet de lectura.
    </div>
  `;

  mountPoint.appendChild(aside);

  const btnNew = aside.querySelector('.sdpp-new');
  const btnClose = aside.querySelector('.sdpp-close');
  const listEl = aside.querySelector('.sdpp-list');
  const editor = aside.querySelector('.sdpp-editor');
  const textarea = aside.querySelector('.sdpp-text');
  const btnSave = aside.querySelector('.sdpp-save');
  const btnCancel = aside.querySelector('.sdpp-cancel');

  let editingId = null;
  let notesCache = [];
  let saveDebounceTimer = null;

  function renderList() {
    listEl.innerHTML = '';
    notesCache.sort((a,b) => b.updatedAt - a.updatedAt);
    if(notesCache.length === 0){
        listEl.innerHTML = '<div style="color:#aaa; font-size:14px; text-align:center; padding: 20px;">L\'arxiu és buit.</div>';
        return;
    }
    for (const n of notesCache) {
      const item = document.createElement('div');
      item.style.cssText = 'padding:12px; background:#fff; border:1px solid #eee; border-radius:8px; display:flex; justify-content:space-between; align-items:flex-start; gap:8px';
      
      const left = document.createElement('div');
      left.style.flex = '1';
      left.innerHTML = `<div style="font-size:14px;color:#111; line-height:1.4;">${escapeHtml(n.text.slice(0,100))}${n.text.length > 100 ? '...' : ''}</div>
                        <div style="font-size:11px;color:#666;margin-top:6px">${new Date(n.updatedAt).toLocaleDateString()}</div>`;
      
      const actions = document.createElement('div');
      actions.style.display = 'flex';
      actions.style.flexDirection = 'column';
      actions.style.gap = '6px';
      
      const openBtn = document.createElement('button');
      openBtn.textContent = 'Editar';
      openBtn.style.cssText = "font-size:11px; padding:4px 8px; border:1px solid #ddd; background:#fafafa; border-radius:4px; cursor:pointer;";
      openBtn.onclick = () => openEditor(n);
      
      const delBtn = document.createElement('button');
      delBtn.textContent = 'Esborrar';
      delBtn.style.cssText = "font-size:11px; padding:4px 8px; border:1px solid #ffcccc; background:#fffbfb; color:#d00; border-radius:4px; cursor:pointer;";
      delBtn.onclick = async () => {
        await deleteNote(n.id);
        notesCache = notesCache.filter(x => x.id !== n.id);
        renderList();
      };
      
      actions.appendChild(openBtn);
      actions.appendChild(delBtn);
      item.appendChild(left);
      item.appendChild(actions);
      listEl.appendChild(item);
    }
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (m) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  }

  function openEditor(note) {
    editingId = note.id;
    textarea.value = note.text;
    editor.style.display = 'block';
    textarea.focus();
  }

  function closeEditor() {
    editingId = null;
    textarea.value = '';
    editor.style.display = 'none';
  }

  async function loadNotes() {
    notesCache = await getAllNotes();
    renderList();
  }

  function scheduleSave(note) {
    if (saveDebounceTimer) clearTimeout(saveDebounceTimer);
    saveDebounceTimer = setTimeout(async () => {
      await saveNote(note);
      const idx = notesCache.findIndex(n => n.id === note.id);
      if (idx >= 0) notesCache[idx] = note; else notesCache.push(note);
      renderList();
      saveDebounceTimer = null;
    }, 250);
  }

  function createNoteFromSelection() {
    const sel = window.getSelection();
    const text = sel && sel.toString().trim();
    if (!text) {
      return { text: '', contextSelector: '' };
    }
    const range = sel.getRangeAt(0);
    let ancestor = range.commonAncestorContainer;
    if (ancestor.nodeType === 3) ancestor = ancestor.parentNode;
    const selector = cssPath(ancestor);
    return { text, contextSelector: selector };
  }

  btnNew.addEventListener('click', async () => {
    const { text, contextSelector } = createNoteFromSelection();
    const id = Date.now() + '-' + Math.floor(Math.random() * 1000);
    const note = { id, text, contextSelector, createdAt: Date.now(), updatedAt: Date.now() };
    editingId = id;
    textarea.value = text;
    editor.style.display = 'block';
    textarea.focus();
    notesCache.unshift(note);
    renderList();
  });

  btnSave.addEventListener('click', async () => {
    const text = textarea.value.trim();
    if (!editingId) return;
    const existing = notesCache.find(n => n.id === editingId) || { id: editingId, createdAt: Date.now() };
    const note = Object.assign({}, existing, { text, updatedAt: Date.now() });
    scheduleSave(note);
    closeEditor();
  });

  btnCancel.addEventListener('click', () => { closeEditor(); });

  btnClose.addEventListener('click', () => { aside.style.display = 'none'; });

  return {
    async open() {
      aside.style.display = 'block';
      await openDB();
      await loadNotes();
    },
    close() { aside.style.display = 'none'; },
    async exportAll() {
      await openDB();
      return await getAllNotes();
    },
    async destroy() {
      aside.remove();
    }
  };
}

// app.js — Arrancada de la Forja. Canvis de fons:
//   1. Commit per DIFF (prefix/sufix comú), no delete-all + insert-all: cada update pesa
//      proporcional a la tecleta, no al document. Menys làpides, menys bytes al .ylog.
//   2. CAP destroy en events de cicle de vida. beforeunload no és fiable en iOS i, pitjor,
//      si la pàgina torna del bfcache després d'un destroy, queda una app zombi que no guarda
//      res en silenci. Es flusheja en 'hidden' (senyal fiable iOS) i pagehide (propina).
//   3. El flag applyingDom (codi mort) desapareix: l'eco es talla per origin al ForjaStore.
import * as Y from 'yjs';
import { createOpfsProvider } from './opfs_provider.js';
import { ForjaStore, debounce } from './forja_core.js';

const $ = id => document.getElementById(id);

const doc = new Y.Doc({ gc: true });
const note = doc.getText('nota');

let provider;
let store;

const ui = {
  nota: $('nota'),
  guardar: $('guardar'),
  estat: $('estat'),
  metrica: $('metrica')
};

function status(text) {
  ui.estat.textContent = text;
}

function commitDiff(ytext, next) {
  const prev = ytext.toString();
  if (prev === next) return;
  let s = 0;
  const min = Math.min(prev.length, next.length);
  while (s < min && prev[s] === next[s]) s++;
  let pe = prev.length;
  let ne = next.length;
  while (pe > s && ne > s && prev[pe - 1] === next[ne - 1]) { pe--; ne--; }
  doc.transact(() => {
    if (pe > s) ytext.delete(s, pe - s);
    if (ne > s) ytext.insert(s, next.slice(s, ne));
  }, 'ui');
}

const commitInput = debounce(() => commitDiff(note, ui.nota.value), 180);

async function boot() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }

  provider = createOpfsProvider(doc, {
    fileName: 'forja-nota.ylog',
    flushMs: 700,
    compactBytes: 4 * 1024 * 1024
  });

  provider.addEventListener('ready', e => status(`Llest. ${e.detail.bytes} bytes locals.`));
  provider.addEventListener('flush', () => status('Guardat localment.'));
  provider.addEventListener('compact', () => status('Memòria compactada.'));
  provider.addEventListener('repair', e => status(`Registre reparat (${e.detail.from} → ${e.detail.to} bytes).`));
  provider.addEventListener('error', e => status(`Error local: ${e.detail.error}`));

  await provider.open();

  store = new ForjaStore(doc);
  store.bindText({ node: ui.nota, ytext: note, localOrigin: 'ui' });
  store.bindHtml({ node: ui.metrica, compute: () => `${note.length} caràcters` });

  ui.nota.addEventListener('input', commitInput, { passive: true });

  ui.guardar.addEventListener('click', async () => {
    ui.guardar.disabled = true;
    try {
      commitDiff(note, ui.nota.value);
      await provider.flush();
      status('Guardat.');
    } catch (err) {
      status(`No s'ha pogut guardar: ${err.message}`);
    } finally {
      ui.guardar.disabled = false;
    }
  });

  // Cicle de vida iOS: 'hidden' és el senyal fiable; pagehide és best-effort. Mai destruir ací.
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') provider.flush().catch(() => {});
  });
  window.addEventListener('pagehide', () => {
    provider.flush().catch(() => {});
  });
  window.addEventListener('pageshow', e => {
    if (e.persisted) status('Llest.'); // tornem del bfcache amb provider i store vius
  });
}

boot().catch(err => {
  status(`No s'ha pogut iniciar: ${err.message}`);
});

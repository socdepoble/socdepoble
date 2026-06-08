// /public/loop-breaker.js
// AQUEST SCRIPT HA DE SER EL PRIMER EN CARREGAR-SE. Síncron, inline o <script src> en <head>.
(function() {
  'use strict';

  const STORAGE_KEY = 'SP_LOOP_BREAKER';
  const WINDOW_KEY = '__SP_LOOP_BREAKER__';
  const MAX_RELOADS = 2;        // Màxim 2 recàrregues en 10 segons
  const WINDOW_MS = 10000;      // Finestra temporal de 10 segons
  const COOLDOWN_MS = 60000;    // Si es dispara el fre, bloquejar recàrregues durant 60 segons

  // ─── 1. LLEGIR HISTORIAL DE RECÀRREGUES ───
  function getHistory() {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function saveHistory(entries) {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch (e) {
      // sessionStorage pot estar ple o bloquejat
    }
  }

  // --- Salconduit de Recàrrega Legítima (Consell Gemini & Perplexity) ---
  if (
    sessionStorage.getItem('updateInProgress') === 'true' ||
    window.location.search.includes('_v=') ||
    window.location.search.includes('_nuclear=')
  ) {
    sessionStorage.removeItem('updateInProgress');
    sessionStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(STORAGE_KEY + '_cooldown');
    return; // Avortem el bloqueig, deixem que arranque fresc
  }

  const now = Date.now();
  let history = getHistory().filter((t) => now - t < WINDOW_MS);
  history.push(now);
  saveHistory(history);

  // ─── 2. DETECTAR BUCLE ───
  const isLooping = history.length > MAX_RELOADS;
  const isInCooldown = (() => {
    try {
      const cooldown = sessionStorage.getItem(STORAGE_KEY + '_cooldown');
      return cooldown && (now - parseInt(cooldown, 10)) < COOLDOWN_MS;
    } catch (e) { return false; }
  })();

  // ─── 3. SI ESTEM EN BUCLE: MOSTRAR EMERGENCY SHELL I BLOQUEJAR TOT ───
  if (isLooping || isInCooldown) {
    // Activar cooldown
    try { sessionStorage.setItem(STORAGE_KEY + '_cooldown', now.toString()); } catch (e) { /* silent fail */ }

    // Destruir tot el DOM existent immediatament i injectar l'HTML de supervivència
    // ─── DEFINICIÓ DE FUNCIONS DE RECUPERACIÓ ───
    window.__sp_force_reload = function() {
      sessionStorage.removeItem(STORAGE_KEY);
      sessionStorage.removeItem(STORAGE_KEY + '_cooldown');
      window.location.reload(true);
    };
    window.__sp_nuclear_purge = function() {
      sessionStorage.clear();
      localStorage.clear();
      
      // Esborrar IndexedDB (idb-keyval)
      try {
          indexedDB.deleteDatabase('keyval-store');
      } catch(e) {}

      if ('caches' in window) {
        caches.keys().then(function(keys) {
          return Promise.all(keys.map(function(k) { return caches.delete(k); }));
        }).then(function() {
          window.location.reload(true);
        });
      } else {
        window.location.reload(true);
      }
    };

    document.documentElement.innerHTML = `
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sóc de Poble — Mode Supervivència</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #1a1a2e; color: #eee;
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      min-height: 100vh; padding: 2rem; text-align: center;
    }
    .icon { font-size: 4rem; margin-bottom: 1rem; }
    h1 { font-size: 1.5rem; margin-bottom: 0.5rem; color: #e94560; }
    p { font-size: 1rem; line-height: 1.6; max-width: 400px; margin-bottom: 1.5rem; }
    .btn {
      display: block; width: 100%; max-width: 300px;
      padding: 1rem; margin: 0.5rem 0;
      border: none; border-radius: 8px;
      font-size: 1rem; cursor: pointer;
      text-decoration: none;
    }
    .btn-primary { background: #e94560; color: white; }
    .btn-secondary { background: #16213e; color: #a0a0a0; border: 1px solid #0f3460; }
    .info { margin-top: 2rem; font-size: 0.75rem; color: #666; }
  </style>
</head>
<body>
  <div class="icon">🛡️</div>
  <h1>El sistema ha detectat un bucle</h1>
  <p>
    L'aplicació ha intentat recarregar massa ràpid per a protegir la teua informació.
    Açò sol passar en Chrome d'iPad quan la memòria cau està en transició.
  </p>
  <button class="btn btn-primary" onclick="window.__sp_force_reload()">
    🔄 Intentar Recàrrega Manual
  </button>
  <button class="btn btn-secondary" onclick="window.__sp_nuclear_purge()">
    ⚠️ Purga Nuclear Completa
  </button>
  <p class="info">
    Sóc de Poble · Mode Supervivència<br>
    Si el problema persisteix, borra les dades del lloc web.
  </p>
</body>`;

    // BLOQUEJAR TOT: Service Workers, timers, etc.
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(function(regs) {
        regs.forEach(function(r) { r.unregister(); });
      });
    }
    // Parar qualsevol timer o interval que puga haver quedat
    for (let i = 1; i < 9999; i++) { clearTimeout(i); clearInterval(i); }

    // Aturar l'execució de qualsevol altre script
    throw new Error('SP_LOOP_BREAKER_TRIGGERED: Bucle detectat. Aplicació aturada.');
  }

  // ─── 4. API GLOBAL PER A ALTRES SISTEMES ───
  window[WINDOW_KEY] = {
    isLooping: function() {
      const h = getHistory().filter((t) => Date.now() - t < WINDOW_MS);
      return h.length > MAX_RELOADS;
    },
    getHistory: getHistory,
    clearHistory: function() {
      sessionStorage.removeItem(STORAGE_KEY);
      sessionStorage.removeItem(STORAGE_KEY + '_cooldown');
    }
  };

  console.log('[LoopBreaker] Actiu. Recàrregues recents:', history.length);
})();

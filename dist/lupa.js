(function() {
  'use strict';

  const STORAGE_KEY = 'pedra-seca-lupa';
  const FALLBACK_STORAGE = sessionStorage; // Si localStorage està bloquejat (mode privat iOS)
  const EVENT_NAME = 'pedra-seca-lupa-change';
  const DEBOUNCE_MS = 200;
  const SCALE_ACTIVE = 1.18; // 1.18 segons Copilot
  const SCALE_BASE = 1;

  let debounceTimer = null;

  // ─────────────────────────────────────────
  // 1. APLICACIÓ SÍNCRONA IMMEDIATA (Anti-Flash)
  // ─────────────────────────────────────────
  function readStorage() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      try {
        return sessionStorage.getItem(STORAGE_KEY);
      } catch (e2) {
        return null;
      }
    }
  }

  function applyImmediately() {
    const stored = readStorage();
    const isActive = stored === 'active';

    if (isActive) {
      document.documentElement.classList.add('lupa--active');
      document.documentElement.style.setProperty('--lupa-scale', String(SCALE_ACTIVE));
    } else {
      document.documentElement.classList.remove('lupa--active');
      document.documentElement.style.setProperty('--lupa-scale', String(SCALE_BASE));
    }
    return isActive;
  }

  // Apliquem ABANS que el parser continue (bloquejant però essencial)
  const initialState = applyImmediately();

  // ─────────────────────────────────────────
  // 2. PERSISTÈNCIA AMB DEBOUNCE (Canvis en calent)
  // ─────────────────────────────────────────
  function persistState(active) {
    const value = active ? 'active' : null;
    try {
      if (value) {
        localStorage.setItem(STORAGE_KEY, value);
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (e) {
      // Fallback a sessionStorage si localStorage està ple o bloquejat
      try {
        if (value) {
          sessionStorage.setItem(STORAGE_KEY, value);
        } else {
          sessionStorage.removeItem(STORAGE_KEY);
        }
      } catch (e2) {
        // Silenci: l'usuari té storage bloquejat. L'experiència continua.
      }
    }
  }

  function setLupaState(active) {
    // CRÍTIC: Debounce per a evitar escriptures massives si l'usuari
    // fa toggle ràpidament (accessibilitat motora).
    clearTimeout(debounceTimer);
    
    debounceTimer = setTimeout(() => {
      const wasActive = document.documentElement.classList.contains('lupa--active');
      
      if (active === wasActive) return; // No fer res si no ha canviat

      document.documentElement.classList.toggle('lupa--active', active);
      document.documentElement.style.setProperty(
        '--lupa-scale', 
        active ? String(SCALE_ACTIVE) : String(SCALE_BASE)
      );

      persistState(active);

      // CRÍTIC: Disparar l'esdeveniment NOMÉS després d'aplicar els estils,
      // i en el SEGÜENT frame per a evitar que els listeners forcen reflows síncrons.
      requestAnimationFrame(() => {
        window.dispatchEvent(new CustomEvent(EVENT_NAME, {
          detail: {
            active,
            scale: active ? SCALE_ACTIVE : SCALE_BASE,
            timestamp: Date.now(),
          },
          bubbles: false, // No cal que bubleje; és global
        }));
      });
    }, DEBOUNCE_MS);
  }

  // ─────────────────────────────────────────
  // 3. API GLOBAL (Per a botons de toggle)
  // ─────────────────────────────────────────
  window.PedraSecaLupa = {
    toggle: function() {
      const next = !document.documentElement.classList.contains('lupa--active');
      setLupaState(next);
      return next;
    },
    set: function(active) {
      setLupaState(!!active);
    },
    isActive: function() {
      return document.documentElement.classList.contains('lupa--active');
    },
    /**
     * ATENCIÓ: Aquesta funció usa getComputedStyle i està PROHIBIDA
     * en el camí crític del render. Només per a debugging o inicialització
     * de components que necessiten l'escala en mount (evitar si és possible).
     */
    getScale: function() {
      try {
        const val = getComputedStyle(document.documentElement).getPropertyValue('--lupa-scale');
        return parseFloat(val) || SCALE_BASE;
      } catch (e) {
        return SCALE_BASE;
      }
    }
  };

  // ─────────────────────────────────────────
  // 4. ESCOLTADOR DE SISTEMA (Prefers-reduced-motion)
  // ─────────────────────────────────────────
  // Si l'usuari del sistema demana menys moviment, matar transicions
  // quan s'activa la lupa (evita mareigs en escalats bruscos).
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (motionQuery.matches && initialState) {
    document.documentElement.style.setProperty('transition', 'none', 'important');
  }

})();

/**
 * errorRecovery.ts
 * Gestió centralitzada d'errors, polítiques de reintents i utilitats de recuperació.
 * Consell de la Petorreta - Arquitectura Antifràgil 10/10
 */

// 1. safeAsync: Embolcall per executar asíncronament amb fallback segur i reintents
export const safeAsync = async <T>(
  fn: () => Promise<T>,
  fallback: T,
  retries = 2,
  baseDelay = 800
): Promise<T> => {
  for (let i = 0; i <= retries; i++) {
    try {
      return await fn();
    } catch (e) {
      if (i === retries) {
        console.warn('[errorRecovery] safeAsync fallit després de tots els reintents. Retornant fallback.', e);
        return fallback;
      }
      const delay = baseDelay * Math.pow(2, i);
      console.info(`[errorRecovery] Reintentant operació (${i + 1}/${retries}) en ${delay}ms...`);
      await new Promise(r => setTimeout(r, delay));
    }
  }
  return fallback;
};

// 2. withRetry: Embolcall per funcions que necessiten backoff exponencial però sense fallback (llancen error al final)
export const withRetry = async <T>(
  fn: () => Promise<T>,
  retries = 3,
  baseDelay = 1000
): Promise<T> => {
  for (let i = 0; i <= retries; i++) {
    try {
      return await fn();
    } catch (e) {
      if (i === retries) {
        console.error('[errorRecovery] withRetry fallit totalment.', e);
        throw e;
      }
      const delay = baseDelay * Math.pow(2, i);
      await new Promise(r => setTimeout(r, delay));
    }
  }
  throw new Error('Unreachable code in withRetry');
};

// 3. handleNetworkError: Gestiona caigudes de xarxa i canvia a Mode Bancal si cal
export const handleNetworkError = () => {
  console.warn('[errorRecovery] Error de Xarxa detectat.');
  if (typeof document !== 'undefined') {
    // Activa visualment el "Mode Bancal"
    document.documentElement.style.setProperty('--mode-bancal', '1');
    document.documentElement.classList.add('mode-bancal-actiu');
  }
};

// 4. Interceptor Global de Promeses (Ideal per caçar l'error de Supabase Offline)
export const setupGlobalErrorInterceptors = () => {
  if (typeof window === 'undefined') return;

  window.addEventListener('unhandledrejection', (event) => {
    // Caçar expulsió de Supabase per falta de Refresh Token en mode Offline
    if (event.reason && typeof event.reason.message === 'string') {
      if (event.reason.message.includes('Refresh Token') || event.reason.message.includes('refresh_token_not_found')) {
        console.warn('[errorRecovery] Supabase Refresh Token caducat interceptat. Verificant xarxa...');
        
        // Si estem offline, abortem l'expulsió de l'usuari (Búnquer d'Identitat)
        if (!navigator.onLine) {
          event.preventDefault(); // Evita l'error global
          console.info('[errorRecovery] Bloquejant expulsió (Offline Quarantena). El llaurador conserva l\'accés local.');
          
          // Despatxa event custom per avisar la UI
          window.dispatchEvent(new CustomEvent('sdp:offline-quarantine'));
        }
      }
    }
  });

  window.onerror = (msg, src, lineno, colno, err) => {
    if (typeof msg === 'string' && (msg.includes('Failed to fetch') || msg.includes('Load failed'))) {
      handleNetworkError();
      return true; // Suprimeix l'error a la consola
    }
    return false;
  };
};

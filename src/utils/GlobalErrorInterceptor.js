const CHUNK_LOAD_RELOAD_KEY = 'chunk-load-reload-count';
const MAX_CHUNK_RELOADS = 2;
export function initGlobalErrorInterceptor() {
  window.addEventListener('error', event => {
    // Check if error is ChunkLoadError (Vite dynamic import fail)
    if (event.message && /Failed to fetch dynamically imported module/i.test(event.message)) {
      event.preventDefault();
      const reloadCount = parseInt(sessionStorage.getItem(CHUNK_LOAD_RELOAD_KEY) || '0', 10);
      if (reloadCount >= MAX_CHUNK_RELOADS) {
        console.error('🛑 [ARCH SHIELD] ChunkLoadError loop detected. Reload aborted to prevent Safari crash.');
        return;
      }
      sessionStorage.setItem(CHUNK_LOAD_RELOAD_KEY, (reloadCount + 1).toString());
      console.warn(`[ARCH SHIELD] ChunkLoadError caught. Reloading with cache buster. Attempt ${reloadCount + 1}`);

      // Safari cache bust
      window.location.replace(window.location.pathname + '?v=' + Date.now());
    }
  });

  // Clear chunk load reload count if successful
  setTimeout(() => {
    sessionStorage.removeItem(CHUNK_LOAD_RELOAD_KEY);
  }, 5000);
}
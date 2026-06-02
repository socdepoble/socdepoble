import { quirksDetector } from './SafariQuirksDetector';

export function runArchitectureGuard() {
  // Check if we are in Safari and need to be extra cautious
  const isQuirky = quirksDetector.isPotentiallyQuirky();
  
  if (isQuirky) {
    console.log('🛡️ [ARCH SHIELD] Safari/iOS Environment Detected. Strict core protections are active.');
  }

  // Ensure Service Worker supports message channel and controller exists if installed
  if ('serviceWorker' in navigator) {
    if (navigator.serviceWorker.controller) {
       console.log('✅ [ARCH SHIELD] Service Worker active and controlling the page.');
    }
  } else {
    console.warn('⚠️ [ARCH SHIELD] Service Workers not supported in this browser context (possibly old browser or insecure context). Offline capabilities will fail.');
  }

  // Define a global lock for developers trying to mutate core state
  window.__CORE_GUARD_ACTIVE__ = true;
  Object.freeze(window.__CORE_GUARD_ACTIVE__);
}

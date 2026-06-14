/**
 * Wrapper segur per a requestIdleCallback amb fallback a setTimeout.
 * Garanteix compatibilitat total amb Safari antic i entorns sense suport nadiu.
 */

export const safeRequestIdleCallback = (callback, options) => {
  if (typeof window !== 'undefined' && window.requestIdleCallback) {
    return window.requestIdleCallback(callback, options);
  }
  
  // Fallback robust per a navegadors antics
  const start = Date.now();
  return setTimeout(() => {
    callback({
      didTimeout: false,
      timeRemaining: () => Math.max(0, 50 - (Date.now() - start))
    });
  }, 1);
};

export const safeCancelIdleCallback = (id) => {
  if (typeof window !== 'undefined' && window.cancelIdleCallback) {
    window.cancelIdleCallback(id);
  } else {
    clearTimeout(id);
  }
};

// src/lib/logger.js
// Simple logger wrapper: mostra errors en dev; en prod intenta enviar a window.__REPORT_ERROR__ si està disponible.
export function logError(error, context = {}) {
  try {
    const payload = {
      message: error && error.message ? error.message : String(error),
      stack: error && error.stack ? error.stack : undefined,
      context
    };

    if (process.env.NODE_ENV === 'development') {
      console.error('[logger] error', payload);
      return;
    }

    if (typeof window !== 'undefined' && typeof window.__REPORT_ERROR__ === 'function') {
      try {
        window.__REPORT_ERROR__(payload);
        return;
      } catch (e) {
      }
    }
  } catch (e) {
  }
}

export function logInfo(...args) {
  if (process.env.NODE_ENV === 'development') {
    console.info('[logger]', ...args);
  }
}

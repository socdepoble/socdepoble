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
      // eslint-disable-next-line no-console
      console.error('[logger] error', payload);
      return;
    }

    if (typeof window !== 'undefined' && typeof window.__REPORT_ERROR__ === 'function') {
      try {
        window.__REPORT_ERROR__(payload);
        return;
      } catch (e) {
        // si falla el reporter, caiem a no-op
      }
    }

    // No-op en producció per defecte
  } catch (e) {
    // no fer res si el logger falla
  }
}

export function logInfo(...args) {
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.info('[logger]', ...args);
  }
}

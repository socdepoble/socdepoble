export function installErrorBoundary({ status, flush }) {
  let lastErrorAt = 0;

  function report(kind, err) {
    const now = Date.now();
    if (now - lastErrorAt < 500) return;
    lastErrorAt = now;

    const message = err?.message || String(err);
    console.error(`[${kind}]`, err);
    status?.(`Mode segur: ${message}`);
  }

  window.addEventListener('error', event => {
    report('error', event.error || event.message);
  });

  window.addEventListener('unhandledrejection', event => {
    report('unhandledrejection', event.reason);
  });

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      flush?.().catch(err => report('flush-on-hidden', err));
    }
  });

  window.addEventListener('pagehide', () => {
    flush?.().catch(err => report('flush-on-pagehide', err));
  });
}

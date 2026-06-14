// Delegació centralitzada: attach a <body> i reempaqueta events com CustomEvent amb targetItemId
export function initCentralEventDelegation({ root = document.body, selector = '[data-evt-id]' } = {}) {
  function handle(e) {
    const el = e.target.closest(selector);
    if (!el) return;
    const id = el.getAttribute('data-evt-id');
    const payload = { originalEvent: e, id, dataset: el.dataset };
    const ce = new CustomEvent('central:event', { detail: payload, bubbles: false, cancelable: true });
    root.dispatchEvent(ce);
  }
  ['click','input','change','keydown','touchstart'].forEach(t => root.addEventListener(t, handle, { passive: true }));
  return () => { ['click','input','change','keydown','touchstart'].forEach(t => root.removeEventListener(t, handle)); };
}

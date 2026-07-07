export class SpButton extends HTMLElement {
  connectedCallback() {
    if (this.dataset.ready === '1') return;
    this.dataset.ready = '1';

    const button = this.querySelector('button');
    if (!button) return;

    button.classList.add('sp-button');
    if (!button.type) button.type = 'button';

    const hasName = button.textContent.trim() || button.getAttribute('aria-label') || button.getAttribute('aria-labelledby');
    if (!hasName) {
      button.setAttribute('aria-label', 'Accio');
      console.warn('[sp-button] Boto sense nom accessible; afegit fallback.');
    }
  }
}

customElements.define('sp-button', SpButton);

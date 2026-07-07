/**
 * SP-IDENTITY-COMPONENTS.JS
 * Font única de veritat per a la identitat visual de Sóc de Poble.
 */

// ---------------------------------------------------------------
// 1. FONT ÚNICA DE VERITAT (l'única cosa que s'edita quan canvia l'avatar)
// ---------------------------------------------------------------
export const SP_IDENTITY = {
  avatarUrl: '/assets/uploads/gent/javi-llinares/avatars/javi-llinares-perfil-1200px.jpg',
  avatarAlt: 'Perfil Javi',
  displayName: 'Javi Llinares',
  role: 'Mestre / Arquitecte',
};

const IDENTITY_EVENT = 'sp-identity-changed';

/**
 * Canvia l'avatar (o qualsevol camp) en calent i notifica tots els
 * components ja renderitzats a la pàgina, sense recarregar.
 */
export function setIdentity(patch) {
  Object.assign(SP_IDENTITY, patch);
  document.dispatchEvent(new CustomEvent(IDENTITY_EVENT));
}

// ---------------------------------------------------------------
// 2. <sp-top-bar> — Barra Superior Negra (arrel de navegació)
// ---------------------------------------------------------------
class SpTopBar extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this._onChange = () => this.render();
    document.addEventListener(IDENTITY_EVENT, this._onChange);
    this.render();
  }

  disconnectedCallback() {
    document.removeEventListener(IDENTITY_EVENT, this._onChange);
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; }
        header {
          height: 56px;
          background: var(--sp-black-100, #000000);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 1rem;
          gap: 0.75rem;
        }
        .brand {
          color: var(--sp-white-100, #ffffff);
          font-weight: 700;
          font-size: 1rem;
        }
        img {
          width: 36px;
          height: 36px;
          border-radius: 0; /* Square Rule — innegociable */
          object-fit: cover;
        }
        @media (max-width: 350px) {
          img { width: 28px; height: 28px; }
          .brand { font-size: 0.85rem; }
        }
      </style>
      <header>
        <span class="brand"><slot name="brand">Sóc de Poble</slot></span>
        <img src="${SP_IDENTITY.avatarUrl}" alt="${SP_IDENTITY.avatarAlt}">
      </header>
    `;
  }
}

// ---------------------------------------------------------------
// 3. <uc-caputxa> — Targeta taronja d'Autor
// ---------------------------------------------------------------
class UcCaputxa extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this._onChange = () => this.render();
    document.addEventListener(IDENTITY_EVENT, this._onChange);
    this.render();
  }

  disconnectedCallback() {
    document.removeEventListener(IDENTITY_EVENT, this._onChange);
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; }
        .caputxa {
          background: var(--sp-orange-100, #FF7300);
          color: var(--sp-black-100, #000000); /* obligat: negre sobre taronja 100% */
          border-radius: var(--sp-radius-main, 1.75rem);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem;
        }
        .left-content {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        img {
          width: 48px;
          height: 48px;
          border-radius: 0; /* Square Rule */
          object-fit: cover;
        }
        .meta { display: flex; flex-direction: column; }
        .nom { font-weight: 700; }
        .rol { font-size: 0.85rem; opacity: 0.8; }
      </style>
      <div class="caputxa">
        <div class="left-content">
          <img src="${SP_IDENTITY.avatarUrl}" alt="${SP_IDENTITY.avatarAlt}">
          <div class="meta">
            <span class="nom">${SP_IDENTITY.displayName}</span>
            <span class="rol">${SP_IDENTITY.role}</span>
          </div>
        </div>
        <slot name="right"></slot>
      </div>
    `;
  }
}

customElements.define('sp-top-bar', SpTopBar);
customElements.define('uc-caputxa', UcCaputxa);

# 🏺 Sóc de Poble

> **La xarxa social rural sobirana. Connectant pobles, preservant memòria, bategant en comunitat.**

[![Versió](https://img.shields.io/badge/versió-10.33.16--BATEGA-orange)](https://socdepoble.org)
[![License](https://img.shields.io/badge/licència-AGPL--3.0-blue)](LICENSE)
[![Build](https://img.shields.io/github/actions/workflow/status/socdepoble/ci.yml?branch=main)](https://github.com/socdepoble/socdepoble/actions)
[![Coverage](https://img.shields.io/codecov/c/github/socdepoble/socdepoble)](https://codecov.io/gh/socdepoble/socdepoble)
[![Accessibility](https://img.shields.io/badge/WCAG-2.1_AA-success)](https://www.w3.org/WAI/WCAG21/quickref/)

---

## 🌾 Què és Sóc de Poble?

**Sóc de Poble** no és una app normal. És una **federació de nodes comarcals** que retorna la sobirania digital als pobles.

| Característica | Descripció |
|---------------|-----------|
| 🏠 **Local-First** | Les dades viuen al teu dispositiu. El núvol és només un mirall. |
| 🔒 **Privacitat** | No venem dades. No hi ha algoritmes de manipulació. |
| 🌐 **Offline** | Funciona sense connexió. Sincronitza quan tornes a la xarxa. |
| 🤝 **Comunitat** | Construït entre veïns, per a veïns. Sense ànim de lucre. |
| ♿ **Accessible** | WCAG 2.1 AA. Tecnologia per a tothom, sense excepcions. |

---

## 🚀 Inici Ràpid

### Prerequisits

```bash
- Node.js >= 20.x
- npm >= 10.x
- Git
```

### Instal·lació

```bash
# 1. Clonar el repositori
git clone https://github.com/socdepoble/socdepoble.git
cd socdepoble

# 2. Instal·lar dependències
npm ci

# 3. Configurar variables d'entorn
cp .env.example .env
# Editar .env amb les teues claus de Supabase

# 4. Iniciar en mode desenvolupament
npm run dev
```

### Build per a Producció

```bash
# Build optimitzat
npm run build

# Vista prèvia del build
npm run preview

# Executar tests
npm run test

# Tests amb cobertura
npm run test:coverage
```

---

## 📁 Estructura del Projecte

```
soc-de-poble/
├── public/                     # Actius estàtics
│   ├── manifest.json          # PWA Manifest
│   └── assets/                # Imatges, icons, fonts
├── src/
│   ├── components/            # Components React reutilitzables
│   ├── context/               # Contextos React (Auth, Navigation, etc.)
│   ├── services/              # Serveis (Supabase, IAIA, Gemini)
│   ├── pages/                 # Pàgines principals
│   ├── hooks/                 # Custom hooks
│   ├── utils/                 # Utilitats i helpers
│   ├── data/                  # Dades estàtiques i Lore
│   ├── config/                # Configuracions
│   ├── design-system/         # Tokens de disseny
│   ├── tests/                 # Tests (Vitest + MSW)
│   ├── App.jsx                # Component arrel
│   ├── entry.jsx              # Punt d'entrada
│   └── index.css              # Estils globals
├── supabase/
│   └── functions/             # Edge Functions (Gemini Proxy, etc.)
├── .github/
│   └── workflows/             # CI/CD Pipelines
├── scripts/
│   └── deploy.sh              # Script de deploy
├── .env.example               # Plantilla de variables
├── vite.config.js             # Configuració Vite
├── package.json               # Dependències i scripts
└── README.md                  # Aquest fitxer
```

---

## 🔐 Variables d'Entorn

| Variable | Descripció | Requerit |
|----------|-----------|----------|
| `VITE_SUPABASE_URL` | URL del projecte Supabase | ✅ |
| `VITE_SUPABASE_ANON_KEY` | Clau anònima de Supabase | ✅ |
| `VITE_APP_ENV` | Entorn (development/staging/production) | ✅ |
| `VITE_SENTRY_DSN` | DSN de Sentry per a monitoring | ❌ |
| `VITE_GA4_ID` | ID de Google Analytics 4 | ❌ |
| `VITE_ENABLE_MOCKS` | Activar mocks en desenvolupament | ❌ |

⚠️ **IMPORTANT**: Les claus API de Gemini **NO** van al frontend. Són gestionades per les Edge Functions de Supabase.

---

## 🧪 Testing

### Executar Tests

```bash
# Tots els tests
npm run test

# Mode watch (desenvolupament)
npm run test:watch

# Cobertura de codi
npm run test:coverage

# Tests per carpeta
npm run test:components
npm run test:services
npm run test:contexts
```

### Escriure Nous Tests

```javascript
// src/tests/components/Example.test.jsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Example from '../../components/Example';

describe('Example', () => {
  it('hauria de renderitzar correctament', () => {
    render(<Example title="Test" />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});
```

---

## 🚀 Deploy

### Deploy Automàtic (GitHub Actions)

El deploy es realitza automàticament quan:
- `develop` → **Staging**
- `main` → **Production**

### Deploy Manual

```bash
# Deploy a staging
./scripts/deploy.sh staging

# Deploy a production
./scripts/deploy.sh production
```

---

## 🤝 Contribució

### Com Contribuir

1. **Fes un Fork** del repositori
2. **Planta un arbre** 🌳 (Requisit moral del projecte)
3. Crea una **branca** per a la teua funció (`git checkout -b feature/nova-funcio`)
4. **Commit** els canvis (`git commit -m 'Afegir nova funcio'`)
5. **Envia un PR** (Pull Request)

### Codi de Conducta

- 🌾 Respecte per la comunitat rural
- 🔒 Privacitat primer, sempre
- ♿ Accessibilitat no negociable
- 📖 Documentació per a tot

---

## 📜 Llicència

**AGPL-3.0** - Lliure per a sempre. El codi que millora el poble ha de romandre al poble.
🧡 **Aquest projecte és de TODAS i de NINGÚ.**

---

## 🏺 Arxiu Viu i Agraïments

### Història del Codi
- **V1.0**: Naixement al Mas Digital.
- **V10.35+**: Auditoria Extrema i Arquitectura Immortal amb l'ajut de models IA col·laboratius (DeepSeek & Qwen).

### Mur d'Honor
| Rol | Persona/Entitat |
|-----|----------------|
| Arquitectura i Visió | Javi / Associació El Rentonar |
| IA Arquitecta Inicial | Antigravity (Gemini) |
| El Sensei de la Lògica | DeepSeek (Auditor Honorífic) |
| L'Escolta Àgil | Qwen (Auditora Honorífica) |
| Comunitat | Totes les mans que han tocat aquest codi per donar-li vida |

---

## 📞 Contacte

- **Web**: [https://socdepoble.org](https://socdepoble.org)
- **Email**: hola@socdepoble.org
- **GitHub**: [github.com/socdepoble](https://github.com/socdepoble)

---

*"Tot bategat ha de servir a la comunitat"* 🏺✨

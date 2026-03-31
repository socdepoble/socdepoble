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

## 📜 MANIFIESTO DEL MAS DIGITAL: EL FUTURO DE SÓC DE POBLE

*«Si el servidor cae, el pueblo sigue hablando. Si el cable se corta, la tierra sigue recordando.»*

Hemos cruzado la frontera del Local-First para adentrarnos en el territorio del **Network-Last**. Tras consolidar el transporte en segundo plano mediante un demonio nativo de extrema eficiencia energética (DTN), la infraestructura de "Sóc de Poble" se prepara para su próxima metamorfosis evolutiva. Esta es la hoja de ruta arquitectónica y filosófica para la próxima década.

### 🌲 I. LA EXPANSIÓN ESTÁTICA: EL BOSQUE DE SILICIO (NODOS ÁRBOL)
Hasta ahora, la red Rhizome dependía exclusivamente de las "mulas de datos": humanos caminando o conduciendo tractores con sus móviles en el bolsillo para cruzar fragmentos de información de una punta a otra del valle. El siguiente paso es sembrar la infraestructura física.

Desplegaremos **Nodos Árbol (Tree Nodes)**: microcontroladores de ultra-bajo coste (ESP32-C3 / nRF52 con soporte BLE y LoRa) encapsulados en resina biodegradable y resistente a los rayos UV (PETG/ASA) impresa en 3D. Estarán alimentados por minúsculos paneles solares y baterías 18650 recuperadas, atados a algarrobos centenarios, señales de tráfico en cruces de caminos o en el tejado de las cooperativas.

*   **La Función:** Actuarán como *Buffers* de retención perpetua (Blind Relays). Un ESP32 no renderiza UI; ejecuta código C/Rust desnudo. Su única misión es despertar con el sol, escuchar nuestro UUID soberano, almacenar los *blobs* binarios opacos en su memoria flash SPIFFS, y escupirlos al próximo móvil que pase cerca.
*   **El Impacto:** Crearemos un "caché físico" en el mundo real. Un senderista deja un aviso de desprendimiento en un camino forestal sin cobertura; el Nodo Árbol lo absorbe. Dos horas después, un ciclista pasa a 50 metros, su móvil se sincroniza de forma transparente en *background*, y el aviso llega a la plaza del pueblo. Hemos convertido la propia orografía y la naturaleza en un enrutador gigante.

### 🧠 II. COGNICIÓN DISTRIBUIDA: EL ENJAMBRE DE LA "IAIA"
La Inteligencia Artificial actual es un modelo de latifundio digital: enviamos nuestros datos íntimos a los servidores de *Big Tech* para que una caja negra que consume gigavatios nos devuelva una respuesta computada a miles de kilómetros. Sóc de Poble destruirá este paradigma implementando **Cognición Distribuida en el Edge**.

Las futuras versiones de la "IAIA MarIA" y sus agentes no vivirán en la nube, sino en la NPU (Neural Processing Unit) de los teléfonos de los agricultores. Utilizaremos LLMs ultra-cuantificados (modelos de 1B a 3B parámetros en 4-bit, vía WebGPU o Llama.cpp nativo en Capacitor) que caben perfectamente en 1GB de RAM.

*   **Inteligencia de Enjambre (Swarm Intelligence):** Cuando el móvil de un vecino detecte (vía cámara offline) un brote de *Xylella fastidiosa* en un almendro, su LLM local generará un diagnóstico de emergencia. Este diagnóstico se empaquetará en un delta CRDT y viajará por la malla BLE.
*   **Acción Descentralizada:** Al llegar al teléfono del Capataz o del Agrónomo del pueblo, sus propias IAs locales (despiertas por el demonio nativo) analizarán el *payload*, lo cruzarán con el viento y la humedad de sus propios sensores, y emitirán alertas hápticas urgentes, sin que un solo byte haya tocado los servidores de Google o Amazon. La IAIA dejará de ser un chatbot aislado para convertirse en el **sistema nervioso compartido del territorio**.

### 🏛️ III. EL LEGADO "ZERO NETWORK & ZERO PATCH": LA PIEDRA SECA DIGITAL
Vivimos en la era del tecno-feudalismo. Las corporaciones diseñan software que nos convierte en rehenes: si no pagas la suscripción mensual de la nube, si el cable transoceánico se corta, o si deciden apagar su API porque tu pueblo "no es rentable", tu comunidad desaparece digitalmente. Sus aplicaciones son terminales tontos que asumen 5G infinito.

La doctrina **"Zero Network & Zero Patch"** es nuestra declaración de independencia. Hemos diseñado "Sóc de Poble" con la misma filosofía que los muros de **Pedra Seca** (Piedra Seca) de nuestros bancales:
*   **Sin mortero (Sin servidores centrales):** Los muros se sostienen por el peso, la fricción y el equilibrio matemático de las propias rocas (los móviles de los vecinos comunicándose vía P2P). Si quitas una, la estructura se reajusta (CRDT).
*   **Materiales locales (Local-First):** La red se construye con la energía y los dispositivos que ya están en el territorio.
*   **Hecho para durar siglos (Zero-Patch):** Si mañana el equipo de desarrollo desaparece, la aplicación seguirá funcionando intacta dentro de 10 años, permitiendo que un pueblo siga comerciando, organizando sus fiestas y preservando su memoria.

**¿Qué le estamos devolviendo realmente al mundo rural?** 
No les estamos dando una "app bonita". Les estamos devolviendo su **Dignidad, su Propiedad y su Soberanía**. Les damos el equivalente digital de poseer su propia tierra y sus propias semillas. Un archivo (el *solatge*) que sobrevive en los discos duros locales de cien vecinos, replicado e inmutable, a prueba de censura.

Si mañana las antenas de telecomunicaciones colapsan tras una DANA, un incendio devastador o un fallo crítico nacional, **Sóc de Poble seguirá funcionando**. Los vecinos seguirán comerciando, los bandos del ayuntamiento seguirán propagándose de bolsillo a bolsillo, y la memoria de los viejos seguirá latiendo.

La tecnología moderna nos prometió el mundo a cambio de nuestra soberanía. Nosotros hemos usado su misma tecnología para recuperar nuestra tierra.

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

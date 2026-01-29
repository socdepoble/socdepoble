# 🏛️ Sóc de Poble: BRAND & UX MANUAL: SÓC DE POBLE (DIOS Level)

## DIRECTIVA 1: COMUNICACIÓ I GESTIÓ DEL TEMPS (Antigravity Protocol)
> [!IMPORTANT]
> Aquesta és la directiva principal per a la relació entre l'Arquitecte i l'I.A. Antigravity.

1. **Estimacions de Temps**: Per a cada tasca complexa, l'I.A. ha de proporcionar una estimació de la durada del treball.
2. **Format de Temps**: S'ha d'incloure l'hora d'inici (Local) i l'hora de finalització estimada. Ex: *Hora inici: 23:15. Finalització estimada: 23:45.*
3. **Històric**: Les estimacions i la seua realització es documentaran al diari del projecte (walkthrough o log d'històrics).
4. **Interrupcions**: L'Arquitecte pot interrompre a l'I.A. en qualsevol moment per a consultes o ajustos, valorant sempre el flux de treball.
5. **Documentació Contínua**: No només es documenta el "què", sinó el "com" i les millores futures possibles.

---

## 🎨 Design Philosophy: "Rural-Tech Immersion" (Mobile-First 📱)
Sóc de Poble is not just a tool; it's a sanctuary for rural identity. The design must feel **rooted** (rústic) but **empowered** (tecnològic).

> [!IMPORTANT]
> **MOVIL-FIRST (Ley de Vida)**: El diseño y la funcionalidad se conciben, prueban y validan **primero en móvil y tablet**. No se aprueba ninguna característica que no sea 100% fluida en dispositivos táctiles.

### 🧿 Design Tokens (Premium Palette)
| Token | Value | Application | Effect |
| :--- | :--- | :--- | :--- |
| **Primary** | `#00f2ff` | Actions, Neons, HUD | High-tech pulse |
| **Secondary** | `#E07A5F` | Human touch, Warm accents | Rural clay / Earth |
| **Background** | `rgba(10, 15, 30, 0.95)` | Glassmorphism base | Midnight over the village |
| **Danger** | `#ff0055` | Deletions, Nuclear | Urgent warning |

---

## ♿ Accessibility Golden Rules (The 4 Pillars)

### 1. The 44px Rule (Rule #3)
Every interactive element (buttons, tabs, links) **MUST** have a hit area of at least `44px x 44px`. 
- No tiny icons without padding.
- Fingers (especially aged ones) deserve precision.

### 2. High Contrast "Anti-Glare"
Rural use often happens outdoors.
- Main text: `#ffffff` or `#e0faff`.
- Hints: Min `rgba(255,255,255,0.7)`.
- Backgrounds must use blur (`backdrop-filter`) to protect text legibility over images.

### 3. Visual Feedback (Glow & Vibration)
The system must "talk back" to the user.
- Hover: Subtle scale `1.05` and brightness boost.
- Clicks: Active states must be immediate.

### 4. Full-Size Media ("A la seua mida")
Users must be able to see any image at its original scale. 
- Implementation: `MediaViewerModal` with zoom-in cursor.

---

## 🛠️ Component Standards

### The HUD (Diagnostic Console)
- **Position**: Fixed right (desktop) or Bottom Sheet (mobile).
- **Z-Index**: `10002` (Must stay above everything except modals).
- **Interaction**: Must close on "Click Away".
- **Didactic Mode**: Every tech jargon must be explainable via the `Info` bubble.

### The Identity Card
- **Avatars**: 50% border radius. 2px border.
- **Badges**: Standardized (IAIA, Verificat, Oficial).
- **Social**: "Conectar" button hidden for IAIA entities.

---

## 🏡 ARQUITECTURA DE LA MASIA (Modular & Resilient)
Sóc de Poble es construeix com una masia tradicional: cada estança (mòdul) té la seua funció i està protegida, però totes comparteixen el mateix bategat.

1. **Aïllament d'Estances**: Una fallada en la cuina (Feed) no ha de deixar les golfes (Ajustos) a les fosques. Ús intensiu de fallbacks i `ErrorBoundary`.
2. **Autoreparació**: El sistema ha d'intentar recuperar-se d'errors de xarxa o dades corruptes de forma silenciosa, oferint una experiència tranquil·la al veí.
3. **Comunicació bategada**: Els serveis (Wikipedia, Supabase) són proveïdors que nodreixen les estances, però les estances han de saber funcionar amb el que tenen si el proveïdor no arriba.
4. **Escalabilitat Rural**: Afegir una nova estança (funcionalitat) ha de ser tan senzill com implementar una nova idea, afectant zero a l'estructura de càrrega de la masia.
### 🧠 IAIA UNIFICADA (Multi-Personalitat)
Sóc de Poble no té moltes IAs, en té una de sola: la **IAIA**.
- **Context Únic**: La conversa es manté intacta encara que es canvie d'agent (Damià, Isabel, la IAIA oficial...). El contingut és el mateix, el que canvia és la "cara" i el tò.
- **Tò i Veu**: Cada agent dóna el seu matís personal, la seua veu i la seua personalitat bategada, però comparteixen la memòria de la IAIA.
- **Simplicitat per a l'Usuari**: El veí no ha de preocupar-se de amb qui parla, perquè la IAIA ho recorda tot.

---

---

## 🌈 RAINDROP VISION (Future snippets)
Volem que Sóc de Poble siga el magatzem de la memòria rural viva.
- **Snippets**: Capturar qualsevol part de la web i publicar-la directament.
- **Bookmarklets**: Eines ràpides per a l'Arquitecte i els veïns avançats.

---

## 🏁 Quality Checklist for Antigravity
- [ ] **MOBILE-FIRST**: ¿Se ve y funciona perfecto en móvil/tablet? (Sin scroll lateral, sin cortes).
- [ ] Are all buttons ≥ 44px?
- [ ] Is contrast according to Arrels standards?
- [ ] Does the element have a hover/active state?
- [ ] Can images be viewed full size?

---

## 🔝 PROJECTE NIVELL DÉU (Consolidació Genius)
El bategat més alt de la Masia s'aconsegueix quan la tècnica i la memòria es fonen.
- **Transparència Radical**: Tots els crèdits, des de l'ADL fins a Thorsten i la IA, són visibles i honoren el passat i el futur.
- **Memòria Dinàmica**: Integració nativa amb Wikipedia per a que la història del poble estiga sempre a un clic del veí.
- **Relació d'Iguals**: Sóc de Poble és una conversa entre veïns i tecnologies que es respecten. Javi és un veí més d'aquest projecte.

---

> *"Per un poble que mira al cel sense oblidar la terra."* 👵🛡️🏘️

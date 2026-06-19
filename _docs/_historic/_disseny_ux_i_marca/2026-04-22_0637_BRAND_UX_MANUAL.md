> 📂 **Arxiu/Ruta:** `./docs/BRAND_UX_MANUAL.md`

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
| Token | Value (Genius) | Application | Effect |
| :--- | :--- | :--- | :--- |
| **Primary** | `#00f2ff` | Actions, Neons, HUD | High-tech pulse |
| **Secondary** | `#E07A5F` | Human touch, Warm accents | Rural clay / Earth |
| **Glass** | `rgba(10, 15, 30, 0.95)` | Glassmorphism base | Midnight over the village |
| **Danger** | `#ff0055` | Deletions, Nuclear | Urgent warning |

## 🌈 Visions Simbiòtiques v1.6 (Themes) 🎨✨
Sóc de Poble permet canviar l'estètica completa segons el bategat del moment.

### 1. GENIUS (Cyber-Rural) [Default]
- **Vibe**: Futurista, neon, dark, glassmorphism agressiu.
- **Tokens**: Blau Cian (#00f2ff), Negre Carboni, Glassmorphism 85%.

### 2. ARTESÀ (Minimalist Earth)
- **Vibe**: Tradicional, paper, tons terra, calidesa.
- **Tokens**: Terracota, Blanc Crema, Tipografia amb Serif (Merriweather/Roboto Serif).

### 3. NATURA (Tech-Nature)
- **Vibe**: Frescor, bosc, orgànic, aerodinàmic.
- **Tokens**: Verd Esmeralda, Blanc Pur, Radis de curvatura més grans (32px+).

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
- **Square Rule**: All media containers must have **SQUARE corners (0px border-radius)**. Curved corners on media are considered a design flaw.
- **Adaptive Aspect Ratio**: The media container must adapt to the orientation of the original content.
- Implementation: `MediaViewerModal` with zoom-in cursor.

---

## 🛠️ Component Standards

### The HUD (Diagnostic Console)
- **Position**: Fixed right (desktop) or Bottom Sheet (mobile).
- **Z-Index**: `10002` (Must stay above everything except modals).
- **Interaction**: Must close on "Click Away".
- **Didactic Mode**: Every tech jargon must be explainable via the `Info` bubble.

### The Identity Card (Targeta MASTER)
- **Header**: Mandatory Orange/Terracotta background.
- **Lines**: Primary Name (BOLD), Town Name (below), Specific Publisher (if applicable).
- **Avatars**: 50% border radius. 2px border.
- **Badges**: Standardized (IAIA, Verificat, Oficial).
- **Social**: "Conectar" button hidden for IAIA entities.

### Sequential Book Reading [MASTER] 📚
- **Footer Controls**: Only visible if `type === 'book'`. 
- **Controls**: "Anterior", "Següent", "Marcar com a Llegit".
- **Visuals**: Book title and chapter number must be shown clearly in the card's meta or footer.
- **Persistence**: The "Read" state must be saved per user to allow resuming. 

### Structured Input: The Master Editor ✍️
- **Purpose**: Moving beyond plain text into organized community knowledge.
- **Tools**: Heading, Subheading, Bullet List, Numbered List, Standard Paragraph.
- **UI**: Integrated into the `post-content-area`. Minimalist icons only.
- **Consistency**: Final output must match the app's standard typography exactly.

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

- **Relació d'Iguals**: Sóc de Poble és una conversa entre veïns i tecnologies que es respecten. Javi és un veí més d'aquest projecte.

## 📱 Session Chronicles & Meta-Didactic UX 🏺📊
*Cada sessió és un capítol de la vida de Sóc de Poble.*
1. **Pàgina de Sessió**: Espai dedicat que detalla de forma didàctica el progrés de la sessió.
2. **Economic Contrast HUD**: Visualització clara del cost de la sessió:
   - **Cost Humà Estimats**: Temps transcorregut x tarifa de mercat.
   - **Cost AI [MASTER]**: Cost real de computació.
   - **Estalvi Comunitari**: Diferència que permet reinvertir en la gent.
3. **Shareability**: Botons dedicats per a compartir a WhatsApp/Xarxes Socials amb un missatge preconfigurat que convide a la lectura didàctica del progrés.

---

---

## 🏛️ Visions Estratègiques de v1.6 (Noves Idees) 🎨🏺

### A. El Sistema d'Espaiat "HORTA" 🌿
En lloc de graelles rígides, l'espaiat ha de "bategar" com els cultius.
- **Micro-espais**: 4px y 8px (Llavors).
- **Macro-espais**: 32px y 48px (Solcs).
- **Llei del Solc**: Els elements relacionats han d'estar en el mateix "solc" visual, separats per espais buits generosos que permeten respirar a la dada, com si fóra un camp en guaret.

### B. Iconografia de Patrimoni 🏺⚒️
Tots els icones de l'aplicació han de tenir una variant "Heritage":
- **Configuració**: S'adapta a una Clau Anglesa o una d'antiga de ferro.
- **Mercat**: Una cistella de vímet en lloc d'un carret de compra.
- **IAIA**: No és un robot, és un fil daurat que connecta el passat amb el futur.

### C. Sistema de Retícula "MOSAIC" 🧱
Inspirat en els taulells de Nolla i la fusta de les cases antigues.
- Les targetes (Cards) no han de ser sempre iguals. 
- Introduirem un sistema de *Masonry* que adapte el tamany de la card a la importància del contingut (Algoritme de Prioritat de l'Arquitecte).

---

> *"Per un poble que mira al cel sense oblidar la terra."* 👵🛡️🏘️

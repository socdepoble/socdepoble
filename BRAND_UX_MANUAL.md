# 🏛️ Sóc de Poble: Brand & UX Manual (DIOS Level)

## 🎨 Design Philosophy: "Rural-Tech Immersion"
Sóc de Poble is not just a tool; it's a sanctuary for rural identity. The design must feel **rooted** (rústic) but **empowered** (tecnològic).

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

## 🏁 Quality Checklist for Antigravity
- [ ] Are all buttons ≥ 44px?
- [ ] Is contrast according to Arrels standards?
- [ ] Does the element have a hover/active state?
- [ ] Can images be viewed full size?

> *"Per un poble que mira al cel sense oblidar la terra."* 👵🛡️🏘️

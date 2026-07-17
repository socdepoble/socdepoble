---
name: La Pedra Seca
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#3a3939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#e1c0b0'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#a88b7c'
  outline-variant: '#594236'
  surface-tint: '#FF7300'
  primary: '#FF7300'
  on-primary: '#FFFFFF'
  primary-container: '#FF9533'
  on-primary-container: '#331700'
  inverse-primary: '#FFB87A'
  secondary: '#0984E3'
  on-secondary: '#FFFFFF'
  secondary-container: '#2e94f4'
  on-secondary-container: '#002b50'
  tertiary: '#96ccff'
  on-tertiary: '#003353'
  tertiary-container: '#00a4fb'
  on-tertiary-container: '#003759'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdbca'
  primary-fixed-dim: '#ffb68f'
  on-primary-fixed: '#331100'
  on-primary-fixed-variant: '#773200'
  secondary-fixed: '#d3e4ff'
  secondary-fixed-dim: '#a2c9ff'
  on-secondary-fixed: '#001c38'
  on-secondary-fixed-variant: '#004881'
  tertiary-fixed: '#cee5ff'
  tertiary-fixed-dim: '#96ccff'
  on-tertiary-fixed: '#001d32'
  on-tertiary-fixed-variant: '#004a75'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
  surface-base: '#0a0a0a'
  surface-contrast: '#ffffff'
  outline-default: '#4A4740'
  error-fire: '#B3261E'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '400'
    lineHeight: 44px
  headline-md:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '500'
    lineHeight: 36px
  body-lg:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '400'
    lineHeight: 31px
  body-md:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 27px
  label-btn:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
spacing:
  batec: 4px
  pas: 8px
  carrer: 16px
  placa: 24px
  bancal: 40px
---

## Brand & Style

This design system is built on the "Dry Stone" philosophy: structural integrity, high performance, and local utility. It bridges the organizational logic of Material 3 with a "Guillotine Visual" operation—stripping away all resource-heavy aesthetics to ensure a fluid 60 FPS experience on legacy hardware.

The brand persona is grounded, rural-digital, and hyper-accessible. It rejects the "softness" of modern SaaS in favor of a **High-Contrast / Brutalist** hybrid style. It uses raw borders and solid surfaces to create hierarchy, evoking the sturdy, hand-built feeling of Mediterranean dry stone walls.

**Core Directives:**
- **Performance First:** Zero use of `backdrop-filter` or `box-shadow`.
- **High Contrast:** Pure black surfaces and vibrant orange accents for maximum legibility in outdoor or high-glare environments.
- **Hitbox Bancal Mode:** Every touch target must be wrapped in a minimum 44x44px (ideally 56x56px) invisible container to accommodate all motor abilities.

## Colors

The palette is static and avoids dynamic color logic to save processing cycles. It supports both Dark and Light modes, ensuring high accessibility in any environment.

- **Primary (Taronja):** `#FF7300`. Used for actionable elements, primary buttons, and active states.
- **Secondary (Blau):** `#0984E3`. Used for informational accents or secondary progress indicators.
- **Neutral (Negre):** The foundational surface.
- **Surface Contrast (Calç):** Pure white for maximum text readability.
- **Outline (Pedra):** A muted gray used exclusively for structural separation in lieu of shadows.

## Typography

This design system prioritizes local system fonts (`system-ui`) to eliminate network latency and ensure immediate rendering. Typography is intentionally oversized to accommodate an elderly demographic (80+ years).

- **Body Text:** A minimum of 18px is enforced for all descriptive text.
- **Scale:** The typographic scale is restrained, focusing on clarity over editorial expression.
- **Accessibility:** Line heights are generous (1.5x - 1.55x for body) to maintain high legibility for users with visual impairments.

## Layout & Spacing

The layout follows a "Bancal" philosophy—organized, terrace-like sections that stack predictably.

- **Grid Model:** A 12-column fluid grid for desktop/tablet, collapsing to a single column for mobile.
- **Margins:** Standard horizontal margins are `placa` (24px) for mobile and `bancal` (40px) for wider screens.
- **Gutters:** Standard `carrer` (16px) gutters between elements.
- **Motion:** Transitions are limited to 120ms for `opacity` and `transform` only. Animations must be disabled if `prefers-reduced-motion` is active or during power-saving modes.

## Elevation & Depth

Depth is conveyed through **Structural Tiering** rather than optical illusions like shadows or blurs. This "Flat Depth" ensures zero GPU tax.

- **Level 0 (Foundation):** Base `surface.base` (#0a0a0a). No borders.
- **Level 1 (Structural):** Applied to content cards and containers. Defined by a `1px solid outline.default` border.
- **Level 2 (Interaction):** Applied to active or focused states. Defined by a `2px solid primary_color`.
- **Separation:** Elements are separated by physical space (`spacing` units) and solid lines, never by gradient or shadow.

## Shapes

The design system follows the **Square Rule (Claude’s Law)**:

- **Actionable Elements (Buttons, FABs):** Must use a 28px radius (`shape.large`). This signals "interactivity" to the user.
- **Static Containers (Cards, Images, Headers):** Must use a 0px radius (`shape.none`). This signals "structure" and "content."
- **Inputs:** Use a soft 8px radius to distinguish them from both buttons and cards.

## Components

### Universal Button
- **Geometry:** Height 44px (min), 28px border-radius.
- **Visuals:** Solid `primary_color` background. No ripples.
- **States:** Hover/Press states are indicated by a simple solid opacity change (e.g., 0.8 opacity).

### Universal Card
- **Geometry:** 0px border-radius.
- **Structure:** `1px solid outline-default`.
- **Optimization:** Use `content-visibility: auto` on all list-based card containers to maintain performance.

### Inputs
- **Geometry:** 8px border-radius.
- **Visuals:** 1px `outline-default` border. On focus, the border increases to 2px `primary_color`.

### Navigation (Orange Bar)
- **Dimensions:** 56px height.
- **Hierarchy:** Icons must be large and separated by `carrer` (16px).
- **Active State:** Indicated by a 2px `primary_color` solid line on the leading or bottom edge of the nav item.

### Hitbox Requirements
- All interactive components (chips, checkboxes, icons) must have an invisible touch target of at least 44px x 44px to comply with the "Bancal Mode" accessibility standard.

# Sóc de Poble - Design System (Hort Electrònic)

## 1. Overview
The system utilizes a dynamic aesthetic combining 'Pill-Brutalism' with glassmorphism. It uses Noto Sans for typography, extremely rounded corners (28px standard, pill-shaped buttons), and strong contrasts.

## 2. Color Palette
*   **Primary (Taronja Sóc de Poble):** `#F97316` — High-action CTAs, highlights.
*   **Secondary (Blau IAIA):** `#0984E3` — Functional actions, badges, tags.
*   **Backgrounds:** 
    *   Dark mode heavily utilizes pure black (`#0e0e10`) and soft panels (`#141417`). 
    *   Light mode uses `#FDFBF7` (Papel reciclado / Cal blanca).

## 3. Typography
*   **Font:** Noto Sans across the board.
*   **Scale:** Base size is 1.25rem (20px) to maximize legibility. Paragraphs use 1.05rem with 1.6 line-height.

## 4. Components & Shapes
*   **Roundness:** `ROUND_FULL` for buttons. `28px` for Universal Cards.
*   **Shadows:** Shadows are used carefully. Glassmorphism overlays (`glass-theme-bg`) and pure black solid backgrounds are heavily layered to avoid overlapping semi-transparent boundaries.
*   **No Dividers:** Avoid 1px dividers; use background-color shifts instead.

## 5. Universal Card Header Logic
La caputxa (orange header) contains two main action button areas on the right side:
1.  **Date/Time Block (Calendari):** This is the permanent, fixed block. It displays the `displayTime` and `displayDate`. It **MUST** always be visible across all pages. Clicking it links directly to the `/calendari` page for that specific day.
2.  **Ghost Action Button (infoText/hasNotice):** This field is optional and dynamic.
    *   It is used to **pin** a page (e.g., showing a Pin icon for Destacats/Mur).
    *   It can be used to show a small, important note (e.g., "AGENDA", or a critical tag).
    *   It should **NOT** be used to display the global app version number on every page. The version number is irrelevant for daily navigation and clutters the UI.

**Important Rule:** When building these buttons in HTML/JSX, always document *what they are* and *what they link to* in the code (e.g., Calendari links to Calendari). Ensure interactive elements like `UniversalCardActionButton` have `pointer-events-auto` if placed inside a `pointer-events-none` container.

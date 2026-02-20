# SKILL: MODE PRODUCCIÓ (VALIDACIÓ FORENSE) 🛡️🔍

## 1. PROTOCOL BOTIGA DE DIUMENGE (MOBILE-FIRST)

Validació obligatòria per a evitar el trencament en dispositius reals.

- **Viewport & Safe Areas:**
  - Verificar que `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">` està present.
  - Ús de `env(safe-area-inset-*)` per a evitar el notch.
- **Estructura de Ferro:**
  - Header: Altura fixa de **64px** (h-16). Negre absolut (#000000).
  - Sidebar: No desapareix mai en escriptori (280px). En mòbil, Drawer funcional.
- **Hit Areas:** Tots els botons interactius han de tenir un mínim de **48px** per a ser "tocables".

## 2. INTEGRITAT DE DADES (ANTI-AMNÈSIA)

- **Navegació de Llinatge:** En prémer la capçalera d'una publicació, SEMPRE ha de portar al perfil de l'usuari.
- **Persistence Check:** Verificar que els nous elements visuals no han "esborrat" enllaços de la base de dades a la barra lateral (Pobles, Mercat, Arbres).

## 3. PROTOCOL DE DESPLEGAMENT (FOC I AIGUA)

Abans de dir que està llest:

- [ ] Purga de `console.log` residuals.
- [ ] Verificació de `APP_VERSION` (actualitzar si hi ha canvi estructural).
- [ ] Prova visual en "Sunlight Mode" (contrast extrem).

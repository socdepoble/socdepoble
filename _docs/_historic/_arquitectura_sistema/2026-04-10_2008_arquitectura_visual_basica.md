---
doc_type: Universal_Core
timestamp: 2026-04-13 03:35
authoring_agent: IAIA_Sistema
context_anchors:
  - _arquitectura_sistema
---
# 📐 Llibre d'Arquitectura Bàsica Visual (Sóc de Poble)

Aquest document estableix els fonaments estructurals i gràfics de la plataforma Sóc de Poble. Cap component s'hauria d'alterar o afegir sense comprovar les regles reflectides aquí i revisar la funció de cada bloc (div / contenidor). Tota modificació s'ha de sotmetre al Protocol d'Enderroc i a la Llei de la Pedra Seca.

---

## 1. Barra Principal (`Header.jsx` - Global Header / Navbar)
La barra principal de l'aplicació, definida en `src/components/Header.jsx`. Manté una arquitectura de cal i ferro fos (Fons fosc i lletra clara per excel·lència).

### Desglossament de Nodes (Llei Pedra Seca)
- `<header>`: *Contenidor Arrel*. Bloc de 64px d'alçada (`h-[64px]`), fix (`z-50`) i separació Flex `justify-between` per dividir l'espai.
  - `<div>`: **Costat Esquerre (Navegació Arrel)**
    - `<button Menu>`: Disparador Menú Lateral (Drawer).
    - `<NavLink>`: Ancoratge que conté el logo oficial (`logo-socdepoble-rect.svg`).
  - `<div>`: **Costat Dret (Eines Escoltes i Control d'Usuari)**
    - `LanguageSelector`: Amagat en mòbils, actiu en desktop.
    - `<button IAIAIcon>`: Disparador del Protocol de Visió.
    - `<button Search>`: Activa la cerca global intel·ligent.
    - `<button Sun/Moon>`: Canvi de Tema.
    - `<div Avatar> / <button Register>`: Controls de l'usuari actiu (Avatar) o botó d'accés (si desconegut).

### Observacions per Refactorització:
- Ara mateix utilitzem estructures nues `<div>` en comptes dels nous àtoms encapsulats del sistema (*GEM MODERN*).
- Hi ha declaracions i flexions definides llargament via `className` que dificulten l'escaneig visual si el `Header` creix més.

---

*(Noves seccions i blocs de l'UI s'afegiran conforme avancem en l'Auditoria junt amb el Mestre).*

---
name: arquitectura-pedra-seca
description: Estàndards de disseny, maquetació, Tailwind, CSS i tokens per al projecte Sóc de Poble. (Inclou Jerarquia, CSS i Registre Tokens Únic).
authority: Consell de les 11 IAs
version: V22
created_at: 260628_0525
updated_at: 260629_0215
aliases:
  - CSS
  - Tailwind
  - Pedra Seca
  - Maquetació
  - Tokens
---

# 🧱 SKILL: Arquitectura Pedra Seca (CSS i Tailwind)

> **Visió del Consell d'IAs:** Aquesta habilitat s'ha auditat per garantir que l'estètica del Mas no es contamine amb pedaços genèrics. Activa aquesta SKILL automàticament sempre que l'usuari demane dissenyar, modificar la UI o tocar aspectes de maquetació del projecte *Sóc de Poble*.

## 🎯 Objectiu
Garantir una construcció sòlida on l'estructura (Tailwind) i l'estètica (CSS Vanilla amb Tokens) convisquen sense xocar. L'arquitectura "Pedra Seca" significa construir pedra sobre pedra, **sense cap mena d'amalgama o ciment extern**.

---

## 🛠️ Normes i Funcions de Maquetació

### 1. La Llei de Ferro: Cos (Tailwind) vs Vestit (CSS)
S'ha resolt per sempre la contradicció entre Tailwind i el CSS natiu:
- **🦴 ELS OSSOS (Tailwind és OBLIGATORI):** Gestiona exclusivament flexbox, graelles, espaiats, alineació i posicionament.
- **🎨 LA PELL (CSS Pur és OBLIGATORI):** L'aspecte visual pertany a classes semàntiques (ex. `.sosp-card`). Aquestes classes utilitzen únicament **Variables CSS Corporatives**.
- 🚫 **ANTIPATRÓ LETAL:** Queda totalment prohibit hardcodejar colors de marca o mides absolutes en Tailwind (ex: `bg-[#FF7300]` o `rounded-[28px]`).

### 2. Tokens de Color Base (Variables Globals CSS)
Aquest és el CSS root definitiu on s'emmagatzemen les variables globals:

```css
:root {
  /* COLORS CANÒNICS (Base 100%) */
  --sp-black-100: #000000;
  --sp-white-100: #FFFFFF;
  --sp-orange-100: #FF7300;
  --sp-blue-100: #0984E3;

  /* ESCALA ORANGE */
  --sp-orange-80: #FF8F33;
  --sp-orange-50: #FFB980;
  --sp-orange-20: #FFE3CC;
  --sp-orange-10: #FFF1E6;

  /* ESCALA BLAU */
  --sp-blue-80: #3A9DE9;
  --sp-blue-50: #84C2F1;
  --sp-blue-20: #CEE6FA;
  --sp-blue-10: #E7F3FD;

  /* TOKENS D'ESTRUCTURA */
  --sp-radius-main: 1.75rem;
  --sp-radius-secondary: 1.125rem;
  --sp-shadow-elevate: 0 10px 30px rgba(0, 0, 0, 0.15);
}
```

### 3. Màxim Contrast Visual (Accessibilitat)
- **Fons Orange 100%**: Text obligat: **NEGRE** (`#000000`).
- **Fons Blau 100%**: Text obligat: **BLANC** (`#FFFFFF`).

### 4. Llei de Maquetació Universal (Jerarquia H1-H6)
- **H1:** Títol de Pàgina (Taronja, Centrat)
- **H2:** Subtítol
- **H3:** Nom del Document (Blau)
- **H4:** Títol Intern (Taronja)
- **H5:** Subsecció (Blau)
- **H6:** Kicker / Preàmbul (Negre i Negreta)
**PROHIBICIÓ `<hr>` (---)**: Les línies horitzontals sense criteri embruten l'arquitectura.

### 5. Prohibició de Fantasmes Visuals
L'HTML ha de ser purament semàntic. Prohibit utilitzar `<br>`, `<hr>` o `<div>` buits. L'oxigen es crea amb variables d'espaiat CSS o `gap-*`.

### 6. Prohibició de Layout Thrashing (Animacions)
Per garantir el rendiment absolut a l'iPad A10, **es prohibeix animar propietats que afecten el Layout** (com `width`, `height`, `margin`, `top`, `left`). Totes les animacions han de ser subtils i basar-es únicament en `opacity` i `transform`.

### 7. Tipografia Oficial
La font tipogràfica oficial de Sóc de Poble és **Noto**. Qualsevol altra font està prohibida.

### 8. PWA i SEO Offline-First
La càrrega inicial no depén del núvol, no carregar llibreries UI pesades com Shadcn.


---
## 🔗 Veure també
- [[00_index|Índex Central]]

---
tags: [disseny, css, wcag, ui, pedra-seca]
aliases: [Pedra Seca Specs, Sistema de Disseny]
---
# Pedra Seca Design System (Tècnic PWA)

Aquest document estableix la Llei Estructural, Tokens i Sistema de referència per a aplicacions Sóc de Poble (A10-Optimitzat). Tota definició és "Llei de Ferro" seguint el [[El_Trellat|Trellat]] i pot copiar-se com a *CSS root*.

## 1. Tokens de Color Base (Variables Globals CSS)

Establiment de l'escala de "Tints" matemàtica, solucionant errors històrics documentats, assegurant un ús coherent tant a fons com a vores ("Mode Bancal").

```css
/* ELS TOKENS ES DEFINEIXEN AL FITXER ÚNIC: tokens/design-tokens.json */
/* No redefinir valors fixos com #FF7300 o 28px ací per evitar col·lisions. */
/* S'han d'importar o generar dinàmicament al CSS arrel de l'aplicació. */
```

## 2. Validació WCAG (Llei d'Accessibilitat Visual AAA)

Al dissenyar pantalles sota el sol ("Mode Bancal" per entorns rurals amb iPad):

- **Fons Orange 100% (`#FF7300`)**: Text obligat: **NEGRE** (`#000000`). Contrast Ratio aproximat: **8.5:1** (Supera sobradament el 7:1 obligatori pel AAA). NO ES POT POSAR TEXT BLANC ací, cauria baix del ratio acceptable (~2.4:1).
- **Fons Blau 100% (`#0984E3`)**: Text obligat: **BLANC** (`#FFFFFF`). Contrast Ratio aproximat: **4.8:1** (APTE per a AA en text petit i AAA en text gran d'encapçalament >18pt).


## 3. Diccionari "Trellat" (Ex-Anglicismes i Accions d'Estats)

Tota la definició oficial d'estats interactius (Hover, Active, etc.) i components de front-end (Toast, FAB, Modal) es troba centralitzada a l'única font de veritat: [[Diccionari Trellat]].

### Exemples Estats Botó Genèric (Vainilla CSS)
L'optimització de termodinàmica pura per PWA (zero scripts nocius d'animació Javascript complexes, utilitzant només renders purs CSS del navegador del xip A10):
```css
.btn-trellat-primary {
  background-color: var(--sp-orange-100);
  color: var(--sp-black-100);
  border-radius: var(--sp-radius-main);
  padding: 1rem 1.5rem; /* Ajust autoescalable a mides grans per a dits robustos */
  font-weight: 700;
  transition: all 0.2s ease-in-out; 
}

/* Surar (Hover) */
.btn-trellat-primary:hover {
  background-color: var(--sp-orange-80);
  transform: translateY(-2px); /* Eleva sense rebombori pesat de CPU */
  box-shadow: var(--sp-shadow-elevate);
}

/* Premut (Active) */
.btn-trellat-primary:active {
  background-color: var(--sp-orange-100); /* Restableix a fons principal d'impacte */
  transform: translateY(1px); /* Contacte mecànic d'apretó */
  box-shadow: none; /* Apaga l'ombra */
}

/* Sec (Disabled) */
.btn-trellat-primary:disabled {
  background-color: var(--sp-orange-20);
  color: rgba(0, 0, 0, 0.4);
  cursor: not-allowed;
  transform: none;
}

@media (prefers-reduced-motion: reduce) {
  .btn-trellat-primary,
  .btn-trellat-primary:hover,
  .btn-trellat-primary:active {
    transition: none;
    transform: none;
    animation: none;
  }
  
  /* Desactivar tota animació CSS al Mas */
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## 4. Estacionament Tàctic (Breakpoints de Reforç per IA)
La PWA opera per defecte sota "Mobile-First" amb disseny fluïd, però respon mecànicament a:
1. `--bp-esmentat` o `max-width: 480px`: Telèfon mòbil estàndard d'alqueria.
2. `--bp-tauleta` o `min-width: 768px`: Entrada en joc del "Barral Lateral" (La Roca) deixant anar el *Drawer* ocult. Optimització bàsica iPad A10 Vertical.
3. `--bp-gran` o `min-width: 1024px`: Desktop panoràmic. El plafó central assoleix ample fix o maximitza a calaixos multi-informatius (ex. Llista Pàgina Esquerra, Detall Dreta).

## 5. Llei de Maquetació Universal (Jerarquia H1-H6)
Tota la jerarquia estricta de títols (H1, H2, H3, H4, H5, H6), la prohibició de línies decoratives `<hr>` i l'agrupament de llistes es troba catalogada seguint [[Els 10 Manaments]].

## 6. Antipatrons: La Traïció vs El Trellat (Llista Negra)

### 🚫 AÇÒ NO (Tailwind Tòxic)
- `className="bg-[#FF7300] text-white rounded-[28px] p-6 shadow-lg"`
  *Raó:* Codi inflexible, mescla estètica amb estructura, colors i radis hardcodejats, i viola l'accessibilitat WCAG Bancal.
- `<h2>Festes</h2> <hr className="my-8" /> <p>Inici</p>`
  *Raó:* L'etiqueta `<hr>` (fantasmes visuals) està prohibida.

### ✅ AÇÒ SÍ (Arquitectura Sóc de Poble)
- `<article className="flex flex-col gap-4 w-full sosp-card">`
  *Raó:* Tailwind només maqueta l'espai (ossos). La classe genèrica `.sosp-card` gestiona la pintura (pell).
- `margin-top: var(--sp-espai-4)`
  *Raó:* Ús de l'escala oficial d'espaiat (Carrer).

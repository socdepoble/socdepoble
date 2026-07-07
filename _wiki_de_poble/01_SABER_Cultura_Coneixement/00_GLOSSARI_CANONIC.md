---
script:
  - '[[fetch_town_media.mjs]]'
estat: 'canonic'
name: 'glossari'
version: '14.00'
created_at: '260705_0445'
updated_at: '260705_0445'
autor: 'Petorretes i Javi'
categoria: 'glossari'
description: '📚 GLOSSARI CANÒNIC I DICCIONARI DE LA LLENGUA DEL MAS'
tags:
  - cultura
  - normativa
---
# 📚 GLOSSARI CANÒNIC I DICCIONARI DE LA LLENGUA DEL MAS
*Font Única de Veritat. Tota comunicació interna, codi, interfícies i textos han d'usar aquests termes.*

## 🗣️ TERMINOLOGIA TÈCNICA (Anglès → Valencià)

### Estats d'Interfície
| Anglès | Valencià Canònic | Context |
|--------|------------------|---------|
| `Hover` | **Surar** | quan sure sobre l'element |
| `Active` / `Pressed` | **Premut** | Estat de contacte tàctil |
| `Disabled` | **Sec** / **Desactivat** | Element no interactuable |
| `Focus` | **Enfocat** | Navegació per teclat |
| `Blur` | **Desenfocat** | Pèrdua de focus |

### Components d'Interfície
| Anglès | Valencià Canònic | Notes |
|--------|------------------|-------|
| `Snackbar` / `Toast` | **Avisador Efímer** | Bafarada temporal < 5s |
| `FAB` | **Botó Cúspide** | Botó flotant primari |
| `Dropdown` | **Llistat Caient** | Menú desplegable |
| `Header` | **Capçalera** | |
| `Sidebar` | **Barral Lateral** / **La Roca** | Navegació fixa en desktop |
| `Drawer` | **Calaix** | Panel lateral mòbil |
| `Modal` | **Finestra Modal** | |
| `Tooltip` | **Indicador Flotant** | |

### Accions
| Anglès | Valencià Canònic |
|--------|------------------|
| `Scroll` | **Desplaçar** |
| `Swipe` | **Lliscar** |
| `Tap` | **Tocar** |
| `Pinch` | **Pessigar** |
| `Drag` | **Arrossegar** |
| `Connect / Like / Save` | **Connectar** (Anti-likes) |

## 🌿 METÀFORES RURALS (Compressió Semàntica)
| Metàfora | Concepte Tècnic | Descripció |
|----------|-----------------|------------|
| **La Persona i el Vestit** | HTML/CSS | Les dades són "La Persona", l'estil "El Vestit". Prohibit Tailwind als components estructurals. |
| **Pedra Seca** | Resiliència i Soliditat | Construir per a durar. SEO honest mitjançant accessibilitat. Sense argamassa (pegats). |
| **La Sèquia Mare** | Flux de Dades | Async Batching offline-first amb Y.js i difusió de tokens de disseny. |
| **Esporgar l'Olivera** | Neteja de deute tècnic | Eliminar components "fantasma" per baixar l'entropia. |
| **El Molí Fariner** | Lazy Chunking | Processar dades en lots per no saturar memòria. |

## ⚠️ EXCEPCIONS ESTRATÈGIQUES (NO TRADUIR)
- **Protocols:** WebRTC, CRDT, IndexedDB, HTML, CSS, JSON, UUID, OPFS
- **Llibreries/Codis:** Vanilla JS, React (si fos inevitable), Yjs, DOMPurify, Zod
- **Marques:** iPad, Apple, Google, Gemini, Tailwind (només excepcionalment)

## ⚙️ CONCEPTES TÈCNICS CLAU (Ecosistema Sóc de Poble)
| Concepte | Signes vitals | Descripció |
|----------|---------------|------------|
| **CRDT** | *Conflict-free Replicated Data Type* | La llibreta d'apunts descentralitzada. Permet escriure offline; en recuperar la connexió, les dades de tots s'ordenen soles sense xocar ni esborrar-se. |
| **OPFS** | *Origin Private File System* | El rebost natiu, privat i ultra-ràpid del navegador. Evita els col·lapses d'IndexedDB, i serveix per a guardar els snapshots i la base de dades local. |

## 🖋️ LA SIGNATURA GRÀFICA
En generar imatges amb el model Nano Banana, s'ha d'incrustar: *"© Sóc de Poble. Fet per la IAIA i Nano Banana"*.

**Sinapsis:** [[Arquitectura_Directives]], [[00_BIOS]], [[00_visio_i_pilars]], [[01_trellat]]


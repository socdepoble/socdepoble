---
estat: "canonic"
tipus: "document"
description: "Font Única de Veritat. Tota comunicació interna, codi, interfícies i textos han d'usar aquests termes."
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
| **La Sèquia Mare** | Flux de Dades | Metàfora per a un flux de dades ordenat. Una eventual sincronització amb Yjs és futura i no forma part de la baseline actual. |
| **Esporgar l'Olivera** | Neteja de deute tècnic | Eliminar components "fantasma" per baixar l'entropia. |
| **El Molí Fariner** | Lazy Chunking | Processar dades en lots per no saturar memòria. |

## ⚠️ EXCEPCIONS ESTRATÈGIQUES (NO TRADUIR)
- **Protocols:** WebRTC, CRDT, IndexedDB, HTML, CSS, JSON, UUID, OPFS
- **Llibreries/Codis:** Vanilla JS, React (si fos inevitable), Yjs, DOMPurify, Zod
- **Marques:** iPad, Apple, Google, Gemini, Tailwind (només excepcionalment)

## ⚙️ CONCEPTES TÈCNICS DE REFERÈNCIA (NO IMPLEMENTACIÓ ACTUAL)

Estos termes es conserven per poder parlar de possibles fases futures. La seua presència al glossari no prova que existisquen al codi ni els convertix en requisit.

| Concepte | Significat | Descripció |
|----------|---------------|------------|
| **CRDT** | *Conflict-free Replicated Data Type* | Família d'estructures per reconciliar edicions distribuïdes. És una opció futura que exigix model d'identitat, privacitat, purga i proves de conflicte. |
| **OPFS** | *Origin Private File System* | API privada de fitxers del navegador. Només s'usarà si una decisió futura en justifica compatibilitat, recuperació i migració. |

## 🖋️ LA SIGNATURA GRÀFICA
En generar imatges amb el model Nano Banana, s'ha d'incrustar: *"© [[el_projecte|Sóc de Poble]]. Fet per la IAIA i Nano Banana"*.


## Taxonomia
- **Categoria:** [[Coneixement]]
- **Etiquetes:** [[Graf]]

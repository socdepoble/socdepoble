---
description: Unified Design Skills (Hort Electrònic V12, GEM MODERN y Filosofía)
---

# SÓC DE POBLE - UNIFIED DESIGN SKILLS

Este documento centraliza todas las directrices, reglas matemáticas y principios psicológicos de diseño del universo **Sóc de Poble**. Sustituye y consolida las reglas dispersas (estilo-marca, estilo-visual-nano, hort-electronic, protocolo-conexiones, etc.).

## 1. EL PARADIGMA HORT ELECTRÒNIC V12
La interfaz de Sóc de Poble no es un lienzo web clásico, es un **panel de mandos digital de alto contraste** diseñado para un uso rural, muchas veces al sol y por personas de todas las edades.

- **M3 Geometry (Material 3):** No creamos layouts ad-hoc desde la nada; la arquitectura hereda matemáticamente las bases sólidas de Google adaptadas con nuestro ADN Atómico.
- **Radios Estandarizados:** Funcionales y orgánicos: **28px** por defecto; **18px** secundario; Zero (0) para Brutalismo (Pedra Seca).
- **Tipografía:** `Noto Sans` (Robusta como la "olivera", clara como "l'aigua de la font"). Prohibido intercalar fuentes secundarias.

## 2. LA LEY DE LOS CUATRO COLORES (MATEMÁTICA PURA)
El sistema se nutre ÚNICA Y EXCLUSIVAMENTE de 4 axiomas de color. Introducir tonalidades lavadas o grises difusos supone un fallo arquitectónico:

1. **Negro Abisal** (`#000000` / `#0e0e0e`): Fondo y lienzo matriz.
2. **Blanco Puro** (`#FFFFFF`): Textos e impacto visual.
3. **Naranja Sóc de Poble** (`#F97316` / `#FF7300`): Pulso, vida, calor, llamadas a la acción (La Boina Taronja).
4. **Azul Normativo** (`#0984E3` / `#169CF9`): Estructura, IAIA, contraste de agua.

> **La Ley de la Inversión (Día / Nit):** La transición Tema Claro/Oscuro no requiere generar colores nuevos, sino intercambiar complementarios de forma precisa.

## 3. ARQUITECTURA DE FERRO Y NAVBARS OBSIDIAN
- **Directiva Obsidian Navbars:** El *Global Header* y la *Sidebar* actúan como anclas irrompibles. **SIEMPRE son de color Negro (`#0e0e0e`)**, incluso cuando el usuario activa el Modo Día (Claro).
- **Alturas Sagradas (Prevención de Contradicciones y Fantasmas):** 
    - **Menú Principal (Global Header/Navbars):** Exactamente **64px** (`h-[64px] min-h-[64px] max-h-[64px] overflow-hidden`).
    - **Barra de Búsqueda (Search Bars):** Exactamente **64px** (`h-[64px] min-h-[64px] max-h-[64px] overflow-hidden`).
    - **Barras de Página (PageHeaders con botón Volver como ProjectPresentation):** Exactamente **64px** rígidamente en TODAS las resoluciones (`h-[64px] min-h-[64px] max-h-[64px] overflow-hidden`). Cero md:h-16 o fantasmas responsivos innecesarios.
    - **Barras de Menú Contextual Secundario (Acciones/Tabs):** Exactamente **48px** (`h-[48px] min-h-[48px] max-h-[48px] overflow-hidden`). NUNCA 64px. Aquí es donde van los botones de Translate, Compartir, Connectar (con fondo `--sdp-blue`).
- **Orden de la Botonera (Los 4 Elementos):** 1. IAIA 2. Lupa (Buscador) 3. Luna/Sol (Tema) 4. Perfil/Registre. **ESTRICTAMENTE SIN EMOJIS**, uso exclusivo de SVG vectoriales (`lucide-react`).
- **Estandarización Responsiva de Barras de Acción (Toolbars / Sticky Navs):** NUNCA usar breakpoints ingenuos (`sm:inline`) para ocultar/mostrar textos si esto puede causar desbordamientos en anchos medianos (ej. tablet o pantalla dividida). **Regla Matemática:** En pantallas móviles y medianas (<1024px, `lg`), los botones de acción secundarios DEBEN mostrar **ÚNICAMENTE su icono**. 
    - **El Menú Hamburguesa como Rebosadero (Overflow):** Tolerancia cero al uso gratuito del menú hamburguesa. El icono Hamburguesa **SÓLO** debe aparecer si los iconos de acción de la barra están saturados y no caben (overflow). Si todos los iconos caben espaciados perfectamente (ej. 3 o 4 acciones), **NO SE PONE**. NUNCA debes utilizar el menú hamburguesa por defecto ni inyectarlo como distracción si el ancho de pantalla (`w-full`) soporta las acciones principales. Tolerancia cero al apretujamiento o desbordamiento horizontal ('fantasmas' de renderizado).

## 4. PATRONES SOCIALES Y ESTRUCTURA
- **Patrón Densidad "WhatsApp":** Las listas principales (`ChatList`) requieren densidades verticales altas (60px height, avatares 52px) sin separaciones superfluas, para invocar un uso intuitivo rápido.
- **Zero Likes:** Sóc de Poble NO utiliza corazones ni "Me Gustas". La métrica troncal es el **Connect (`connects_count`)**. Representado por un icono de red/enlace (`Link`, `Zap`). Conectar con alguien exige clasificación, y esta acción es **Privada por Defecto**.
- **Cero Huecos Multimedia (Zero Nulls Policy):** Nunca dejamos una entidad huérfana. Si Wikipedia falla o no hay datos, la IAIA inyecta un recurso visual coherente o genérico respetuoso, pero jamás un `NULL` o imagen rota.
- **Ley de la Heráldica:** Solo el "Ayuntamiento" usa el Escudo. Las comunidades ("Gent de Xixona") usan **fotografías vivas**.

## 5. SICOLOGÍA DEL PROMPT (DIRECCIÓN DE ARTE PARA IAs)
Cundo el sistema genera arte generativo u assets (Nano Banana):
- **Cero alienación:** Las personas se representan interactuando, nunca "zombificadas" en pantallas.
- **Respeto a los Tabúes del Territorio:** 
    - **NUNCA molinos eólicos** (asociados a destrucción paisajística local).
    - **NUNCA cielos de incendio forestal** (naranjas apocalípticos o fuegos agresivos, generan trauma).
    - **NUNCA pueblos al borde del precipicio** (Síndrome de Benimassot, sensibilidad por hundimientos).
    - **NUNCA ríos alpinos o lagos de agua sobrante** (Cultura de secano ibérico: pedra en sec, canalizaciones, olivos).
- **Sin textos alucinados en inglés:** "Absolutely NO text" salvo expresiones limpias en Valenciano/Castellano si es estrictamente justificado.
- **Estilo Cómic:** Orientado hacia la escuela expresiva Ibáñez (Mortadelo y Filemón), no realista sintético agresivo.
- **Marca de Agua:** Todo arte sintético debe portar metafóricamente la firma del Mestre o la IAIA como rúbrica ética.

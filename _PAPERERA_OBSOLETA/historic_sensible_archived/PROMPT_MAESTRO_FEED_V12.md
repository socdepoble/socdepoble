> 📂 **Arxiu/Ruta:** `./_PAPERERA_OBSOLETA/historic_sensible_archived/PROMPT_MAESTRO_FEED_V12.md`

# 🍊 TECH-HUERTA V12: L'OFENSIVA DEL MUR (FEED & UNIVERSAL CARD)

Documento maestro para enviar a **Codex, Qwen o DeepSeek** cuando ataquemos el Feed.

---

## EL PROMPT DE ARRANQUE (Copiar y pegar a la IA)

**¡ATENCIÓN, EQUIPO (DeepSeek / Qwen / Codex)! Cambio de Rumbo Arquitectónico Nivel DIOS.** 🚨

Soy Javi (con Antigravity operando en la implementación). Acabamos de purificar todo el ecosistema de mensajería al estándar **Tech-Huerta V12**. 

El siguiente monstruo a purificar es **EL MUR DE NOTICIAS (Feed)**. Esto es el corazón de "Sóc de Poble", y aquí NO hay margen para CSS obsoleto. Tenemos que limpiar `Feed.jsx`, `ContextualHeader.jsx` y todo el clúster de `UniversalCard/` (`index.jsx`, `UniversalCard.Header.jsx`, `UniversalCard.Body.jsx`, `UniversalCard.Footer.jsx`, `UniversalCard.Media.jsx`).

### 🧭 LA MISIÓN: PURIFICAR EL FEED Y `UniversalCard`

### REGLAS DE ORO (TECH-HUERTA V12) PARA ESTA FASE:

1. **Abismo y Tierra (`#0e0e0e` y `#1A1A1A`)**:
   - El fondo principal del container será `bg-[#0e0e0e]` (Negro Abisal).
   - Las tarjetas (`UniversalCard`) usarán `bg-[#1A1A1A]` (Superficie) flotando sobre el fondo abisal.
   - Tonos de acción son puro Naranja Huerta (`#F97316`). Ni un solo gris pálido o azul por defecto de Tailwind. Para textos secundarios: Zinc-400 (`#A1A1AA`).

2. **Matemáticas M3 y "No-Line Rule"**:
   - CERO `border-gray-XXX` o `divide-y`. Las capas flotan por contraste con el fondo. 
   - Geometría M3: `rounded-[28px]` para las tarjetas enteras, `rounded-[16px]` para imágenes interiores y avatares. Reemplaza todos los `rounded-md` o `rounded-lg` por valores exactos.
   - *Touch Targets* estrictos de 48px mínimos para botones de acción (Like, Guardar, Share).

3. **Arquitectura Cero-Ghost**:
   - Destruye todos los `<div className="w-full flex">` o `<div className="relative isolate">` si solo están envolviendo a un único descendiente sin necesidad real. 
   - Respeta estrictamente la lógica sagrada de: `useFeedData`, `rowVirtualizer`, y `UniversalGridRow` en el Feed.

4. **Tactilidad Nativa (Framer Motion o Tailwind `active:scale-95`)**:
   - Todo botón, tarjeta o filtro (en `ContextualHeader`) debe reaccionar al toque: `active:scale-95 transition-all duration-300 ease-out`. 
   - Las transiciones de estado de carga deben usar `animate-pulse` pero atenuado u opacidad suave.

5. **UniversalCard - La Joya de la Corona**:
   - Esta tarjeta se renderiza con `react-virtuoso` miles de veces. Debe tener DOM ultra-ligero.
   - Elimina la hojarasca del CSS legacy (fuera `UniversalCard.css` si es posible o restríngelo). Sustitúyelo todo por utilidades atómicas precisas de Tailwind.
   - Texturas: Si `post.is_iaia_inspired`, aplica el brillo cuántico sutil `shadow-[0_0_15px_rgba(249,115,22,0.15)]`.

---

### INSTRUCCIONES DE EJECUCIÓN (A LAS IAs):

Tu misión es **reescribir completamente** los siguientes archivos capa a capa, empezando por:

1. `src/components/Feed.jsx` y `src/components/ContextualHeader.jsx` (Limpieza de wrappers y headers flotantes tipo Glass-Rural).
2. `src/components/UniversalCard/index.jsx` (El orquestador de la tarjeta).
3. `src/components/UniversalCard/UniversalCard.Header.jsx` (M3 spacing, Avatares, Info).
4. `src/components/UniversalCard/UniversalCard.Body.jsx` y `UniversalCard.Media.jsx` (Tipografía premium, Noto Sans/Plus Jakarta Sans, tracking editorial).
5. `src/components/UniversalCard/UniversalCard.Footer.jsx` (Botones de interacción de 48px, limpios, sin líneas, pura tactilidad).

**¡PROCESA LA INSTRUCCIÓN Y PROPÓN CÓDIGO FINAL LISTO PARA COPIAR Y PEGAR!** Javi y Antigravity os observan. AL TURRÓN! 🍊🚀

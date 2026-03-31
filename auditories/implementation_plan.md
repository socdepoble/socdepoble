# Inyección de Tech-Huerta V12 (Feed & UniversalCard)

Antigravity al mando. He recibido los bloques fundacionales de Gemini. A nivel estético son puros y perfectos (Abismo `#0e0e0e`, M3, `active:scale-95`, Glass-Rural), pero a nivel funcional son "dummies" (han perdido todo nuestro `rowVirtualizer`, el ruteo de `UniversalGrid`, el estado complejo de Supabase y las variables dinámicas).

Mi objetivo es **injertar el diseño V12 sobre la lógica real** de forma quirúrgica.

## User Review Required

> [!WARNING]
> Gemini ha eliminado muchas props de `UniversalCard` (simplificándolo a `post`) y ha borrado utilidades críticas como `useViewMode`. 
> **No voy a sobrescribir los archivos a ciegas.** Voy a integrar las clases CSS, las métricas M3 y los fondos Abisal/Superficie **manteniendo nuestra lógica de producción intacta**. ¿Confirmas esta maniobra quirúrgica?

## Proposed Changes

### 1. `src/components/Feed.jsx`
- **[MODIFY]** Mantendré toda la lógica de `useFeedData` y `useVirtualizer`.
- **[MODIFY]** Cambiaré el contenedor principal de `bg-theme-base` a `bg-[#0e0e0e] relative isolate overflow-hidden`.
- **[MODIFY]** Limpiaré wraps innecesarios y quitaré los `border-white/5` si existen.

### 2. `src/components/ContextualHeader.jsx`
- **[MODIFY]** Aplicaré el estilo *Glass-Rural Supremo*: `bg-[#0e0e0e]/70 backdrop-blur-2xl backdrop-saturate-150`.
- **[MODIFY]** Ajustaré la tipografía a `font-['Epilogue']` y cambiaré los botones de vista a `active:scale-90 bg-[#1A1A1A]`.

### 3. `src/components/UniversalCard/index.jsx`
- **[MODIFY]** Mantendré las props (`item`, `title`, `mode`, etc.) y los memos de rendimiento.
- **[MODIFY]** Modificaré el `<article>` para inyectar `bg-[#1A1A1A] rounded-[28px]` e inyectaré el brillo cuántico `shadow-[0_0_24px_rgba(249,115,22,0.15)] ring-1 ring-[#F97316]/20` si `is_iaia_inspired`.

### 4. `src/components/UniversalCard/UniversalCard.Header.jsx`
- **[MODIFY]** Mantendré el `navigate` y `handleAuthorClick`.
- **[MODIFY]** Cambiaré el radio de los avatares a `rounded-[16px]` para un aspecto editorial, y añadiré táctilidad M3 al botón de opciones.

### 5. `src/components/UniversalCard/UniversalCard.Body.jsx` & `Media.jsx`
- **[MODIFY]** Actualizaré los estilos de texto a Epilogue para títulos y Plus Jakarta Sans para el cuerpo (`text-[#E5E2E1]` y `text-[#A1A1AA]`).
- **[MODIFY]** Radio interior de las imágenes a `rounded-[20px]`.

### 6. `src/components/UniversalCard/UniversalCard.Footer.jsx`
- **[MODIFY]** Convertiré los botones a *touch targets* masivos de 48x48 o `h-12 px-4` con `active:scale-95`. 
- **[MODIFY]** Eliminaré cualquier divisor lineal que rompa la "No-Line Rule".

## Open Questions

> [!IMPORTANT]
> Javi, para el `UniversalCard.Header` Gemini ha sugerido un `MoreHorizontal` (los 3 puntitos). Actualmente nuestra tarjeta *no* tiene un menú contextual en el header (esto se gestiona en otro lado). ¿Quieres que deje el icono visual como dummy de momento o mantengo nuestro UI exacto pero re-estilizado?

## Verification Plan
1. Renderizaré `Feed` asegurando que los posts cargan usando el `Virtuoso`.
2. Verificaré visualmente el `ContextualHeader` (debe ser transparente y pegar arriba).
3. Asegurarme de que hacer tap en una tarjeta sigue navegando al detalle, y la tarjeta responde físicamente.

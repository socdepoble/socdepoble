---
description: Habilidad (Skill) para forzar los estilos de marca (Llei de la Boina Taronja) en código importado desde Stitch
---

# Skill: Estilo-Marca (Llei de la Boina Taronja)

Cuando importes un código (`.html`, `.css`, o `.jsx`) nuevo diseñado por Stitch u otro agente, aplica **automáticamente** estas directivas sobre él:

1.  **Color Principal:** Asegúrate de que el color de acento es el Naranja Corporativo (`#F97316` o clases tailwind `orange-500`).
2.  **Geometría:** Verifica que todos los radios de esquinas (`border-radius`) de los contenedores principales y modales mantengan la directiva de la marca: `28px` (`rounded-[28px]`), y elementos secundarios en `24px` o `20px`. No dejes radios extraños como `8px` o genéricos.
3.  **Tipografía:** Asegúrate de que la fuente base es la fuente de Google `Noto Sans` (o la definida globalmente en variables como `var(--font-brand)`).
4.  **Modo Dual (Oscuro/Claro Canónico):** La aplicación debe arrancar por defecto en **Modo Claro** para maximizar la adopción de usuarios. **REGLA DE ORO:** En el Modo Claro, las barras laterales y cabeceras DEBEN ser claras/blancas, jamás se deben forzar a negro (`#000`). El estilo oscuro premium y espejado (glassmorphism `bg-[#111]`, `backdrop-blur`) se reserva EXCLUSIVAMENTE para cuando el usuario active el Modo Oscuro.
5.  **Logos Vectoriales (El Estándar SVG):** Utiliza SIEMPRE archivos `.svg` para logotipos e iconografía corporativa en lugar de PNGs pesados o borrosos si están disponibles en `public/assets/master/`. El SVG es inmensamente superior (escalado perfecto, menor peso y manipulación mágica de colores vía CSS con `fill="currentColor"`).
    - **NOTA ESTRATÉGICA DEL USUARIO:** Todo archivo `.svg` proporcionado por el usuario (Javi) **es 100% vectorial**. El usuario JAMÁS incrustará imágenes rasterizadas (PNG/JPG) dentro de un archivo SVG. Puedes operar bajo la garantía rotunda de que todos los SVGs del proyecto son matemáticamente puros.

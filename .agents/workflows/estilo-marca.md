---
description: Habilidad (Skill) para forzar los estilos de marca (Llei de la Boina Taronja) en código importado desde Stitch y comportamiento estructural global.
---
# Estilo de Marca y Reglas de Arquitectura UI (Sóc de Poble)

1. **La Barra Principal (Global Header)**
   - El logotipo de Sóc de Poble (junto a los controles generales superiores en `Header.jsx`) **ESTÁ ESTRICTAMENTE PROHIBIDO QUE DESAPAREZCA** de la vista principal o del hub de chats (`/chats`).
   - La *única excepción absoluta* donde se permite oculta esta cabecera central es dentro de la pantalla individual de conversación directa `ChatDetail` (P2P o interactuando con un agente específico como la IAIA), única y exclusivamente para ahorrar espacio físico en pantalla.
   - En cualquier otra pantalla, listado o interfaz de la aplicación, el Global Header debe permanecer visible, inamovible y con su jerarquía estructural intacta.
   - Si creas nuevas pantallas, nunca introduzcas lógica que oculte el Header global a menos que el usuario lo solicite expresamente y asuma la responsabilidad.

2. **Jerarquía Visual y Cero Fantasmas**
   - Elementos como avatares y logos en `ProfileView` o `UniversalCard` exigen contundencia formal (por ejemplo, avatares redondos, "glassmorphism", priorización de llamadas a la acción primarias).
   - "Llei de la Boina Taronja": Evita siempre el color genérico. Emplea la paleta de variables ya definida `--theme-accent-primary` (Naranja #FF6B00 por bandera).

3. **Menú Contextual**
   - El `ContextualMenu` (XAT, GENT, GRUPS) debe mostrarse en los listados generales, pero no dentro de un contexto de tarea específica profunda (como notas o el detalle de un chat) para no ocupar un valioso espacio vertical.

4. **Modo Dual (Oscuro/Claro Canónico):** La aplicación debe arrancar por defecto en **Modo Claro** para maximizar la adopción de usuarios. **REGLA DE ORO:** En el Modo Claro, las barras laterales y cabeceras DEBEN ser claras/blancas, jamás se deben forzar a negro (`#000`). El estilo oscuro premium y espejado (glassmorphism `bg-[#111]`, `backdrop-blur`) se reserva EXCLUSIVAMENTE para cuando el usuario active el Modo Oscuro.

5. **Logos Vectoriales (El Estándar SVG):** Utiliza SIEMPRE archivos `.svg` para logotipos e iconografía corporativa en lugar de PNGs pesados o borrosos si están disponibles en `public/assets/master/`. El SVG es inmensamente superior (escalado perfecto, menor peso y manipulación mágica de colores vía CSS con `fill="currentColor"`).
   - **NOTA ESTRATÉGICA DEL USUARIO:** Todo archivo `.svg` proporcionado por el usuario (Javi) **es 100% vectorial**. El usuario JAMÁS incrustará imágenes rasterizadas (PNG/JPG) dentro de un archivo SVG. Puedes operar bajo la garantía rotunda de que todos los SVGs del proyecto son matemáticamente puros.

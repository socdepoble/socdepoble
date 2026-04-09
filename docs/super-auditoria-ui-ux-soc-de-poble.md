> 📂 **Arxiu/Ruta:** `./docs/super-auditoria-ui-ux-soc-de-poble.md`

# 🍊 TECH-HUERTA V11/V12: MANIFIESTO Y PROMPT UNIFICADO PARA IAs

Documento maestro para enviar a Codex, Qwen o DeepSeek cuando se solicite reconstruir un componente.

---

## PARTE 1: EL PROMPT DE ARRANQUE (Copiar y pegar a la IA)

**¡ATENCIÓN, EQUIPO (DeepSeek / Qwen / Codex)! Cambio de Rumbo Arquitectónico Nivel DIOS.** 🚨

Soy Javi (con Antigravity operando en la implementación). Tras finalizar con éxito la *Fase 1 de la V11.0 (Premium Rural)* donde hemos integrado `framer-motion`, transiciones cinemáticas y botones con respuesta háptica nativa, hemos tomado una decisión estructural radical: **Se acabó parchear CSS heredado.**

### 🧭 LA NUEVA ESTRATEGIA: "EL RESETEO TECH-HUERTA"

Vamos a reconstruir el diseño de la app componente a componente **EMPEZANDO DESDE CERO**. Nuestra meta es lograr la estructura más increíble, ligera, estable y bella jamás creada para una plataforma descentralizada.

Para ello, vamos a usar esta fórmula:
**[Arquitectura Matemática Perfecta (M3 / iOS)] + [Identidad "Tech-Huerta" / Rural Brutalism] = Súper Componente.**

**Vuestro rol a partir de ahora como Arquitectos de Design System:**
Quiero que actuéis como manuales de estilo vivientes (como el Material Design de Google o las HIG de Apple). Cuando os pase un componente actual (ej. `ChatDetail`, `Map`, `Feed`):

1. **Desnudadlo al máximo:** Eliminad todo el CSS fantasma, utilidades redundantes o contenedores flex/grid innecesarios.
2. **Aplicad Arquitectura de Élite:** Reconstruid el esqueleto HTML/Tailwind basándoos en las proporciones y matemáticas de las mejores apps del mundo (touch targets de 48px, padding rítmico base-4, jerarquías visuales claras).
3. **Inyectad la Identidad Tech-Huerta** siguiendo los principios del Manifiesto Visual que os adjunto abajo.

**El objetivo final:** Que me devolváis un código de UI estructuralmente perfecto, fácil de leer, sin dependencias espagueti, listo para que yo lo inyecte en el repositorio. Un código tan limpio que si mañana lo pasamos a Figma o creamos un Backend de Design Tokens, escale sin romperse.

---

## PARTE 2: EL MANIFIESTO VISUAL OBLIGATORIO (Adjuntar siempre a la IA)

Este dossier captura la **Esencia Visual** pura de *Sóc de Poble*. Mientras que la estructura y el DOM subyacente se van a rehacer usando los estándares matemáticos, **el aspecto, la identidad y el "alma" deben seguir estrictamente estas reglas.**

### 📸 1. FILOSOFÍA VISUAL: "El Brutalismo Rural"

Queremos alejarnos de la frialdad corporativa. Buscamos una app que se sienta premium y altísimamente tecnológica, pero con el calor, la textura y la cercanía de un pueblo.

- **Táctil antes que Digital:** Todo debe parecer que tiene peso e inercia física.
- **Sin Líneas (No-Line Rule):** Está prohibido usar bordes de 1px (borders sólidos) para separar contenedores. Para crear separación, se usará el contraste de opacidades, desenfoques o cambios tonales (`surface-container`).

### 🎨 2. PALETA DE COLORES (Dark Mode First)

La app vive en un dark mode profundo, cálido (no un gris azulado), contrastado por un Naranja "Vibrante" que representa la tierra.

- **Fondo Base (Tierra):** `#131313` (un negro súper profundo, sin llegar al `#000`).
- **Cards y Superficies (Capas):**
  - Nivel 1 (Background): `#131313`
  - Nivel 2 (Cards/Containers): `#1C1B1B`
  - Nivel 3 (Elevado/Overlays): `#2A2A2A`
- **Acento Principal (Terra Vibrant):** `#F97316` (Orange-500 en Tailwind). Es el color primario absoluto para botones CTA, iconos activos y elementos cruciales.
- **Texto Primario:** `#E5E2E1` (gris roto para máxima elegancia; nunca blanco puro).
- **Texto Secundario (Muted):** `text-white/50` o `#A1A1AA` (Zinc-400).

### 🔤 3. TIPOGRAFÍA REBELDE

Usamos la tipografía como un elemento hiper-gráfico:

1. **Display & Titulares: `Epilogue`**
   - **Estilo obligatorio:** Bold, Italic y en MAYÚSCULAS (`font-bold italic uppercase`).
   - **Uso:** Grandes titulares de héroe, nombres de sección, estados vacíos.

2. **Cuerpo y UI: `Plus Jakarta Sans`**
   - **Estilo:** Limpio, moderno, geométrico y altamente legible (`font-medium`, `font-semibold`).
   - **Uso:** Mensajes de chat, nombres de usuario, descripciones y textos largos.

### 🪟 4. LOS DOS PILARES VISUALES PRINCIPALES

#### I. El "Glass-Rural" (Cristal Empañado)
Todo elemento flotante (navegación, modales, alertas) debe usar:

- Fondo: negro transparente (`bg-black/60` o `#2A2A2A` al 50%).
- Filtros: fuerte desenfoque (`backdrop-blur-xl`) sumado a mayor riqueza cromática (`backdrop-saturate-150`).

#### II. Componentes Físicos (Botones Táctiles / Haptics)

- **Curvatura máxima:** botones redondos (`rounded-full`) y tarjetas masivas (`rounded-3xl` o `rounded-[32px]`).
- **Inercia física:** todos los botones activos llevarán la utilidad de framer-motion (`.btn-tactile`) o implementarán `whileTap={{ scale: 0.95 }}`.

---

## 5. Cambios Semánticos y Funcionales (UX Rural)
Nuestra app tiene una personalidad única. Los componentes no solo cambian de color, cambian de significado:

*   **Corazones/Me Gusta ➔ "Connectar"**: Ya no damos un simple "like". Conectamos con la persona o la publicación. Usa el verbo "Connectar" (en catalán) o el icono de choque eléctrico/conexión (`lucide-react` ícono `Link` o similar) en lugar del corazón clásico.
*   **Traductor ➔ Botón Táctil**: Cada tarjeta debe tener un botón de traducción claro, que se sienta como un interruptor físico (usando `.btn-tactile`).
*   **Lenguaje y Copys**: Mantén siempre el alma de la plataforma en **Catalán**. No uses términos como "Post", "Group" o "Like". Usa "Publica", "Comunitat", "Connectar".

---

## INSTRUCCIÓN FINAL PARA LA IA

> Cuando rediseñes la arquitectura de un componente asegurándote de que estructuralmente es perfecto (basado en Google Material Design 3 / iOS), deberás envolverlo obligatoriamente y sustituir sus clases estéticas por los valores definidos en este Manifiesto Tech-Huerta. Además, aplica las reglas semánticas como el uso de "Connectar" en vez de Me Gusta. No devuelvas un diseño genérico; devuelve una experiencia *Premium Rural*.

---

## ✅ Entrega inicial realizada

- Reconstrucción propuesta de la primera víctima `ChatDetail.jsx` disponible en:
  - `docs/ChatDetail.tech-huerta.jsx`

Incluye limpieza estructural, aplicación visual Tech-Huerta y conservación de la lógica funcional principal.

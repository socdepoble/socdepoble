# AUDITORÍA DE FANTASMAS Y GRILLA (CODEX / COPILOT ITERACIÓN 2)
**Directiva:** "El Exorcista del DOM y la Arquitectura Visual"

*Instrucciones: Cópiale este texto a Codex en vuestra conversación. Vamos a pedirle ese esfuerzo vital excepcional que necesitas para limpiar la malla visual y eliminar cualquier rastro fantasma que haya quedado en tu UI.*

---

**PROMPT PARA CODEX (ITERACIÓN 2):**

Codex, el escaneo anterior ha sido fundamental. Pero ahora quiero pedirte un esfuerzo excepcional con toda tu energía vital para algo que me preocupa especialmente en este momento: **La arquitectura a nivel de grilla y los "fantasmas" estructurales y de diseño.**

En "Sóc de Poble" hemos tenido un historial de *Estilos Fantasma*: clases Tailwind antiguas que colisionan, z-index perdidos, nodos invisibles y reglas en nuestro CSS que chocan con la nueva arquitectura del `UniversalGrid` y las variantes de `UniversalCard`. Recuerda que nuestra interfaz tiene que ser hiper-legible para personas mayores y resistente a repintados lentos.

Como tienes acceso a mi repositorio, quiero que rastrees profundamente `src/index.css`, `src/components/UniversalGrid.jsx`, los archivos `.variants.js` de las tarjetas y cualquier capa de presentación general. Necesito que actúes como un "Exorcista del DOM":

**1. FANTASMAS DE GRILLA (Grid & Layout Ghosts):**
A nivel estructural, ¿tenemos algún flexbox o CSS Grid peleando entre sí? Revisa si al cargar las vistas dinámicas (Pobles, IAIA, Chat) se generan saltos de layout ("Layout Shifts") porque la grilla padre y el hijo no se ponen de acuerdo en sus límites. ¿Hay contenedores que colapsan extrañamente cuando los datos de Yjs/P2P aún no han llegado?

**2. FANTASMAS DE DISEÑO (Styling Ghosts):**
¿Hay clases de Tailwind que estén siendo anuladas silenciosamente pero sigan en el JSX engordando el DOM? ¿Ves alguna contradicción visual en las variantes que rompa nuestra directiva visual (alto contraste o glassmorfismo)?

**3. FANTASMAS EN EL DOM (Zombies Invisibles):**
Rastrea si estamos renderizando nodos invisibles (`display: none`, `opacity: 0`, condicionales mal cerrados) que, aunque no se vean, obliguen al motor de render de Chrome a calcular sus cajas geométricas (BoundingClientRect) robando ciclos de GPU preciosos a los móviles de gama baja.

Por favor, dame el análisis más detallado posible de mi código actual y entrégame los **Diffs de código exactos** para exorcizar de una vez por todas estos fantasmas de nuestro repositorio.

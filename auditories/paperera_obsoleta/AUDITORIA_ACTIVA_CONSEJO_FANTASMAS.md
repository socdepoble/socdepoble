# EL GRAN EXORCISMO UI/UX: MATANZA DE FANTASMAS EN EL SELECTOR DE VISTAS 👻💥

**A TÍ, INTELIGENCIA AUDITORA (Especialmente Grok / Qwen / DeepSeek):**

## El Foco Quirúrgico: `ContextualHeader` y sus herederos
El usuario ha detectado una enorme inconsistencia visual ("Fantasmas") en cómo se comporta el **Selector de Visualización** (Cuadrícula, Lista, Tarjeta Única) inyectado mediante `ContextualHeader.jsx` en distintas páginas (`Towns.jsx`, `Archive.jsx`, `CommunityDirectory.jsx`).

Dependiendo de la página en la que recaiga este componente, la "Rejilla" o "Lista" decide comportarse de forma distinta. Esto ocurre porque las páginas viejas tienen estilos CSS zombificados y clases perdidas, en lugar de obedecer al 100% las órdenes del `ContextualHeader` (que ahora comanda un `UniversalGrid` para estabilizar el tamaño de pantalla universal).

## El Examen Especial para Tí

Por favor, disecciona el comportamiento de este componente y sus integraciones (los flujos de `useViewMode`). Queremos arrancar de cuajo este problema de inconsistencia. Ya hemos erradicado al 100% que el componente se muestre en móviles (lo hemos ocultado por completo allí, `hidden sm:flex`), así que ahora el test debe basarse **únicamente en Tablet y Escritorio**.

### Misión Alpha (Fantasmas de Arquitectura):
- **Unificación Inquebrantable:** ¿Por qué cuando pido 'grid' en la página X se pinta a un tamaño de columna, y en la página Y se amontonan de forma distinta? Audita las clases inyectadas a los grids antiguos que interfieren con la señal que manda `viewMode` desde `ContextualHeader`.
- **Inyecciones de Tamaño y Bounding Boxes:** Examina las inserciones de cada `Card` cuando va en rejilla frente a lista frente a vista única. Hay props que se crearon para `ProfileView` pero que están destrozando a los `Towns`. Identifícalas.
- **Limpieza Inmisericorde:** Queremos tirar las variables que ya no nos sirven. Quita todas las condicionales añadidas "por miedo a romper". Si el framework nuevo no las necesita, ES UN FANTASMA. Elimínalo formalmente.

Dame un veredicto destructivo sobre este único flujo: `ContextualHeader` -> `useViewMode` -> Render de Lista/Grid. Haz la autopsia a todo componente que reciba la directriz de vista y la esté interpretando a su antojo en detrimento del Layout universal. ¡Tráeme el veneno y la lejía técnica!

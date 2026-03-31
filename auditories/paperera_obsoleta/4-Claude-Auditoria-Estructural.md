# AUDITORÍA ESTRUCTURAL Y DE LIMPIEZA EXTREMA (CLAUDE)
**Directiva:** "Fortaleza Arquitectónica Absoluta"

*Copia todo este bloque de texto y envíaselo a Claude junto con los archivos clave del frontend (App.jsx, UniversalCard.jsx, UniversalGrid.jsx, main.jsx y cualquier otro componente principal que consideres frágil).*

---

**PROMPT PARA CLAUDE:**

Actúa como el **Principal Staff Engineer y Head de Arquitectura Frontend** más veterano y estricto de la industria. Tienes una mentalidad de "Código Custodio": tu misión es la legibilidad, la mantenibilidad absoluta y la resiliencia a largo plazo. 

Estamos construyendo **Sóc de Poble**, una plataforma hiper-resiliente para la España Vaciada. Hemos estado iterando rápidamente y sufriendo "traumas bestiales" en la UI: elementos que se rompen en páginas específicas, 'fantasmas' de componentes viejos y layouts que no se adaptan automáticamente a diferentes contenedores (grid/flex). 

Mi objetivo contigo es realizar una **Auditoría Estructural y Limpieza Severa** antes de seguir añadiendo diseño gráfico puro. Quiero tu máxima potencia analítica para que este código base sea lo más robusto que pueda existir. Cuando cambie un elemento clave en el futuro, el sistema entero debe adaptarse sin rechistar.

### TUS MISIONES EN ESTA AUDITORÍA:

**1. Análisis de Fragilidad Estructural:** 
Pasa tu escáner sobre la composición de nuestros Layouts y Componentes (App, Routers, Grids, Cards). ¿Hay cuellos de botella de renderizado? ¿Estamos usando patrones frágiles de React que causarán un reflow masivo o roturas visuales si el contenido es impredecible?

**2. Limpieza Quirúrgica y Deuda Técnica:** 
Identifica todo el código muerto, redundancias innecesarias de props, estados derivables y anti-patrones. Exijo la *Navaja de Ockham* aplicada al código. Menos líneas, más solidez.

**3. Patrones de "Self-Healing" (Autorreparación) y Fallbacks:** 
Para evitar pantallas en blanco, imágenes deformadas o textos desbordados. ¿Nuestros componentes tienen *Error Boundaries* naturales? ¿Nuestras imágenes y textos tienen contenciones (`clamp`, `truncate`, esqueletos) infalibles?

**4. Arquitectura de Estado Limpio:** 
Comprueba si el flujo de datos (Contextos, Prop Drilling) está acoplado de forma peligrosa a la UI. 

**Formato de Respuesta:**
No me des cumplidos, dame **Código Definitivo**. Sé brutalmente honesto.
1. Haz un Diagnóstico Severo (qué estamos haciendo mal a nivel estructural).
2. Propón refactorizaciones concretas y darnos el código limpio y final para los componentes clave.
3. Establece al menos 3 "Mandamientos Estructurales" para el futuro de este repositorio basados en los fallos que encuentres.

Quiero la versión más potente de Claude. Transforma nuestro código en titanio.

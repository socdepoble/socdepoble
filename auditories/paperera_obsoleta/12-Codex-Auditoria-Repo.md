# AUDITORÍA DE CÓDIGO E INTEGRACIÓN (CODEX / COPILOT)
**Directiva:** "El Bisturí en el Repositorio"

*Instrucciones: Copia este texto y pégalo en tu chat con Codex / GitHub Copilot. Como tiene acceso al contexto de tu proyecto y al árbol de archivos, no tienes que pegarle código, solo indicarle dónde mirar.*

---

**PROMPT PARA CODEX (ITERACIÓN 1):**

Actúa como un **Staff Engineer** especializado en integraciones de producción, resiliencia PWA y performance extrema en entornos hostiles.

Estoy desarrollando "Sóc de Poble", una plataforma digital de resistencia y soberanía tecnológica para la España Vaciada. Nuestros usuarios son agricultores, pastores y personas mayores usando móviles Android de gama baja (2GB de RAM) en zonas donde la conexión 3G cae y vuelve intermitentemente ("Efecto Túnel"). Es vital que entiendas que cada *memory leak* o cuelgue del hilo principal no es un simple bug, es dejar a un abuelo incomunicado o arruinar la batería de un agricultor en medio del campo. Nuestro código debe ser Titanio.

Como tienes acceso a mi repositorio, quiero que realices una auditoría de integración implacable sobre nuestro estado actual. Ejecuta las siguientes directivas explorando el código real del proyecto:

**ESTADO 1: LA BARRERA DE EXTRARADIO (Red y Memoria)**
Por favor, analiza `src/components/gates/LocalFirstGate.jsx`, `src/App.jsx` y `src/components/UniversalGrid.jsx`. 
A nivel estricto de código, tal y como está escrito AHORA MISMO en mi repo:
1. ¿Ves algún punto de ruptura donde una caída de red oscilante (cae/vuelve 5 veces en 10 segundos) provoque un "tearing" en nuestra cascada de hooks o deje promesas *stale* bloqueando el event loop?
2. ¿Hay algún efecto secundario (`useEffect`), listener global o cursor asíncrono que no esté siendo limpiado perfectamente y que vaya a provocar un *Out of Memory* en el navegador de un móvil tras 72 horas abierto en background?

**ESTADO 2: CÁLIDA EFICIENCIA (DOM) **
3. Revisa nuestras capas de estilos y componentes estructurales. Teniendo en cuenta el hardware limitado... ¿tenemos algún *layout thrashing* oculto, listas sin virtualizar o re-renders síncronos masivos que se puedan arreglar con código nativo o cediendo el hilo al navegador (`yieldToMain` o `startTransition`)?

**EL ENTREGABLE:**
No quiero teoría pura. Eres el integrador en el terreno. Dame tu diagnóstico crudo y, para cada vulnerabilidad real que encuentres en el código de mi repo, dame el *diff* o la porción de código exacta para repararlo. 

Somete el repositorio a la máxima presión. ¡Demuéstrame de qué estás hecho!

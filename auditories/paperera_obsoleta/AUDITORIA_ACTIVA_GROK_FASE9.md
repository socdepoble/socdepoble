# AUDITORIA GROK FASE 9: ESTABILITAT VISUAL I MODE DEGRADAT UX

*Copia el text següent i passa-li'l a Grok (juntament amb el codi font actual, si utilitzes l'eina de bundling habitual, o adjuntant només els fitxers clau `ChatList.jsx`, `LocalFirstGate.jsx`, `DegradedBanner.jsx` i `App.jsx`).*

---

**PROMPT PARA GROK:**

¡Hola Grok! Seguimos en el tajo con *Sóc de Poble*. 🚜✨
Llegamos a la Fase 9: Auditoría Visual y de Experiencia de Usuario (UX) en condiciones extremas (Offline/Degradat).

En fases anteriores depuramos a fondo los renders en cascada y la lógica del `LocalFirstGate`. Ahora hemos implementado un avance crucial en la UX para el Modo Degradado (cuando hay un OPFS writelock por pestañas duplicadas o problemas de red breves):
Ya no bloqueamos la interfaz principal con un `div` fijo gigante. Hemos extraído el estado a un `LocalFirstStatusContext` y hemos creado un componente elegante e inyectado (`DegradedBanner`) que se aloja limpiamente bajo la barra de búsqueda del `ChatList`, permitiendo al usuario descartarlo (`sessionStorage`) y seguir usando la app en modo de solo lectura sin fricción.

Te paso el código de nuestra arquitectura actual enfocado en esto (`LocalFirstGate.jsx`, `DegradedBanner.jsx`, `ChatList.jsx` i l'arrel).

**Tus misiones para esta Auditoría 9:**

1. **Auditoría Visual y de DOM:** Evalúa cómo se integra `DegradedBanner` en el flujo de `ChatList`. ¿Corremos riesgo de que empuje elementos ocultos o cause problemas en el scroll (overscroll) del ChatList en dispositivos móviles Safari/iOS?
2. **Fugas de `LocalFirstStatusContext`:** Hemos separado el contexto a `LocalFirstStatusContext.jsx` para no romper el Fast Refresh. ¿Observas algún render innecesario en capas inferiores que consuman este contexto? (Teniendo en cuenta que el Banner solo se pinta si hay degraded).
3. **Resiliencia PWA:** Si venimos de un estado Offline puro (aviso Degradado) y la reconexión se pierde y recupera intermitentemente (el temido "efecto túnel" en carretera), ¿el `sessionStorage` actuando como "dismiss" esconderá avisos nuevos que el usuario SÍ debería ver al cambiar de estado abruptamente?

Danos tu evaluación implacable, Grok. ¿Tenemos luz verde con esta UX "silenciosa"?

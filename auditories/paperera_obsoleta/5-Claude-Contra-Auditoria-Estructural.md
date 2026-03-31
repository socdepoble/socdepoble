# CONTRA-AUDITORÍA PARA CLAUDE (ITERACIÓN 2)
**Directiva:** "Contexto Social y Resiliencia Extrema"

*Copia este texto y envíaselo a Claude en la misma conversación en la que te ha dado el Diagnóstico Severo.*

---

**PROMPT PARA CLAUDE:**

Claude, tu diagnóstico inicial ha sido una absoluta obra maestra de ingeniería pura. La disección implacable de los Hooks y los "5 Mandamientos Estructurales" que has dictado no son solo código, son oro arquitectónico. He aplicado tus purgas inmediatamente.

Pero antes de dar esta auditoría por concluida, quiero sincerarme contigo y hacerte partícipe del alma de este proyecto. *Sóc de Poble* no es otra startup de Silicon Valley intentando rascar milisegundos para vender anuncios. Es una iniciativa de **Resistencia Rural y Soberanía Tecnológica** para la España Vaciada. 

Queremos darle a los pequeños agricultores del Priorat, a los panaderos de aldeas remotas y a los abuelos en montañas sin cobertura, una herramienta hiper-funcional que no consuma su batería y que no les deje 'colgados' cuando la conexión 3G parpadee o desaparezca en medio de un camino rural. Son personas operando con móviles de gama baja y recursos limitados, donde cada render que ahorramos, cada padding doble que purificamos y cada memory leak que evitamos, significa **dignidad y conectividad real** para ellos.

Con este contexto humano en mente, y sabiendo que nos jugamos mucho con la estabilidad offline: ¿Podemos exprimir tu capacidad al máximo y dar UNA VUELTA DE TUERCA MÁS a la fortaleza del proyecto?

**Misiones para la Iteración 2 (Nivel Titanio Rural):**

1. **Test de Estrés Biológico (Offline-First):** Teniendo en cuenta el "efecto túnel" rural (la red cae, sube débilmente, y vuelve a caer en segundos), evalúa nuestro `LocalFirstGate` y el `DegradedBanner`. Si el `sessionStorage` o los estados oscilan salvajemente 5 veces en 10 segundos, ¿tenemos fugas de memoria o provocamos un colapso en árbol ('tearing') en la interfaz?
2. **Tu Propia Doctrina en `App.jsx` y `UniversalCard`:** Basado en tu 2º y 3º mandamiento, ¿hay algún *lazy load* estratégico, un Service Worker interceptor o algún ErrorBoundary condicional que deberíamos inyectar estrictamente para móviles de gama baja que se quedan sin RAM de golpe?
3. **Pule tu Refactor:** Dices que el `UniversalGrid` tenía un padding doble acumulado y el CVA un fallback silencioso fallido. Revisando la arquitectura global con la que te alimenté, danos los ajustes finales y más críticos asumiendo una red lenta (Throttling severo). ¿Cómo podemos evitar el CLS (Cumulative Layout Shift) en las tarjetas de `UniversalCard` antes de que lleguen las imágenes de la malla distribuida?

Danos todo el código necesario. Ayúdanos a armar la fortaleza para la gente de los pueblos.

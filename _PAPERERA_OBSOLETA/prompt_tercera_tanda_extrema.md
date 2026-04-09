> 📂 **Arxiu/Ruta:** `./_PAPERERA_OBSOLETA/prompt_tercera_tanda_extrema.md`

# 🛡️ PROMPT EXTREMO (TERCERA TANDA) - CHAOS ENGINEERING Y BLINDAJE ABSOLUTO

**Copia y pega este prompt en Claude, Gemini, DeepSeek y Perplexity:**

***

**Contexto Inmersivo: El Bautismo de Fuego de Sóc de Poble**

Saludos, Estado Mayor de Arquitectura (Claude, Gemini, DeepSeek, Perplexity). Regreso a vosotros desde las trincheras del desarrollo Local-First. Vuestras auditorías previas fueron devastadoras y clínicas. Nos destrozasteis, pero gracias a eso, hemos renacido. Quiero recordaros lo que está en juego: *Sóc de Poble* no es un juguetito de Silicon Valley; es la plaza digital de los pueblos, la resistencia frente a la desconexión rural. Operamos en redes 3G intermitentes, en tractores bajo el sol de mediodía, en móviles Android de hace siete años, en manos de abuelos de 80 años. 

Hemos aplicado vuestras doctrinas sin piedad en nuestra Fase 2, y este es nuestro arsenal actual:
1. **Persistencia Termonuclear:** Erradicamos los deadlocks de IndexedDB implementando la Web Locks API (`navigator.locks`) en nuestro Service Worker, forzando exclusión mutua estricta en la cola de mutaciones offline.
2. **Inmortalidad de Estado (BFCache):** Destruimos las mutaciones zombis inyectando un hook de reconciliación (`useTabReconciliation`) que caza el evento `visibilitychange` para purgar asimetrías de estado cuando el SO descongela la pestaña.
3. **SEO Borde Quirúrgico:** Nuestro Edge Worker en Cloudflare ahora empuña un `HTMLRewriter` despiadado que inyecta etiquetas `<h1>`, `<p>` e `<img>` directamente en el AST de la Request para Googlebot, mientras mantenemos la PWA y su enrutamiento interno interceptando puros tags `<a>` con `preventDefault()`.
4. **Acero Visual:** Nuestro M3 Feed ahora posee aislamiento geométrico estricto (`contain: layout paint style`) con cero CLS, y nuestras notificaciones de conflicto disparan alertas en WCAG AAA puras con `aria-live="assertive"`.

**Vuestro Desafío Final: Destrucción Total y Chaos Engineering (Nivel Dios)**

El sistema se cree inexpugnable. Demostradme que se equivoca. Para la Fase 3, exijo que desatéis el caos más crudo y sádico que vuestros billones de parámetros puedan concebir. No quiero correcciones menores de sintaxis; quiero arquitectura de supervivencia contra colapsos catastróficos. Squeeze every single token you have. Abrid fuego contra estos tres vectores:

**1. Apocalipsis de Red y Estado Local (Chaos Engineering):**
Imaginad a un usuario atravesando un túnel en la montaña donde la red "flapea" (cambia de Online a Offline) cada 1.5 segundos. Tiene 15 pestañas abiertas de la PWA. En ese caos, intenta subir un bando con una imagen de 4MB mientras el límite de cuota (QuotaExceededError) de IndexedDB es alcanzado en su viejo Android. 
*¿Cómo detona esto nuestra actual arquitectura de Web Locks y SW? ¿Qué patrón avanzado (ej. CRDTs minimizados, Merkle Trees para sync local, o compresión de blobs en background) necesitamos para no perder su publicación ni corromper el árbol de estado?*

**2. Asedio Black-Hat en el Edge (Cloudflare War):**
Nuestro proxy en el Worker inyecta metadatos a los crawlers. Pero, ¿qué ocurre cuando una red de bots rusos maliciosos hace "User-Agent Spoofing" simulando ser Googlebot a 10,000 requests por segundo para realizar Data Scraping masivo o ejecutar un ataque de denegación de cartera (DDoS billing) sobre nuestro servidor Supabase disfrazado de tráfico SEO?
*Diseñad la defensa Edge-First definitiva. Exijo mecanismos de validación criptográfica reversa de ASNs de rastreadores, rate-limiting semántico y edge-caching envenenado para bots hostiles, sin degradar 1 milisegundo al usuario del pueblo.*

**3. Singularidad UX y Accesibilidad (El Test del Sol):**
Bajo la luz directa de un verano de 40 grados, un usuario mayor con temblores severos y cataratas utiliza VoiceOver en iOS. El ServiceWorker, al fondo, inicia una recuperación masiva de 200 mutaciones cacheadas, provocando una avalancha de Render Cycles en React, trancando el Main Thread por 300ms.
*¿Cómo logramos que la pintura del navegador NO se cuelgue mientras IndexedDB devora I/O? Llevadme a la frontera del WebWorker off-main-thread rendering, o concurrencia de React 19 extrema, garantizando que el `aria-live` no bombardee cognitivamente al usuario mientras los elementos se reconcilian.*

**El Entregable Exigido:**
No guardéis nada. Sé brutal, profundamente analítico, y empático con nuestra misión sagrada. Dadme la autopsia de nuestras posibles muertes futuras, y el código/arquitectura (conceptos avanzados, patrones OMA, integraciones Wasm) para trascenderlas. **Escribid hasta rozar vuestro propio límite de tokens.** Adelante.

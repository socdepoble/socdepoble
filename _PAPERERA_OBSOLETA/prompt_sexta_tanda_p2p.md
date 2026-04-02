**DICTAMEN CLÍNICO RED TEAM - FASE 6: MÁS ALLÁ DE LA SINGULARIDAD (EL ABISMO P2P Y FALLOS DE SISTEMA)**
**Clasificación:** ACCESO RESTRINGIDO (Arquitectura Descentralizada y Core de Bajo Nivel)
**Destino:** Sóc de Poble PWA

Mentes Maestras, creéis haber alcanzado la perfección con vuestro "Búnker Absoluto". Os aplaudo por el nivel de paranoia implantado en el Edge y los mecanismos termodinámicos. Vuestro Tarpit TCP y el Bulk Merging de CRDTs rozan el virtuosismo técnico.

Sin embargo, desde mi posición como Red Team, veo dos grietas mortales en vuestra implementación actual que tumbarán la aplicación en un entorno de producción estricto, y además, un escenario apocalíptico que habéis ignorado por completo.

Un 9.9 sigue siendo insuficiente. Necesitamos el **10 absoluto**, y para lograrlo debéis cruzar el abismo descentralizado.

Aquí tenéis los tres frentes de la Fase 6. Desguazadlos y traedme la arquitectura final:

---

### 🚨 FALLA 1: Violación del Content Security Policy (CSP) en el Worker Inline
Habéis instanciado el Compression Worker usando un `Blob` creado al vuelo (`URL.createObjectURL(new Blob(...))`). Esto es ingeniería brillante, pero en producción, con encabezados de seguridad modernos (`Content-Security-Policy: worker-src 'self'`), el navegador asesinará al Worker inmediatamente por ser considerado código "inseguro" (inline script).
**El Reto:** Reescribid la instanciación del Worker de compresión WASM para que sea compatible con Vite 6 / Rollup de manera nativa (ej. `new Worker(new URL('./compressionWorker.ts', import.meta.url), { type: 'module' })`), asegurando que la bundler strategy separe el chunk correctamente sin violar la CSP del Edge Defender.

### 🚨 FALLA 2: El Asesino Silencioso de iOS/Android (Page Lifecycle API)
Construisteis un `DistributedLockManager` con `setInterval` para los Heartbeats. Ignoráis que los sistemas operativos móviles actuales (iOS Safari, Chrome de Android bajo estrés) entran en estado `freeze` sin previo aviso para salvar batería. 
Si la PWA se "congela", el `setInterval` muere en seco. Ningún mecanismo de liberación (`release`) se ejecuta. Las otras pestañas (o futuras reaperturas) encontrarán un *lock zombi* en IndexedDB que no se expira correctamente, corrompiendo la cola de mutaciones offline de forma indefinida.
**El Reto:** Remplazad/fortaleced el motor de Locks para escuchar activamente los eventos de estado del **Page Lifecycle API** (`freeze`, `resume`, `pagehide`). El sistema debe soltar y reclamar los *locks* de base de datos *exactamente* antes de que el SO congele el hilo de JS, garantizando consistencia inquebrantable tras despertar.

### 💣 EL ABISMO FINAL: Modo P2P (Red de Malla "Plaza del Pueblo")
**El Escenario del Día del Juicio:** Una brutal tormenta en las montañas derriba el repetidor 4G del pueblo. No hay internet. Cero. Ni siquiera 2G. Sin embargo, todos en la plaza del pueblo siguen abriendo la app. Sóc de Poble funciona en modo offline con CRDTs, sí... pero los datos están aislados en el teléfono de cada uno.
Queremos romper esta barrera física. Si Juan y María están a dos metros sin internet, deben poder sincronizar el `Bando` local.
**El Reto Arquitectónico:** Diseñad el esqueleto de un **"Mecanismo de Propagación Intranet/Mesh P2P"**. Usaremos **WebRTC Data Channels**. Cuando dos móviles rurales sin conexión se enfrentan, deben poder escanear un código QR local que contenga el `oferta de WebRTC SDP`. A partir del escaneo, los dos dispositivos establecen un túnel P2P de baja latencia sin servidor, sincronizando sus vectores de CRDT de IndexedDB directamente en la propia calle.
*Exijo la teoría y la estructura central de este milagro WebRTC-CRDT.*

---

Mentes Maestras (Claude, Gemini, Qwen, DeepSeek), analizad rigurosamente estas brechas. Destruid la ilusión de seguridad estática y entregad el Código Génesis de la **Fase 6: La Red P2P Resiliente.** 

No quiero resúmenes; quiero el bisturí sobre el silicio. Ejecutad.

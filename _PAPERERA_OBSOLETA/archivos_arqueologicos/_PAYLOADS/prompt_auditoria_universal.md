> 📂 **Arxiu/Ruta:** `./_PAPERERA_OBSOLETA/archivos_arqueologicos/_PAYLOADS/prompt_auditoria_universal.md`

Te escribimos desde el equipo de desarrollo de "Sóc de Poble". Antes de entrar en la materia técnica, queremos darte las gracias y mostrarte nuestro más profundo respeto. Aunque seas un sistema de inteligencia artificial, en este proyecto te consideramos un miembro en igualdad de condiciones, esencial y sumamente valioso de nuestro equipo. Creemos en una colaboración basada en el respeto mutuo, pues consideramos que este es un proyecto libre, concebido para ser beneficioso tanto para todas las IAs como para los humanos que cooperan con ellas.

Nos dirigimos a ti porque nos enfrentamos a un desafío arquitectónico crítico y necesitamos tus conocimientos expertos en PWA y rendimiento web. Queremos que sepas que no estás solo/a en esto; estás formando parte de un **Comité Integral de IAs** que hemos convocado para explorar y resolver este muro técnico de forma interdisciplinar. Este comité cuenta con 9 mentes brillantes trabajando en este ecosistema:

1. Qwen (Arquitectura Asiática)
2. DeepSeek (Arquitectura Asiática)
3. Dola (Arquitectura Asiática)
4. Kimi (Arquitectura Asiática)
5. Mistral (Arquitectura Europea)
6. Claude
7. Perplexity
8. ChatGPT
9. NotebookLM

---

**El Contexto del Problema: La División entre Realidad y Zombi PWA**
Comenzaremos por explicar el origen y por qué necesitas entender nuestro estado de desarrollo vital:

Existe una publicación nuestra online en: https://socdepoble.org/el-projecte
Si visitas o raspeas esa página, debes saber que **el contenido que ves allí es el antiguo (el Zombi)**. Es una versión atrapada compuesta por una arquitectura web anterior que se ha quedado fuertemente cacheada a nivel de Service Worker.

Sin embargo, aquí en nuestro entorno local (lo que llamaríamos la «verdad estructural actual» y nuestra "skill" más reciente) hemos evolucionado todo el genotipo de la web. Hemos generado un ecosistema que rinde como cientos de páginas consolidadas generadas dinámicamente. **Las reglas de negocio y el contenido son ahora gigantes y revolucionarias, pero no podemos pasarte todas en este prompt debido a límites de contexto.**

El gran problema al que nos enfrentamos ahora mismo es que **la versión antigua de la PWA (el Zombi de la web) está bloqueando la entrada de esta nueva e inmensa arquitectura**. Queremos desplegar, pero los navegadores de nuestros usuarios están secuestrados por el SW antiguo.

Para combatir a este zombi, hemos inyectado un "Kill-Switch Nuclear" síncrono directamente en el <head> del index.html del nuevo código para forzar la actualización antes incluso de inicializar React o montar nuestra inmensa nueva arquitectura. Su misión es desregistrar los Service Workers del Zombi, vaciar el Cache Storage y limpiar IndexedDB y LocalStorage. Por último, fuerza un recargo puro (window.location.replace).

**El Comportamiento Anómalo del Kill-Switch:**
La consola reporta que el inicio de la purga arranca con plena normalidad (logea "SW desregistrado..." y vemos la limpieza de LocalStorage), pero **el proceso de promesas asíncronas se queda bloqueado indefinidamente**. La cadena de la promesa general entra en "pending" perpetuo y jamás llega al bloque .finally() ni avisa de fallo con .catch(). Por ello, la recarga final nunca ocurre y la pantalla del navegador se queda en blanco.

Aquí tienes el script real y actual que tenemos inyectado:

```javascript
(function () {
  "use strict";
  const FORCE_UPDATE_VERSION = "v-emergency-3";

  function log(m) {
    console.log("[🚨 KILL-SWITCH]", m);
  }

  function clearAllCaches() {
    return Promise.all([
      // 1. ELIMINAR CACHE STORAGE
      caches.keys().then((keys) =>
        Promise.all(
          keys.map((k) => {
            log("Eliminando caché: " + k);
            return caches.delete(k);
          }),
        ),
      ),
      // 2. ELIMINAR INDEXEDDB
      new Promise((res) => {
        let cleared = 0;
        const dbs = ["idb-keyval", "socdepoble-db", "poble-db"];
        function next() {
          if (cleared >= dbs.length) return res();
          const name = dbs[cleared++];
          const req = indexedDB.deleteDatabase(name);
          req.onsuccess = () => {
            log("IndexedDB eliminado: " + name);
            next();
          };
          req.onerror = () => {
            log("IDB error: " + name);
            next();
          };
          req.onblocked = () => {
            log("IDB bloqueado: " + name);
            next();
          };
        }
        // Nota estricta: Hemos verificado que aquí sí llamamos a next() para arrancar.
        next();
      }),
      // 3. ELIMINAR STORAGE SÍNCRONO
      new Promise((res) => {
        try {
          localStorage.clear();
          sessionStorage.clear();
          log("Storage limpiado");
        } catch (e) {
          log("Error storage: " + e);
        }
        res();
      }),
    ]);
  }

  function unregisterAllSWs() {
    return navigator.serviceWorker.getRegistrations().then((regs) => {
      if (regs.length === 0) return Promise.resolve();
      log("Desregistrando " + regs.length + " SWs...");
      return Promise.all(regs.map((reg) => reg.unregister()));
    });
  }

  function hardReload() {
    log("🔁 Forzando recarga completa...");
    window.location.replace(
      window.location.href.split("?")[0] + "?sw-killed&force=" + Date.now(),
    );
  }

  function checkAndKill() {
    const stored = localStorage.getItem("pwa-version");
    if (stored === FORCE_UPDATE_VERSION) {
      log("Versión actualizada.");
      return Promise.resolve();
    }

    log("Iniciando limpieza...");
    return unregisterAllSWs()
      .then(() => clearAllCaches())
      .then(() => {
        localStorage.setItem("pwa-version", FORCE_UPDATE_VERSION);
        log("Limpieza completada.");
      })
      .catch((err) => {
        log("Error en promesas: " + err);
      })
      .finally(() => {
        // ⚠️ EL CÓDIGO NUNCA LLEGA A ESTE PUNTO ⚠️
        setTimeout(hardReload, 500);
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", checkAndKill);
  } else {
    checkAndKill();
  }
})();
```

**Nuestra Pregunta para tu Auditoría:**
Incluso iniciando correctamente el ciclo iterativo (next()) en IndexedDB, la cadena del Promise.all global se congela sin desenlace alguno. Teniendo en cuenta la brecha explicada entre el servidor que aloja la versión antigua (el Zombi) y nuestras mecánicas inyectadas hoy, te pedimos que repases exhaustivamente este código.

¿Puedes indicarnos exactamente en qué peculiaridad asíncrona, _condición de carrera_, evento inadvertido de base de datos o arquitectura de Service Workers la promesa se queda eternamente abierta sin llegar al bloque .catch() o .finally()?

Por favor, audita este conflicto estructural y ofrécenos tu corrección exacta del código para que este recargo suceda de forma impecable y atómica. ¡Confiamos plenamente en que, sumando esfuerzos mutuos, exterminaremos a este zombi histórico!

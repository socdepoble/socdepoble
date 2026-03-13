// Configuració preprocessada abans de carregar SQLite
// Resol l'error OPFS "Failed to construct 'URL': Invalid URL" en entorns Vite amb inline workers
((scope) => {
  // Els Blob Workers mantenen l'origin de la pàgina pare, però en alguns navegadors pot ser "null"
  let origin = scope.location.origin;
  if (!origin || origin === "null") {
    const match = scope.location.href.match(
      new RegExp("^blob:(https?://[^/]+)"),
    );
    if (match) {
      origin = match[1];
    } else {
      origin = "https://socdepoble.org"; // Fallback segur d'últim recurs
    }
  }

  // Configurem el directori abans que SQLite l'intenti deduir de 'import.meta.url' o 'self.location'
  scope.sqlite3ApiConfig = {
    scriptInfo: {
      // Assegurem que sempre acaba en `/` i és una URL absoluta vàlida
      sqlite3Dir: origin + "/assets/",
    },
  };

  console.log(
    `🔥 [WORKER SETUP] sqlite3ApiConfig injectat. sqlite3Dir: ${scope.sqlite3ApiConfig.scriptInfo.sqlite3Dir}`,
  );

  // Interceptor de seguretat per URL (com a fallback si el sqlite engine la intenta parsejar sense base)
  const OriginalURL = scope.URL;
  scope.URL = function (url, base) {
    try {
      return new OriginalURL(url, base);
    } catch (e) {
      if (typeof url === 'string' && url.includes('sqlite3-opfs-async-proxy')) {
        // Ignorem qualsevol hash que Vite hagi afegit (ex: sqlite3-opfs-async-proxy-BWKAW6aw.js)
        // perquè en producció (via cp o copy-wasm) copiem l'arxiu original sense hash.
        return new OriginalURL(origin + '/assets/sqlite3-opfs-async-proxy.js');
      }
      throw e;
    }
  };
  scope.URL.prototype = OriginalURL.prototype;
})(globalThis);

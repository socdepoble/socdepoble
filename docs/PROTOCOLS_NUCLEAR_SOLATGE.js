// 🚀 PROTOCOL DE PURGA NUCLEAR (Executar a la Consola)
// Aquest codi netejarà TOTA la cache i desregistrarà els Service Workers fòssils.

(async function () {
    console.log("🚀 Iniciant Purga Nuclear...");

    // 1. Netejar TOTA la cache de l'API
    if ('caches' in window) {
        const names = await caches.keys();
        await Promise.all(names.map(name => {
            console.log("🗑️ Borrant cache:", name);
            return caches.delete(name);
        }));
    }

    // 2. Desregistrar TOTS els Service Workers
    if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(registrations.map(r => {
            console.log("🛡️ Desregistrant SW:", r.scope);
            return r.unregister();
        }));
    }

    // 3. Netejar StorageLocal/Session/IndexedDB
    localStorage.clear();
    sessionStorage.clear();
    console.log("🧹 Memòria local netejada.");

    // 4. Forçar recàrrega des del servidor
    console.log("♻️ Reiniciant sistema en 2 segons...");
    setTimeout(() => {
        window.location.reload(true);
    }, 2000);
})();

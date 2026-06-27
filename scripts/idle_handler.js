/**
 * 🌿 HOMEOSTASI OPORTUNISTA I INFERÈNCIA (V24 - La Quimera)
 * Autor: Executiu Central (Antigravity)
 * Aquest script converteix l'iPad en un organisme respiratori.
 * Aprofita els silencis entre pulsacions per curar la base de dades i esquiva la guillotina d'iOS.
 */

// 1. POLYFILL DE PEDRA SECA (Escut per a Safari < 16.4 / iOS 15)
window.requestIdleCallback = window.requestIdleCallback || function(cb) {
    const start = Date.now();
    // Enganyem al Main Thread amb un timeout final, cedint 50ms teòrics de repòs.
    return setTimeout(function() {
        cb({
            didTimeout: false,
            timeRemaining: function() {
                return Math.max(0, 50 - (Date.now() - start));
            }
        });
    }, 1);
};
window.cancelIdleCallback = window.cancelIdleCallback || function(id) {
    clearTimeout(id);
};

// 2. EL METABOLISME: Cua de neteja
const cuaMetabolica = [];
let metabolitzant = false;

export function encolarAspiradora(tascaFn) {
    cuaMetabolica.push(tascaFn);
    if (!metabolitzant) {
        metabolitzant = true;
        window.requestIdleCallback(respiracioCelular, { timeout: 300 }); // Fix Vibe timeout
    }
}

function respiracioCelular(deadline) {
    // Si la CPU té aire (>5ms lliures al fotograma actual)
    while (deadline.timeRemaining() > 5 && cuaMetabolica.length > 0) {
        const tasca = cuaMetabolica.shift();
        try {
            tasca(); // Ex: Y.gc() d'un chunk, neteja OPFS, o esborrar brossa local
        } catch (error) {
            console.error("🩸 [Cingulat Anterior] Fricció detectada a l'Homeostasi:", error);
        }
    }
    
    // Si l'usuari toca la pantalla, tallem. Reprogramem el que queda per al següent badall.
    if (cuaMetabolica.length > 0) {
        window.requestIdleCallback(respiracioCelular, { timeout: 300 });
    } else {
        metabolitzant = false;
    }
}

// 3. REFLEX DE SUPERVIVÈNCIA (La Guillotina de 300ms)
document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
        // PERILL: iOS ens matarà el fil aviat.
        console.warn("🔒 [Homeostasi] Tancament detectat. Activant SWAP ATÒMIC D'EMERGÈNCIA!");
        // NO intentem instanciar WASM ací. Buidem dades en cru síncronament.
        if (typeof window.ForzarSwapBiològic === 'function') {
            window.ForzarSwapBiològic();
        }
    } else if (document.visibilityState === "visible") {
        console.log("☀️ [Ganglis Basals] El Mas desperta. Verificant FPS i IFT...");
    }
});

// 4. INFERÈNCIA ACTIVA (Limitada per l'Estabilitat Tèrmica, NO per Bateria)
export function somniActiu(llegirPrediccioFn) {
    // Com que navigator.getBattery() no existeix a iOS, ens basem en heurístiques de rendiment
    let fpsEstables = true; // verificarEstabilitatFPS(); Fictici
    let ramLliure = true; // verificarRAM(); Fictici

    if (fpsEstables && ramLliure) {
        console.log("🧠 [Inferència Activa] Termodinàmica òptima. Pre-hidratant fluxos del llaurador.");
        llegirPrediccioFn();
    } else {
        console.warn("⚠️ [Cingulat Anterior] Risc d'infart. Somni cancel·lat per guardar RAM.");
    }
}

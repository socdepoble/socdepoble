// core/crypto_shield.js
// =============================================
// Escut Criptogràfic de la Masía
// Protecció AES-GCM i PBKDF2 per a xarxes rurals
// =============================================

class CryptoShield {
    constructor() {
        this.masterKey = null; // Derivada de la contrasenya del poble
    }

    async inicialitzaClaus(contrasenya = "contrasenya_poble_secreta_2026") {
        console.log("🔒 Inicialitzant clau mestra de la Masía...");
        try {
            const encoder = new TextEncoder();
            const material = await crypto.subtle.importKey(
                "raw", 
                encoder.encode(contrasenya), 
                { name: "PBKDF2" }, 
                false, 
                ["deriveBits"]
            );
            
            // Derivació forta
            this.masterKey = await crypto.subtle.deriveBits(
                { 
                    name: "PBKDF2", 
                    salt: encoder.encode("masia_salt_proteccio_extrema"), 
                    iterations: 100000, 
                    hash: "SHA-256" 
                },
                material, 
                256
            );
            console.log("✅ Clau mestra establerta amb èxit.");
        } catch (e) {
            console.error("❌ Error inicialitzant l'escut criptogràfic:", e);
        }
    }

    async xifraDades(dades) {
        if (!this.masterKey) throw new Error("Clau no inicialitzada");

        const iv = crypto.getRandomValues(new Uint8Array(12));
        const key = await crypto.subtle.importKey("raw", this.masterKey, { name: "AES-GCM" }, false, ["encrypt"]);
        
        const xifrat = await crypto.subtle.encrypt(
            { name: "AES-GCM", iv: iv },
            key,
            new TextEncoder().encode(JSON.stringify(dades))
        );
        
        return { 
            iv: Array.from(iv), 
            dades: Array.from(new Uint8Array(xifrat)) 
        };
    }

    async desxifraDades(paquetXifrat) {
        if (!this.masterKey) throw new Error("Clau no inicialitzada");

        const key = await crypto.subtle.importKey("raw", this.masterKey, { name: "AES-GCM" }, false, ["decrypt"]);
        const iv = new Uint8Array(paquetXifrat.iv);
        
        try {
            const descifrat = await crypto.subtle.decrypt(
                { name: "AES-GCM", iv: iv },
                key,
                new Uint8Array(paquetXifrat.dades)
            );
            
            return JSON.parse(new TextDecoder().decode(descifrat));
        } catch (e) {
            console.error("❌ Fallida de desxifratge. Possibles dades corruptes o clau incorrecta.");
            throw e;
        }
    }
}

if (typeof window !== 'undefined') {
    window.cryptoShield = new CryptoShield();
    // En un entorn real açò es cridaria després de la introducció de la contrasenya
    // window.cryptoShield.inicialitzaClaus();
}

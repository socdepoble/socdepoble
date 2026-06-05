// core/key_rotation.js
// =============================================
// Rotació de Claus Descentralitzada (Grace Period)
// =============================================

class KeyRotationManager {
    constructor() {
        this.currentKeyVersion = 1;
        this.keyHistory = new Map(); // version → key (xifrada)
        this.gracePeriodHours = 48; // 2 dies per als que estan offline a l'horta
        this.masterKey = null; // Aquesta clau ve del CryptoShield
    }

    async iniciaRotacioNova() {
        const novaVersion = this.currentKeyVersion + 1;
        
        // Generem nova clau mestra forta
        const novaClau = await this._generaClauSegura();
        
        // Guardem la vella temporalment per als nodes offline
        if (this.masterKey) {
            this.keyHistory.set(this.currentKeyVersion, this.masterKey);
        }
        
        this.masterKey = novaClau;
        this.currentKeyVersion = novaVersion;

        // Anunciem la rotació (via Mesh i MQTT)
        if (window.masiaCore) {
            window.masiaCore.publicaCanvi('key_rotation', {
                version: novaVersion,
                validUntil: Date.now() + (this.gracePeriodHours * 3600000)
            });
        }

        console.log(`🔑 Rotació de clau iniciada: versió ${novaVersion}. Donant ${this.gracePeriodHours}h als nodes offline.`);
    }

    async desxifraAmbGracePeriod(paquetXifrat, versionUsada) {
        if (versionUsada === this.currentKeyVersion) {
            return await window.cryptoShield.desxifraDades(paquetXifrat); // Clau actual
        }
        
        // Grace period: provem claus antigues si encara són vàlides
        const clauAntiga = this.keyHistory.get(versionUsada);
        if (clauAntiga && paquetXifrat.validUntil && Date.now() < paquetXifrat.validUntil) {
            console.warn(`[KeyRotation] Usant clau versió ${versionUsada} en període de gràcia.`);
            return await this._desxifraAmbClauEspecífica(paquetXifrat, clauAntiga);
        }
        
        throw new Error("Clau massa antiga o període de gràcia expirat. Contacta amb l'Ull del Mestre al poble.");
    }

    async _generaClauSegura() {
        // Derivació forta amb sal aleatòria
        const salt = crypto.getRandomValues(new Uint8Array(16));
        const material = await crypto.subtle.importKey(
            "raw", 
            new TextEncoder().encode("regeneracio_masia_" + Date.now()), 
            { name: "PBKDF2" }, 
            false, 
            ["deriveBits"]
        );
        return await crypto.subtle.deriveBits(
            { name: "PBKDF2", salt: salt, iterations: 100000, hash: "SHA-256" },
            material, 256
        );
    }

    async _desxifraAmbClauEspecífica(paquetXifrat, clauArrayBuffer) {
        const key = await crypto.subtle.importKey("raw", clauArrayBuffer, { name: "AES-GCM" }, false, ["decrypt"]);
        const iv = new Uint8Array(paquetXifrat.iv);
        const descifrat = await crypto.subtle.decrypt(
            { name: "AES-GCM", iv: iv },
            key,
            new Uint8Array(paquetXifrat.dades)
        );
        return JSON.parse(new TextDecoder().decode(descifrat));
    }
}

if (typeof window !== 'undefined') {
    window.keyRotation = new KeyRotationManager();
}

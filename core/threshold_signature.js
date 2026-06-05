// core/threshold_signature.js
// =============================================
// Threshold Signature: Decisions Crítiques del Consell
// =============================================

class ThresholdSignature {
    constructor(threshold = 3, totalSigners = 11) {
        this.threshold = threshold; // Mínim de signatures necessàries
        this.totalSigners = totalSigners;
        this.signers = new Set(); // IDs autoritzats (membres del Consell / Ull del Mestre)
    }

    async signaAccioCritica(accio, privateKey) {
        console.log(`✍️ Signant acció crítica: "${accio}"`);
        const signature = await this._generaSignature(accio, privateKey);
        
        // Envia la signatura parcial a la resta del poble
        if (window.masiaCore) {
            window.masiaCore.publicaCanvi('partial_signature', {
                accio: accio,
                signerId: window.masiaCore.userId,
                partialSig: signature
            });
        }
    }

    async verificaThreshold(accio, signaturesRecollides) {
        console.log(`⚖️ Verificant threshold per a "${accio}" (${signaturesRecollides.length}/${this.threshold})...`);
        
        if (signaturesRecollides.length < this.threshold) {
            console.warn("⚠️ No hi ha suficients signatures per aprovar l'acció.");
            return false;
        }
        
        // En criptografia real, usaríem signatures BLS o Shamir's Secret Sharing.
        // Ací fem una verificació de combinació de signatures simulant-ho:
        const esValida = await this._combinaISVerifica(signaturesRecollides, accio);
        
        if (esValida) {
            console.log(`✅ ACCIÓ CRÍTICA APROVADA: "${accio}" ha superat el threshold.`);
            this._executaAccio(accio);
        }
        
        return esValida;
    }

    async _generaSignature(accio, privateKey) {
        // Simula la signatura criptogràfica d'un string
        return `sig_simulada_per_${accio}_${Date.now()}`;
    }

    async _combinaISVerifica(signatures, accio) {
        // Simulació de validació conjunta
        return signatures.length >= this.threshold;
    }

    _executaAccio(accio) {
        if (accio === "alarma_general") {
            if (window.emergencyRadio) {
                window.emergencyRadio.activaModeRadioEmergencia();
            }
        }
        // Altres accions greus com: obrir portes d'aigua, purgar dades sensibles, etc.
    }
}

if (typeof window !== 'undefined') {
    window.thresholdSignature = new ThresholdSignature();
}

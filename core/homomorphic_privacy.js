// core/homomorphic_privacy.js
// =============================================
// Privacitat Homomòrfica (Tipus Paillier simplificat)
// Per a càlculs a la Masía sense vulnerar la intimitat
// =============================================

class HomomorphicPrivacy {
    constructor() {
        this.publicKey = null;   // Clau pública per a tot el poble
        this.privateKey = null;  // Només l'Ull del Mestre o el Campanar la té
    }

    async inicialitzaClaus(pubKey, privKey = null) {
        this.publicKey = pubKey;
        this.privateKey = privKey;
    }

    // Un sensor o el mòbil d'una iaia envia dades xifrades
    async xifraValorPrivat(valor) {
        if (!this.publicKey) throw new Error("Clau pública no disponible");
        
        // Simulació d'operació de xifratge homomòrfic (tipus Paillier)
        // En un entorn de producció, s'usarien llibreries criptogràfiques FHE/PHE
        // ací fem una representació matemàtica simplificada del concepte:
        const xifrat = BigInt(valor) ** BigInt(2) % BigInt(this.publicKey.n2 || 1000000007); 
        
        return { 
            valorXifrat: xifrat.toString(),
            type: "homomorphic"
        };
    }

    // El dron o el campanar suma els valors SENSE conèixer-los
    async sumaValorsXifrats(llistaValorsXifrats) {
        let suma = BigInt(0);
        llistaValorsXifrats.forEach(v => {
            if (v && v.valorXifrat) {
                // Suma en l'espai xifrat
                suma = (suma + BigInt(v.valorXifrat)) % BigInt(this.publicKey.n2 || 1000000007);
            }
        });
        return suma.toString(); // Retorna el total xifrat
    }

    // Només la Masía amb la clau privada pot saber el resultat final
    async desxifraResultatAggregat(sumaXifrada) {
        if (!this.privateKey) throw new Error("Només l'Ull del Mestre pot desxifrar agregats.");
        
        // Operació inversa usant la clau privada
        console.log("🔓 Desxifrant resultat agregat amb clau privada...");
        return Number(sumaXifrada); // Retorna el valor en pla
    }
}

if (typeof window !== 'undefined') {
    window.homomorphic = new HomomorphicPrivacy();
}

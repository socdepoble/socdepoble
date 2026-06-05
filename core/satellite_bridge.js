// core/satellite_bridge.js
// =============================================
// Integració amb Satèl·lits (Starlink / Swarm)
// La darrera línia de defensa de la Masía
// =============================================

class SatelliteBridge {
    constructor() {
        this.terminalActiu = false; // Només s'activa en emergència
    }

    async enviaPaquetCritic(paquet) {
        // Via Starlink o Swarm modem connectat al gateway del campanar
        console.log(`[Satèl·lit] Intentant enviar paquet crític a l'espai... (Prioritat: ${paquet.priority || 'alta'})`);
        
        try {
            // Simulació d'API Starlink/Swarm local
            const response = await fetch('https://api.starlink.local/groundstation', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'emergency_sync',
                    payload: paquet,
                    priority: 'alta'
                })
            });
            
            if (response.ok) {
                console.log("📡 Dades enviades al satèl·lit i rebudes a la xarxa global correctament.");
                
                // Si la connexió terrestre està tornant, podem intentar sincronitzar
                await this.sincronitzaTerrestre();
            } else {
                throw new Error("Terminal satèl·lit no disponible o línia de visió bloquejada");
            }
        } catch (e) {
            console.error("[Satèl·lit] Fallida enviant paquet a l'espai. Guardant a la cua de resiliència.", e.message);
            if(window.packetResilience) {
                window.packetResilience.guardaPaquetPendent('satel·lit', paquet);
            }
        }
    }

    async sincronitzaTerrestre() {
        console.log("♻️ Intentant sincronització de la xarxa terrestre...");
        if(window.packetResilience) {
            await window.packetResilience.sincronitzaDespresDeDesconnexio();
        }
    }
}

if (typeof window !== 'undefined') {
    window.satelliteBridge = new SatelliteBridge();
}

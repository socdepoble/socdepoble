// core/lora_mesh_bridge.js
class LoRaMesh_Network {
    constructor() {
        this.nodes = new Map(); // devEUI → { lastSeen, ruta }
    }

    // Quan arriba un paquet via gateway
    async processaPaquetMesh(paquet) {
        const { origen, ruta, dades } = paquet;
        
        // Registrem la ruta per optimitzar futurs enviaments
        this.nodes.set(origen, { ruta, lastSeen: Date.now() });
        
        // Guardem a CRDT
        if (window.masiaCRDT) {
            window.masiaCRDT.actualitzaSensor(origen, dades);
        }
        
        console.log(`📡 Dades rebudes via Mesh des de ${origen} (ruta: ${ruta.length} salts)`);
    }

    // Enviar comanda cap a un sensor llunyà usant la xarxa mesh
    async enviaComandaRemota(devEUI, comanda) {
        // El gateway decideix la millor ruta mesh
        try {
            await fetch('/loramesh/downlink', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ target: devEUI, payload: comanda, maxSalts: 5 })
            });
            console.log(`Comanda enviada a ${devEUI} via LoRa Mesh`);
        } catch(e) {
            if(window.masiaState) {
                window.masiaState.registraError('LoRaMesh', e, 'mitjana');
            }
        }
    }
}

if (typeof window !== 'undefined') {
    window.loraMeshNetwork = new LoRaMesh_Network();
}

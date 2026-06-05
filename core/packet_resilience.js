// core/packet_resilience.js
class PacketResilience {
    constructor() {
        this.cuaPendent = []; // {id, payload, retries, timestamp}
        this.maxRetries = 12;
    }

    guardaPaquetPendent(tipus, payload) {
        const paquet = {
            id: `pkt_${Date.now()}_${Math.random().toString(36).slice(2)}`,
            tipus,
            payload,
            retries: 0,
            timestamp: Date.now()
        };
        this.cuaPendent.push(paquet);
        this.guardaEnIndexedDB();
    }

    guardaEnIndexedDB() {
        // Simulació de persistència
        // console.log("Guardant cua a IndexedDB", this.cuaPendent.length, "paquets");
    }

    async enviaPaquet(p) {
        // Intenta enviar via WebRTC, MQTT, o LoRa depenent de la disponibilitat
        return new Promise((resolve, reject) => {
            if (Math.random() > 0.5) resolve(); // Simulació d'èxit o fallada
            else reject(new Error("Network fail"));
        });
    }

    async intentaEnviarPendents() {
        for (let i = this.cuaPendent.length - 1; i >= 0; i--) {
            const p = this.cuaPendent[i];
            
            try {
                await this.enviaPaquet(p);
                this.cuaPendent.splice(i, 1); // Esborra enviat
            } catch (e) {
                p.retries++;
                if (p.retries > this.maxRetries) {
                    this.cuaPendent.splice(i, 1); // Jubila després de molts intents
                    console.warn(`Paquet ${p.id} jubilat després de ${p.retries} intents`);
                }
            }
        }
    }

    // Quan el dron torna o el sensor recupera bateria
    async sincronitzaDespresDeDesconnexio() {
        await this.intentaEnviarPendents();
        if (window.masiaCRDT) {
            window.masiaCRDT.mergeFromRemote(this.cuaPendent); // Fusiona amb CRDT
        }
    }
}

if (typeof window !== 'undefined') {
    window.packetResilience = new PacketResilience();
}

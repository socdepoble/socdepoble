// core/mesh_bluetooth.js
class MeshBluetooth {
    constructor() {
        this.dispositiusVeins = new Map();
    }

    async iniciaMesh() {
        if (!navigator.bluetooth) {
            console.warn("Bluetooth no suportat en este navegador");
            return;
        }

        try {
            const device = await navigator.bluetooth.requestDevice({
                filters: [{ namePrefix: 'Masía_' }],
                optionalServices: ['battery_service'] // Temporal fins tindre servei propi
            });

            const server = await device.gatt.connect();
            console.log(`Connectat a veí: ${device.name}`);

            this.dispositiusVeins.set(device.id, { device, server });

            // Propagació: reenviar dades rebudes
            this.propageDades();
        } catch (e) {
            console.log("No s'ha trobat veïns propers via Bluetooth");
        }
    }

    async propageDades(tipus = 'mur_update', contingut) {
        const payload = { tipus, contingut, origen: 'telefon_local', timestamp: Date.now() };
        
        for (const [id, veí] of this.dispositiusVeins) {
            try {
                // Enviar via GATT characteristic (cal definir el servei)
                const service = await veí.server.getPrimaryService('battery_service'); 
                // ... enviar dades
                console.log(`Dades propagades a ${id}`);
            } catch (e) {
                console.error(`Error propagant a ${id}:`, e);
            }
        }
    }
}

if (typeof window !== 'undefined') {
    window.meshBluetooth = new MeshBluetooth();
}

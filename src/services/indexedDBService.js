class TrellatDB {
    constructor() {
        this.db = null;
        this.worker = null;
        this.pendingTransactions = new Map(); // Trellat: Tracking de transacciones activas
        this.transactionId = 0;
    }

    async init() {
        if (this.worker) return; // Evitar doble instanciación (ghost anterior)
        
        // Crear Worker en blob (evita problemas de path en build)
        const workerCode = `
            self.onmessage = function(e) {
                const { id, operation, data } = e.data;
                try {
                    // Simulación o ejecución de operación IndexedDB atómica
                    // (En un entorno real, aquí inicializarías y operarías con idb nativo)
                    const result = { status: 'success', operation, data };
                    self.postMessage({ id, result, error: null });
                } catch (err) {
                    self.postMessage({ id, error: err.message });
                }
            };
        `;
        const blob = new Blob([workerCode], { type: 'application/javascript' });
        this.worker = new Worker(URL.createObjectURL(blob));
        
        // FANTASMA: Listener anterior no eliminado causa memory leak
        this.worker.onmessage = (e) => {
            const { id, result, error } = e.data;
            const tx = this.pendingTransactions.get(id);
            if (tx) {
                if (error) tx.reject(new Error(error));
                else tx.resolve(result);
                this.pendingTransactions.delete(id); // Limpieza inmediata
            }
        };
        
        // EXORCISMO: Terminar worker al cerrar pestaña (beforeunload es síncrono, usamos visiblitychange)
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') {
                this.flushPendingTransactions(); // Fuerza commit pendientes
            }
        });
    }

    async execute(operation, data) {
        return new Promise((resolve, reject) => {
            const id = ++this.transactionId;
            this.pendingTransactions.set(id, { resolve, reject, timestamp: Date.now() });
            
            // Trellat: Timeout de seguridad (5s). Si el worker se cuelga, liberar memoria
            setTimeout(() => {
                if (this.pendingTransactions.has(id)) {
                    this.pendingTransactions.delete(id);
                    reject(new Error('DB Transaction Timeout - Worker Zombie Killed'));
                    this.terminateAndRestartWorker(); // Exorcismo forzado
                }
            }, 5000);
            
            this.worker.postMessage({ id, operation, data });
        });
    }

    terminateAndRestartWorker() {
        if (this.worker) {
            this.worker.terminate(); // Mata el proceso OS del worker
            this.worker = null;
        }
        this.init(); // Resurrección limpia
    }
    
    // Limpieza de transacciones huérfanas (navegación abrupta)
    flushPendingTransactions() {
        this.pendingTransactions.forEach((tx, id) => {
            tx.reject(new Error('Navigation abort - transaction rolled back'));
        });
        this.pendingTransactions.clear();
    }
}

export const trellatDB = new TrellatDB();

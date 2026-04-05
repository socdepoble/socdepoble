// CAPA DE TRANSPORTE INMORTAL (TANDA 6)
import * as Y from 'yjs';
import { Observable } from 'lib0/observable';

export class TrellatWebTransport extends Observable {
    constructor(url, doc, options = {}) {
        super();
        this.url = url;
        this.doc = doc;
        this.docSynced = false;
        this.sendQueue = [];
        this.isConnected = false;
        this.transport = null; 
        this.stream = null;    
        this.writer = null;
        this.reader = null;
        this.reconnectTimer = null;
        this.lastReceivedTimestamp = 0;
        
        // Trellat: Reconexión exponencial con jitter (evita thundering herd)
        this.reconnectDelay = 1000;
        this.maxReconnectDelay = 30000;
        
        this.connect();
        
        // Listener de cambios locales -> encolar para envío
        this.doc.on('update', this.onUpdate.bind(this));
        
        // Cleanup de memoria: desvincular cuando se destruye
        this.destroy = this.destroy.bind(this);
    }

    async connect() {
        try {
            // Verificamos soporte nativo antes de fallar
            if (typeof WebTransport === 'undefined') {
                throw new Error("WebTransport no sportado nativamente en este navegador");
            }
            
            // WebTransport API nativa
            this.transport = new WebTransport(this.url);
            
            await this.transport.ready;
            this.isConnected = true;
            this.reconnectDelay = 1000;
            
            // Stream bidireccional (QUIC)
            this.stream = await this.transport.createBidirectionalStream();
            this.writer = this.stream.writable.getWriter();
            this.reader = this.stream.readable.getReader();
            
            // Sincronización inicial
            const sv = Y.encodeStateVector(this.doc);
            await this.sendChunk(sv);
            
            // Loop de lectura
            this.readLoop();
            this.emit('status', [{ status: 'connected' }]);
            
        } catch (e) {
            console.warn('[TrellatTransport] Fallo conexión:', e.message);
            this.scheduleReconnect();
        }
    }

    async sendChunk(data) {
        if (!this.writer || !this.isConnected) return;
        try {
            await this.writer.write(data);
        } catch (e) {
            console.error('[TrellatTransport] Fallo enviando paquete inicial:', e);
            this.scheduleReconnect();
        }
    }

    async readLoop() {
        try {
            while (this.isConnected) {
                const { value, done } = await this.reader.read();
                if (done) break;
                
                // Decodificar update Y.js
                const update = new Uint8Array(value);
                Y.applyUpdate(this.doc, update, this);
                this.lastReceivedTimestamp = Date.now();
            }
        } catch (e) {
            if (!this.isConnected) return;
            console.error('[TrellatTransport] Error lectura:', e);
        } finally {
            this.isConnected = false;
            this.scheduleReconnect();
        }
    }

    onUpdate(update, origin) {
        if (origin === this) return;
        
        if (this.sendQueue.length > 100) {
            this.flushQueueAggressive();
        } else {
            this.sendQueue.push(update);
            this.debouncedFlush();
        }
    }

    flushQueueAggressive() {
        this.flushQueue(); // wrapper rápido en caso de emergencia
    }

    debouncedFlush = this.debounce(() => this.flushQueue(), 50, { maxWait: 500 });

    async flushQueue() {
        if (!this.isConnected || this.sendQueue.length === 0) return;
        
        // Bloqueo atómico de escritura
        const batch = this.sendQueue.splice(0, 50);
        const merged = Y.mergeUpdates(batch);
        
        try {
            await this.writer.write(merged);
        } catch (e) {
            // Fallo de red: devolver a cola y reconectar
            this.sendQueue.unshift(...batch);
            this.isConnected = false;
            this.scheduleReconnect();
        }
    }

    scheduleReconnect() {
        if (this.reconnectTimer) return;
        
        this.emit('status', [{ status: 'reconnecting', delay: this.reconnectDelay }]);
        
        this.reconnectTimer = setTimeout(() => {
            this.reconnectTimer = null;
            this.connect();
        }, this.reconnectDelay);
        
        // Backoff exponencial con jitter
        this.reconnectDelay = Math.min(this.reconnectDelay * 2, this.maxReconnectDelay);
        this.reconnectDelay = this.reconnectDelay * (0.8 + Math.random() * 0.4);
    }

    destroy() {
        this.isConnected = false;
        clearTimeout(this.reconnectTimer);
        this.doc.off('update', this.onUpdate.bind(this));
        
        if (this.writer) this.writer.close().catch(() => {});
        if (this.transport) this.transport.close().catch(() => {});
    }

    debounce(fn, wait, options = {}) {
        let timeout, maxTimeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                clearTimeout(maxTimeout);
                fn.apply(this, args);
            }, wait);
            
            if (options.maxWait && !maxTimeout) {
                maxTimeout = setTimeout(() => {
                    clearTimeout(timeout);
                    fn.apply(this, args);
                }, options.maxWait);
            }
        };
    }
}

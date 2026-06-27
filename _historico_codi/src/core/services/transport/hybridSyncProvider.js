import { BleYjsTransport } from './bleYjsTransport';
import { supabaseService } from '../supabaseService';
import { logger } from '../../../utils/logger';

export class HybridSyncProvider {
    constructor(yjsAdapter, bluetoothManager) {
        this.adapter = yjsAdapter;
        this.ble = bluetoothManager;
        
        this.bleTransport = new BleYjsTransport(this.ble, this.adapter, {
            onSyncComplete: () => logger.log('[HybridSync] BLE Mesh sync successful'),
            onError: (err) => logger.warn('[HybridSync] BLE sync error, falling back to DTN:', err)
        });

        this.onlineChannel = null;
        this.isConnected = false;
        
        // Delay Tolerant Networking Config
        this.pendingDeltas = [];
        this.dtnInterval = null;
    }

    async connect(docId) {
        if (this.isConnected) return;
        this.isConnected = true;
        this.docId = docId;

        this.adapter.onDeltaEmit = this._handleLocalDelta.bind(this);

        if (navigator.onLine) {
            await this._connectOnline();
        } else {
            this._startDTN();
        }

        window.addEventListener('online', this._handleNetworkChange.bind(this));
        window.addEventListener('offline', this._handleNetworkChange.bind(this));
    }

    async disconnect() {
        this.isConnected = false;
        if (this.onlineChannel) {
            await supabaseService.supabase.removeChannel(this.onlineChannel);
            this.onlineChannel = null;
        }
        await this.bleTransport.disconnect();
        if (this.dtnInterval) {
            clearInterval(this.dtnInterval);
            this.dtnInterval = null;
        }
        window.removeEventListener('online', this._handleNetworkChange.bind(this));
        window.removeEventListener('offline', this._handleNetworkChange.bind(this));
    }

    async tryBleMesh() {
        if (!this.ble.isSupported) {
            logger.warn('[HybridSync] BLE not supported, relying strictly on Online/DTN');
            return false;
        }
        try {
            await this.bleTransport.connect();
            return true;
        } catch (e) {
            logger.error('[HybridSync] Failed to establish BLE Mesh via GATT:', e);
            return false;
        }
    }

    async _handleLocalDelta(delta) {
        if (!this.isConnected) return;
        
        // Broadcast via BLE
        if (this.bleTransport.isConnected) {
            this.bleTransport._broadcastDelta(delta);
        }

        // Broadcast via Supabase
        if (navigator.onLine && this.onlineChannel) {
            this.onlineChannel.send({
                type: 'broadcast',
                event: 'yjs-delta',
                payload: { delta: Array.from(delta), docId: this.docId }
            });
            // Guardar para futuros reconexiones a la DB central si queremos
        } else {
            // Guardar para DTN (Store and Forward)
            this.pendingDeltas.push(delta);
        }
    }

    async _connectOnline() {
        if (this.dtnInterval) {
            clearInterval(this.dtnInterval);
            this.dtnInterval = null;
        }

        this.onlineChannel = supabaseService.supabase.channel(`room:${this.docId}`);
        this.onlineChannel
            .on('broadcast', { event: 'yjs-delta' }, (payload) => {
                if (payload.payload?.delta) {
                    this.adapter.applyDelta(new Uint8Array(payload.payload.delta));
                }
            })
            .subscribe((status) => {
                if (status === 'SUBSCRIBED') {
                    logger.log('[HybridSync] Connected to central real-time registry');
                    this._flushPendingDeltas();
                }
            });
    }

    _handleNetworkChange() {
        if (navigator.onLine) {
            this._connectOnline();
        } else {
            if (this.onlineChannel) {
                supabaseService.supabase.removeChannel(this.onlineChannel);
                this.onlineChannel = null;
            }
            this._startDTN();
        }
    }

    _startDTN() {
        if (this.dtnInterval) return;
        logger.log('[HybridSync] Entering DTN mode (Store & Forward)');
        // Periodic check in background
        this.dtnInterval = setInterval(() => {
            if (this.pendingDeltas.length > 0 && navigator.onLine) {
                this._connectOnline();
            }
        }, 30000);
    }

    _flushPendingDeltas() {
        if (this.pendingDeltas.length === 0 || !this.onlineChannel) return;
        
        logger.log(`[HybridSync] Flushing ${this.pendingDeltas.length} DTN deltas to central registry`);
        for (const delta of this.pendingDeltas) {
            this.onlineChannel.send({
                type: 'broadcast',
                event: 'yjs-delta',
                payload: { delta: Array.from(delta), docId: this.docId }
            });
        }
        this.pendingDeltas = [];
    }
}

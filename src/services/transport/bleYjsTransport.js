import { splitIntoFrames, FrameReassembler } from './chunking';

const PAYLOAD_KIND = {
    DELTA: 1,
    STATE_VECTOR: 2,
    ACK: 3,
};

export class BleYjsTransport {
    constructor(bluetoothManager, yjsAdapter, options = {}) {
        this.ble = bluetoothManager;
        this.adapter = yjsAdapter;
        this.assembler = new FrameReassembler();
        this.isConnected = false;

        this.onSyncComplete = options.onSyncComplete || (() => {});
        this.onError = options.onError || (() => {});

        this.ble.onPacket = this._handlePacket.bind(this);
        this.ble.onDisconnect = this._handleDisconnect.bind(this);
        this.adapter.onDeltaEmit = this._broadcastDelta.bind(this);
    }

    async connect() {
        try {
            await this.ble.connect();
            this.isConnected = true;
            await this._initiateSync();
        } catch (err) {
            this.onError(err);
            throw err;
        }
    }

    async disconnect() {
        this.isConnected = false;
        await this.ble.disconnect();
    }

    async _handlePacket(bytes) {
        try {
            const reassembled = this.assembler.push(bytes);
            if (!reassembled) return;

            const { kind, payload } = reassembled;
            
            if (kind === PAYLOAD_KIND.STATE_VECTOR) {
                const missingDeltas = this.adapter.getMissingDeltas(payload);
                if (missingDeltas.byteLength > 0) {
                    await this._send(missingDeltas, PAYLOAD_KIND.DELTA);
                }
            } else if (kind === PAYLOAD_KIND.DELTA) {
                this.adapter.applyDelta(payload);
                this.onSyncComplete();
            }
        } catch (err) {
            this.onError(new Error(`Failed to process BLE packet: ${err.message}`));
        }
    }

    _handleDisconnect() {
        this.isConnected = false;
        this.onError(new Error('BLE connection lost'));
    }

    async _initiateSync() {
        if (!this.isConnected) return;
        const sv = this.adapter.getStateVector();
        await this._send(sv, PAYLOAD_KIND.STATE_VECTOR);
    }

    async _broadcastDelta(update) {
        if (!this.isConnected) return;
        await this._send(update, PAYLOAD_KIND.DELTA);
    }

    async _send(payload, kind) {
        const { frames } = splitIntoFrames(payload, { kind });
        for (const frame of frames) {
            await this.ble.write(frame);
            // Breve pausa para no saturar el buffer GATT
            await new Promise((resolve) => setTimeout(resolve, 20));
        }
    }
}

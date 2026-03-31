const logger = {
    log: (...args) => (typeof console !== 'undefined' ? console.log(...args) : null),
};

const DEFAULT_SERVICE_UUID = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';
const DEFAULT_TX_UUID = '6e400002-b5a3-f393-e0a9-e50e24dcca9e'; // write
const DEFAULT_RX_UUID = '6e400003-b5a3-f393-e0a9-e50e24dcca9e'; // notify

export class BluetoothManager {
    constructor(options = {}) {
        this.serviceUuid = options.serviceUuid || DEFAULT_SERVICE_UUID;
        this.txUuid = options.txUuid || DEFAULT_TX_UUID;
        this.rxUuid = options.rxUuid || DEFAULT_RX_UUID;
        this.acceptAllDevices = options.acceptAllDevices ?? true;
        this.namePrefix = options.namePrefix || 'SOC-';

        this.device = null;
        this.server = null;
        this.txCharacteristic = null;
        this.rxCharacteristic = null;
        this.onPacket = options.onPacket || (() => {});
        this.onDisconnect = options.onDisconnect || (() => {});

        this._boundReceive = this._handleNotification.bind(this);
        this._boundDisconnect = this._handleDisconnect.bind(this);
    }

    get isSupported() {
        return typeof navigator !== 'undefined' && !!navigator.bluetooth;
    }

    async connect() {
        if (!this.isSupported) {
            throw new Error('Web Bluetooth is not supported in this runtime');
        }

        if (this.device?.gatt?.connected) {
            return this.device;
        }

        const filters = this.acceptAllDevices
            ? undefined
            : [{ namePrefix: this.namePrefix, services: [this.serviceUuid] }];

        this.device = await navigator.bluetooth.requestDevice({
            filters,
            optionalServices: [this.serviceUuid],
            acceptAllDevices: this.acceptAllDevices,
        });

        this.device.addEventListener('gattserverdisconnected', this._boundDisconnect);
        this.server = await this.device.gatt.connect();

        const service = await this.server.getPrimaryService(this.serviceUuid);
        this.txCharacteristic = await service.getCharacteristic(this.txUuid);
        this.rxCharacteristic = await service.getCharacteristic(this.rxUuid);

        await this.rxCharacteristic.startNotifications();
        this.rxCharacteristic.addEventListener('characteristicvaluechanged', this._boundReceive);

        logger.log(`[BLE] Connected to ${this.device.name || this.device.id}`);
        return this.device;
    }

    async disconnect() {
        if (this.rxCharacteristic) {
            this.rxCharacteristic.removeEventListener('characteristicvaluechanged', this._boundReceive);
            try {
                await this.rxCharacteristic.stopNotifications();
            } catch {
                // no-op
            }
        }

        if (this.device) {
            this.device.removeEventListener('gattserverdisconnected', this._boundDisconnect);
            if (this.device.gatt?.connected) {
                this.device.gatt.disconnect();
            }
        }

        this.device = null;
        this.server = null;
        this.txCharacteristic = null;
        this.rxCharacteristic = null;
    }

    async write(packet) {
        if (!(packet instanceof Uint8Array)) {
            throw new Error('BluetoothManager.write expects Uint8Array');
        }
        if (!this.txCharacteristic) {
            throw new Error('BLE TX characteristic is not ready');
        }

        if (typeof this.txCharacteristic.writeValueWithoutResponse === 'function') {
            await this.txCharacteristic.writeValueWithoutResponse(packet);
            return;
        }

        await this.txCharacteristic.writeValue(packet);
    }

    _handleNotification(event) {
        const view = event?.target?.value;
        if (!view) return;

        const bytes = new Uint8Array(view.buffer.slice(view.byteOffset, view.byteOffset + view.byteLength));
        this.onPacket(bytes);
    }

    _handleDisconnect() {
        logger.log('[BLE] Device disconnected');
        this.onDisconnect();
    }
}

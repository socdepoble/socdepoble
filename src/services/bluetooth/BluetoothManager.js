/**
 * Sóc de Poble - Rhizome Physical Mesh
 * BluetoothManager.js
 * 
 * CORE DIRECTIVE: SOVEREIGNTY NODE
 * Este gestor coordina las comunicaciones BLE. Su misión es detectar nodos cercanos
 * ("Mulas de Datos") y establecer conexiones GATT resilientes.
 * Integra fallback dual:
 * 1. Capacitor BLE (Android/iOS) -> Soporta Peripheral Role (Broadcast) -> P2P Real.
 * 2. Web Bluetooth API -> Central Role fallido (Solo escucha) -> Para Antenas o Debug.
 */

// Simulamos la librería `@capacitor-community/bluetooth-le`
// En producción, import { BleClient } from '@capacitor-community/bluetooth-le';
const IS_CAPACITOR = !!window.Capacitor?.isNativePlatform();

// Constantes Físicas de la Red Sóc de Poble
const SDP_SERVICE_UUID = '0000180D-0000-1000-8000-00805f9b34fb'; // Placeholder - Require Custom UUID UUIDs: e.g. 'SOC-DE-POBLE-RHIZOME-MESH-1'
const SDP_CHARACTERISTIC_RX = '00002A37-0000-1000-8000-00805f9b34fb'; // Recibir Deltas
const SDP_CHARACTERISTIC_TX = '00002A38-0000-1000-8000-00805f9b34fb'; // Enviar Deltas

export class BluetoothManager {
  constructor() {
    this.isInitialized = false;
    this.connectedPeers = new Map(); // id -> connection object
    this.scannerInterval = null;
    this.listeners = new Set();
  }

  /**
   * Inicializa la radio Bluetooth asegurando permisos sin ahogar el Hilo Principal.
   */
  async initialize() {
    if (this.isInitialized) return;

    try {
      if (IS_CAPACITOR) {
        console.log('[Rhizome] Arrancando Motor BLE Vía Capacitor (P2P Mesh Activado).');
        // await BleClient.initialize();
      } else {
        console.warn('[Rhizome] Advertencia: Ejecución Web. Capacidad "Peripheral" desactivada por limitaciones del Sandbox. Solo Central.');
        if (!navigator.bluetooth) {
          throw new Error('Web Bluetooth API no soportada en este entorno.');
        }
      }
      this.isInitialized = true;
    } catch (err) {
      console.error('[Rhizome] Colapso Físico de Radio BLE:', err);
      throw err;
    }
  }

  /**
   * Arranca la patrulla BLE. Escanea dispositivos cercanos que anuncien el protocolo SDP.
   */
  async startPatrol() {
    if (!this.isInitialized) await this.initialize();
    
    console.log('[Rhizome] Iniciando Patrulla de Conexión. Buscando nodos...');
    
    if (IS_CAPACITOR) {
      // await BleClient.requestLEScan(
      //   { services: [SDP_SERVICE_UUID] },
      //   (result) => this._handleDiscoveredPeer(result)
      // );
    } else {
      // En Web, startPatrol requiere interacción directa del usuario (clic),
      // no puede ser un background-scan incondicional sin Web Bluetooth Scanning API (Experimental).
      console.warn('[Rhizome] En Web, la patrulla requiere interacción manual.');
    }
  }

  /**
   * Handshake y conexión térmica-eficiente al peer detectado.
   * @param {Object} peer 
   */
  async _handleDiscoveredPeer(peer) {
    if (this.connectedPeers.has(peer.device.deviceId)) return;

    try {
      console.log(`[Rhizome] Contacto con Mula [${peer.device.name || peer.device.deviceId}]. Estableciendo Handshake...`);
      // await BleClient.connect(peer.device.deviceId);
      
      this.connectedPeers.set(peer.device.deviceId, {
        id: peer.device.deviceId,
        name: peer.device.name,
        connectedAt: Date.now()
      });

      this._notifyListeners('peer_connected', peer.device.deviceId);
      
      // Abrimos el listener de la característica RX
      // await BleClient.startNotifications(peer.device.deviceId, SDP_SERVICE_UUID, SDP_CHARACTERISTIC_RX, (value) => {
      //   this._notifyListeners('data_received', { peerId: peer.device.deviceId, payload: value });
      // });

    } catch (error) {
      console.error(`[Rhizome] Handshake fallido con ${peer.device.deviceId}:`, error);
    }
  }

  /**
   * Emite un payload fragmentado (Chunk) a un Peer.
   * Esta capa solo envía; el chunking lo hace YjsBleTransport.
   */
  async rawWrite(peerId, chunkBuffer) {
    if (!this.connectedPeers.has(peerId)) throw new Error('Peer desconectado o fantasma.');
    
    if (IS_CAPACITOR) {
      // await BleClient.write(peerId, SDP_SERVICE_UUID, SDP_CHARACTERISTIC_TX, chunkBuffer);
    } else {
      console.log('[Rhizome] Simulando Web Write: ', chunkBuffer.length, 'bytes');
    }
  }

  // --- Observables (Patrón Event Emitter minimalista) ---
  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  _notifyListeners(type, data) {
    for (const listener of this.listeners) {
      try {
        listener({ type, data });
      } catch (err) {
        console.error('[Rhizome] Fuga de memoria en Listener BLE:', err);
      }
    }
  }
}

export const bluetoothManager = new BluetoothManager();

import * as Y from 'yjs';
import { YjsBleTransport } from './bluetooth/YjsBleTransport.js';

/**
 * Sóc de Poble - Global Rhizome Mesh
 * 
 * CORE DIRECTIVE: EL CORAZÓN LOCAL-FIRST
 * Este es el Documento Raíz (Y.Doc) que almacena el estado global de la aplicación
 * en la Malla Peer-to-Peer. No depende de internet ni de Supabase.
 * Funciona "offline first" y se sincroniza a través del BleTransport cuando detecta mulas (DTN).
 */

class RhizomeMesh {
  constructor() {
    console.log('[Rhizome] Encendiendo Motor CRDT (Y.Doc)...');
    
    // 1. El cerebro inmutable y persistente
    this.rootDoc = new Y.Doc();

    // 2. Definimos las estructuras compartidas (Maps, Arrays, Text)
    // Por ejemplo, aquí vivirán los mensajes de criticidad comunitaria:
    this.alertsMap = this.rootDoc.getMap('alerts');
    
    // 3. Conectamos los propulsores BLE DTN (Delay Tolerant Network)
    // Asumimos el riesgo soberano de capacitor para tener P2P! (Opción B)
    this.dtnTransport = new YjsBleTransport(this.rootDoc, 'soc-de-poble-global');
  }

  /**
   * Obtener el Yjs Map o Array deseado
   */
  getStore(type, name) {
    if (type === 'map') return this.rootDoc.getMap(name);
    if (type === 'array') return this.rootDoc.getArray(name);
    if (type === 'text') return this.rootDoc.getText(name);
    throw new Error('Tipo de Yjs inválido');
  }

  /**
   * Inyectar a la IA o depurador
   */
  getDiagnosticState() {
    return {
      docSize: Y.encodeStateVector(this.rootDoc).length,
      syncedPeers: Array.from(this.dtnTransport.syncedPeers),
      queueSize: this.dtnTransport.dtnQueue.length
    };
  }
}

// Singleton global de la Malla (Una red por pueblo)
export const rhizomeMesh = new RhizomeMesh();

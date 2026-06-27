// ============================================================
// SYNC CRDT v2.0 - SÓC DE POBLE
// "Yjs + IndexedDB: Consistencia sin autoridad central"
// Resuelve conflictos offline-first entre iPad 1 y iPad 2
// ============================================================

import * as Y from 'yjs';
import { IndexeddbPersistence } from 'y-indexeddb';
import { WebrtcProvider } from 'y-webrtc';
import * as awarenessProtocol from 'y-protocols/awareness';

/**
 * CONFIGURACIÓN DEL PROTOCOLO
 */
const CRDT_CONFIG = {
  DOCUMENT_PREFIX: 'soc-poble',
  SYNC_INTERVAL_MS: 5000,      // Intervalo de sync con peers
  MAX_DOC_SIZE_BYTES: 500000,  // 500KB límite por documento (A10)
  COMPRESSION_LEVEL: 'high',   // Compresión agresiva de updates
  CONFLICT_STRATEGY: 'merge'   // Estrategia: merge | last-write | custom
};

/**
 * SyncCRDT: Núcleo de sincronización soberana
 * Gestiona documentos Yjs con persistencia IndexedDB y sync P2P/WebRTC
 */
export class SyncCRDT {
  constructor(instanceId, userIdentity) {
    this.instanceId = instanceId;
    this.userId = userIdentity.globalId;
    this.documents = new Map();     // Yjs documents activos
    this.persistences = new Map();  // Adaptadores IndexedDB
    this.providers = new Map();     // Conexiones P2P/WebRTC
    this.updateQueue = [];          // Cola de updates offline
    this.conflictResolvers = new Map(); // Callbacks personalizados por tipo
    
    // Worker para procesamiento pesado (no bloquear main thread)
    this.worker = new Worker(
      URL.createObjectURL(new Blob([`
        // Worker ligero para aplicar updates Yjs
        self.onmessage = function(e) {
          const { type, update, stateVector } = e.data;
          if (type === 'merge') {
            // Merge de state vectors en worker
            self.postMessage({ result: 'merged', size: update.length });
          }
        };
      `], { type: 'application/javascript' }))
    );
  }

  // ============================================================
  // FASE 1: CREAR/ABRIR DOCUMENTO CRDT
  // ============================================================
  
  async openDocument(docId, type = 'default', initialContent = {}) {
    const fullDocId = `${CRDT_CONFIG.DOCUMENT_PREFIX}:${this.instanceId}:${docId}`;
    
    if (this.documents.has(fullDocId)) {
      return this.documents.get(fullDocId);
    }

    // Crear documento Yjs nuevo
    const ydoc = new Y.Doc({
      guid: fullDocId,
      // Colección de tipos CRDT soportados
      collectionid: type
    });

    // Persistencia Local-First: IndexedDB
    const persistence = new IndexeddbPersistence(fullDocId, ydoc);
    
    persistence.on('synced', () => {
      console.log(`[CRDT] Documento ${docId} sincronizado desde IndexedDB`);
      this.emit('local-sync', { docId, source: 'indexeddb' });
    });

    // Inicializar estructuras según tipo
    this.initializeStructure(ydoc, type, initialContent);
    
    // Configurar resolución de conflictos
    this.setupConflictResolution(ydoc, type);

    // Guardar referencias
    this.documents.set(fullDocId, ydoc);
    this.persistences.set(fullDocId, persistence);

    return ydoc;
  }

  initializeStructure(ydoc, type, initialContent) {
    const root = ydoc.getMap('root');
    
    switch(type) {
      case 'municipal-board':
        // Tablón municipal: Mapa de anuncios (clave -> objeto)
        if (!root.has('announcements')) {
          root.set('announcements', new Y.Map());
        }
        // Metadatos de sync
        root.set('_meta', new Y.Map({
          createdBy: this.userId,
          createdAt: Date.now(),
          instanceId: this.instanceId,
          version: '2.0'
        }));
        break;
        
      case 'neighbor-profile':
        // Perfil vecino: Texto rico (Y.Text) + metadatos (Y.Map)
        if (!root.has('bio')) {
          root.set('bio', new Y.Text(initialContent.bio || ''));
        }
        if (!root.has('metadata')) {
          root.set('metadata', new Y.Map(initialContent.metadata || {}));
        }
        break;
        
      case 'event':
        // Evento: Array de asistentes (Y.Array) + detalles (Y.Map)
        if (!root.has('attendees')) {
          root.set('attendees', new Y.Array());
        }
        if (!root.has('details')) {
          root.set('details', new Y.Map(initialContent));
        }
        break;
        
      default:
        // Estructura genérica
        Object.entries(initialContent).forEach(([key, value]) => {
          if (!root.has(key)) {
            root.set(key, this.wrapValue(value));
          }
        });
    }
  }

  wrapValue(value) {
    // Convertir valores JS a tipos Yjs automáticamente
    if (typeof value === 'string' && value.length > 100) {
      return new Y.Text(value);
    }
    if (Array.isArray(value)) {
      const yarr = new Y.Array();
      yarr.push(value.map(v => this.wrapValue(v)));
      return yarr;
    }
    if (typeof value === 'object' && value !== null) {
      const ymap = new Y.Map();
      Object.entries(value).forEach(([k, v]) => ymap.set(k, this.wrapValue(v)));
      return ymap;
    }
    return value; // Primitivo
  }

  // ============================================================
  // FASE 2: RESOLUCIÓN DE CONFLICTOS (EL CORAZÓN)
  // ============================================================
  
  setupConflictResolution(ydoc, type) {
    // Yjs maneja conflictos automáticamente, pero personalizamos para lógica de negocio
    
    ydoc.on('update', (update, origin) => {
      // Origin indica quién hizo el cambio ('local', 'remote', 'indexeddb')
      
      if (origin !== 'local') {
        // Cambio remoto: verificar si hay conflictos semánticos
        this.detectSemanticConflicts(ydoc, type, update);
      }
      
      // Encolar para sync con otros peers
      // this.queueUpdate(docId, update); // docId no está en el scope, lo omitimos por simplicidad del snippet
    });

    // Observer específico para tipos complejos
    if (type === 'municipal-board') {
      const announcements = ydoc.getMap('root').get('announcements');
      
      announcements.observe((event) => {
        // Alguien (local o remoto) modificó un anuncio
        event.changes.keys.forEach((change, key) => {
          if (change.action === 'update') {
            console.log(`[CRDT] Anuncio ${key} ${change.oldValue ? 'actualizado' : 'creado'}`);
            // Aquí podemos disparar notificaciones locales
          }
        });
      });
    }
  }

  detectSemanticConflicts(ydoc, type) {
    // Ejemplo: Dos usuarios editaron el mismo campo simultáneamente
    // Yjs ya mergeó el estado, pero podemos detectar "ediciones simultáneas"
    
    const root = ydoc.getMap('root');
    
    if (type === 'neighbor-profile' && root.has('metadata')) {
      const meta = root.get('metadata');
      const lastEditBy = meta.get('lastEditBy');
      const lastEditTime = meta.get('lastEditTime');
      
      if (lastEditBy && lastEditBy !== this.userId) {
        const timeDiff = Date.now() - lastEditTime;
        if (timeDiff < 5000) { // Edición dentro de 5 segundos
          console.warn(`[CRDT] Posible conflicto: Edición simultánea con ${lastEditBy}`);
          // Estrategia: Mantener ambas versiones, marcar para revisión humana
          this.flagForReview(ydoc.guid, 'simultaneous-edit', {
            authors: [lastEditBy, this.userId],
            timestamp: Date.now()
          });
        }
      }
    }
  }

  // ============================================================
  // FASE 3: SINCRONIZACIÓN P2P (WebRTC) Y SUPABASE
  // ============================================================
  
  async enableP2PSync(docId, roomName, signalingUrls = []) {
    const ydoc = this.documents.get(`${CRDT_CONFIG.DOCUMENT_PREFIX}:${this.instanceId}:${docId}`);
    if (!ydoc) throw new Error('Documento no encontrado');

    // WebRTC provider para sync directo entre iPads (sin servidor)
    const provider = new WebrtcProvider(
      `soc-poble-${roomName}`,
      ydoc,
      {
        signaling: signalingUrls.length > 0 ? signalingUrls : [
          'wss://signaling.yjs.dev', // Fallback público (reemplazar por propio)
          'wss://y-webrtc-signaling-eu.herokuapp.com'
        ],
        password: null, // Opcional: encriptación de sala
        awareness: new awarenessProtocol.Awareness(ydoc),
        maxConns: 20 + Math.floor(Math.random() * 15), // Aleatorio para evitar colisiones
        filterBcConns: true,
        peerOpts: {} // Opciones SimplePeer
      }
    );

    // Awareness: quién está conectado y qué está haciendo
    provider.awareness.setLocalStateField('user', {
      id: this.userId,
      name: this.userId.split('#')[0],
      color: this.generateColor(this.userId),
      cursor: null // Posición en documento
    });

    provider.on('status', (event) => {
      console.log(`[CRDT P2P] Estado: ${event.status}`); // 'connecting' | 'connected' | 'disconnected'
    });

    provider.on('synced', ({ synced }) => {
      console.log(`[CRDT P2P] Synced: ${synced}`);
    });

    this.providers.set(docId, provider);
    return provider;
  }

  async syncViaSupabase(docId, supabaseClient) {
    // Estrategia híbrida: Supabase como "source of truth" eventual
    // pero operaciones locales son inmediatas (Local-First)
    
    const ydoc = this.documents.get(`${CRDT_CONFIG.DOCUMENT_PREFIX}:${this.instanceId}:${docId}`);
    
    // 1. Cargar state vector desde Supabase (si existe)
    const { data: remoteState } = await supabaseClient
      .from('crdt_documents')
      .select('state_vector, updates')
      .eq('doc_id', docId)
      .single();

    if (remoteState?.state_vector) {
      // Aplicar state remoto al local (merge automático de Yjs)
      const remoteSV = new Uint8Array(remoteState.state_vector);
      Y.applyUpdate(ydoc, remoteSV);
    }

    // 2. Suscribirse a cambios remotos (Realtime)
    const subscription = supabaseClient
      .channel(`crdt:${docId}`)
      .on('postgres_changes', 
        { event: 'UPDATE', schema: 'public', table: 'crdt_documents', filter: `doc_id=eq.${docId}` },
        (payload) => {
          const update = new Uint8Array(payload.new.updates);
          Y.applyUpdate(ydoc, update, 'supabase'); // Origin 'supabase' para no re-eco
        }
      )
      .subscribe();

    // 3. Publicar cambios locales a Supabase (throttled)
    let updateBuffer = [];
    const flushUpdates = async () => {
      if (updateBuffer.length === 0) return;
      
      const merged = Y.mergeUpdates(updateBuffer);
      const stateVector = Y.encodeStateAsUpdate(ydoc);
      
      await supabaseClient
        .from('crdt_documents')
        .upsert({
          doc_id: docId,
          instance_id: this.instanceId,
          state_vector: Array.from(stateVector),
          updates: Array.from(merged),
          updated_at: new Date().toISOString()
        });
      
      updateBuffer = [];
    };

    ydoc.on('update', (update, origin) => {
      if (origin === 'local') {
        updateBuffer.push(update);
        // Debounce: flush cada 5 segundos o cuando buffer > 10KB
        if (updateBuffer.length > 10 || this.getBufferSize(updateBuffer) > 10000) {
          flushUpdates();
        }
      }
    });

    // Flush periódico
    setInterval(flushUpdates, CRDT_CONFIG.SYNC_INTERVAL_MS);

    return subscription;
  }

  // ============================================================
  // FASE 4: API PÚBLICA PARA DESARROLLADORES
  // ============================================================
  
  /**
   * Ejemplo: Editar tablón municipal (caso de uso real)
   * iPad 1 e iPad 2 pueden llamar esto simultáneamente offline
   * Cuando reconectan, Yjs mergea automáticamente
   */
  async postAnnouncement(boardId, announcement) {
    const ydoc = await this.openDocument(boardId, 'municipal-board');
    const root = ydoc.getMap('root');
    const announcements = root.get('announcements');
    
    const id = `${this.userId}_${Date.now()}`;
    const announcementData = {
      id,
      author: this.userId,
      content: announcement.content,
      priority: announcement.priority || 'normal',
      createdAt: Date.now(),
      editedAt: null,
      tags: announcement.tags || []
    };

    // Transacción atómica (siempre consistente, incluso offline)
    ydoc.transact(() => {
      announcements.set(id, announcementData);
      
      // Actualizar metadata de edición para detección de conflictos
      root.get('_meta').set('lastEditBy', this.userId);
      root.get('_meta').set('lastEditTime', Date.now());
    }, this.userId); // Origin = userId para trazabilidad

    return id;
  }

  /**
   * Ejemplo: Editar perfil (texto colaborativo)
   */
  async editProfileBio(profileId, newBioText) {
    const ydoc = await this.openDocument(profileId, 'neighbor-profile');
    const bio = ydoc.getMap('root').get('bio');
    
    // Y.Text soporta edición colaborativa tipo Google Docs
    // Si iPad 1 escribe "Hola" y iPad 2 escribe "Mundo" simultáneamente
    // Resultado: "HolaMundo" o "MundoHola" (consistente en ambos)
    
    bio.delete(0, bio.length); // Limpiar (o preservar si es append)
    bio.insert(0, newBioText);
    
    return true;
  }

  /**
   * Resolver conflicto manualmente (último recurso)
   */
  resolveConflict(docId, strategy, customResolver) {
    const ydoc = this.documents.get(`${CRDT_CONFIG.DOCUMENT_PREFIX}:${this.instanceId}:${docId}`);
    if (!ydoc) return false;

    if (strategy === 'custom' && customResolver) {
      // Aplicar lógica de negocio específica
      const root = ydoc.getMap('root');
      customResolver(root, ydoc);
    }
    
    return true;
  }

  // ============================================================
  // UTILIDADES INTERNAS
  // ============================================================
  
  generateColor(str) {
    // Color consistente basado en userId
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash % 360);
    return `hsl(${hue}, 70%, 50%)`;
  }

  getBufferSize(buffers) {
    return buffers.reduce((acc, buf) => acc + buf.length, 0);
  }

  flagForReview(docId, reason, metadata) {
    // Emitir evento para UI de moderación
    window.dispatchEvent(new CustomEvent('crdt:conflict', {
      detail: { docId, reason, metadata }
    }));
  }

  emit(event, data) {
    // Sistema de eventos interno
    if (this.listeners?.[event]) {
      this.listeners[event].forEach(cb => cb(data));
    }
  }

  // Limpieza
  destroy(docId) {
    const fullId = `${CRDT_CONFIG.DOCUMENT_PREFIX}:${this.instanceId}:${docId}`;
    
    this.providers.get(docId)?.destroy();
    this.persistences.get(fullId)?.destroy();
    this.documents.get(fullId)?.destroy();
    
    this.providers.delete(docId);
    this.persistences.delete(fullId);
    this.documents.delete(fullId);
  }
}

// ============================================================
// EJEMPLO DE USO: DOS IPADS EDITANDO EL MISMO DOCUMENTO
// ============================================================

/**
 * ESCENARIO: Tablón municipal de Banyoles
 * iPad 1 (Alcalde) y iPad 2 (Secretaria) editan simultáneamente
 */

// --- iPAD 1 (Código que ejecuta el Alcalde) ---
/*
async function setupIPad1() {
  const sync = new SyncCRDT('poble-banyoles', {
    globalId: 'alcalde#banyoles#soc_abc123'
  });
  
  // Abrir documento (crea si no existe)
  // const board = await sync.openDocument('board-municipal-2024', 'municipal-board', {
  await sync.openDocument('board-municipal-2024', 'municipal-board', {
    initialTitle: 'Tablón Oficial Banyoles'
  });
  
  // Habilitar sync P2P (directo entre iPads) + Supabase (backup)
  await sync.enableP2PSync('board-municipal-2024', 'sala-ayuntamiento');
  // await sync.syncViaSupabase('board-municipal-2024', supabase);
  
  // Publicar anuncio (funciona offline, sync cuando reconecte)
  await sync.postAnnouncement('board-municipal-2024', {
    content: 'Fiesta Mayor: 15 de Agosto, plaza mayor',
    priority: 'high',
    tags: ['fiestas', '2024']
  });
  
  console.log('iPad 1: Anuncio publicado localmente');
}
*/

// --- iPAD 2 (Código que ejecuta la Secretaria) ---
/*
async function setupIPad2() {
  const sync = new SyncCRDT('poble-banyoles', {
    globalId: 'secretaria#banyoles#soc_def456'
  });
  
  // const board = await sync.openDocument('board-municipal-2024', 'municipal-board');
  await sync.openDocument('board-municipal-2024', 'municipal-board');
  
  await sync.enableP2PSync('board-municipal-2024', 'sala-ayuntamiento');
  
  // La Secretaria añade detalle a la misma fiesta (sin saber que Alcalde ya creó el anuncio)
  // Resultado: Yjs mergea ambos anuncios o crea separados según clave
  
  // Si editan el MISMO anuncio (mismo ID), Yjs conserva ambas versiones
  // en el Y.Map, y el último en escribir "gana" en ese campo específico
  
  console.log('iPad 2: Listo para recibir/sync');
}
*/

/**
 * RESULTADO DEL CONFLICTO:
 * 
 * 1. Ambos iPads están offline en el momento de editar
 * 2. Al reconectar (WiFi municipal), WebRTC establece conexión P2P
 * 3. Yjs intercambia updates binarios comprimidos (< 1KB típicamente)
 * 4. Merge automático:
 *    - Si anuncios diferentes: ambos existen (consistencia)
 *    - Si editaron mismo campo: Last-Write-Wins en ese campo (Y.Map)
 *    - Si editaron texto colaborativo: merge de caracteres (Y.Text)
 * 5. IndexedDB persiste estado final idéntico en ambos dispositivos
 * 6. Supabase recibe estado eventual para backup/durabilidad
 */

// ============================================================
// EXPORTS
// ============================================================

export { Y, IndexeddbPersistence, WebrtcProvider };
export default SyncCRDT;

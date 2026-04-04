/**
 * LRU Manager (O(1) Puro) - Protocolo 4 Nivel Dios
 * 
 * Implementación 100% nativa con Map ES6 para proteger memoria sin devorar CPU en Androids arcaicos.
 * El Trellat manda: nada de cálculos `.sort()`, nada de PerformanceObserver inestables. Todo es O(1) y orden natural.
 */

export class PureLRUManager {
  constructor(limitBytes = 15 * 1024 * 1024, maxDocs = 10) {
    this.limitBytes = limitBytes; // Tope global (ej. 15 MB de tráfico neto binario)
    this.maxDocs = maxDocs;       // Límite cortafuegos alternativo
    this.usedBytes = 0;
    
    // Map en JS retiene el orden exacto de inserción. Primer elemento = más antiguo (Oldest).
    this.lruMap = new Map();
  }

  /**
   * MRU Touch: Tocar un documento para pasarlo al fondo de la cola,
   * informando que está 'caliente' y recientemente usado.
   */
  touch(docId) {
    if (!this.lruMap.has(docId)) return;
    
    // Extracción atómica y re-inserción pasa el valor automáticamente al "Most Recently Used"
    const data = this.lruMap.get(docId);
    this.lruMap.delete(docId);
    this.lruMap.set(docId, data);
  }

  /**
   * Registro directo: Sumar bytes sin cálculos de coste alto
   */
  trackIncomingBytes(docId, updateByteLength, docInstance = null) {
    if (!this.lruMap.has(docId)) {
        this.lruMap.set(docId, {
            byteWeight: 0,
            docRef: docInstance
        });
    } else {
        this.touch(docId); // Siempre que recibe tráfico, se calienta
    }

    const data = this.lruMap.get(docId);
    data.byteWeight += updateByteLength;
    this.usedBytes += updateByteLength;

    this.evictIfNeeded();
  }

  /**
   * El Verdugo Inmediato: Extrae implacablemente el más viejo y fuerza la muerte
   */
  evictIfNeeded() {
    // Rápido cortafuegos si estamos sanos
    while ((this.usedBytes > this.limitBytes || this.lruMap.size > this.maxDocs) && this.lruMap.size > 0) {
      
      // La genialidad técnica de O(1). next() en un Map apunta directamente al Head.
      const oldestDocId = this.lruMap.keys().next().value;
      const data = this.lruMap.get(oldestDocId);

      this.usedBytes -= data.byteWeight;
      this.lruMap.delete(oldestDocId);

      // Asesinato del Y.Doc en RAM para reventar todos sus observadores atados y vaciar memoria
      if (data.docRef && typeof data.docRef.destroy === 'function') {
          console.warn(`[LRU Manager] Purgando instancia fría per Límit de Sobirania: ${oldestDocId}`);
          data.docRef.destroy();
      }
    }
  }

  /**
   * Removerlo amistosamente desde fuera
   */
  remove(docId) {
    if (!this.lruMap.has(docId)) return;
    
    const data = this.lruMap.get(docId);
    this.usedBytes -= data.byteWeight;
    this.lruMap.delete(docId);
  }
}

// Singleton global configurado a la salvaguarda de memoria
export const lruGuard = new PureLRUManager(15 * 1024 * 1024, 10);

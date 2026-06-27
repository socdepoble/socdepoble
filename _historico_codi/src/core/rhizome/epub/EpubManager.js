import { sospDb } from '../../db/sosp-db';

/**
 * CONNEXIÓ AL MOTOR DE LECTURA OFFLINE (BANCAL MODE - PURE VANILLA)
 * Delega l'estrès de descompressió al Web Worker usant postMessage natiu.
 * Les operacions de lectura es fan directament via IndexedDB al fil principal
 * per a garantir zero latència i màxim rendiment termodinàmic a l'iPad A10.
 */

let messageIdCounter = 0;

function executeWorkerAction(action, payload) {
  return new Promise((resolve, reject) => {
    // Instanciació efímera amb el patró natiu recomanat per Vite 4+ (type: 'module')
    const worker = new Worker(new URL('../../workers/epub-parser.worker.ts', import.meta.url), { type: 'module' });
    const currentId = ++messageIdCounter;

    const onMessage = (event) => {
      const { id, result, success, error } = event.data;
      
      // Filtrem si no és el nostre ID
      if (id !== currentId) return;

      // Cooldown ATRC: Assassinem el fil asíncron després d'un xicotet marge per a alliberar la memòria sense bloquejar IndexedDB
      setTimeout(() => worker.terminate(), 500);
      worker.removeEventListener('message', onMessage);

      if (success) {
        resolve(result);
      } else {
        reject(new Error(error));
      }
    };

    worker.addEventListener('message', onMessage);
    
    worker.addEventListener('error', (err) => {
      worker.terminate();
      console.error(`[EpubManager] Trencament en xarxa de Worker Vanilla:`, err);
      reject(err);
    });

    // Missatgeria nativa, transparent i directa
    worker.postMessage({ id: currentId, action, payload });
  });
}

export class EpubManager {
  /**
   * Llança la descompressió, neteja i divisió estructural de l'EPUB
   * 
   * @param {File|Blob} file Arxiu .epub del dispositiu de l'usuari
   * @param {string} bookId ID únic per al llibre (ex: 'llibre_anima')
   * @returns {Promise<{success: boolean, totalChunks: number, bookTOC: Array}>}
   */
  static async startOfflineImport(file, bookId) {
    console.info(`[EpubManager] Iniciant importació en 2n pla per a: ${bookId}`);
    try {
      // Passem l'arrayBuffer al Worker perquè els Files/Blobs complexos
      // es transformen en dades transferibles més purament
      const arrayBuffer = await file.arrayBuffer();
      
      // Crida destructuradora sobre el fil principal: worker efímer amb Vanilla IPC
      const result = await executeWorkerAction('importEpub', { fileBuffer: arrayBuffer, bookId });
      
      console.info(`[EpubManager] Importació Completada! TOC rebut.`);
      return result;
    } catch (error) {
      console.error(`[EpubManager] Falla crítica al motor de Chunking:`, error);
      throw error;
    }
  }

  static async startOfflineImportHtml(htmlString, bookId) {
    console.info(`[EpubManager] Iniciant importació HTML en 2n pla per a: ${bookId}`);
    try {
      const result = await executeWorkerAction('importHtml', { htmlString, bookId });
      console.info(`[EpubManager] Processament HTML Completat! TOC rebut.`);
      return result;
    } catch (error) {
      console.error(`[EpubManager] Falla crítica al motor de Chunking HTML:`, error);
      throw error;
    }
  }

  /**
   * Recupera ultraràpidament la taula de referències al contingut guardat
   * SENSE MALS DE CAP IPC, directament d'IndexedDB
   * @param {string} bookId 
   */
  static async getBookToc(bookId) {
    const meta = await sospDb.getBookMeta(bookId);
    return meta ? meta.toc : null;
  }

  /**
   * Retorna un HTML estricte d'aproximadament 1000 paraules per ser muntat directament
   * SENSE MALS DE CAP IPC, directament d'IndexedDB
   * @param {string} chunkRefId - Ex: "epub_llibre_anima_chunk_4"
   */
  static async getChunkHtml(chunkRefId) {
    return await sospDb.getChunk(chunkRefId);
  }
  
  /**
   * Tanca i llibera. Com els workers són efímers, no cal fer res ací.
   */
  static async terminate() {
    // Els workers efímers ja s'han alliberat automàticament.
  }
}

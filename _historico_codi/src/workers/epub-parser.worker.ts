import * as Comlink from 'comlink';

/**
 * ⛏️ EPUB PARSER WORKER (Mina subterrània)
 * Aquest codi s'executa en un fil totalment aïllat de la UI.
 * Qualsevol bloqueig ací (Parsing pesat, processament DOM) no congelarà els 60fps
 * de les animacions a l'iPad A10.
 */

const epubParser = {
  /**
   * Importació d'un Blob/ArrayBuffer (Llibre .ePub real)
   */
  async importEpub(arrayBuffer: ArrayBuffer, bookId: string) {
    console.log(`[Worker] Iniciant extracció del ZIP per a: ${bookId}`);
    console.log(`[Worker] Pes brut rebut: ${arrayBuffer.byteLength} bytes.`);
    
    // MOCK: Simularem que tardem 1 segon desant fragments
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // De moment, inventem el TOC per retornar la interfície
    const mockTOC = [
      { id: "ref_1", title: "Capítol 1: El naixement del ratolí", order: 1 },
      { id: "ref_2", title: "Capítol 2: La llei de l'eficiència", order: 2 }
    ];

    return {
      success: true,
      totalChunks: mockTOC.length,
      bookTOC: mockTOC
    };
  },

  /**
   * Importació de HTML Sintètic (Rebent string directament)
   */
  async importHtmlBuffer(htmlString: string, bookId: string) {
    console.log(`[Worker] Injectant document HTML fluid per a: ${bookId}`);
    
    // No cal decodificar, ja rebem un string
    
    // Simulació de temps de parseig (e.g., regex DOM purify, partició de blocs)
    await new Promise(resolve => setTimeout(resolve, 500));

    const mockTOC = [
      { id: "html_chunk_1", title: "Primera part genèrica", order: 1 }
    ];

    return {
      success: true,
      totalChunks: mockTOC.length,
      bookTOC: mockTOC
    };
  },

  /**
   * Extracció ràpida del TOC general (es llegirà d'IndexedDB prompte)
   */
  async getBookToc(bookId: string) {
    console.log(`[Worker] Serveix TOC des de la memòria per a: ${bookId}`);
    return [
      { id: "ref_1", title: "Aquest índex s'ha mockejat directament al Worker.", order: 1 }
    ];
  },

  /**
   * Retorna un tros de text pesat en format Buffer asíncron
   */
  async getChunkBuffer(chunkRefId: string) {
    console.log(`[Worker] Preparant enviament per referència: ${chunkRefId}`);
    // Simulació d'extracció de disc o index local.
    const chunkHTML = `<div class="epub-mock-chunk"><h3>Fragment: ${chunkRefId}</h3><p>Aquest text ha sigut processat per la mina asíncrona i enviat a la UI a la velocitat de la llum. T'he estalviat tota l'embranzida del descompressor ZIP.</p></div>`;
    
    const encoder = new TextEncoder();
    const uint8array = encoder.encode(chunkHTML);
    // Transfereix el control de la memòria al fil principal 
    return Comlink.transfer(uint8array.buffer, [uint8array.buffer]);
  }
};

// Traiem la interfície a l'exterior (exposició cap a `EpubManager.js`)
Comlink.expose(epubParser);

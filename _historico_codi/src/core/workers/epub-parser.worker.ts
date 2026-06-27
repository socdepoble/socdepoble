import JSZip from 'jszip';
import { sospDb } from '../db/sosp-db';

// ========== CONTRACTES DE TIPUS ==========
interface ChunkResult {
  id: string;
  html: string;
}

interface BookTOC {
  chapterId: string;
  chapterIndex?: number;
  numChunks?: number;
  chunkRefs: string[];
}

interface ImportResult {
  success: boolean;
  totalChunks: number;
  bookTOC: BookTOC[];
}

type WorkerAction = 'importEpub' | 'importHtml';

interface WorkerRequest {
  id: number;
  action: WorkerAction;
  payload: {
    htmlString?: string;
    fileBuffer?: ArrayBuffer;
    bookId: string;
  };
}

interface WorkerResponse {
  id: number;
  success: boolean;
  result?: ImportResult;
  error?: string;
}

// --- Funcions Netjadores Auxiliars (Sense afectar el fil principal) ---
function extractOpfPath(containerXml: string): string {
  const match = containerXml.match(/full-path="([^"]+)"/);
  if (!match) throw new Error('Rootfile (OPF) no trobat a container.xml');
  return match[1];
}

function parseManifestAndSpine(opfXml: string, basePath: string) {
  const manifestMatches = [...opfXml.matchAll(/<item[^>]+id="([^"]+)"[^>]+href="([^"]+)"[^>]*\/>/g)];
  const manifest: Record<string, string> = {};
  for (const m of manifestMatches) {
    const id = m[1];
    let href = m[2];
    // Evita duplicar el basePath si l'href ja és relatiu correctament des de l'arrel de l'EPUB
    const fullHref = basePath ? `${basePath}/${href}` : href;
    manifest[id] = fullHref;
  }

  const spineMatches = [...opfXml.matchAll(/<itemref[^>]+idref="([^"]+)"[^>]*\/>/g)];
  const spine = spineMatches.map(m => m[1]);
  
  return { manifest, spine };
}

function cleanHtml(htmlStr: string): string {
  let bodyMatch = htmlStr.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  let body = bodyMatch ? bodyMatch[1] : htmlStr;

  // Neteja extrema A10 (Trinitat Termodinàmica)
  body = body.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  body = body.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
  body = body.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
  
  // Opcional: Eliminar inline styles que poden causar reflows lents
  body = body.replace(/ style="[^"]*"/gi, '');

  return body;
}

// Algorisme de Trossejament (Chunking) ~4000 caràcters per tros
function chunkChapter(htmlContent: string, chapterIndex: number, bookId: string): ChunkResult[] {
  const CHUNK_SIZE = 4000; 
  const chunks: ChunkResult[] = [];
  
  // Si és menut, no ens compliquem, cap dins d'un sol chunk d'or
  if (htmlContent.length <= CHUNK_SIZE) {
    return [{
      id: `${bookId}-c${chapterIndex}-1`,
      html: htmlContent
    }];
  }

  // Divisió estratègica per paràgrafs per a no trencar el flux
  const paragraphs = htmlContent.split(/(<\/p>|<br\s*\/?>|<\/div>|<\/h[1-6]>)/gi);
  
  let currentChunkHtml = '';
  let subIndex = 1;

  for (let i = 0; i < paragraphs.length; i++) {
    currentChunkHtml += paragraphs[i];
    
    // El delimitador (com </p>) estarà a paragraphs[i+1] a causa del split amb captura
    // Anem sumant. 
    
    // Només tallem si hem passat el límit I tenim un delimitador natural procedent
    if (currentChunkHtml.length >= CHUNK_SIZE && i % 2 !== 0) {
      chunks.push({
        id: `${bookId}-c${chapterIndex}-${subIndex}`,
        html: currentChunkHtml.trim()
      });
      currentChunkHtml = '';
      subIndex++;
    }
  }

  // Els retalls finals
  if (currentChunkHtml.trim().length > 0) {
    chunks.push({
      id: `${bookId}-c${chapterIndex}-${subIndex}`,
      html: currentChunkHtml.trim()
    });
  }

  return chunks;
}

// --- API LÒGICA INTERNA ---
const EpubParserApi = {
  
  async importEpub(fileBuffer: ArrayBuffer, bookId: string): Promise<ImportResult> {
    console.log(`[EPUB Worker] Descomprimint Llibre ${bookId}...`);
    
    // 1. OBRIR ZIP NATIVAMENT
    const zip = await JSZip.loadAsync(fileBuffer);
    
    // 2. BUSCAR EL OPF AL CONTAINER
    const containerFile = zip.file('META-INF/container.xml');
    if (!containerFile) throw new Error('No és un EPUB vàlid (manca container.xml)');
    const containerXml = await containerFile.async('string');
    
    const opfPath = extractOpfPath(containerXml);
    const basePath = opfPath.includes('/') ? opfPath.split('/').slice(0, -1).join('/') : '';
    
    // 3. ANALITZAR EL OPF
    const opfFile = zip.file(opfPath);
    if (!opfFile) throw new Error('Fitxer OPF no trobat a la ruta declarada');
    const opfXml = await opfFile.async('string');
    
    const { manifest, spine } = parseManifestAndSpine(opfXml, basePath);
    
    const bookTOC: BookTOC[] = [];
    let absoluteGlobalChunkIndex = 0;

    // 4. PREPROCESSAMENT (CHUNKING DE CADA CAPÍTOL)
    for (let c = 0; c < spine.length; c++) {
      const manifestId = spine[c];
      const filePath = manifest[manifestId];
      if (!filePath) continue; // Si no tenim ruta per al objecte, ignora'l

      const chapterFile = zip.file(filePath);
      if (!chapterFile) continue;

      const htmlRaw = await chapterFile.async('string');
      const cleanBody = cleanHtml(htmlRaw);
      
      const chapterChunks = chunkChapter(cleanBody, c, bookId);
      
      const chunkRefs: string[] = [];
      for (const ch of chapterChunks) { // Gravar ràpid a IDB
        const globalRef = `epub_${bookId}_chunk_${absoluteGlobalChunkIndex}`;
        await sospDb.saveChunk(globalRef, ch.html);
        chunkRefs.push(globalRef);
        absoluteGlobalChunkIndex++;
      }
      
      bookTOC.push({
        chapterId: manifestId,
        chapterIndex: c,
        numChunks: chapterChunks.length,
        chunkRefs
      });
    }

    // Guardar el Index/TOC final del Llibre sencer
    await sospDb.saveBookMeta({ id: bookId, toc: bookTOC });
    console.log(`[EPUB Worker] Llibre ${bookId} trossejat i ancorat a la Càmera Cuirassada (IndexedDB) amb èxit. Total chunks: ${absoluteGlobalChunkIndex}`);
    return { success: true, totalChunks: absoluteGlobalChunkIndex, bookTOC };
  },

  async importHtml(htmlString: string, bookId: string): Promise<ImportResult> {
    console.log(`[EPUB Worker] Trossejant HTML directe per a ${bookId}...`);
    const cleanBody = cleanHtml(htmlString);
    const chapterChunks = chunkChapter(cleanBody, 0, bookId);
    
    const chunkRefs: string[] = [];
    for (let i = 0; i < chapterChunks.length; i++) {
        const globalRef = `epub_${bookId}_chunk_${i}`;
        await sospDb.saveChunk(globalRef, chapterChunks[i].html);
        chunkRefs.push(globalRef);
    }
    
    const bookTOC: BookTOC[] = [{
        chapterId: 'html_index',
        chapterIndex: 0,
        numChunks: chapterChunks.length,
        chunkRefs
    }];
    
    await sospDb.saveBookMeta({ id: bookId, toc: bookTOC }); 
    
    console.log(`[EPUB Worker] Text HTML ${bookId} trossejat i ancorat a la Càmera Cuirassada (IndexedDB) amb èxit. Total chunks: ${chapterChunks.length}`);
    return { success: true, totalChunks: chapterChunks.length, bookTOC };
  }
};

// --- PONT DE COMUNICACIÓ VANILLA JS (BANCAL MODE) ---
self.addEventListener('message', async (event: MessageEvent<WorkerRequest>) => {
  const { id, action, payload } = event.data;
  
  if (!action) return;

  try {
    let result: ImportResult;
    switch (action) {
      case 'importEpub':
        if (!payload.fileBuffer) throw new Error('Manca fileBuffer');
        result = await EpubParserApi.importEpub(payload.fileBuffer, payload.bookId);
        break;
      case 'importHtml':
        if (!payload.htmlString) throw new Error('Manca htmlString');
        result = await EpubParserApi.importHtml(payload.htmlString, payload.bookId);
        break;
      default:
        throw new Error(`Acció desconeguda al Worker: ${action}`);
    }
    
    // Responem a l'ID de la sol·licitud exactament
    const response: WorkerResponse = { id, result, success: true };
    self.postMessage(response);
    
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    const response: WorkerResponse = { 
      id, 
      success: false, 
      error: message || 'Error intern al Worker processant la comanda.' 
    };
    self.postMessage(response);
  }
});

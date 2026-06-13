import { pipeline } from '@xenova/transformers';

let embedderInstance = null;

/**
 * Singleton del model d'embeddings (multilingüe, 384 dimensions)
 */
export async function getEmbedder() {
  if (embedderInstance) return embedderInstance;
  
  console.log('🧠 Carregant model d\\'embeddings (paraphrase-multilingual-MiniLM-L12-v2)...');
  console.log('   (Aquesta primera vegada pot trigar uns segons. Després vindrà de caché.)\n');
  
  embedderInstance = await pipeline(
    'feature-extraction',
    'Xenova/paraphrase-multilingual-MiniLM-L12-v2',
    { quantized: true } // Versió quantitzada: ~120MB en lloc de ~470MB
  );
  
  console.log('✅ Model carregat.\n');
  return embedderInstance;
}

/**
 * Genera l'embedding d'un text (retorna array de 384 floats)
 */
export async function embed(text) {
  const embedder = await getEmbedder();
  
  const output = await embedder(text, {
    pooling: 'mean',
    normalize: true
  });
  
  return Array.from(output.data);
}

/**
 * Genera embeddings en batch (més ràpid)
 */
export async function embedBatch(texts, onProgress = null) {
  const embedder = await getEmbedder();
  const results = [];
  
  for (let i = 0; i < texts.length; i++) {
    const output = await embedder(texts[i], {
      pooling: 'mean',
      normalize: true
    });
    results.push(Array.from(output.data));
    
    if (onProgress) onProgress(i + 1, texts.length);
  }
  
  return results;
}

/**
 * Similaritat del cosenu entre dos vectors
 */
export function cosineSimilarity(a, b) {
  if (a.length !== b.length) throw new Error('Vectors de diferent longitud');
  
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

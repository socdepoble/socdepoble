import { signData, verifySignature, importPublicKey } from '../identity/signatures';

// Constantes
export const DAG_ROOT = '0000000000000000000000000000000000000000000000000000000000000000';

/**
 * 1. DAG LOCAL-FIRST (SIN MINERÍA)
 * En lugar de usar arrays simples (que colisionarían en P2P),
 * usamos un Y.Map donde cada key es el hash del evento y el valor es el bloque completo.
 * Esto nos da sincronización sin servidor (mesh) "gratis" y sin conflictos de red,
 * manteniendo el control criptográfico offline-first.
 */

// Función utilitaria para generar hash SHA-256 (ID único y determinista)
export async function calculateHash(payload, parents) {
  const encoder = new TextEncoder();
  const data = encoder.encode(JSON.stringify({ payload, parents }));
  const buffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * FABRICAR NODO (BLOQUE)
 */
export async function createNode(payload, parents, privateKey, authorJwk) {
  // 1. Aseguramos que tenemos conectores padres (si es el primero apuntamos al ROOT)
  const validParents = parents && parents.length > 0 ? parents : [DAG_ROOT];
  
  // 2. Firmamos el payload + parents (No el timestamp para asegurar determinismo del hash base si hiciera falta, aunque aquí va atado)
  const timestamp = Date.now();
  const dataToSign = { payload, parents: validParents, timestamp };
  
  const signature = await signData(privateKey, dataToSign);
  const hashId = await calculateHash(payload, validParents);

  return {
    id: hashId,
    parents: validParents,
    payload,
    author: authorJwk, // JWK de la clave pública para verificar
    timestamp,
    signature
  };
}

/**
 * VALIDAR NODO (Zero-Trust Security local)
 * Cualquiera que reciba el DAG vía Gossip revisa bloque a bloque.
 */
export async function validateNode(node) {
  if (node.parents.length === 0) return false;
  
  try {
    const publicKey = await importPublicKey(node.author);
    const dataToVerify = { payload: node.payload, parents: node.parents, timestamp: node.timestamp };
    
    // Web Crypto Verify
    const isValid = await verifySignature(publicKey, node.signature, dataToVerify);
    return isValid;
  } catch (err) {
    console.error("Fallo de validación de bloque DAG", err);
    return false;
  }
}

/**
 * INSERCIÓN SOBERANA A YJS
 * yDoc.getMap('dag_blocks') propagará esto por la malla sin miedo a colisiones.
 */
export async function appendToDAG(yMap, node) {
  const isValid = await validateNode(node);
  if (!isValid) throw new Error("Bloque no válido o firma corrupta.");
  
  // Insertamos en el mapa CRDT. El resto de la red lo recibirá por Gossip/Anti-Entropy
  yMap.set(node.id, node);
}

/**
 * ORDENAMIENTO TOPOLÓGICO Y RESOLUCIÓN SOBERANA
 * ChatGPT devolvió un `sort()` inocente. En sistemas mesh reales necesitamos 
 * recorrer los parent links para estructurar la cadena temporal real.
 */
export function buildTimeline(yMap) {
  const nodes = Array.from(yMap.values());
  const timeline = [];
  const visited = new Set();
  const graph = new Map();

  // Construir adyacencia
  nodes.forEach(n => {
    graph.set(n.id, n);
  });

  // Kahn's algorithm (modificado para convergencia)
  function dfs(nodeId) {
    if (visited.has(nodeId)) return;
    visited.add(nodeId);
    
    const node = graph.get(nodeId);
    if (!node) return; // Padrote localmente perdido (requiere sync)
    
    node.parents.forEach(p => dfs(p));
    timeline.push(node);
  }

  nodes.forEach(n => dfs(n.id));

  // Resolver "Ties" (Empates por bifurcación asíncrona) 
  // Regla: En caso de orfandad paralela, gana la de timestamp más antiguo + desempate determinista por ID
  return timeline.sort((a, b) => {
     if (a.timestamp !== b.timestamp) return a.timestamp - b.timestamp;
     return a.id.localeCompare(b.id);
  });
}

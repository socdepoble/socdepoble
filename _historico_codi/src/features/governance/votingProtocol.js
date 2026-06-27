import { createNode, appendToDAG, buildTimeline, DAG_ROOT } from '../dag/dagEngine';

/**
 * 2. GOBERNANZA DISTRIBUIDA Y JUSTICIA (Offline-First Quórum)
 *
 * Cada voto y propuesta es un bloque del DAG que entra en una carrera 
 * distribuida. No hay "Administradores", el peso del voto depende de 
 * un factor dinámico: un trustScore local calculado por grafos.
 */

// Función temporal mock, en v14/v15 esto viene del módulo de Reputación
 
const getLocalTrustScore = (jwkAuthor) => {
  return 10; // Todos valen 10 hasta conectar WebOfTrust
};

/**
 * PROPONER ALGO A LA COMUNIDAD
 * (Ej: Feature flag, expulsar un bad actor, resolución de trueques)
 */
export async function submitProposal(yMap, type, data, privateKey, authorJwk) {
  const payload = {
    domain: "GOVERNANCE",
    action: "PROPOSAL_CREATE",
    type,
    data,
    status: "OPEN"
  };

  // Traemos el hilo actual para atar este bloque al último conocido
  const timeline = buildTimeline(yMap);
  const lastBlock = timeline.length > 0 ? timeline[timeline.length - 1].id : DAG_ROOT;

  const node = await createNode(payload, [lastBlock], privateKey, authorJwk);
  await appendToDAG(yMap, node);
  return node.id;
}

/**
 * EMITIR VOTO A PROPUESTA EXISTENTE
 */
export async function submitVote(yMap, proposalId, value, privateKey, authorJwk) {
  // Verificamos si estamos baneados nosotros mismos antes de saturar (Anti-Sybil base)
  const myReputation = getLocalTrustScore(authorJwk);
  if (myReputation <= 0) throw new Error("Reputación insuficiente para votar en asambleas.");

  const payload = {
    domain: "GOVERNANCE",
    action: "VOTE",
    proposalId,
    value // +1 (A favor), -1 (En contra), 0 (Abstención/Bloqueo)
  };

  const node = await createNode(payload, [proposalId], privateKey, authorJwk);
  await appendToDAG(yMap, node);
  return node.id;
}

/**
 * DETERMINAR QUÓRUM Y RESOLVER
 * Función PURA. Se puede ejecutar en cualquier nodo y siempre dará el mismo resultado 
 * asumiendo que el DAG (estado Yjs) ha convergido.
 */
export function countProposalVotes(yMap, proposalId) {
  const timeline = buildTimeline(yMap);
  
  // 1. Filtrar votos válidos para esta propuesta
  const votes = timeline.filter(n => 
    n.payload.domain === "GOVERNANCE" && 
    n.payload.action === "VOTE" &&
    n.payload.proposalId === proposalId
  );

  let score = 0;
  const votedAuthors = new Set(); // Anti-doble-voto (toma el último por orden temporal del DAG)

  // En DAG convergentes, el timeline ya viene ordenado de más antiguo a más nuevo,
  // por lo que si alguien vota dos veces, en una implementación PNCounter podríamos sumar y restar,
  // aquí, la versión más simple y robusta LWW (Last Writer Wins): Damos la vuelta.
  [...votes].reverse().forEach(v => {
    if (!votedAuthors.has(v.author)) {
      votedAuthors.add(v.author);
      const rep = getLocalTrustScore(v.author);
      score += (v.payload.value * rep); // Ponderación Soberana
    }
  });

  // Threshold dinámico (Mock: > 50 puntos de trust a favor = aprobado)
  const threshold = 50; 

  const status = score >= threshold ? "APPROVED" : (score <= -threshold ? "REJECTED" : "PENDING");

  return { proposalId, score, votes_cast: votedAuthors.size, status };
}

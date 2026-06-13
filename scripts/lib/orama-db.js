import { create, insert, search, save, load } from '@orama/orama';
import fs from 'fs/promises';
import path from 'path';

const DB_DIR = path.join(process.cwd(), '.rag-db');
const DB_PATH = path.join(DB_DIR, 'orama.json');

/**
 * Crea l'esquema Orama amb suport vectorial
 */
export async function createOramaDB() {
  const db = await create({
    schema: {
      id: 'string',
      act_id: 'string',
      tipus: 'enum',
      titol: 'string',
      descripcio: 'string',
      impacte: 'number',
      intensitat_emocional: 'number',
      emocions: 'enum[]',
      tags: 'enum[]',
      timestamp: 'string',
      memory_weight: 'number',
      embedding: 'vector[384]'
    },
    components: {
      tokenizer: {
        language: 'spanish' // Orama no té català, castellà és el més proper per arrels llatines
      }
    }
  });
  
  return db;
}

/**
 * Guarda la DB al disc
 */
export async function saveDB(db) {
  await fs.mkdir(DB_DIR, { recursive: true });
  const data = await save(db);
  await fs.writeFile(DB_PATH, JSON.stringify(data), 'utf-8');
}

/**
 * Carrega la DB del disc
 */
export async function loadDB() {
  try {
    const data = JSON.parse(await fs.readFile(DB_PATH, 'utf-8'));
    return await load(createOramaDB, data);
  } catch (err) {
    if (err.code === 'ENOENT') {
      return await createOramaDB();
    }
    throw err;
  }
}

/**
 * Insereix un microrecord a la DB
 */
export async function insertMicrorecord(db, microrecord, embedding) {
  await insert(db, {
    id: microrecord.id,
    act_id: microrecord.act_id,
    tipus: microrecord.tipus,
    titol: microrecord.titol,
    descripcio: microrecord.descripcio,
    impacte: microrecord.impacte,
    intensitat_emocional: microrecord.intensitat_emocional,
    emocions: microrecord.emocions,
    tags: microrecord.tags,
    timestamp: microrecord.timestamp,
    memory_weight: microrecord.memory_weight,
    embedding
  });
}

/**
 * Cerca híbrida: fulltext + vectorial + boost per memory_weight
 */
export async function hybridSearch(db, query, queryEmbedding, opts = {}) {
  const {
    topK = 5,
    vectorWeight = 0.6,     // 60% semàntic, 40% paraules clau
    minSimilarity = 0.3
  } = opts;
  
  // Cerca vectorial
  const vectorResults = await search(db, {
    mode: 'vector',
    vector: {
      value: queryEmbedding,
      property: 'embedding'
    },
    limit: topK * 2,
    similarity: minSimilarity
  });
  
  // Cerca fulltext
  const textResults = await search(db, {
    term: query,
    properties: ['titol', 'descripcio', 'tags'],
    limit: topK * 2
  });
  
  // Fusionar resultats amb RRF (Reciprocal Rank Fusion)
  const scoreMap = new Map();
  
  vectorResults.hits.forEach((hit, idx) => {
    const id = hit.document.id;
    const rrfScore = 1 / (60 + idx + 1);
    const existing = scoreMap.get(id) || { doc: hit.document, score: 0 };
    existing.score += rrfScore * vectorWeight;
    scoreMap.set(id, existing);
  });
  
  textResults.hits.forEach((hit, idx) => {
    const id = hit.document.id;
    const rrfScore = 1 / (60 + idx + 1);
    const existing = scoreMap.get(id) || { doc: hit.document, score: 0 };
    existing.score += rrfScore * (1 - vectorWeight);
    scoreMap.set(id, existing);
  });
  
  // Aplicar boost per memory_weight
  const finalResults = Array.from(scoreMap.values())
    .map(r => ({
      ...r,
      finalScore: r.score * (1 + Math.log1p(r.doc.memory_weight))
    }))
    .sort((a, b) => b.finalScore - a.finalScore)
    .slice(0, topK);
  
  return finalResults;
}

export { createOramaDB as createDB };

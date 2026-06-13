import fs from 'fs/promises';
import path from 'path';
import { create, insert, search, save, load } from '@orama/orama';
import { pipeline, env } from '@xenova/transformers';
import chalk from 'chalk';
import yaml from 'yaml';
import { MicrorecordSchema } from './schema.js';

env.allowLocalModels = true;
process.env.IGNORE_WARNINGS = 'true';

const ACTES_DIR = path.join(process.cwd(), 'knowledge', 'actes');
const DB_PATH = path.join(process.cwd(), 'knowledge', 'rag-db.json');

async function initDB() {
  try {
    const dbData = await fs.readFile(DB_PATH, 'utf-8');
    return await load(JSON.parse(dbData));
  } catch (err) {
    return await create({
      schema: {
        id: 'string',
        tipus: 'string',
        titol: 'string',
        contingut: 'string',
        memory_weight: 'number',
        intensitat: 'number',
        impacte: 'number',
        sessio_origen: 'string',
        embedding: 'vector[384]'
      }
    });
  }
}

async function indexar() {
  console.log(chalk.gray('🧠 Despertant el Còrtex Prefrontal (Transformers Local)...'));
  const extractor = await pipeline('feature-extraction', 'Xenova/paraphrase-multilingual-MiniLM-L12-v2', { quantized: true });
  const db = await initDB();

  try {
    await fs.mkdir(ACTES_DIR, { recursive: true });
    const files = await fs.readdir(ACTES_DIR);
    let indexats = 0;

    for (const file of files) {
      if (!file.endsWith('.md')) continue;
      const content = await fs.readFile(path.join(ACTES_DIR, file), 'utf-8');
      
      const yamlMatch = content.match(/^---\n([\s\S]*?)\n---/);
      if (!yamlMatch) continue;

      const metadata = yaml.parse(yamlMatch[1]);
      if (!metadata.microrecords) continue;

      for (const mr of metadata.microrecords) {
        // Obviar els ja indexats en entorns de producció requereix ID checks
        // En aquesta versió reindexem (simplificat per al Mas)
        const textToEmbed = `${mr.tipus} ${mr.titol} ${mr.contingut} ${mr.llico_apresa || ''} ${mr.contexto_narrativo || ''}`;
        const output = await extractor(textToEmbed, { pooling: 'mean', normalize: true });

        await insert(db, {
          id: mr.id || '',
          tipus: mr.tipus,
          titol: mr.titol,
          contingut: mr.contingut,
          memory_weight: mr.memory_weight || 0.5,
          intensitat: mr.intensitat,
          impacte: mr.impacte,
          sessio_origen: mr.sessio_origen || '',
          embedding: Array.from(output.data)
        });
        indexats++;
      }
    }

    const dbExport = await save(db);
    await fs.writeFile(DB_PATH, JSON.stringify(dbExport));
    console.log(chalk.green(`\n✅ S'han indexat ${indexats} unitats semàntiques a l'ànima del Mas.\n`));
  } catch (error) {
    console.error(chalk.red('❌ Error indexant actes:'), error);
  }
}

async function cercar(query) {
  if (!query) {
    console.log(chalk.red('Cal proporcionar una consulta. Ex: npm run memoria:cercar "problema amb z-index"'));
    return;
  }

  console.log(chalk.cyan(`\n🔮 Canalitzant la intuïció per a: "${query}"...`));
  const extractor = await pipeline('feature-extraction', 'Xenova/paraphrase-multilingual-MiniLM-L12-v2', { quantized: true });
  const queryOutput = await extractor(query, { pooling: 'mean', normalize: true });
  const db = await initDB();

  const resultats = await search(db, {
    mode: 'hybrid',
    term: query,
    vector: { value: Array.from(queryOutput.data), property: 'embedding' },
    similarity: 0.3,
    limit: 5
  });

  if (resultats.hits.length === 0) {
    console.log(chalk.green('\n🍃 Cap ressò a l\'ànima. Avança sense por.'));
    return;
  }

  // Re-Ranking: Similitud * Memory Weight amb decaïment exponencial i Tombstone Bonus
  const dataActual = new Date();
  
  const ordenats = resultats.hits.map(hit => {
    const doc = hit.document;
    
    // Calcular ageDays
    const docDate = new Date(doc.id.split('-')[1] || dataActual); // Simplificació per l'exemple
    let ageDays = (dataActual - docDate) / (1000 * 60 * 60 * 24);
    if (isNaN(ageDays) || ageDays < 0) ageDays = 0;
    
    // Les làpides no caduquen (Gemini + Copilot)
    const decay = doc.tipus === 'tombstone' ? 1 : Math.exp(-ageDays / 30);
    const weightFinal = doc.memory_weight * decay;
    
    // Tombstone bonus (+0.15)
    let score = hit.score * 0.6 + weightFinal * 0.3;
    if (doc.tipus === 'tombstone') score += 0.15;
    
    return {
      ...doc,
      scoreOriginal: hit.score,
      intuition_score: score,
      weightFinal
    };
  }).sort((a, b) => b.intuition_score - a.intuition_score);

  console.log(chalk.bgMagenta.white.bold('\n 🔮 [XIUXIUEIG COGNITIU RECUPERAT] \n'));
  
  ordenats.forEach((hit, idx) => {
    const isPerill = hit.tipus === 'scar' || hit.tipus === 'tombstone';
    const colorTipus = isPerill ? chalk.bgRed.white : chalk.bgGreen.black;
    const icona = hit.tipus === 'scar' ? '🩸' : hit.tipus === 'tombstone' ? '🪦' : '💡';
    
    console.log(colorTipus(` ${icona} ${hit.tipus.toUpperCase()} `) + chalk.yellow(` [${hit.sessio_origen}]`));
    console.log(chalk.bold(hit.titol));
    console.log(chalk.gray(`Memory Weight: ${hit.memory_weight.toFixed(2)} | Intensitat: ${hit.intensitat}/10`));
    console.log(chalk.white(`"${hit.contingut}"\n`));
  });
}

const comand = process.argv[2];
if (comand === 'indexar') {
  indexar().catch(console.error);
} else if (comand === 'cercar') {
  cercar(process.argv.slice(3).join(' ')).catch(console.error);
} else {
  console.log(chalk.red('Comanda desconeguda. Usa "indexar" o "cercar".'));
}

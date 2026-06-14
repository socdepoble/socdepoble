import './sqlite-setup.js';
import initSqlJs from '@sqlite.org/sqlite-wasm';
let db = null;
let initialized = false;
let globalOrigin = '';

// [MASTER WORKER RESILIENCE]
const logger = {
  log: msg => postMessage({
    type: 'LOG',
    payload: msg
  }),
  error: msg => postMessage({
    type: 'ERROR',
    payload: msg
  }),
  debug: msg => postMessage({
    type: 'DEBUG',
    payload: msg
  })
};
const safeJsonParse = (input, fallback) => {
  try {
    return JSON.parse(input);
  } catch {
    return fallback;
  }
};
async function init(initId, originStr) {
  if (originStr) {
    globalOrigin = originStr;
  }
  if (initialized) {
    if (initId) postMessage({
      id: initId,
      type: 'INIT_OK'
    });
    return;
  }
  try {
    // Passar explícitament al nucli l'arrel absoluta de l'aplicació 
    // per si la Worker fallback engine intente resoldre fitxers.
    const sqlite3 = await initSqlJs({
      scriptInfo: {
        // Per esquivar "import.meta.url" al fallback if Blob. Assurem trailing slash.
        sqlite3Dir: globalOrigin ? globalOrigin + '/assets/' : '/assets/'
      },
      locateFile: file => {
        const base = globalOrigin ? globalOrigin + '/assets/' : '/assets/';
        const wasmUrl = base + file;
        return wasmUrl;
      },
      print: logger.log,
      printErr: logger.error
    });
    if ('opfs' in sqlite3) {
      db = new sqlite3.oo1.OpfsDb('/rhizome_v3.sqlite');
      logger.log('✅ RhizomeDB Worker connectat a OPFS');
    } else {
      logger.error('⚠️ OPFS no disponible en el Worker. Usant memòria temporal.');
      db = new sqlite3.oo1.DB();
    }
    setupTables();
    initialized = true;
    if (initId) postMessage({
      id: initId,
      type: 'INIT_OK'
    });
  } catch (err) {
    logger.error('❌ Error fatal en Rhizome Worker:', err.message);
    if (initId) postMessage({
      id: initId,
      type: 'ERROR',
      payload: err.message
    });
  }
}
function setupTables() {
  db.exec(`
        CREATE TABLE IF NOT EXISTS operations (
            id TEXT PRIMARY KEY,
            doc_id TEXT NOT NULL,
            type TEXT NOT NULL,
            value TEXT,
            depends_on TEXT,
            timestamp INTEGER NOT NULL,
            author TEXT NOT NULL,
            vector_clock TEXT,
            signature TEXT
        );
        CREATE INDEX IF NOT EXISTS idx_ops_doc ON operations(doc_id);
        
        CREATE TABLE IF NOT EXISTS snapshots (
            doc_id TEXT PRIMARY KEY,
            data TEXT NOT NULL,
            last_op_id TEXT,
            vector_clock TEXT,
            checksum TEXT,
            updated_at INTEGER NOT NULL
        );

        CREATE TABLE IF NOT EXISTS config (
            key TEXT PRIMARY KEY,
            value TEXT
        );
    `);

  // Schema Migrations (Fail-safe for existing databases)
  try {
    db.exec(`ALTER TABLE operations ADD COLUMN vector_clock TEXT;`);
  } catch {/* ignore */}
  try {
    db.exec(`ALTER TABLE snapshots ADD COLUMN vector_clock TEXT;`);
  } catch {/* ignore */}
  try {
    db.exec(`ALTER TABLE snapshots ADD COLUMN checksum TEXT;`);
  } catch {/* ignore */}
}
onmessage = async e => {
  const {
    id,
    type,
    payload
  } = e.data;
  try {
    if (!initialized && type !== 'INIT') {
      await init(id);
    }
    switch (type) {
      case 'INIT':
        await init(id, payload?.origin);
        break;
      case 'SAVE_OP':
        {
          db.exec({
            sql: 'INSERT OR IGNORE INTO operations (id, doc_id, type, value, depends_on, timestamp, author, vector_clock) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            bind: [payload.id, payload.docId, payload.type, JSON.stringify(payload.value), JSON.stringify(payload.dependsOn || []), payload.timestamp, payload.author, JSON.stringify(payload.vectorClock || {})]
          });
          postMessage({
            id,
            type: 'SAVE_OP_OK'
          });
          break;
        }
      case 'SAVE_OPS_BATCH':
        {
          db.exec('BEGIN TRANSACTION;');
          try {
            for (const op of payload.ops) {
              db.exec({
                sql: 'INSERT OR IGNORE INTO operations (id, doc_id, type, value, depends_on, timestamp, author, vector_clock) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                bind: [op.id, op.docId, op.type, JSON.stringify(op.value), JSON.stringify(op.dependsOn || []), op.timestamp, op.author, JSON.stringify(op.vectorClock || {})]
              });
            }
            db.exec('COMMIT;');
            postMessage({
              id,
              type: 'SAVE_OPS_BATCH_OK'
            });
          } catch (batchErr) {
            db.exec('ROLLBACK;');
            throw batchErr;
          }
          break;
        }
      case 'GET_OPS':
        {
          const ops = [];
          db.exec({
            sql: 'SELECT * FROM operations WHERE doc_id = ? ORDER BY timestamp ASC',
            bind: [payload.docId],
            row: row => ops.push({
              ...row,
              value: safeJsonParse(row.value, null),
              dependsOn: safeJsonParse(row.depends_on, []),
              vectorClock: row.vector_clock ? safeJsonParse(row.vector_clock, {}) : null
            })
          });
          postMessage({
            id,
            type: 'GET_OPS_OK',
            payload: ops
          });
          break;
        }
      case 'SAVE_SNAPSHOT':
        {
          db.exec({
            sql: 'INSERT OR REPLACE INTO snapshots (doc_id, data, last_op_id, vector_clock, checksum, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
            bind: [payload.docId, JSON.stringify(payload.data), payload.lastOpId, JSON.stringify(payload.vectorClock || {}), payload.checksum || null, Date.now()]
          });
          postMessage({
            id,
            type: 'SAVE_SNAPSHOT_OK'
          });
          break;
        }
      case 'GET_SNAPSHOT':
        {
          let snapshot = null;
          db.exec({
            sql: 'SELECT * FROM snapshots WHERE doc_id = ?',
            bind: [payload.docId],
            row: row => {
              snapshot = {
                data: safeJsonParse(row.data, null),
                lastOpId: row.last_op_id,
                vectorClock: row.vector_clock ? safeJsonParse(row.vector_clock, {}) : null,
                checksum: row.checksum
              };
            }
          });
          postMessage({
            id,
            type: 'GET_SNAPSHOT_OK',
            payload: snapshot
          });
          break;
        }
      case 'PURGE_OPS':
        {
          const keepLimit = Number.isFinite(payload.keepLimit) ? Math.max(1, Math.floor(payload.keepLimit)) : 50;
          db.exec({
            sql: `DELETE FROM operations 
                          WHERE doc_id = ? 
                          AND id NOT IN (
                              SELECT id FROM operations 
                              WHERE doc_id = ? 
                              ORDER BY timestamp DESC 
                              LIMIT ?
                          )`,
            bind: [payload.docId, payload.docId, keepLimit]
          });
          postMessage({
            id,
            type: 'PURGE_OPS_OK'
          });
          break;
        }
      case 'GET_TRUST_SCORE':
        {
          let score = 0;
          // Query Recursiva de Confiança (CTE)
          db.exec({
            sql: `
                        WITH RECURSIVE trust_path(author, target, depth) AS (
                            SELECT author, json_extract(value, '$.target'), 1 
                            FROM operations 
                            WHERE type = 'TRUST_VOTE' AND author = ?
                            UNION ALL
                            SELECT v.author, json_extract(v.value, '$.target'), tp.depth + 1
                            FROM operations v 
                            JOIN trust_path tp ON v.author = tp.target
                            WHERE v.type = 'TRUST_VOTE' AND tp.depth < 3
                        )
                        SELECT depth FROM trust_path WHERE target = ? LIMIT 1
                    `,
            bind: [payload.myDid, payload.targetDid],
            row: row => {
              score = row.depth;
            }
          });
          postMessage({
            id,
            type: 'GET_TRUST_SCORE_OK',
            payload: {
              depth: score
            }
          });
          break;
        }
      default:
        logger.error('Unknown action type: ' + type);
        postMessage({
          id,
          type: 'ERROR',
          payload: `Unknown action type: ${type}`
        });
    }
  } catch (err) {
    postMessage({
      id,
      type: 'ERROR',
      payload: err.message
    });
  }
};
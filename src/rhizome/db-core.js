import initSqlJs from '@sqlite.org/sqlite-wasm';
import { logger } from '../utils/logger';

/**
 * RhizomeDB: Persistent SQLite + OPFS Layer [MASTER/FLASH]
 * 
 * Basat en l'auditoria v3.0: 
 * - Utilitza OPFS per a persistència real (no volàtil).
 * - Emmagatzema el graf d'operacions (Eg-walker).
 * - Suporta snapshots per a càrrega ràpida.
 */
class RhizomeDB {
    constructor() {
        this.db = null;
        this.initialized = false;
        this.initPromise = null;
    }

    /**
     * Inicialitza el motor SQLite amb suport OPFS.
     */
    async init() {
        if (this.initPromise) return this.initPromise;

        this.initPromise = (async () => {
            try {
                logger.log('🚜 Inicialitzant RhizomeDB (SQLite WASM + OPFS)...');

                const sqlite3 = await initSqlJs({
                    print: logger.log,
                    printErr: logger.error,
                });

                if ('opfs' in sqlite3) {
                    this.db = new sqlite3.oo1.OpfsDb('/rhizome_v3.sqlite');
                    logger.log('✅ RhizomeDB connectada a OPFS (/rhizome_v3.sqlite)');
                } else {
                    logger.warn('⚠️ OPFS no disponible. Usant memòria temporal (Insecure Persistence).');
                    this.db = new sqlite3.oo1.DB();
                }

                this._setupTables();
                this.initialized = true;
                return this.db;
            } catch (err) {
                logger.error('❌ Error fatal al motor RhizomeDB:', err);
                throw err;
            }
        })();

        return this.initPromise;
    }

    /**
     * Crea l'estructura de taules per al graf d'esdeveniments.
     */
    _setupTables() {
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS operations (
                id TEXT PRIMARY KEY,
                doc_id TEXT NOT NULL,
                type TEXT NOT NULL,
                value TEXT,
                depends_on TEXT,
                timestamp INTEGER NOT NULL,
                author TEXT NOT NULL,
                signature TEXT
            );
            CREATE INDEX IF NOT EXISTS idx_ops_doc ON operations(doc_id);
            
            CREATE TABLE IF NOT EXISTS snapshots (
                doc_id TEXT PRIMARY KEY,
                data TEXT NOT NULL,
                last_op_id TEXT,
                updated_at INTEGER NOT NULL
            );

            CREATE TABLE IF NOT EXISTS config (
                key TEXT PRIMARY KEY,
                value TEXT
            );
        `);
    }

    /**
     * Desa una nova operació al graf persistent.
     */
    async saveOperation(op) {
        await this.init();
        this.db.exec({
            sql: 'INSERT OR IGNORE INTO operations (id, doc_id, type, value, depends_on, timestamp, author) VALUES (?, ?, ?, ?, ?, ?, ?)',
            bind: [
                op.id,
                op.docId,
                op.type,
                JSON.stringify(op.value),
                JSON.stringify(op.dependsOn || []),
                op.timestamp,
                op.author
            ]
        });
    }

    /**
     * Recupera totes les operacions d'un document.
     */
    async getOperations(docId) {
        await this.init();
        const rows = [];
        this.db.exec({
            sql: 'SELECT * FROM operations WHERE doc_id = ? ORDER BY timestamp ASC',
            bind: [docId],
            row: (row) => rows.push({
                ...row,
                value: JSON.parse(row.value),
                dependsOn: JSON.parse(row.depends_on)
            })
        });
        return rows;
    }

    /**
     * Desa un snapshot d'estat final per evitar "re-walking" del graf complet.
     */
    async saveSnapshot(docId, data, lastOpId) {
        await this.init();
        this.db.exec({
            sql: 'INSERT OR REPLACE INTO snapshots (doc_id, data, last_op_id, updated_at) VALUES (?, ?, ?, ?)',
            bind: [docId, JSON.stringify(data), lastOpId, Date.now()]
        });
    }

    async getSnapshot(docId) {
        await this.init();
        let snapshot = null;
        this.db.exec({
            sql: 'SELECT * FROM snapshots WHERE doc_id = ?',
            bind: [docId],
            row: (row) => {
                snapshot = {
                    data: JSON.parse(row.data),
                    lastOpId: row.last_op_id
                };
            }
        });
        return snapshot;
    }

    /**
     * Purga operacions antigues del graf per alliberar espai.
     * [FLASH] Llei de l'Eficiència Rural.
     */
    async purgeOperations(docId, keepLimit = 50) {
        await this.init();
        // Només purguem si superem el límit per evitar fragmentació excessiva
        this.db.exec({
            sql: `DELETE FROM operations 
                  WHERE doc_id = ? 
                  AND id NOT IN (
                      SELECT id FROM operations 
                      WHERE doc_id = ? 
                      ORDER BY timestamp DESC 
                      LIMIT ?
                  )`,
            bind: [docId, docId, keepLimit]
        });
        logger.log(`[RhizomeDB] Purga completada per a ${docId}. Conservades últimes ${keepLimit} operacions.`);
    }
}

export const rhizomeDb = new RhizomeDB();

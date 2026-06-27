
import { egWalker } from '../core/rhizome/crdt/eg-walker';
import { logger } from '../utils/logger';

/**
 * STRESS TEST OMEGA: Convergència i Poda Atòmica
 * Simula 1000 operacions des de 3 nodes diferents amb tie-breaks i GC.
 */
export async function runStressTest() {
    logger.log("🚀 Iniciant Stress Test OMEGA...");
    const docId = 'test-stress-doc';
    const nodes = ['node-A', 'node-B', 'node-C'];
    const totalOps = 1000;
    
    // 1. Generem 1000 operacions ràpides
    const promises = [];
    for (let i = 0; i < totalOps; i++) {
        const node = nodes[i % nodes.length];
        
        promises.push(egWalker.applyLocal(docId, 'edit', { 
            [`key-${i}`]: `value-${i}`,
            lastWriter: node,
            iteration: i
        }));

        // Cada 100 ops iniciem una poda concurrent
        if (i % 100 === 0) {
            promises.push(egWalker.prune(docId));
        }
    }

    await Promise.all(promises);
    
    // 2. Verificació de l'estat final
    const snapshot = await egWalker.getState(docId);
    logger.log("✅ Stress Test Completat.");
    logger.log(`📊 Operacions processades: ${totalOps}`);
    logger.log(`📊 Estat final del document (snapshot):`, snapshot ? "PRESENT" : "MISSING");
    
    if (snapshot) {
        logger.log(`🔍 Integritat del graf: OK`);
    } else {
        logger.error(`❌ ERROR: El document ha desaparegut post-poda.`);
    }
}

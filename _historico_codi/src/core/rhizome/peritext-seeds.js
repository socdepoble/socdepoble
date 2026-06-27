/**
 * PeritextSeeds.js - Escenari de Prova: "L'Esmunyir de l'IAIA"
 * Demostra la preservació de la intenció davant edicions concurrents.
 */

import { peritext } from './crdt/peritext';
import { egWalker } from './crdt/eg-walker';
import { logger } from '../utils/logger';

export const seedPeritextScenario = async () => {
    logger.log('🚜 Iniciant escenari Peritext: L\'Esmunyir de l\'IAIA...');

    const docId = 'oli_de_la_torre';
    const initialContent = "L'oli s'esmuny de les mans quan collim.";

    // 1. Inserció inicial
    const opInsert = await egWalker.applyLocal(docId, 'edit', initialContent);
    const charOpId = opInsert.id; // Suposem que tota la seqüència penja d'aquest ID per al prototip

    // 2. L'IAIA marca "esmuny" en negreta (Intenció A)
    // Ella usa àncores estables vinculades al caràcter
    const startAnchor = peritext.createAnchor(charOpId, 7, 'before'); // "e" de esmuny
    const endAnchor = peritext.createAnchor(charOpId, 13, 'after');  // "y" de esmuny

    const boldMark = peritext.createMark(startAnchor, endAnchor, 'bold');
    await egWalker.applyLocal(docId, 'format', boldMark);

    // 3. El mestre corregeix el text (Intenció B) 
    // Concurrentment o després, movem el text. 
    // En un sistema real, això canviaria els offsets, però Peritext ho mantindria lligat.
    const correctedContent = "L'oli d'oliva s'esmuny de les mans si plou.";
    await egWalker.applyLocal(docId, 'edit', correctedContent);

    logger.log('✅ Escenari Peritext bategat. Intenció preservada via àncores.');
};

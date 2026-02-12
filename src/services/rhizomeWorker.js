/**
 * RhizomeWorker: El motor d'Eg-walker en segon pla
 * Aquest treballador s'encarrega de les operacions CPU-intensives per a mantenir 60fps a la UI.
 */
 
 import { logger } from '../utils/logger';
 import { rhizomeManager } from './rhizomeManager';
 
 self.onmessage = async (e) => {
     const { type, data } = e.data;
 
     switch (type) {
         case 'MERGE': {
             logger.log('[RhizomeWorker] Iniciant fusió massiva...');
             const merged = rhizomeManager.semanticMerge(data.local, data.remote, data.contentType);
             self.postMessage({ type: 'MERGE_COMPLETE', result: merged });
             break;
         }
 
         case 'PRUNE': {
             logger.log('[RhizomeWorker] Iniciant poda Eg-walker...');
             const success = await rhizomeManager.pruneHistory();
             self.postMessage({ type: 'PRUNE_COMPLETE', success });
             break;
         }
 
         default:
             logger.warn('[RhizomeWorker] Tipus d\'operació desconegut: ', type);
     }
 };

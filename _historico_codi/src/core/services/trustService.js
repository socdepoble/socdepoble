import { rhizomeDb } from '../rhizome/db-core';
import { logger } from '../../utils/logger';

/**
 * TrustService [WEB OF TRUST]
 * Gestiona els vots de confiança i el càlcul de reputació de proximitat.
 */
class TrustService {
    /**
     * Emet un vot de confiança cap a un altre usuari o comerç.
     * @param {string} targetDid - DID de la persona/entitat receptora.
     * @param {number} weight - Pes del vot (1.0 = confiança total, 0 = desconfiança).
     */
    async emitTrustVote(targetDid, weight = 1.0) {
        const myDid = localStorage.getItem('userDid') || 'did:sdp:guest';
        
        const operation = {
            id: `trust_${Date.now()}_${Math.random().toString(36).substring(7)}`,
            docId: 'community_reputation',
            type: 'TRUST_VOTE',
            author: myDid,
            value: {
                target: targetDid,
                weight: weight,
                timestamp: Date.now()
            },
            timestamp: Date.now()
        };

        try {
            await rhizomeDb.saveOperation(operation);
            logger.log(`🛡️ Vot de confiança emès per a ${targetDid}`);
            return true;
        } catch (err) {
            logger.error('❌ Error emetent vot de confiança:', err);
            return false;
        }
    }

    /**
     * Calcula la reputació de proximitat per a un DID concret.
     */
    async getProximityReputation(targetDid) {
        const myDid = localStorage.getItem('userDid') || 'did:sdp:guest';
        
        try {
            const { depth } = await rhizomeDb.getTrustScore(myDid, targetDid);
            
            if (depth === 0) return { level: 'desconegut', direct: false };
            if (depth === 1) return { level: 'alta', direct: true };
            
            return { 
                level: 'mitjana', 
                direct: false, 
                witness: 'Xarxa Veïnal' // En el futur podem buscar el nom del witness
            };
        } catch (err) {
            logger.error('❌ Error calculant proximitat:', err);
            return { level: 'desconegut', direct: false };
        }
    }
}

export const trustService = new TrustService();

import { logger } from '../utils/logger';
import { supabaseService } from './supabaseService';
import { egWalker } from '../rhizome/crdt/eg-walker';
import { chaosMonkey } from '../utils/chaosMonkey';

/**
 * RhizomeManager: El motor d'Escala Infinita [MASTER]
 * Gestiona la poda de metadades (Eg-walker), la fusió semàntica i els xlogs (Astro).
 */
class RhizomeManager {
    constructor() {
        this.DB_NAME = 'RhizomeDB-v1';
        this.HISTORY_THRESHOLD = 30; // Dies de retenció de metadades al mòbil
        this.VERSION_BATCH_SIZE = 50; // Operacions pè Batch abans de consolidar
        this.currentVersion = localStorage.getItem('sp_rhizome_version') || '1.0.0';
        this.walker = egWalker;
    }

    /**
     * Sincronitza els xlogs locals amb el Node de la Federació (Cooperativa/Supabase)
     * Pillar 3: Rèplica Representant i Seguretat Comunitària.
     */
    async syncXLogsToFederation(userId) {
        logger.log('[Rhizome] Sincronitzant xlogs amb el Node de la Federació (La Torre Pilot)...');
        try {
            if (await chaosMonkey.intercept()) {
                throw new Error('[ChaosMonkey] Sincronització avortada per paquet perdut.');
            }
            const localLogs = JSON.parse(localStorage.getItem('sp_xlogs') || '[]');
            if (localLogs.length === 0) return { success: true, count: 0 };

            // En un sistema federat, açò enviaria les dades al node corresponent
            const { error } = await supabaseService.upsertXLogs(userId, localLogs);
            if (error) throw error;

            logger.log('[Rhizome] Sincronització amb la Federació completada.');
            return { success: true, count: localLogs.length };
        } catch (err) {
            logger.error('[Rhizome] Error en la sincronització federada:', err);
            return { 
                success: false, 
                retryable: err.message?.includes('fetch') || err.message?.includes('Network') || err.status === 503, 
                code: err.code || 'UNKNOWN_SYNC_ERROR' 
            };
        }
    }

    /**
     * [PILLAR 1: Eg-walker] - Poda del Solatge (Garbage Collection)
     * Elimina metadades internes basant-se en Versions Crítiques.
     */
    async pruneHistory(docId = 'global') {
        logger.log(`[Rhizome] Iniciant Poda del Solatge (Eg-walker) per a ${docId}...`);
        try {
            await this.walker.prune(docId);

            // Actualitzem versió de consens
            const nextVersion = this._incrementVersion(this.currentVersion);
            localStorage.setItem('sp_rhizome_version', nextVersion);
            this.currentVersion = nextVersion;

            logger.log(`[Rhizome] Poda bategada. Nova Versió Crítica: ${nextVersion} (RAM optimitzada).`);
            return true;
        } catch (err) {
            logger.error('[Rhizome] Error en la poda:', err);
            return false;
        }
    }

    /**
     * [PILLAR 2: Fusió Semàntica] - Eg-walker integration
     */
    async semanticMerge(local, remote, docId = 'global') {
        if (!local && !remote) return "";
        if (local === remote) return local;

        logger.log(`[Rhizome] Detectat conflicte en ${docId}. Aplicant Eg-walker...`);

        if (await chaosMonkey.intercept()) {
             logger.error(`🐒 [ChaosMonkey] Error artificial en Merge Semàntic per a ${docId}. Corrupció simulada.`);
             // El Fallback per defecte en Eg-Walker si falla és el remote.
        }

        if (Array.isArray(remote)) {
            return await this.walker.merge(docId, remote);
        }

        await this.walker.applyLocal(docId, 'edit', remote);
        return remote;
    }

    _incrementVersion(ver) {
        const parts = ver.split('.').map(Number);
        parts[2]++;
        if (parts[2] > 9) { parts[2] = 0; parts[1]++; }
        return parts.join('.');
    }

    _mergeRichText(local, remote) {
        const combinedFormats = [...(local.formats || []), ...(remote.formats || [])];
        const refinedFormats = combinedFormats.map(f => ({
            ...f,
            behavior: f.type === 'link' || f.type === 'comment' ? 'restrictive' : 'expansive',
            anchorId: f.anchorId || `anchor_${Math.random().toString(36).substring(7)}`
        }));

        logger.log(`[Peritext] Processats ${refinedFormats.length} trams de format amb àncores estables.`);

        return {
            content: local.content || remote.content,
            formats: refinedFormats,
            metadata: {
                merged_at: new Date().toISOString(),
                protocol: 'Peritext-v1-BATEGA',
                integrity: 'Historical-Document-Level'
            }
        };
    }

    /**
     * [PILLAR 3: Pagaments Astro]
     */
    async processXLog(transaction) {
        logger.log('[Rhizome] Processant bategat econòmic en xlog...');
        const xlogEntry = {
            id: crypto.randomUUID(),
            padrins_verify: false,
            timestamp: new Date().toISOString(),
            ...transaction
        };

        const currentLogs = JSON.parse(localStorage.getItem('sp_xlogs') || '[]');
        currentLogs.push(xlogEntry);
        localStorage.setItem('sp_xlogs', JSON.stringify(currentLogs));

        return xlogEntry;
    }

    /**
     * [PILLAR 5: Càpsula del Temps]
     */
    async generateTimeCapsule() {
        logger.log('[Rhizome] Iniciant Protocol Long Now (Càpsula del Temps)...');
        try {
            const data = {
                identities: await supabaseService.getMyEntities(),
                history: JSON.parse(localStorage.getItem('sp_history_cache') || '[]'),
                xlogs: JSON.parse(localStorage.getItem('sp_xlogs') || '[]'),
                exported_at: new Date().toISOString(),
                version: 'v1.5.7-BATEGA-MASTER',
                philosophy: "Dades bategades i segellades de forma sobirana. El poble és el propietari."
            };

            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `capsula_del_temps_${new Date().toISOString().split('T')[0]}.json`;
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);

            logger.log('[Rhizome] Càpsula del Temps bategada amb èxit.');
            return true;
        } catch (err) {
            logger.error('[Rhizome] Error en la Càpsula del Temps:', err);
            return false;
        }
    }

    /**
     * [PILLAR 4: Filtratge Km 0]
     */
    cognitiveFilter(data, userPreferences) {
        if (!data) return [];
        const anchors = userPreferences?.anchors || [];
        return data.filter(item => {
            const isLocal = item.town_id === userPreferences?.primary_town_id;
            const content = item.content || item.description || '';
            const hasSemanticAnchor = anchors.some(a => content.includes(a));
            return isLocal || hasSemanticAnchor;
        });
    }

    /**
     * [PILLAR 6: Sacred Text Metrics]
     * Retorna telemetria sobre la riquesa de Peritext.
     */
    async getPeritextMetrics(docId) {
        const state = await this.walker.getState(docId);
        const spans = state?.data?.spans || [];
        return {
            marksCount: spans.length,
            stableAnchors: spans.length * 2,
            integrity: 'Weber-Class-High'
        };
    }
}

export const rhizomeManager = new RhizomeManager();

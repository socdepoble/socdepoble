import { logger } from '../utils/logger';
import { supabaseService } from './supabaseService';
import { marketService } from './marketService';

/**
 * NotebookService: El Cerebro Analítico (El Marido de la IAIA)
 * Inspirado en Google NotebookLM para síntesis de conocimiento rural.
 */
class NotebookService {
    constructor() {
        this.sources = [
            // MASTER MANIFEST (DOC-LEVEL)
            { id: 'master-manifest', type: 'DOC', content: "Sóc de Poble és una xarxa de sobirania digital. Reglament: Les dades pertanyen als veïns.", metadata: { title: "Manifest Sóc de Poble", page: 1, did: 'did:soc:manifest-001' } },

            // CATALEG D'ARBRES (PDF-LEVEL)
            { id: 'cataleg-arbres-1', type: 'PDF', content: "La Carrasca de la Foia Blanca té una soca recta i grossa.", metadata: { title: "Catàleg d'Arbres 2020", page: 8, did: 'did:soc:doc-arbres-17' } },

            // PERITEXT-LITE (BLOCK-LEVEL TEXT)
            { id: 'normativa-horta-1', type: 'TEXT', content: "L'aigua de la Sèquia Mare s'ha de repartir segons el torn de nit.", metadata: { title: "Normativa de l'Horta", block_id: 'block_aq_45', did: 'did:soc:note-horta-22' } },

            // MULTIMEDIA (ENTITY-LEVEL)
            { id: 'img-carrasca-vella', type: 'IMAGE', content: "Vista frontal de la Carrasca Vella amb el poble al fons.", metadata: { title: "Carrasca Vella (Foto)", entity_id: 'ent_889', did: 'did:soc:img-carrasca-40' } },

            // AUDIO/PODCAST (TIMESTAMP-LEVEL)
            { id: 'entrevista-batiste-1', type: 'AUDIO', content: "En Batiste explica que el millor moment per a podar és la lluna vella del gener.", metadata: { title: "Entrevista Batiste", timestamp: '04:23', did: 'did:soc:aud-batiste-01' } },
            { id: 'cataleg-arbres-1', type: 'PDF', content: "Catàleg descriptiu dels arbres i arbredes monumentals de la Torre de les Maçanes.", metadata: { title: "Catàleg d'Arbres (2020)", page: '25', did: 'did:soc:doc-arbres-2020' } },
            { id: 'carrasca-foia-blanca', type: 'IMAGE', content: "Detall de la Carrasca de la Foia Blanca amb les seues dimensions oficials.", metadata: { title: "Carrasca Foia Blanca", entity_id: 'img_carrasca_foia', did: 'did:soc:img-carrasca-foia' } },
            { id: 'carrasca-zurca-1', type: 'IMAGE', content: "La Carrasca de la Zurca es troba en un estat envellit i moribund, a una altitud de 885m.", metadata: { title: "Carrasca de la Zurca", entity_id: 'img_carrasca_zurca', did: 'did:soc:img-carrasca-zurca' } },
            { id: 'pi-foia-boix-audit', type: 'COMPARISON', content: "Auditoria de l'evolució vital del Pi de la Foia Boix entre 2007 i 2020. Es detecta pèrdua de massa forestal.", metadata: { title: "Auditoria Pi Foia Boix", did: 'did:soc:audit-pi-foia', anchor: 'audit=pi-foia-boix' } },
            { id: 'xiprers-cementeri-audit', type: 'COMPARISON', content: "Protocol Espill del Temps per als Xiprers del Cementeri. Evolució visual del mur i densitat del fullatge.", metadata: { title: "Auditoria Xiprers", did: 'did:soc:audit-xiprers', anchor: 'audit=xiprers-cementeri' } },
            { id: 'pi-pipa-1', type: 'IMAGE', content: "El Pi del Mas de Pipa és un gegant de 427cm de perímetre amb una cicatriu històrica a la base.", metadata: { title: "Pi del Mas de Pipa", entity_id: 'img_pi_pipa', did: 'did:soc:img-pi-pipa', dbh: '427cm', crown: '23m', utm: "X: 725300, Y: 4275950" } },
            { id: 'carrasca-nofre-1', type: 'IMAGE', content: "La Carrasca de Nofre presenta un bon estat de salut al Barranc de la Zurca, amb un perímetre de 288cm.", metadata: { title: "Carrasca de Nofre", entity_id: 'img_carrasca_nofre', did: 'did:soc:img-carrasca-nofre', dbh: '288cm', crown: '18m', utm: "X: 725181, Y: 4275887" } },
            {
                id: 'pi-arrendaors-1', type: 'IMAGE', content: "El Pi dels Arrendaors destaca pel seu diàmetre de tronc massiu (570cm) i la seua resiliència temporal.", metadata: {
                    title: "Pi dels Arrendaors",
                    entity_id: 'img_pi_arrendaors',
                    did: 'did:soc:img-pi-arrendaors',
                    biometrics: { dbh_2007: '570cm', dbh_2020: '582cm', height: '16m' },
                    coordinates: { lat: 38.6015, lon: -0.4123 }, // Simulación de UTM a LatLong
                    source_ref: "Catàleg 2020, p. 75"
                }
            }
        ];
        this.memoryLimit = 100;
    }

    /**
     * Ingiere una nueva fuente de conocimiento.
     */
    async ingestSource(type, content, metadata = {}) {
        const sourceId = `src-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        this.sources.push({ id: sourceId, type, content, metadata, timestamp: new Date().toISOString() });

        if (this.sources.length > this.memoryLimit) {
            this.sources.shift(); // FIFO Memory
        }

        logger.info(`[Notebook] Fuente ingerida: ${type} - ${metadata.title || 'Sense títol'}`);
        return sourceId;
    }

    /**
     * Genera una síntesis semántica basada en las fuentes actuales [MASTER NOTARIAL].
     */
    async generateSynthesis(query = '') {
        logger.debug(`[Notebook] Generant síntesi notarial per a: ${query || 'Resum general'}`);

        // RAG Lite with keyword matching
        const relevantSources = query
            ? this.sources.filter(s =>
                s.content.toLowerCase().includes(query.toLowerCase()) ||
                (s.metadata.title && s.metadata.title.toLowerCase().includes(query.toLowerCase()))
            )
            : this.sources.slice(0, 5);

        if (relevantSources.length === 0) {
            return "L'Avi encara no té papers sobre aquest tema, però la memòria del poble és gran.";
        }

        // Síntesis with Universal Citations [IRON ARCHITECTURE]
        const synthesisParts = relevantSources.map(s => {
            const m = s.metadata;
            const did = m.did || s.id;
            let anchor = "";

            if (s.type === 'PDF') anchor = `page=${m.page || '1'}`;
            else if (s.type === 'TEXT' && m.block_id) anchor = `block=${m.block_id}`;
            else if (s.type === 'IMAGE' && m.entity_id) anchor = `entity=${m.entity_id}`;
            else if (s.type === 'AUDIO' && m.timestamp) anchor = `t=${m.timestamp}`;

            // Visual Label for the user
            const label = `[${m.title || s.type}${m.page ? ', p. ' + m.page : (m.timestamp ? ', ' + m.timestamp : '')}]`;

            // Technical Tag for the UI [MASTER]
            const technicalCite = `<cite data-did="${did}" data-anchor="${anchor}">${label}</cite>`;

            return `${s.content} ${technicalCite}`;
        });

        return synthesisParts.join('\n\n');
    }

    /**
     * Genera un 'Audio Overview' textual para ser leído por TTS.
     */
    async generateAudioOverview(topic) {
        logger.debug(`[Notebook] Preparant guió d'àudio per a: ${topic}`);
        // Estructura de podcast NotebookLM: Avi & IAIA hablando
        return `AVI: Bon dia, IAIA. He bategat els papers del Rebost i la nostra Arquitectura de Ferro està aguantant de valent.
                IAIA: Home, no n'esperava menys! Les dades són del poble i per al poble. Què diu el nostre manifest sobre el futur?
                AVI: Diu que la sobirania digital no és negociable. Hem vinculat cada història a un DNI Digital, així que per molt que el temps passe, la memòria no es trencarà.
                IAIA: Això és el que m'agrada. Menys núvols estranys i més arrels a terra. Digues-li a Javi que estem cuidant bé de la seua criatura.`;
    }

    /**
     * Genera el Resumen Semanal del Pueblo.
     */
    async generateVillageWeeklySummary() {
        try {
            // 1. Recopilar actividad real de la DB (Mocks silenciados en prod)
            const posts = await supabaseService.getPosts('tot', null, 0, 20);
            const marketCount = await marketService.getMarketItems(); // Simplified check

            // 2. Sintetizar
            const summary = `Hui l'Avi dels Papers ens porta el resum de la setmana a la Torre:\n\n📊 Hem tingut ${posts.length} noves històries compartides al Mur.\n🍎 El Mercat està bullint amb ${marketCount?.length || 'molta'} activitat.\n🎵 La música valenciana ha estat el fil conductor de les nostres converses.\n\nKeep it rural, keep it smart.`;

            return {
                author_id: '11111111-notebook-0000-0000-000000000000',
                author_name: "L'Avi dels Papers",
                author_avatar_url: '/assets/avatars/avi_papers.png',
                author_role: 'official',
                content: summary,
                type: 'weekly_synthesis',
                is_playground: true
            };
        } catch (e) {
            logger.error('[Notebook] Error generant resum setmanal:', e);
            return null;
        }
    }
}

export const notebookService = new NotebookService();

import { rhizomeDb } from './db-core';
import { egWalker } from './crdt/eg-walker';
import { logger } from '../utils/logger';

/**
 * RhizomeSeeds: Injecció de Dades Mestres [FLASH REPORT]
 * 
 * Injecta els recursos i itineraris oficials de La Torre de les Maçanes.
 */
export async function injectSeeds() {
    logger.log('🌱 Injectant llavors de dades Rhizome (Oli i Itineraris)...');

    // 1. OLI DE LA TORRE
    const oliDocId = 'res:oli-latorre';
    const oliContent = {
        title: "Oli de La Torre (Verge Extra)",
        variety: "Blanqueta, Mançanella, Alfafarenca",
        description: "El nostre oli és fill de la muntanya. Produït majoritàriament amb la varietat Blanqueta, resistent i noble. L'oliva arriba sana perquè la Blanqueta resistix la mosca. Al molí, l'oli es deixa trastombar (decantar) naturalment per a separar la morca.",
        specs: {
            acidity: "0.8º - 1.0º",
            process: "Esmunyida a mà, batuda en fred (23ºC)"
        },
        tags: ["🏺 Essències", "🥗 Km0", "🚜 Cooperativa"]
    };

    await egWalker.applyLocal(oliDocId, 'edit', oliContent);
    // Afegim format Peritext a termes clau
    await egWalker.applyLocal(oliDocId, 'format', { start: 98, end: 107, type: 'bold' }); // "Blanqueta"
    await egWalker.applyLocal(oliDocId, 'format', { start: 191, end: 201, type: 'iaia-dict', metadata: { term: 'trastombar' } });
    await egWalker.applyLocal(oliDocId, 'format', { start: 236, end: 241, type: 'iaia-dict', metadata: { term: 'morca' } });

    // 2. ITINERARIS ESSÈNCIES
    const itineraries = [
        {
            id: 'experience:ruta-1',
            title: "Som pa, som oli",
            type: "gastronomic",
            duration: "4h",
            distance: "1.3km",
            stops: ["Forns de llenya", "Almàssera", "Molí Hidràulic"]
        },
        {
            id: 'experience:ruta-3',
            title: "Som aigua",
            type: "hydric",
            duration: "4h",
            distance: "2km",
            stops: ["El Bassi (Llavador)", "Font Major", "Malecó"]
        },
        {
            id: 'experience:ruta-6',
            title: "Som paisatge",
            type: "hiking",
            duration: "8h",
            distance: "6km",
            stops: ["Serra d'El Rentonar", "Pou de la Neu", "Mas de la Canaleta"]
        }
    ];

    for (const route of itineraries) {
        await egWalker.applyLocal(route.id, 'edit', route);
    }

    logger.log('✅ Llavors Rhizome injectades correctament.');
}

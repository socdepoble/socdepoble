import { useState, useEffect, useCallback } from 'react';
import { Plugins } from '@capacitor/core';
import { rhizomeManager } from '../services/rhizomeManager';
import { logger } from '../utils/logger';

// Obtenim el plugin natiu asíncronament si està disponible
const { RhizomeMesh } = Plugins;

/**
 * Hook de pont entre el domini UI (Yjs/CRDT) i el Demoni Natiu (SQLite/BLE).
 * Propòsit: Interceptar l'inici de sessió i consumir els 'deltas' acumulats 
 * pel demoni quan el telèfon estava amb la pantalla apagada.
 */
export function useRhizomeHydration(userId) {
    const [hydrationStatus, setHydrationStatus] = useState('idle'); // 'idle' | 'hydrating' | 'complete' | 'error'
    const [stats, setStats] = useState({ deltasProcessed: 0, msElapsed: 0 });

    const hydrateFromBackground = useCallback(async () => {
        if (!userId) return;
        
        try {
            setHydrationStatus('hydrating');
            logger.info('[Rhizome] Iniciant hidratació des del Demoni Natiu (Cartero Sonámbulo)...');
            const startTime = performance.now();

            if (!RhizomeMesh) {
                logger.warn('[Rhizome] RhizomeMesh natiu no disponible (estàs al navegador?). Saltant hidratació física.');
                setHydrationStatus('complete');
                return;
            }

            // 1. Demanem al plugin natiu TOTS els missatges acumulats no llegits
            const result = await RhizomeMesh.getPendingDeltas({ userId });
            const p2pBlobs = result.deltas || [];
            
            if (p2pBlobs.length > 0) {
                logger.info(`[Rhizome] Recuperats ${p2pBlobs.length} blobs binaris des del Buzón de Hierro.`);
                
                // 2. Transacció massiva atòmica: evitem que React faiga re-renders tontos
                // Passant el flag de 'background-sync' per l'origin de Yjs
                const appliedCount = rhizomeManager.hydrateOffgridDeltas(p2pBlobs);
                
                // 3. Marquem com a llegits al natiu perquè els esborre del seu SQLite o marque 'processed'
                await RhizomeMesh.markDeltasProcessed({ userId, count: p2pBlobs.length });
                
                logger.info(`[Rhizome] Transacció completada: ${appliedCount} mutacions aplicades.`);
            } else {
                logger.info('[Rhizome] Cap blob binari pendent al Buzón de Hierro. Malla sincronitzada.');
            }

            const msElapsed = Math.round(performance.now() - startTime);
            setStats({ deltasProcessed: p2pBlobs.length, msElapsed });
            setHydrationStatus('complete');

        } catch (error) {
            logger.error('[Rhizome] Error crític durant la hidratació natiu-JS:', error);
            setHydrationStatus('error');
        }
    }, [userId]);

    // Executem la hidratació en mount si tenim usuari (Día Cero Start)
    // O quan l'aplicació torna a primer pla des del background (resume)
    useEffect(() => {
        if (userId) {
            hydrateFromBackground();
        }

        // Escoltem l'esdeveniment de l'aplicació tornant al primer pla (AppState change en Capacitor)
        const handleAppStateChange = (state) => {
            if (state.isActive) {
                logger.debug('[Rhizome] Retorn al foreground -> Re-hidratant el CRDT...');
                hydrateFromBackground();
            }
        };

        let listener = null;
        if (Plugins.App) {
            listener = Plugins.App.addListener('appStateChange', handleAppStateChange);
        }

        return () => {
            if (listener && listener.remove) {
                listener.remove();
            }
        };
    }, [userId, hydrateFromBackground]);

    return {
        hydrationStatus,
        stats,
        forceHydrate: hydrateFromBackground
    };
}

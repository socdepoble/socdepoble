/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useCallback, useRef } from 'react';
import { registerPlugin } from '@capacitor/core';
import { rhizomeManager } from '../services/rhizomeManager';
import { logger } from '../utils/logger';

const RhizomeMesh = registerPlugin('RhizomeMesh');

export function useRhizomeHydration(userId) {
    const [hydrationStatus, setHydrationStatus] = useState('idle');
    const [stats, setStats] = useState({ deltasProcessed: 0, msElapsed: 0 });
    const abortRef = useRef(null);

    const hydrateFromBackground = useCallback(async () => {
        if (!userId) return;
        abortRef.current?.abort();
        const abortController = new AbortController();
        abortRef.current = abortController;

        try {
            setHydrationStatus('hydrating');
            logger.info('[Rhizome] Iniciant hidratació des del Demoni Natiu...');
            const startTime = performance.now();

            if (!RhizomeMesh) {
                logger.warn('[Rhizome] RhizomeMesh no disponible (navegador?).');
                setHydrationStatus('complete');
                return;
            }

            const result = await RhizomeMesh.getPendingDeltas({ userId });
            const p2pBlobs = result.deltas || [];

            if (p2pBlobs.length > 0) {
                const appliedCount = rhizomeManager.hydrateOffgridDeltas(p2pBlobs);
                await RhizomeMesh.markDeltasProcessed({ userId, count: p2pBlobs.length });
                logger.info(`[Rhizome] ${appliedCount} mutacions aplicades.`);
            }

            const msElapsed = Math.round(performance.now() - startTime);
            setStats({ deltasProcessed: p2pBlobs.length, msElapsed });
            setHydrationStatus('complete');
        } catch (error) {
            if (error.name !== 'AbortError') {
                logger.error('[Rhizome] Error durant hidratació:', error);
                setHydrationStatus('error');
            }
        }
    }, [userId]);

    useEffect(() => {
        if (userId) hydrateFromBackground();

        let listener = null;
        const handleAppStateChange = (state) => {
            if (state.isActive) hydrateFromBackground();
        };

        const App = registerPlugin('App');
        if (App) {
            listener = App.addListener('appStateChange', handleAppStateChange);
        }

        return () => {
            abortRef.current?.abort();
            if (listener?.remove) listener.remove();
        };
    }, [userId, hydrateFromBackground]);

    return { hydrationStatus, stats, forceHydrate: hydrateFromBackground };
}

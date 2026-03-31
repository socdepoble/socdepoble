import React, { useEffect, useCallback } from 'react';
import AppLayout from './components/AppLayout';
import { iaiaService } from './services/iaiaService';
import GlobalModals from './components/GlobalModals';
import './index.css';
import { errorTrackingService } from './services/errorTrackingService';
import { healthCheckService } from './services/healthCheckService';
import { logger } from './utils/logger';

// [Noves Portes / Cimentació Mestre]
import ErrorBoundary from './components/ErrorBoundary';
import LocalFirstGate from './components/gates/LocalFirstGate';
import AuthGate from './components/gates/AuthGate';
import OfflineGate from './components/gates/OfflineGate';
import { useLowEndDevice } from './hooks/useLowEndDevice';
import { useTabReconciliation } from './hooks/useTabReconciliation';

/**
 * 🏺 LA BÍBLIA ESTRUCTURAL (App.jsx) - BLINDATGE v2.0
 * Aquest fitxer conté la cimentació mestre orquestrant l'estat i les portes d'entrada.
 * FORÇAT: Fons Negre, Arquitectura de Ferro, Local First, Zero Fantasmes.
 */
const App = () => {
    // Sanea "Amnesia BFCache"
    useTabReconciliation();

    // [MONITORING AND CLEANUP] Inicialitzar error tracking y purga fantasma
    useEffect(() => {
        let isMounted = true;
        const initializeMonitoring = async () => {
            try {
                await errorTrackingService.initialize();
                if (isMounted) logger.log('[App] Error tracking initialized');
            } catch (error) {
                if (isMounted) logger.error('[App] Failed to initialize error tracking:', error);
            }
        };

        // Purificación final de imatges fantasma al Mestre
        import('./services/syncService')
            .then(({ syncService }) => {
                if (!isMounted) return; // [OMEGA-FIX: Guardia contra Zombie Effect]
                const report = syncService.purgeGhostMediaCache({ dryRun: false });
                logger.debug('[App] Purga fantasma completada en el arranque:', report);
            })
            .catch(e => {
                if (isMounted) logger.error('[App] Error purging ghost media:', e); // [OMEGA-FIX: Catch explícito]
            });

        initializeMonitoring();
        return () => { isMounted = false; };
    }, []);

    // [MONITORING] Iniciar health checks
    useEffect(() => {
        healthCheckService.startMonitoring();
        
        const unsubscribe = healthCheckService.subscribe((health) => {
            if (health.overall !== 'healthy') {
                logger.warn('[App] Health check warning:', health);
                errorTrackingService.captureException(
                    new Error(`Health check: ${health.overall}`),
                    { health }
                );
            }
        });

        return () => {
            healthCheckService.stopMonitoring();
            unsubscribe();
        };
    }, []);

    // [ERROR] Global error handlers refactoritzats
    const handleError = useCallback((event) => {
        errorTrackingService.captureException(event.error || event.message, {
            type: 'global',
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno
        });
    }, []);

    const handleUnhandledRejection = useCallback((event) => {
        errorTrackingService.captureException(event.reason, {
            type: 'unhandledrejection'
        });
    }, []);

    useEffect(() => {
        window.addEventListener('error', handleError);
        window.addEventListener('unhandledrejection', handleUnhandledRejection);

        return () => {
            window.removeEventListener('error', handleError);
            window.removeEventListener('unhandledrejection', handleUnhandledRejection);
        };
    }, [handleError, handleUnhandledRejection]);

    useEffect(() => {
        return () => {
            iaiaService.dispose();
        };
    }, []);

    const isLowEnd = useLowEndDevice();

    useEffect(() => {
        if (isLowEnd) {
            document.body.classList.add('low-end-device');
        } else {
            document.body.classList.remove('low-end-device');
        }
    }, [isLowEnd]);

    return (
        <>
            <ErrorBoundary fallbackMessage="Excepció Nuclear Detectada al Mas.">
                <OfflineGate>
                    <LocalFirstGate>
                        <AuthGate>
                            <AppLayout />
                            <GlobalModals />
                        </AuthGate>
                    </LocalFirstGate>
                </OfflineGate>
            </ErrorBoundary>
            {/* [OMEGA-FIX: Fuera del ErrorBoundary con atributos y roles explícitos completos] */}
            <div
                id="aria-live-region"
                role="status"
                aria-live="polite"
                aria-atomic="true"
                className="sr-only"
            />
        </>
    );
};

export default App;

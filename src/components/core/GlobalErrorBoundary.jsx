import { Component } from 'react';
import { openDB } from 'idb';
import { logger } from '../../utils/logger';
import TactileButton from '../design/TactileButton';

class GlobalErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, isHealing: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        logger.error('[ErrorBoundary] Error capturat:', error, errorInfo);

        // === AUTOSANACIÓ QUIRÚRGICA ===
        const criticalErrors = [
            'QuotaExceededError',
            'DataCloneError',
            'IndexedDB',
            'IDB',
            'Yjs',
            'rhizome'
        ];

        const isCritical = criticalErrors.some(msg => 
            error.name?.includes(msg) || error.message?.includes(msg)
        );

        if (isCritical) {
            this.setState({ isHealing: true });
            this.healDatabase().then(() => {
                // Reset noble després de purgar
                window.location.href = '/?healed=true&v=' + Date.now();
            });
        }
    }

    async healDatabase() {
        try {
            logger.warn('[AUTOSANACIÓ] Detectada corrupció crítica – iniciant purga quirúrgica...');

            // Purga totes les taules del Rhizome
            const db = await openDB('rhizome-v1', 1);
            const tx = db.transaction('rhizome', 'readwrite');
            await tx.store.clear(); // esborra tot el CRDT + identitats xifrades

            // Purga també el store sobirà si existeix
            try {
                await db.delete('sovereign-identity');
            } catch {
                // Ignore errors if the store doesn't exist
            }

            await tx.done;
            logger.info('[AUTOSANACIÓ] Base de dades purgada i restaurada amb èxit');
        } catch (e) {
            logger.error('[AUTOSANACIÓ] Error durant la purga:', e);
            // Últim recurs: neteja completa
            localStorage.clear();
            sessionStorage.clear();
        }
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-black flex items-center justify-center p-8 text-white">
                    <div className="max-w-md text-center">
                        <h1 className="text-4xl font-black mb-6">🌾 La plaça està curant-se...</h1>
                        {this.state.isHealing ? (
                            <p className="text-xl mb-8">S’està purgant la corrupció i reiniciant el Búnker. Un moment, si us plau.</p>
                        ) : (
                            <>
                                <p className="mb-8">S’ha produït un error crític. El sistema s’està auto-reparant.</p>
                                <TactileButton
                                    onClick={() => window.location.reload()}
                                    className="px-10 py-6 text-2xl bg-[#F97316] rounded-3xl"
                                >
                                    Reiniciar la plaça
                                </TactileButton>
                            </>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default GlobalErrorBoundary;

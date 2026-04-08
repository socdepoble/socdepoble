import React from 'react';
import { logger } from '../utils/logger';
import forensicService from '../services/forensicService';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        const errorMsg = error?.toString() || '';

        // [RESILIENCE] AbortError is benign (usually search cancellation or SW updates)
        if (error?.name === 'AbortError' || errorMsg.includes('AbortError')) {
            return { hasError: false, error: null };
        }

        // [RESILIENCE] ChunkLoadError / Failed to fetch dynamic module:
        // We force a hard reload immediately to clear the asset cache mismatch.
        if (errorMsg.includes('Failed to fetch dynamically imported module') ||
            errorMsg.includes('ChunkLoadError')) {
            logger.error('[ErrorBoundary] Module Load Error. Forcing hard reload...');
            
            if (typeof window !== 'undefined') {
                setTimeout(() => {
                    window.location.reload(true);
                }, 500);
            }
            
            return { hasError: true, error: "Sincronitzant versió del Mas... Re-bategant..." };
        }

        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        logger.error('[ErrorBoundary] Caught error:', error, errorInfo);
        this.setState({ errorInfo }); // Fix: store errorInfo to show componentStack

        // [MASTER PROTOCOL] Enviament automàtic a l'IAIA
        forensicService.reportCrash({
            type: 'CRITICAL_CRASH',
            error: error.toString(),
            stack: errorInfo.componentStack,
            location: window.location.pathname,
            timestamp: new Date().toISOString()
        });
    }

    render() {
        if (this.state.hasError) {
            const errorText = `${this.state.error?.toString() || ''}\n${this.state.errorInfo?.componentStack || ''}`;

            return (
                <div className="error-boundary-container" style={{ padding: '40px 20px', textAlign: 'center', color: '#666' }}>
                    <div style={{ marginBottom: '16px', fontSize: '32px' }}>⚠️</div>
                    <h3>{this.props.fallbackMessage || "Vaja! Alguna cosa ha anat malament."}</h3>

                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '16px' }}>
                        <button
                            onClick={() => {
                                localStorage.clear();
                                sessionStorage.clear();
                                window.location.href = '/';
                            }}
                            style={{ padding: '12px 24px', borderRadius: '8px', border: 'none', background: '#ff0055', color: 'white', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 4px 15px rgba(255,0,85,0.3)' }}
                        >
                            Reiniciar el Mas 👵✨
                        </button>
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(errorText);
                                alert('Error copiat al porta-retalls!');
                            }}
                            title="Copiar error"
                            style={{ padding: '8px 16px', borderRadius: '0px', border: '1px solid #ddd', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                        >
                            📋 Copiar
                        </button>
                    </div>
                    <p style={{ marginTop: '20px', color: 'var(--color-text-muted)', fontSize: '14px' }}>
                        {this.state.error && this.state.error.toString()}
                    </p>
                    {this.state.errorInfo && (
                        <pre style={{ textAlign: 'left', fontSize: '10px', overflow: 'auto', background: '#eee', padding: 10 }}>
                            {this.state.errorInfo.componentStack}
                        </pre>
                    )}
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;

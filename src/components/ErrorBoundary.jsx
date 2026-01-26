import React from 'react';
import { logger } from '../utils/logger';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        // [RESILIENCE] AbortError is benign (usually search cancellation or SW updates)
        if (error?.name === 'AbortError' || error?.toString().includes('AbortError')) {
            return { hasError: false, error: null };
        }
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        logger.error('[ErrorBoundary] Caught error:', error, errorInfo);
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
                            onClick={() => window.location.reload()}
                            style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: '#333', color: 'white', cursor: 'pointer', fontWeight: 600 }}
                        >
                            Tornar a intentar
                        </button>
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(errorText);
                                alert('Error copiat al porta-retalls!');
                            }}
                            title="Copiar error"
                            style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #ddd', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
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

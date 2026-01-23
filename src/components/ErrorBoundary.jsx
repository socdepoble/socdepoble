import React from 'react';
import { logger } from '../utils/logger';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        logger.error('[ErrorBoundary] Caught error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    padding: '40px',
                    textAlign: 'center',
                    background: 'var(--bg-card)',
                    borderRadius: 'var(--radius-xl)',
                    margin: '20px',
                    border: '1px solid var(--color-border)',
                    color: 'var(--text-main)'
                }}>
                    <h2 style={{ color: 'var(--color-primary)' }}>Ups! Alguna cosa ha fallat.</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        {this.props.fallbackMessage || 'Hi ha hagut un error en carregar aquesta part de l\'aplicació.'}
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            marginTop: '20px',
                            padding: '12px 24px',
                            background: 'var(--color-primary)',
                            color: 'white',
                            border: 'none',
                            borderRadius: 'var(--radius-md)',
                            fontWeight: '800',
                            cursor: 'pointer'
                        }}
                    >
                        Recarregar pàgina
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;

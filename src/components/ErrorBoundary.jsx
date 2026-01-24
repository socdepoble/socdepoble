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
                <div className="error-boundary-container" style={{ padding: '40px 20px', textAlign: 'center' }}>
                    <UnifiedStatus
                        type="error"
                        message={this.props.fallbackMessage || "Vaja! Alguna cosa ha anat malament."}
                        onRetry={() => window.location.reload()}
                    />
                    <p style={{ marginTop: '20px', color: 'var(--color-text-muted)', fontSize: '14px' }}>
                        Hem registrat l'error i estem treballant per solucionar-ho.
                        Pots provar de recarregar la pàgina.
                    </p>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;

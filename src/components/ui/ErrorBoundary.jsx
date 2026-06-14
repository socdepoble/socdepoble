import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[SDP] Error no controlat:', error, errorInfo);
    // Enviar a sistema de monitorització
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="sp-matrioixca" data-escala="pagina" style={{alignItems: 'center', justifyContent: 'center', padding: '2rem'}}>
          <h1>Alguna cosa ha fallat</h1>
          <p>No hem pogut carregar aquesta part del Mas.</p>
          <button className="sp-btn-primary" onClick={() => window.location.reload()}>
            Tornar a intentar
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

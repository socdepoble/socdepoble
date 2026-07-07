import React from 'react';

/**
 * SdpBancalSegur (Error Boundary)
 * D'acord amb la Skill `error_boundaries` i `self_repair`:
 * - Aïlla els errors d'una regió sense tombar tot el Mas.
 * - Mostra un avís informatiu clar i gran en valencià.
 * - NO proporciona botó de "hard reset" per protegir les dades locals sagrades.
 */
class SdpBancalSegur extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Es podria registrar a l'Sentry o a la Consola Termodinàmica
    console.error("[SDP-LOCK] Fallada al Bancal:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div 
          className="flex flex-col items-center justify-center p-8 m-4 rounded-3xl text-center border-4 border-dashed"
          style={{ 
            backgroundColor: 'var(--sp-white-100)', 
            borderColor: 'var(--sp-orange-80)',
            color: 'var(--sp-text-fosc)',
            minHeight: '300px'
          }}
        >
          <div className="text-6xl mb-6" aria-hidden="true">🚜</div>
          <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--sp-orange-100)' }}>
            Aquest bancal està en guaret
          </h2>
          <p className="text-lg max-w-md opacity-80">
            Hi ha hagut un xicotet entrebanc tècnic ací. Per seguretat i per protegir les teues dades, hem tancat aquesta parcel·la temporalment.
          </p>
          <div 
            className="mt-8 p-4 bg-neutral-100 rounded-xl text-left text-sm overflow-auto max-w-full opacity-60"
            style={{ display: 'none' /* Ocult per als majors, visible només via devtools */ }}
          >
            <code>{this.state.error?.toString()}</code>
          </div>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default SdpBancalSegur;

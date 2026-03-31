import React from 'react';

class GlobalErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service like Sentry here
    console.error("GlobalErrorBoundary catched an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="flex flex-col items-center justify-center p-8 m-4 rounded-[28px] border border-red-900 bg-red-900/20 text-center glass-panel">
          <h2 className="text-2xl font-black text-red-500 mb-4">⚠️ Errida Crítica al Sistema</h2>
          <p className="text-gray-300 mb-6">
            S'ha produït un error de renderitzat o en el processament de dades d'aquesta secció.<br />
            Això succeeix quan un connector extern (ex: Google) cau o hi ha una corrupció al memòria local.
          </p>
          <button 
            className="btn-primary" 
            style={{background: 'var(--color-error)'}}
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
          >
            REINICIAR VISTA
          </button>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default GlobalErrorBoundary;

import { Component } from 'react';
import { openDB } from 'idb';
import { logger } from '../../utils/logger';
import TactileButton from '../design/TactileButton';
class GlobalErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      isHealing: false,
      isPrivateMode: false
    };
  }
  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error
    };
  }
  componentDidCatch(error, errorInfo) {
    logger.error('[ErrorBoundary] Error capturat:', error, errorInfo);

    // Detectar si l'error és exclusiu de Mode Privat de Safari / Bloqueig de DB
    const errorString = String(error?.name) + ' ' + String(error?.message);
    if (errorString.includes('UnknownError') || errorString.includes('transient reason') || errorString.includes('SecurityError') || errorString.includes('InvalidStateError') // Safari IDB blocked
    ) {
      this.setState({
        isPrivateMode: true
      });
      return;
    }

    // === AUTOSANACIÓ QUIRÚRGICA ===
    const criticalErrors = ['QuotaExceededError', 'DataCloneError', 'IndexedDB', 'IDB', 'Yjs', 'rhizome'];
    const isCritical = criticalErrors.some(msg => error.name?.includes(msg) || error.message?.includes(msg));
    if (isCritical && !this.state.isPrivateMode) {
      this.setState({
        isHealing: true
      });
      this.healDatabase().then(success => {
        if (success) {
          window.location.href = '/?healed=true&v=' + Date.now();
        }
      });
    }
  }
  async healDatabase() {
    try {
      logger.warn('[AUTOSANACIÓ] Detectada corrupció crítica – iniciant purga quirúrgica...');
      const db = await openDB('rhizome-v1', 1);
      const tx = db.transaction('rhizome', 'readwrite');
      await tx.store.clear();
      try {
        await db.delete('sovereign-identity');
      } catch {
        // Ignore
      }
      await tx.done;
      logger.info('[AUTOSANACIÓ] Base de dades purgada i restaurada amb èxit');
      return true;
    } catch (e) {
      logger.error('[AUTOSANACIÓ] Error durant la purga:', e);
      const errorString = String(e?.name) + ' ' + String(e?.message);
      if (errorString.includes('UnknownError') || errorString.includes('transient reason')) {
        this.setState({
          isPrivateMode: true,
          isHealing: false
        });
        return false; // No recarreguem, mostrem l'avís de mode privat
      }
      localStorage.clear();
      sessionStorage.clear();
      return true;
    }
  }
  render() {
    if (this.state.isPrivateMode) {
      return <div className="min-h-screen bg-[#050505] flex items-center justify-center p-8 text-white text-center">
                    <div className="max-w-xl">
                        <div className="mb-8 flex justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-24 h-24 p-6 bg-[#F97316]/10 rounded-full border border-[#F97316]/30 text-[#F97316]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-black mb-4">Mode Privat Detectat</h1>
                        <p className="text-xl text-gray-300 mb-6 leading-relaxed">
                            El teu navegador està bloquejant l'emmagatzematge local de dades perquè estàs en <strong>Navegació Privada</strong>.
                        </p>
                        <p className="text-gray-400 mb-10 text-lg">
                            Sóc de Poble és una aplicació Offline-First. Necessita guardar les converses al teu dispositiu per a ser ultra ràpida.
                            Per favor, <strong>tanca aquesta pestanya i obre'n una de normal</strong> per accedir al poble.
                        </p>
                    </div>
                </div>;
    }
    if (this.state.hasError) {
      return <div className="min-h-screen bg-black flex items-center justify-center p-8 text-white">
                    <div className="max-w-md text-center">
                        <h1 className="text-4xl font-black mb-6">🌾 La plaça està curant-se...</h1>
                        {this.state.isHealing ? <p className="text-xl mb-8">S’està purgant la corrupció i reiniciant el Búnker. Un moment, si us plau.</p> : <>
                                <p className="mb-8">S’ha produït un error crític. El sistema s’està auto-reparant.</p>
                                <TactileButton onClick={() => window.location.reload()} className="px-10 py-6 text-2xl bg-[#F97316] rounded-3xl">
                                    Reiniciar la plaça
                                </TactileButton>
                            </>}
                    </div>
                </div>;
    }
    return this.props.children;
  }
}
export default GlobalErrorBoundary;
import React, { useEffect, useState } from 'react';
import { setupGlobalErrorInterceptors } from '../utils/errorRecovery';

/**
 * SystemGuardian
 * El Coordinador Únic de Recuperació (Consell de ChatGPT).
 * Agrupa la lògica per recarregar, purgar o posar en quarantena offline.
 */
export const SystemGuardian = ({
  children
}) => {
  const [quarantineMode, setQuarantineMode] = useState(false);
  const [bancalMode, setBancalMode] = useState(false);
  useEffect(() => {
    setupGlobalErrorInterceptors();
    const handleOfflineQuarantine = () => {
      console.warn('[SystemGuardian] Entrant en mode Quarantena Offline.');
      setQuarantineMode(true);
      setBancalMode(true);
      document.documentElement.style.setProperty('--mode-bancal', '1');
    };
    const handleOfflineConflict = e => {
      console.error('[SystemGuardian] Conflicte Offline Detectat! Naufragant a /conflict');
      // Passem les dades per sessionStorage per sobreviure a la recàrrega de window.location
      if (e.detail) {
        sessionStorage.setItem('sdp_conflict_data', JSON.stringify(e.detail));
      }
      window.location.href = '/conflict';
    };
    const handleUpdateAvailable = e => {
      console.info('[SystemGuardian] Nova versió detectada.', e.detail);
      // Ací podríem mostrar el botó d'actualització de forma elegant
    };
    window.addEventListener('sdp:offline-quarantine', handleOfflineQuarantine);
    window.addEventListener('sdp:offline-conflict', handleOfflineConflict);
    window.addEventListener('sdp:update-available', handleUpdateAvailable);

    // Detectar BFCache Restore
    const handlePageShow = e => {
      if (e.persisted) {
        console.warn('[SystemGuardian] Restauració des del BFCache detectada. Forçant refresc segur...');
        // Opcional: forçar una xicoteta recàrrega o refresc d'estat si estem offline
      }
    };
    window.addEventListener('pageshow', handlePageShow);
    return () => {
      window.removeEventListener('sdp:offline-quarantine', handleOfflineQuarantine);
      window.removeEventListener('sdp:offline-conflict', handleOfflineConflict);
      window.removeEventListener('sdp:update-available', handleUpdateAvailable);
      window.removeEventListener('pageshow', handlePageShow);
    };
  }, []);
  return <>
      {children}
      {quarantineMode && <div className="avisador-efímer trellat-entrar" role="status" aria-live="polite">
          <span>🚜 <strong>Sessió Caducada</strong>: Mode de Només Lectura (Sense Connexió).</span>
          <button className="tancar-avisador" onClick={() => setQuarantineMode(false)} aria-label="Tancar">×</button>
        </div>}
    </>;
};
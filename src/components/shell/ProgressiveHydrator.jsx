// src/components/shell/ProgressiveHydrator.jsx
// Orquestra la transició skeleton → LCP → complet.
// Separa el que veu l'Uelo del que sap el sistema.

import React, { useEffect, useRef } from 'react';
import { useProgressiveRestore, FASE } from '../../hooks/useProgressiveRestore';
export function ProgressiveHydrator({
  rhizomeManager,
  children
}) {
  const {
    fase,
    error
  } = useProgressiveRestore(rhizomeManager);
  const t0 = useRef(performance.now());
  useEffect(() => {
    if (fase === FASE.COMPLET) {
      const ms = (performance.now() - t0.current).toFixed(0);
      console.info(`[Hydrator] Restauració completa en ${ms}ms`);
    }
  }, [fase]);

  // En error de restauració: mostra un missatge humà, no un stack trace
  if (fase === FASE.ERROR) {
    return <div role="alert" style={{
      padding: '2rem',
      paddingTop: 'calc(var(--sp-shell-offset) + 2rem)',
      textAlign: 'center',
      fontFamily: 'var(--sp-font-brand)'
    }}>
        <p style={{
        fontSize: '1.5rem',
        marginBottom: '1rem'
      }}>🚜</p>
        <p style={{
        fontWeight: 900,
        fontSize: '1.1rem',
        marginBottom: '0.5rem'
      }}>
          El tractor s'ha calat
        </p>
        <p style={{
        opacity: 0.6,
        fontSize: '0.95rem',
        marginBottom: '1.5rem'
      }}>
          No s'ha pogut recuperar la memòria local. Torna a arrancar.
        </p>
        <button onClick={() => window.location.reload()} style={{
        padding: '0.75rem 2rem',
        borderRadius: '999px',
        background: 'var(--sp-orange-500)',
        color: 'white',
        fontWeight: 900,
        border: 'none',
        cursor: 'pointer',
        fontSize: '1rem'
      }}>
          Arrancar de nou
        </button>
      </div>;
  }

  // Mentre la restauració és en curs, els children ja són visibles
  // (fase LCP: mostren els posts del cache).
  // L'indicador de "carregant" és subtle, no bloquejant.
  return <>
      {fase < FASE.COMPLET && <div aria-live="polite" aria-label="Sincronitzant el Mas..." style={{
      position: 'fixed',
      bottom: 'calc(env(safe-area-inset-bottom, 0px) + 12px)',
      right: '16px',
      zIndex: 'var(--sp-z-toast, 80)',
      background: 'rgba(0,0,0,0.75)',
      color: 'white',
      fontSize: '11px',
      fontWeight: 700,
      letterSpacing: '0.05em',
      padding: '6px 12px',
      borderRadius: '999px',
      opacity: 0.85
    }}>
          Sincronitzant…
        </div>}
      {children}
    </>;
}
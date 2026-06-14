import React, { useEffect, useRef, useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
const RELOAD_COUNT_KEY = 'pwa-reload-count';
const MAX_RELOAD_ATTEMPTS = 2;
export function PwaUpdater() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker
  } = useRegisterSW({
    onRegister(r) {},
    onRegisterError(error) {
      console.error('SW registration error', error);
    }
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [circuitBroken, setCircuitBroken] = useState(false);
  const hasReloaded = useRef(false);
  useEffect(() => {
    // Check circuit breaker on mount
    const reloadCount = parseInt(sessionStorage.getItem(RELOAD_COUNT_KEY) || '0', 10);
    if (reloadCount >= MAX_RELOAD_ATTEMPTS) {
      console.error('🛑 [ARCH SHIELD] Circuit Breaker Activated: Infinite reload loop prevented in Safari.');
      setCircuitBroken(true);
      return;
    }

    // Reset circuit breaker after 10 seconds of stability
    const timer = setTimeout(() => {
      if (!needRefresh && !isUpdating) {
        sessionStorage.removeItem(RELOAD_COUNT_KEY);
      }
    }, 10000);
    return () => clearTimeout(timer);
  }, [needRefresh, isUpdating]);
  useEffect(() => {
    if (!needRefresh) return;
    if (circuitBroken) return; // Halt!

    // Safari controllerchange guard
    const handleControllerChange = () => {
      if (hasReloaded.current) return;
      hasReloaded.current = true;
      const currentCount = parseInt(sessionStorage.getItem(RELOAD_COUNT_KEY) || '0', 10);
      sessionStorage.setItem(RELOAD_COUNT_KEY, (currentCount + 1).toString());

      // Regla Dola & Kimi: Esperar 2000ms per a WebKit i forçar Hard Navigation Nuclear

      setTimeout(() => {
        sessionStorage.setItem('updateInProgress', 'true');
        window.location.replace(window.location.href.split('?')[0] + '?_v=' + Date.now());
      }, 2000);
    };
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange);
    }
    return () => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange);
      }
    };
  }, [needRefresh, circuitBroken]);
  const handleUpdate = () => {
    setIsUpdating(true);
    // Send the sw:apply-update message or SKIP_WAITING
    updateServiceWorker(true);
  };
  const handleNuclearReset = () => {
    sessionStorage.removeItem(RELOAD_COUNT_KEY);
    localStorage.clear();
    window.location.replace(window.location.origin + '?v=' + Date.now());
  };
  if (circuitBroken) {
    return <div style={{
      position: 'fixed',
      bottom: 20,
      right: 20,
      background: '#ef4444',
      color: 'white',
      padding: '16px',
      borderRadius: '8px',
      zIndex: 9999,
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    }}>
        <p className="font-bold mb-2">Error d'Actualització</p>
        <p className="text-sm mb-4">Hem detectat problemes en el navegador. La nova versió no s'ha pogut aplicar.</p>
        <button onClick={handleNuclearReset} className="bg-white text-red-500 px-4 py-2 rounded text-sm font-bold">
          Restablir Aplicació
        </button>
      </div>;
  }
  if (needRefresh) {
    return <div style={{
      position: 'fixed',
      bottom: 20,
      right: 20,
      background: '#f97316',
      color: 'white',
      padding: '16px',
      borderRadius: '8px',
      zIndex: 9999,
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    }}>
        <p className="font-bold mb-2">Nova versió disponible!</p>
        <p className="text-sm mb-4">Actualitza per a continuar utilitzant Sóc de Poble.</p>
        <button onClick={handleUpdate} disabled={isUpdating} className="bg-white text-orange-500 px-4 py-2 rounded text-sm font-bold w-full">
          {isUpdating ? 'Actualitzant...' : 'Actualitzar ara'}
        </button>
      </div>;
  }
  return null;
}
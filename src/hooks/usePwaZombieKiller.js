import { useEffect } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';

export function usePwaZombieKiller(isDictant = false) {
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('✅ [PWA] Sentinella actiu. Buscant actualitzacions...');
      // Revisió silenciosa cada hora (per telèfons que mai tanquen l'App)
      setInterval(() => r && r.update(), 60 * 60 * 1000);
    }
  });

  useEffect(() => {
    // Si tenim el codi nou llest I l'usuari no està ocupat parlant:
    if (needRefresh && !isDictant) {
      console.log("🔪 [PWA] Via lliure. Exterminant el Zombie i forçant recàrrega neta...");
      
      // Enviar 'true' executa el skipWaiting internament i fa un window.location.reload()
      // de forma totalment transparent. L'àvia sempre tindrà el darrer codi.
      updateServiceWorker(true);
    }
  }, [needRefresh, isDictant, updateServiceWorker]);
}

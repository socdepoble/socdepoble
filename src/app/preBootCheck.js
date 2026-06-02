// src/app/preBootCheck.js
// Executar abans de muntar l'app. Comprova versions, checkpoints i decideix migrar o fallback.

import { runMigrations, getCheckpoint } from '../data/idbMigrations';

const VERSION_ENDPOINT = '/version.json';
const LOCAL_VERSION_KEY = 'sdp_local_version';
const MAX_MIGRATION_RETRIES = 3;
const OWNER_ID = `client-${Math.floor(Math.random()*1e6)}`;

// Micro-ping Termodinàmic (Detector de Lie-Fi)
export async function checkRealNetwork() {
  if (!navigator.onLine) return false;
  try {
    const res = await fetch(`${VERSION_ENDPOINT}?t=${Date.now()}`, { 
      method: 'HEAD', 
      cache: 'no-store',
      signal: AbortSignal.timeout(1500) 
    });
    return res.ok;
  } catch (e) {
    return false;
  }
}

async function fetchRemoteVersion() {
  try {
    const r = await fetch(`${VERSION_ENDPOINT}?t=${Date.now()}`, { cache: 'no-store', signal: AbortSignal.timeout(2000) });
    if (!r.ok) throw new Error('No version');
    return await r.json(); // retorna { version: '15', hash: '...' }
  } catch (e) {
    return null;
  }
}

function scheduleBackgroundRetry() {
  localStorage.setItem('migration_retry_scheduled', String(Date.now()));
}

export async function preBootCheck({ onStatus = () => {} } = {}) {
  onStatus('start');
  
  const isReallyOnline = await checkRealNetwork();
  const remote = isReallyOnline ? await fetchRemoteVersion() : null;
  const localVersion = localStorage.getItem(LOCAL_VERSION_KEY) || null;

  // Si no hi ha connexió real, mode lectura/offline segur
  if (!remote) {
    onStatus('no-network');
    const cp = await getCheckpoint();
    if (cp) {
      onStatus('incomplete-migration');
      scheduleBackgroundRetry();
      return { mode: 'readonly', reason: 'incomplete-migration' };
    }
    return { mode: 'normal', reason: 'offline' };
  }

  // Handshake de versions
  if (remote.version && remote.version !== localVersion) {
    onStatus('version-mismatch', { remote: remote.version, local: localVersion });
    
    // El SW s'hauria d'encarregar de la purga un cop acceptada la nova versió via postMessage.
    let tries = 0;
    while (tries < MAX_MIGRATION_RETRIES) {
      try {
        await runMigrations({
          ownerId: OWNER_ID,
          onProgress: (p) => onStatus('migration-progress', p)
        });
        
        localStorage.setItem(LOCAL_VERSION_KEY, remote.version);
        onStatus('migration-done');
        return { mode: 'normal', reason: 'migrated', version: remote.version, hash: remote.hash };
      } catch (err) {
        tries++;
        onStatus('migration-failed', { tries, err: String(err) });
        
        const onlineNow = await checkRealNetwork();
        if (!onlineNow) {
          scheduleBackgroundRetry();
          return { mode: 'readonly', reason: 'offline-during-migration' };
        }
        await new Promise(res => setTimeout(res, Math.min(2000 * Math.pow(2, tries), 30000)));
      }
    }
    onStatus('migration-aborted');
    return { mode: 'readonly', reason: 'migration-aborted' };
  }

  const cp = await getCheckpoint();
  if (cp) {
    try {
      await runMigrations({ ownerId: OWNER_ID, onProgress: (p) => onStatus('migration-resume', p) });
      onStatus('migration-resumed');
      return { mode: 'normal', reason: 'resumed' };
    } catch (err) {
      onStatus('migration-resume-failed', { err: String(err) });
      scheduleBackgroundRetry();
      return { mode: 'readonly', reason: 'resume-failed' };
    }
  }

  onStatus('ok');
  return { mode: 'normal', reason: 'up-to-date', hash: remote?.hash };
}

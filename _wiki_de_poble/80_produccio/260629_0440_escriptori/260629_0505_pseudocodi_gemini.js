// Pseudocodi extret de l'auditoria de Gemini (Ronda 11)
// Conservat per a la implementació de l'arquitectura de Sóc de Poble

// 1. Timeouts Anti-Deadlock
export function promesaAmbTrellat(promesaOriginal, msLimit = 10000, nomAccio = "Tasca Crítica") {
  let timeoutId;
  const promesaTemps = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(`[DEADLOCK EVITAT] '${nomAccio}' ofegada als ${msLimit}ms. Tallem l'aigua.`));
    }, msLimit);
  });
  
  return Promise.race([promesaOriginal, promesaTemps]).finally(() => {
    clearTimeout(timeoutId);
  });
}

// 2. Mutex Global de Workers
export async function executarAmbMutexGlobal(nomTasca, funcioPesada) {
  if (!navigator.locks) {
    console.warn("⚠️ [MUTEX] Safari antic sense Web Locks API. Resant al Trellat...");
    return await funcioPesada();
  }

  return await navigator.locks.request('sosp_ram_mutex', { mode: 'exclusive' }, async (lock) => {
    console.log(`[MUTEX] 🔒 Pany tancat per a: ${nomTasca}`);
    try {
      return await funcioPesada();
    } finally {
      console.log(`[MUTEX] 🔓 Pany obert. ${nomTasca} finalitzada. El tractor respira.`);
    }
  });
}

// 3. Keepalive i Persistència d'iOS
import { set } from 'idb-keyval';
export async function blindarContraLlopApple() {
  if (navigator.storage && navigator.storage.persist) {
    const isPersisted = await navigator.storage.persist();
    console.log(`[AMNÈSIA] Storage Safari: ${isPersisted ? 'CONCEDIT' : 'DENEGAT (Ull viu)'}`);
  }

  const batecarCor = async () => {
    try {
      await promesaAmbTrellat(set('sosp_batec_idb', Date.now()), 2000, 'Ping_Keepalive');
      console.log("💓 [KEEPALIVE] Batec registrat a IDB. Llop d'Apple adormit.");
    } catch (e) {
      console.warn("⚠️ [KEEPALIVE] Fallada termodinàmica en el batec silenciós.", e);
    }
  };

  await batecarCor();
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') batecarCor();
  });
}

// 4. Protocol Quiesce i Swap Atòmic OPFS
import * as Y from 'yjs';
export async function laVeremaAtomicSwap(docYjs, webrtcProvider, nomFitxerFinal) {
  console.log("🛑 [QUIESCE] Aturant Sèquia Mare per consolidació atòmica...");
  if (webrtcProvider) webrtcProvider.disconnect();

  try {
    const estatPur = Y.encodeStateAsUpdate(docYjs);
    const opfsRoot = await navigator.storage.getDirectory();
    
    const fitxerTmp = await opfsRoot.getFileHandle(`${nomFitxerFinal}.tmp`, { create: true });
    const writableTmp = await fitxerTmp.createWritable();
    await writableTmp.write(estatPur);
    await writableTmp.close();

    const fitxerDefinitiu = await opfsRoot.getFileHandle(nomFitxerFinal, { create: true });
    const writableDef = await fitxerDefinitiu.createWritable();
    const tempBlob = await fitxerTmp.getFile();
    await writableDef.write(await tempBlob.arrayBuffer());
    await writableDef.close();
    
    await opfsRoot.removeEntry(`${nomFitxerFinal}.tmp`);
    console.log(`✅ [QUIESCE] Swap atòmic consolidat a la Pedra Seca: ${nomFitxerFinal}`);

  } catch (error) {
    console.error("🔥 [FATAL] Error d'escriptura. La Pedra Seca original està completament intacta.", error);
    throw error;
  } finally {
    console.log("🌊 [QUIESCE] Relleu donat. Reconnectant WebRTC...");
    if (webrtcProvider) webrtcProvider.connect();
  }
}


// Enllaç orgànic per netejar el graf: [[00_index_escriptori]]

/**
 * PROTOCOLO DE CONTAGIO P2P SOBERANO (Visión 2056)
 * Generado tras la Auditoría de DeepSeek
 * 
 * Este módulo contiene los cimientos para que Sóc de Poble (el Genotipo)
 * pueda autoreproducirse y transferirse de un nodo (iPad Alfa) a otro (iPad Beta)
 * estando completamente offline (usando WebRTC en red local).
 */

// ==========================================
// ROL: NODO ALFA (El Transmisor del Gen)
// ==========================================
export async function startContagionServer(manifestUrl = '/manifest.webmanifest') {
  // Configuración para operar únicamente en LAN, sin STUN/TURN centrales
  const pc = new RTCPeerConnection({ iceServers: [] });
  const channel = pc.createDataChannel('gen-replication');

  channel.onopen = async () => {
    console.log('[CONTAGIO] Canal de sangre digital abierto. Iniciando réplica...');
    
    // 1. Enviar manifiesto base
    try {
      const manifestRes = await fetch(manifestUrl);
      const manifest = await manifestRes.json();
      channel.send(JSON.stringify({ type: 'manifest', data: manifest }));
    } catch (e) {
      console.warn('[CONTAGIO] No se pudo leer el manifest:', e);
    }

    // 2. Extracción de archivos vitales.
    // En el futuro Vite nos daría este asset manifest.
    const fileList = [
      '/',
      '/index.html',
      '/assets/llibre-sencer.html'
    ];
    channel.send(JSON.stringify({ type: 'fileList', data: fileList }));

    // 3. Envío en Base64
    for (const fileUrl of fileList) {
      try {
        const response = await fetch(fileUrl);
        const blob = await response.blob();
        const base64Data = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(blob);
        });
        channel.send(JSON.stringify({ type: 'file', url: fileUrl, data: base64Data }));
      } catch (err) {
        console.warn(`[CONTAGIO] Fallo al leer ${fileUrl}.`, err);
      }
    }
  };

  pc.onicecandidate = (e) => {
    if (!e.candidate) {
      console.log('[CONTAGIO] Oferta ICE completa. Generar QR para el nodo Beta:', JSON.stringify(pc.localDescription));
    }
  };

  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);
  return pc;
}

// ==========================================
// ROL: NODO BETA (El Receptor / Huésped)
// ==========================================
export async function joinContagion(offerFromAlpha) {
  const pc = new RTCPeerConnection({ iceServers: [] });

  pc.ondatachannel = (event) => {
    const channel = event.channel;
    channel.onmessage = async (msg) => {
      const { type, data, url } = JSON.parse(msg.data);

      if (type === 'file' && 'caches' in window) {
        console.log(`[CONTAGIO] Asimilando ruta: ${url}`);
        const cache = await caches.open('p2p-genome');
        const res = await fetch(data);
        const blob = await res.blob();
        await cache.put(url, new Response(blob));
      }
    };
  };

  await pc.setRemoteDescription(new RTCSessionDescription(offerFromAlpha));
  const answer = await pc.createAnswer();
  await pc.setLocalDescription(answer);
  
  console.log('[CONTAGIO] Answer generado. Pasa este código al Nodo Alfa para establecer la conexión local.');
  return pc;
}

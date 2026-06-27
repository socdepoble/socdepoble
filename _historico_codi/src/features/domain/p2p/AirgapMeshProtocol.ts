import { usePostsStore } from '../posts/usePostsStore';
import { getPendingMutations, mergeIncomingCRDTs } from '../../data/offline/mutation-queue';

export class AirgapMeshProtocol {
  private peer: RTCPeerConnection;
  private channel: RTCDataChannel | null = null;

  constructor(private onQrUpdate: (qrBase64: string) => void) {
    // MAGIA AIRGAP: Cero servidores STUN/TURN. Solo Red Local / Hotspot Ad-hoc.
    this.peer = new RTCPeerConnection({ iceServers: [] });
  }

  // ----------------------------------------------------------------------
  // COMPRESIÓN EXTREMA: REDUCIENDO 3KB a ~400 BYTES PARA EL CÓDIGO QR
  // ----------------------------------------------------------------------
  private async minifyAndCompressSDP(sdp: string, prefix: string): Promise<string> {
    // 1. Poda Quirúrgica: Eliminamos extensiones inútiles para transferir solo datos (CRDTs)
    const minimal = sdp.split('\r\n').filter(line => {
      if (line.startsWith('a=extmap') || line.startsWith('a=rtcp') || line.startsWith('a=fmtp')) return false;
      // Eliminamos IPs públicas, solo nos sirven las IPs de la LAN Ad-Hoc (mDNS / 192.168.x.x)
      if (line.includes('a=candidate') && !line.includes('typ host')) return false;
      return true;
    }).join('\n'); // Usamos \n para afeitar bytes extra

    // 2. Deflación Binaria Nativa (GZIP estándar del navegador por C++)
    const stream = new Blob([minimal]).stream().pipeThrough(new CompressionStream('deflate-raw'));
    const buffer = await new Response(stream).arrayBuffer();
    
    // 3. Empaquetado en Base64 seguro para el componente <QRCodeCanvas />
    return `${prefix}:${btoa(String.fromCharCode(...new Uint8Array(buffer)))}`;
  }

  private async decompressAndRestoreSDP(b64: string): Promise<string> {
    const binary = atob(b64.split(':')[1]);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    
    // FIX LINUX/TS: In TS, DecompressionStream exists but might not be in the default lib yet depending on target. We cast to any if needed, but assuming modern target.
    const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
    const minimal = await new Response(stream).text();
    return minimal.replace(/\n/g, '\r\n'); // Restauramos el estándar \r\n estricto de WebRTC
  }

  // ----------------------------------------------------------------------
  // FASE 1: HOST CREA LA OFERTA (El Abuelo muestra el primer código QR)
  // ----------------------------------------------------------------------
  public async generateQROffer(): Promise<void> {
    this.channel = this.peer.createDataChannel('crdt_sync_tunnel', { negotiated: true, id: 0 });
    this.setupDataChannelListeners();

    const offer = await this.peer.createOffer();
    await this.peer.setLocalDescription(offer);

    // Esperamos pacientemente a que el OS detecte la IP Local (Candidatos ICE Completos)
    await new Promise<void>(resolve => {
      if (this.peer.iceGatheringState === 'complete') resolve();
      this.peer.onicegatheringstatechange = () => {
        if (this.peer.iceGatheringState === 'complete') resolve();
      };
    });

    const qrPayload = await this.minifyAndCompressSDP(this.peer.localDescription!.sdp, 'OFR');
    this.onQrUpdate(qrPayload); // La UI pinta el QR
  }

  // ----------------------------------------------------------------------
  // FASE 2: GUEST ESCANEA, RESPONDE Y MUESTRA SU QR (La Panadera)
  // ----------------------------------------------------------------------
  public async consumeQRAndGenerateAnswer(scannedOffer: string): Promise<void> {
    const sdpRestaurado = await this.decompressAndRestoreSDP(scannedOffer);
    await this.peer.setRemoteDescription(new RTCSessionDescription({ type: 'offer', sdp: sdpRestaurado }));

    const answer = await this.peer.createAnswer();
    await this.peer.setLocalDescription(answer);

    await new Promise<void>(resolve => {
      if (this.peer.iceGatheringState === 'complete') resolve();
      this.peer.onicegatheringstatechange = () => {
        if (this.peer.iceGatheringState === 'complete') resolve();
      };
    });

    const qrPayload = await this.minifyAndCompressSDP(this.peer.localDescription!.sdp, 'ANS');
    this.onQrUpdate(qrPayload);
  }

  // ----------------------------------------------------------------------
  // FASE 3: HOST ESCANEA RESPUESTA -> ¡TÚNEL ÓPTICO ESTABLECIDO!
  // ----------------------------------------------------------------------
  public async finalizeHandshake(scannedAnswer: string) {
    const sdpRestaurado = await this.decompressAndRestoreSDP(scannedAnswer);
    await this.peer.setRemoteDescription(new RTCSessionDescription({ type: 'answer', sdp: sdpRestaurado }));
    // ⚡ EN ESTE INSTANTE, LAS TARJETAS DE RED DE LOS TELÉFONOS SE ENLAZAN. 0% INTERNET.
  }

  // ----------------------------------------------------------------------
  // FASE 4: FUSIÓN CRDT EN LA CALLE (La Malla de Arrastre)
  // ----------------------------------------------------------------------
  private setupDataChannelListeners() {
    this.channel!.binaryType = 'arraybuffer';
    
    this.channel!.onopen = async () => {
      console.log('🔗 [AIRGAP MESH] Túnel establecido en la plaza. Transfiriendo Bandos...');
      // Extraemos la cola física de IndexedDB (Las mutaciones creadas offline)
      const offlineMutations = await getPendingMutations();
      this.channel!.send(new TextEncoder().encode(JSON.stringify({
        type: 'MESH_CRDT_SYNC', payload: offlineMutations
      })));
    };

    this.channel!.onmessage = async (event) => {
      const { type, payload } = JSON.parse(new TextDecoder().decode(event.data));
      
      if (type === 'MESH_CRDT_SYNC') {
        console.log(`📥 [AIRGAP] Recibidas ${payload.length} mutaciones locales del vecino.`);
        
        // 1. Inyectamos en NUESTRA base de datos física IndexedDB.
        // Si nosotros recuperamos el 4G, NUESTRO Service Worker subirá el Bando del vecino.
        await mergeIncomingCRDTs(payload);
        
        // 2. Disparamos la reconciliación a la UI (Zustand + React 19 Time-Slicing)
        new BroadcastChannel('sdp_sync_burst').postMessage({
          type: 'SYNC_BATCH_RESOLVED',
          payload: payload
        });

        // 3. A11y: El móvil habla dulcemente usando el AriaLiveManager
        document.getElementById('sdp-a11y-announcer')!.textContent = 
          "Connexió de veïnat completada. S'han rebut notícies directament a la plaça, sense internet.";
      }
    };
  }
}

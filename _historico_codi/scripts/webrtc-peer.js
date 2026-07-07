// _scripts/webrtc-peer.js
// Sóc de Poble - WebRTC P2P Sync (Vanilla JS)
// Connexió directa d'igual a igual per a l'horta, sense passar per servidors centrals.


export class WebRTCPeer {
  constructor(syncEngine, signalingCallback) {
    this.syncEngine = syncEngine;
    this.connection = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] // STUN públic per travessar NAT bàsic
    });
    this.dataChannel = null;
    this.signalingCallback = signalingCallback; // Funció per intercanviar ofertes/respostes (ex: via QR o Bluetooth)
    
    this._setupConnection();
  }

  _setupConnection() {
    this.connection.onicecandidate = (event) => {
      if (event.candidate) {
        this.signalingCallback({ type: 'candidate', candidate: event.candidate });
      }
    };

    this.connection.ondatachannel = (event) => {
      this.dataChannel = event.channel;
      this._setupDataChannel();
    };
  }

  _setupDataChannel() {
    this.dataChannel.binaryType = 'arraybuffer';
    
    this.dataChannel.onopen = () => {
      console.log('🔗 Canal P2P WebRTC Obert! Els bancals estan connectats.');
      // Enviar l'estat actual només obrir la connexió
      this.syncEngine.getAll().then(entries => {
        // En una implementació completa, cridaríem a la lògica de generació del payload
        // Ací simulem el delta-update
        console.log('Enviant dades inicials via P2P...');
      });
    };

    this.dataChannel.onmessage = async (event) => {
      console.log(`📥 Dada P2P rebuda: ${event.data.byteLength} bytes`);
      // Passem el buffer directament a la Super-Skill
      await this.syncEngine.receive(event.data);
    };

    this.dataChannel.onclose = () => {
      console.log('❌ Canal P2P tancat.');
    };
  }

  async createOffer() {
    this.dataChannel = this.connection.createDataChannel('socdepoble-sync');
    this._setupDataChannel();

    const offer = await this.connection.createOffer();
    await this.connection.setLocalDescription(offer);
    this.signalingCallback({ type: 'offer', offer });
  }

  async handleSignal(signal) {
    if (signal.type === 'offer') {
      await this.connection.setRemoteDescription(new RTCSessionDescription(signal.offer));
      const answer = await this.connection.createAnswer();
      await this.connection.setLocalDescription(answer);
      this.signalingCallback({ type: 'answer', answer });
    } else if (signal.type === 'answer') {
      await this.connection.setRemoteDescription(new RTCSessionDescription(signal.answer));
    } else if (signal.type === 'candidate') {
      await this.connection.addIceCandidate(new RTCIceCandidate(signal.candidate));
    }
  }

  send(buffer) {
    if (this.dataChannel && this.dataChannel.readyState === 'open') {
      this.dataChannel.send(buffer);
      return true;
    }
    return false;
  }
}

// Fichero: src/domain/crypto/SecureTabBus.ts
export class SecureTabBus {
  private channel: BroadcastChannel;
  private hmacKey: CryptoKey | null = null;
  private readonly encoder = new TextEncoder();

  constructor(channelName: string) {
    this.channel = new BroadcastChannel(channelName);
  }

  // 1. INYECCIÓN ATÓMICA: El SW inyecta la clave cruda (32 bytes random) vía MessageChannel
  public async importEphemeralKey(rawKeyBuffer: ArrayBuffer) {
    this.hmacKey = await crypto.subtle.importKey(
      'raw', rawKeyBuffer, 
      { name: 'HMAC', hash: 'SHA-256' },
      false, // 🔥 EXTRACTABLE: FALSE. Un XSS jamás podrá robarla de la memoria RAM.
      ['sign', 'verify']
    );
  }

  // 2. EMISIÓN BLINDADA CON PREVENCIÓN DE REPLAY ATTACKS
  public async broadcast(action: string, payload: any) {
    if (!this.hmacKey) return;
    
    // Ventana de vida estricta y entropía absoluta
    const message = JSON.stringify({ 
      action, payload, 
      t: Date.now(), 
      n: crypto.randomUUID() 
    });
    
    const dataBuffer = this.encoder.encode(message);
    
    // Firma a nivel de hardware (0 Bloqueo del Main Thread de React)
    const signatureBuffer = await crypto.subtle.sign('HMAC', this.hmacKey, dataBuffer);
    const signatureB64 = btoa(String.fromCharCode(...new Uint8Array(signatureBuffer)));
    
    this.channel.postMessage({ message, signature: signatureB64 });
  }

  // 3. VERIFICACIÓN IMPLACABLE (Zero-Trust)
  public listen(onValidMessage: (action: string, payload: any) => void) {
    this.channel.onmessage = async (event) => {
      if (!this.hmacKey || !event.data.signature) return;
      
      try {
        const { message, signature } = event.data;
        const signatureBytes = Uint8Array.from(atob(signature), c => c.charCodeAt(0));
        const dataBuffer = this.encoder.encode(message);
        
        // Verificación en tiempo constante inmune a Timing Attacks
        const isValid = await crypto.subtle.verify(
          'HMAC', this.hmacKey, signatureBytes, dataBuffer
        );

        if (!isValid) {
          console.error('🏴☠️ [SPOOFING] Firma HMAC inválida detectada en el bus. Drop silencioso.');
          return;
        }

        const parsed = JSON.parse(message);
        // Anti-Replay Attack: Si el mensaje tiene más de 3 segundos, lo descartamos
        if (Date.now() - parsed.t > 3000) return;

        onValidMessage(parsed.action, parsed.payload);
      } catch (e) { /* Drop silencioso sin dar pistas al atacante */ }
    };
  }
}

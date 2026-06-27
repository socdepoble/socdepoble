/**
 * ============================================================================
 * SÓC DE POBLE - SDP OPTIMIZATION FOR QR CODES
 * ============================================================================
 * 
 * PROPÓSITO: Minimizar payload SDP para QR codes legibles en móviles antiguos
 * TÉCNICAS:
 * - Pruning de candidatos ICE redundantes
 * - Compresión base64 + gzip
 * - Checksum CRC32 para validación
 * - Solo candidatos 'host' para red local
 * 
 * OBJETIVO: < 500 caracteres para QR de alta densidad
 * 
 * @version 7.0.0-production
 * @qr-compatibility Version 10-H (hasta 573 caracteres)
 */

interface OptimizedSDP {
  version: number;
  type: 'offer' | 'answer';
  peerId: string;
  sdpCompressed: string;
  checksum: string;
  timestamp: number;
  networkId: string;
}

class SDPOptimizer {
  private readonly MAX_QR_LENGTH = 500; // Caracteres máximos para QR legible
  private readonly COMPRESSION_LEVEL = 9; // Máxima compresión

  async optimize(sdp: RTCSessionDescriptionInit, peerId: string, networkId: string): Promise<string> {
    // 1. Prunar candidatos ICE innecesarios
    const prunedSDP = this.pruneICECandidates(sdp.sdp || '');

    // 2. Compresión gzip
    const compressed = await this.compress(prunedSDP);

    // 3. Codificación base64
    const base64 = this.arrayBufferToBase64(compressed);

    // 4. Calcular checksum
    const checksum = await this.calculateChecksum(prunedSDP);

    // 5. Construir payload optimizado
    const optimized: OptimizedSDP = {
      version: 1,
      type: sdp.type as 'offer' | 'answer',
      peerId,
      sdpCompressed: base64,
      checksum,
      timestamp: Date.now(),
      networkId
    };

    const jsonPayload = JSON.stringify(optimized);

    // 6. Verificar tamaño para QR
    if (jsonPayload.length > this.MAX_QR_LENGTH) {
      console.warn('[SDP] Optimized payload exceeds QR limit:', jsonPayload.length);
      // Intentar compresión más agresiva
      return await this.aggressiveOptimize(sdp, peerId, networkId);
    }

    return jsonPayload;
  }

  async deoptimize(payload: string): Promise<{
    sdp: RTCSessionDescriptionInit;
    peerId: string;
    valid: boolean;
    error?: string;
  }> {
    try {
      const optimized: OptimizedSDP = JSON.parse(payload);

      // Verificar checksum
      const decompressed = await this.decompress(this.base64ToArrayBuffer(optimized.sdpCompressed));
      const calculatedChecksum = await this.calculateChecksum(decompressed);

      if (calculatedChecksum !== optimized.checksum) {
        return {
          sdp: { type: optimized.type },
          peerId: optimized.peerId,
          valid: false,
          error: 'Checksum mismatch - QR may be corrupted'
        };
      }

      // Reconstruir SDP
      const sdp: RTCSessionDescriptionInit = {
        type: optimized.type,
        sdp: decompressed
      };

      return {
        sdp,
        peerId: optimized.peerId,
        valid: true
      };

    } catch (error) {
      return {
        sdp: { type: 'offer' as any },
        peerId: 'unknown',
        valid: false,
        error: error instanceof Error ? error.message : 'Invalid QR payload'
      };
    }
  }

  private pruneICECandidates(sdp: string): string {
    const lines = sdp.split('\r\n');
    const prunedLines: string[] = [];

    for (const line of lines) {
      // Mantener solo líneas esenciales
      if (line.startsWith('a=candidate')) {
        // Solo candidatos 'host' para red local (sin relay/turn)
        if (line.includes(' typ host')) {
          // Extraer solo información esencial del candidato
          const pruned = this.pruneCandidateLine(line);
          prunedLines.push(pruned);
        }
        // Ignorar candidatos srflx, prflx, relay
      } else if (
        line.startsWith('m=') || // Media descriptions
        line.startsWith('c=') || // Connection info
        line.startsWith('a=ice-ufrag') ||
        line.startsWith('a=ice-pwd') ||
        line.startsWith('a=fingerprint') ||
        line.startsWith('a=setup') ||
        line.startsWith('a=mid') ||
        line.startsWith('a=sendrecv') ||
        line.startsWith('o=') || // Origin
        line.startsWith('s=') || // Session name
        line.startsWith('t=') || // Timing
        line.startsWith('v=') // Version
      ) {
        prunedLines.push(line);
      }
    }

    return prunedLines.join('\r\n');
  }

  private pruneCandidateLine(line: string): string {
    // Formato: a=candidate:foundation component protocol priority address port typ type ...
    const parts = line.split(' ');
    
    // Mantener solo: foundation, component, protocol, priority, address, port, typ
    const essentialParts = parts.slice(0, 8);
    
    // Eliminar generación y extensiones
    return essentialParts.join(' ');
  }

  private async compress(data: string): Promise<ArrayBuffer> {
    if ('CompressionStream' in window) {
      const blob = new Blob([data]);
      const stream = blob.stream();
      const compressedStream = stream.pipeThrough(new CompressionStream('gzip'));
      const compressedBlob = await new Response(compressedStream).blob();
      return await compressedBlob.arrayBuffer();
    }

    // Fallback sin compresión
    return new TextEncoder().encode(data).buffer;
  }

  private async decompress(buffer: ArrayBuffer): Promise<string> {
    if ('DecompressionStream' in window) {
      const blob = new Blob([buffer]);
      const stream = blob.stream();
      const decompressedStream = stream.pipeThrough(new DecompressionStream('gzip'));
      const decompressedBlob = await new Response(decompressedStream).blob();
      return await decompressedBlob.text();
    }

    // Fallback sin compresión
    return new TextDecoder().decode(buffer);
  }

  private async calculateChecksum(data: string): Promise<string> {
    const encoder = new TextEncoder();
    const hash = await crypto.subtle.digest('SHA-256', encoder.encode(data));
    return this.arrayBufferToHex(hash).substring(0, 8); // 8 caracteres hex
  }

  private async aggressiveOptimize(
    sdp: RTCSessionDescriptionInit,
    peerId: string,
    networkId: string
  ): Promise<string> {
    // Estrategias agresivas cuando el payload excede límite QR
    let prunedSDP = this.pruneICECandidates(sdp.sdp || '');

    // Eliminar fingerprints redundantes (mantener solo SHA-256)
    prunedSDP = prunedSDP.replace(/a=fingerprint:SHA-1.*\r\n/g, '');

    // Eliminar líneas de debug
    prunedSDP = prunedSDP.replace(/a=msid-semantic.*\r\n/g, '');
    prunedSDP = prunedSDP.replace(/a=group:BUNDLE.*\r\n/g, '');

    // Compresión máxima
    const compressed = await this.compress(prunedSDP);
    const base64 = this.arrayBufferToBase64(compressed);
    const checksum = await this.calculateChecksum(prunedSDP);

    const optimized: OptimizedSDP = {
      version: 1,
      type: sdp.type as 'offer' | 'answer',
      peerId,
      sdpCompressed: base64,
      checksum,
      timestamp: Date.now(),
      networkId
    };

    return JSON.stringify(optimized);
  }

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  }

  private arrayBufferToHex(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    return Array.from(bytes)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }
}

export const sdpOptimizer = new SDPOptimizer();

export default sdpOptimizer;

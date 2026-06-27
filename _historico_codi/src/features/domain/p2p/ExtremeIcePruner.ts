// Fichero: src/domain/p2p/ExtremeIcePruner.ts
export class ExtremeIcePruner {
  
  public static pruneSDPForAirgapQR(rawSdp: string): string {
    const lines = rawSdp.split('\r\n');
    const optimizedLines: string[] = [];

    // El Bisturí: Regex militar para subredes LAN privadas (192.168.x.x, 10.x.x.x, 172.16-31.x.x)
    const privateIpv4Regex = /^(192\.168\.|10\.|172\.(1[6-9]|2[0-9]|3[0-1])\.)/;

    for (const line of lines) {
      // 1. Conservar obligatoriamente la espina dorsal WebRTC y la criptografía DTLS
      if (/^(v|o|s|t|m|c)=/.test(line) || /^a=(fingerprint|ice-ufrag|ice-pwd|setup|mid|sctpmap)/.test(line)) {
        optimizedLines.push(line);
        continue;
      }

      // 2. EL FRANCOTIRADOR ICE (Selección Darwiniana de IPs)
      if (line.startsWith('a=candidate:')) {
        // Ignoramos Server-Reflexive (STUN) y Relay (TURN). ¡Estamos sin internet!
        if (!line.includes('typ host')) continue;
        
        // Ignoramos TCP. En la plaza del pueblo, todo es UDP de baja latencia.
        if (!line.toLowerCase().includes(' udp ')) continue;

        // Extracción de IP: a=candidate:foundation comp_id transport priority IP port ...
        const parts = line.split(' ');
        if (parts.length < 5) continue;
        const ip = parts[4];

        // Asesinamos IPv6 (contienen ':') y mDNS (.local) - Agujeros negros en Hotspots
        if (ip.includes(':') || ip.endsWith('.local')) continue;

        // FILTRO DE ÉLITE: Solo permitimos IPv4 de Hotspots Ad-Hoc
        if (privateIpv4Regex.test(ip)) {
          optimizedLines.push(line);
        }
      }
    }

    // Cambiamos \r\n por \n para afeitar bytes. 
    // La compresión Deflate de la Fase 6 hará el resto.
    return optimizedLines.join('\n');
  }

  public static rehydrateSDP(compactSdp: string): string {
    return compactSdp.replace(/\n/g, '\r\n') + '\r\n'; // WebRTC exige estrictamente \r\n al final
  }
}

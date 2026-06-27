export function createPeerConnection(turnConfig = null) {
  const iceServers = [
    { urls: "stun:stun.l.google.com:19302" }
  ];
  
  if (turnConfig) {
    iceServers.push(turnConfig);
  }

  return new RTCPeerConnection({ iceServers });
}

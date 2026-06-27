const peers = new Set();

export function addPeer(peer) {
  peers.add(peer);
}

export function gossip(message) {
  const list = Array.from(peers);

  // Seleccionamos 3 peers al azar para propagar la onda
  const randomPeers = list.sort(() => 0.5 - Math.random()).slice(0, 3);

  randomPeers.forEach(p => {
    if(p.send) p.send(message);
  });
}

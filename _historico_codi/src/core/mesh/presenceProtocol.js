const presence = new Map();

export function updatePresence(nodeId) {
  presence.set(nodeId, Date.now());
}

export function getActiveNodes() {
  const now = Date.now();

  return [...presence.entries()]
     
    .filter(([_, t]) => now - t < 15000)
    .map(([id]) => id);
}

const rateMap = new Map();

export function canSend(userId) {
  const now = Date.now();
  const window = 60000;

  if (!rateMap.has(userId)) {
    rateMap.set(userId, []);
  }

  const timestamps = rateMap.get(userId).filter(t => now - t < window);

  if (timestamps.length > 30) return false;

  timestamps.push(now);
  rateMap.set(userId, timestamps);

  return true;
}

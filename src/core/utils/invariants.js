export function invariant(condition, message) {
  if (!condition) {
    console.error(`🛑 [ARCH SHIELD INVARIANT FAILED]: ${message}`);
    // In production, we might just log, but in dev we throw.
    if (import.meta.env.DEV) {
      throw new Error(`[ARCH SHIELD INVARIANT FAILED]: ${message}`);
    }
  }
}
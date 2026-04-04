export function reconcile(local, remote) {
  const merged = { ...local };

  for (const key in remote) {
    if (!local[key] || remote[key].updatedAt > local[key].updatedAt) {
      merged[key] = remote[key];
    }
  }

  return merged;
}

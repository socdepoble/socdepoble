const MAX_PACTS = 1000

export async function enforceMemoryLimit(db) {
  const all = await db.getAll('pacts')

  if (all.length <= MAX_PACTS) return

  const sorted = all.sort((a, b) => a.updatedAt - b.updatedAt)

  const toDelete = sorted.slice(0, all.length - MAX_PACTS)

  for (let pact of toDelete) {
    await db.delete('pacts', pact.id)
  }
}

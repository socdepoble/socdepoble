// _scripts/conflict-resolver-ui.js
// Resolució manual de conflictes concurrents per Vector CRDT (Sóc de Poble)

class ConflictResolver {
  constructor(containerId = 'conflict-resolver') {
    this.container = document.getElementById(containerId) || this.createContainer();
  }

  createContainer() {
    const div = document.createElement('div');
    div.id = 'conflict-resolver';
    div.style.cssText = 'position:fixed; top:20px; right:20px; background:white; border:2px solid #e74c3c; padding:20px; max-width:500px; z-index:10000; display:none; box-shadow:0 4px 12px rgba(0,0,0,0.3); border-radius:8px;';
    document.body.appendChild(div);
    return div;
  }

  async resolveConflicts(conflicts) {
    return new Promise((resolve) => {
      if (conflicts.length === 0) {
        resolve([]);
        return;
      }

      let html = `<h3>⚠️ Conflictes concurrents detectats (${conflicts.length})</h3>`;
      conflicts.forEach((c, i) => {
        html += `
          <div style="margin:15px 0; padding:10px; border:1px solid #ddd;">
            <strong>Clau:</strong> ${c.key}<br>
            <strong>Versió Local:</strong> ${JSON.stringify(c.local.value)}<br>
            <strong>Versió Remota:</strong> ${JSON.stringify(c.remote.value)}<br>
            <button onclick="window.resolveChoice(${i}, 'local')">✅ Mantindre Local</button>
            <button onclick="window.resolveChoice(${i}, 'remote')">🌍 Mantindre Remota</button>
            <button onclick="window.resolveChoice(${i}, 'merge')">🔀 Fusionar Manual</button>
          </div>`;
      });

      this.container.innerHTML = html + `<button onclick="window.resolveAll()">Tancar i ignorar</button>`;
      this.container.style.display = 'block';

      window.resolveChoice = (index, choice) => {
        conflicts[index].resolution = choice;
        if (choice === 'merge') {
          const merged = prompt('Fusiona manualment (JSON):', JSON.stringify({...conflicts[index].local.value, ...conflicts[index].remote.value}));
          if (merged) conflicts[index].mergedValue = JSON.parse(merged);
        }
        this.container.style.display = 'none';
        resolve(conflicts);
      };

      window.resolveAll = () => {
        this.container.style.display = 'none';
        resolve(conflicts);
      };
    });
  }

  // Integració amb VectorCRDTStore
  async applyResolved(store, resolvedConflicts) {
    for (const c of resolvedConflicts) {
      if (c.resolution === 'local') continue;
      if (c.resolution === 'remote') {
        await store._put(c.remote);
      } else if (c.resolution === 'merge') {
        await store._put({...c.remote, value: c.mergedValue || c.remote.value});
      }
    }
  }
}

export { ConflictResolver };

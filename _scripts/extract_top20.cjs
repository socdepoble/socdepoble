const fs = require('fs');
const path = require('path');

const GRAPH_FILE = path.join(process.cwd(), 'graphify-out', 'graph.json');
const OUT_JSON = path.join(process.cwd(), 'top20_useAuth.json');
const OUT_CSV = path.join(process.cwd(), 'top20_useAuth.csv');

function safeReadJSON(file) {
  try {
    const raw = fs.readFileSync(file, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error llegint o parsejant', file, e.message);
    process.exit(1);
  }
}

function normalizeId(x) {
  return (x === null || x === undefined) ? '' : String(x);
}

function main() {
  const graph = safeReadJSON(GRAPH_FILE);

  const nodes = Array.isArray(graph.nodes) ? graph.nodes : [];
  const edges = Array.isArray(graph.edges) ? graph.edges : [];

  const nodeById = new Map();
  nodes.forEach(n => {
    const id = normalizeId(n.id || n.key || n._id || n.name);
    nodeById.set(id, n);
  });

  let useAuthNodeId = null;
  for (const [id, n] of nodeById.entries()) {
    const label = (n.label || n.name || '').toString();
    if (label === 'useAuth' || id === 'useAuth') { useAuthNodeId = id; break; }
  }
  if (!useAuthNodeId) {
    for (const [id, n] of nodeById.entries()) {
      const label = (n.label || n.name || '').toString().toLowerCase();
      if (label.includes('useauth') || label.includes('useAuth'.toLowerCase())) { useAuthNodeId = id; break; }
    }
  }

  const incomingCount = new Map();
  const textualCount = new Map();

  for (const id of nodeById.keys()) {
    incomingCount.set(id, 0);
    textualCount.set(id, 0);
  }

  if (useAuthNodeId) {
    for (const e of edges) {
      const src = normalizeId(e.source || e.from || e.u);
      const tgt = normalizeId(e.target || e.to || e.v);
      if (tgt === useAuthNodeId) {
        incomingCount.set(src, (incomingCount.get(src) || 0) + 1);
      }
      const srcNode = nodeById.get(src);
      if (srcNode) {
        const label = (srcNode.label || srcNode.name || '').toString().toLowerCase();
        if (label.includes('useauth') || label.includes('auth')) {
          textualCount.set(src, (textualCount.get(src) || 0) + 1);
        }
      }
    }
  } else {
    const authNodeIds = [];
    for (const [id, n] of nodeById.entries()) {
      const label = (n.label || n.name || '').toString().toLowerCase();
      if (label.includes('auth')) authNodeIds.push(id);
    }
    for (const e of edges) {
      const src = normalizeId(e.source || e.from || e.u);
      const tgt = normalizeId(e.target || e.to || e.v);
      if (authNodeIds.includes(tgt)) {
        incomingCount.set(src, (incomingCount.get(src) || 0) + 1);
      }
    }
    for (const [id, n] of nodeById.entries()) {
      const label = (n.label || n.name || '').toString().toLowerCase();
      if (label.includes('useauth')) textualCount.set(id, (textualCount.get(id) || 0) + 1);
    }
  }

  const scores = [];
  for (const [id, n] of nodeById.entries()) {
    const inc = incomingCount.get(id) || 0;
    const txt = textualCount.get(id) || 0;
    const degreeOut = edges.filter(e => normalizeId(e.source || e.from || e.u) === id).length;
    const degreeIn = edges.filter(e => normalizeId(e.target || e.to || e.v) === id).length;
    const score = inc * 10 + txt * 2 + degreeOut * 0.1 + degreeIn * 0.05;
    scores.push({
      id,
      label: (n.label || n.name || '').toString(),
      incomingToUseAuth: inc,
      textualRefs: txt,
      degreeOut,
      degreeIn,
      score
    });
  }

  scores.sort((a, b) => b.score - a.score);
  const top20 = scores.slice(0, 20);

  fs.writeFileSync(OUT_JSON, JSON.stringify({ generatedAt: new Date().toISOString(), useAuthNodeId, top20 }, null, 2), 'utf8');

  console.log('Top 20 generat:', OUT_JSON);
}

main();

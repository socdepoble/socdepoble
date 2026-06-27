const fs = require('fs');

try {
  const data = JSON.parse(fs.readFileSync('graphify-out/graph.json', 'utf8'));
  const nodes = data.nodes || [];
  const edges = data.edges || [];
  
  const inDegree = {};
  const outDegree = {};
  
  edges.forEach(e => {
    inDegree[e.target] = (inDegree[e.target] || 0) + 1;
    outDegree[e.source] = (outDegree[e.source] || 0) + 1;
  });
  
  const enrichedNodes = nodes.map(n => ({
    id: n.id,
    label: n.label || n.id,
    inDegree: inDegree[n.id] || 0,
    outDegree: outDegree[n.id] || 0
  }));
  
  enrichedNodes.sort((a, b) => b.inDegree - a.inDegree);
  
  console.log("TOP 20 BOTTLENECKS (Most incoming dependencies):");
  enrichedNodes.slice(0, 20).forEach((n, i) => {
    console.log(`${i+1}. ${n.label} (ID: ${n.id}) - Incoming: ${n.inDegree}`);
  });
  
} catch (err) {
  console.error("Error analyzing graph:", err.message);
}

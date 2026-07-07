#!/usr/bin/env node
const fs = require('fs').promises;
const path = require('path');

// ═══════════════════════════════════════════════════════════
// LOADER
// ═══════════════════════════════════════════════════════════
async function loadDocuments(wikiRoot) {
  const documentsPath = path.join(wikiRoot, '_build', 'documents.json');
  try {
    const content = await fs.readFile(documentsPath, 'utf8');
    return JSON.parse(content);
  } catch (err) {
    console.error(`❌ No es troba documents.json. Executa primer build_index.js`);
    process.exit(2);
  }
}

// ═══════════════════════════════════════════════════════════
// CONSTRUCTOR DEL GRAF
// ═══════════════════════════════════════════════════════════
function buildGraph(documents) {
  const nodes = new Map();
  const edges = {
    depends_on: new Map(),
    used_by: new Map(),
    replaces: new Map(),
    replaced_by: new Map(),
    links_to: new Map(),
    linked_from: new Map()
  };
  
  const byID = new Map();
  const byFilename = new Map();
  const byTitle = new Map();
  
  for (const doc of documents) {
    nodes.set(doc.id, doc);
    byID.set(doc.id, doc);
    byFilename.set(doc.filename.replace(/\.md$/, '').toLowerCase(), doc.id);
    if (doc.title) {
      byTitle.set(String(doc.title).toLowerCase(), doc.id);
    }
    
    for (const edgeType of Object.keys(edges)) {
      edges[edgeType].set(doc.id, []);
    }
  }
  
  const errors = [];
  const warnings = [];
  
  const resolveID = (ref, fromDoc) => {
    if (!ref) return null;
    const normalized = ref.toLowerCase().replace(/\.md$/, '');
    
    if (byID.has(normalized)) return normalized;
    if (byID.has(ref)) return ref;
    if (byFilename.has(normalized)) return byFilename.get(normalized);
    if (byTitle.has(normalized)) return byTitle.get(normalized);
    
    errors.push(`Referència trencada: "${ref}" en ${fromDoc.id}`);
    return null;
  };
  
  for (const doc of documents) {
    for (const dep of doc.depends_on || []) {
      const depID = resolveID(dep, doc);
      if (depID) {
        edges.depends_on.get(doc.id).push(depID);
        edges.used_by.get(depID).push(doc.id);
      }
    }
    
    for (const user of doc.used_by || []) {
      const userID = resolveID(user, doc);
      if (userID) {
        edges.used_by.get(doc.id).push(userID);
        edges.depends_on.get(userID).push(doc.id);
      }
    }
    
    for (const replaced of doc.replaces || []) {
      const replacedID = resolveID(replaced, doc);
      if (replacedID) {
        edges.replaces.get(doc.id).push(replacedID);
        edges.replaced_by.get(replacedID).push(doc.id);
      }
    }
    
    for (const link of doc.links || []) {
      const linkID = resolveID(link, doc);
      if (linkID) {
        edges.links_to.get(doc.id).push(linkID);
        edges.linked_from.get(linkID).push(doc.id);
      }
    }
    
    if (doc.redirect) {
      const redirectID = resolveID(doc.redirect, doc);
      if (!redirectID) {
        errors.push(`Redirect trencat en ${doc.id}: "${doc.redirect}"`);
      }
    }
  }
  
  return { nodes, edges, byID, errors, warnings };
}

// ═══════════════════════════════════════════════════════════
// DETECTOR DE CICLES (DFS)
// ═══════════════════════════════════════════════════════════
function detectCycles(graph) {
  const cycles = [];
  const visited = new Set();
  const recursionStack = new Set();
  const path = [];
  
  function dfs(nodeID) {
    visited.add(nodeID);
    recursionStack.add(nodeID);
    path.push(nodeID);
    
    for (const neighbor of graph.edges.depends_on.get(nodeID) || []) {
      if (!visited.has(neighbor)) {
        const cycle = dfs(neighbor);
        if (cycle) return cycle;
      } else if (recursionStack.has(neighbor)) {
        const cycleStart = path.indexOf(neighbor);
        cycles.push(path.slice(cycleStart).concat(neighbor));
      }
    }
    
    path.pop();
    recursionStack.delete(nodeID);
    return null;
  }
  
  for (const nodeID of graph.nodes.keys()) {
    if (!visited.has(nodeID)) {
      dfs(nodeID);
    }
  }
  
  return cycles;
}

// ═══════════════════════════════════════════════════════════
// DETECTOR D'ORFES
// ═══════════════════════════════════════════════════════════
function detectOrphans(graph) {
  const orphans = [];
  
  for (const [id, doc] of graph.nodes) {
    const hasInbound = 
      (graph.edges.used_by.get(id)?.length || 0) +
      (graph.edges.linked_from.get(id)?.length || 0) +
      (graph.edges.replaced_by.get(id)?.length || 0) > 0;
    
    const hasOutbound = 
      (graph.edges.depends_on.get(id)?.length || 0) +
      (graph.edges.links_to.get(id)?.length || 0) +
      (graph.edges.replaces.get(id)?.length || 0) > 0;
    
    const isRoot = ['bios', 'identitat', 'genotip', 'eixam', '00_index'].includes(id);
    
    if (!hasInbound && !hasOutbound && !isRoot && doc.status !== 'deprecated') {
      orphans.push({
        id,
        pilar: doc.pilar,
        title: doc.title
      });
    }
  }
  
  return orphans;
}

// ═══════════════════════════════════════════════════════════
// IMPACT MAP
// ═══════════════════════════════════════════════════════════
function computeImpactMap(graph) {
  const impactMap = new Map();
  
  for (const startID of graph.nodes.keys()) {
    const affected = new Set();
    const queue = [startID];
    const visited = new Set([startID]);
    
    while (queue.length > 0) {
      const current = queue.shift();
      
      for (const dependent of graph.edges.used_by.get(current) || []) {
        if (!visited.has(dependent)) {
          visited.add(dependent);
          affected.add(dependent);
          queue.push(dependent);
        }
      }
      
      for (const linker of graph.edges.linked_from.get(current) || []) {
        if (!visited.has(linker)) {
          visited.add(linker);
          affected.add(linker);
        }
      }
    }
    
    impactMap.set(startID, Array.from(affected));
  }
  
  return impactMap;
}

// ═══════════════════════════════════════════════════════════
// ÍNDEXS INVERSOS
// ═══════════════════════════════════════════════════════════
function buildInverseIndexes(graph) {
  const by_tag = {};
  const by_pilar = {};
  const by_status = {};
  const by_authority = {};
  
  for (const [id, doc] of graph.nodes) {
    if (!by_pilar[doc.pilar]) by_pilar[doc.pilar] = [];
    by_pilar[doc.pilar].push(id);
    
    if (!by_status[doc.status]) by_status[doc.status] = [];
    by_status[doc.status].push(id);
    
    for (const tag of doc.tags || []) {
      if (!by_tag[tag]) by_tag[tag] = [];
      by_tag[tag].push(id);
    }
    
    if (doc.authority) {
      if (!by_authority[doc.authority]) by_authority[doc.authority] = [];
      by_authority[doc.authority].push(id);
    }
  }
  
  return { by_tag, by_pilar, by_status, by_authority };
}

// ═══════════════════════════════════════════════════════════
// GENERADOR DE knowledge.json
// ═══════════════════════════════════════════════════════════
function buildKnowledgeBundle(graph, impactMap, indexes, manifest) {
  const nodes = {};
  for (const [id, doc] of graph.nodes) {
    nodes[id] = {
      pilar: doc.pilar,
      title: doc.title,
      summary: doc.summary,
      tags: doc.tags,
      status: doc.status,
      hash: doc.hash,
      size: doc.size,
      path: doc.path
    };
  }
  
  const edges = {};
  for (const id of graph.nodes.keys()) {
    edges[id] = {
      depends_on: graph.edges.depends_on.get(id) || [],
      used_by: graph.edges.used_by.get(id) || [],
      replaces: graph.edges.replaces.get(id) || [],
      replaced_by: graph.edges.replaced_by.get(id) || [],
      links_to: graph.edges.links_to.get(id) || [],
      linked_from: graph.edges.linked_from.get(id) || []
    };
  }
  
  const impact = {};
  for (const [id, affected] of impactMap) {
    impact[id] = affected;
  }
  
  return {
    _meta: {
      compiler_version: '1.0.0',
      build_time: manifest.build_time,
      global_hash: manifest.global_hash,
      total_documents: manifest.total_documents
    },
    nodes,
    edges,
    indexes,
    impact
  };
}

// ═══════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════
async function main() {
  const args = process.argv.slice(2);
  const wikiArg = args.find(a => a.startsWith('--wiki='));
  const wikiRoot = wikiArg ? wikiArg.split('=')[1] : path.resolve(__dirname, '../../');
  const buildDir = path.join(wikiRoot, '_build');
  
  console.log(`🕸️  COMPILADOR D'ONTOLOGIA`);
  console.log(`📂 Wiki: ${wikiRoot}\n`);
  
  const documents = await loadDocuments(wikiRoot);
  console.log(`✓ ${documents.length} documents carregats`);
  
  let manifest;
  try {
    const content = await fs.readFile(path.join(buildDir, 'manifest.json'), 'utf8');
    manifest = JSON.parse(content);
  } catch {
    console.error('❌ No es troba manifest.json');
    process.exit(2);
  }
  
  console.log('\n🔨 Construint graf...');
  const graph = buildGraph(documents);
  
  console.log('🔍 Detectant cicles...');
  const cycles = detectCycles(graph);
  
  console.log('🔍 Detectant nodes orfes...');
  const orphans = detectOrphans(graph);
  
  console.log('🔥 Calculant impact map...');
  const impactMap = computeImpactMap(graph);
  
  const indexes = buildInverseIndexes(graph);
  
  console.log('📦 Generant knowledge.json...');
  const knowledge = buildKnowledgeBundle(graph, impactMap, indexes, manifest);
  
  const ontologyPath = path.join(buildDir, 'ontology.json');
  await fs.writeFile(
    ontologyPath,
    JSON.stringify({
      nodes: Object.fromEntries(graph.nodes),
      edges: {
        depends_on: Object.fromEntries(graph.edges.depends_on),
        used_by: Object.fromEntries(graph.edges.used_by),
        replaces: Object.fromEntries(graph.edges.replaces),
        links_to: Object.fromEntries(graph.edges.links_to)
      },
      cycles,
      orphans,
      errors: graph.errors
    }, null, 2),
    'utf8'
  );
  
  const knowledgePath = path.join(buildDir, 'knowledge.json');
  await fs.writeFile(knowledgePath, JSON.stringify(knowledge), 'utf8');
  
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('📊 REPORT D\'ONTOLOGIA');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`Nodes: ${graph.nodes.size}`);
  console.log(`Arestes (depends_on): ${Array.from(graph.edges.depends_on.values()).reduce((a, b) => a + b.length, 0)}`);
  console.log(`Arestes (links_to): ${Array.from(graph.edges.links_to.values()).reduce((a, b) => a + b.length, 0)}`);
  console.log(`Índexs per tag: ${Object.keys(indexes.by_tag).length}`);
  
  if (cycles.length > 0) {
    console.log(`\n❌ CICLES DETECTATS (${cycles.length}):`);
    cycles.slice(0, 5).forEach(c => console.log(`  • ${c.join(' → ')}`));
  }
  
  if (orphans.length > 0) {
    console.log(`\n⚠️  NODES ORFES (${orphans.length}):`);
    orphans.slice(0, 10).forEach(o => 
      console.log(`  • ${o.id} (${o.pilar}) — ${o.title || '(sense títol)'}`)
    );
  }
  
  if (graph.errors.length > 0) {
    console.log(`\n❌ ERRORS (${graph.errors.length}):`);
    graph.errors.slice(0, 10).forEach(e => console.log(`  • ${e}`));
  }
  
  const impactStats = Array.from(impactMap.values()).map(arr => arr.length);
  const avgImpact = impactStats.length ? (impactStats.reduce((a, b) => a + b, 0) / impactStats.length) : 0;
  const maxImpact = impactStats.length ? Math.max(...impactStats) : 0;
  
  console.log(`\n📈 Impact Map:`);
  console.log(`  Impacte mitjà: ${avgImpact.toFixed(1)} nodes`);
  console.log(`  Impacte màxim: ${maxImpact} nodes`);
  
  console.log(`\n✅ Build completada:`);
  console.log(`   • ${ontologyPath}`);
  console.log(`   • ${knowledgePath}`);
  
  const hasErrors = cycles.length > 0;
  const hasWarnings = orphans.length > 0 || graph.errors.length > 0;
  
  if (hasErrors) process.exit(2);
  if (hasWarnings) process.exit(1);
  process.exit(0);
}

main().catch(err => {
  console.error(`❌ Error fatal: ${err.message}`);
  process.exit(2);
});

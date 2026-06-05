// scripts/generate_report_d3.js
// Node 18+
// Genera tests/report_d3.html amb D3 visualitzacions
import fs from 'fs';
import path from 'path';

const OUT = path.resolve('tests/report_d3.html');
const DUMPS_DIR = path.resolve('tests');
const LOG_FILE = path.resolve('tests/network_orchestrator.log');

function safeRead(file) {
  try { return fs.readFileSync(file,'utf8'); } catch(e){ return null; }
}

function loadDumps() {
  const files = fs.readdirSync(DUMPS_DIR).filter(f => f.startsWith('dump_') && f.endsWith('.json'));
  const dumps = {};
  for (const f of files) {
    try {
      const j = JSON.parse(fs.readFileSync(path.join(DUMPS_DIR,f),'utf8'));
      dumps[f] = j;
    } catch(e) {
      dumps[f] = { error: String(e) };
    }
  }
  return dumps;
}

function summarizePosts(dumps) {
  const map = new Map();
  for (const [file, dump] of Object.entries(dumps)) {
    const node = file.replace('dump_','').replace('.json','');
    if (!dump || !dump.posts) continue;
    for (const p of dump.posts) {
      const id = p.id || ('no-id-'+Math.random().toString(36).slice(2,6));
      if (!map.has(id)) map.set(id, {id, nodes:{}, contents:{}, hashes:new Set(), last_modified: {}});
      const entry = map.get(id);
      entry.nodes[node] = p.hash || null;
      entry.contents[node] = p.content || {};
      if (p.hash) entry.hashes.add(p.hash);
      entry.last_modified[node] = p.last_modified || null;
    }
  }
  return Array.from(map.values());
}

function detectConflicts(summary) {
  return summary.filter(s => {
    const nonNull = Array.from(s.hashes).filter(h => h !== null && h !== undefined);
    return new Set(nonNull).size > 1;
  });
}

function nodeCounts(summary) {
  const counts = {};
  for (const s of summary) {
    for (const node of Object.keys(s.nodes)) {
      counts[node] = (counts[node]||0) + 1;
    }
  }
  return counts;
}

function buildHtml(dumps, summary, conflicts, logText) {
  const nodes = Object.keys(dumps).map(f => f.replace('dump_','').replace('.json',''));
  const counts = nodeCounts(summary);
  const totalPosts = summary.length;
  const totalConflicts = conflicts.length;
  const now = new Date().toISOString();

  // HTML amb D3 via CDN
  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>Informe D3 Masía</title>
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <style>
    body{font-family:system-ui,Segoe UI,Roboto,Arial;margin:18px;color:#222}
    h1{font-size:20px;margin-bottom:6px}
    .meta{color:#666;font-size:13px;margin-bottom:12px}
    .chart{display:flex;gap:24px;flex-wrap:wrap}
    .panel{background:#fff;border:1px solid #e6e6e6;padding:12px;border-radius:8px;box-shadow:0 1px 2px rgba(0,0,0,0.03)}
    svg{font-family:inherit}
    table{border-collapse:collapse;width:100%;margin-top:8px}
    th,td{border:1px solid #e6e6e6;padding:8px;text-align:left;font-size:13px}
    th{background:#f7f7f7}
    pre.log{background:#0f1720;color:#e6eef8;padding:10px;border-radius:6px;max-height:240px;overflow:auto}
    .small{font-size:12px;color:#555}
    .conflict{background:#fff6f6;border-left:4px solid #d9534f}
  </style>
  <script src="https://d3js.org/d3.v7.min.js"></script>
</head>
<body>
  <h1>Informe D3 de reconciliació multi-node</h1>
  <div class="meta">Generat: ${now} · Nodes: ${nodes.length} · Conflictes: ${totalConflicts}</div>

  <div class="chart">
    <div class="panel" id="panel-summary" style="flex:1 1 420px">
      <h2>Resum per node</h2>
      <div id="bar-chart"></div>
    </div>

    <div class="panel" id="panel-conflicts" style="flex:1 1 420px">
      <h2>Conflictes</h2>
      <div id="conflict-list"></div>
    </div>

    <div class="panel" id="panel-timeline" style="flex:1 1 100%">
      <h2>Timeline simplificat</h2>
      <div id="timeline"></div>
    </div>
  </div>

  <div class="panel" style="margin-top:12px">
    <h2>Detalls per node</h2>
    <div id="node-details"></div>
  </div>

  <div class="panel" style="margin-top:12px">
    <h2>Logs de l'orquestrador</h2>
    <pre class="log" id="log-area">${(logText||'No log disponible').replace(/</g,'&lt;')}</pre>
  </div>

  <script>
    const dumps = ${JSON.stringify(dumps)};
    const summary = ${JSON.stringify(summary)};
    const conflicts = ${JSON.stringify(conflicts)};
    const nodes = ${JSON.stringify(nodes)};

    // Bar chart per node
    (function(){
      const counts = nodes.map(n => ({node:n, count: (summary.filter(s => s.nodes[n]).length)}));
      const width = 420, height = 240, margin = {top:20,right:20,bottom:40,left:60};
      const svg = d3.select('#bar-chart').append('svg').attr('width',width).attr('height',height);
      const x = d3.scaleBand().domain(counts.map(d=>d.node)).range([margin.left, width-margin.right]).padding(0.2);
      const y = d3.scaleLinear().domain([0, d3.max(counts,d=>d.count)||1]).nice().range([height-margin.bottom, margin.top]);
      svg.append('g').selectAll('rect').data(counts).join('rect')
        .attr('x', d=>x(d.node)).attr('y', d=>y(d.count)).attr('height', d=>y(0)-y(d.count)).attr('width', x.bandwidth())
        .attr('fill','#2b7cff');
      svg.append('g').attr('transform',\`translate(0,\${height-margin.bottom})\`).call(d3.axisBottom(x));
      svg.append('g').attr('transform',\`translate(\${margin.left},0)\`).call(d3.axisLeft(y));
      svg.append('text').attr('x',width/2).attr('y',height-4).attr('text-anchor','middle').attr('class','small').text('Posts per node');
    })();

    // Conflict list
    (function(){
      const container = d3.select('#conflict-list');
      if (!conflicts.length) {
        container.append('div').attr('class','small').text('No s’han detectat conflictes.');
        return;
      }
      const table = container.append('table');
      table.append('thead').html('<tr><th>Post ID</th><th>Hashes per node</th><th>Mostra contingut</th></tr>');
      const tbody = table.append('tbody');
      conflicts.forEach(c => {
        const nodeList = Object.entries(c.nodes).map(([n,h]) => \`\${n}: \${h||'null'}\`).join('\\n');
        const sample = JSON.stringify(c.contents, null, 2).slice(0,800);
        tbody.append('tr').html(\`<td>\${c.id}</td><td><pre class="small">\${nodeList.replace(/</g,'&lt;')}</pre></td><td><pre class="small">\${sample.replace(/</g,'&lt;')}</pre></td>\`);
      });
    })();

    // Timeline simplificat per last_modified
    (function(){
      const events = [];
      summary.forEach(s => {
        for (const [node, lm] of Object.entries(s.last_modified||{})) {
          if (lm) events.push({id:s.id, node, time: new Date(lm)});
        }
      });
      events.sort((a,b)=>a.time-b.time);
      const width = 900, height = 120, margin = {left:40,right:20,top:10,bottom:20};
      const svg = d3.select('#timeline').append('svg').attr('width',width).attr('height',height);
      if (!events.length) {
        svg.append('text').attr('x',20).attr('y',20).text('No hi ha timestamps disponibles');
        return;
      }
      const x = d3.scaleTime().domain(d3.extent(events,d=>d.time)).range([margin.left, width-margin.right]);
      svg.append('g').attr('transform',\`translate(0,\${height-margin.bottom})\`).call(d3.axisBottom(x));
      svg.selectAll('circle').data(events).join('circle')
        .attr('cx', d=>x(d.time)).attr('cy', height/2).attr('r',4)
        .attr('fill', d=>d3.schemeCategory10[nodes.indexOf(d.node) % 10])
        .append('title').text(d=>\`\${d.node} \\n\${d.time.toISOString()} \\npost:\${d.id}\`);
    })();

    // Node details
    (function(){
      const container = d3.select('#node-details');
      nodes.forEach(n => {
        const key = 'dump_' + n + '.json';
        const dump = dumps[key];
        const panel = container.append('div').attr('class','panel').style('margin-bottom','8px');
        panel.append('h3').text(n);
        if (!dump) { panel.append('div').attr('class','small').text('No dump'); return; }
        if (dump.error) { panel.append('div').attr('class','small').text('Error: ' + dump.error); return; }
        const ul = panel.append('ul').attr('class','small');
        (dump.posts||[]).forEach(p => {
          ul.append('li').html('<strong>'+ (p.id||'no-id') +'</strong> - ' + (p.content?.title||'') + ' <span class="small">(' + (p.hash||'no-hash') + ')</span>');
        });
      });
    })();

  </script>
</body>
</html>`;
}

function main() {
  const dumps = loadDumps();
  const summary = summarizePosts(dumps);
  const conflicts = detectConflicts(summary);
  const logText = safeRead(LOG_FILE) || '';
  const html = buildHtml(dumps, summary, conflicts, logText);
  fs.writeFileSync(OUT, html, 'utf8');
  console.log('Informe D3 generat a', OUT, 'posts:', summary.length, 'conflictes:', conflicts.length);
}

main();

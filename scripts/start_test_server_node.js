// scripts/start_test_server_node.js
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const NODE_ID = process.env.NODE_ID || 'node-local';
const DATA_DIR = process.env.DATA_DIR || `/data/${NODE_ID}`;
const PORT = parseInt(process.env.PORT || '8081', 10);

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, {recursive: true});

const POSTS_FILE = path.join(DATA_DIR, 'posts.json');
const OPS_FILE = path.join(DATA_DIR, 'ops.json');

function readJson(file, defaultVal) {
  try {
    if (!fs.existsSync(file)) return defaultVal;
    return JSON.parse(fs.readFileSync(file,'utf8'));
  } catch (e) {
    console.error('Error llegint', file, e);
    return defaultVal;
  }
}
function writeJson(file, obj) {
  fs.writeFileSync(file, JSON.stringify(obj, null, 2), 'utf8');
}

let posts = readJson(POSTS_FILE, []);
let ops = readJson(OPS_FILE, []);

const app = express();
app.use(bodyParser.json({limit:'20mb'}));

app.get('/health', (req, res) => res.json({status:'ok', node: NODE_ID}));

app.get('/dump', (req, res) => {
  res.json({node: NODE_ID, posts, ops});
});

app.post('/sync/ops', (req, res) => {
  const incoming = req.body.ops || [];
  const results = incoming.map(op => {
    // Idempotent apply: if op_id exists in ops, ignore
    if (ops.find(o => o.op_id === op.op_id)) {
      return {op_id: op.op_id, status: 'ignored', reason: 'already_applied'};
    }
    // Simular aplicació: afegir o actualitzar posts segons op.type
    if (op.type === 'create') {
      const canonical = {
        id: op.target_id || `post-${Math.random().toString(36).slice(2,8)}`,
        content: op.payload || {},
        hash: op.payload_hash || 'h_simulated',
        last_modified: new Date().toISOString()
      };
      posts = posts.filter(p => p.id !== canonical.id);
      posts.push(canonical);
      ops.push(op);
      writeJson(POSTS_FILE, posts);
      writeJson(OPS_FILE, ops);
      return {op_id: op.op_id, status: 'applied', hash: canonical.hash, canonical};
    } else if (op.type === 'update') {
      const existing = posts.find(p => p.id === op.target_id);
      const canonical = existing ? {...existing, content: {...existing.content, ...(op.payload || {})}, last_modified: new Date().toISOString()} : {
        id: op.target_id,
        content: op.payload || {},
        hash: op.payload_hash || 'h_simulated',
        last_modified: new Date().toISOString()
      };
      posts = posts.filter(p => p.id !== canonical.id);
      posts.push(canonical);
      ops.push(op);
      writeJson(POSTS_FILE, posts);
      writeJson(OPS_FILE, ops);
      return {op_id: op.op_id, status: 'applied', hash: canonical.hash, canonical};
    } else if (op.type === 'delete') {
      posts = posts.filter(p => p.id !== op.target_id);
      ops.push(op);
      writeJson(POSTS_FILE, posts);
      writeJson(OPS_FILE, ops);
      return {op_id: op.op_id, status: 'applied', hash: null, canonical: null};
    } else {
      ops.push(op);
      writeJson(OPS_FILE, ops);
      return {op_id: op.op_id, status: 'rejected', reason: 'unknown_op'};
    }
  });
  res.json(results);
});

app.listen(PORT, () => {
  console.log(`Test node ${NODE_ID} listening on ${PORT}, data dir ${DATA_DIR}`);
});
